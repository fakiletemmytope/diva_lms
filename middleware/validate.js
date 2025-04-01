import { auth_validator } from "../validator/auth.js"
import { course_create, course_update } from "../validator/course.js"
import { lessonCreate, lessonUpdate } from "../validator/lesson.js"
import { userCreate, userUpdate } from "../validator/user.js"

export const validate_userCreate = async (req, res, next) => {
    const { error } = userCreate.validate(req.body, { abortEarly: false })
    error ? res.status(422).json(error.details) : next()
}

export const validate_userUpdate = async (req, res, next) => {
    const { error } = userUpdate.validate(req.body, { abortEarly: false })
    error ? res.status(422).json(error.details) : next()
}


export const validate_auth_input = async (req, res, next) => {
    const { error } = auth_validator.validate(req.body, { abortEarly: false })
    error ? res.status(422).json(error.details) : next()
}


export const validate_courseCreate = async (req, res, next) => {
    const { error } = course_create.validate(req.body, { abortEarly: false })
    console.log(error)
    error ? res.status(422).json(error.details) : next()
}

export const validate_courseUpdate = async (req, res, next) => {
    const { error } = course_update.validate(req.body, { abortEarly: false })
    error ? res.status(422).json(error.details) : next()
}

export const validate_lessonCreate = async (req, res, next) => {
    const { error } = lessonCreate.validate(req.body, { abortEarly: false })
    error ? res.status(422).json(error.details) : next()
}

export const validate_lessonUpdate = async (req, res, next) => {
    const { error } = lessonUpdate.validate(req.body, { abortEarly: false })
    error ? res.status(422).json(error.details) : next()
}