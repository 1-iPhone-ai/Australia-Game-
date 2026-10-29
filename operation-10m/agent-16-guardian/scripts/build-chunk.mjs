#!/usr/bin/env node
/**
 * Bundles operation-10m/agent-16-guardian sources into
 * operation-10m/modules/agent-16-guardian/chunk.tsx (no top-level imports).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-16-guardian');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-16-guardian');
const outFile = path.join(outDir, 'chunk.tsx');

const MODULE_ID = 'agent-16-guardian';

/** Order respects in-chunk dependencies (expansion before monitor-rules). */
const FILES = [
  'types.ts',
  'policy.ts',
  'grounding.ts',
  'suggestion-gate.ts',
  'guardian-depth.ts',
  'monitor-rules-expansion.ts',
  'monitor-rules-scale-wave.ts',
  'monitor-rules-scale-wave-2.ts',
  'monitor-rules-scale-wave-3.ts',
  'monitor-rules-scale-wave-4.ts',
  'monitor-rules-scale-wave-5.ts',
  'monitor-rules-scale-wave-6.ts',
  'monitor-rules-scale-wave-7.ts',
  'monitor-rules-scale-wave-8.ts',
  'monitor-rules-scale-wave-9.ts',
  'monitor-rules-scale-wave-10.ts',
  'monitor-rules-scale-wave-11.ts',
  'monitor-rules-scale-wave-12.ts',
  'monitor-rules-scale-wave-13.ts',
  'monitor-rules-scale-wave-14.ts',
  'monitor-rules-scale-wave-15.ts',
  'monitor-rules.ts',
  'objective-context.ts',
  'snapshot.ts',
  'advisory-cycle.ts',
  'scenarios.ts',
  'self-tests.ts',
];

function stripModulePreamble(source) {
  let skipMultilineImport = false;
  const out = [];
  for (const line of source.split('\n')) {
    const t = line.trim();
    if (skipMultilineImport) {
      if (t.includes('from ') && (t.endsWith("';") || t.endsWith('";'))) skipMultilineImport = false;
      continue;
    }
    if (t.startsWith('import ') || t.startsWith('export * from')) {
      if (t.startsWith('import ') && !t.includes(' from ') && !t.includes(';')) skipMultilineImport = true;
      continue;
    }
    out.push(line);
  }
  return out.join('\n');
}

const parts = [
  `// OP10M_MODULE_BEGIN ${MODULE_ID}`,
  '// Agent 16 — Guardian AI & Human Co-Pilot advisory ops (generated; source: operation-10m/agent-16-guardian/)',
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

parts.push(`// OP10M_MODULE_END ${MODULE_ID}`);
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
