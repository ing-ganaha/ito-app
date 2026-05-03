import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";

import { adminRoutes } from "@/features/admin/routes";
import { userRoutes } from "@/features/user/routes";
import { Provider } from "@/libs/chakra-ui/provider";
import { queryClient } from "@/libs/tanstack-query";
import "@/styles/global.css";

const router = createBrowserRouter([...adminRoutes, ...userRoutes]);

const root = document.getElementById("app");

if (!root) {
  throw new Error("Root element #app not found");
}

createRoot(root).render(
  <StrictMode>
    <Provider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
