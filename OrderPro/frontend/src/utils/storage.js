import { orderApi, isBackendUp } from "../services/api";
import { getCurrentUser } from "./auth";
import { isOrderComplete } from "./tracking";

export const CART_KEY = "orderpro_cart";
export const ORDERS_KEY = "orderpro_orders";
export const WISHLIST_KEY = "orderpro_wishlist";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("orderpro:cart"));
}

export function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function money(amount) {
  return `₹${Number(amount).toFixed(0)}`;
}

// ---- Wishlist / Favourites ----
// Keyed per-user so different accounts on the same browser don't collide.
// A "guest" bucket is used before login and merged into the account on sign-in.
function wishlistKeyFor(user) {
  return `${WISHLIST_KEY}_${user?.email || "guest"}`;
}

export function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(wishlistKeyFor(getCurrentUser()))) || [];
  } catch {
    return [];
  }
}

export function toggleWishlist(food) {
  const list = getWishlist();
  const exists = list.some((item) => item.id === food.id);
  const updated = exists ? list.filter((item) => item.id !== food.id) : [...list, food];
  localStorage.setItem(wishlistKeyFor(getCurrentUser()), JSON.stringify(updated));
  window.dispatchEvent(new Event("orderpro:wishlist"));
  return !exists;
}

export function isWishlisted(foodId) {
  return getWishlist().some((item) => item.id === foodId);
}

// Called right after a successful login/register so anything saved while
// browsing as a guest carries over into the signed-in account's wishlist.
export function mergeGuestWishlistInto(user) {
  try {
    const guestKey = `${WISHLIST_KEY}_guest`;
    const guestList = JSON.parse(localStorage.getItem(guestKey)) || [];
    if (guestList.length === 0) return;

    const userKey = wishlistKeyFor(user);
    const userList = JSON.parse(localStorage.getItem(userKey)) || [];
    const merged = [...userList, ...guestList.filter((g) => !userList.some((u) => u.id === g.id))];
    localStorage.setItem(userKey, JSON.stringify(merged));
    localStorage.removeItem(guestKey);
    window.dispatchEvent(new Event("orderpro:wishlist"));
  } catch {
    // non-fatal
  }
}

// ---- One-order-at-a-time rule ----
// A user cannot start a new order while a previous one is still active —
// i.e. it hasn't reached "Delivered" (simulated) or "Cancelled" yet.
export function getActiveOrder() {
  const user = getCurrentUser();
  const orders = getOrders().filter((order) => order.userEmail === user?.email);
  return orders.find((order) => !isOrderComplete(order)) || null;
}

export function hasActiveOrder() {
  return Boolean(getActiveOrder());
}

// ---- Order placement (backend-aware with local fallback) ----
export async function placeOrder({ cart, total, deliveryAddress, paymentMethod }) {
  const user = getCurrentUser();

  if (await isBackendUp() && user?.source === "backend") {
    try {
      const res = await orderApi.place(deliveryAddress);
      const order = res.data.order;
      const createdAtMs = order.createdAt ? new Date(order.createdAt).getTime() : Date.now();
      return {
        success: true,
        order: {
          id: order._id,
          userEmail: user.email,
          items: cart,
          total: order.totalAmount ?? total,
          status: order.orderStatus || "Pending",
          paymentMethod,
          deliveryAddress,
          createdAtMs,
          createdAt: new Date(createdAtMs).toLocaleString("en-IN")
        }
      };
    } catch (err) {
      // fall through to local storage so the user isn't blocked
      console.warn("Backend order placement failed, saving locally.", err.message);
    }
  }

  const newOrder = {
    id: `ORD-${Date.now()}`,
    userEmail: user?.email,
    items: cart,
    total,
    status: "Confirmed",
    paymentMethod,
    deliveryAddress,
    createdAtMs: Date.now(),
    createdAt: new Date().toLocaleString("en-IN")
  };
  const allOrders = getOrders();
  saveOrders([newOrder, ...allOrders]);
  return { success: true, order: newOrder };
}

export async function cancelOrder(orderId) {
  const user = getCurrentUser();

  if (await isBackendUp() && user?.source === "backend") {
    try {
      await orderApi.cancel(orderId);
    } catch (err) {
      console.warn("Backend cancel failed, updating locally.", err.message);
    }
  }

  const updated = getOrders().map((order) =>
    order.id === orderId ? { ...order, status: "Cancelled" } : order
  );
  saveOrders(updated);
  return updated;
}
