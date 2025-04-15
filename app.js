import express from "express"
import { user_router } from "./routes/user.js"
import bodyParser from "body-parser"
import { auth_router } from "./routes/auth.js";
import { course_router } from "./routes/course.js";
import { enrollment_router } from "./routes/enrollment.js";
import { lesson_router } from "./routes/lesson.js";
import { analytics_router } from "./routes/analytics.js";
import { quiz_router } from "./routes/quiz.js";
import { instructor_router } from "./routes/instructor.js";
import { payment_router } from "./routes/payment.js";
import { verify_payments } from "./cron-jobs/payment-verification.js";

const app = express()
const base = "/api"

const runJobs = async () => {
    console.log("About to run jobs")
    // Using flags to prevent overlapping execution
    let isOneJobRunning = false

    setInterval(async () => {
        if (!isOneJobRunning) {
            isOneJobRunning = true;
            await verify_payments();
            isOneJobRunning = false;
        }
    }, 60000);
};

runJobs()


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
app.use(`${base}/instructors`, instructor_router)
app.use(`${base}/verify`, payment_router)
app.get("/", (req, res) => {
    res.redirect("https://documenter.getpostman.com/view/16249004/2sB2ca5yj2")
})



export default app