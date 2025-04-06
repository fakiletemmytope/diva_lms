import { dbClose, dbConnect } from "../database/dbConnect.js"
import { UserModel } from "../schema/user.js"
import { EnrollmentModel } from "../schema/enrollment.js"
import { CourseModel } from "../schema/course.js"
import { LessonModel } from "../schema/lesson.js"
import { InstructorModel } from "../schema/instructor.js"
import { hash_password } from "../utils/passwd.js"


export const syncDb = async () => {
    try {
        await dbConnect()
        await UserModel.syncIndexes()
        await EnrollmentModel.syncIndexes()
        await CourseModel.syncIndexes()
        await LessonModel.syncIndexes()
        await InstructorModel.syncIndexes()
        const admin = await UserModel.findOne(
            { userType: "admin" }
        )
        if (!admin) {
            const user = {
                first_name: "Admin",
                last_name: "Admin",
                userType: "admin",
                email: "admin@example.com",
                status: "active",
                password: await hash_password("*.Admin1.*")
            }
            await UserModel.create(user)
        }
        console.log("db initiated")
    } catch (error) {
        console.log(error.message)
    }
    finally {
        dbClose()
    }

}