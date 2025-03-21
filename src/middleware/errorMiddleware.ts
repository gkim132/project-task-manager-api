import e, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler
} from "express";

const errorMiddleware: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error!!!:", err);

  if (err.name === "ValidationError") {
    res.status(400).json({
      status: "error",
      message: err.errors.join(", ")
    });
    return;
  }

  if (err.name === "JsonWebTokenError") {
    res.status(401).json({
      status: "error",
      message: "Invalid token. Please log in again"
    });
    return;
  }

  if (err.name === "TokenExpiredError") {
    res.status(401).json({
      status: "error",
      message: "Token expired. Please log in again"
    });
  }

  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Something went wrong"
  });
  return;
};

export default errorMiddleware;
