import mongoose from "mongoose";
import { CourseModel } from "./course.js";

const { model, Schema } = mongoose

const CourseProgressSchema = new Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        course_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' },
        completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', default: [] }],
        progressPercentage: { type: Number, default: 0, min: 0, max: 100 }
    },
    { timestamps: true }
);

CourseProgressSchema.index({ user_id: 1, course_id: 1 }, { unique: true });
CourseProgressSchema.post('findOneAndUpdate', async (doc) => {
    //get the number of lessons in the course
    const course = await CourseModel.findById(doc.course_id)
    const total_no_of_lessons = course.lessons.length
    const percent = doc.completedLessons.length / total_no_of_lessons * 100
    await doc.constructor.updateOne({ _id: doc.id }, { progressPercentage: percent })
})

export const ProgressModel = model('CourseProgress', CourseProgressSchema)