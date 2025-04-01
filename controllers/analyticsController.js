import { dbClose, dbConnect } from "../database/dbConnect.js"
import { CourseModel } from "../schema/course.js"
import { UserModel } from "../schema/user.js"
import { LessonModel } from "../schema/lesson.js"

export const users_analytics = async (req, res) => {
    try {
        await dbConnect()
        const total_numbers_of_users = await UserModel.aggregate(
            [
                {
                    $group: {
                        _id: null,
                        number_of_user: { $sum: 1 }
                    }
                }

            ]
        )
        const number_of_based_on_roles = await UserModel.aggregate(
            [
                {
                    $group: {
                        _id: "$userType",
                        number_of_users: { $sum: 1 }
                    }
                }

            ]
        )
        const number_of_based_on_status = await UserModel.aggregate(
            [
                {
                    $group: {
                        _id: "$status",
                        number_of_users: { $sum: 1 }
                    }
                }

            ]
        )
        res.status(200).json({
            "Total users": total_numbers_of_users,
            "Number of user based on role": number_of_based_on_roles,
            "Number of users based on status": number_of_based_on_status
        })

    } catch (error) {
        res.status(500).send(error.message)
    } finally {
        dbClose()
    }
}


export const courses_analytics = async (req, res) => {
    try {
        await dbConnect()
        const total_numbers_of_courses = await CourseModel.aggregate(
            [
                {
                    $group: {
                        _id: null,
                        number_of_courses: { $sum: 1 }
                    }
                }

            ]
        )
        const total_numbers_of_courses_by_instructor = await CourseModel.aggregate(
            [
                {
                    $group: {
                        _id: "$instructor",
                        number_of_courses: { $sum: 1 }
                    }
                }

            ]
        )

        const number_of_lessons_per_course = await CourseModel.aggregate(
            [
                {
                    $project: {
                        _id: 1,
                        "Number of Lessons": { $size: "$lessons" } // Calculate the number of lessons here
                    }
                }
            ]

        )

        res.status(200).json({
            "Total users": total_numbers_of_courses,
            "Number of courses by Instructor": total_numbers_of_courses_by_instructor,
            "Number of lessons per course": number_of_lessons_per_course
        })
    } catch (error) {
        res.status(500).send(error.message)
    } finally {
        dbClose()
    }
}


export const lessons_analytics = async (req, res) => {
    try {
        await dbConnect()
        const total_numbers_of_lessons = await LessonModel.aggregate(
            [
                {
                    $group: {
                        _id: null, number_of_lessons: { $sum: 1 }
                    }
                }

            ]
        )

        res.status(200).json({
            "Total users": total_numbers_of_lessons
        })
    } catch (error) {
        res.status(500).send(error.message)
    } finally {
        dbClose()
    }
}