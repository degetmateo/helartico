import { beforeEach, describe, expect, it } from "vitest";
import { ListAuditLogsUseCase } from "../../application/audit/ListAuditLogsUseCase";
import { AddPointsUseCase } from "../../application/customers/AddPointsUseCase";
import { SetCustomerPointsUseCase } from "../../application/customers/SetCustomerPointsUseCase";
import { RedeemProductUseCase } from "../../application/redemptions/RedeemProductUseCase";
import { ValidateCodeUseCase } from "../../application/redemptions/ValidateCodeUseCase";
import { Customer } from "../../domain/entities/Customer";
import { Product } from "../../domain/entities/Product";
import { RedemptionCode } from "../../domain/entities/RedemptionCode";
import { DocumentNumber } from "../../domain/value-objects/DocumentNumber";
import { Email } from "../../domain/value-objects/Email";
import { Points } from "../../domain/value-objects/Points";
import { RedemptionToken } from "../../domain/value-objects/RedemptionToken";
import { AuditLogService } from "../../infrastructure/services/AuditLogService";
import {
  InMemoryAuditLogRepository,
  InMemoryCustomerRepository,
  InMemoryProductRepository,
  InMemoryRedemptionCodeRepository,
  InMemoryTransactionRepository,
} from "../mocks/InMemoryRepositories";

describe("Audit Logging System Use Cases", () => {
  let auditLogRepo: InMemoryAuditLogRepository;
  let auditLogService: AuditLogService;
  let listAuditLogsUseCase: ListAuditLogsUseCase;

  let customerRepo: InMemoryCustomerRepository;
  let productRepo: InMemoryProductRepository;
  let redemptionRepo: InMemoryRedemptionCodeRepository;
  let transactionRepo: InMemoryTransactionRepository;

  beforeEach(async () => {
    auditLogRepo = new InMemoryAuditLogRepository();
    auditLogService = new AuditLogService(auditLogRepo);
    listAuditLogsUseCase = new ListAuditLogsUseCase(auditLogRepo);

    customerRepo = new InMemoryCustomerRepository();
    productRepo = new InMemoryProductRepository();
    redemptionRepo = new InMemoryRedemptionCodeRepository();
    transactionRepo = new InMemoryTransactionRepository();

    // Create a sample customer
    await customerRepo.save(
      new Customer({
        id: "cust_1",
        name: "Carlos Gomez",
        email: Email.create("carlos@helartico.com").getValue(),
        documentNumber: DocumentNumber.create("30123456").getValue(),
        passwordHash: "hash123",
        pointsBalance: Points.create(100).getValue(),
        isActive: true,
      })
    );

    // Create a sample product
    await productRepo.save(
      new Product({
        id: "prod_1",
        name: "Cucurucho Especial",
        imageUrl: "https://example.com/cucurucho.jpg",
        pointsRequired: Points.create(50).getValue(),
        isActive: true,
      })
    );
  });

  describe("AuditLogService & ListAuditLogsUseCase", () => {
    it("should log actions and retrieve them paginated", async () => {
      await auditLogService.log({
        action: "TEST_ACTION",
        category: "AUTH",
        actorName: "Administrador General",
        actorRole: "ADMIN",
        description: "Prueba de inicio de sesión",
      });

      const result = await listAuditLogsUseCase.execute({ page: 1, limit: 10 });

      expect(result.total).toBe(1);
      expect(result.items[0].action).toBe("TEST_ACTION");
      expect(result.items[0].actorRole).toBe("ADMIN");
      expect(result.items[0].description).toBe("Prueba de inicio de sesión");
    });

    it("should filter logs by category, action, and search term", async () => {
      await auditLogService.log({
        action: "POINTS_ADD",
        category: "POINTS",
        actorName: "Empleado Juan",
        actorRole: "EMPLOYEE",
        targetName: "Carlos Gomez",
        description: "Empleado Juan sumó 50 puntos a Carlos Gomez",
      });

      await auditLogService.log({
        action: "PRODUCT_CREATE",
        category: "PRODUCT",
        actorName: "Admin Roberto",
        actorRole: "ADMIN",
        targetName: "Helado Pistacho",
        description: "Admin creó producto Helado Pistacho",
      });

      await auditLogService.log({
        action: "AUTH_LOGIN",
        category: "AUTH",
        actorName: "Carlos Gomez",
        actorRole: "CUSTOMER",
        description: "Inicio de sesión de Carlos Gomez",
      });

      // Filter by category
      const pointsOnly = await listAuditLogsUseCase.execute({ category: "POINTS" });
      expect(pointsOnly.total).toBe(1);
      expect(pointsOnly.items[0].action).toBe("POINTS_ADD");

      // Filter by action
      const productCreateOnly = await listAuditLogsUseCase.execute({ action: "PRODUCT_CREATE" });
      expect(productCreateOnly.total).toBe(1);
      expect(productCreateOnly.items[0].targetName).toBe("Helado Pistacho");

      // Search term
      const searchPistacho = await listAuditLogsUseCase.execute({ searchTerm: "Pistacho" });
      expect(searchPistacho.total).toBe(1);
      expect(searchPistacho.items[0].action).toBe("PRODUCT_CREATE");

      const searchCarlos = await listAuditLogsUseCase.execute({ searchTerm: "Carlos" });
      expect(searchCarlos.total).toBe(2);
    });
  });

  describe("Domain Operations Audit Logging", () => {
    it("should record log when adding points to customer", async () => {
      const addPointsUseCase = new AddPointsUseCase(
        customerRepo,
        transactionRepo,
        auditLogService
      );

      const res = await addPointsUseCase.execute({
        customerId: "cust_1",
        pointsToAdd: 40,
        staffId: "staff_1",
        staffName: "Mariana Lopez",
        staffRole: "EMPLOYEE",
        note: "Compra en sucursal",
      });

      expect(res.isSuccess).toBe(true);

      const logs = await listAuditLogsUseCase.execute({ category: "POINTS" });
      expect(logs.total).toBe(1);
      const log = logs.items[0];
      expect(log.action).toBe("POINTS_ADD");
      expect(log.actorName).toBe("Mariana Lopez");
      expect(log.targetName).toBe("Carlos Gomez");
      expect(log.details?.pointsAdded).toBe(40);
      expect(log.details?.newBalance).toBe(140);
      expect(log.description).toContain("acreditó 40 puntos");
    });

    it("should record log when arbitrarily setting points", async () => {
      const setPointsUseCase = new SetCustomerPointsUseCase(
        customerRepo,
        transactionRepo,
        auditLogService
      );

      const res = await setPointsUseCase.execute({
        customerId: "cust_1",
        targetPoints: 250,
        staffId: "admin_1",
        staffName: "Super Admin",
        staffRole: "ADMIN",
        reason: "Corrección por error de carga previa",
      });

      expect(res.isSuccess).toBe(true);

      const logs = await listAuditLogsUseCase.execute({ action: "POINTS_SET" });
      expect(logs.total).toBe(1);
      const log = logs.items[0];
      expect(log.actorName).toBe("Super Admin");
      expect(log.targetName).toBe("Carlos Gomez");
      expect(log.details?.previousPoints).toBe(100);
      expect(log.details?.newBalance).toBe(250);
      expect(log.details?.reason).toBe("Corrección por error de carga previa");
      expect(log.description).toContain("estableció el saldo de puntos");
    });

    it("should record log when customer redeems a product", async () => {
      const redeemUseCase = new RedeemProductUseCase(
        customerRepo,
        productRepo,
        redemptionRepo,
        transactionRepo,
        auditLogService
      );

      const result = await redeemUseCase.execute({
        customerId: "cust_1",
        productId: "prod_1",
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().code).toBeDefined();

      const logs = await listAuditLogsUseCase.execute({ category: "REDEMPTION" });
      expect(logs.total).toBe(1);
      const log = logs.items[0];
      expect(log.action).toBe("REDEMPTION_CREATE");
      expect(log.actorName).toBe("Carlos Gomez");
      expect(log.targetName).toBe("Cucurucho Especial");
      expect(log.details?.pointsSpent).toBe(50);
      expect(log.description).toContain("canjeó el producto");
    });

    it("should record log when staff validates a redemption code", async () => {
      // Create redemption code
      const code = RedemptionToken.create("HLT-TEST12").getValue();
      await redemptionRepo.save(
        new RedemptionCode({
          id: "red_12",
          code,
          customerId: "cust_1",
          productId: "prod_1",
          pointsSpent: Points.create(50).getValue(),
          status: "ACTIVE",
          expiresAt: new Date(Date.now() + 1800000),
          createdAt: new Date(),
        })
      );

      const validateCodeUseCase = new ValidateCodeUseCase(
        redemptionRepo,
        customerRepo,
        productRepo,
        auditLogService
      );

      const res = await validateCodeUseCase.execute({
        code: "HLT-TEST12",
        staffId: "staff_emp_1",
        staffName: "Lucía Cajera",
      });

      expect(res.isSuccess).toBe(true);

      const logs = await listAuditLogsUseCase.execute({ action: "REDEMPTION_VALIDATE" });
      expect(logs.total).toBe(1);
      const log = logs.items[0];
      expect(log.action).toBe("REDEMPTION_VALIDATE");
      expect(log.actorName).toBe("Lucía Cajera");
      expect(log.targetName).toBe("Cucurucho Especial");
      expect(log.details?.customerName).toBe("Carlos Gomez");
      expect(log.description).toContain("validó y entregó");
    });
  });
});
