import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { initTheme } from "./utils/theme";
import "./index.css";

initTheme();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster position="top-center" toastOptions={{ duration: 2800 }} />
  </React.StrictMode>
);
