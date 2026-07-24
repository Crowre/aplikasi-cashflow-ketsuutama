import express from "express";
import { register, login } from "../controller/auth.js";
import {
    validationLogin,
    validationRegistration,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/registration", validationRegistration, register);
router.post("/login", validationLogin, login);

export default router;