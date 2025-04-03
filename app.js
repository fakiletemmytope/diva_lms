import express from "express"
import { user_router } from "./routes/user.js"
import bodyParser from "body-parser"
import { auth_router } from "./routes/auth.js";
import { course_router } from "./routes/course.js";
import { enrollment_router } from "./routes/enrollment.js";
import { lesson_router } from "./routes/lesson.js";
import { analytics_router } from "./routes/analytics.js";
import { quiz_router } from "./routes/quiz.js";

const app = express()
const base = "/api"

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Use the router
app.use("/auth", auth_router)
app.use(`${base}/users`, user_router)
app.use(`${base}/courses`, course_router)
app.use(`${base}/enrollments`, enrollment_router)
app.use(`${base}/lessons`, lesson_router)
app.use("/analytics", analytics_router)
app.use(`${base}/quizzes`, quiz_router)
app.get("/", (req, res) => {
    // res.redirect("https://documenter.getpostman.com/view/16249004/2sAYXEFJX2")
    res.redirect("https://documenter.getpostman.com/view/16249004/2sAYdcsCkn")

})

export default app