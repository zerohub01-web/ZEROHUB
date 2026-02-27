import { Router } from "express";
import { createBooking } from "../controllers/bookings.controller.js";
import { getPublicServices } from "../controllers/services.controller.js";
import { validate } from "../middleware/validate.js";
import { createBookingSchema } from "../utils/validation.js";

export const publicRouter = Router();

publicRouter.get("/services", getPublicServices);
publicRouter.post("/bookings", validate(createBookingSchema), createBooking);
