import express from "express";
import authMiddleware from "../middlewares/authMiddlewares.js";
import { profile } from "../controllers/profileController.js";

const router = express.Router();

router.get("/", authMiddleware, profile);

export default router;