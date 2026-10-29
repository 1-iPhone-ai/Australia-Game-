import {
  AU_REGION_CODES,
  type AuRegionCode,
  type NationalTransportProductivityReport,
  type TransportAsset,
  type TransportAssetCondition,
  type TransportInfrastructureOptions,
  type TransportInfrastructureState,
  type TransportProductivityInputs,
} from '../types.ts';
import { getAgent12TransportCatalog } from '../catalog/all-catalog.ts';
import {
  buildConditionMapFromMaintenance,
  maintenanceWarningsFromBacklog,
} from '../operations/maintenance-backlog.ts';
import {
  corridorLogisticsRelief,
  evaluateAllCorridors,
  totalCorridorSynergy,
} from '../network/evaluate-corridors.ts';
import { enrichInputsWithScenarios, resolveActiveScenarios } from '../scenarios/apply-transport-scenarios.ts';
import {
  applyScenarioStackToUtilization,
  computeScenarioStackFactor,
} from '../scenarios/scenario-stack-policy.ts';
import { computePortRailCouplingByRegion } from '../network/port-rail-coupling.ts';
import { computeResilienceScoreByRegion } from '../network/resilience-score.ts';
import { computeSpilloverBonusByRegion } from '../network/cross-region-spillover.ts';
import { applyClimateBandToInputs } from '../climate/apply-climate-band.ts';
import {
  aggregateNetworkStress,
  projectMaintenanceBacklogNextTurn,
} from '../operations/maintenance-decay.ts';
import { computePipelineUnlocks } from '../operations/investment-pipeline.ts';
import {
  computeInvestmentTierByRegion,
  tierProductivityMultiplier,
} from './regional-investment-tiers.ts';
import { computeIntermodalSynergyByRegion } from './intermodal-synergy.ts';
import { computeFleetCapacitySnapshot } from './fleet-capacity-planner.ts';
import { computeNationalTransportProductivity } from './compute-national-productivity.ts';
import { computeSupplyChainResilienceIndex } from './supply-chain-resilience.ts';
import { clamp } from './formulas.ts';
import {
  computeFreightLatencyByRegion,
  nationalMedianFreightLatency,
} from '../network/freight-latency-index.ts';
import { computeDisruptionRecovery } from '../operations/disruption-recovery.ts';
import {
  computeLastMileCoverageByRegion,
  nationalLastMileCoverage,
} from '../operations/last-mile-coverage.ts';
import {
  connectivityBonusByRegion,
  computeIntercapitalConnectivityIndex,
} from '../network/intercapital-connectivity.ts';
import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import {
  computeElectrifiedFreightShare,
  computeModalBalanceIndex,
  modalBalanceProductivityMultiplier,
} from './modal-balance-index.ts';
import {
  computeGreenFreightShare,
  greenFreightProductivityMultiplier,
} from './green-freight-index.ts';
import {
  computeContainerThroughputByRegion,
  nationalContainerThroughputIndex,
} from '../network/container-throughput-index.ts';
import {
  computeColdChainReliabilityByRegion,
  nationalColdChainReliabilityIndex,
} from '../operations/cold-chain-reliability.ts';
import {
  computeIntermodalDwellByRegion,
  dwellProductivityPenalty,
  nationalIntermodalDwellMedian,
} from '../operations/intermodal-dwell-index.ts';
import {
  computeBulkExportThroughputByRegion,
  nationalBulkExportThroughputIndex,
} from '../network/bulk-export-throughput-index.ts';
import {
  computeUrbanCongestionByRegion,
  congestionReliefMultiplier,
  nationalUrbanCongestionIndex,
} from './congestion-relief-index.ts';
import {
  computeAviationCargoThroughputByRegion,
  nationalAviationCargoThroughputIndex,
} from '../network/aviation-cargo-throughput-index.ts';
import {
  computeCustomsClearanceByRegion,
  customsClearanceProductivityMultiplier,
  nationalCustomsClearanceIndex,
} from '../operations/customs-clearance-index.ts';
import {
  computeHydrogenCorridorThroughputByRegion,
  computeHydrogenFreightShare,
  hydrogenFreightProductivityMultiplier,
  nationalHydrogenCorridorThroughputIndex,
} from './hydrogen-freight-index.ts';
import {
  coastalShippingProductivityMultiplier,
  computeCoastalShippingThroughputByRegion,
  nationalCoastalShippingThroughputIndex,
} from '../network/coastal-shipping-throughput-index.ts';
import {
  biosecurityClearanceProductivityMultiplier,
  computeBiosecurityClearanceByRegion,
  nationalBiosecurityClearanceIndex,
} from '../operations/biosecurity-clearance-index.ts';
import {
  autonomousFreightProductivityMultiplier,
  computeAutonomousCorridorThroughputByRegion,
  computeAutonomousFreightShare,
  nationalAutonomousCorridorThroughputIndex,
} from './autonomous-freight-index.ts';
import {
  deepSeaGatewayProductivityMultiplier,
  computeDeepSeaGatewayThroughputByRegion,
  nationalDeepSeaGatewayThroughputIndex,
} from '../network/deep-sea-gateway-throughput-index.ts';
import {
  computeInfrastructurePermittingByRegion,
  infrastructurePermittingProductivityMultiplier,
  nationalInfrastructurePermittingIndex,
} from '../operations/infrastructure-permitting-index.ts';
import {
  computeElectricCorridorThroughputByRegion,
  computeElectricFreightShare,
  electricFreightProductivityMultiplier,
  nationalElectricCorridorThroughputIndex,
} from './electric-freight-index.ts';
import {
  computeDefenceLogisticsReadinessByRegion,
  defenceLogisticsProductivityMultiplier,
  nationalDefenceLogisticsReadinessIndex,
} from '../network/defence-logistics-readiness-index.ts';
import {
  computeWeatherResilienceRoutingByRegion,
  nationalWeatherResilienceRoutingIndex,
  weatherResilienceProductivityMultiplier,
} from '../operations/weather-resilience-routing-index.ts';
import {
  computeDigitalFreightThroughputByRegion,
  computeDigitalFreightVisibilityShare,
  digitalFreightProductivityMultiplier,
  nationalDigitalFreightThroughputIndex,
} from './digital-freight-visibility-index.ts';
import {
  computeCriticalMineralsExportByRegion,
  criticalMineralsProductivityMultiplier,
  nationalCriticalMineralsExportIndex,
} from '../network/critical-minerals-export-index.ts';
import {
  channelMaintenanceProductivityMultiplier,
  computeChannelMaintenanceByRegion,
  nationalChannelMaintenanceIndex,
} from '../operations/channel-maintenance-index.ts';
import {
  computeIndigenousRemoteSupplyThroughputByRegion,
  computeIndigenousRemoteSupplyShare,
  indigenousRemoteSupplyProductivityMultiplier,
  nationalIndigenousRemoteSupplyThroughputIndex,
} from './indigenous-remote-supply-index.ts';
import {
  computeGaugeInteroperabilityByRegion,
  gaugeInteroperabilityProductivityMultiplier,
  nationalGaugeInteroperabilityIndex,
} from '../network/gauge-interoperability-index.ts';
import {
  computeDisasterRecoveryStagingByRegion,
  disasterRecoveryStagingProductivityMultiplier,
  nationalDisasterRecoveryStagingIndex,
} from '../operations/disaster-recovery-staging-index.ts';
import {
  circularFreightProductivityMultiplier,
  computeCircularFreightShare,
  computeCircularFreightThroughputByRegion,
  nationalCircularFreightThroughputIndex,
} from './circular-freight-index.ts';
import {
  agriculturalExportProductivityMultiplier,
  computeAgriculturalExportThroughputByRegion,
  nationalAgriculturalExportThroughputIndex,
} from '../network/agricultural-export-throughput-index.ts';
import {
  computeTrackPossessionEfficiencyByRegion,
  nationalTrackPossessionEfficiencyIndex,
  trackPossessionProductivityMultiplier,
} from '../operations/track-possession-efficiency-index.ts';
import {
  computeGreenBunkeringShare,
  computeGreenBunkeringThroughputByRegion,
  greenBunkeringProductivityMultiplier,
  nationalGreenBunkeringThroughputIndex,
} from './green-bunkering-index.ts';
import {
  computePacificFeederThroughputByRegion,
  nationalPacificFeederThroughputIndex,
  pacificFeederProductivityMultiplier,
} from '../network/pacific-feeder-tradelane-index.ts';
import {
  computeMedicalSupplyChainByRegion,
  medicalSupplyProductivityMultiplier,
  nationalMedicalSupplyChainIndex,
} from '../operations/medical-supply-chain-index.ts';
import {
  computeDataCentreLogisticsShare,
  computeDataCentreLogisticsThroughputByRegion,
  dataCentreLogisticsProductivityMultiplier,
  nationalDataCentreLogisticsThroughputIndex,
} from './data-centre-logistics-index.ts';
import {
  computeOffshoreWindLogisticsByRegion,
  nationalOffshoreWindLogisticsIndex,
  offshoreWindLogisticsProductivityMultiplier,
} from '../network/offshore-wind-logistics-index.ts';
import {
  batterySupplyProductivityMultiplier,
  computeBatterySupplyChainByRegion,
  nationalBatterySupplyChainIndex,
} from '../operations/battery-supply-chain-index.ts';
import {
  computeCruiseTurnaroundShare,
  computeCruiseTurnaroundThroughputByRegion,
  cruiseTurnaroundProductivityMultiplier,
  nationalCruiseTurnaroundThroughputIndex,
} from './cruise-turnaround-index.ts';
import {
  computeSubseaCableLandingByRegion,
  nationalSubseaCableLandingIndex,
  subseaCableLandingProductivityMultiplier,
} from '../network/subsea-cable-landing-index.ts';
import {
  computeGreenAmmoniaExportByRegion,
  greenAmmoniaExportProductivityMultiplier,
  nationalGreenAmmoniaExportIndex,
} from '../operations/green-ammonia-export-index.ts';
import {
  airportExpressRailProductivityMultiplier,
  computeAirportExpressRailShare,
  computeAirportExpressRailThroughputByRegion,
  nationalAirportExpressRailThroughputIndex,
} from './airport-express-rail-index.ts';
import {
  computeLithiumBrineExportByRegion,
  lithiumBrineExportProductivityMultiplier,
  nationalLithiumBrineExportIndex,
} from '../network/lithium-brine-export-index.ts';
import {
  computeInlandRailExpressByRegion,
  computeInlandRailExpressShare,
  inlandRailExpressProductivityMultiplier,
  nationalInlandRailExpressIndex,
} from '../operations/inland-rail-express-index.ts';
import {
  computeSpaceLaunchLogisticsShare,
  computeSpaceLaunchLogisticsThroughputByRegion,
  nationalSpaceLaunchLogisticsThroughputIndex,
  spaceLaunchLogisticsProductivityMultiplier,
} from './space-launch-logistics-index.ts';
import {
  computeRareEarthMagnetExportByRegion,
  nationalRareEarthMagnetExportIndex,
  rareEarthMagnetExportProductivityMultiplier,
} from '../network/rare-earth-magnet-export-index.ts';
import {
  computeTransTasmanReeferExpressByRegion,
  computeTransTasmanReeferExpressShare,
  nationalTransTasmanReeferExpressIndex,
  transTasmanReeferExpressProductivityMultiplier,
} from '../operations/trans-tasman-reefer-express-index.ts';
import {
  computeZeroEmissionTruckCorridorShare,
  computeZeroEmissionTruckCorridorThroughputByRegion,
  nationalZeroEmissionTruckCorridorThroughputIndex,
  zeroEmissionTruckCorridorProductivityMultiplier,
} from './zero-emission-truck-corridor-index.ts';
import {
  computeOffshoreCcsLogisticsByRegion,
  nationalOffshoreCcsLogisticsIndex,
  offshoreCcsLogisticsProductivityMultiplier,
} from '../network/offshore-ccs-logistics-index.ts';
import {
  computeHydrogenLngExportByRegion,
  hydrogenLngExportProductivityMultiplier,
  nationalHydrogenLngExportIndex,
} from '../operations/hydrogen-lng-export-index.ts';
import {
  computeUrbanMicrofreightHubShare,
  computeUrbanMicrofreightHubThroughputByRegion,
  nationalUrbanMicrofreightHubThroughputIndex,
  urbanMicrofreightHubProductivityMultiplier,
} from './urban-microfreight-hub-index.ts';
import type { SeasonalDemandBand } from '../types.ts';

function seasonalFreightUtilizationDelta(band?: SeasonalDemandBand): number {
  if (band === 'low') return -0.06;
  if (band === 'peak') return 0.09;
  return 0;
}

const CONDITION_RANK: TransportAssetCondition[] = [
  'excellent',
  'good',
  'fair',
  'degraded',
  'closed',
];

function harsherCondition(a: TransportAssetCondition, b: TransportAssetCondition): TransportAssetCondition {
  return CONDITION_RANK[Math.max(CONDITION_RANK.indexOf(a), CONDITION_RANK.indexOf(b))];
}

function operationalAssets(inputs: TransportProductivityInputs): TransportAsset[] {
  return inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
}

function detectBottlenecks(
  report: NationalTransportProductivityReport,
  assets: TransportAsset[],
  inputs: TransportProductivityInputs,
): string[] {
  const bottlenecks: string[] = [];
  for (const asset of assets) {
    const condition = inputs.conditionByAssetId?.get(asset.id) ?? 'good';
    if (condition === 'degraded' || condition === 'closed') {
      bottlenecks.push(asset.id);
      continue;
    }
    const regional = report.byRegion[asset.hostRegion];
    const contrib = regional.contributions.find((c) => c.assetId === asset.id);
    if (!contrib) continue;
    if (contrib.freightCapacityIndex < 8 && asset.category !== 'logistics') {
      bottlenecks.push(asset.id);
    }
  }
  return bottlenecks.sort();
}

function mergeConditions(
  base: ReadonlyMap<string, TransportAssetCondition> | undefined,
  maintenance: Map<string, TransportAssetCondition>,
): Map<string, TransportAssetCondition> {
  const out = new Map<string, TransportAssetCondition>(base ?? []);
  for (const [id, cond] of maintenance.entries()) {
    out.set(id, harsherCondition(out.get(id) ?? 'good', cond));
  }
  return out;
}

export function computeTransportInfrastructureState(
  baseInputs: TransportProductivityInputs,
  options?: TransportInfrastructureOptions,
): TransportInfrastructureState {
  const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();

  const maintenanceMap = buildConditionMapFromMaintenance(options?.maintenanceBacklogByAssetId);
  const mergedConditions = mergeConditions(baseInputs.conditionByAssetId, maintenanceMap);

  let inputs: TransportProductivityInputs = {
    ...baseInputs,
    conditionByAssetId: mergedConditions,
  };

  const { inputs: scenarioInputs, appliedScenarioIds } = enrichInputsWithScenarios(
    inputs,
    options?.activeScenarioIds,
  );
  const activeScenarios = resolveActiveScenarios(options?.activeScenarioIds);
  const scenarioStackFactor = computeScenarioStackFactor(activeScenarios);
  inputs = {
    ...scenarioInputs,
    networkUtilization: applyScenarioStackToUtilization(scenarioInputs.networkUtilization, scenarioStackFactor),
  };

  const seasonalDelta = seasonalFreightUtilizationDelta(options?.seasonalDemandBand);
  if (seasonalDelta !== 0) {
    const freight = clamp((inputs.networkUtilization?.freight ?? 0.5) + seasonalDelta, 0.05, 1.15);
    inputs = {
      ...inputs,
      networkUtilization: { ...inputs.networkUtilization, freight },
    };
  }

  const climateApplied = applyClimateBandToInputs(inputs, options?.climateBand);
  inputs = climateApplied.inputs;
  const climateModifierFactor = climateApplied.climateModifierFactor;

  const pipeline = computePipelineUnlocks(options?.fundedPipelineStageIds);

  let productivity = computeNationalTransportProductivity(inputs);
  const ops = operationalAssets(inputs);

  const portRailCouplingByRegion = computePortRailCouplingByRegion(ops);
  const investmentTierByRegion = computeInvestmentTierByRegion(ops, portRailCouplingByRegion);

  const corridorActivations = evaluateAllCorridors(ops);
  const corridorSynergyPoints = totalCorridorSynergy(corridorActivations);
  const logisticsRelief = corridorLogisticsRelief(corridorActivations);

  const intermodalSynergyByRegion = computeIntermodalSynergyByRegion(ops);
  const resilienceScoreByRegion = computeResilienceScoreByRegion(ops, corridorActivations);

  for (const code of AU_REGION_CODES) {
    const synergy = intermodalSynergyByRegion[code];
    const tierMul = tierProductivityMultiplier(investmentTierByRegion[code]);
    const couplingBoost = (portRailCouplingByRegion[code] ?? 0) * 0.04;
    const resilienceBoost = (resilienceScoreByRegion[code] ?? 0) * 0.05;
    const corridorShare =
      corridorActivations
        .filter((c) => c.active)
        .reduce((s, c) => s + c.synergyPoints, 0) / Math.max(1, AU_REGION_CODES.length);
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + synergy + corridorShare * 0.15 + couplingBoost + resilienceBoost) *
      tierMul;
    productivity.byRegion[code].logisticsCostMultiplier = clamp(
      productivity.byRegion[code].logisticsCostMultiplier - logisticsRelief * 0.2 - couplingBoost * 0.002,
      0.5,
      1.05,
    );
  }

  productivity.nationalLogisticsCostMultiplier = clamp(
    productivity.nationalLogisticsCostMultiplier - logisticsRelief - pipeline.logisticsRelief,
    0.5,
    1.05,
  );

  const spilloverBonusByRegion = computeSpilloverBonusByRegion(
    ops,
    Object.fromEntries(AU_REGION_CODES.map((c) => [c, productivity.byRegion[c].productivityIndexBonus])) as Record<
      AuRegionCode,
      number
    >,
  );

  for (const code of AU_REGION_CODES) {
    productivity.byRegion[code].productivityIndexBonus += spilloverBonusByRegion[code];
    productivity.byRegion[code].productivityIndexBonus *= climateModifierFactor;
  }

  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints;

  const fleetCapacity = computeFleetCapacitySnapshot(ops);

  const freightLatencyByRegion = computeFreightLatencyByRegion(
    ops,
    inputs.networkUtilization?.freight ?? 0.5,
  );
  const nationalFreightLatencyMedian = nationalMedianFreightLatency(freightLatencyByRegion);

  const maintenanceWarnings = maintenanceWarningsFromBacklog(options?.maintenanceBacklogByAssetId);
  const bottleneckAssetIds = detectBottlenecks(productivity, ops, inputs);
  const recovery = computeDisruptionRecovery(ops, resilienceScoreByRegion, bottleneckAssetIds.length);

  for (const code of AU_REGION_CODES) {
    productivity.byRegion[code].productivityIndexBonus *= 0.92 + recovery.nationalRecoveryFactor * 0.08;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints;

  const supplyChain = computeSupplyChainResilienceIndex({
    resilienceScoreByRegion,
    freightLatencyByRegion,
    recoveryFactor: recovery.nationalRecoveryFactor,
    corridorSynergyPoints,
  });

  for (const code of AU_REGION_CODES) {
    productivity.byRegion[code].productivityIndexBonus += supplyChain.byRegion[code] * 2.5;
  }
  productivity.nationalProductivityIndexBonus += supplyChain.nationalIndex * 3;

  const modalBalanceIndex = computeModalBalanceIndex(ops, options?.modalShiftPolicy ?? 'balanced');
  const electrifiedFreightShare = computeElectrifiedFreightShare(ops);
  const lastMileCoverageByRegion = computeLastMileCoverageByRegion(ops);
  const nationalLastMile = nationalLastMileCoverage(lastMileCoverageByRegion);
  const intercapitalConnectivityIndex = computeIntercapitalConnectivityIndex(
    corridorActivations,
    TRANSPORT_CORRIDORS,
  );
  const connectivityBonus = connectivityBonusByRegion(corridorActivations, TRANSPORT_CORRIDORS);
  const modalMult = modalBalanceProductivityMultiplier(modalBalanceIndex, options?.modalShiftPolicy ?? 'balanced');

  for (const code of AU_REGION_CODES) {
    const lastMileBoost = (lastMileCoverageByRegion[code] - 50) * 0.015;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + connectivityBonus[code] + lastMileBoost) *
      modalMult *
      (1 + intercapitalConnectivityIndex * 0.04);
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5;

  const containerThroughputByRegion = computeContainerThroughputByRegion(ops);
  const nationalContainerThroughput = nationalContainerThroughputIndex(containerThroughputByRegion);
  const coldChainReliabilityByRegion = computeColdChainReliabilityByRegion(ops);
  const coldChainReliabilityIndex = nationalColdChainReliabilityIndex(coldChainReliabilityByRegion);
  const greenFreightShare = computeGreenFreightShare(ops, options?.greenFreightPolicy ?? 'baseline');
  const greenMult = greenFreightProductivityMultiplier(greenFreightShare, options?.greenFreightPolicy ?? 'baseline');

  for (const code of AU_REGION_CODES) {
    const throughputBoost = (containerThroughputByRegion[code] - 20) * 0.008;
    const coldBoost = (coldChainReliabilityByRegion[code] - 0.45) * 1.8;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + throughputBoost + coldBoost) * greenMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04;

  const freightUtil = inputs.networkUtilization?.freight ?? 0.5;
  const bulkExportThroughputByRegion = computeBulkExportThroughputByRegion(ops);
  const nationalBulkExport = nationalBulkExportThroughputIndex(bulkExportThroughputByRegion);
  const intermodalDwellByRegion = computeIntermodalDwellByRegion(ops, freightUtil);
  const nationalIntermodalDwell = nationalIntermodalDwellMedian(intermodalDwellByRegion);
  const dwellMult = dwellProductivityPenalty(nationalIntermodalDwell);
  const urbanCongestionByRegion = computeUrbanCongestionByRegion(ops, freightUtil);
  const nationalUrbanCongestion = nationalUrbanCongestionIndex(urbanCongestionByRegion);
  const congestionMult = congestionReliefMultiplier(
    nationalUrbanCongestion,
    options?.congestionReliefPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const bulkBoost = (bulkExportThroughputByRegion[code] - 18) * 0.007;
    const dwellPenalty = (intermodalDwellByRegion[code] - 30) * 0.012;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + bulkBoost - dwellPenalty) *
      dwellMult *
      congestionMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035;

  const aviationCargoThroughputByRegion = computeAviationCargoThroughputByRegion(ops);
  const nationalAviationCargo = nationalAviationCargoThroughputIndex(aviationCargoThroughputByRegion);
  const customsClearanceByRegion = computeCustomsClearanceByRegion(ops, freightUtil);
  const nationalCustomsClearance = nationalCustomsClearanceIndex(customsClearanceByRegion);
  const customsMult = customsClearanceProductivityMultiplier(
    nationalCustomsClearance,
    options?.customsModernizationPolicy ?? 'baseline',
  );
  const hydrogenCorridorThroughputByRegion = computeHydrogenCorridorThroughputByRegion(ops);
  const nationalHydrogenCorridor = nationalHydrogenCorridorThroughputIndex(hydrogenCorridorThroughputByRegion);
  const hydrogenFreightShare = computeHydrogenFreightShare(ops, options?.hydrogenFreightPolicy ?? 'baseline');
  const hydrogenMult = hydrogenFreightProductivityMultiplier(
    hydrogenFreightShare,
    options?.hydrogenFreightPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const aviationBoost = (aviationCargoThroughputByRegion[code] - 12) * 0.006;
    const customsBoost = (customsClearanceByRegion[code] - 40) * 0.005;
    const hydrogenBoost = (hydrogenCorridorThroughputByRegion[code] - 8) * 0.007;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + aviationBoost + customsBoost + hydrogenBoost) *
      customsMult *
      hydrogenMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028;

  const coastalShippingThroughputByRegion = computeCoastalShippingThroughputByRegion(ops);
  const nationalCoastalShipping = nationalCoastalShippingThroughputIndex(coastalShippingThroughputByRegion);
  const coastalMult = coastalShippingProductivityMultiplier(
    nationalCoastalShipping,
    options?.coastalShippingPolicy ?? 'baseline',
  );
  const biosecurityClearanceByRegion = computeBiosecurityClearanceByRegion(ops, freightUtil);
  const nationalBiosecurityClearance = nationalBiosecurityClearanceIndex(biosecurityClearanceByRegion);
  const biosecurityMult = biosecurityClearanceProductivityMultiplier(
    nationalBiosecurityClearance,
    options?.biosecurityStreamlinePolicy ?? 'baseline',
  );
  const autonomousCorridorThroughputByRegion = computeAutonomousCorridorThroughputByRegion(ops);
  const nationalAutonomousCorridor = nationalAutonomousCorridorThroughputIndex(autonomousCorridorThroughputByRegion);
  const autonomousFreightShare = computeAutonomousFreightShare(
    ops,
    options?.autonomousFreightPolicy ?? 'baseline',
  );
  const autonomousMult = autonomousFreightProductivityMultiplier(
    autonomousFreightShare,
    options?.autonomousFreightPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const coastalBoost = (coastalShippingThroughputByRegion[code] - 10) * 0.006;
    const biosecurityBoost = (biosecurityClearanceByRegion[code] - 40) * 0.0045;
    const autonomousBoost = (autonomousCorridorThroughputByRegion[code] - 6) * 0.0065;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + coastalBoost + biosecurityBoost + autonomousBoost) *
      coastalMult *
      biosecurityMult *
      autonomousMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024;

  const networkStress = aggregateNetworkStress(inputs.networkUtilization);
  const deepSeaGatewayThroughputByRegion = computeDeepSeaGatewayThroughputByRegion(ops);
  const nationalDeepSeaGateway = nationalDeepSeaGatewayThroughputIndex(deepSeaGatewayThroughputByRegion);
  const deepSeaMult = deepSeaGatewayProductivityMultiplier(
    nationalDeepSeaGateway,
    options?.deepSeaGatewayPolicy ?? 'baseline',
  );
  const infrastructurePermittingByRegion = computeInfrastructurePermittingByRegion(ops, networkStress);
  const nationalInfrastructurePermitting = nationalInfrastructurePermittingIndex(infrastructurePermittingByRegion);
  const permittingMult = infrastructurePermittingProductivityMultiplier(
    nationalInfrastructurePermitting,
    options?.permittingStreamlinePolicy ?? 'baseline',
  );
  const electricCorridorThroughputByRegion = computeElectricCorridorThroughputByRegion(ops);
  const nationalElectricCorridor = nationalElectricCorridorThroughputIndex(electricCorridorThroughputByRegion);
  const electricFreightShare = computeElectricFreightShare(ops, options?.electricFreightPolicy ?? 'baseline');
  const electricMult = electricFreightProductivityMultiplier(
    electricFreightShare,
    options?.electricFreightPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const deepSeaBoost = (deepSeaGatewayThroughputByRegion[code] - 12) * 0.006;
    const permittingBoost = (infrastructurePermittingByRegion[code] - 42) * 0.004;
    const electricBoost = (electricCorridorThroughputByRegion[code] - 5) * 0.006;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + deepSeaBoost + permittingBoost + electricBoost) *
      deepSeaMult *
      permittingMult *
      electricMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023;

  const climateStress = aggregateNetworkStress(inputs.networkUtilization);
  const defenceLogisticsReadinessByRegion = computeDefenceLogisticsReadinessByRegion(ops);
  const nationalDefenceLogistics = nationalDefenceLogisticsReadinessIndex(defenceLogisticsReadinessByRegion);
  const defenceMult = defenceLogisticsProductivityMultiplier(
    nationalDefenceLogistics,
    options?.defenceMobilityPolicy ?? 'baseline',
  );
  const weatherResilienceRoutingByRegion = computeWeatherResilienceRoutingByRegion(ops, climateStress);
  const nationalWeatherResilience = nationalWeatherResilienceRoutingIndex(weatherResilienceRoutingByRegion);
  const weatherMult = weatherResilienceProductivityMultiplier(
    nationalWeatherResilience,
    options?.weatherResiliencePolicy ?? 'baseline',
  );
  const digitalFreightThroughputByRegion = computeDigitalFreightThroughputByRegion(ops);
  const nationalDigitalFreight = nationalDigitalFreightThroughputIndex(digitalFreightThroughputByRegion);
  const digitalFreightVisibilityShare = computeDigitalFreightVisibilityShare(
    ops,
    options?.digitalFreightPolicy ?? 'baseline',
  );
  const digitalMult = digitalFreightProductivityMultiplier(
    digitalFreightVisibilityShare,
    options?.digitalFreightPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const defenceBoost = (defenceLogisticsReadinessByRegion[code] - 8) * 0.0055;
    const weatherBoost = (weatherResilienceRoutingByRegion[code] - 38) * 0.0042;
    const digitalBoost = (digitalFreightThroughputByRegion[code] - 4) * 0.0058;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + defenceBoost + weatherBoost + digitalBoost) *
      defenceMult *
      weatherMult *
      digitalMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023 +
    nationalDefenceLogistics * 0.022 +
    nationalDigitalFreight * 0.021;

  const tradeUtil = inputs.networkUtilization?.trade ?? freightUtil;
  const criticalMineralsExportByRegion = computeCriticalMineralsExportByRegion(ops);
  const nationalCriticalMinerals = nationalCriticalMineralsExportIndex(criticalMineralsExportByRegion);
  const mineralsMult = criticalMineralsProductivityMultiplier(
    nationalCriticalMinerals,
    options?.criticalMineralsPolicy ?? 'baseline',
  );
  const channelMaintenanceByRegion = computeChannelMaintenanceByRegion(ops, tradeUtil);
  const nationalChannelMaintenance = nationalChannelMaintenanceIndex(channelMaintenanceByRegion);
  const channelMult = channelMaintenanceProductivityMultiplier(
    nationalChannelMaintenance,
    options?.channelMaintenancePolicy ?? 'baseline',
  );
  const indigenousRemoteSupplyThroughputByRegion = computeIndigenousRemoteSupplyThroughputByRegion(ops);
  const nationalIndigenousRemoteSupply = nationalIndigenousRemoteSupplyThroughputIndex(
    indigenousRemoteSupplyThroughputByRegion,
  );
  const indigenousRemoteSupplyShare = computeIndigenousRemoteSupplyShare(
    ops,
    options?.indigenousRemoteSupplyPolicy ?? 'baseline',
  );
  const indigenousMult = indigenousRemoteSupplyProductivityMultiplier(
    indigenousRemoteSupplyShare,
    options?.indigenousRemoteSupplyPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const mineralsBoost = (criticalMineralsExportByRegion[code] - 9) * 0.0058;
    const channelBoost = (channelMaintenanceByRegion[code] - 42) * 0.004;
    const indigenousBoost = (indigenousRemoteSupplyThroughputByRegion[code] - 3) * 0.0055;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + mineralsBoost + channelBoost + indigenousBoost) *
      mineralsMult *
      channelMult *
      indigenousMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023 +
    nationalDefenceLogistics * 0.022 +
    nationalDigitalFreight * 0.021 +
    nationalCriticalMinerals * 0.024 +
    nationalIndigenousRemoteSupply * 0.019;

  const gaugeInteroperabilityByRegion = computeGaugeInteroperabilityByRegion(ops);
  const nationalGaugeInteroperability = nationalGaugeInteroperabilityIndex(gaugeInteroperabilityByRegion);
  const gaugeMult = gaugeInteroperabilityProductivityMultiplier(
    nationalGaugeInteroperability,
    options?.gaugeInteroperabilityPolicy ?? 'baseline',
  );
  const disasterRecoveryStagingByRegion = computeDisasterRecoveryStagingByRegion(ops, networkStress);
  const nationalDisasterRecoveryStaging = nationalDisasterRecoveryStagingIndex(disasterRecoveryStagingByRegion);
  const disasterMult = disasterRecoveryStagingProductivityMultiplier(
    nationalDisasterRecoveryStaging,
    options?.disasterRecoveryStagingPolicy ?? 'baseline',
  );
  const circularFreightThroughputByRegion = computeCircularFreightThroughputByRegion(ops);
  const nationalCircularFreight = nationalCircularFreightThroughputIndex(circularFreightThroughputByRegion);
  const circularFreightShare = computeCircularFreightShare(ops, options?.circularFreightPolicy ?? 'baseline');
  const circularMult = circularFreightProductivityMultiplier(
    circularFreightShare,
    options?.circularFreightPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const gaugeBoost = (gaugeInteroperabilityByRegion[code] - 12) * 0.005;
    const disasterBoost = (disasterRecoveryStagingByRegion[code] - 36) * 0.0043;
    const circularBoost = (circularFreightThroughputByRegion[code] - 3) * 0.0055;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + gaugeBoost + disasterBoost + circularBoost) *
      gaugeMult *
      disasterMult *
      circularMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023 +
    nationalDefenceLogistics * 0.022 +
    nationalDigitalFreight * 0.021 +
    nationalCriticalMinerals * 0.024 +
    nationalIndigenousRemoteSupply * 0.019 +
    nationalGaugeInteroperability * 0.02 +
    nationalCircularFreight * 0.018;

  const agriculturalExportThroughputByRegion = computeAgriculturalExportThroughputByRegion(ops);
  const nationalAgriculturalExport = nationalAgriculturalExportThroughputIndex(agriculturalExportThroughputByRegion);
  const agriculturalMult = agriculturalExportProductivityMultiplier(
    nationalAgriculturalExport,
    options?.agriculturalExportPolicy ?? 'baseline',
  );
  const trackPossessionEfficiencyByRegion = computeTrackPossessionEfficiencyByRegion(ops, networkStress);
  const nationalTrackPossession = nationalTrackPossessionEfficiencyIndex(trackPossessionEfficiencyByRegion);
  const trackPossessionMult = trackPossessionProductivityMultiplier(
    nationalTrackPossession,
    options?.trackPossessionPolicy ?? 'baseline',
  );
  const greenBunkeringThroughputByRegion = computeGreenBunkeringThroughputByRegion(ops);
  const nationalGreenBunkering = nationalGreenBunkeringThroughputIndex(greenBunkeringThroughputByRegion);
  const greenBunkeringShare = computeGreenBunkeringShare(ops, options?.greenBunkeringPolicy ?? 'baseline');
  const greenBunkeringMult = greenBunkeringProductivityMultiplier(
    greenBunkeringShare,
    options?.greenBunkeringPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const agriculturalBoost = (agriculturalExportThroughputByRegion[code] - 8) * 0.0056;
    const trackBoost = (trackPossessionEfficiencyByRegion[code] - 38) * 0.0041;
    const bunkeringBoost = (greenBunkeringThroughputByRegion[code] - 3) * 0.0054;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + agriculturalBoost + trackBoost + bunkeringBoost) *
      agriculturalMult *
      trackPossessionMult *
      greenBunkeringMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023 +
    nationalDefenceLogistics * 0.022 +
    nationalDigitalFreight * 0.021 +
    nationalCriticalMinerals * 0.024 +
    nationalIndigenousRemoteSupply * 0.019 +
    nationalGaugeInteroperability * 0.02 +
    nationalCircularFreight * 0.018 +
    nationalAgriculturalExport * 0.022 +
    nationalGreenBunkering * 0.017;

  const pacificFeederThroughputByRegion = computePacificFeederThroughputByRegion(ops);
  const nationalPacificFeeder = nationalPacificFeederThroughputIndex(pacificFeederThroughputByRegion);
  const pacificMult = pacificFeederProductivityMultiplier(
    nationalPacificFeeder,
    options?.pacificFeederPolicy ?? 'baseline',
  );
  const medicalSupplyChainByRegion = computeMedicalSupplyChainByRegion(ops, networkStress);
  const nationalMedicalSupply = nationalMedicalSupplyChainIndex(medicalSupplyChainByRegion);
  const medicalMult = medicalSupplyProductivityMultiplier(
    nationalMedicalSupply,
    options?.medicalSupplyPolicy ?? 'baseline',
  );
  const dataCentreLogisticsThroughputByRegion = computeDataCentreLogisticsThroughputByRegion(ops);
  const nationalDataCentreLogistics = nationalDataCentreLogisticsThroughputIndex(
    dataCentreLogisticsThroughputByRegion,
  );
  const dataCentreLogisticsShare = computeDataCentreLogisticsShare(
    ops,
    options?.dataCentreLogisticsPolicy ?? 'baseline',
  );
  const dataCentreMult = dataCentreLogisticsProductivityMultiplier(
    dataCentreLogisticsShare,
    options?.dataCentreLogisticsPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const pacificBoost = (pacificFeederThroughputByRegion[code] - 7) * 0.0055;
    const medicalBoost = (medicalSupplyChainByRegion[code] - 36) * 0.0044;
    const dataCentreBoost = (dataCentreLogisticsThroughputByRegion[code] - 3) * 0.0056;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + pacificBoost + medicalBoost + dataCentreBoost) *
      pacificMult *
      medicalMult *
      dataCentreMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023 +
    nationalDefenceLogistics * 0.022 +
    nationalDigitalFreight * 0.021 +
    nationalCriticalMinerals * 0.024 +
    nationalIndigenousRemoteSupply * 0.019 +
    nationalGaugeInteroperability * 0.02 +
    nationalCircularFreight * 0.018 +
    nationalAgriculturalExport * 0.022 +
    nationalGreenBunkering * 0.017 +
    nationalPacificFeeder * 0.019 +
    nationalDataCentreLogistics * 0.018;

  const offshoreWindLogisticsByRegion = computeOffshoreWindLogisticsByRegion(ops);
  const nationalOffshoreWind = nationalOffshoreWindLogisticsIndex(offshoreWindLogisticsByRegion);
  const offshoreMult = offshoreWindLogisticsProductivityMultiplier(
    nationalOffshoreWind,
    options?.offshoreWindLogisticsPolicy ?? 'baseline',
  );
  const batterySupplyChainByRegion = computeBatterySupplyChainByRegion(ops, networkStress);
  const nationalBatterySupply = nationalBatterySupplyChainIndex(batterySupplyChainByRegion);
  const batteryMult = batterySupplyProductivityMultiplier(
    nationalBatterySupply,
    options?.batterySupplyChainPolicy ?? 'baseline',
  );
  const cruiseTurnaroundThroughputByRegion = computeCruiseTurnaroundThroughputByRegion(ops);
  const nationalCruiseTurnaround = nationalCruiseTurnaroundThroughputIndex(cruiseTurnaroundThroughputByRegion);
  const cruiseTurnaroundShare = computeCruiseTurnaroundShare(
    ops,
    options?.cruiseTurnaroundPolicy ?? 'baseline',
  );
  const cruiseMult = cruiseTurnaroundProductivityMultiplier(
    cruiseTurnaroundShare,
    options?.cruiseTurnaroundPolicy ?? 'baseline',
  );
  const subseaCableLandingByRegion = computeSubseaCableLandingByRegion(ops);
  const nationalSubseaCable = nationalSubseaCableLandingIndex(subseaCableLandingByRegion);
  const subseaMult = subseaCableLandingProductivityMultiplier(
    nationalSubseaCable,
    options?.subseaCableLandingPolicy ?? 'baseline',
  );
  const greenAmmoniaExportByRegion = computeGreenAmmoniaExportByRegion(ops, networkStress);
  const nationalGreenAmmonia = nationalGreenAmmoniaExportIndex(greenAmmoniaExportByRegion);
  const ammoniaMult = greenAmmoniaExportProductivityMultiplier(
    nationalGreenAmmonia,
    options?.greenAmmoniaExportPolicy ?? 'baseline',
  );
  const airportExpressRailThroughputByRegion = computeAirportExpressRailThroughputByRegion(ops);
  const nationalAirportExpress = nationalAirportExpressRailThroughputIndex(airportExpressRailThroughputByRegion);
  const airportExpressRailShare = computeAirportExpressRailShare(
    ops,
    options?.airportExpressRailPolicy ?? 'baseline',
  );
  const airportExpressMult = airportExpressRailProductivityMultiplier(
    airportExpressRailShare,
    options?.airportExpressRailPolicy ?? 'baseline',
  );
  const lithiumBrineExportByRegion = computeLithiumBrineExportByRegion(ops);
  const nationalLithiumBrine = nationalLithiumBrineExportIndex(lithiumBrineExportByRegion);
  const lithiumMult = lithiumBrineExportProductivityMultiplier(
    nationalLithiumBrine,
    options?.lithiumBrineExportPolicy ?? 'baseline',
  );
  const inlandRailExpressByRegion = computeInlandRailExpressByRegion(ops, networkStress);
  const nationalInlandRailExpress = nationalInlandRailExpressIndex(inlandRailExpressByRegion);
  const inlandRailExpressShare = computeInlandRailExpressShare(
    ops,
    options?.inlandRailExpressPolicy ?? 'baseline',
  );
  const inlandExpressMult = inlandRailExpressProductivityMultiplier(
    inlandRailExpressShare,
    options?.inlandRailExpressPolicy ?? 'baseline',
  );
  const spaceLaunchLogisticsThroughputByRegion = computeSpaceLaunchLogisticsThroughputByRegion(ops);
  const nationalSpaceLaunch = nationalSpaceLaunchLogisticsThroughputIndex(spaceLaunchLogisticsThroughputByRegion);
  const spaceLaunchLogisticsShare = computeSpaceLaunchLogisticsShare(
    ops,
    options?.spaceLaunchLogisticsPolicy ?? 'baseline',
  );
  const spaceLaunchMult = spaceLaunchLogisticsProductivityMultiplier(
    spaceLaunchLogisticsShare,
    options?.spaceLaunchLogisticsPolicy ?? 'baseline',
  );
  const rareEarthMagnetExportByRegion = computeRareEarthMagnetExportByRegion(ops);
  const nationalRareEarthMagnet = nationalRareEarthMagnetExportIndex(rareEarthMagnetExportByRegion);
  const rareEarthMult = rareEarthMagnetExportProductivityMultiplier(
    nationalRareEarthMagnet,
    options?.rareEarthMagnetExportPolicy ?? 'baseline',
  );
  const transTasmanReeferExpressByRegion = computeTransTasmanReeferExpressByRegion(ops, networkStress);
  const nationalTransTasmanReefer = nationalTransTasmanReeferExpressIndex(transTasmanReeferExpressByRegion);
  const transTasmanReeferExpressShare = computeTransTasmanReeferExpressShare(
    ops,
    options?.transTasmanReeferExpressPolicy ?? 'baseline',
  );
  const reeferMult = transTasmanReeferExpressProductivityMultiplier(
    transTasmanReeferExpressShare,
    options?.transTasmanReeferExpressPolicy ?? 'baseline',
  );
  const zeroEmissionTruckCorridorThroughputByRegion = computeZeroEmissionTruckCorridorThroughputByRegion(ops);
  const nationalZeroEmissionTruck = nationalZeroEmissionTruckCorridorThroughputIndex(
    zeroEmissionTruckCorridorThroughputByRegion,
  );
  const zeroEmissionTruckCorridorShare = computeZeroEmissionTruckCorridorShare(
    ops,
    options?.zeroEmissionTruckCorridorPolicy ?? 'baseline',
  );
  const zetMult = zeroEmissionTruckCorridorProductivityMultiplier(
    zeroEmissionTruckCorridorShare,
    options?.zeroEmissionTruckCorridorPolicy ?? 'baseline',
  );
  const offshoreCcsLogisticsByRegion = computeOffshoreCcsLogisticsByRegion(ops);
  const nationalOffshoreCcs = nationalOffshoreCcsLogisticsIndex(offshoreCcsLogisticsByRegion);
  const ccsMult = offshoreCcsLogisticsProductivityMultiplier(
    nationalOffshoreCcs,
    options?.offshoreCcsLogisticsPolicy ?? 'baseline',
  );
  const hydrogenLngExportByRegion = computeHydrogenLngExportByRegion(ops, networkStress);
  const nationalHydrogenLng = nationalHydrogenLngExportIndex(hydrogenLngExportByRegion);
  const h2LngMult = hydrogenLngExportProductivityMultiplier(
    nationalHydrogenLng,
    options?.hydrogenLngExportPolicy ?? 'baseline',
  );
  const urbanMicrofreightHubThroughputByRegion = computeUrbanMicrofreightHubThroughputByRegion(ops);
  const nationalUrbanMicrofreight = nationalUrbanMicrofreightHubThroughputIndex(
    urbanMicrofreightHubThroughputByRegion,
  );
  const urbanMicrofreightHubShare = computeUrbanMicrofreightHubShare(
    ops,
    options?.urbanMicrofreightHubPolicy ?? 'baseline',
  );
  const microfreightMult = urbanMicrofreightHubProductivityMultiplier(
    urbanMicrofreightHubShare,
    options?.urbanMicrofreightHubPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const offshoreBoost = (offshoreWindLogisticsByRegion[code] - 5) * 0.0053;
    const batteryBoost = (batterySupplyChainByRegion[code] - 16) * 0.0046;
    const cruiseBoost = (cruiseTurnaroundThroughputByRegion[code] - 2) * 0.0051;
    const subseaBoost = (subseaCableLandingByRegion[code] - 4) * 0.005;
    const ammoniaBoost = (greenAmmoniaExportByRegion[code] - 12) * 0.0045;
    const airportBoost = (airportExpressRailThroughputByRegion[code] - 2) * 0.0049;
    const lithiumBoost = (lithiumBrineExportByRegion[code] - 5) * 0.0048;
    const inlandExpressBoost = (inlandRailExpressByRegion[code] - 10) * 0.0044;
    const spaceLaunchBoost = (spaceLaunchLogisticsThroughputByRegion[code] - 1) * 0.0046;
    const rareEarthBoost = (rareEarthMagnetExportByRegion[code] - 5) * 0.0047;
    const reeferBoost = (transTasmanReeferExpressByRegion[code] - 8) * 0.0043;
    const zetBoost = (zeroEmissionTruckCorridorThroughputByRegion[code] - 2) * 0.0045;
    const ccsBoost = (offshoreCcsLogisticsByRegion[code] - 4) * 0.0046;
    const h2LngBoost = (hydrogenLngExportByRegion[code] - 11) * 0.0044;
    const microfreightBoost = (urbanMicrofreightHubThroughputByRegion[code] - 2) * 0.0042;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus +
        offshoreBoost +
        batteryBoost +
        cruiseBoost +
        subseaBoost +
        ammoniaBoost +
        airportBoost +
        lithiumBoost +
        inlandExpressBoost +
        spaceLaunchBoost +
        rareEarthBoost +
        reeferBoost +
        zetBoost +
        ccsBoost +
        h2LngBoost +
        microfreightBoost) *
      offshoreMult *
      batteryMult *
      cruiseMult *
      subseaMult *
      ammoniaMult *
      airportExpressMult *
      lithiumMult *
      inlandExpressMult *
      spaceLaunchMult *
      rareEarthMult *
      reeferMult *
      zetMult *
      ccsMult *
      h2LngMult *
      microfreightMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023 +
    nationalDefenceLogistics * 0.022 +
    nationalDigitalFreight * 0.021 +
    nationalCriticalMinerals * 0.024 +
    nationalIndigenousRemoteSupply * 0.019 +
    nationalGaugeInteroperability * 0.02 +
    nationalCircularFreight * 0.018 +
    nationalAgriculturalExport * 0.022 +
    nationalGreenBunkering * 0.017 +
    nationalPacificFeeder * 0.019 +
    nationalDataCentreLogistics * 0.018 +
    nationalOffshoreWind * 0.017 +
    nationalBatterySupply * 0.016 +
    nationalCruiseTurnaround * 0.015 +
    nationalSubseaCable * 0.014 +
    nationalGreenAmmonia * 0.014 +
    nationalAirportExpress * 0.013 +
    nationalLithiumBrine * 0.012 +
    nationalInlandRailExpress * 0.012 +
    nationalSpaceLaunch * 0.011 +
    nationalRareEarthMagnet * 0.011 +
    nationalTransTasmanReefer * 0.01 +
    nationalZeroEmissionTruck * 0.01 +
    nationalOffshoreCcs * 0.009 +
    nationalHydrogenLng * 0.009 +
    nationalUrbanMicrofreight * 0.009;

  const projectedBacklogNextTurn = projectMaintenanceBacklogNextTurn(
    options?.maintenanceBacklogByAssetId,
    baseInputs.operationalAssetIds,
    {
      networkStress: aggregateNetworkStress(inputs.networkUtilization),
      maintenanceSpendIndex: options?.maintenanceSpendIndex,
    },
  );

  const computeMs =
    (typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0 + productivity.computeMs;

  return {
    schemaVersion: 'agent12/21',
    turn: baseInputs.turn,
    productivity,
    activeCorridors: corridorActivations,
    corridorSynergyPoints,
    intermodalSynergyByRegion,
    appliedScenarioIds,
    bottleneckAssetIds,
    maintenanceWarnings,
    resilienceScoreByRegion,
    portRailCouplingByRegion,
    investmentTierByRegion,
    scenarioStackFactor,
    projectedBacklogNextTurn,
    spilloverBonusByRegion,
    fleetCapacity,
    climateModifierFactor,
    pipelineUnlockPoints: pipeline.productivityPoints,
    activePipelineStageIds: pipeline.activeStageIds,
    freightLatencyByRegion,
    nationalFreightLatencyMedian,
    supplyChainResilienceIndex: supplyChain.nationalIndex,
    supplyChainResilienceByRegion: supplyChain.byRegion,
    weakestSupplyChainRegion: supplyChain.weakestRegion,
    disruptionRecoveryFactor: recovery.nationalRecoveryFactor,
    intercapitalConnectivityIndex,
    modalBalanceIndex,
    electrifiedFreightShare,
    lastMileCoverageByRegion,
    nationalLastMileCoverage: nationalLastMile,
    nationalContainerThroughputIndex: nationalContainerThroughput,
    containerThroughputByRegion,
    coldChainReliabilityIndex,
    coldChainReliabilityByRegion,
    greenFreightShare,
    nationalBulkExportThroughputIndex: nationalBulkExport,
    bulkExportThroughputByRegion,
    nationalIntermodalDwellMedian: nationalIntermodalDwell,
    intermodalDwellByRegion,
    nationalUrbanCongestionIndex: nationalUrbanCongestion,
    urbanCongestionByRegion,
    nationalAviationCargoThroughputIndex: nationalAviationCargo,
    aviationCargoThroughputByRegion,
    nationalCustomsClearanceIndex: nationalCustomsClearance,
    customsClearanceByRegion,
    hydrogenFreightShare,
    nationalHydrogenCorridorThroughputIndex: nationalHydrogenCorridor,
    hydrogenCorridorThroughputByRegion,
    nationalCoastalShippingThroughputIndex: nationalCoastalShipping,
    coastalShippingThroughputByRegion,
    nationalBiosecurityClearanceIndex: nationalBiosecurityClearance,
    biosecurityClearanceByRegion,
    autonomousFreightShare,
    nationalAutonomousCorridorThroughputIndex: nationalAutonomousCorridor,
    autonomousCorridorThroughputByRegion,
    nationalDeepSeaGatewayThroughputIndex: nationalDeepSeaGateway,
    deepSeaGatewayThroughputByRegion,
    nationalInfrastructurePermittingIndex: nationalInfrastructurePermitting,
    infrastructurePermittingByRegion,
    electricFreightShare,
    nationalElectricCorridorThroughputIndex: nationalElectricCorridor,
    electricCorridorThroughputByRegion,
    nationalDefenceLogisticsReadinessIndex: nationalDefenceLogistics,
    defenceLogisticsReadinessByRegion,
    nationalWeatherResilienceRoutingIndex: nationalWeatherResilience,
    weatherResilienceRoutingByRegion,
    digitalFreightVisibilityShare,
    nationalDigitalFreightThroughputIndex: nationalDigitalFreight,
    digitalFreightThroughputByRegion,
    nationalCriticalMineralsExportIndex: nationalCriticalMinerals,
    criticalMineralsExportByRegion,
    nationalChannelMaintenanceIndex: nationalChannelMaintenance,
    channelMaintenanceByRegion,
    indigenousRemoteSupplyShare,
    nationalIndigenousRemoteSupplyThroughputIndex: nationalIndigenousRemoteSupply,
    indigenousRemoteSupplyThroughputByRegion,
    nationalGaugeInteroperabilityIndex: nationalGaugeInteroperability,
    gaugeInteroperabilityByRegion,
    nationalDisasterRecoveryStagingIndex: nationalDisasterRecoveryStaging,
    disasterRecoveryStagingByRegion,
    circularFreightShare,
    nationalCircularFreightThroughputIndex: nationalCircularFreight,
    circularFreightThroughputByRegion,
    nationalAgriculturalExportThroughputIndex: nationalAgriculturalExport,
    agriculturalExportThroughputByRegion,
    nationalTrackPossessionEfficiencyIndex: nationalTrackPossession,
    trackPossessionEfficiencyByRegion,
    greenBunkeringShare,
    nationalGreenBunkeringThroughputIndex: nationalGreenBunkering,
    greenBunkeringThroughputByRegion,
    nationalPacificFeederThroughputIndex: nationalPacificFeeder,
    pacificFeederThroughputByRegion,
    nationalMedicalSupplyChainIndex: nationalMedicalSupply,
    medicalSupplyChainByRegion,
    dataCentreLogisticsShare,
    nationalDataCentreLogisticsThroughputIndex: nationalDataCentreLogistics,
    dataCentreLogisticsThroughputByRegion,
    nationalOffshoreWindLogisticsIndex: nationalOffshoreWind,
    offshoreWindLogisticsByRegion,
    nationalBatterySupplyChainIndex: nationalBatterySupply,
    batterySupplyChainByRegion,
    cruiseTurnaroundShare,
    nationalCruiseTurnaroundThroughputIndex: nationalCruiseTurnaround,
    cruiseTurnaroundThroughputByRegion,
    nationalSubseaCableLandingIndex: nationalSubseaCable,
    subseaCableLandingByRegion,
    nationalGreenAmmoniaExportIndex: nationalGreenAmmonia,
    greenAmmoniaExportByRegion,
    airportExpressRailShare,
    nationalAirportExpressRailThroughputIndex: nationalAirportExpress,
    airportExpressRailThroughputByRegion,
    nationalLithiumBrineExportIndex: nationalLithiumBrine,
    lithiumBrineExportByRegion,
    inlandRailExpressShare,
    nationalInlandRailExpressIndex: nationalInlandRailExpress,
    inlandRailExpressByRegion,
    spaceLaunchLogisticsShare,
    nationalSpaceLaunchLogisticsThroughputIndex: nationalSpaceLaunch,
    spaceLaunchLogisticsThroughputByRegion,
    nationalRareEarthMagnetExportIndex: nationalRareEarthMagnet,
    rareEarthMagnetExportByRegion,
    transTasmanReeferExpressShare,
    nationalTransTasmanReeferExpressIndex: nationalTransTasmanReefer,
    transTasmanReeferExpressByRegion,
    zeroEmissionTruckCorridorShare,
    nationalZeroEmissionTruckCorridorThroughputIndex: nationalZeroEmissionTruck,
    zeroEmissionTruckCorridorThroughputByRegion,
    nationalOffshoreCcsLogisticsIndex: nationalOffshoreCcs,
    offshoreCcsLogisticsByRegion,
    nationalHydrogenLngExportIndex: nationalHydrogenLng,
    hydrogenLngExportByRegion,
    urbanMicrofreightHubShare,
    nationalUrbanMicrofreightHubThroughputIndex: nationalUrbanMicrofreight,
    urbanMicrofreightHubThroughputByRegion,
    computeMs,
  };
}

export function defaultInfrastructureInputs(turn: number): TransportProductivityInputs {
  const assets = getAgent12TransportCatalog();
  return {
    turn,
    assets,
    operationalAssetIds: new Set(assets.map((a) => a.id)),
  };
}
