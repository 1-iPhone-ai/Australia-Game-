#!/usr/bin/env node
/**
 * Deterministic merge: manifest modules → single TSX without double-counting.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  findSlotInsertLine,
  loadManifest,
  validateManifest,
} from "./lib/anchors.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const outIdx = args.indexOf("--out");
const outPath =
  outIdx >= 0 ? resolve(repoRoot, args[outIdx + 1]) : null;

function extractModuleBody(text, moduleId) {
  const begin = `// OP10M_MODULE_BEGIN ${moduleId}`;
  const end = `// OP10M_MODULE_END ${moduleId}`;
  const bi = text.indexOf(begin);
  const ei = text.indexOf(end);
  if (bi < 0 || ei < 0 || ei <= bi) {
    throw new Error(`Module ${moduleId}: missing OP10M markers`);
  }
  return text.slice(bi + begin.length, ei).trim();
}

function assemble(manifest) {
  const canonicalPath = resolve(repoRoot, manifest.canonical);
  let base = readFileSync(canonicalPath, "utf8");
  const modules = [...manifest.modules].sort((a, b) =>
    a.moduleId.localeCompare(b.moduleId)
  );

  const slotBuckets = new Map();
  for (const mod of modules) {
    if (!slotBuckets.has(mod.slot)) slotBuckets.set(mod.slot, []);
    slotBuckets.get(mod.slot).push(mod);
  }

  const insertions = [];
  for (const [slot, mods] of slotBuckets) {
    const chunks = mods.map((mod) => {
      const raw = readFileSync(resolve(repoRoot, mod.path), "utf8");
      const body = extractModuleBody(raw, mod.moduleId);
      return {
        moduleId: mod.moduleId,
        text:
          `\n// OP10M_ASSEMBLED ${mod.moduleId} sha256=${mod.contentSha256}\n` +
          body +
          `\n// OP10M_ASSEMBLED_END ${mod.moduleId}\n`,
      };
    });
    const line = findSlotInsertLine(base, slot);
    insertions.push({ line, slot, chunks });
  }

  insertions.sort((a, b) => b.line - a.line);
  const lines = base.split("\n");
  for (const ins of insertions) {
    const block = ins.chunks.map((c) => c.text).join("\n");
    lines.splice(ins.line - 1, 0, block);
  }
  return lines.join("\n");
}

const manifest = loadManifest();
const errors = validateManifest(manifest);
if (errors.length) {
  console.error("Assembly aborted — manifest invalid:");
  for (const e of errors) console.error("  -", e);
  process.exit(1);
}

const assembled = assemble(manifest);
const addedModules = manifest.modules.length;

if (dryRun) {
  console.log(
    `Dry run OK: ${addedModules} module(s) would splice into ${manifest.canonical}`
  );
  process.exit(0);
}

if (!outPath) {
  console.error("Specify --out <path> or --dry-run");
  process.exit(1);
}

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, assembled);
console.log(`Wrote ${outPath} (+${addedModules} modules)`);
