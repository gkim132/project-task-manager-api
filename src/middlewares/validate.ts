import { Request, Response } from "express";
import { AnyObjectSchema } from "yup";

const validate =
    (schema: AnyObjectSchema) => async (req: Request, res: Response, next) => {
        try {
            await schema.validate(req.body, { abortEarly: false });
            next();
        } catch (error) {
            res.status(400).json({ status: "error", message: error.errors });
        }
    };

export default validate;
