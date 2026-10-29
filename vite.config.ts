import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const standaloneGame = path.resolve(rootDir, "(V9.4) australia-game-with-ai.tsx");

// The game is one self-contained TSX module. Vite only mounts it.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@standalone/game": standaloneGame,
    },
  },
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
