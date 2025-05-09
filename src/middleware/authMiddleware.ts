import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { UserDocument } from "../models/userModel";
import { catchAsync } from "../utils/catchAsync";
import BaseError from "../utils/baseError";
import { promisify } from "util";
import { Multer } from "multer";

export interface IUserRequest extends Request {
  user: UserDocument;
  file?: Multer.File;
}

const verifyToken = promisify(jwt.verify);

const authenticateUser = catchAsync(
  async (
    req: IUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new BaseError("Unauthorized: Please log in to get access", 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new BaseError("Unauthorized: Please log in to get access", 401);
    }

    const decoded = await verifyToken(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new BaseError("Unauthorized: User no longer exists", 401);
    }

    req.user = user;
    next();
  }
);

const authorizeRole = (role: string) => {
  return (req: IUserRequest, res: Response, next: NextFunction) => {
    if (role !== req.user.role) {
      throw new BaseError(
        "Forbidden: You do not have permission to delete the task",
        403
      );
    }
    next();
  };
};

export { authenticateUser, authorizeRole };
