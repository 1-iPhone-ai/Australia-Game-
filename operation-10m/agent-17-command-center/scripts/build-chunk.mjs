#!/usr/bin/env node
/**
 * Bundles Agent 17 modular sources into operation-10m/modules/agent-17-command-center/chunk.tsx
 * (no top-level imports; OP10M assembly-ready).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-17-command-center');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-17-command-center');
const outFile = path.join(outDir, 'chunk.tsx');

const FILES = [
  'types/command-center-types.ts',
  'planning/fingerprint.ts',
  'planning/deep-templates.ts',
  'planning/templates.ts',
  'planning/ops-state.ts',
  'planning/recovery-paths.ts',
  'evaluation/operations-evaluator.ts',
  'rollback/rollback-controller.ts',
  'goals/goal-registry.ts',
  'validation/goal-verification.ts',
  'harness/run-acc17-dev-tests.ts',
  'harness/run-recovery-path-tests.ts',
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
  '// OP10M_MODULE_BEGIN agent-17-command-center',
  '// Agent 17 — Game Intelligence / AI Command Center (generated; source: operation-10m/agent-17-command-center/)',
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

parts.push(`export function runAgent17Op10mModuleSelfTests(): {
  acc17: ReturnType<typeof runAgent17Acc17DevTests>;
  recovery: ReturnType<typeof runAgent17RecoveryPathTests>;
  success: boolean;
} {
  const acc17 = runAgent17Acc17DevTests();
  const recovery = runAgent17RecoveryPathTests();
  return { acc17, recovery, success: acc17.success && recovery.success };
}`);
parts.push('');
parts.push('// OP10M_MODULE_END agent-17-command-center');
parts.push('');

fs.mkdirSync(outDir, { recursive: true });
const body = parts.join('\n');
fs.writeFileSync(outFile, body);
console.log('Wrote', outFile, `(${body.split('\n').length} lines)`);
