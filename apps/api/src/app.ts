import express from "express";
import cors from "cors";
import * as helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import { env } from "./config/env.js";
import { publicRouter } from "./routes/public.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { authRouter } from "./routes/auth.routes.js";

export const app = express();

app.set("trust proxy", 1);

app.use(helmet.default());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/$/, "");
      const cleanEnvConfig = env.clientOrigin?.replace(/\/$/, "");

      const allowed = new Set([
        cleanEnvConfig,
        "https://zerohub-api.vercel.app",
        "https://zeroops.in",
        "https://www.zeroops.in",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001"
      ]);

      if (allowed.has(cleanOrigin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(morgan("dev"));

app.get("/", (_req, res) =>
  res.json({
    ok: true,
    service: "zero-api",
    message: "API is running. Open http://localhost:3000 for the website."
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api", publicRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: "Internal server error", error: err.message, stack: err.stack });
});
