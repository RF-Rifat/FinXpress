import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoutes from "./routes/AppRoutes.tsx";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <AppRoutes />
    </ThemeProvider>
  </StrictMode>
);
