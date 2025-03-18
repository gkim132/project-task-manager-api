import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import BaseError from "../utils/baseError";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const signup = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });

  res.status(201).json({
    status: "success",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      status: "error",
      message: "Please provide email and password"
    });
  }
  const user = await User.findOne({ email }).select("+password");
  console.log(user);
  if (!user || !(await user.comparePassword(password))) {
    throw new BaseError("Incorrect email or password", 401);
  }
  const token = signToken(user._id);

  res.status(200).json({ status: "success", token });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find();
  res.status(200).json({ status: "success", users });
});

export { signup, getAllUsers, login };
