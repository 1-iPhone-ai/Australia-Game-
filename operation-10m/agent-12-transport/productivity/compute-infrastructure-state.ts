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
    schemaVersion: 'agent12/8',
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
