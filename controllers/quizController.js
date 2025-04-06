import { dbClose, dbConnect } from "../database/dbConnect.js"
import { EnrollmentModel } from "../schema/enrollment.js"
import { LessonModel } from "../schema/lesson.js"
import { QuizModel, QuizSubmissionModel } from "../schema/quiz.js"


export const get_quiz = async () => {

}

export const create_quiz = async (req, res) => {
    const { title, lesson_id, questions, totalPoints, timeLimit, instructions } = req.body
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
    const { title, instructions, quiz_type, totalPoints, timeLimit, questions } = req.body
    const update = {}
    if (title) update.title = title
    if (instructions) update.instructions = instructions
    if (quiz_type) update.quiz_type = quiz_type
    if (totalPoints) update.totalPoints = totalPoints
    if (timeLimit) update.timeLimit = timeLimit
    if (questions) update.title = questions
    try {
        await dbConnect()
        let quiz = await QuizModel.findById(req.params.id)
        if (!quiz)
            return res.status(401).send("Quiz not found")
        quiz = await QuizModel.findByIdAndUpdate(req.params.id, update, { new: true })
        res.status(200).json(quiz)
    } catch (error) {
        res.status(500).send(error.message)
    }
    finally {
        dbClose()
    }
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

const mark = async (id, answers) => {
    let score = 0;
    await dbConnect();
    const quiz = await QuizModel.findById(id)
    if (!quiz) return "quiz not found"
    answers.forEach(answer => {
        const question = quiz.questions[answer.questionIndex]
        if (question && question.correctAnswer === answer.selectedOption) {
            score = score + question.points;
        }
    });
    return score;
}

const Passed = (score, maxScore) => {
    const percentage = score / maxScore * 100
    return percentage >= 80
}
export const submit_quiz = async (req, res) => {
    const { quiz_id, lesson_id, obj_answers, maxScore, theory_answers, submission_links, quiz_type } = req.body
    const score = (quiz_type === "auto-grading" || quiz_type === "partial-grading") ? await mark(quiz_id, obj_answers) : score = 0
    if (score === "quiz not found") return res.status(403).send("quiz not found")
    const isGraded = (quiz_type === "auto-grading") ? true : false
    const isPassed = (quiz_type === "auto-grading") ? Passed(score, maxScore) : false
    try {
        await dbConnect()
        const quiz = await QuizModel.findOne({ _id: quiz_id, lesson_id: lesson_id })
        if (!quiz) return res.status(403).send("Quiz does not exist")
        const submission = await QuizSubmissionModel.findOneAndUpdate(
            { _id: quiz_id, lesson_id: lesson_id, user_id: req.decode._id, isGraded: { $ne: true } },
            { maxScore, isGraded, score, isPassed, theory_answers, obj_answers, submission_links },
            { upsert: true, new: true }
        )
        //todo: check if student pass and update the lessonprogress(use post hook)
        res.status(210).json(submission)
    } catch (error) {
        if (error.code === 11000) return res.status(500).send("Quiz is already graded")
        res.status(500).send(error)
    } finally {
        await dbClose()
    }
}
