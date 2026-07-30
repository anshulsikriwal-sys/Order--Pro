const THEME_KEY = "orderpro_theme";

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || "dark";
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

export function initTheme() {
  applyTheme(getTheme());
}

export function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}
