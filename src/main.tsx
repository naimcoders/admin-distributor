import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/Index.css";
import { ToastContainer } from "react-toastify";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "react-toastify/dist/ReactToastify.css";
import "react-modern-drawer/dist/index.css";
import Coordinate from "./components/Coordinate.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <App />
        <ToastContainer
          autoClose={3000}
          theme="colored"
          closeOnClick
          position="bottom-right"
          draggable={false}
        />
      </NextUIProvider>
    </QueryClientProvider> */}
    <Coordinate />
  </React.StrictMode>
);
