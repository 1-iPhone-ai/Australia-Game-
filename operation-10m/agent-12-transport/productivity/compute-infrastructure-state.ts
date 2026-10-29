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
import { enrichInputsWithScenarios } from '../scenarios/apply-transport-scenarios.ts';
import { computeIntermodalSynergyByRegion } from './intermodal-synergy.ts';
import { computeNationalTransportProductivity } from './compute-national-productivity.ts';
import { clamp } from './formulas.ts';

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
  inputs = scenarioInputs;

  let productivity = computeNationalTransportProductivity(inputs);
  const ops = operationalAssets(inputs);

  const corridorActivations = evaluateAllCorridors(ops);
  const corridorSynergyPoints = totalCorridorSynergy(corridorActivations);
  const logisticsRelief = corridorLogisticsRelief(corridorActivations);

  const intermodalSynergyByRegion = computeIntermodalSynergyByRegion(ops);

  for (const code of AU_REGION_CODES) {
    const synergy = intermodalSynergyByRegion[code];
    const corridorShare =
      corridorActivations
        .filter((c) => c.active)
        .reduce((s, c) => s + c.synergyPoints, 0) / Math.max(1, AU_REGION_CODES.length);
    productivity.byRegion[code].productivityIndexBonus += synergy + corridorShare * 0.15;
    productivity.byRegion[code].logisticsCostMultiplier = clamp(
      productivity.byRegion[code].logisticsCostMultiplier - logisticsRelief * 0.2,
      0.5,
      1.05,
    );
  }

  productivity.nationalProductivityIndexBonus = AU_REGION_CODES.reduce(
    (s, c) => s + productivity.byRegion[c].productivityIndexBonus,
    0,
  );
  productivity.nationalLogisticsCostMultiplier = clamp(
    productivity.nationalLogisticsCostMultiplier - logisticsRelief,
    0.5,
    1.05,
  );

  const maintenanceWarnings = maintenanceWarningsFromBacklog(options?.maintenanceBacklogByAssetId);
  const bottleneckAssetIds = detectBottlenecks(productivity, ops, inputs);

  const computeMs =
    (typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0 + productivity.computeMs;

  return {
    schemaVersion: 'agent12/2',
    turn: baseInputs.turn,
    productivity,
    activeCorridors: corridorActivations,
    corridorSynergyPoints,
    intermodalSynergyByRegion,
    appliedScenarioIds,
    bottleneckAssetIds,
    maintenanceWarnings,
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
