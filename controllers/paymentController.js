import { EnrollmentModel } from "../schema/enrollment.js";
import config from "../config.js";
import crypto from 'crypto';
import { CourseModel } from "../schema/course.js";
import { dbClose, dbConnect } from "../database/dbConnect.js";
import { ProgressModel } from "../schema/progress.js";
import { PaymentModel } from "../schema/payment.js";

const secret = config.paystack.secret



export const webhook = async (req, res) => {

    try {
        const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
        if (hash == req.headers['x-paystack-signature']) {
            const event = req.body
            if (event.event === "charge.success") {
                const ref = event.data.reference.split("-")
                const [user_id, course_id] = ref
                console.log(user_id, course_id)
                await dbConnect()
                await PaymentModel.findOneAndUpdate(
                    { reference: event.data.reference },
                    { payment_status: "success" }
                )
                const course = await CourseModel.findById(course_id)
                await EnrollmentModel.findOneAndUpdate(
                    { user: user_id },
                    { $addToSet: { courses: course_id } },
                    { upsert: true, new: true }
                )
                course.students.push(user_id)
                await course.save()
                await ProgressModel.create({ user_id: user_id, course_id })
                console.log("success")
            }
            res.sendStatus(200);
        }
        else {
            res.sendStatus(400);
        }

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
    finally {
        await dbClose()
    }
}