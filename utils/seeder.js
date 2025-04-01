import {
    generate_a_random_course,
    generate_a_random_user,
    generate_a_random_lesson,
    generateMultipleUsers,
    generateMultipleCourses,
    generateMultipleLessons
} from "./faker.js";
import supertest from "supertest";
import { dbClose, dbConnect } from "../database/dbConnect.js"
import { UserModel } from "../schema/user.js";
import { CourseModel } from "../schema/course.js";
import { LessonModel } from "../schema/lesson.js";
import { EnrollmentModel } from "../schema/enrollment.js"
import { hash_password } from "./passwd.js";
import { faker } from "@faker-js/faker";



const seed_users = async (number = 1, status = null, usertype = null) => {
    try {
        await dbConnect()
        if (number > 1) {
            const users = await generateMultipleUsers(number, status, usertype)
            const saved_users = await UserModel.insertMany(users)
            return saved_users
        } else {
            const user = await generate_a_random_user(usertype)
            if (user.userType === 'instructor"')
                user.bio = faker.lorem.sentence(10)
            user.status = status
            user.password = await hash_password(user.password)
            const saved_user = await UserModel.create(user)
            return saved_user
        }
    } catch (error) {
        console.log(error.message)
    }
}

//await seed_users(1, "active", "admin")


const seed_courses = async (number = 1, instructor_id = null) => {
    try {
        await dbConnect()
        if (instructor_id) {
            //generate courses
            const courses = await generateMultipleCourses(number)
            const courses_with_instructor = courses.map(course => {
                course.instructor = instructor_id
                return course
            })

            //save courses
            const saved_courses = await CourseModel.insertMany(courses_with_instructor)
            //get the user
            const user = await UserModel.findById(instructor_id)
            //add courses to user
            user.courses.push(...saved_courses)
            await user.save()
            return ({ user, saved_courses })

        } else {
            //create a random instructor and generate courses
            const instructor = await seed_users(1, "active", "instructor")
            //generate courses for the instructor
            const courses = await generateMultipleCourses(number)
            const courses_with_instructor = courses.map(course => {
                course.instructor = instructor._id
                return course
            })
            //save courses
            const saved_courses = await CourseModel.insertMany(courses_with_instructor)
            //get the user
            const user = await UserModel.findById(instructor._id)
            //add courses to user
            user.courses.push(...saved_courses)
            await user.save()
            return ({ user, saved_courses })
        }
    } catch (error) {
        console.log(error.message)
    } finally {
        dbClose()
    }
}

// console.log(await seed_courses(7, "67bb77cc0db8adf94a059545"))
const seed_lessons = async (number, course_id) => {
    try {
        await dbConnect()
        if (course_id) {
            //get course by course id
            const course = await CourseModel.findById(course_id)
            //generate lessons for the course
            const lessons = await generateMultipleLessons(number, course.instructor, course_id)
            //save lessons
            const saved_lessons = await LessonModel.insertMany(lessons)
            //push lessons into course
            course.lessons.push(...saved_lessons)
            //save course
            await course.save()
            //return course and lessons
            return ({ course, saved_lessons })
        }
        else {
            const user = await seed_users(1, "active", "instructor")
            const course = await seed_courses(1, user._id)
            //generate lessons for the course
            const lessons = await generateMultipleLessons(number, user._id, course.saved_courses[0]._id)
            //save lessons
            const saved_lessons = await LessonModel.insertMany(lessons)
            //push lessons into course
            course.lessons.push(...saved_lessons)
            //save course
            await course.save()
            //return course and lessons
            return ({ course, saved_lessons })
        }

    } catch (error) {
        console.log(error.message)
    } finally {
        dbClose()
    }
}

// console.log(await seed_lessons(2, "67bb8420273675dd0662c1dd"))

const seed_enrollments = async (course_ids = [], student_id = null) => {
    if (course_ids.length > 0 || student_id) {
        dbConnect()
        const enroll = await EnrollmentModel.create({ courses: course_ids, user: user_id })
        return enroll
    }
    else if (student_id || course_ids.length == 0) {
        //generate course
        const courses_with_instructor = await seed_courses(3)
        //
        const course_ids = []
        courses_with_instructor.saved_courses.map(e => {
            course_ids.push(e._id)
        })
        dbConnect()
        const enroll = await EnrollmentModel.create({ courses: course_ids, user: student_id })
        return enroll
    }
    else {
        const user = await seed_users(1, "active", "student")
        const courses_with_instructor = await seed_courses(3)
        const course_ids = []
        courses_with_instructor.saved_courses.map(e => {
            course_ids.push(e._id)
        })
        dbConnect()
        const enroll = await EnrollmentModel.create({ courses: course_ids, user: user._id })
        return enroll
    }
}

export {
    seed_courses,
    seed_enrollments,
    seed_lessons,
    seed_users,
}





