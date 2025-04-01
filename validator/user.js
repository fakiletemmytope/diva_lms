import Joi from "joi"


export const userCreate = Joi.object(
    {
        first_name: Joi.string().min(3).required(),
        last_name: Joi.string().min(3).required(),
        password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[*.,()@/])[a-zA-Z0-9*.,()@/]{8,}$')).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        bio: Joi.string(),
        userType: Joi.string().valid('admin', 'student', 'instructor')
    }
)


export const userUpdate = Joi.object(
    {
        first_name: Joi.string().min(3),
        last_name: Joi.string().min(3),
        password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[*.,()@/])[a-zA-Z0-9*.,()@/]{8,}$'))
    }
).min(1)

