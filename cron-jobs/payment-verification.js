import axios from "axios";
import { dbClose, dbConnect } from "../database/dbConnect";
import { PaymentModel } from "../schema/payment";
import { verifyPayment } from "../utils/payment";

export const verify_payments = async () => {
    try {
        await dbConnect()
        const payments = await PaymentModel.find({ payment_status: "pending" })
        const promises = payments.map(async (payment) => {
            const res = await verifyPayment(payment.reference) // Verify payment
            return PaymentModel.findOneAndUpdate({ reference: payment.reference }, { payment_status: res.data.status }) // Update payment status
        })

        console.log(await Promise.all(promises))
        console.log("Verification successful")
    } catch (error) {
        console.error(error.message)
    }
    finally {
        await dbClose()
    }

}