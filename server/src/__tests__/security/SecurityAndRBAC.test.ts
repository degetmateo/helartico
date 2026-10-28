import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { JwtTokenService } from "../../infrastructure/security/JwtTokenService";
import { AuthMiddleware } from "../../presentation/middlewares/AuthMiddleware";
import { RoleMiddleware } from "../../presentation/middlewares/RoleMiddleware";

describe("Security & RBAC Enforcement", () => {
  const app = express();
  app.use(express.json());

  // Protected customer route
  app.get(
    "/api/customer-only",
    AuthMiddleware.handle,
    RoleMiddleware.requireRole("CUSTOMER"),
    (_req, res) => {
      res.json({ success: true, message: "Welcome customer" });
    }
  );

  // Protected staff route
  app.get(
    "/api/staff-only",
    AuthMiddleware.handle,
    RoleMiddleware.requireRole("STAFF"),
    (_req, res) => {
      res.json({ success: true, message: "Welcome staff" });
    }
  );

  // Sensitive staff action (e.g. validate code)
  app.post(
    "/api/staff/validate",
    AuthMiddleware.handle,
    RoleMiddleware.requireRole("STAFF"),
    (_req, res) => {
      res.json({ success: true, message: "Validated" });
    }
  );

  const customerToken = JwtTokenService.generateToken({
    userId: "cust_123",
    role: "CUSTOMER",
    email: "customer@helartico.com",
  });

  const staffToken = JwtTokenService.generateToken({
    userId: "staff_456",
    role: "STAFF",
    email: "staff@helartico.com",
  });

  describe("Token Authentication (401 Unauthorized)", () => {
    it("should reject request without Authorization header", async () => {
      const res = await request(app).get("/api/customer-only");
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain("token de acceso ausente");
    });

    it("should reject malformed Authorization header", async () => {
      const res = await request(app)
        .get("/api/customer-only")
        .set("Authorization", "Basic 123456");
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should reject invalid/tampered JWT signature", async () => {
      const tamperedToken = customerToken.slice(0, -6) + "fake99";
      const res = await request(app)
        .get("/api/customer-only")
        .set("Authorization", `Bearer ${tamperedToken}`);
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain("expirado o el token no es válido");
    });
  });

  describe("Role-Based Access Control (403 Forbidden)", () => {
    it("should allow customer to access customer-only endpoint", async () => {
      const res = await request(app)
        .get("/api/customer-only")
        .set("Authorization", `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should block customer from accessing staff-only endpoints", async () => {
      const getRes = await request(app)
        .get("/api/staff-only")
        .set("Authorization", `Bearer ${customerToken}`);
      expect(getRes.status).toBe(403);
      expect(getRes.body.success).toBe(false);
      expect(getRes.body.error).toContain("Acceso denegado");

      const postRes = await request(app)
        .post("/api/staff/validate")
        .set("Authorization", `Bearer ${customerToken}`);
      expect(postRes.status).toBe(403);
      expect(postRes.body.success).toBe(false);
    });

    it("should allow staff to access staff-only endpoints", async () => {
      const res = await request(app)
        .get("/api/staff-only")
        .set("Authorization", `Bearer ${staffToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should block staff from accessing customer-only endpoints", async () => {
      const res = await request(app)
        .get("/api/customer-only")
        .set("Authorization", `Bearer ${staffToken}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });
});
