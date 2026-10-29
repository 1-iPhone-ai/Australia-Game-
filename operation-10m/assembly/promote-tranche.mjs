#!/usr/bin/env node
/**
 * Promote an authorized tranche: sync manifest → assemble → optional LAB wiring → canonical.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");

const args = process.argv.slice(2);
const trancheIdx = args.indexOf("--tranche");
const dryRun = args.includes("--dry-run");
const tranchePath =
  trancheIdx >= 0
    ? resolve(repoRoot, args[trancheIdx + 1])
    : resolve(__dirname, "tranches/tranche-01-op10m-registry.json");

const tranche = JSON.parse(readFileSync(tranchePath, "utf8"));
const canonicalRel = "(V9.4) australia-game-with-ai.tsx";
const canonicalPath = resolve(repoRoot, canonicalRel);
const buildPath = resolve(repoRoot, "build/op10m-assembled.tsx");

function runNode(script, scriptArgs = []) {
  const r = spawnSync(process.execPath, [script, ...scriptArgs], {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (r.status !== 0) {
    console.error(r.stderr || r.stdout);
    process.exit(r.status ?? 1);
  }
  return r.stdout;
}

runNode(resolve(__dirname, "sync-manifest.mjs"));
runNode(resolve(__dirname, "assemble.mjs"), ["--out", buildPath]);

let assembled = readFileSync(buildPath, "utf8");

if (tranche.labEntry) {
  const { afterAnchorId, id, label, runExport } = tranche.labEntry;
  if (!assembled.includes(`id: '${id}'`)) {
    const anchor = `id: '${afterAnchorId}'`;
    const idx = assembled.indexOf(anchor);
    if (idx < 0) {
      console.error(`LAB anchor not found: ${afterAnchorId}`);
      process.exit(1);
    }
    const lineEnd = assembled.indexOf("\n", idx);
    const insert = `\n  { id: '${id}', label: '${label}', tier: 'quick', section: 'System Regression', severity: 'MINOR', run: () => { const r = ${runExport}(); return r.results.map(x => ({ id: x.id, name: x.name, passed: x.passed, detail: x.detail || (x.passed ? 'ok' : 'fail') })); } },`;
    assembled = assembled.slice(0, lineEnd) + insert + assembled.slice(lineEnd);
  }
}

const banner = `\n// OP10M_TRANCHE ${tranche.id} integrated via Agent 25 assembly\n`;

if (!assembled.includes(`OP10M_TRANCHE ${tranche.id}`)) {
  const exportAnchor = "// SECTION 22: FINAL EXPORT";
  assembled = assembled.replace(exportAnchor, banner + exportAnchor);
}

if (dryRun) {
  console.log(
    `Dry run tranche ${tranche.id}: would write canonical (+${tranche.moduleIds.length} modules)`
  );
  process.exit(0);
}

writeFileSync(canonicalPath, assembled);
console.log(`Promoted tranche ${tranche.id} → ${canonicalRel}`);

const auditDir = resolve(__dirname, "audits");
mkdirSync(auditDir, { recursive: true });
runNode(resolve(repoRoot, "scripts/measure-loc.mjs"), [
  "--write-audit",
  "operation-10m/assembly/audits/loc-integrated-latest.json",
]);
runNode(resolve(__dirname, "audit-duplication.mjs"), [
  "--write-audit",
  "operation-10m/assembly/audits/duplication-integrated-latest.json",
]);
runNode(resolve(__dirname, "audit-save-migrations.mjs"), [
  "--write-audit",
  "operation-10m/assembly/audits/save-integrated-latest.json",
]);

const sha = spawnSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
  cwd: repoRoot,
}).stdout.trim();
const loc = JSON.parse(
  readFileSync(resolve(auditDir, "loc-integrated-latest.json"), "utf8")
);

const integratedRecord = {
  trancheId: tranche.id,
  parentCommitBeforeCanonicalEdit: sha,
  measuredAt: loc.measuredAt,
  auditedFunctional: loc.totals.code,
  physicalLines: loc.files?.[0]?.physicalLines,
  moduleIds: tranche.moduleIds,
  note: "Re-run git commit after this file; integratedCommitSha set on next promote pass.",
};
writeFileSync(
  resolve(auditDir, "tranche-01-integrated-pending.json"),
  JSON.stringify(integratedRecord, null, 2) + "\n"
);

console.log(
  `Integrated LOC (pre-commit): ${loc.totals.code.toLocaleString()} audited functional`
);
