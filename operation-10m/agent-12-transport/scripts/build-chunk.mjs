#!/usr/bin/env node
/**
 * Bundles operation-10m/agent-12-transport sources into
 * operation-10m/modules/agent-12-infrastructure/chunk.tsx (no import lines).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-12-transport');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-12-infrastructure');
const outFile = path.join(outDir, 'chunk.tsx');

const MODULE_ID = 'agent-12-infrastructure';

const FILES = [
  'types.ts',
  'operations/maintenance-backlog.ts',
  'catalog/corridors-round2.ts',
  'catalog/corridors-round3.ts',
  'catalog/corridors-round4.ts',
  'catalog/corridors-round5.ts',
  'catalog/corridors-round6.ts',
  'catalog/corridors-round7.ts',
  'catalog/corridors-round8.ts',
  'catalog/corridors-round9.ts',
  'catalog/corridors-round10.ts',
  'catalog/corridors-round11.ts',
  'catalog/corridors-round12.ts',
  'catalog/corridors-round13.ts',
  'catalog/corridors-round14.ts',
  'catalog/corridors-round15.ts',
  'catalog/corridors-round16.ts',
  'catalog/corridors-round17.ts',
  'catalog/corridors-round18.ts',
  'catalog/corridors-round19.ts',
  'catalog/corridors-round20.ts',
  'catalog/corridors-catalog.ts',
  'catalog/scenarios-round2.ts',
  'catalog/scenarios-round3.ts',
  'catalog/scenarios-round4.ts',
  'catalog/scenarios-round5.ts',
  'catalog/scenarios-round6.ts',
  'catalog/scenarios-round7.ts',
  'catalog/scenarios-round8.ts',
  'catalog/scenarios-round9.ts',
  'catalog/scenarios-round10.ts',
  'catalog/scenarios-round11.ts',
  'catalog/scenarios-round12.ts',
  'catalog/scenarios-round13.ts',
  'catalog/scenarios-round14.ts',
  'catalog/scenarios-round15.ts',
  'catalog/scenarios-round16.ts',
  'catalog/scenarios-round17.ts',
  'catalog/scenarios-round18.ts',
  'catalog/scenarios-round19.ts',
  'catalog/scenarios-round20.ts',
  'catalog/scenarios-catalog.ts',
  'climate/climate-transport-modifiers.ts',
  'productivity/formulas.ts',
  'catalog/roads-catalog.ts',
  'catalog/rail-catalog.ts',
  'catalog/ports-catalog.ts',
  'catalog/logistics-catalog.ts',
  'catalog/scale-wave-assets.ts',
  'catalog/scale-wave-round2-assets.ts',
  'catalog/scale-wave-round3-assets.ts',
  'catalog/scale-wave-round4-assets.ts',
  'catalog/scale-wave-round5-assets.ts',
  'catalog/scale-wave-round6-assets.ts',
  'catalog/scale-wave-round7-assets.ts',
  'catalog/scale-wave-round8-assets.ts',
  'catalog/scale-wave-round9-assets.ts',
  'catalog/scale-wave-round10-assets.ts',
  'catalog/scale-wave-round11-assets.ts',
  'catalog/scale-wave-round12-assets.ts',
  'catalog/scale-wave-round13-assets.ts',
  'catalog/scale-wave-round14-assets.ts',
  'catalog/scale-wave-round15-assets.ts',
  'catalog/scale-wave-round16-assets.ts',
  'catalog/scale-wave-round17-assets.ts',
  'catalog/scale-wave-round18-assets.ts',
  'catalog/scale-wave-round19-assets.ts',
  'catalog/scale-wave-round20-assets.ts',
  'catalog/all-catalog.ts',
  'network/evaluate-corridors.ts',
  'network/port-rail-coupling.ts',
  'network/resilience-score.ts',
  'network/cross-region-spillover.ts',
  'network/freight-latency-index.ts',
  'network/intercapital-connectivity.ts',
  'network/container-throughput-index.ts',
  'network/bulk-export-throughput-index.ts',
  'network/aviation-cargo-throughput-index.ts',
  'network/coastal-shipping-throughput-index.ts',
  'network/deep-sea-gateway-throughput-index.ts',
  'network/defence-logistics-readiness-index.ts',
  'network/critical-minerals-export-index.ts',
  'network/gauge-interoperability-index.ts',
  'network/agricultural-export-throughput-index.ts',
  'network/pacific-feeder-tradelane-index.ts',
  'network/offshore-wind-logistics-index.ts',
  'network/subsea-cable-landing-index.ts',
  'network/lithium-brine-export-index.ts',
  'network/rare-earth-magnet-export-index.ts',
  'network/offshore-ccs-logistics-index.ts',
  'climate/apply-climate-band.ts',
  'scenarios/apply-transport-scenarios.ts',
  'scenarios/scenario-stack-policy.ts',
  'operations/maintenance-decay.ts',
  'operations/investment-pipeline.ts',
  'operations/disruption-recovery.ts',
  'operations/last-mile-coverage.ts',
  'operations/cold-chain-reliability.ts',
  'operations/intermodal-dwell-index.ts',
  'operations/customs-clearance-index.ts',
  'operations/biosecurity-clearance-index.ts',
  'operations/infrastructure-permitting-index.ts',
  'operations/weather-resilience-routing-index.ts',
  'operations/channel-maintenance-index.ts',
  'operations/disaster-recovery-staging-index.ts',
  'operations/track-possession-efficiency-index.ts',
  'operations/medical-supply-chain-index.ts',
  'operations/battery-supply-chain-index.ts',
  'operations/green-ammonia-export-index.ts',
  'operations/inland-rail-express-index.ts',
  'operations/trans-tasman-reefer-express-index.ts',
  'operations/hydrogen-lng-export-index.ts',
  'productivity/regional-investment-tiers.ts',
  'productivity/fleet-capacity-planner.ts',
  'productivity/intermodal-synergy.ts',
  'productivity/supply-chain-resilience.ts',
  'productivity/modal-balance-index.ts',
  'productivity/green-freight-index.ts',
  'productivity/congestion-relief-index.ts',
  'productivity/hydrogen-freight-index.ts',
  'productivity/autonomous-freight-index.ts',
  'productivity/electric-freight-index.ts',
  'productivity/digital-freight-visibility-index.ts',
  'productivity/indigenous-remote-supply-index.ts',
  'productivity/circular-freight-index.ts',
  'productivity/green-bunkering-index.ts',
  'productivity/data-centre-logistics-index.ts',
  'productivity/cruise-turnaround-index.ts',
  'productivity/airport-express-rail-index.ts',
  'productivity/space-launch-logistics-index.ts',
  'productivity/zero-emission-truck-corridor-index.ts',
  'productivity/urban-microfreight-hub-index.ts',
  'productivity/compute-national-productivity.ts',
  'productivity/compute-infrastructure-state.ts',
  'run-self-checks.ts',
];

function stripModulePreamble(source) {
  return source
    .split('\n')
    .filter((line) => {
      const t = line.trim();
      if (t.startsWith('import ')) return false;
      if (t.startsWith('export * from')) return false;
      return true;
    })
    .join('\n');
}

const parts = [
  `// OP10M_MODULE_BEGIN ${MODULE_ID}`,
  '// Agent 12 — Transportation / infrastructure productivity (generated; source: operation-10m/agent-12-transport/)',
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
console.log('Wrote', outFile, `(${body.split('\n').length} lines)`);
