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
  'landfill-waste-district-heat-ledger.ts',
  'drought-desal-water-energy-ledger.ts',
  'bioenergy-sustainable-feedstock-ledger.ts',
  'pumped-hydro-seasonal-storage-ledger.ts',
  'community-microgrid-vpp-orchestration-ledger.ts',
  'csp-molten-salt-thermal-dispatch-ledger.ts',
  'grid-forming-inertia-orchestration-ledger.ts',
  'battery-recycling-second-life-storage-ledger.ts',
  'curtailment-recovery-flex-load-ledger.ts',
  'precinct-zero-carbon-embedded-network-ledger.ts',
  'transmission-congestion-merchant-storage-ledger.ts',
  'nature-positive-siting-biodiversity-coexistence-ledger.ts',
  'climate-adaptation-flood-heat-resilience-ledger.ts',
  'industrial-symbiosis-waste-heat-recovery-ledger.ts',
  'green-hydrogen-export-electrolyser-hub-ledger.ts',
  'critical-minerals-circular-battery-supply-ledger.ts',
  'offshore-shore-port-green-corridor-ledger.ts',
  'national-decarbon-federation-relief-arbitration-ledger.ts',
  'net-zero-pathway-export-carbon-intensity-ledger.ts',
  'scope3-supply-chain-hard-to-abate-orchestration-ledger.ts',
  'climate-disclosure-green-product-passport-ledger.ts',
  'renewable-attribute-carbon-market-integrity-ledger.ts',
  'industrial-electrification-interconnection-orchestration-ledger.ts',
  'community-energy-resilience-distributed-backup-ledger.ts',
  'export-hydrogen-maritime-shore-power-ledger.ts',
  'circular-stewardship-symbiosis-federation-ledger.ts',
  'geothermal-basin-industrial-thermal-federation-ledger.ts',
  'safeguard-trade-certificate-stack-federation-ledger.ts',
  'hydrogen-ldes-export-buffer-federation-ledger.ts',
  'grid-ai-forecast-demand-flex-federation-ledger.ts',
  'transmission-mlf-merchant-arbitration-federation-ledger.ts',
  'offshore-floating-wind-export-corridor-federation-ledger.ts',
  'compound-climate-grid-hardening-federation-ledger.ts',
  'sovereign-interconnector-critical-infrastructure-federation-ledger.ts',
  'export-corridor-transmission-resilience-federation-ledger.ts',
  'renewable-export-continuity-sovereign-security-federation-ledger.ts',
  'national-export-orchestration-sovereign-continuity-federation-ledger.ts',
  'sovereign-export-resilience-national-security-federation-ledger.ts',
  'national-security-strategic-reserve-defence-industrial-federation-ledger.ts',
  'strategic-reserve-carbon-neutrality-sovereign-grid-federation-ledger.ts',
  'federated-net-zero-export-climate-resilience-orchestration-ledger.ts',
  'continental-sovereign-net-zero-export-continuity-orchestration-ledger.ts',
  'oceanic-sovereign-net-zero-export-continuity-mesh-orchestration-ledger.ts',
  'agent25-wave55-projection-handoff-brief.ts',
  'agent25-wave56-projection-handoff-brief.ts',
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
  'V1014_LANDFILL_WASTE_ENERGY_CATALOG',
  'V1014_DISTRICT_RENEWABLE_HEAT_CATALOG',
  'V1014_DROUGHT_DESAL_CATALOG',
  'V1014_WATER_ENERGY_NEXUS_CATALOG',
  'V1014_SUSTAINABLE_FEEDSTOCK_CATALOG',
  'V1014_BIOENERGY_GRID_FLEX_CATALOG',
  'V1014_PUMPED_HYDRO_EXPANSION_CATALOG',
  'V1014_SEASONAL_ARBITRAGE_CATALOG',
  'V1014_COMMUNITY_MICROGRID_CATALOG',
  'V1014_VPP_ORCHESTRATION_CATALOG',
  'V1014_CSP_MOLTEN_SALT_CATALOG',
  'V1014_THERMAL_STORAGE_DISPATCH_CATALOG',
  'V1014_GRID_FORMING_INVERTER_CATALOG',
  'V1014_SYNTHETIC_INERTIA_CATALOG',
  'V1014_BATTERY_RECYCLING_CATALOG',
  'V1014_SECOND_LIFE_STORAGE_CATALOG',
  'V1014_CURTAILMENT_RECOVERY_CATALOG',
  'V1014_FLEXIBLE_LOAD_ORCHESTRATION_CATALOG',
  'V1014_ZERO_CARBON_PRECINCT_CATALOG',
  'V1014_EMBEDDED_NETWORK_CATALOG',
  'V1014_TRANSMISSION_CONGESTION_CATALOG',
  'V1014_MERCHANT_STORAGE_CATALOG',
  'V1014_NATURE_POSITIVE_SITING_CATALOG',
  'V1014_BIODIVERSITY_COEXISTENCE_CATALOG',
  'V1014_CLIMATE_ADAPTATION_HARDENING_CATALOG',
  'V1014_FLOOD_HEAT_RESILIENCE_CATALOG',
  'V1014_INDUSTRIAL_SYMBIOSIS_CATALOG',
  'V1014_WASTE_HEAT_RECOVERY_CATALOG',
  'V1014_GREEN_HYDROGEN_EXPORT_CATALOG',
  'V1014_ELECTROLYSER_HUB_CATALOG',
  'V1014_MINERALS_CIRCULAR_RECOVERY_CATALOG',
  'V1014_BATTERY_SUPPLY_CHAIN_CATALOG',
  'V1014_OFFSHORE_SHORE_ELECTRIFICATION_CATALOG',
  'V1014_PORT_GREEN_CORRIDOR_CATALOG',
  'V1014_DECARBON_FEDERATION_CATALOG',
  'V1014_RELIEF_ARBITRATION_CATALOG',
  'V1014_NET_ZERO_PATHWAY_CATALOG',
  'V1014_EXPORT_CARBON_INTENSITY_CATALOG',
  'V1014_SCOPE3_SUPPLY_CHAIN_CATALOG',
  'V1014_HARD_TO_ABATE_SECTOR_CATALOG',
  'V1014_CLIMATE_DISCLOSURE_CATALOG',
  'V1014_GREEN_PRODUCT_PASSPORT_CATALOG',
  'V1014_RENEWABLE_ATTRIBUTE_CATALOG',
  'V1014_CARBON_MARKET_INTEGRITY_CATALOG',
  'V1014_INDUSTRIAL_ELECTRIFICATION_FLEX_CATALOG',
  'V1014_INTERREGIONAL_INTERCONNECTION_CATALOG',
  'V1014_COMMUNITY_RESILIENCE_ENERGY_CATALOG',
  'V1014_DISTRIBUTED_BACKUP_ORCHESTRATION_CATALOG',
  'V1014_EXPORT_H2_CORRIDOR_CATALOG',
  'V1014_MARITIME_SHORE_POWER_CATALOG',
  'V1014_CIRCULAR_STEWARDSHIP_CATALOG',
  'V1014_SYMBIOSIS_FEDERATION_CATALOG',
  'V1014_GEOTHERMAL_BASIN_HEAT_CATALOG',
  'V1014_INDUSTRIAL_THERMAL_FEDERATION_CATALOG',
  'V1014_SAFEGUARD_TRADE_BUFFER_CATALOG',
  'V1014_DECARBON_CERTIFICATE_STACK_CATALOG',
  'V1014_H2_LDES_STORAGE_CATALOG',
  'V1014_EXPORT_BUFFER_FEDERATION_CATALOG',
  'V1014_GRID_AI_FORECAST_CATALOG',
  'V1014_DEMAND_FLEX_FEDERATION_CATALOG',
  'V1014_TRANSMISSION_MLF_CATALOG',
  'V1014_MERCHANT_ARBITRATION_FEDERATION_CATALOG',
  'V1014_OFFSHORE_FLOATING_WIND_CATALOG',
  'V1014_MARINE_EXPORT_CORRIDOR_FEDERATION_CATALOG',
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
  'runAgent13LandfillDistrictScaleSelfTests',
  'runAgent13LandfillDistrictTurnScenario',
  'V1014_LANDFILL_DISTRICT_TURN_SCENARIOS',
  'runAgent13DesalNexusScaleSelfTests',
  'runAgent13DesalNexusTurnScenario',
  'V1014_DESAL_NEXUS_TURN_SCENARIOS',
  'runAgent13BioenergyFeedstockScaleSelfTests',
  'runAgent13BioenergyFeedstockTurnScenario',
  'V1014_BIOENERGY_FEEDSTOCK_TURN_SCENARIOS',
  'runAgent13PumpedHydroSeasonalScaleSelfTests',
  'runAgent13PumpedHydroSeasonalTurnScenario',
  'V1014_PUMPED_HYDRO_SEASONAL_TURN_SCENARIOS',
  'runAgent13MicrogridVppScaleSelfTests',
  'runAgent13MicrogridVppTurnScenario',
  'V1014_MICROGRID_VPP_TURN_SCENARIOS',
  'runAgent13CspThermalScaleSelfTests',
  'runAgent13CspThermalTurnScenario',
  'V1014_CSP_THERMAL_TURN_SCENARIOS',
  'runAgent13GridInertiaScaleSelfTests',
  'runAgent13GridInertiaTurnScenario',
  'V1014_GRID_INERTIA_TURN_SCENARIOS',
  'runAgent13BatterySecondLifeScaleSelfTests',
  'runAgent13BatterySecondLifeTurnScenario',
  'V1014_BATTERY_SECOND_LIFE_TURN_SCENARIOS',
  'runAgent13CurtailmentFlexScaleSelfTests',
  'runAgent13CurtailmentFlexTurnScenario',
  'V1014_CURTAILMENT_FLEX_TURN_SCENARIOS',
  'runAgent13PrecinctEmbeddedScaleSelfTests',
  'runAgent13PrecinctEmbeddedTurnScenario',
  'V1014_PRECINCT_EMBEDDED_TURN_SCENARIOS',
  'runAgent13TransmissionMerchantScaleSelfTests',
  'runAgent13TransmissionMerchantTurnScenario',
  'V1014_TRANSMISSION_MERCHANT_TURN_SCENARIOS',
  'runAgent13NatureCoexistenceScaleSelfTests',
  'runAgent13NatureCoexistenceTurnScenario',
  'V1014_NATURE_COEXISTENCE_TURN_SCENARIOS',
  'runAgent13ClimateFloodHeatScaleSelfTests',
  'runAgent13ClimateFloodHeatTurnScenario',
  'V1014_CLIMATE_FLOOD_HEAT_TURN_SCENARIOS',
  'runAgent13SymbiosisWasteHeatScaleSelfTests',
  'runAgent13SymbiosisWasteHeatTurnScenario',
  'V1014_SYMBIOSIS_WASTE_HEAT_TURN_SCENARIOS',
  'runAgent13H2ExportElectrolyserScaleSelfTests',
  'runAgent13H2ExportElectrolyserTurnScenario',
  'V1014_H2_EXPORT_ELECTROLYSER_TURN_SCENARIOS',
  'runAgent13MineralsBatterySupplyScaleSelfTests',
  'runAgent13MineralsBatterySupplyTurnScenario',
  'V1014_MINERALS_BATTERY_SUPPLY_TURN_SCENARIOS',
  'runAgent13OffshorePortScaleSelfTests',
  'runAgent13OffshorePortTurnScenario',
  'V1014_OFFSHORE_PORT_TURN_SCENARIOS',
  'runAgent13FederationArbitrationScaleSelfTests',
  'runAgent13FederationArbitrationTurnScenario',
  'V1014_FEDERATION_ARBITRATION_TURN_SCENARIOS',
  'runAgent13PathwayExportCiScaleSelfTests',
  'runAgent13PathwayExportCiTurnScenario',
  'V1014_PATHWAY_EXPORT_CI_TURN_SCENARIOS',
  'runAgent13Scope3HardToAbateScaleSelfTests',
  'runAgent13Scope3HardToAbateTurnScenario',
  'V1014_SCOPE3_HARD_TO_ABATE_TURN_SCENARIOS',
  'runAgent13DisclosurePassportScaleSelfTests',
  'runAgent13DisclosurePassportTurnScenario',
  'V1014_DISCLOSURE_PASSPORT_TURN_SCENARIOS',
  'runAgent13RenewableCmiScaleSelfTests',
  'runAgent13RenewableCmiTurnScenario',
  'V1014_RENEWABLE_CMI_TURN_SCENARIOS',
  'runAgent13FlexInterconnectionScaleSelfTests',
  'runAgent13FlexInterconnectionTurnScenario',
  'V1014_FLEX_INTERCONNECTION_TURN_SCENARIOS',
  'runAgent13ResilienceBackupScaleSelfTests',
  'runAgent13ResilienceBackupTurnScenario',
  'V1014_RESILIENCE_BACKUP_TURN_SCENARIOS',
  'runAgent13H2MaritimeScaleSelfTests',
  'runAgent13H2MaritimeTurnScenario',
  'V1014_H2_MARITIME_TURN_SCENARIOS',
  'runAgent13StewardshipSymbiosisScaleSelfTests',
  'runAgent13StewardshipSymbiosisTurnScenario',
  'V1014_STEWARDSHIP_SYMBIOSIS_TURN_SCENARIOS',
  'runAgent13GeothermalThermalScaleSelfTests',
  'runAgent13GeothermalThermalTurnScenario',
  'V1014_GEOTHERMAL_THERMAL_TURN_SCENARIOS',
  'runAgent13SafeguardCertificateScaleSelfTests',
  'runAgent13SafeguardCertificateTurnScenario',
  'V1014_SAFEGUARD_CERTIFICATE_TURN_SCENARIOS',
  'runAgent13H2LdesExportBufferScaleSelfTests',
  'runAgent13H2LdesExportBufferTurnScenario',
  'V1014_H2_LDES_EXPORT_BUFFER_TURN_SCENARIOS',
  'runAgent13AiForecastFlexScaleSelfTests',
  'runAgent13AiForecastFlexTurnScenario',
  'V1014_AI_FORECAST_FLEX_TURN_SCENARIOS',
  'runAgent13MlfMerchantArbitrationScaleSelfTests',
  'runAgent13MlfMerchantArbitrationTurnScenario',
  'V1014_MLF_MERCHANT_ARBITRATION_TURN_SCENARIOS',
  'runAgent13OffshoreWindExportFederationScaleSelfTests',
  'runAgent13OffshoreWindExportTurnScenario',
  'V1014_OFFSHORE_WIND_EXPORT_TURN_SCENARIOS',
  'runAgent13ClimateHardeningFederationScaleSelfTests',
  'runAgent13ClimateHardeningFederationTurnScenario',
  'V1014_CLIMATE_HARDENING_FEDERATION_TURN_SCENARIOS',
  'runAgent13SovereignInterconnectorInfrastructureScaleSelfTests',
  'runAgent13SovereignInterconnectorInfrastructureTurnScenario',
  'V1014_SOVEREIGN_INTERCONNECTOR_INFRA_TURN_SCENARIOS',
  'runAgent13ExportCorridorTransmissionResilienceScaleSelfTests',
  'runAgent13ExportCorridorTransmissionResilienceTurnScenario',
  'V1014_EXPORT_CORRIDOR_TRANSMISSION_RESILIENCE_TURN_SCENARIOS',
  'runAgent13RenewableExportContinuitySovereignSecurityScaleSelfTests',
  'runAgent13RenewableExportContinuitySovereignSecurityTurnScenario',
  'V1014_RENEWABLE_EXPORT_CONTINUITY_SOVEREIGN_SECURITY_TURN_SCENARIOS',
  'runAgent13NationalExportOrchestrationSovereignContinuityScaleSelfTests',
  'runAgent13NationalExportOrchestrationSovereignContinuityTurnScenario',
  'V1014_NATIONAL_EXPORT_ORCHESTRATION_SOVEREIGN_CONTINUITY_TURN_SCENARIOS',
  'runAgent13SovereignExportResilienceNationalSecurityScaleSelfTests',
  'runAgent13SovereignExportResilienceNationalSecurityTurnScenario',
  'V1014_SOVEREIGN_EXPORT_RESILIENCE_NATIONAL_SECURITY_TURN_SCENARIOS',
  'runAgent13NationalSecurityStrategicReserveDefenceIndustrialScaleSelfTests',
  'runAgent13NationalSecurityStrategicReserveDefenceIndustrialTurnScenario',
  'V1014_NATIONAL_SECURITY_STRATEGIC_RESERVE_DEFENCE_INDUSTRIAL_TURN_SCENARIOS',
  'runAgent13StrategicReserveCarbonNeutralitySovereignGridScaleSelfTests',
  'runAgent13StrategicReserveCarbonNeutralitySovereignGridTurnScenario',
  'V1014_STRATEGIC_RESERVE_CARBON_NEUTRALITY_SOVEREIGN_GRID_TURN_SCENARIOS',
  'runAgent13FederatedNetZeroExportClimateResilienceScaleSelfTests',
  'runAgent13FederatedNetZeroExportClimateResilienceTurnScenario',
  'V1014_FEDERATED_NET_ZERO_EXPORT_CLIMATE_RESILIENCE_TURN_SCENARIOS',
  'runAgent13ContinentalSovereignNetZeroExportContinuityScaleSelfTests',
  'runAgent13ContinentalSovereignNetZeroExportContinuityTurnScenario',
  'V1014_CONTINENTAL_SOVEREIGN_NET_ZERO_EXPORT_CONTINUITY_TRANSNATIONAL_MESH_TURN_SCENARIOS',
  'composeAgent25Wave55ProjectionHandoffBrief',
  'runAgent13Agent25Wave55ProjectionHandoffBriefSelfTests',
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
