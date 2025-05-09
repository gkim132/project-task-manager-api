import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import User, { UserDocument } from "../models/userModel";
import jwt from "jsonwebtoken";
import BaseError from "../utils/baseError";
import { IUserRequest } from "../middleware/authMiddleware";
import Task from "../models/taskModel";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (
  user: UserDocument,
  statusCode: number,
  res: Response
) => {
  const token = signToken(user._id);
  const userObject = user.toObject();
  delete userObject.password;

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user: userObject }
  });
};

const signup = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });

  createSendToken(user, 201, res);
});

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BaseError("Please provide email and password", 400);
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      throw new BaseError("Incorrect email or password", 401);
    }

    createSendToken(user, 200, res);
  }
);

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find();
  res.status(200).json({ status: "success", users });
});

const updatePassword = catchAsync(
  async (req: IUserRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      throw new BaseError("User not found", 404);
    }

    if (
      !req.body.currentPassword ||
      !(await user.comparePassword(req.body.currentPassword))
    ) {
      throw new BaseError("Incorrect password", 401);
    }

    user.password = req.body.newPassword;
    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, res);
  }
);

const myProfile = catchAsync(async (req: IUserRequest, res: Response) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new BaseError("User not found", 404);
  }

  const tasks = await Task.find({ createdBy: req.user.id });

  res.status(200).json({
    status: "success",
    data: {
      user,
      tasks
    }
  });
});

export { signup, getAllUsers, login, updatePassword, myProfile };
