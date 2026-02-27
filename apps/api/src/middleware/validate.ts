import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validate(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse({ body: req.body, params: req.params, query: req.query });
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
    }
    next();
  };
}
