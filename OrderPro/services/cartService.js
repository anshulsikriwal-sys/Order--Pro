import Cart from "../models/Cart.js";
import Food from "../models/Food.js";

// Add Item to Cart
export const addToCartService = async (userId, foodId, quantity) => {
  const food = await Food.findById(foodId);

  if (!food) {
    throw new Error("Food not found");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.food.toString() === foodId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({
      food: foodId,
      quantity,
    });
  }

  await cart.save();

  return await cart.populate("items.food");
};

// Get Cart
export const getCartService = async (userId) => {
  return await Cart.findOne({ user: userId }).populate("items.food");
};

// Update Quantity
export const updateCartService = async (
  userId,
  foodId,
  quantity
) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = cart.items.find(
    (item) => item.food.toString() === foodId
  );

  if (!item) {
    throw new Error("Item not found");
  }

  item.quantity = quantity;

  await cart.save();

  return await cart.populate("items.food");
};

// Remove Item
export const removeItemService = async (userId, foodId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.food.toString() !== foodId
  );

  await cart.save();

  return await cart.populate("items.food");
};

// Clear Cart
export const clearCartService = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = [];

  await cart.save();

  return cart;
};