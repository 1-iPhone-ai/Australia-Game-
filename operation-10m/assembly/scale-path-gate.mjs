#!/usr/bin/env node
/**
 * Scale path analysis: projected full-chunks LOC → 10M gate (benchmarks + tranche math).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");
const GATE = 10_000_000;
const BASELINE_COMMIT = "bc1adf3";
const BASELINE_AUDITED = 389_566;

const args = process.argv.slice(2);
const writeAudit = args.includes("--write-audit");

function benchFile(absPath) {
  const t0 = performance.now();
  const buf = readFileSync(absPath);
  const readMs = performance.now() - t0;
  const t1 = performance.now();
  const sha256 = createHash("sha256").update(buf).digest("hex");
  const hashMs = performance.now() - t1;
  const text = buf.toString("utf8");
  const lines = text.split("\n");
  let exportLines = 0;
  for (const line of lines) {
    if (/^export /.test(line)) exportLines++;
  }
  return {
    path: absPath.replace(repoRoot + "/", ""),
    bytes: buf.length,
    lines: lines.length,
    exportLines,
    readMs: Math.round(readMs),
    hashMs: Math.round(hashMs),
    sha256: sha256.slice(0, 16),
  };
}

function clocFile(absPath) {
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  const r = spawnSync(
    npx,
    ["--yes", "cloc@2.11.0", "--include-lang=TypeScript,TSX", "--json", absPath],
    { encoding: "utf8", cwd: repoRoot, maxBuffer: 128 * 1024 * 1024 }
  );
  if (r.status !== 0) return null;
  const j = JSON.parse(r.stdout);
  return j.TOTAL?.code ?? j.TypeScript?.code ?? 0;
}

const projectionPath = resolve(__dirname, "audits/tranche-projection-full-chunks.json");
const fullChunks = JSON.parse(readFileSync(projectionPath, "utf8"));
const canonicalPath = resolve(repoRoot, "(V9.4) australia-game-with-ai.tsx");
const buildProjection = resolve(repoRoot, "build/tranche-full-chunks-projection.tsx");

const projectedAudited =
  fullChunks.projectedAuditedFunctional ?? clocFile(buildProjection) ?? 0;
const netToGate = Math.max(0, GATE - projectedAudited);
const workerWaveDelta =
  fullChunks.deltaAuditedFunctional ??
  projectedAudited - (fullChunks.baselineAuditedFunctional ?? BASELINE_AUDITED);

const trancheEstimate =
  workerWaveDelta > 0
    ? {
        method: "equal worker-wave increments from full-chunks dry-run",
        auditedFunctionalPerWave: workerWaveDelta,
        estimatedWavesToGate: Math.ceil(netToGate / workerWaveDelta),
        note: "Assumes each future wave adds ~same audited functional as current 24/25 module splice; real tranches vary.",
      }
    : null;

const canonicalBench = benchFile(canonicalPath);
let projectionBench = null;
try {
  projectionBench = benchFile(buildProjection);
} catch {
  projectionBench = { missing: true, path: "build/tranche-full-chunks-projection.tsx" };
}

const payload = {
  analyzedAt: new Date().toISOString(),
  gateAuditedFunctional: GATE,
  baselineCommit: BASELINE_COMMIT,
  baselineAuditedFunctional: fullChunks.baselineAuditedFunctional ?? BASELINE_AUDITED,
  fullChunksProjectedAudited: projectedAudited,
  netAuditedFunctionalToGate: netToGate,
  workerWaveDeltaAudited: workerWaveDelta,
  modulesInFullDryRun: fullChunks.modulesInManifest,
  assemblyReadyRemote: fullChunks.assemblyReadyRemote,
  trancheEstimate,
  duplicationAuditRequirements: [
    "audit-duplication.mjs on canonical after every promote-tranche",
    "reject duplicate contentSha256 in manifest (assembly gate)",
    "track export symbol collisions; baseline ~6 groups at bc1adf3",
    "block clusters heuristic; large UI boilerplate repeats expected until refactored",
  ],
  buildRuntimeRisks: [
    {
      risk: "Single-file bundle size",
      signal: `Projected ~${projectionBench?.bytes?.toLocaleString?.() ?? "?"} bytes / ${projectionBench?.lines?.toLocaleString?.() ?? "?"} lines after worker wave`,
      at10M: "Linear ~27× current projection bytes if structure unchanged (feasibility unknown for Vite/tsc)",
    },
    {
      risk: "Typecheck / IDE parse",
      signal: `Export declarations ~${projectionBench?.exportLines ?? "?"} after wave`,
      at10M: "Editor and tsc memory limits likely binding before raw line count",
    },
    {
      risk: "Assembly splice",
      signal: `${fullChunks.modulesInManifest ?? "?"} modules × multi-slot anchors`,
      at10M: "Agent 25 controlled assembly only; slot alias map must grow with modules",
    },
    {
      risk: "Save migration",
      signal: "Multiple modules touchesSaveFormat",
      at10M: "Each promote requires audit-save-migrations + fixtures",
    },
  ],
  benchmarks: {
    canonicalAtBc1adf3: canonicalBench,
    fullChunksProjection: projectionBench,
    extrapolatedScanMsAt10M: Math.round(
      (canonicalBench.readMs / Math.max(canonicalBench.lines, 1)) * 10_000_000
    ),
  },
  references: {
    fullChunksProjection: "operation-10m/assembly/audits/tranche-projection-full-chunks.json",
    remoteSync: "operation-10m/assembly/audits/manifest-remote-sync.json",
  },
};

if (writeAudit) {
  const out = resolve(__dirname, "audits/scale-path-to-10m-gate.json");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(payload, null, 2) + "\n");
  console.log(`wrote ${out.replace(repoRoot + "/", "")}`);
}

if (!writeAudit) {
  console.log(JSON.stringify(payload, null, 2));
}
