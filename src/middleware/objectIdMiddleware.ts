import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const objectIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({
      status: "error",
      message: "Invalid Task ID"
    });
    return;
  }
  next();
};
