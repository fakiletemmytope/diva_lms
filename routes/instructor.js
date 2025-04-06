import { get_instructor, get_instructors, delete_instructor, update_instructor } from "../controllers/instructorController.js";
import { Router } from "express";
import {authenticate, isAdmin, isAdminOrInstructor, isInstructor} from "../middleware/authenticate.js"

const router = Router()

router.get("/", authenticate, isAdmin, get_instructors)
router.get("/:id", authenticate, isAdminOrInstructor, get_instructor)
router.delete("/:id", authenticate, isAdmin, delete_instructor)
router.put("/:id", authenticate, isInstructor, update_instructor)

export const instructor_router = router