import { Request, Response } from "express";
import { uploadImageFromBase64 } from "../services/upload.service.js";
import { logActivity } from "../services/activity.service.js";

export async function uploadAsset(req: Request, res: Response) {
  const { dataUri, folder } = req.body as { dataUri: string; folder?: string };
  if (!dataUri) return res.status(400).json({ message: "dataUri is required" });

  const result = await uploadImageFromBase64(dataUri, folder ?? "zero");
  await logActivity("ASSET_UPLOADED", req.admin?.adminId ?? "system");
  return res.json({ url: result.secure_url });
}
