import mongoose from "mongoose"
import { ProgressModel } from "./progress.js";

const { Schema, model } = mongoose

export const ResourceType = {
    VIDEO: 'video',
    INTERACTIVE: 'interactive',
    SLIDE: 'slide'
}


const ResourceSchema = new Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: {
        type: String,
        enum: Object.values(ResourceType),
        required: true
    }
}, { _id: false });


const LessonSchema = new Schema(
    {
        topic: { type: String, required: true },
        objectives: { type: [String], required: true },
        resources: { type: [ResourceSchema], required: false, default: [] },
        instructor_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        course_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' },
        quiz: { type: mongoose.Schema.Types.ObjectId, Ref: 'Quiz' },

    },
    { timestamps: true }
)

LessonSchema.index({ topic: 1, course_id: 1 }, { unique: true });

export const LessonModel = model('Lesson', LessonSchema)



const LessonProgressSchema = new Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        lesson_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Lesson' },
        isResourcesViewed: { type: Boolean, default: false },
        isQuizPassed: { type: Boolean, default: false },
        completedAt: { type: Date, default: Date.now },
        isCompleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

LessonProgressSchema.index({ user_id: 1, lesson_id: 1 }, { unique: true });

LessonProgressSchema.post('findOneAndUpdate', async (doc) => {
    //todo: update the course progress
    const { isResourcesViewed, isQuizPassed, user_id, lesson_id, isCompleted } = doc;

    if (isResourcesViewed && isQuizPassed && !isCompleted) {
        await doc.constructor.updateOne({ _id: doc._id, isCompleted: { $ne: true } }, { isCompleted: true })
        const lesson = await LessonModel.findById(lesson_id)
        const progress = await ProgressModel.findOneAndUpdate(
            { user_id: user_id, course_id: lesson.course_id },
            { $push: { completedLessons: lesson_id } },
            { new: true }
        )
    }

})

export const LessonProgressModel = model('LessonProgress', LessonProgressSchema);