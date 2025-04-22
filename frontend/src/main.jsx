import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.jsx";
// import { store } from "./redux/store";
import "./assets/css/style.css";
import "./assets/css/satoshi.css";

import { ThemeProvider } from "@material-tailwind/react";
import { ContextProvider } from "./contexts/NavigationContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContextProvider>
      <ThemeProvider>
          <RouterProvider router={router} />
      </ThemeProvider>
    </ContextProvider>

  </React.StrictMode>
);
