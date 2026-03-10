import { app } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";

// v3 - Trigger render restart for OTP email verification

async function bootstrap() {
  try {
    await connectDb();
  } catch (err) {
    console.error("Database connection failed. Starting web server anyway to avoid timeouts...", err);
  }
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API running on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server", error);
  process.exit(1);
});
