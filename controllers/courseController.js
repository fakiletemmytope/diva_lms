import { decode } from "jsonwebtoken"
import { dbClose, dbConnect } from "../database/dbConnect.js"
import { course_router } from "../routes/course.js"
import { CourseModel } from "../schema/course.js"
import { UserModel } from "../schema/user.js"

const get_courses = async (req, res) => {
    try {
        await dbConnect()
        const courses = await CourseModel.find({}, "title instructor duration _id price description")
        res.status(200).json(courses)
    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }
}

const get_course = async (req, res) => {
    const id = req.params.id
    console.log(req.decode)
    try {
        await dbConnect()
        let course = await CourseModel.findById(id, "title instructor duration _id price description")
        if (!course)
            return res.status(404).send("Course cannot be found")

        if (req.decode) {
            if (req.decode.userType === 'admin') {
                course = await CourseModel.findById(id, "title instructor duration lessons students _id price description").populate('lessons').populate('students')
            }
            else if (req.decode.userType === 'instructor') {
                console.log(course.instructor.toString(),)
                if (course.instructor.toString() == req.decode._id) {
                    course = await CourseModel.findById(id, "title instructor duration lessons _id price description students").populate('lessons').populate('students')
                }
            }
            else {
                const id = course.students.filter(v => v == req.decode._id)
                if (id.length == 1) {
                    course = await CourseModel.findById(id, "title instructor duration lessons _id price description").populate('lessons')
                }
            }

        }
        res.status(200).json(course)
    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }
}


const create_course = async (req, res) => {
    const { title, description, price, duration } = req.body
    const instructor = req.decode._id
    try {
        await dbConnect()
        const savedCourse = await CourseModel.create({
            title, description, price, duration, instructor
        })
        const user = await UserModel.findById(req.decode._id)
        user.courses.push(savedCourse)
        await user.save()
        res.status(200).json(savedCourse)
    } catch (err) {
        res.status(400).send(err.message)
    } finally {
        dbClose()
    }
}

const update_course = async (req, res) => {
    const { title, description, duration, price } = req.body
    const update = {}
    if (title) update.title = title
    if (description) update.description = description
    if (duration) update.duration = duration
    if (price) update.price = price
    try {
        await dbConnect()
        const course = await CourseModel.findById(req.params.id)
        if (!course)
            return res.status(404).send("Course not found")
        let updated_course = null
        if (req.decode.userType === "admin") {
            updated_course = await CourseModel.findOneAndUpdate(
                { _id: req.params.id },
                update,
                { new: true }
            )
        } else if (req.decode.userType === "instructor") {
            updated_course = await CourseModel.findOneAndUpdate(
                { _id: req.params.id, instructor: req.decode._id },
                update,
                { new: true }
            )
        }
        updated_course ? res.status(200).json(updated_course) : res.status(403).send("Unauthorised User, course cannot be updated")

    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }
}

const delete_course = async (req, res) => {
    try {
        await dbConnect()
        const course = await CourseModel.findById(req.params.id)
        if (!course)
            return res.status(404).send("Course not found")
        if (req.decode.userType === "admin") {
            const deleted_course = await CourseModel.findOneAndDelete(
                { _id: req.params.id }
            )
            !deleted_course ? res.status(404).send("Unauthorised user, course cannot be deleted") : res.status(204).send("Course deleted")
        }
        if (req.decode.userType === "instructor") {
            const deleted_course = await CourseModel.findOneAndDelete(
                { _id: req.params.id, instructor: req.decode._id }
            )
            !deleted_course ? res.status(404).send("Unauthorised user, course cannot be deleted") : res.status(204).send("Course deleted")
        }
    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }
}

export { get_course, get_courses, update_course, delete_course, create_course }