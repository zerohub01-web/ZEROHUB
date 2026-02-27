import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    adminId: z.string().min(3),
    password: z.string().min(6)
  })
});

export const customerSignupSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6)
  })
});

export const customerLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
});

export const customerGoogleSchema = z.object({
  body: z.object({
    credential: z.string().min(10)
  })
});

export const createBookingSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(6),
    businessType: z.string().min(2),
    teamSize: z.string().optional().default(""),
    monthlyLeads: z.string().optional().default(""),
    budgetRange: z.string().optional().default(""),
    service: z.string().min(2),
    date: z.string().datetime()
  })
});

export const updateBookingSchema = z.object({
  body: z.object({
    status: z.enum(["NEW", "CONFIRMED", "COMPLETED"])
  }),
  params: z.object({ id: z.string().min(1) })
});

export const updateMilestoneSchema = z.object({
  params: z.object({
    bookingId: z.string().min(1),
    milestoneKey: z.enum(["planned", "in_progress", "delivered"])
  }),
  body: z.object({
    status: z.enum(["PENDING", "DONE"]).optional(),
    fileUrl: z.string().url().optional(),
    comment: z.string().min(1).optional()
  })
});

export const serviceSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    price: z.number().nonnegative(),
    isActive: z.boolean().optional()
  })
});

export const workSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    slug: z.string().min(2),
    coverImage: z.string().url(),
    gallery: z.array(z.string().url()).default([]),
    seoTitle: z.string().default(""),
    seoDescription: z.string().default("")
  })
});
