import Joi from "joi";

export const getMoviesByYearSchema = Joi.object({
    year: Joi.string()
        .pattern(/^\d{4}$/)
        .required()
        .messages({
            "string.pattern.base": "Year must be in YYYY format.",
            "string.empty": "Year is required.",
        }),
    page: Joi.number().integer().min(1).optional().default(1).messages({
        "number.base": "Page must be a number.",
        "number.min": "Page must be greater than or equal to 1.",
    }),
});
