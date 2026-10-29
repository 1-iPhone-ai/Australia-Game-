#!/usr/bin/env node
/**
 * Bundles agent-24-replay sources into operation-10m/modules/agent-24-history/chunk.tsx
 * (no top-level import lines — inline-ready for Agent 25 / OP10M assembly).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-24-replay/src');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-24-history');
const outFile = path.join(outDir, 'chunk.tsx');

const FILES = [
  'fingerprint.ts',
  'causal-records.ts',
  'timeline-registry.ts',
  'late-game-replay.ts',
  'analytics-depth.ts',
  'replay-scenarios.ts',
  'audit-trails.ts',
  'multi-session.ts',
  'timeline-divergence.ts',
  'history-rollups.ts',
  'replay-attestation.ts',
  'history-replay-analytics.ts',
  'replay-determinism.ts',
  'historical-analytics-dashboard.tsx',
];

function stripModulePreamble(source) {
  return source
    .split('\n')
    .filter(line => {
      const t = line.trim();
      if (t.startsWith('import ')) return false;
      if (t.startsWith('import\t')) return false;
      if (t.startsWith('export * from')) return false;
      return true;
    })
    .join('\n');
}

const parts = [
  '// OP10M_MODULE_BEGIN agent-24-history',
  '// Agent 24 — history / replay / late game (generated; source: operation-10m/agent-24-replay/src/)',
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

parts.push('// OP10M_MODULE_END agent-24-history');
parts.push('');

fs.mkdirSync(outDir, { recursive: true });
const body = parts.join('\n');
fs.writeFileSync(outFile, body);
const importLines = body.split('\n').filter(l => /^\s*import\s/.test(l));
if (importLines.length) {
  console.error('Chunk still contains import lines:', importLines.length);
  process.exit(1);
}
console.log('Wrote', outFile, `(${body.split('\n').length} lines)`);
