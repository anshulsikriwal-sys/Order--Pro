import express from "express";
import {
  createFood,
  getAllFoods,
  getFoodById,
  updateFood,
  deleteFood,
  searchFood,
  getFoodByCategory,
} from "../controllers/foodController.js";

import authMiddleware from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/", authMiddleware, createFood);

router.get("/", getAllFoods);

router.get("/search", searchFood);

router.get("/category/:categoryId", getFoodByCategory);

router.get("/:id", getFoodById);

router.put("/:id", authMiddleware, updateFood);

router.delete("/:id", authMiddleware, deleteFood);

export default router;