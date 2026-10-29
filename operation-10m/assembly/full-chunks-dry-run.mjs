#!/usr/bin/env node
/**
 * Full-chunks dry-run: assemble ALL manifest modules, cloc vs bc1adf3 baseline.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadManifest, validateManifest } from "./lib/anchors.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");
const BASELINE_COMMIT = "bc1adf3";
const BASELINE_AUDITED = 389566;

const manifest = loadManifest();
const filtered = {
  ...manifest,
  modules: [...manifest.modules].sort((a, b) => a.moduleId.localeCompare(b.moduleId)),
};

const errors = validateManifest(filtered);
if (errors.length) {
  console.error("Full-chunks dry-run aborted:");
  for (const e of errors) console.error("  -", e);
  process.exit(1);
}

spawnSync(process.execPath, [resolve(__dirname, "assemble.mjs"), "--dry-run"], {
  cwd: repoRoot,
  stdio: "inherit",
});

const outPath = resolve(repoRoot, "build/tranche-full-chunks-projection.tsx");
mkdirSync(dirname(outPath), { recursive: true });

const manifestBackup = readFileSync(resolve(__dirname, "manifest.json"), "utf8");
writeFileSync(resolve(__dirname, "manifest.json"), JSON.stringify(filtered, null, 2));
const assemble = spawnSync(
  process.execPath,
  [resolve(__dirname, "assemble.mjs"), "--out", outPath],
  { cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
);
writeFileSync(resolve(__dirname, "manifest.json"), manifestBackup);

if (assemble.status !== 0) {
  console.error(assemble.stderr || assemble.stdout);
  process.exit(assemble.status ?? 1);
}

const cloc = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["--yes", "cloc@2.11.0", "--include-lang=TypeScript,TSX", "--json", outPath],
  { encoding: "utf8", cwd: repoRoot, maxBuffer: 128 * 1024 * 1024 }
);
if (cloc.status !== 0) {
  console.error(cloc.stderr || cloc.stdout);
  process.exit(1);
}
const clocJson = JSON.parse(cloc.stdout);
const projectedCode = clocJson.TOTAL?.code ?? clocJson.TypeScript?.code ?? 0;
const physicalLines = readFileSync(outPath, "utf8").split("\n").length;

const remoteScan = JSON.parse(
  readFileSync(resolve(__dirname, "audits/manifest-remote-sync.json"), "utf8")
);

const payload = {
  projectionId: "tranche-projection-full-chunks",
  dryRunAt: new Date().toISOString(),
  canonicalBaseCommit: BASELINE_COMMIT,
  baselineAuditedFunctional: BASELINE_AUDITED,
  projectedAuditedFunctional: projectedCode,
  deltaAuditedFunctional: projectedCode - BASELINE_AUDITED,
  baselinePhysicalLines: 419353,
  projectedPhysicalLines: physicalLines,
  branchHeadCount: remoteScan.originOp10mHeadCount ?? remoteScan.branchHeadCount,
  branchesScannedExcludingIntegration: remoteScan.branchHeadCount,
  assemblyReadyRemote: remoteScan.assemblyReadyCount,
  modulesInManifest: filtered.modules.length,
  integrationOrder: filtered.modules.map((m) => m.moduleId),
  pendingChunks: remoteScan.rows
    .filter((r) => !r.assemblyReady)
    .map((r) => ({ branchSlug: r.branchSlug, moduleId: r.moduleId, skipReason: r.skipReason || "no OP10M chunk" })),
  moduleStats: filtered.modules.map((m) => ({
    moduleId: m.moduleId,
    slot: m.slot,
    contentSha256: m.contentSha256,
  })),
  artifact: "build/tranche-full-chunks-projection.tsx",
  note: "Projection only — canonical not modified.",
};

const auditOut = resolve(__dirname, "audits/tranche-projection-full-chunks.json");
writeFileSync(auditOut, JSON.stringify(payload, null, 2) + "\n");
console.log(`Full-chunks projection @ ${BASELINE_COMMIT}:`);
console.log(`  baseline: ${BASELINE_AUDITED.toLocaleString()} audited functional`);
console.log(`  projected: ${projectedCode.toLocaleString()} (+${payload.deltaAuditedFunctional})`);
console.log(`  modules: ${filtered.modules.length}, remote ready: ${remoteScan.assemblyReadyCount}/${remoteScan.branchHeadCount} heads`);
