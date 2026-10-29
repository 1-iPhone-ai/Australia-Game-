#!/usr/bin/env node
/**
 * Parse SECTION anchors from canonical TSX and validate assembly manifest.
 */
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../../..");

const SLOT_ANCHORS = {
  "post-v10z": {
    after: /SECTION 20Z: V10\.7 DYNAMIC NATIONAL PRIORITIES/i,
    before: /SECTION 20AA: V10\.8 REGIONAL COMPETITION/i,
  },
  "pre-final-export": {
    after: /SECTION 21B: RELIABILITY UPGRADE/i,
    before: /SECTION 22: FINAL EXPORT/i,
  },
  "append-only-self-tests": {
    after: /SECTION 21B: RELIABILITY UPGRADE/i,
    before: /SECTION 22: FINAL EXPORT/i,
  },
};

export function parseSectionAnchors(canonicalText) {
  const lines = canonicalText.split("\n");
  const sections = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\/\/ SECTION (.+)$/);
    if (m) sections.push({ title: m[1].trim(), line: i + 1 });
  }
  return sections;
}

export function findSlotInsertLine(canonicalText, slotId) {
  const spec = SLOT_ANCHORS[slotId];
  if (!spec) throw new Error(`Unknown slot: ${slotId}`);
  const lines = canonicalText.split("\n");
  let afterLine = -1;
  let beforeLine = lines.length + 1;
  for (let i = 0; i < lines.length; i++) {
    if (spec.after.test(lines[i])) afterLine = i + 1;
    if (spec.before.test(lines[i]) && afterLine > 0) {
      beforeLine = i + 1;
      break;
    }
  }
  if (afterLine < 0 || beforeLine <= afterLine) {
    throw new Error(`Slot ${slotId}: could not resolve anchors (after=${afterLine}, before=${beforeLine})`);
  }
  return beforeLine - 1;
}

export function hashModuleBody(moduleId, chunkText) {
  const begin = `// OP10M_MODULE_BEGIN ${moduleId}`;
  const end = `// OP10M_MODULE_END ${moduleId}`;
  const bi = chunkText.indexOf(begin);
  const ei = chunkText.indexOf(end);
  if (bi < 0 || ei < 0) throw new Error(`${moduleId}: missing OP10M markers`);
  const body = chunkText.slice(bi + begin.length, ei).trim();
  return createHash("sha256").update(body, "utf8").digest("hex");
}

export function sha256File(absPath) {
  const data = readFileSync(absPath);
  return createHash("sha256").update(data).digest("hex");
}

export function loadManifest() {
  const manifestPath = resolve(__dirname, "..", "manifest.json");
  return JSON.parse(readFileSync(manifestPath, "utf8"));
}

export function validateManifest(manifest = loadManifest()) {
  const errors = [];
  const ids = new Set();
  const hashes = new Set();
  for (const mod of manifest.modules) {
    if (ids.has(mod.moduleId)) errors.push(`duplicate moduleId: ${mod.moduleId}`);
    ids.add(mod.moduleId);
    if (hashes.has(mod.contentSha256)) {
      errors.push(`duplicate contentSha256 (double-count risk): ${mod.contentSha256} (${mod.moduleId})`);
    }
    hashes.add(mod.contentSha256);
    const abs = resolve(repoRoot, mod.path);
    try {
      const raw = readFileSync(abs, "utf8");
      const diskHash = hashModuleBody(mod.moduleId, raw);
      if (diskHash !== mod.contentSha256) {
        errors.push(`${mod.moduleId}: hash mismatch manifest=${mod.contentSha256} disk=${diskHash}`);
      }
    } catch (e) {
      errors.push(`${mod.moduleId}: cannot read ${mod.path}: ${e.message}`);
    }
    for (const dep of mod.dependsOn || []) {
      if (!ids.has(dep) && !manifest.modules.some((m) => m.moduleId === dep)) {
        errors.push(`${mod.moduleId}: missing dependency ${dep}`);
      }
    }
  }
  return errors;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const manifest = loadManifest();
  const errors = validateManifest(manifest);
  if (errors.length) {
    console.error("manifest validation FAILED:");
    for (const e of errors) console.error("  -", e);
    process.exit(1);
  }
  console.log(`manifest OK (${manifest.modules.length} modules)`);
}
