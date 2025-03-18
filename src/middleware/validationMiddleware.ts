import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import { catchAsync } from "../utils/catchAsync";

const taskSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().optional(),
  status: yup.string().oneOf(["pending", "in-progress", "completed"]).optional()
});

export const validateTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await taskSchema.validate(req.body, { abortEarly: false });
    next();
  }
);
