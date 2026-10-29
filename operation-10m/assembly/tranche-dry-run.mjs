#!/usr/bin/env node
/**
 * Tranche dry-run: assemble tranche modules to build/*.tsx, cloc projection (no canonical write).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadManifest, validateManifest } from "./lib/anchors.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");

const args = process.argv.slice(2);
const trancheIdx = args.indexOf("--tranche");
const tranchePath =
  trancheIdx >= 0
    ? resolve(repoRoot, args[trancheIdx + 1])
    : resolve(__dirname, "tranches/tranche-01-op10m-registry.json");

const tranche = JSON.parse(readFileSync(tranchePath, "utf8"));
const manifest = loadManifest();
const allowed = new Set(tranche.moduleIds);
const filtered = {
  ...manifest,
  modules: manifest.modules.filter((m) => allowed.has(m.moduleId)),
};

if (filtered.modules.length !== tranche.moduleIds.length) {
  const missing = tranche.moduleIds.filter(
    (id) => !filtered.modules.some((m) => m.moduleId === id)
  );
  console.error(`Tranche dry-run aborted — missing local modules: ${missing.join(", ")}`);
  process.exit(1);
}

const errors = validateManifest({ ...manifest, modules: filtered.modules });
if (errors.length) {
  console.error("Manifest validation failed for tranche subset:");
  for (const e of errors) console.error("  -", e);
  process.exit(1);
}

const outPath = resolve(repoRoot, "build/tranche-dry-run-projection.tsx");
mkdirSync(dirname(outPath), { recursive: true });

const manifestBackup = readFileSync(resolve(__dirname, "manifest.json"), "utf8");
writeFileSync(resolve(__dirname, "manifest.json"), JSON.stringify(filtered, null, 2));
const assemble2 = spawnSync(
  process.execPath,
  [resolve(__dirname, "assemble.mjs"), "--out", outPath],
  { cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
);
writeFileSync(resolve(__dirname, "manifest.json"), manifestBackup);

if (assemble2.status !== 0) {
  console.error(assemble2.stderr || assemble2.stdout);
  process.exit(assemble2.status ?? 1);
}

const baselineLoc = JSON.parse(
  readFileSync(resolve(__dirname, "audits/loc-baseline.json"), "utf8")
);
const cloc = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["--yes", "cloc@2.11.0", "--include-lang=TypeScript,TSX", "--json", outPath],
  { encoding: "utf8", cwd: repoRoot, maxBuffer: 64 * 1024 * 1024 }
);
if (cloc.status !== 0) {
  console.error(cloc.stderr || cloc.stdout);
  process.exit(1);
}
const clocJson = JSON.parse(cloc.stdout);
const projectedCode = clocJson.TOTAL?.code ?? clocJson.TypeScript?.code ?? 0;
const physicalLines = readFileSync(outPath, "utf8").split("\n").length;

const moduleStats = filtered.modules.map((m) => {
  const raw = readFileSync(resolve(repoRoot, m.path), "utf8");
  const bodyLines = raw.split("\n").length;
  return { moduleId: m.moduleId, slot: m.slot, chunkLines: bodyLines, contentSha256: m.contentSha256 };
});

const payload = {
  trancheId: tranche.id,
  dryRunAt: new Date().toISOString(),
  canonicalBaseCommit: manifest.canonicalBaseCommit ?? baselineLoc.measuredAt,
  baselineAuditedFunctional: baselineLoc.totals.code,
  projectedAuditedFunctional: projectedCode,
  deltaAuditedFunctional: projectedCode - baselineLoc.totals.code,
  baselinePhysicalLines: baselineLoc.files?.[0]?.physicalLines,
  projectedPhysicalLines: physicalLines,
  integrationOrder: filtered.modules.map((m) => m.moduleId),
  moduleStats,
  labEntryPlanned: tranche.labEntry ?? null,
  artifact: "build/tranche-dry-run-projection.tsx",
  note: "Projection only — canonical not modified.",
};

const auditOut = resolve(__dirname, "audits/tranche-01-dry-run-projection.json");
writeFileSync(auditOut, JSON.stringify(payload, null, 2) + "\n");
console.log(`Tranche ${tranche.id} dry-run projection:`);
console.log(`  baseline audited functional: ${baselineLoc.totals.code.toLocaleString()}`);
console.log(`  projected audited functional: ${projectedCode.toLocaleString()} (+${payload.deltaAuditedFunctional})`);
console.log(`  wrote ${auditOut.replace(repoRoot + "/", "")}`);
