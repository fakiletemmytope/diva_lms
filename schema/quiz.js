import mongoose from "mongoose";
import { LessonProgressModel } from "./lesson.js";

const { model, Schema } = mongoose

const QuestionSchema = new Schema(
    {
        questionText: { type: String, required: true },
        options: [{ type: String, required: false }],
        correctAnswer: { type: Number, required: false },
        points: { type: Number, default: 1 }
    }, { _id: false }
)

const QuizType = {
    AUTO_GRADING: "auto-grading",
    SELF_GRADING: "self-grading",
    PARTIAL_GRADiING: "partial-grading"
}


//quiz schema
const QuizSchema = new Schema(
    {
        title: { type: String, required: true },
        instructions: [{ type: String, }],
        lesson_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Lesson' },
        instructor_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        questions: { type: [QuestionSchema], required: true },
        quiz_type: { type: String, enum: Object.values(QuizType), required: true },
        totalPoints: { type: Number, default: 0 },
        timeLimit: { type: Number, required: false }
    },
    { timestamps: true }
);

QuizSchema.index({ lesson_id: 1 }, { unique: true })

export const QuizModel = model('Quiz', QuizSchema);



const AnswerSchema = new Schema(
    {
        questionIndex: { type: Number, required: true }, // Index of question in Quiz
        selectedOption: { type: Number, required: true } // Index of selected option
    }, { _id: false }
)

const ProvidedAnswerSchema = new Schema(
    {
        questionIndex: { type: Number, required: true }, // Index of question in Quiz
        answer: { type: String, required: true } // Index of selected option
    }, { _id: false }
)


//quiz-submission schema
const QuizSubmissionSchema = new Schema(
    {
        quiz_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Quiz' },
        lesson_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Lesson' },
        user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        obj_answers: { type: [AnswerSchema], required: false },
        theory_answers: { type: [ProvidedAnswerSchema], required: false },
        submission_links: [{ type: String, required: false }],
        score: { type: Number, default: 0 }, // Calculated score
        maxScore: { type: Number, required: true }, // Total possible points
        submittedAt: { type: Date, default: Date.now },
        isPassed: { type: Boolean, default: false },
        isGraded: { type: Boolean, default: false }
    },
    { timestamps: true }
);

QuizSubmissionSchema.index({ quiz_id: 1, user_id: 1 }, { unique: true })


//define a post hook
QuizSubmissionSchema.post('findOneAndUpdate', async (doc) => {
    const { user_id, lesson_id, isPassed } = doc
    await LessonProgressModel.findOneAndUpdate(
        { user_id: user_id, lesson_id: lesson_id },
        { isQuizPassed: isPassed },
        { upsert: true, new: true }
    )
})
export const QuizSubmissionModel = model('QuizSubmission', QuizSubmissionSchema);