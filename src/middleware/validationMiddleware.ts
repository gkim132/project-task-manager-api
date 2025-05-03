import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import { catchAsync } from "../utils/catchAsync";
import User from "../models/userModel";

const taskValidationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().optional(),
  status: yup
    .string()
    .oneOf(["pending", "in-progress", "completed"])
    .optional(),
  imageUrl: yup.string().url().optional()
});

const userValidationSchema = yup.object().shape({
  name: yup.string().required("Name is required").trim(),
  email: yup
    .string()
    .email("Invalid Email address")
    .required("Email is required")
    .trim()
    .test(
      "unique-email",
      "Email address already exists",
      async function (value) {
        if (!value) return true;
        const existingUser = await User.findOne({ email: value });
        return !existingUser;
      }
    ),
  password: yup
    .string()
    .min(7, "Password must be at least 7 characters")
    .trim()
    .required("Password is required"),
  role: yup.string().oneOf(["user", "admin"]).optional()
});

export const taskValidation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await taskValidationSchema.validate(req.body, { abortEarly: false });
    next();
  }
);

export const userValidation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await userValidationSchema.validate(req.body, { abortEarly: false });
    next();
  }
);
