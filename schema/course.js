import mongoose from "mongoose"

const { Schema, model } = mongoose

const CourseSchema = new Schema(
    {
        title: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        duration: { type: String, required: false, default: 0 },
        price: { type: String, required: true },
        instructor: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
        students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        totalLessons: { type: Number, default: 0 }, // Useful for progress tracking
    },
    { timestamps: true }
)


CourseSchema.post('save', async (doc) => {
    const length = doc.lessons.length
    doc.totalLessons = length
    await doc.constructor.findByIdAndUpdate(doc._id, { totalLessons: length });
});

export const CourseModel = model('Course', CourseSchema)