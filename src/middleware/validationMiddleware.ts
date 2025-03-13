import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

const taskSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().optional(),
  status: yup
    .string()
    .oneOf(["pending", "in-progress", "completed"], "Invalid status")
    .optional()
});

export const validateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await taskSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (err: any) {
    res.status(400).json({
      status: "error",
      message: err.errors
    });
  }
};
