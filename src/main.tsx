import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";

import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();
document
  .getElementById("titlebar-minimize")
  ?.addEventListener("click", () => appWindow.minimize());
document
  .getElementById("titlebar-maximize")
  ?.addEventListener("click", () => appWindow.toggleMaximize());
document
  .getElementById("titlebar-close")
  ?.addEventListener("click", () => appWindow.destroy());

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
