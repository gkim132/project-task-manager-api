import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

const errorMiddleware: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error occurred:", err);

  switch (err.name) {
    case "ValidationError":
      res.status(400).json({
        status: "error",
        message: Array.isArray(err.errors) ? err.errors.join(", ") : err.message
      });
      break;
    case "JsonWebTokenError":
      res.status(401).json({
        status: "error",
        message: "Invalid token. Please log in again"
      });
      break;
    case "TokenExpiredError":
      res.status(401).json({
        status: "error",
        message: "Token expired. Please log in again"
      });
      break;
    default:
      res.status(err.statusCode || 500).json({
        status: "error",
        message: err.message || "Something went wrong"
      });
      break;
  }
  return;
};

export default errorMiddleware;
