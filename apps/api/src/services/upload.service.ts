import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret
});

export async function uploadImageFromBase64(dataUri: string, folder = "zero") {
  if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
    return { secure_url: dataUri };
  }

  return cloudinary.uploader.upload(dataUri, { folder });
}
