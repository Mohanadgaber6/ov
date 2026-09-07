import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { testSMTPConnection, printSMTPRuntimeConfig } from "./lib/mailer";

// Print runtime config at startup
printSMTPRuntimeConfig();

app.get("/", (_req, res) => {
  res.json({ status: "ok", name: "OV Office API Server" });
});

app.get("/api/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

// Diagnostic endpoint to test SMTP live
app.get("/api/smtp-test", async (_req, res) => {
  try {
    const result = await testSMTPConnection();
    res.status(result.success ? 200 : 500).json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

app.use("/api", (req, _res, next) => {
  console.log(`[API-SERVER] ${req.method} ${req.url}`);
  next();
});

app.use("/api", router);

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err }, "Unhandled error in API server");
  res.status(500).json({ success: false, error: err?.message || "Internal server error" });
});

export default app;

