import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    laravel({
      input: ["resources/react/App.tsx"],
      refresh: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "resources/react"),
    },
  },
  server: {
    host: "127.0.0.1",
    watch: {
      ignored: ["**/storage/framework/views/**"],
    },
  },
  build: {
    rolldownOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes("react-dom") || id.includes("react/")) return "react";
          if (id.includes("react-router")) return "router";
          if (id.includes("@chakra-ui") || id.includes("@emotion"))
            return "chakra";
          if (id.includes("@tanstack/react-query")) return "query";
        },
      },
    },
  },
});
