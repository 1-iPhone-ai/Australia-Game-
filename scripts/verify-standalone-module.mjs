#!/usr/bin/env node
/**
 * Structural checks for the standalone single-file TSX runtime (no Vite required).
 */
import { readFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const gameFile = process.env.AUSTRALIA_GAME_TSX ?? "(V9.4) australia-game-with-ai.tsx";
const gamePath = join(root, gameFile);

let stat;
try {
  stat = statSync(gamePath);
} catch {
  console.error(`Missing standalone game file: ${gameFile}`);
  process.exit(1);
}

if (!stat.isFile()) {
  console.error(`Expected a file: ${gamePath}`);
  process.exit(1);
}

const source = readFileSync(gamePath, "utf8");
const importLines = source.match(/^import .+ from .+;$/gm) ?? [];

if (importLines.length !== 1 || !importLines[0].includes("'react'")) {
  console.error(
    "Standalone invariant violated: game must depend only on React via a single import.",
  );
  console.error("Found imports:", importLines);
  process.exit(1);
}

if (!/export default\s+\w+\s*;?\s*$/.test(source.trim())) {
  console.error("Standalone invariant violated: game must default-export the root component.");
  process.exit(1);
}

if (source.includes("from './") || source.includes('from "./')) {
  console.error("Standalone invariant violated: no relative local module imports allowed.");
  process.exit(1);
}

console.log(`Standalone TSX OK: ${gameFile} (${(stat.size / 1024 / 1024).toFixed(2)} MiB, React-only import).`);
