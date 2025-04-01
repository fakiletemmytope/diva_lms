import { Router } from "express";
import { authenticate, unrestricted } from "../middleware/authenticate.js";
import {
    create_course,
    get_courses,
    update_course,
    delete_course,
    get_course
} from "../controllers/courseController.js";
import { isInstructor, isAdminOrInstructor } from "../middleware/authenticate.js";
import { validate_courseCreate, validate_courseUpdate } from "../middleware/validate.js";

const router = Router()


router.get("/", get_courses)

router.get("/:id", unrestricted, get_course)

router.post("/", authenticate, isInstructor, validate_courseCreate, create_course)

router.put("/:id", authenticate, isInstructor, validate_courseUpdate, update_course)

router.delete("/:id", authenticate, isAdminOrInstructor, delete_course)

export const course_router = router