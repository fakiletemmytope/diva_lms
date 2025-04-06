import { Router } from "express";
import { authenticate, isAdminOrInstructor, isStudent } from "../middleware/authenticate.js";
import { isInstructor } from "../middleware/authenticate.js";
import { create_quiz, update_quiz, delete_quiz, get_quiz, submit_quiz } from "../controllers/quizController.js";
import { validate_quizCreate, validate_quizUpdate } from "../middleware/validate.js";

const router = Router()

router.get("/:id", authenticate, get_quiz)
router.post("/", authenticate, isInstructor, validate_quizCreate, create_quiz)
router.put("/:id", authenticate, isInstructor, validate_quizUpdate, update_quiz)
router.delete("/:id", authenticate, isAdminOrInstructor, delete_quiz)
router.post("/submit", authenticate, isStudent, submit_quiz)

export const quiz_router = router