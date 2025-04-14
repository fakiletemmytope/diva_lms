import mongoose from "mongoose"


const { model, Schema } = mongoose

const PaymentStatus = {
    CANCELLED: 'cancelled',
    PENDING: 'pending',
    FAILED: 'failed',
    SUCCESS: 'success'
}

const paymentSchema = new Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        course_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' },
        amount: { type: Number, required: true },
        payment_status: {
            type: String,
            enum: Object.values(PaymentStatus),
            required: true,
            default: PaymentStatus.PENDING
        },
        reference: { type: String, unique: true, required: true }
    },
    { timestamps: true }
)

export const PaymentModel = model('Payment', paymentSchema)