import mongoose from "mongoose";

const { model, Schema } = mongoose

const QuestionSchema = new Schema(
    {
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }], // Multiple-choice options
        correctAnswer: { type: Number, required: true }, // Index of correct option (0-based)
        points: { type: Number, default: 1 } // Points awarded for correct answer
    }, { _id: false }
)
const QuizSchema = new Schema(
    {
        title: { type: String, required: true },
        lesson_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Lesson' },
        instructor_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        questions: { type: [QuestionSchema], required: true },
        totalPoints: { type: Number, default: 0 }, // Sum of all question points
        timeLimit: { type: Number, required: false } // Time limit in minutes (optional)
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

const QuizSubmissionSchema = new Schema(
    {
        quiz_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Quiz' },
        lesson_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Lesson' },
        user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        answers: { type: [AnswerSchema], required: true },
        score: { type: Number, default: 0 }, // Calculated score
        maxScore: { type: Number, required: true }, // Total possible points
        submittedAt: { type: Date, default: Date.now },
        isPassed: { type: Boolean, default: false },
        isGraded: { type: Boolean, default: false }
    },
    { timestamps: true }
);

QuizSubmissionSchema.index({ quiz_id: 1, user_id: 1 }, { unique: true }); // Prevent multiple submissions

export const QuizSubmissionModel = model('QuizSubmission', QuizSubmissionSchema);