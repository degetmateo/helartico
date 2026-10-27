import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateStaffUseCase } from "../../application/auth/CreateStaffUseCase";
import { UpdateCustomerUseCase } from "../../application/customers/UpdateCustomerUseCase";
import { DeleteStaffUseCase } from "../../application/staff/DeleteStaffUseCase";
import { ListStaffUseCase } from "../../application/staff/ListStaffUseCase";
import { UpdateStaffUseCase } from "../../application/staff/UpdateStaffUseCase";
import { Customer } from "../../domain/entities/Customer";
import { Staff } from "../../domain/entities/Staff";
import { DocumentNumber } from "../../domain/value-objects/DocumentNumber";
import { Email } from "../../domain/value-objects/Email";
import { Points } from "../../domain/value-objects/Points";
import { BcryptPasswordHasher } from "../../infrastructure/security/BcryptPasswordHasher";
import { JwtTokenService } from "../../infrastructure/security/JwtTokenService";
import { StaffController } from "../../presentation/controllers/StaffController";
import { AuthMiddleware } from "../../presentation/middlewares/AuthMiddleware";
import { RoleMiddleware } from "../../presentation/middlewares/RoleMiddleware";
import { createStaffRouter } from "../../presentation/routes/StaffRoutes";
import {
  InMemoryCustomerRepository,
  InMemoryStaffRepository,
} from "../mocks/InMemoryRepositories";

describe("Staff Hierarchy and Permissions (Admin vs Employee)", () => {
  let customerRepo: InMemoryCustomerRepository;
  let staffRepo: InMemoryStaffRepository;

  let createStaffUseCase: CreateStaffUseCase;
  let listStaffUseCase: ListStaffUseCase;
  let updateStaffUseCase: UpdateStaffUseCase;
  let deleteStaffUseCase: DeleteStaffUseCase;
  let updateCustomerUseCase: UpdateCustomerUseCase;

  let app: express.Express;

  let adminToken: string;
  let employeeToken: string;
  let customerToken: string;

  let adminStaff: Staff;
  let employeeStaff: Staff;
  let sampleCustomer: Customer;

  beforeEach(async () => {
    customerRepo = new InMemoryCustomerRepository();
    staffRepo = new InMemoryStaffRepository();

    createStaffUseCase = new CreateStaffUseCase(staffRepo);
    listStaffUseCase = new ListStaffUseCase(staffRepo);
    updateStaffUseCase = new UpdateStaffUseCase(staffRepo);
    deleteStaffUseCase = new DeleteStaffUseCase(staffRepo);
    updateCustomerUseCase = new UpdateCustomerUseCase(customerRepo);

    // 1. Create Admin
    adminStaff = await staffRepo.save(
      new Staff({
        id: "staff_admin_1",
        name: "Jefe Admin",
        email: Email.create("admin@helartico.com").getValue(),
        phone: "11223344",
        documentNumber: DocumentNumber.create("10000001").getValue(),
        passwordHash: await BcryptPasswordHasher.hash("adminPass123"),
        role: "ADMIN",
        isActive: true,
      })
    );

    // 2. Create Employee
    employeeStaff = await staffRepo.save(
      new Staff({
        id: "staff_emp_1",
        name: "Empleado Mostrador",
        email: Email.create("empleado@helartico.com").getValue(),
        phone: "",
        passwordHash: await BcryptPasswordHasher.hash("empPass123"),
        role: "EMPLOYEE",
        isActive: true,
      })
    );

    // 3. Create Customer
    sampleCustomer = await customerRepo.save(
      new Customer({
        id: "cust_1",
        name: "Juan Cliente",
        email: Email.create("juan@gmail.com").getValue(),
        phone: "11998877",
        documentNumber: DocumentNumber.create("30111222").getValue(),
        passwordHash: await BcryptPasswordHasher.hash("oldPassword123"),
        pointsBalance: Points.create(100).getValue(),
        isActive: true,
      })
    );

    // Generate JWTs
    adminToken = JwtTokenService.generateToken({
      userId: adminStaff.id!,
      role: "STAFF",
      staffRole: "ADMIN",
      email: adminStaff.email.value,
    });

    employeeToken = JwtTokenService.generateToken({
      userId: employeeStaff.id!,
      role: "STAFF",
      staffRole: "EMPLOYEE",
      email: employeeStaff.email.value,
    });

    customerToken = JwtTokenService.generateToken({
      userId: sampleCustomer.id!,
      role: "CUSTOMER",
      email: sampleCustomer.email.value,
    });

    // Setup Express App
    app = express();
    app.use(express.json());

    const staffController = new StaffController(
      listStaffUseCase,
      createStaffUseCase,
      updateStaffUseCase,
      deleteStaffUseCase
    );

    app.use("/api/staff", createStaffRouter(staffController));

    // Endpoint for customer profile editing (accessible by STAFF: both Admin and Employee)
    app.put(
      "/api/customers/:id",
      AuthMiddleware.handle,
      RoleMiddleware.requireRole("STAFF"),
      async (req, res) => {
        const result = await updateCustomerUseCase.execute({
          customerId: req.params.id,
          name: req.body.name,
          phone: req.body.phone,
          password: req.body.password,
        });
        if (result.isFailure) {
          res.status(400).json({ success: false, error: result.error });
          return;
        }
        res.json({ success: true, data: result.getValue() });
      }
    );
  });

  describe("Staff Creation Requirements (Optional Phone and DNI)", () => {
    it("should allow creating staff WITHOUT phone and WITHOUT DNI", async () => {
      const res = await createStaffUseCase.execute({
        name: "Nuevo Empleado Sin DNI",
        email: "sindni@helartico.com",
        password: "secretpassword",
        role: "EMPLOYEE",
      });

      expect(res.isSuccess).toBe(true);
      const created = res.getValue();
      expect(created.name).toBe("Nuevo Empleado Sin DNI");
      expect(created.phone).toBe("");
      expect(created.documentNumber).toBeUndefined();
      expect(created.role).toBe("EMPLOYEE");
    });

    it("should allow creating staff WITH phone and DNI", async () => {
      const res = await createStaffUseCase.execute({
        name: "Empleado Con DNI",
        email: "condni@helartico.com",
        phone: "+5491144443333",
        documentNumber: "42111333",
        password: "secretpassword",
        role: "ADMIN",
      });

      expect(res.isSuccess).toBe(true);
      const created = res.getValue();
      expect(created.phone).toBe("+5491144443333");
      expect(created.documentNumber?.value).toBe("42111333");
      expect(created.role).toBe("ADMIN");
    });
  });

  describe("Role Hierarchy & Route Protection (/api/staff)", () => {
    it("should allow ADMIN to list staff members", async () => {
      const res = await request(app)
        .get("/api/staff")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2); // Admin and Employee
    });

    it("should BLOCK EMPLOYEE from listing staff members (403)", async () => {
      const res = await request(app)
        .get("/api/staff")
        .set("Authorization", `Bearer ${employeeToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain("Administrator privileges required");
    });

    it("should BLOCK CUSTOMER from staff routes (403)", async () => {
      const res = await request(app)
        .get("/api/staff")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("should allow ADMIN to create another staff member via POST /api/staff", async () => {
      const res = await request(app)
        .post("/api/staff")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Nuevo Cajero",
          email: "cajero2@helartico.com",
          password: "password123",
          role: "EMPLOYEE",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.staffRole).toBe("EMPLOYEE");
    });

    it("should BLOCK EMPLOYEE from creating staff member via POST /api/staff (403)", async () => {
      const res = await request(app)
        .post("/api/staff")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({
          name: "Intento Empleado",
          email: "intento@helartico.com",
          password: "password123",
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain("Administrator privileges required");
    });

    it("should allow ADMIN to update an employee", async () => {
      const res = await request(app)
        .put(`/api/staff/${employeeStaff.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Empleado Promovido",
          role: "ADMIN",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("Empleado Promovido");
      expect(res.body.data.staffRole).toBe("ADMIN");
    });

    it("should BLOCK ADMIN from deleting their own account", async () => {
      const res = await request(app)
        .delete(`/api/staff/${adminStaff.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain("cannot delete your own administrator account");
    });

    it("should allow ADMIN to delete an employee", async () => {
      const res = await request(app)
        .delete(`/api/staff/${employeeStaff.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const check = await staffRepo.findById(employeeStaff.id!);
      expect(check).toBeNull();
    });
  });

  describe("Customer Password Reset & Modification by Staff", () => {
    it("should allow EMPLOYEE to modify customer profile and reset their password", async () => {
      const res = await request(app)
        .put(`/api/customers/${sampleCustomer.id}`)
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({
          name: "Juan Cliente Actualizado",
          phone: "11002299",
          password: "newCustomerSecret2026",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify customer's new password was hashed and works
      const updatedCustomer = await customerRepo.findById(sampleCustomer.id!);
      expect(updatedCustomer?.name).toBe("Juan Cliente Actualizado");
      const passwordMatches = await BcryptPasswordHasher.compare(
        "newCustomerSecret2026",
        updatedCustomer!.passwordHash
      );
      expect(passwordMatches).toBe(true);
    });

    it("should allow ADMIN to modify customer profile and reset password", async () => {
      const res = await request(app)
        .put(`/api/customers/${sampleCustomer.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Juan Por Admin",
          password: "adminResetPassword123",
        });

      expect(res.status).toBe(200);
      const updatedCustomer = await customerRepo.findById(sampleCustomer.id!);
      const matches = await BcryptPasswordHasher.compare(
        "adminResetPassword123",
        updatedCustomer!.passwordHash
      );
      expect(matches).toBe(true);
    });
  });
});
