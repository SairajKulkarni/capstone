import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

import { SnackbarProvider } from "notistack";

createRoot(document.getElementById("root")).render(
  <SnackbarProvider>
    <App />
  </SnackbarProvider>
);
