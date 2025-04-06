import { dbClose, dbConnect } from "../database/dbConnect.js"
import { LessonModel, LessonProgressModel } from "../schema/lesson.js"
import { EnrollmentModel } from "../schema/enrollment.js"
import { upload_image } from "../utils/upload_image.js"
import { CourseModel } from "../schema/course.js"
import { QuizSubmissionModel } from "../schema/quiz.js"


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
                    const course = e.courses;
                    const lesson = await LessonModel.find({ course_id: course });
                    lessons.push(...lesson)
                })

                await Promise.all(lessonPromises);
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
        const course = await CourseModel.findOne({ _id: course_id, instructor: instructor_id })
        if (!course) return res.status(403).send("Course not found or user is forbidden from creating lessons for this course")
        const lesson = await LessonModel.create({ topic, objectives, lessonType, resources, instructor_id, course_id })
        course.lessons.push(lesson)
        await course.save()
        res.status(200).json(lesson)
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

        updated_lesson ? res.status(200).json(updated_lesson) : res.status(404).send("Lesson not found or lesson cannot be updated by this user")

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

export const update_lesson_progress = async (req, res) => {
    const { isResourcesViewed } = req.body
    const user_id = req.decode._id
    const lesson_id = req.params.lesson_id

    try {
        await dbConnect();

        const lesson = await LessonModel.findById(lesson_id);
        if (!lesson) return res.status(404).send("Lesson not found");

        const enrolled = await EnrollmentModel.findOne({ user: user_id, courses: { $in: [lesson.course_id] } });
        if (!enrolled) return res.status(401).send("Student not enrolled for the course");

        const quiz = await QuizSubmissionModel.findOne({ lesson_id, user_id });
        const isQuizPassed = quiz?.isPassed || false;
        const progress = await LessonProgressModel.findOneAndUpdate(
            { user_id, lesson_id },
            { isResourcesViewed, isQuizPassed, isCompleted: isQuizPassed && isResourcesViewed },
            { upsert: true, new: true }  // Create a new document if it doesn't exist
        );

        res.status(200).json(progress);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    } finally {
        await dbClose();
    }
};


export { get_lesson, get_lessons, create_lesson, update_lesson, delete_lesson }