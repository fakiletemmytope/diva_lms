import mongoose from "mongoose"

const { Schema, model } = mongoose

const EnrollmentSchema = new Schema(
    {
        courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
    },
    { timestamps: true }
)

EnrollmentSchema.index({ courses: 1, user: 1 }, { unique: true });

export const EnrollmentModel = model('Enrollment', EnrollmentSchema)