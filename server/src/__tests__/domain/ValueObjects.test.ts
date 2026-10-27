import { describe, expect, it } from "vitest";
import { DocumentNumber } from "../../domain/value-objects/DocumentNumber";
import { Email } from "../../domain/value-objects/Email";
import { Points } from "../../domain/value-objects/Points";
import { RedemptionToken } from "../../domain/value-objects/RedemptionToken";

describe("Domain Value Objects", () => {
  describe("Email Value Object", () => {
    it("should create valid lowercase email", () => {
      const result = Email.create("Cliente@Helartico.com");
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe("cliente@helartico.com");
    });

    it("should reject invalid email format", () => {
      const result = Email.create("not-an-email");
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("Invalid email");
    });
  });

  describe("Points Value Object", () => {
    it("should create valid positive integer points", () => {
      const result = Points.create(150);
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe(150);
    });

    it("should reject negative points or floats", () => {
      expect(Points.create(-10).isFailure).toBe(true);
      expect(Points.create(10.5).isFailure).toBe(true);
    });

    it("should add and subtract points correctly", () => {
      const p1 = Points.create(100).getValue();
      const p2 = Points.create(50).getValue();
      expect(p1.add(p2).value).toBe(150);

      const subResult = p1.subtract(p2);
      expect(subResult.isSuccess).toBe(true);
      expect(subResult.getValue().value).toBe(50);
    });

    it("should fail subtract when insufficient points", () => {
      const p1 = Points.create(20).getValue();
      const p2 = Points.create(50).getValue();
      const subResult = p1.subtract(p2);
      expect(subResult.isFailure).toBe(true);
    });
  });

  describe("DocumentNumber Value Object", () => {
    it("should clean punctuation and spaces", () => {
      const result = DocumentNumber.create(" 40.123-456 ");
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe("40123456");
    });

    it("should reject documents that are too short", () => {
      expect(DocumentNumber.create("123").isFailure).toBe(true);
    });
  });

  describe("RedemptionToken Value Object", () => {
    it("should generate tokens with HLT- prefix and 6 alphanumeric chars", () => {
      const token = RedemptionToken.generate();
      expect(token.value).toMatch(/^HLT-[A-Z0-9]{6}$/);
    });

    it("should validate and format valid tokens", () => {
      const result = RedemptionToken.create("hlt-abc123");
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe("HLT-ABC123");
    });
  });
});
