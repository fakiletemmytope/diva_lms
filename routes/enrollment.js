import { Router } from "express";
import { enroll, get_course_enrollments, get_all_enrollments } from "../controllers/enrollmentController.js";
import { isStudent, authenticate, isAdminOrInstructor, isAdmin } from "../middleware/authenticate.js";

const router = Router()


router.post("/:courseId", authenticate, isStudent, enroll)
router.get("/:courseId", authenticate, isAdminOrInstructor, get_course_enrollments)
router.get("/", authenticate, isAdmin, get_all_enrollments)
// router.get("/")



export const enrollment_router = router