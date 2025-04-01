import { Router } from "express";
import { login, logout } from "../controllers/authController.js";
import { validate_auth_input } from "../middleware/validate.js";
import { activate_user, get_activation_token } from "../controllers/authController.js";

const router = Router()

router.post("/login", validate_auth_input, login)
router.get('/logout', logout)
router.get("/activate", activate_user)
router.post("/getactivationtoken", get_activation_token)
export const auth_router = router