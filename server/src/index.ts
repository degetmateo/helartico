import cors from "cors";
import express from "express";
import { EnvironmentConfig } from "./config/EnvironmentConfig";
import { MongoConnection } from "./infrastructure/database/MongoConnection";
import { ErrorHandlerMiddleware } from "./presentation/middlewares/ErrorHandlerMiddleware";
import { createApiRouter } from "./presentation/routes";

const app = express();

app.use(
  cors({
    origin: EnvironmentConfig.corsOrigin,
    credentials: true,
  })
);
app.use(express.json());

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    service: "Helartico Loyalty API",
    timestamp: new Date().toISOString(),
  });
});

// Main API routes
app.use("/api", createApiRouter());

// Global error handler
app.use(ErrorHandlerMiddleware.handle);

async function startServer(): Promise<void> {
  try {
    await MongoConnection.connect();
  } catch (error) {
    console.warn(
      "[MongoDB] Warning: Failed to connect on startup. Will retry on queries or when configured. Check MONGODB_URI in .env."
    );
  }

  const port = EnvironmentConfig.port;
  app.listen(port, () => {
    console.log(`[Helartico Server] Running at http://localhost:${port}`);
    console.log(`[Helartico Server] Health check at http://localhost:${port}/api/health`);
  });
}

startServer();
