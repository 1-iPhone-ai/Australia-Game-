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

const FILES = [
  'types.ts',
  'constants.ts',
  'regional-inequality.ts',
  'urban-growth-dynamics.ts',
  'urban-national-links.ts',
  'infrastructure-bottlenecks.ts',
  'intercity-dependencies.ts',
  'recompute.ts',
  'recompute-intercity-infra.ts',
  'urban-hierarchy.ts',
  'regional-linkage-matrix.ts',
  'relief-playbook.ts',
  'urban-corridor-flow.ts',
  'linkage-hub-centrality.ts',
  'regional-migration-pressure.ts',
  'settlement-vulnerability.ts',
  'fiscal-urban-coupling.ts',
  'metropolitan-absorption-stress.ts',
  'regional-service-equity.ts',
  'regional-convergence-velocity.ts',
  'peri-urban-expansion-pressure.ts',
  'regional-infrastructure-backlog.ts',
  'multi-tier-governance-friction.ts',
  'regional-housing-spillover-pressure.ts',
  'interregional-talent-retention-stress.ts',
  'climate-settlement-displacement-risk.ts',
  'regional-amenity-cost-pressure.ts',
  'digital-connectivity-decentralization-shift.ts',
  'settlement-relocation-burden.ts',
  'regional-employment-anchor-stress.ts',
  'interregional-commute-affordability-wedge.ts',
  'settlement-reception-capacity-strain.ts',
  'regional-land-use-regulatory-gridlock.ts',
  'interregional-mobility-affordability-trap.ts',
  'settlement-infrastructure-absorption-gap.ts',
  'regional-relief-coordination-overhead.ts',
  'interregional-corridor-equity-drift.ts',
  'settlement-climate-adaptation-lag.ts',
  'regional-fiscal-capacity-strain.ts',
  'interregional-network-resilience-erosion.ts',
  'settlement-long-horizon-capacity-risk.ts',
  'composite-recompute.ts',
  'integration/regional-regression-harness.ts',
  'self-tests.ts',
];

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
