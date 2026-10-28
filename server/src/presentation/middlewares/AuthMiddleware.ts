import { Request, Response, NextFunction } from "express";
import { JwtTokenService, TokenPayload } from "../../infrastructure/security/JwtTokenService";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export class AuthMiddleware {
  public static handle(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ success: false, error: "Sesión no válida o token de acceso ausente." });
      return;
    }

    const token = authHeader.substring(7);
    const payload = JwtTokenService.verifyToken(token);
    if (!payload) {
      res.status(401).json({ success: false, error: "La sesión ha expirado o el token no es válido." });
      return;
    }

    req.user = payload;
    next();
  }
}
