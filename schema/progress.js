import mongoose from "mongoose";

const { model, Schema } = mongoose

const ProgressSchema = new Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        course_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' },
        completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
        progressPercentage: { type: Number, default: 0, min: 0, max: 100 }
    },
    { timestamps: true }
);

ProgressSchema.index({ user_id: 1, course_id: 1 }, { unique: true });

export const ProgressModel = model('Progress', ProgressSchema);