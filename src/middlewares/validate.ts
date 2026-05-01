import type { Request, Response, NextFunction } from "express";
import { ZodError, ZodObject, type ZodAny } from "zod";

export const validateSchema = (schema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: "Validation Failed",
        });
      }
      next(err);
    }
  };
};
