import { authApi, isBackendUp, setToken, clearToken } from "../services/api";
import { mergeGuestWishlistInto } from "./storage";

const USERS_KEY = "orderpro_users";
const CURRENT_USER_KEY = "orderpro_current_user";

function getLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("orderpro:auth"));
}

export async function registerUser({ name, email, password, phone, address }) {
  const normalizedEmail = email.trim().toLowerCase();

  if (await isBackendUp()) {
    try {
      await authApi.register({ name, email: normalizedEmail, password, phone, address });
      // Backend signup doesn't return a token, so log in right after.
      const loginRes = await authApi.login({ email: normalizedEmail, password });
      const { token, user } = loginRes.data;
      setToken(token);
      const safeUser = { id: user._id || user.id, name: user.name, email: user.email, source: "backend" };
      setCurrentUser(safeUser);
      mergeGuestWishlistInto(safeUser);
      return { success: true, user: safeUser };
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed. Please try again.";
      return { success: false, message };
    }
  }

  // Offline / backend-down fallback so the UI keeps working.
  const users = getLocalUsers();
  if (users.some((user) => user.email === normalizedEmail)) {
    return { success: false, message: "This email is already registered." };
  }
  const user = {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    name: name.trim(),
    email: normalizedEmail,
    password,
    source: "local"
  };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  const safeUser = { id: user.id, name: user.name, email: user.email, source: "local" };
  setCurrentUser(safeUser);
  mergeGuestWishlistInto(safeUser);
  return { success: true, user: safeUser };
}

export async function loginUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  if (await isBackendUp()) {
    try {
      const res = await authApi.login({ email: normalizedEmail, password });
      const { token, user } = res.data;
      setToken(token);
      const safeUser = { id: user._id || user.id, name: user.name, email: user.email, source: "backend" };
      setCurrentUser(safeUser);
      mergeGuestWishlistInto(safeUser);
      return { success: true, user: safeUser };
    } catch (err) {
      const message = err.response?.data?.message || "Invalid email or password.";
      return { success: false, message };
    }
  }

  const users = getLocalUsers();
  const user = users.find((item) => item.email === normalizedEmail && item.password === password);
  if (!user) {
    return { success: false, message: "Invalid email or password." };
  }
  const safeUser = { id: user.id, name: user.name, email: user.email, source: "local" };
  setCurrentUser(safeUser);
  mergeGuestWishlistInto(safeUser);
  return { success: true, user: safeUser };
}

export function logoutUser() {
  clearToken();
  localStorage.removeItem(CURRENT_USER_KEY);
  window.dispatchEvent(new Event("orderpro:auth"));
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getCurrentUser());
}
