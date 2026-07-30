import {
  placeOrderService,
  getOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
  cancelOrderService,
} from "../services/orderService.js";

export const placeOrder = async (req, res) => {
  try {
    const order = await placeOrderService(
      req.user.id,
      req.body.deliveryAddress
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await getOrdersService(req.user.id);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await getOrderByIdService(req.params.id);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await updateOrderStatusService(
      req.params.id,
      req.body.orderStatus
    );

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await cancelOrderService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Order cancelled",
      order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};