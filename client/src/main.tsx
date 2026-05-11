import { createRoot } from "react-dom/client";
import { App } from "@/app/App";
import { AppProviders } from "@/app/providers/AppProviders";
import "@/index.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <AppProviders>
    <App />
  </AppProviders>
);
