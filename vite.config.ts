import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The game is one self-contained TSX module. Vite only mounts it.
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
});
