#!/usr/bin/env node
/**
 * Bundles v10-14-labor-demographics sources into operation-10m/modules/agent-09-population/chunk.tsx
 * (no top-level import lines — inline-ready for Agent 25 / OP10M assembly).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-09-population/v10-14-labor-demographics');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-09-population');
const outFile = path.join(outDir, 'chunk.tsx');

const FILES = [
  'types.ts',
  'boundaries.ts',
  'bands.ts',
  'demographics.ts',
  'wages.ts',
  'migration.ts',
  'employment-linkage.ts',
  'automation-feedback.ts',
  'catalog/regional-labor-baselines.ts',
  'catalog/labor-stress-scenarios.ts',
  'household-budget-detail.ts',
  'migration-shocks.ts',
  'wage-migration-coupling.ts',
  'regional-migration-spillovers.ts',
  'gi-labor-queries.ts',
  'turn-projection.ts',
  'integrated-labor-synthesis.ts',
  'labor-turn-audit.ts',
  'scenario-runner.ts',
  'steward-labor-brief.ts',
  'catalog/regional-migration-corridors.ts',
  'catalog/skilled-labor-pathways.ts',
  'workforce-capacity-bridge.ts',
  'labor-resilience-scorecard.ts',
  'interregional-labor-rebalancing.ts',
  'catalog/workforce-retention-levers.ts',
  'catalog/workforce-upskilling-programs.ts',
  'catalog/workforce-inclusion-levers.ts',
  'catalog/workforce-care-levers.ts',
  'catalog/workforce-flexibility-levers.ts',
  'catalog/workforce-reengagement-levers.ts',
  'catalog/workforce-onboarding-levers.ts',
  'catalog/workforce-coordination-levers.ts',
  'catalog/workforce-advocacy-levers.ts',
  'catalog/workforce-mentorship-levers.ts',
  'catalog/workforce-safety-levers.ts',
  'catalog/workforce-scheduling-levers.ts',
  'dependency-ratio-snapshot.ts',
  'participation-pressure-brief.ts',
  'labor-market-velocity-index.ts',
  'skill-mismatch-index.ts',
  'labor-supply-elasticity-brief.ts',
  'talent-mobility-outlook.ts',
  'underemployment-pressure-brief.ts',
  'wage-competitiveness-index.ts',
  'workforce-transition-friction-outlook.ts',
  'youth-entry-pipeline-outlook.ts',
  'labor-market-tightness-brief.ts',
  'hybrid-participation-friction-outlook.ts',
  'senior-workforce-retention-outlook.ts',
  'regional-labor-absorption-brief.ts',
  'participation-equity-gap-brief.ts',
  'credential-mobility-outlook.ts',
  'household-participation-coupling-brief.ts',
  'labor-rebalancing-stress-brief.ts',
  'automation-participation-resilience-outlook.ts',
  'wage-participation-spillover-brief.ts',
  'migration-shock-participation-buffer-outlook.ts',
  'labor-market-stability-outlook.ts',
  'intergenerational-workforce-balance-outlook.ts',
  'capacity-participation-alignment-brief.ts',
  'participation-velocity-coupling-brief.ts',
  'skills-tightness-coherence-outlook.ts',
  'integrated-labor-readiness-outlook.ts',
  'hybrid-remote-participation-outlook.ts',
  'corridor-capacity-stress-brief.ts',
  'steward-intervention-priority-brief.ts',
  'essential-worker-participation-outlook.ts',
  'wage-automation-coupling-brief.ts',
  'national-labor-cohesion-index.ts',
  'seasonal-participation-swing-outlook.ts',
  'cohesion-corridor-coupling-brief.ts',
  'national-workforce-reliability-index.ts',
  'retention-reliability-coupling-brief.ts',
  'upskilling-velocity-outlook.ts',
  'subject-workforce-readiness-brief.ts',
  'national-workforce-sustainment-index.ts',
  'sustainment-retention-coupling-brief.ts',
  'onboarding-velocity-outlook.ts',
  'subject-assembly-continuity-brief.ts',
  'national-workforce-continuity-index.ts',
  'continuity-coordination-coupling-brief.ts',
  'reengagement-momentum-outlook.ts',
  'subject-wave-assembly-brief.ts',
  'national-workforce-durability-index.ts',
  'durability-advocacy-coupling-brief.ts',
  'mentorship-endurance-outlook.ts',
  'subject-tranche-readiness-brief.ts',
  'national-workforce-endurance-index.ts',
  'endurance-flexibility-coupling-brief.ts',
  'inclusion-resilience-outlook.ts',
  'subject-commit-readiness-brief.ts',
  'national-workforce-tenacity-index.ts',
  'persistence.ts',
  'inputs.ts',
  'validate.ts',
  'compute.ts',
  'self-tests.ts',
  'react/LaborDemographicsCenterPanel.tsx'
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
  '// OP10M_MODULE_BEGIN agent-09-population',
  '// Agent 09 — V10.14 labor demographics (generated; source: operation-10m/agent-09-population/v10-14-labor-demographics/)',
  ''
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

parts.push('// OP10M_MODULE_END agent-09-population');
parts.push('');

fs.mkdirSync(outDir, { recursive: true });
const body = parts.join('\n');
fs.writeFileSync(outFile, body);
console.log('Wrote', outFile, `(${body.split('\n').length} lines)`);
