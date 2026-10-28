import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateUserUseCase } from "../../application/auth/AuthenticateUserUseCase";
import { CreateStaffUseCase } from "../../application/auth/CreateStaffUseCase";
import { RegisterCustomerUseCase } from "../../application/auth/RegisterCustomerUseCase";
import { InMemoryCustomerRepository, InMemoryStaffRepository } from "../mocks/InMemoryRepositories";

describe("Auth Use Cases", () => {
  let customerRepo: InMemoryCustomerRepository;
  let staffRepo: InMemoryStaffRepository;
  let registerCustomerUseCase: RegisterCustomerUseCase;
  let createStaffUseCase: CreateStaffUseCase;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  beforeEach(() => {
    customerRepo = new InMemoryCustomerRepository();
    staffRepo = new InMemoryStaffRepository();
    registerCustomerUseCase = new RegisterCustomerUseCase(customerRepo);
    createStaffUseCase = new CreateStaffUseCase(staffRepo);
    authenticateUserUseCase = new AuthenticateUserUseCase(customerRepo, staffRepo);
  });

  it("should register customer and allow login", async () => {
    const regResult = await registerCustomerUseCase.execute({
      name: "Laura Gómez",
      email: "laura@example.com",
      phone: "+5491112345678",
      documentNumber: "38999888",
      password: "secretpassword123",
    });

    expect(regResult.isSuccess).toBe(true);
    expect(regResult.getValue().name).toBe("Laura Gómez");

    // Login with correct credentials
    const loginResult = await authenticateUserUseCase.execute({
      email: "laura@example.com",
      password: "secretpassword123",
    });

    expect(loginResult.isSuccess).toBe(true);
    const authData = loginResult.getValue();
    expect(authData.user.role).toBe("CUSTOMER");
    expect(authData.token).toBeDefined();
  });

  it("should reject customer registration with duplicate email or document", async () => {
    await registerCustomerUseCase.execute({
      name: "Laura Gómez",
      email: "laura@example.com",
      phone: "+5491112345678",
      documentNumber: "38999888",
      password: "secretpassword123",
    });

    const dupEmail = await registerCustomerUseCase.execute({
      name: "Otra Persona",
      email: "laura@example.com",
      phone: "119999",
      documentNumber: "11223344",
      password: "secretpassword123",
    });
    expect(dupEmail.isFailure).toBe(true);
    expect(dupEmail.error).toContain("correo electrónico");
  });

  it("should create staff and allow staff login", async () => {
    const staffRes = await createStaffUseCase.execute({
      name: "Cajero Juan",
      email: "cajero@helartico.com",
      phone: "11223344",
      documentNumber: "29111222",
      password: "staffpassword123",
    });

    expect(staffRes.isSuccess).toBe(true);

    const loginRes = await authenticateUserUseCase.execute({
      email: "cajero@helartico.com",
      password: "staffpassword123",
    });

    expect(loginRes.isSuccess).toBe(true);
    expect(loginRes.getValue().user.role).toBe("STAFF");
  });

  it("should register a customer without phone number successfully", async () => {
    const regResult = await registerCustomerUseCase.execute({
      name: "Martín Sin Teléfono",
      email: "martin@example.com",
      documentNumber: "40111222",
      password: "secretpassword123",
    });

    expect(regResult.isSuccess).toBe(true);
    const customer = regResult.getValue();
    expect(customer.name).toBe("Martín Sin Teléfono");
    expect(customer.phone).toBe("");

    const loginResult = await authenticateUserUseCase.execute({
      email: "martin@example.com",
      password: "secretpassword123",
    });
    expect(loginResult.isSuccess).toBe(true);
  });
});
