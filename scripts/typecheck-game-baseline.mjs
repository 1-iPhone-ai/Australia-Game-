#!/usr/bin/env node
/**
 * Fail if the standalone game TSX accumulates new TypeScript errors beyond the checked-in baseline.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const baselinePath = join(root, "scripts", "game-typecheck-baseline.json");
const baseline = JSON.parse(readFileSync(baselinePath, "utf8"));

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["tsc", "--noEmit", "-p", "tsconfig.game.json"],
  { cwd: root, encoding: "utf8", shell: process.platform === "win32" },
);

const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
const errorCount = (output.match(/error TS\d+:/g) ?? []).length;

if (result.status === 0 && errorCount === 0) {
  console.log("Game TSX typecheck: 0 errors.");
  process.exit(0);
}

if (errorCount === 0 && result.status !== 0) {
  console.error("tsc failed but no TS errors were counted.");
  console.error(output.slice(-4000));
  process.exit(1);
}

const limit = baseline.maxErrors;
if (errorCount > limit) {
  console.error(
    `Game TSX typecheck regression: ${errorCount} errors (baseline allows ${limit}).`,
  );
  console.error(
    "Fix types or update scripts/game-typecheck-baseline.json in a dedicated baseline bump.",
  );
  process.exit(1);
}

if (errorCount < limit) {
  console.log(
    `Game TSX typecheck improved: ${errorCount} errors (${limit - errorCount} below baseline). Consider lowering the baseline.`,
  );
} else {
  console.log(`Game TSX typecheck at baseline: ${errorCount} errors.`);
}

process.exit(0);
