import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const standaloneGame = path.resolve(rootDir, "(V9.4) australia-game-with-ai.tsx");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@standalone/game": standaloneGame,
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts", "src/**/*.test.ts"],
  },
});
