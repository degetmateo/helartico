import { describe, expect, it } from "vitest";
import { Customer } from "../../domain/entities/Customer";
import { Product } from "../../domain/entities/Product";
import { RedemptionCode } from "../../domain/entities/RedemptionCode";
import { DocumentNumber } from "../../domain/value-objects/DocumentNumber";
import { Email } from "../../domain/value-objects/Email";
import { Points } from "../../domain/value-objects/Points";
import { RedemptionToken } from "../../domain/value-objects/RedemptionToken";

describe("Domain Entities", () => {
  const dummyEmail = Email.create("test@helartico.com").getValue();
  const dummyDoc = DocumentNumber.create("40123456").getValue();

  it("Customer should handle points balance correctly", () => {
    const customer = new Customer({
      name: "Juan Perez",
      email: dummyEmail,
      phone: "11223344",
      documentNumber: dummyDoc,
      passwordHash: "hash123",
      pointsBalance: Points.create(100).getValue(),
      isActive: true,
    });

    customer.addPoints(Points.create(50).getValue());
    expect(customer.pointsBalance.value).toBe(150);

    const deductRes = customer.deductPoints(Points.create(80).getValue());
    expect(deductRes.isSuccess).toBe(true);
    expect(customer.pointsBalance.value).toBe(70);

    const failDeduct = customer.deductPoints(Points.create(200).getValue());
    expect(failDeduct.isFailure).toBe(true);
    expect(customer.pointsBalance.value).toBe(70);

    customer.setPoints(Points.create(300).getValue());
    expect(customer.pointsBalance.value).toBe(300);
  });

  it("RedemptionCode should expire after time limit and consume only once", () => {
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    const code = new RedemptionCode({
      code: RedemptionToken.generate(),
      customerId: "cust_1",
      productId: "prod_1",
      pointsSpent: Points.create(120).getValue(),
      status: "ACTIVE",
      expiresAt,
    });

    expect(code.isExpired(new Date())).toBe(false);

    // Consume once
    const consumeRes = code.consume("staff_123");
    expect(consumeRes.isSuccess).toBe(true);
    expect(code.status).toBe("CONSUMED");
    expect(code.consumedByStaffId).toBe("staff_123");

    // Attempt second consume
    const doubleConsume = code.consume("staff_999");
    expect(doubleConsume.isFailure).toBe(true);
    expect(doubleConsume.error).toContain("ya fue utilizado");
  });

  it("RedemptionCode should reject consumption if expired", () => {
    const pastExpiration = new Date(Date.now() - 5000);
    const code = new RedemptionCode({
      code: RedemptionToken.generate(),
      customerId: "cust_1",
      productId: "prod_1",
      pointsSpent: Points.create(50).getValue(),
      status: "ACTIVE",
      expiresAt: pastExpiration,
    });

    expect(code.isExpired()).toBe(true);
    const res = code.consume("staff_1");
    expect(res.isFailure).toBe(true);
    expect(res.error).toContain("ha expirado");
  });

  it("Product should update points and handle active state", () => {
    const product = new Product({
      name: "Helado 1 Bocha",
      imageUrl: "https://example.com/helado.png",
      pointsRequired: Points.create(80).getValue(),
      isActive: true,
    });

    product.deactivate();
    expect(product.isActive).toBe(false);

    product.update("Helado 1 Bocha Premium", "https://example.com/new.png", Points.create(90).getValue());
    expect(product.name).toBe("Helado 1 Bocha Premium");
    expect(product.pointsRequired.value).toBe(90);
  });
});
