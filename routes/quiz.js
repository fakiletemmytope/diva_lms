import { Router } from "express";
import { authenticate, isAdminOrInstructor } from "../middleware/authenticate.js";
import { isInstructor } from "../middleware/authenticate.js";
import { create_quiz, update_quiz, delete_quiz, get_quiz } from "../controllers/quizController.js";

const router = Router()

router.get("/:id", authenticate, get_quiz)
router.post("/", authenticate, isInstructor, create_quiz)
router.put("/:id", authenticate, isInstructor, update_quiz)
router.delete("/:id", authenticate, isAdminOrInstructor, delete_quiz)

export const quiz_router = router