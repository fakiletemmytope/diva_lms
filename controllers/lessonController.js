import { dbClose, dbConnect } from "../database/dbConnect.js"
import { LessonModel } from "../schema/lesson.js"
import { EnrollmentModel } from "../schema/enrollment.js"
import { upload_image } from "../utils/upload_image.js"
import { CourseModel } from "../schema/course.js"


const get_lessons = async (req, res) => {
    const role = req.decode.userType
    try {
        await dbConnect()
        if (role == "admin") {
            const lessons = await LessonModel.find({})
            res.status(200).json(lessons)
        }

        if (role == "instructor") {
            const lessons = await LessonModel.find({ instructor_id: req.decode._id })
            res.status(200).json(lessons)
        }
        if (role == "student") {
            const enrolled = await EnrollmentModel.find({ user: req.decode._id });
            const lessons = [];

            if (enrolled.length > 0) {
                const lessonPromises = enrolled.map(async (e) => {
                    const course = e.course;
                    const lesson = await LessonModel.find({ course_id: course });
                    console.log(lesson)
                    lessons.push(...lesson)
                    // return lesson
                })

                const lessonResults = await Promise.all(lessonPromises);

                // lessonResults.forEach(lessonArray => {
                //     lessons.push(...lessonArray);
                // });
            }
            res.status(200).json(lessons)
        }

    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }

}

const get_lesson = async (req, res) => {
    const role = req.decode.userType
    try {
        await dbConnect();
        const lesson = await LessonModel.findById(req.params.lesson_id)
        if (!lesson) return res.status(404).send("Lesson not found")

        if (role === "admin" || (role === "instructor" && lesson.instructor_id == req.decode._id)) {
            res.status(200).json(lesson)
        }

        if (role === "student") {
            const enrolled = await EnrollmentModel.findOne({ course: lesson.course_id, user: req.decode._id });
            !enrolled ? res.status(404).send("Student not enrolled for the course") : res.status(200).json(lesson)
        }
    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }
}

const create_lesson = async (req, res) => {
    const { topic, objectives, lessonType, resources, course_id } = req.body
    const instructor_id = req.decode._id
    try {
        await dbConnect()
        const lesson = new LessonModel({ topic, objectives, lessonType, resources, instructor_id, course_id })
        const saved_lesson = await lesson.save()
        const course = await CourseModel.findById(course_id)
        course.lessons.push(saved_lesson)
        await course.save()
        res.status(200).json(saved_lesson)
    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }
}


const update_lesson = async (req, res) => {
    const role = req.decode.userType
    const { topic, objectives, lessonType, resources } = req.body
    let update = {}
    if (topic) update.topic = topic
    if (objectives) update.objectives = objectives
    if (lessonType) update.lessonType = lessonType
    if (resources) update.resources = resources
    try {
        await dbConnect()
        let updated_lesson = null

        if (role === "admin") {
            updated_lesson = await LessonModel.findOneAndUpdate(
                { _id: req.params.lesson_id },
                update,
                { new: true }
            )
        } else if (role === "instructor") {
            updated_lesson = await LessonModel.findOneAndUpdate(
                { _id: req.params.lesson_id, instructor_id: req.decode._id },
                update,
                { new: true }
            )
        }

        updated_lesson ? res.status(200).json(updated_lesson) : res.status(404).send("Lesson not found or not updated")

    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }

}

const delete_lesson = async (req, res) => {
    const role = req.decode.userType
    try {
        await dbConnect()
        let deleted_lesson = null
        if (role === "admin") {
            deleted_lesson = await LessonModel.findOneAndDelete({ _id: req.params.lesson_id })

        }

        if (role === "instructor") {
            deleted_lesson = await LessonModel.findOneAndDelete({ _id: req.params.lesson_id, instructor_id: req.decode._id })
        }

        !deleted_lesson ? res.status(404).send("Lesson not found") : res.status(200).send("Lesson deleted")

    } catch (error) {
        res.status(400).send(error.message)
    } finally {
        dbClose()
    }
}

export const upload_resources = async (req, res) => {

    try {
        await dbConnect()
        const lesson = await LessonModel.findById(req.params.lesson_id)
        console.log(lesson)
        if (lesson) {
            if (req.decode.userType === "admin" || (req.decode.userType === "instructor" && req.decode._id == lesson.instructor_id)) {
                console.log(lesson)
                const uploadPromises = req.files.map(async (file) => {
                    // Convert the file buffer to a Base64 data URI
                    // console.log(file)
                    const base64Image = file.buffer.toString('base64');
                    const imageDataURI = `data:${file.mimetype};base64,${base64Image}`;

                    // Upload to Cloudinary
                    const result = await upload_image(imageDataURI);
                    // console.log(result)
                    const resource_details = {
                        title: file.originalname,
                        url: result.secure_url
                    }
                    return resource_details // Return the URL for each uploaded file
                });

                const imageUrls = await Promise.all(uploadPromises);
                const resources = lesson.resources.concat(imageUrls)
                // console.log(resources)
                const update_with_resources = await LessonModel.findByIdAndUpdate(
                    req.params.lesson_id, { resources: resources },
                    { new: true }
                )
                res.json({ update_with_resources });
            }
            else {
                res.status(403).send("Unauthorised user")
            }

        }
        else {
            res.status(403).send('Lesson not found');
        }
    } catch (error) {
        res.status(500).send('Upload failed', error.message);
    }
}


export { get_lesson, get_lessons, create_lesson, update_lesson, delete_lesson }