import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./AuthMiddleware";

export class RoleMiddleware {
  public static requireRole(role: "CUSTOMER" | "STAFF") {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Authentication required." });
        return;
      }

      if (req.user.role !== role) {
        res.status(403).json({
          success: false,
          error: "Forbidden: You do not have permission to access this resource.",
        });
        return;
      }

      next();
    };
  }

  public static requireAdmin() {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Authentication required." });
        return;
      }

      if (req.user.role !== "STAFF" || req.user.staffRole !== "ADMIN") {
        res.status(403).json({
          success: false,
          error: "Forbidden: Administrator privileges required.",
        });
        return;
      }

      next();
    };
  }
}
