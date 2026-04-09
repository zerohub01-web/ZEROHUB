import { Router } from "express";
import { receiveWhatsAppWebhook, verifyWhatsAppWebhook } from "../controllers/whatsapp.controller.js";
import { whatsappWebhookLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.get("/whatsapp", verifyWhatsAppWebhook);
router.post("/whatsapp", whatsappWebhookLimiter, receiveWhatsAppWebhook);

export default router;
