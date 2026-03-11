import { Router } from "express";
import { createBooking } from "../controllers/bookings.controller.js";
import { getPublicServices } from "../controllers/services.controller.js";
import { getPublicWorks } from "../controllers/work.controller.js";
import { validate } from "../middleware/validate.js";
import { createBookingSchema } from "../utils/validation.js";
import { requireCustomerAuth } from "../middleware/customerAuth.js";
import { WorkModel } from "../models/Work.js";

export const publicRouter = Router();

publicRouter.get("/services", getPublicServices);
publicRouter.get("/work", getPublicWorks);
publicRouter.post("/bookings", validate(createBookingSchema), createBooking);
publicRouter.get("/projects", requireCustomerAuth, async (_req, res) => {
  const items = await WorkModel.find().select("-__v").sort({ createdAt: -1 });
  return res.json({ projects: items });
});
