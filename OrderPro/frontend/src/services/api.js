import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
const TOKEN_KEY = "orderpro_token";

export const http = axios.create({
  baseURL: API_BASE,
  timeout: 10000
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Tracks whether the live backend has responded at least once, so we
// don't hammer a dead server with a 6s timeout on every single call.
let backendReachable = null;
let lastCheck = 0;

export async function isBackendUp() {
  const now = Date.now();
  if (backendReachable !== null && now - lastCheck < 15000) return backendReachable;
  try {
    await http.get("/category", { timeout: 2500 });
    backendReachable = true;
  } catch {
    backendReachable = false;
  }
  lastCheck = now;
  return backendReachable;
}

// ---- Auth ----
export const authApi = {
  register: (data) => http.post("/auth/signIn", data),
  login: (data) => http.post("/auth/login", data)
};

// ---- Food / Category ----
export const foodApi = {
  getAll: () => http.get("/food"),
  search: (name) => http.get("/food/search", { params: { name } }),
  byCategory: (categoryId) => http.get(`/food/category/${categoryId}`)
};

export const categoryApi = {
  getAll: () => http.get("/category")
};

// ---- Cart ----
export const cartApi = {
  get: () => http.get("/cart"),
  add: (foodId, quantity = 1) => http.post("/cart", { foodId, quantity }),
  update: (foodId, quantity) => http.put(`/cart/${foodId}`, { quantity }),
  remove: (foodId) => http.delete(`/cart/${foodId}`),
  clear: () => http.delete("/cart/clear")
};

// ---- Orders ----
export const orderApi = {
  place: (deliveryAddress) => http.post("/order", { deliveryAddress }),
  getAll: () => http.get("/order"),
  getById: (id) => http.get(`/order/${id}`),
  cancel: (id) => http.delete(`/order/${id}`)
};
