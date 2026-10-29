#!/usr/bin/env node
/**
 * Cross-system smoke (dry-run only): verify national hook exports exist in the
 * full-chunks assembly artifact. Does not execute TSX or modify canonical V9.4.
 *
 * Usage:
 *   node operation-10m/assembly/tests/cross-system-smoke.mjs
 *   node operation-10m/assembly/tests/cross-system-smoke.mjs --assemble
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const assemblyDir = resolve(__dirname, "..");
const repoRoot = resolve(assemblyDir, "../..");
const artifact = resolve(repoRoot, "build/tranche-full-chunks-projection.tsx");
const auditPath = resolve(assemblyDir, "audits/cross-system-smoke-dry-run.json");

/** @type {{ id: string; agents: string; exportName: string; description: string }[]} */
const SCENARIOS = [
  {
    id: "XS-01",
    agents: "02,25",
    exportName: "runOp10mAgent02TurnsTimeSelfTests",
    description: "Turn / time pipeline hooks",
  },
  {
    id: "XS-02",
    agents: "05,02",
    exportName: "runOp10mAgent05EventsAssemblySelfTests",
    description: "Events assembly / chain hooks",
  },
  {
    id: "XS-03",
    agents: "06,02",
    exportName: "runAgent06AllSelfTests",
    description: "Macro economy depth + reconciliation",
  },
  {
    id: "XS-04",
    agents: "16,06,02",
    exportName: "runAgent16GuardianCoPilotSelfTests",
    description: "Guardian co-pilot advisory cycle",
  },
  {
    id: "XS-05",
    agents: "25",
    exportName: "runOp10mAssemblyRegistrySelfTests",
    description: "Operation 10M assembly registry",
  },
];

function runFullChunksDryRun() {
  const r = spawnSync(process.execPath, [resolve(assemblyDir, "full-chunks-dry-run.mjs")], {
    cwd: repoRoot,
    stdio: "inherit",
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

function exportPresent(source, exportName) {
  const re = new RegExp(`export\\s+function\\s+${exportName}\\s*[<(]`);
  return re.test(source);
}

const shouldAssemble = process.argv.includes("--assemble");
if (shouldAssemble || !existsSync(artifact)) {
  if (!shouldAssemble && !existsSync(artifact)) {
    console.error("Missing artifact:", artifact);
    console.error("Re-run with --assemble to build via full-chunks-dry-run.mjs");
    process.exit(2);
  }
  runFullChunksDryRun();
}

if (!existsSync(artifact)) {
  console.error("Assembly artifact not found after --assemble:", artifact);
  process.exit(1);
}

const source = readFileSync(artifact, "utf8");
const results = SCENARIOS.map((s) => {
  const passed = exportPresent(source, s.exportName);
  return { ...s, passed, verdict: passed ? "PASS" : "FAIL" };
});

const allPassed = results.every((r) => r.passed);
const payload = {
  smokeId: "cross-system-smoke-dry-run",
  ranAt: new Date().toISOString(),
  mode: "dry-run-export-presence",
  artifact,
  canonicalModified: false,
  overallVerdict: allPassed ? "PASS" : "FAIL",
  scenarios: results,
  note: "Static scan only; post-promote execution tracked in docs/cross-system-test-plan.md",
};

mkdirSync(dirname(auditPath), { recursive: true });
writeFileSync(auditPath, JSON.stringify(payload, null, 2) + "\n");

for (const r of results) {
  console.log(`${r.verdict} ${r.id} ${r.exportName}`);
}
console.log("wrote", auditPath.replace(repoRoot + "/", ""));
process.exit(allPassed ? 0 : 1);
