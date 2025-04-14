import { Router } from "express";
import { webhook } from "../controllers/paymentController.js";

const router = Router()

router.post("/", webhook)

export const payment_router = router