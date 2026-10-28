import { Request, Response, NextFunction } from "express";

export class ErrorHandlerMiddleware {
  public static handle(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    console.error("[ServerError]:", err?.message || "Unknown error");
    res.status(500).json({
      success: false,
      error: "Ocurrió un error interno en el servidor. Por favor, intenta de nuevo más tarde.",
    });
  }
}
