import { cartApi, isBackendUp } from "../services/api";
import { getCart, saveCart } from "./storage";
import { getCurrentUser } from "./auth";

export async function addFoodToCart(food, quantity = 1) {
  const user = getCurrentUser();

  if (user?.source === "backend" && (await isBackendUp())) {
    try {
      await cartApi.add(food.id, quantity);
    } catch (err) {
      console.warn("Backend add-to-cart failed, using local cart.", err.message);
    }
  }

  const cart = getCart();
  const existing = cart.find((item) => item.id === food.id);
  const updated = existing
    ? cart.map((item) => (item.id === food.id ? { ...item, quantity: item.quantity + quantity } : item))
    : [...cart, { ...food, quantity }];

  saveCart(updated);
  return updated;
}
