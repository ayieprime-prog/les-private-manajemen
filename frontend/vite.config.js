import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const API_URL = process.env.VITE_API_URL || "http://localhost:4000";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": API_URL,
    },
  },
  define: {
    __API_URL__: JSON.stringify(API_URL),
  },
});
