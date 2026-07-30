import express from "express";

import authMiddleware from "../middlewares/authMiddlewares.js";

import {
  addToCart,
  getCart,
  updateCart,
  removeItem,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/", authMiddleware, addToCart);

router.get("/", authMiddleware, getCart);

router.put("/:foodId", authMiddleware, updateCart);

router.delete("/:foodId", authMiddleware, removeItem);

router.delete("/clear", authMiddleware, clearCart);

export default router;