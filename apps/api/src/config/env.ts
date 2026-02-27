import dotenv from "dotenv";

dotenv.config();

const required = ["MONGODB_URI", "JWT_SECRET"] as const;
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing env variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGODB_URI!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  cookieSecure: process.env.COOKIE_SECURE === "true",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  emailFrom: process.env.EMAIL_FROM ?? "ZERO <noreply@zero.local>",
  adminNotifyEmail: process.env.ADMIN_NOTIFY_EMAIL ?? "admin@zero.local",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000",
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    apiKey: process.env.CLOUDINARY_API_KEY ?? "",
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? ""
  }
};
