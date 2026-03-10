import { app } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";

// v2 - OTP email verification

async function bootstrap() {
  await connectDb();
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
