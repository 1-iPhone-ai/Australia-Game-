#!/usr/bin/env node
/**
 * Bundles agent-11-cities sources into operation-10m/modules/agent-11-cities/chunk.tsx
 * (no top-level import lines — inline-ready for Agent 25 / OP10M assembly).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-11-cities/src');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-11-cities');
const outFile = path.join(outDir, 'chunk.tsx');

const TAIL_FILES = ['composite-recompute.ts', 'integration/regional-regression-harness.ts', 'self-tests.ts'];
const HEAD_FILES = ['types.ts', 'constants.ts'];

function walkTsFiles(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      out.push(...walkTsFiles(path.join(dir, entry.name), rel));
    } else if (entry.name.endsWith('.ts') && entry.name !== 'index.ts') {
      out.push(rel);
    }
  }
  return out;
}

const discovered = walkTsFiles(srcRoot);
const middle = discovered
  .filter((f) => !HEAD_FILES.includes(f) && !TAIL_FILES.includes(f))
  .sort((a, b) => a.localeCompare(b));
const FILES = [...HEAD_FILES, ...middle, ...TAIL_FILES];

function stripModulePreamble(source) {
  const lines = source.split('\n');
  const out = [];
  let skippingImport = false;

  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith('export * from')) continue;

    if (!skippingImport && t.startsWith('import ')) {
      skippingImport = true;
      if (/ from ['"].*['"];?\s*$/.test(t) || t.endsWith(';')) {
        skippingImport = false;
      }
      continue;
    }

    if (skippingImport) {
      if (/ from ['"].*['"];?\s*$/.test(t) || t.endsWith(';')) {
        skippingImport = false;
      }
      continue;
    }

    out.push(line);
  }

  return out.join('\n');
}

const parts = [
  '// OP10M_MODULE_BEGIN agent-11-cities',
  '// Agent 11 — cities/regions, inequality, intercity infra (generated; source: operation-10m/agent-11-cities/src/)',
  '',
];

for (const rel of FILES) {
  const abs = path.join(srcRoot, rel);
  if (!fs.existsSync(abs)) {
    console.error('Missing source file:', rel);
    process.exit(1);
  }
  parts.push(`// --- source: ${rel} ---`);
  parts.push(stripModulePreamble(fs.readFileSync(abs, 'utf8')));
  parts.push('');
}

parts.push('// OP10M_MODULE_END agent-11-cities');
parts.push('');

fs.mkdirSync(outDir, { recursive: true });
const body = parts.join('\n');
fs.writeFileSync(outFile, body);
console.log('Wrote', outFile, `(${body.split('\n').length} lines)`);
