import { Request, Response, NextFunction } from "express";
import { AnyObjectSchema } from "yup";

const validateMiddleware =
  (schema: AnyObjectSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (error) {
      res.status(400).json({ status: "error", message: error.errors });
    }
  };

export default validateMiddleware;
