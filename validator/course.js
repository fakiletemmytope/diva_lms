import Joi from "joi";

export const course_create = Joi.object(
    {
        title: Joi.string().required(),
        description: Joi.string().required(),
        duration: Joi.string(),
        price: Joi.string().required()
    }
)


export const course_update = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    duration: Joi.string(),
    price: Joi.string()
}).min(1)