import {
  addToCartService,
  getCartService,
  updateCartService,
  removeItemService,
  clearCartService,
} from "../services/cartService.js";

// Add Item to Cart
export const addToCart = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    const cart = await addToCartService(
      req.user.id,
      foodId,
      quantity || 1
    );

    res.status(201).json({
      success: true,
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Cart
export const getCart = async (req, res) => {
  try {
    const cart = await getCartService(req.user.id);

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Quantity
export const updateCart = async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await updateCartService(
      req.user.id,
      req.params.foodId,
      quantity
    );

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Item
export const removeItem = async (req, res) => {
  try {
    const cart = await removeItemService(
      req.user.id,
      req.params.foodId
    );

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Clear Cart
export const clearCart = async (req, res) => {
  try {
    await clearCartService(req.user.id);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};