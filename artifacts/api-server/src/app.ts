import express, { type Express } from "express";
import http from "node:http";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    autoLogging: {
      ignore: (req: any) => req.url?.startsWith?.("/@") || req.url?.startsWith?.("/src/") || req.url?.startsWith?.("/node_modules/"),
    },
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

app.use("/api", router);

// Reverse proxy: forward all non-API requests to the Vite dev server
const VITE_PORT = Number(process.env.VITE_PORT) || 5173;

app.use((req, res) => {
  const proxyReq = http.request(
    {
      hostname: "127.0.0.1",
      port: VITE_PORT,
      path: req.originalUrl,
      method: req.method,
      headers: { ...req.headers, host: `127.0.0.1:${VITE_PORT}` },
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode ?? 200, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    },
  );

  proxyReq.on("error", () => {
    res.status(502).send("Frontend dev server not ready");
  });

  req.pipe(proxyReq, { end: true });
});

export default app;

