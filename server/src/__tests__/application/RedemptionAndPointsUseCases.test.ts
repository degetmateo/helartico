import { beforeEach, describe, expect, it } from "vitest";
import { AddPointsUseCase } from "../../application/customers/AddPointsUseCase";
import { RedeemProductUseCase } from "../../application/redemptions/RedeemProductUseCase";
import { ValidateCodeUseCase } from "../../application/redemptions/ValidateCodeUseCase";
import { Customer } from "../../domain/entities/Customer";
import { Product } from "../../domain/entities/Product";
import { DocumentNumber } from "../../domain/value-objects/DocumentNumber";
import { Email } from "../../domain/value-objects/Email";
import { Points } from "../../domain/value-objects/Points";
import {
  InMemoryCustomerRepository,
  InMemoryProductRepository,
  InMemoryRedemptionCodeRepository,
  InMemoryTransactionRepository,
} from "../mocks/InMemoryRepositories";

describe("Redemption and Points Use Cases", () => {
  let customerRepo: InMemoryCustomerRepository;
  let productRepo: InMemoryProductRepository;
  let redemptionRepo: InMemoryRedemptionCodeRepository;
  let transactionRepo: InMemoryTransactionRepository;

  let addPointsUseCase: AddPointsUseCase;
  let redeemProductUseCase: RedeemProductUseCase;
  let validateCodeUseCase: ValidateCodeUseCase;

  let customer: Customer;
  let product: Product;

  beforeEach(async () => {
    customerRepo = new InMemoryCustomerRepository();
    productRepo = new InMemoryProductRepository();
    redemptionRepo = new InMemoryRedemptionCodeRepository();
    transactionRepo = new InMemoryTransactionRepository();

    addPointsUseCase = new AddPointsUseCase(customerRepo, transactionRepo);
    redeemProductUseCase = new RedeemProductUseCase(
      customerRepo,
      productRepo,
      redemptionRepo,
      transactionRepo
    );
    validateCodeUseCase = new ValidateCodeUseCase(redemptionRepo, customerRepo, productRepo);

    customer = await customerRepo.save(
      new Customer({
        id: "cust_10",
        name: "Carlos Sanchez",
        email: Email.create("carlos@helartico.com").getValue(),
        phone: "11223344",
        documentNumber: DocumentNumber.create("30123456").getValue(),
        passwordHash: "hash",
        pointsBalance: Points.create(50).getValue(),
        isActive: true,
      })
    );

    product = await productRepo.save(
      new Product({
        id: "prod_20",
        name: "Cucurucho 2 Bochas",
        imageUrl: "https://example.com/cucurucho.jpg",
        pointsRequired: Points.create(150).getValue(),
        isActive: true,
      })
    );
  });

  it("should allow staff to add points to customer", async () => {
    const addResult = await addPointsUseCase.execute({
      customerId: customer.id!,
      pointsToAdd: 120,
      staffId: "staff_1",
      note: "Compra helado 1kg",
    });

    expect(addResult.isSuccess).toBe(true);
    expect(addResult.getValue().pointsBalance.value).toBe(170); // 50 + 120
    expect(transactionRepo.transactions.length).toBe(1);
    expect(transactionRepo.transactions[0].amount).toBe(120);
  });

  it("should fail redemption if customer lacks sufficient points", async () => {
    const res = await redeemProductUseCase.execute({
      customerId: customer.id!,
      productId: product.id!,
    });
    expect(res.isFailure).toBe(true);
    expect(res.error).toContain("Insufficient points");
  });

  it("should execute full flow: earn points -> redeem code -> staff validates", async () => {
    // 1. Earn points
    await addPointsUseCase.execute({
      customerId: customer.id!,
      pointsToAdd: 200,
      staffId: "staff_1",
    });

    // 2. Customer redeems
    const redeemRes = await redeemProductUseCase.execute({
      customerId: customer.id!,
      productId: product.id!,
    });
    expect(redeemRes.isSuccess).toBe(true);
    const codeData = redeemRes.getValue();
    expect(codeData.code).toMatch(/^HLT-/);

    // Customer points should be deducted: (50 + 200) - 150 = 100
    const updatedCustomer = await customerRepo.findById(customer.id!);
    expect(updatedCustomer?.pointsBalance.value).toBe(100);

    // 3. Staff validates code in counter
    const valRes = await validateCodeUseCase.execute({
      code: codeData.code,
      staffId: "staff_cashier",
    });
    expect(valRes.isSuccess).toBe(true);
    expect(valRes.getValue().status).toBe("CONSUMED");
    expect(valRes.getValue().productName).toBe("Cucurucho 2 Bochas");

    // 4. Second attempt should fail
    const replayRes = await validateCodeUseCase.execute({
      code: codeData.code,
      staffId: "staff_cashier",
    });
    expect(replayRes.isFailure).toBe(true);
    expect(replayRes.error).toContain("already been consumed");
  });
});
