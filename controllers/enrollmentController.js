import { dbClose, dbConnect } from "../database/dbConnect.js"
import { CourseModel } from "../schema/course.js"
import { EnrollmentModel } from "../schema/enrollment.js"
import { PaymentModel } from "../schema/payment.js"
import { ProgressModel } from "../schema/progress.js"
import { generatePayment } from "../utils/payment.js"

const enroll = async (req, res) => {
    const course_id = req.params.courseId
    const user_id = req.decode._id
    const user_email = req.decode.email
    try {
        await dbConnect()
        const enrolled = await EnrollmentModel.findOne({
            user: user_id,
            courses: { $in: [course_id] }
        })
        if (enrolled) return res.status(404).send("User already enrolled for this course")
        const course = await CourseModel.findById(course_id)
        if (!course) return res.status(404).send("Course not found")

        //Todo: implement payment
        const amount = 5000
        const reference = `${user_id}-${course_id}-${Date.now()}`
        const { response, error } = await generatePayment(user_email, amount, reference)
        if (error) return res.status(400).json(error)
        await PaymentModel.create({ course_id, user_id, reference, amount })
        res.status(200).json(response.data)
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }

}

const get_course_enrollments = async (req, res) => {
    const course_id = req.params.courseId
    const role = req.decode.userType
    try {
        await dbConnect();
        const enrollment = await EnrollmentModel
            .find({ courses: { $in: [course_id] } })
            .populate({ path: "user", select: "-email -password -createdAt -updatedAt -courses" })
        const course = await CourseModel.findOne({ _id: course_id, instructor: req.decode._id })
        if (role === "admin" || (role === "instructor" && course)) res.status(200).json(enrollment)
        else res.status(403).json({ message: "Unauthorized User" })
    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }
}

const get_all_enrollments = async (req, res) => {
    const user = req.query.user_id
    try {
        await dbConnect()
        const enrollments = !user ? await EnrollmentModel.find({}) : await EnrollmentModel.find({ user: user })
        res.status(200).json(enrollments)
    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }
}

export { enroll, get_course_enrollments, get_all_enrollments }