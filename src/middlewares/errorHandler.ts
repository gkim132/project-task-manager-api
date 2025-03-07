import { Request, Response, NextFunction } from "express";

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.error("Error:", err);

    if (err.name === "ValidationError") {
        res.status(400).json({ status: "error", message: err.message });
    }

    res.status(err.statusCode || 500).json({
        status: "error",
        message: err.message || "Internal Server Error",
    });
};

export default errorHandler;
