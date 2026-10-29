#!/usr/bin/env node
/**
 * Scale benchmark: read + scan canonical TSX (assembly feasibility signal).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");
const DEFAULT = "(V9.4) australia-game-with-ai.tsx";

const args = process.argv.slice(2);
const jsonOut = args.includes("--json");
const writeIdx = args.indexOf("--write-audit");
const writeAudit = writeIdx >= 0 ? args[writeIdx + 1] : null;
const fileArg = args.find(
  (a, i) =>
    !a.startsWith("--") && (writeIdx < 0 || i !== writeIdx + 1)
);
const target = resolve(repoRoot, fileArg || DEFAULT);

function bench() {
  const t0 = performance.now();
  const buf = readFileSync(target);
  const readMs = performance.now() - t0;

  const t1 = performance.now();
  const hash = createHash("sha256").update(buf).digest("hex");
  const hashMs = performance.now() - t1;

  const t2 = performance.now();
  const text = buf.toString("utf8");
  const lines = text.split("\n");
  let exportCount = 0;
  for (const line of lines) {
    if (/^export /.test(line)) exportCount++;
  }
  const scanMs = performance.now() - t2;

  return {
    readMs: Math.round(readMs),
    hashMs: Math.round(hashMs),
    scanMs: Math.round(scanMs),
    bytes: buf.length,
    lines: lines.length,
    exportLines: exportCount,
    sha256: hash,
  };
}

const result = bench();
const payload = {
  benchmarkedAt: new Date().toISOString(),
  file: target.replace(repoRoot + "/", ""),
  ...result,
  extrapolation10M: {
    note: "Linear extrapolation from current scan; not predictive for tsc/vite at 10M.",
    estimatedScanMsAt10M: Math.round((result.scanMs / result.lines) * 10_000_000),
  },
};

if (writeAudit) {
  const out = resolve(repoRoot, writeAudit);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(payload, null, 2) + "\n");
}

if (jsonOut) {
  console.log(JSON.stringify(payload, null, 2));
} else {
  console.log(`Scale benchmark: ${payload.file}`);
  console.log(`  ${payload.bytes.toLocaleString()} bytes, ${payload.lines.toLocaleString()} lines`);
  console.log(`  read ${result.readMs}ms, sha256 ${result.hashMs}ms, scan ${result.scanMs}ms`);
  console.log(`  export lines: ${result.exportLines}`);
  console.log(`  extrapolated line scan @10M: ~${payload.extrapolation10M.estimatedScanMsAt10M}ms`);
  if (writeAudit) console.log(`  wrote ${writeAudit}`);
}
