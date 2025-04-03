import { Router } from "express";
import { isAdminOrInstructor, isInstructor, authenticate, isStudent } from "../middleware/authenticate.js"
import {
    get_lesson,
    get_lessons,
    create_lesson,
    update_lesson,
    delete_lesson,
    update_lesson_progress
} from "../controllers/lessonController.js";
import { validate_lessonCreate, validate_lessonUpdate } from "../middleware/validate.js";
import { upload_resources } from "../controllers/lessonController.js";
import multer from "multer"

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const router = Router()

router.get('/', authenticate, get_lessons)
router.get('/:lesson_id', authenticate, get_lesson)
router.post('/', authenticate, isInstructor, validate_lessonCreate, create_lesson)
router.put('/:lesson_id', authenticate, isAdminOrInstructor, validate_lessonUpdate, update_lesson)
router.delete('/:lesson_id', authenticate, isAdminOrInstructor, delete_lesson)
router.post("/:lesson_id/upload", authenticate, isAdminOrInstructor, upload.array('resources'), upload_resources)
router.put("/:lesson_id/progress", authenticate, isStudent, update_lesson_progress)

export const lesson_router = router