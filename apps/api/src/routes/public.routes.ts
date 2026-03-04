import { Router } from "express";
import { createBooking } from "../controllers/bookings.controller.js";
import { getPublicServices } from "../controllers/services.controller.js";
import { validate } from "../middleware/validate.js";
import { createBookingSchema } from "../utils/validation.js";
import { ServiceModel } from "../models/Service.js";

export const publicRouter = Router();

publicRouter.get("/services", getPublicServices);
publicRouter.post("/bookings", validate(createBookingSchema), createBooking);

// Temporary Recovery Route
publicRouter.get("/system/seed", async (req, res) => {
    const services = [
        { title: "Digital Storefront build", price: 15000, description: "Premium digital presence for brands." },
        { title: "Business Automation pipeline", price: 25000, description: "Streamlined operational workflows." },
        { title: "Digital Fortress & AI system", price: 45000, description: "Enterprise-grade security and AI." },
        { title: "Maintenance MRR plan", price: 5000, description: "Monthly support and updates." }
    ];

    for (const s of services) {
        await ServiceModel.findOneAndUpdate({ title: s.title }, s, { upsert: true });
    }
    res.json({ message: "Seeding successful" });
});
