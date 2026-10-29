#!/usr/bin/env node
/**
 * Bundles agent-14-housing sources into operation-10m/modules/agent-14-housing/chunk.tsx (no imports).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-14-housing');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-14-housing');
const outFile = path.join(outDir, 'chunk.tsx');

/** Dependency-safe order (imports stripped; no cross-file refs at runtime). */
const FILES = [
  'types.ts',
  'constants.ts',
  'housing-delivery-pipeline.ts',
  'national-wellbeing-snapshot.ts',
  'public-service-capacity.ts',
  'delayed-spending-effects.ts',
  'program-stub-commitments.ts',
  'service-access-lens.ts',
  'wellbeing-guardian-warnings.ts',
  'program-sequencing.ts',
  'wellbeing-forecast.ts',
  'cross-pillar-coupling.ts',
  'regional-wellbeing-memory.ts',
  'coupling-trajectory.ts',
  'wellbeing-accountability-scorecard.ts',
  'equity-rebalancing-advisor.ts',
  'accountability-trajectory.ts',
  'wellbeing-resilience-index.ts',
  'resilience-trajectory.ts',
  'intervention-priority-queue.ts',
  'capacity-relief-scheduler.ts',
  'wellbeing-governance-panel.ts',
  'governance-trajectory.ts',
  'relief-dispatch-planner.ts',
  'stakeholder-coordination-brief.ts',
  'coordination-trajectory.ts',
  'relief-execution-monitor.ts',
  'portfolio-stabilization-brief.ts',
  'wellbeing-executive-brief.ts',
  'turn-advance.ts',
  'scenario-sweep.ts',
  'self-tests.ts',
];

function stripModulePreamble(source) {
  let out = source.replace(/^import\s+(?:type\s+)?[\s\S]*?from\s+['"][^'"]+['"];?\s*\n/gm, '');
  out = out.replace(/^export \* from\s+['"][^'"]+['"];?\s*\n/gm, '');
  out = out.replace(/^export \{[\s\S]*?\} from\s+['"][^'"]+['"];?\s*\n/gm, '');
  return out;
}

const parts = [
  '// OP10M_MODULE_BEGIN agent-14-housing',
  '// Agent 14 — V10.14 housing / health / education public service capacity & delayed spending',
  '// Generated from operation-10m/agent-14-housing/ (regenerate: npm run build:agent14-housing-chunk)',
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

parts.push('// OP10M_MODULE_END agent-14-housing');
parts.push('');

fs.mkdirSync(outDir, { recursive: true });
const text = parts.join('\n');
fs.writeFileSync(outFile, text);
console.log('Wrote', outFile, `(${text.split('\n').length} lines)`);
