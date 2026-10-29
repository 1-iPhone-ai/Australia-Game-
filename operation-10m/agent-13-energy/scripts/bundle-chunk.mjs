#!/usr/bin/env node
/**
 * Bundle Agent 13 modules into operation-10m/agent-13-energy/chunk.tsx for Agent 25 assembly.
 * Rules: operation-10m/INTEGRATION.md on integration branch — no local/npm imports in output.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODULES = ROOT + path.sep + 'modules';
const OUT = path.join(ROOT, 'chunk.tsx');

const MODULE_ID = 'agent-13-energy';

const FILES = [
  'v94-type-stubs.ts',
  'grid-coupling.ts',
  'climate-hazards.ts',
  'household-industry-links.ts',
  'grid-recovery-extraction-efficiency.ts',
  'regional-grid-scenarios-climate-transition.ts',
  'turn-simulation-depth.ts',
  'storage-permit-lifecycle.ts',
  'emissions-water-credit-ledger.ts',
  'biodiversity-circular-recovery-ledger.ts',
  'hydrogen-critical-minerals-ledger.ts',
  'offshore-marine-demand-response-ledger.ts',
  'carbon-capture-grid-firming-ledger.ts',
  'rez-transmission-bushfire-resilience-ledger.ts',
  'distributed-rooftop-ev-v2g-ledger.ts',
  'agrivoltaics-soil-carbon-land-ledger.ts',
  'geothermal-industrial-heat-ledger.ts',
  'coastal-blue-carbon-shore-energy-ledger.ts',
  'industrial-energy-environmental.tsx',
];

const EXPORT_MANIFEST = [
  'V1014_INDUSTRIAL_ENERGY_SCHEMA_VERSION',
  'V1014_INDUSTRIAL_ENERGY_AGENT',
  'V1014_STORAGE_FLEXIBILITY_CATALOG',
  'V1014_EMISSIONS_CREDIT_CATALOG',
  'V1014_BIODIVERSITY_OFFSET_CATALOG',
  'V1014_CIRCULAR_RECOVERY_CATALOG',
  'V1014_HYDROGEN_PATHWAY_CATALOG',
  'V1014_CRITICAL_MINERALS_CATALOG',
  'V1014_OFFSHORE_MARINE_CATALOG',
  'V1014_DEMAND_RESPONSE_CATALOG',
  'V1014_CCS_HUB_CATALOG',
  'V1014_GRID_FIRMING_CATALOG',
  'V1014_REZ_TRANSMISSION_CATALOG',
  'V1014_BUSHFIRE_RESILIENCE_CATALOG',
  'V1014_ROOFTOP_DER_CATALOG',
  'V1014_EV_V2G_CATALOG',
  'V1014_AGRIVOLTAICS_CATALOG',
  'V1014_SOIL_CARBON_LAND_CATALOG',
  'V1014_GEOTHERMAL_CATALOG',
  'V1014_INDUSTRIAL_HEAT_DECARB_CATALOG',
  'V1014_BLUE_CARBON_COASTAL_CATALOG',
  'V1014_SHORE_MARINE_ENERGY_CATALOG',
  'V1014_INTERREGIONAL_GRID_LINKS',
  'V1014_ENERGY_TURN_SCENARIOS',
  'V1014_REGIONAL_GRID_SCENARIOS',
  'V1014_EXTRACTION_SITES',
  'V1014_RENEWABLE_ASSETS',
  'V1014_ENVIRONMENTAL_RULES',
  'V1014_INDUSTRY_COUPLING',
  'computeIndustrialEnergyEnvironmentalState',
  'buildIndustrialEnergyEnvironmentalInputs',
  'buildIndustrialEnergyIndustryModifiers',
  'mergeIndustryModifiers',
  'sanitizeIndustrialEnergyEnvironmentalPersisted',
  'createInitialIndustrialEnergyEnvironmentalPersisted',
  'advanceIndustrialEnergyEnvironmentalTurn',
  'scoreAgent13EnergyEnvironmentGIAlignment',
  'executeAgent13IndustrialEnergyTurnHook',
  'runV1014IndustrialEnergyEnvironmentalSelfTests',
  'runAgent13TurnSimulationDepthSelfTests',
  'runAgent13StoragePermitScaleSelfTests',
  'runAgent13EmissionsWaterScaleSelfTests',
  'runAgent13BiodiversityCircularScaleSelfTests',
  'runAgent13HydrogenMineralsScaleSelfTests',
  'runAgent13HydrogenMineralsTurnScenario',
  'V1014_HYDROGEN_MINERALS_TURN_SCENARIOS',
  'runAgent13OffshoreDemandScaleSelfTests',
  'runAgent13OffshoreDemandTurnScenario',
  'V1014_OFFSHORE_DEMAND_TURN_SCENARIOS',
  'runAgent13CcsFirmingScaleSelfTests',
  'runAgent13CcsFirmingTurnScenario',
  'V1014_CCS_FIRMING_TURN_SCENARIOS',
  'runAgent13RezBushfireScaleSelfTests',
  'runAgent13RezBushfireTurnScenario',
  'V1014_REZ_BUSHFIRE_TURN_SCENARIOS',
  'runAgent13DerV2gScaleSelfTests',
  'runAgent13DerV2gTurnScenario',
  'V1014_DER_V2G_TURN_SCENARIOS',
  'runAgent13AgriSoilScaleSelfTests',
  'runAgent13AgriSoilTurnScenario',
  'V1014_AGRI_SOIL_TURN_SCENARIOS',
  'runAgent13GeoHeatScaleSelfTests',
  'runAgent13GeoHeatTurnScenario',
  'V1014_GEO_HEAT_TURN_SCENARIOS',
  'runAgent13BlueShoreScaleSelfTests',
  'runAgent13BlueShoreTurnScenario',
  'V1014_BLUE_SHORE_TURN_SCENARIOS',
  'runV1014RegionalGridClimateScaleSelfTests',
  'IndustrialEnergyEnvironmentalInspector',
];

function stripImports(src) {
  const lines = src.split('\n');
  const out = [];
  let skipping = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    if (skipping) {
      if (t.includes('from ') && (t.endsWith("';") || t.endsWith('";') || t.includes("'") || t.includes('"'))) {
        skipping = false;
      }
      continue;
    }
    if (t.startsWith('import ') || t.startsWith('import{')) {
      if (!t.includes(' from ') || (!t.endsWith("';") && !t.endsWith('";'))) {
        skipping = true;
      }
      continue;
    }
    if (t.startsWith('export * from ') || t.startsWith('export {') && t.includes(" from './")) {
      continue;
    }
    out.push(line);
  }
  return out.join('\n');
}

function postProcess(body) {
  return body
    .replace(/\buseState\b/g, 'React.useState')
    .replace(/^export \{\s*V1014_SCHEMA_VERSION,\s*\} from '\.\/v94-type-stubs';\s*\n/m, '');
}

function bundle() {
  const parts = [];
  for (const f of FILES) {
    const p = path.join(MODULES, f);
    const raw = fs.readFileSync(p, 'utf8');
    parts.push(`// --- bundled from modules/${f} ---\n${postProcess(stripImports(raw))}`);
  }
  const body = parts.join('\n\n');
  const hash = crypto.createHash('sha256').update(body).digest('hex');
  const header = `// Agent 25 assembly chunk — ${MODULE_ID}
// Generated by: node operation-10m/agent-13-energy/scripts/bundle-chunk.mjs
// content-sha256: ${hash}
// export-manifest: ${EXPORT_MANIFEST.join(', ')}
//
// Target: (V9.4) australia-game-with-ai.tsx SECTION 20AL (see INTEGRATION.md)
// Drop v94-type-stubs block on merge; use canonical V9.4 types.

// OP10M_MODULE_BEGIN ${MODULE_ID}
`;

  const footer = `
// OP10M_MODULE_END ${MODULE_ID}
`;

  const chunk = header + body + footer;
  fs.writeFileSync(OUT, chunk, 'utf8');
  console.log(`Wrote ${OUT} (${chunk.split('\n').length} lines, sha256=${hash.slice(0, 12)}…)`);
}

bundle();
