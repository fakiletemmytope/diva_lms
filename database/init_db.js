import { dbClose, dbConnect} from "../database/dbConnect.js"
import { UserModel } from "../schema/user.js"
import { EnrollmentModel } from "../schema/enrollment.js"
import { CourseModel } from "../schema/course.js"
import { LessonModel } from "../schema/lesson.js"
import { InstructorModel } from "../schema/instructor.js"


export const syncDb = async () =>{
    try{
        await dbConnect()
        await UserModel.syncIndexes()
        await EnrollmentModel.syncIndexes()
        await CourseModel.syncIndexes()
        await LessonModel.syncIndexes()
        await InstructorModel.syncIndexes()
        console.log("db initiated")
    }catch(error){
        console.log(error.message)
    }
    finally{
        dbClose()
    }
    
}