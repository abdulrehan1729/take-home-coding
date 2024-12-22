import { Request, Response, NextFunction } from "express";
import Joi, { Schema } from "joi";

/**
 * Middleware to validate requests using Joi
 * @param {Schema} schema - The Joi schema to validate against
 * @param {"body" | "query" | "params"} [property="body"] - The part of the request to validate
 */
export const validateRequest = (schema: Schema, property: "body" | "query" | "params" = "body") => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req[property], { abortEarly: false });

        if (error) {
            const errors = error.details.map((err) => err.message);
            res.status(400).json({
                message: "Validation error",
                errors,
            });
            return;
        }

        next();
    };
};
