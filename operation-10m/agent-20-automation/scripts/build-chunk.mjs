#!/usr/bin/env node
/**
 * Bundles agent-20-automation src into operation-10m/modules/agent-20-automation/chunk.tsx (no top-level imports).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-20-automation/src');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-20-automation');
const outFile = path.join(outDir, 'chunk.tsx');

const FILES = [
  'types.ts',
  'conditional-actions.ts',
  'limits.ts',
  'logs.ts',
  'safe-time-advance.ts',
  'national-steward.ts',
  'bridge-hooks.ts',
  'index.ts',
];

function stripModulePreamble(source) {
  return source
    .split('\n')
    .filter(line => {
      const t = line.trim();
      if (t.startsWith('import ')) return false;
      if (t.startsWith('export * from')) return false;
      return true;
    })
    .join('\n');
}

const parts = [
  '// OP10M_MODULE_BEGIN agent-20-automation',
  '// Agent 20 — idle / automation / autonomous ops (generated; source: operation-10m/agent-20-automation/src/)',
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

parts.push('// OP10M_MODULE_END agent-20-automation');
parts.push('');

fs.mkdirSync(outDir, { recursive: true });
const body = parts.join('\n');
fs.writeFileSync(outFile, body);
console.log('Wrote', outFile, `(${body.split('\n').length} lines)`);
