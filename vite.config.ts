// File: vite.config.ts
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // CRITICAL FIX: Defines the @/ alias used throughout the project code
      "@": path.resolve(__dirname, "./src"),
    },
  },
})