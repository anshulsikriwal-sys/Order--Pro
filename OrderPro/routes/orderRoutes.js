import express from "express";
import authMiddleware from "../middlewares/authMiddlewares.js";

import {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", authMiddleware, placeOrder);

router.get("/", authMiddleware, getOrders);

router.get("/:id", authMiddleware, getOrderById);

router.put("/:id/status", authMiddleware, updateOrderStatus);

router.delete("/:id", authMiddleware, cancelOrder);

export default router;