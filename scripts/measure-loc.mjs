#!/usr/bin/env node
/**
 * Operation 10M — audited functional LOC (cloc code lines, TS/TSX only).
 * Usage:
 *   node scripts/measure-loc.mjs [paths...]
 *   node scripts/measure-loc.mjs --json [paths...]
 *   node scripts/measure-loc.mjs --write-audit operation-10m/assembly/audits/loc-latest.json
 *
 * Default path: (V9.4) australia-game-with-ai.tsx
 */
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const DEFAULT_CANONICAL = "(V9.4) australia-game-with-ai.tsx";

const args = process.argv.slice(2);
const jsonOut = args.includes("--json");
const writeIdx = args.indexOf("--write-audit");
const writeAudit = writeIdx >= 0 ? args[writeIdx + 1] : null;
const paths = args.filter(
  (a, i) =>
    a !== "--json" &&
    a !== "--write-audit" &&
    (writeIdx < 0 || i !== writeIdx + 1)
);
const targets =
  paths.length > 0
    ? paths.map((p) => resolve(repoRoot, p))
    : [resolve(repoRoot, DEFAULT_CANONICAL)];

function physicalLines(file) {
  return readFileSync(file, "utf8").split("\n").length;
}

function runCloc(files) {
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  const result = spawnSync(
    npx,
    [
      "--yes",
      "cloc@2.11.0",
      "--include-lang=TypeScript,TSX",
      "--json",
      ...files,
    ],
    { encoding: "utf8", cwd: repoRoot, maxBuffer: 64 * 1024 * 1024 }
  );
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }
  return JSON.parse(result.stdout);
}

const clocJson = runCloc(targets);
const summary = clocJson.TOTAL || clocJson.TypeScript || {};
const code = summary.code ?? 0;
const blank = summary.blank ?? 0;
const comment = summary.comment ?? 0;

const perFile = targets.map((abs) => {
  const rel = abs.replace(repoRoot + "/", "");
  return {
    path: rel,
    physicalLines: physicalLines(abs),
  };
});

const payload = {
  measuredAt: new Date().toISOString(),
  method: "cloc@2.11.0 --include-lang=TypeScript,TSX",
  canonical: DEFAULT_CANONICAL,
  gateAuditedFunctional: 10_000_000,
  totals: { code, blank, comment, nFiles: summary.nFiles ?? targets.length },
  files: perFile,
  netToGate: Math.max(0, 10_000_000 - code),
};

if (writeAudit) {
  const out = resolve(repoRoot, writeAudit);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(payload, null, 2) + "\n");
}

if (jsonOut) {
  console.log(JSON.stringify(payload, null, 2));
} else {
  console.log("Operation 10M LOC (audited functional = cloc code, TS/TSX)");
  console.log(`  files: ${payload.totals.nFiles}`);
  console.log(`  code:    ${code.toLocaleString()}`);
  console.log(`  comment: ${comment.toLocaleString()}`);
  console.log(`  blank:   ${blank.toLocaleString()}`);
  for (const f of perFile) {
    console.log(`  physical ${f.path}: ${f.physicalLines.toLocaleString()} lines (wc -l)`);
  }
  console.log(`  net to 10M gate: ${payload.netToGate.toLocaleString()}`);
  if (writeAudit) console.log(`  wrote ${writeAudit}`);
}
