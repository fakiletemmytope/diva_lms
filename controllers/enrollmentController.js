import { dbClose, dbConnect } from "../database/dbConnect.js"
import { CourseModel } from "../schema/course.js"
import { EnrollmentModel } from "../schema/enrollment.js"
import { UserModel } from "../schema/user.js"

const enroll = async (req, res) => {
    const course_id = req.params.courseId
    const student_id = req.decode._id
    try {
        await dbConnect()
        const course = await CourseModel.findById(course_id)
        const user = await UserModel.findById(student_id)
        if (!course) return res.status(404).send("Course not found")
        const enroll = new EnrollmentModel(
            { user: student_id }
        )
        const enrolled = await enroll.save()
        enrolled.courses.push(course)
        await enrolled.save()
        course.students.push(user)
        await course.save()
        res.status(200).json(enrolled)

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
        let enrollment = null // Initialize to null
        if (role === "admin") {
            await dbConnect();
            const course = await CourseModel.findById(course_id).populate("students")
            enrollment = {
                id: course.id,
                students: course.students.map(student => ({
                    _id: student._id,
                    first_name: student.first_name,
                    last_name: student.last_name,
                    email: student.email
                }))
            }
        } else if (role === "instructor") {
            await dbConnect();
            const course = await CourseModel.findOne({ _id: course_id, instructor: req.decode._id }).populate("students");
            const enrollment = {
                id: course.id,
                students: course.students.map(student => ({
                    _id: student._id,
                    first_name: student.first_name,
                    last_name: student.last_name,
                    email: student.email
                }))
            }
            if (!enrollment) return res.status(403).json({ message: "Unauthorized User" })
        }

        res.status(200).json(enrollment);
    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }
}


const get_all_enrollments = async (req, res) => {
    try {
        await dbConnect()
        const courses = await CourseModel.find({}).populate("students")
        const enrollments = []
        courses.map((course) => {
            const enrollment = {
                id: course.id,
                students: course.students.map(student => ({
                    _id: student._id,
                    first_name: student.first_name,
                    last_name: student.last_name,
                    email: student.email
                }))
            }
            enrollments.push(enrollment)
        })
        res.status(200).json(enrollments)
    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }
}

export { enroll, get_course_enrollments, get_all_enrollments }