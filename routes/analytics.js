import Router from "express"
import {isAdmin, authenticate} from "../middleware/authenticate.js"
import { users_analytics, lessons_analytics, courses_analytics } from "../controllers/analyticsController.js"

const router = Router()

router.get("/users", authenticate, isAdmin, users_analytics)
router.get("/courses", authenticate, isAdmin, courses_analytics)
router.get("/lessons", authenticate, isAdmin, lessons_analytics)


export const analytics_router = router