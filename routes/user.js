import { Router } from "express";
import { authenticate, isAdmin, hashPassword, user_update_permission } from "../middleware/authenticate.js";
import { validate_userCreate, validate_userUpdate } from "../middleware/validate.js";
import {
    get_users,
    get_a_user,
    delete_user,
    update_user,
    create_user,
} from "../controllers/userController.js"

const router = Router()

router.get("/", authenticate, isAdmin, get_users)

router.get("/:id", authenticate, get_a_user)

router.post("/", validate_userCreate, hashPassword, create_user)

router.put("/:id", validate_userUpdate, authenticate, user_update_permission, update_user)

router.delete("/:id", authenticate, isAdmin, delete_user)


export const user_router = router

