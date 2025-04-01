import Joi from "joi";

export const lessonCreate = Joi.object(
    {
        topic: Joi.string().required(),
        objectives: Joi.array().items(
            Joi.string()
        ).required(),
        resources: Joi.array().items(
            Joi.object({
                title: Joi.string().required(),
                url: Joi.string().required(),
                type: Joi.string().valid("slide", "interactive", "video").required()
            })
        ),
        course_id: Joi.string().required()
    }
)


export const lessonUpdate = Joi.object(
    {
        topic: Joi.string(),
        objectives: Joi.array().items(
            Joi.string()
        ),
        resources: Joi.array().items(
            Joi.object({
                title: Joi.string().required(),
                url: Joi.string().required(),
                type: Joi.string().valid("slide", "interactive", "video").required()
            })
        ),
    }
).min(1)