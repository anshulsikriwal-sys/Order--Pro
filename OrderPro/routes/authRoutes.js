import express from "express";
import { SignIn, login } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/signIn", SignIn);
router.post("/login", login);

export default router;