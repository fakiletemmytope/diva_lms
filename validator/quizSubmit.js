import Joi from "joi";

const answer = Joi.object(
    {
        questionIndex: Joi.number().required(),
        selectedOption: Joi.number().required()
    }
)

const providedAnswer = Joi.object(
    {
        questionIndex: Joi.number().required(),
        answer: Joi.string().required()
    }
)
export const quizSubmit = Joi.object(
    {
        quiz_id: Joi.string().required(),
        lesson_id: Joi.string().required(),
        obj_answers: Joi.array().items(answer),
        theory_answers: Joi.array().items(providedAnswer),
        submission_links: Joi.array().items(
            Joi.string()
        ),
        maxScore: Joi.number().required(),
        quiz_type: Joi.string().valid("auto-grading", "self-grading", "partial-grading").required()
    }
)