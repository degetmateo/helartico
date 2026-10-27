import { beforeEach, describe, expect, it } from "vitest";
import { ListCustomersUseCase } from "../../application/customers/ListCustomersUseCase";
import { ListProductsUseCase } from "../../application/products/ListProductsUseCase";
import { GetCustomerRedemptionsUseCase } from "../../application/redemptions/GetCustomerRedemptionsUseCase";
import { Customer } from "../../domain/entities/Customer";
import { Product } from "../../domain/entities/Product";
import { RedemptionCode } from "../../domain/entities/RedemptionCode";
import { DocumentNumber } from "../../domain/value-objects/DocumentNumber";
import { Email } from "../../domain/value-objects/Email";
import { Points } from "../../domain/value-objects/Points";
import { RedemptionToken } from "../../domain/value-objects/RedemptionToken";
import {
  InMemoryCustomerRepository,
  InMemoryProductRepository,
  InMemoryRedemptionCodeRepository,
} from "../mocks/InMemoryRepositories";

describe("Pagination & Search Use Cases", () => {
  let customerRepo: InMemoryCustomerRepository;
  let productRepo: InMemoryProductRepository;
  let redemptionRepo: InMemoryRedemptionCodeRepository;

  let listProductsUseCase: ListProductsUseCase;
  let listCustomersUseCase: ListCustomersUseCase;
  let getRedemptionsUseCase: GetCustomerRedemptionsUseCase;

  beforeEach(async () => {
    customerRepo = new InMemoryCustomerRepository();
    productRepo = new InMemoryProductRepository();
    redemptionRepo = new InMemoryRedemptionCodeRepository();

    listProductsUseCase = new ListProductsUseCase(productRepo);
    listCustomersUseCase = new ListCustomersUseCase(customerRepo);
    getRedemptionsUseCase = new GetCustomerRedemptionsUseCase(redemptionRepo, productRepo);

    // Seed 15 products
    for (let i = 1; i <= 15; i++) {
      await productRepo.save(
        new Product({
          id: `prod_${i}`,
          name: i % 2 === 0 ? `Helado de Chocolate Especial ${i}` : `Café Especial ${i}`,
          imageUrl: `https://example.com/img${i}.jpg`,
          pointsRequired: Points.create(i * 10).getValue(),
          isActive: i !== 15, // prod_15 is inactive
        })
      );
    }

    // Seed 12 customers
    for (let i = 1; i <= 12; i++) {
      await customerRepo.save(
        new Customer({
          id: `cust_${i}`,
          name: i <= 6 ? `Ana Perez ${i}` : `Bernardo Gomez ${i}`,
          email: Email.create(`user${i}@helartico.com`).getValue(),
          phone: `112233${i}`,
          documentNumber: DocumentNumber.create(`4000000${i}`).getValue(),
          passwordHash: "hash",
          pointsBalance: Points.create(100).getValue(),
          isActive: true,
        })
      );
    }

    // Seed 8 redemptions for cust_1
    for (let i = 1; i <= 8; i++) {
      await redemptionRepo.save(
        new RedemptionCode({
          id: `red_${i}`,
          code: RedemptionToken.create(`HLT-TEST0${i}`).getValue(),
          customerId: "cust_1",
          productId: "prod_1",
          pointsSpent: Points.create(50).getValue(),
          status: "ACTIVE",
          expiresAt: new Date(Date.now() + 1800000),
          createdAt: new Date(),
        })
      );
    }
  });

  describe("Product Search & Pagination", () => {
    it("should paginate products with default page and limit", async () => {
      const page1 = await listProductsUseCase.execute({ onlyActive: true, page: 1, limit: 5 });
      expect(page1.items.length).toBe(5);
      expect(page1.total).toBe(14); // 15 minus 1 inactive
      expect(page1.totalPages).toBe(3);
      expect(page1.hasMore).toBe(true);

      const page3 = await listProductsUseCase.execute({ onlyActive: true, page: 3, limit: 5 });
      expect(page3.items.length).toBe(4);
      expect(page3.hasMore).toBe(false);
    });

    it("should filter products by search term case-insensitively", async () => {
      const searchRes = await listProductsUseCase.execute({
        onlyActive: true,
        searchTerm: "chocolate",
        page: 1,
        limit: 10,
      });

      expect(searchRes.items.length).toBeGreaterThan(0);
      searchRes.items.forEach((p) => {
        expect(p.name.toLowerCase()).toContain("chocolate");
      });
    });
  });

  describe("Customer Search & Pagination", () => {
    it("should paginate customers correctly", async () => {
      const res = await listCustomersUseCase.execute({ page: 1, limit: 5 });
      expect(res.items.length).toBe(5);
      expect(res.total).toBe(12);
      expect(res.totalPages).toBe(3);
      expect(res.hasMore).toBe(true);
    });

    it("should filter customers by name or document or email", async () => {
      const resName = await listCustomersUseCase.execute({ search: "bernardo" });
      expect(resName.items.length).toBe(6);

      const resDoc = await listCustomersUseCase.execute({ search: "40000009" });
      expect(resDoc.items.length).toBe(1);
      expect(resDoc.items[0].email.value).toBe("user9@helartico.com");

    });
  });

  describe("Redemption History Pagination", () => {
    it("should paginate customer redemptions", async () => {
      const page1 = await getRedemptionsUseCase.execute({
        customerId: "cust_1",
        page: 1,
        limit: 5,
      });

      expect(page1.items.length).toBe(5);
      expect(page1.total).toBe(8);
      expect(page1.hasMore).toBe(true);
      expect(page1.items[0].code).toBe("HLT-TEST01");

      const page2 = await getRedemptionsUseCase.execute({
        customerId: "cust_1",
        page: 2,
        limit: 5,
      });

      expect(page2.items.length).toBe(3);
      expect(page2.hasMore).toBe(false);
    });
  });
});
