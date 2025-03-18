import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

const errorMiddleware: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === "ValidationError") {
    res.status(400).json({
      status: "error",
      message: err.errors.join(", ")
    });
    return;
  }

  if (err.statusCode === 404) {
    res.status(403).json({
      status: "error",
      message: err.message
    });
    return;
  }

  console.error("Error!!!:", err);

  res.status(500).json({
    status: "error",
    message: "Something went wrong"
  });
  return;
};

export default errorMiddleware;
