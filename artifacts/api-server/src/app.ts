import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: any = express();
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: any) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: any) {
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

import path from "node:path";
import fs from "node:fs";

// Print runtime config at startup
printSMTPRuntimeConfig();

app.get("/api/healthz", (_req: any, res: any) => {
  res.json({ status: "ok" });
});

// Diagnostic endpoint to test SMTP live
app.get("/api/smtp-test", async (_req: any, res: any) => {
  try {
    const result = await testSMTPConnection();
    res.status(result.success ? 200 : 500).json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

app.use("/api", (req: any, _res: any, next: any) => {
  console.log(`[API-SERVER] ${req.method} ${req.url}`);
  next();
});

app.use("/api", router);

// Serve built static frontend files and SPA fallback
const staticDir = path.resolve(import.meta.dirname, "../../ov-office-site/dist/public");
if (fs.existsSync(staticDir)) {
  app.use(express.static(staticDir));
  app.use((req: any, res: any, next: any) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    if (req.url.startsWith("/api")) return next();
    res.sendFile(path.join(staticDir, "index.html"));
  });
} else {
  app.get("/", (_req: any, res: any) => {
    res.json({ status: "ok", name: "OV Office API Server" });
  });
}

// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  logger.error({ err }, "Unhandled error in API server");
  res.status(500).json({ success: false, error: err?.message || "Internal server error" });
});

export default app;

