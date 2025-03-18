import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import BaseError from "../utils/baseError";

export const objectIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new BaseError("Invalid Task ID", 400));
  }
  next();
};
