#!/usr/bin/env node
/**
 * Operation 111 · Agent 31 — city development integration contracts (static checks).
 * Validates baseline markers without loading the 240k-line monolith.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const baseline = join(root, "(V9.4) australia-game-with-ai.tsx");
const src = readFileSync(baseline, "utf8");

const required = [
  { id: "lr-housing-need", pattern: "category: 'housing', score: housingDemand" },
  { id: "lr-development-need", pattern: "if (civicGap > 0) raw.push({ category: 'development'" },
  { id: "lr-need-contracts-housing", pattern: "housing: ['tourism_development'" },
  { id: "lr-selftest-housing", pattern: "lr_need_housing" },
  { id: "v1013-housing-bridge", pattern: "n.category === 'housing'" },
  { id: "v108-development-capacity", pattern: "developmentCapacity" },
  { id: "section-living-regions", pattern: "SECTION 20J: LIVING REGIONS" },
  { id: "section-economic-geography", pattern: "SECTION 20AA: V10.8 REGIONAL COMPETITION" },
];

const failures = [];
for (const { id, pattern } of required) {
  if (!src.includes(pattern)) failures.push(`${id}: missing "${pattern}"`);
}

if (failures.length) {
  console.error("City development contract checks FAILED:\n" + failures.join("\n"));
  process.exit(1);
}

console.log(`City development contract checks passed (${required.length} markers).`);
