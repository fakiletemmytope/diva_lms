import Joi from "joi";


const question = Joi.object(
    {
        questionText: Joi.string().required(),
        options: Joi.array().items(
            Joi.string().required()
        ),
        correctAnswer: Joi.number(),
        points: Joi.number()
    }
)

export const quizCreate = Joi.object(
    {
        title: Joi.string().required(),
        instructions: Joi.array().items(
            Joi.string().required()
        ).required(),
        quiz_type: Joi.string().valid("auto-grading", "self-grading", "partial-grading").required(),
        totalPoints: Joi.number().required(),
        timeLimit: Joi.number(),
        questions: Joi.array().items(question).required(),
        lesson_id: Joi.string().required()
    }
)


export const quizUpdate = Joi.object(
    {
        title: Joi.string(),
        instructions: Joi.array().items(
            Joi.string().required()
        ),
        quiz_type: Joi.string().valid("auto-grading", "self-grading", "partial-grading"),
        totalPoints: Joi.number(),
        timeLimit: Joi.number(),
        questions: Joi.array().items(question)
    }
)
