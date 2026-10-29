#!/usr/bin/env node
/**
 * Static save/migration surface audit on canonical TSX.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");
const DEFAULT = "(V9.4) australia-game-with-ai.tsx";

const args = process.argv.slice(2);
const jsonOut = args.includes("--json");
const writeIdx = args.indexOf("--write-audit");
const writeAudit = writeIdx >= 0 ? args[writeIdx + 1] : null;
const fileArg = args.find((a) => !a.startsWith("--") && (writeIdx < 0 || a !== args[writeIdx + 1]));
const target = resolve(repoRoot, fileArg || DEFAULT);

const text = readFileSync(target, "utf8");
const lines = text.split("\n");

const migrateRe = /^export function (migrate[A-Za-z0-9]+)\(/;
const migrations = [];
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(migrateRe);
  if (m) migrations.push({ name: m[1], line: i + 1 });
}

const saveKeywords = [
  "migrateSaveToV71Expansion",
  "migrateV69ToV70SaveData",
  "migrateReplayFileWithReport",
  "migrateAiMemoriesFromSave",
  "migrateCommunicationState",
];

const missing = saveKeywords.filter((k) => !text.includes(k));

const unboundedSlice = [];
const sliceRe = /\.slice\s*\(\s*0\s*,\s*(\d+)\s*\)/g;
let match;
while ((match = sliceRe.exec(text)) !== null) {
  const cap = Number(match[1]);
  if (cap > 5000) unboundedSlice.push({ cap, index: match.index });
}

const payload = {
  auditedAt: new Date().toISOString(),
  file: target.replace(repoRoot + "/", ""),
  exportMigrators: migrations,
  requiredMigratorSymbolsPresent: missing.length === 0,
  missingRequiredMigrators: missing,
  largeSliceCapsOver5000: unboundedSlice.length,
  moduleFixturePolicy:
    "Modules with touchesSaveFormat must ship operation-10m/modules/.../tests.fixture.json (validated at assembly)",
  verdict: missing.length === 0 ? "baseline_migrations_present" : "missing_migrators",
};

if (writeAudit) {
  const out = resolve(repoRoot, writeAudit);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(payload, null, 2) + "\n");
}

if (jsonOut) {
  console.log(JSON.stringify(payload, null, 2));
} else {
  console.log(`Save/migration audit: ${payload.file}`);
  console.log(`  export migrators: ${migrations.length}`);
  for (const m of migrations) console.log(`    - ${m.name} @ ${m.line}`);
  console.log(`  required symbols present: ${payload.requiredMigratorSymbolsPresent}`);
  if (missing.length) console.log(`  missing: ${missing.join(", ")}`);
  console.log(`  verdict: ${payload.verdict}`);
  if (writeAudit) console.log(`  wrote ${writeAudit}`);
}

if (missing.length) process.exit(1);
