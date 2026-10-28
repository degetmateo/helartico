import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./AuthMiddleware";

export class RoleMiddleware {
  public static requireRole(role: "CUSTOMER" | "STAFF") {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Autenticación requerida. Por favor, inicia sesión." });
        return;
      }

      if (req.user.role !== role) {
        res.status(403).json({
          success: false,
          error: "Acceso denegado: No tienes permisos para acceder a este recurso.",
        });
        return;
      }

      next();
    };
  }

  public static requireAdmin() {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Autenticación requerida. Por favor, inicia sesión." });
        return;
      }

      if (req.user.role !== "STAFF" || req.user.staffRole !== "ADMIN") {
        res.status(403).json({
          success: false,
          error: "Acceso denegado: Se requieren permisos de Administrador.",
        });
        return;
      }

      next();
    };
  }
}
