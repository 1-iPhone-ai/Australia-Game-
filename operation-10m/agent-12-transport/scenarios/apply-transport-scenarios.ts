import { getScenarioById, TRANSPORT_STRESS_SCENARIOS } from '../catalog/scenarios-catalog.ts';
import type {
  StrategicNetworkKind,
  TransportAsset,
  TransportAssetCategory,
  TransportAssetCondition,
  TransportProductivityInputs,
  TransportStressScenario,
} from '../types.ts';
import { worsenCondition } from '../operations/maintenance-backlog.ts';

function mergeUtilization(
  base: Partial<Record<StrategicNetworkKind, number>> | undefined,
  kind: StrategicNetworkKind | undefined,
  add: number,
): Partial<Record<StrategicNetworkKind, number>> {
  const out = { ...(base ?? {}) };
  if (!kind) return out;
  out[kind] = Math.min(1.25, (out[kind] ?? 0) + add);
  return out;
}

function assetMatchesScenario(asset: TransportAsset, scenario: TransportStressScenario): boolean {
  if (!scenario.targetRegions.includes(asset.hostRegion)) return false;
  if (scenario.affectedCategories && !scenario.affectedCategories.includes(asset.category)) return false;
  if (scenario.networkKind && !asset.strategicNetworks.includes(scenario.networkKind)) return false;
  return true;
}

export function resolveActiveScenarios(activeScenarioIds: ReadonlySet<string> | undefined): TransportStressScenario[] {
  if (!activeScenarioIds || activeScenarioIds.size === 0) return [];
  const out: TransportStressScenario[] = [];
  for (const id of activeScenarioIds) {
    const s = getScenarioById(id);
    if (s) out.push(s);
  }
  return out;
}

export function applyScenariosToInputs(
  base: TransportProductivityInputs,
  scenarios: TransportStressScenario[],
): TransportProductivityInputs {
  if (scenarios.length === 0) return base;

  let networkUtilization = base.networkUtilization;
  const conditionByAssetId = new Map<string, TransportAssetCondition>(base.conditionByAssetId ?? []);

  for (const scenario of scenarios) {
    networkUtilization = mergeUtilization(networkUtilization, scenario.networkKind, scenario.utilizationAdd);
    if (scenario.conditionPenaltySteps <= 0) continue;
    for (const asset of base.assets) {
      if (!base.operationalAssetIds.has(asset.id)) continue;
      if (!assetMatchesScenario(asset, scenario)) continue;
      const prior = conditionByAssetId.get(asset.id) ?? 'good';
      conditionByAssetId.set(asset.id, worsenCondition(prior, scenario.conditionPenaltySteps));
    }
  }

  return {
    ...base,
    networkUtilization,
    conditionByAssetId,
  };
}

export function enrichInputsWithScenarios(
  base: TransportProductivityInputs,
  activeScenarioIds: ReadonlySet<string> | undefined,
): { inputs: TransportProductivityInputs; appliedScenarioIds: string[] } {
  const scenarios = resolveActiveScenarios(activeScenarioIds);
  return {
    inputs: applyScenariosToInputs(base, scenarios),
    appliedScenarioIds: scenarios.map((s) => s.id),
  };
}

export function listScenarioIds(): string[] {
  return TRANSPORT_STRESS_SCENARIOS.map((s) => s.id);
}
