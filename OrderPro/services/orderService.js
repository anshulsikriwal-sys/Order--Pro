import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// Place Order
export const placeOrderService = async (userId, deliveryAddress) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.food");

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  let totalAmount = 0;

  const orderItems = cart.items.map((item) => {
    totalAmount += item.food.price * item.quantity;

    return {
      food: item.food._id,
      quantity: item.quantity,
      price: item.food.price,
    };
  });

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    deliveryAddress,
  });

  cart.items = [];
  await cart.save();

  return order;
};

// Get My Orders
export const getOrdersService = async (userId) => {
  return await Order.find({ user: userId })
    .populate("items.food")
    .sort({ createdAt: -1 });
};

// Get Single Order
export const getOrderByIdService = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("items.food")
    .populate("user");

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

// Update Order Status
export const updateOrderStatusService = async (
  orderId,
  status
) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  order.orderStatus = status;

  await order.save();

  return order;
};

// Cancel Order
export const cancelOrderService = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  order.orderStatus = "Cancelled";

  await order.save();

  return order;
};