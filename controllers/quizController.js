import { dbClose, dbConnect } from "../database/dbConnect.js"
import { LessonModel } from "../schema/lesson.js"
import { QuizModel, QuizSubmissionModel } from "../schema/quiz.js"


export const get_quiz = async () => {

}

export const create_quiz = async (req, res) => {
    const { title, lesson_id, questions, totalPoints, timeLimit } = req.body
    const instructor_id = req.decode._id
    try {
        await dbConnect()
        const lesson = await LessonModel.findById(lesson_id)
        if (!lesson) return res.status(404).send("lesson not found")
        if (lesson.instructor_id.toString() !== instructor_id) return res.status(403).send("This user is not allowed to create quiz for this lesson")
        const quiz = await QuizModel.create({ title, lesson_id, questions, totalPoints, timeLimit, instructor_id })
        res.status(201).json(quiz)
    } catch (error) {
        res.status(500).send(error.message)
    } finally {
        await dbClose()
    }
}

export const update_quiz = async (req, res) => {

}

export const delete_quiz = async (req, res) => {
    const id = req.params.id
    const instructor_id = req.decode._id

    try {
        await dbConnect()
        const quiz = await QuizModel.findById(id)
        if (!quiz)
            return res.status(401).send("Quiz not found")
        const deleted_quiz = await QuizModel.findOneAndDelete({ _id: id, instructor_id: instructor_id })
        deleted_quiz ? res.status(204).send() : res.status(403).send("Unauthorized user, quiz not deleted")

    } catch (error) {
        res.status(500).send(error.message)
    } finally {
        dbClose()
    }
}

export const submit_quiz = async (req, res) => {
    const { quiz_id, lesson_id, answers, score, maxScore, isGraded } = req.body
    try {
        await dbConnect()
        const quiz = await QuizModel.findOne({ _id: quiz_id, lesson_id: lesson_id })
        if (!quiz) return res.status(403).send("Quiz does not exist")
        const submission = QuizSubmissionModel.findOneAndUpdate(
            { _id: quiz_id, lesson_id: lesson_id, user_id: req.decode._id },
            { answers, maxScore, isGraded, score },
            { upsert: true, new: true }
        )

    } catch (error) {
        res.status(500).send(error.message)
    } finally {
        await dbClose()
    }


}