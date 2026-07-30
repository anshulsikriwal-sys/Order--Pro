import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import authMiddleware from "../middlewares/authMiddlewares.js";

const router = express.Router();

// Create Category
router.post("/", authMiddleware, createCategory);

// Get All Categories
router.get("/", getAllCategories);

// Get Category By ID
router.get("/:id", getCategoryById);

// Update Category
router.put("/:id", authMiddleware, updateCategory);

// Delete Category
router.delete("/:id", authMiddleware, deleteCategory);

export default router;