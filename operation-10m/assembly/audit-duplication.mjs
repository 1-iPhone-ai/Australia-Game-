#!/usr/bin/env node
/**
 * Baseline duplication / double-count audit for canonical TSX.
 * Outputs JSON (--json) or human summary; optional --write-audit path.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseSectionAnchors } from "./lib/anchors.mjs";

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

const exportDecl =
  /^export (?:default |async )?(?:function|const|class|interface|type|enum) ([A-Za-z0-9_$]+)/;

const exportSymbols = new Map();
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(exportDecl);
  if (!m) continue;
  const name = m[1];
  if (!exportSymbols.has(name)) exportSymbols.set(name, []);
  exportSymbols.get(name).push(i + 1);
}

const duplicateExports = [...exportSymbols.entries()]
  .filter(([, locs]) => locs.length > 1)
  .map(([name, locs]) => ({
    name,
    count: locs.length,
    lines: locs,
    note:
      name === "runAbTestSimulations"
        ? "TypeScript overload signatures (expected)"
        : name === "AskGameAnswerCard"
          ? "interface + React component identifier (review naming)"
          : [
              "LRSector",
              "EmergingCapabilityId",
              "CapabilityMaturity",
              "InstitutionalCapabilityId",
            ].includes(name)
            ? "baseline type re-export in Agent 03 merge block (~318k); not assembly double-count"
            : undefined,
  }));

function normalizeBlock(blockLines) {
  return blockLines
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("//"))
    .join("\n");
}

function findDuplicateBlocks(minLines = 8, minChars = 400) {
  const hits = new Map();
  for (let i = 0; i <= lines.length - minLines; i++) {
    const slice = lines.slice(i, i + minLines);
    const norm = normalizeBlock(slice);
    if (norm.length < minChars) continue;
    const hash = createHash("sha256").update(norm).digest("hex");
    if (!hits.has(hash)) hits.set(hash, []);
    hits.get(hash).push(i + 1);
  }
  return [...hits.entries()]
    .filter(([, starts]) => starts.length > 1)
    .map(([hash, starts]) => ({ hash: hash.slice(0, 16), occurrences: starts.length, startLines: starts.slice(0, 8) }))
    .sort((a, b) => b.occurrences - a.occurrences);
}

const duplicateBlocks = findDuplicateBlocks();
const sections = parseSectionAnchors(text);

const op10mMarkers = {
  assembled: (text.match(/OP10M_ASSEMBLED /g) || []).length,
  moduleBegin: (text.match(/OP10M_MODULE_BEGIN /g) || []).length,
};

const payload = {
  auditedAt: new Date().toISOString(),
  file: target.replace(repoRoot + "/", ""),
  physicalLines: lines.length,
  sectionCount: sections.length,
  duplicateExportSymbols: duplicateExports,
  duplicateNormalizedBlocks: {
    minLines: 8,
    minNonCommentChars: 400,
    clusters: duplicateBlocks.slice(0, 40),
    totalClusters: duplicateBlocks.length,
  },
  op10mAssemblyMarkers: op10mMarkers,
  reachability: {
    status: "baseline_static_only",
    note: "Full import/call-graph reachability deferred; export collisions tracked for integration gate.",
  },
  verdict:
    duplicateExports.filter((d) => !d.note).length === 0 && op10mMarkers.assembled === 0
      ? "baseline_clean_for_integration"
      : "review_required",
};

if (writeAudit) {
  const out = resolve(repoRoot, writeAudit);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(payload, null, 2) + "\n");
}

if (jsonOut) {
  console.log(JSON.stringify(payload, null, 2));
} else {
  console.log(`Duplication audit: ${payload.file}`);
  console.log(`  physical lines: ${payload.physicalLines.toLocaleString()}`);
  console.log(`  sections: ${payload.sectionCount}`);
  console.log(`  duplicate export symbols: ${duplicateExports.length}`);
  for (const d of duplicateExports) {
    console.log(`    - ${d.name} x${d.count} @ lines ${d.lines.join(", ")}${d.note ? ` (${d.note})` : ""}`);
  }
  console.log(`  duplicate block clusters (8+ lines): ${duplicateBlocks.length}`);
  if (duplicateBlocks.length > 0) {
    const top = duplicateBlocks.slice(0, 5);
    for (const c of top) {
      console.log(`    - ${c.occurrences}x from lines ${c.startLines.join(", ")} hash=${c.hash}…`);
    }
  }
  console.log(`  OP10M assembled markers: ${op10mMarkers.assembled}`);
  console.log(`  verdict: ${payload.verdict}`);
  if (writeAudit) console.log(`  wrote ${writeAudit}`);
}
