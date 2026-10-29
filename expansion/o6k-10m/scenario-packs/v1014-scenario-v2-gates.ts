import type { V1014ScenarioV2GateDefinition } from './v1014-scenario-v2-types';

const ARCH = ["trade_corridor", "energy_transition", "mining_boom", "coastal_resilience", "inland_logistics", "research_momentum", "fiscal_discipline", "crisis_recovery", "diplomatic_window", "workforce_pipeline"] as const;
const TIERS = ["easy", "standard", "hard", "expert"] as const;
const REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"] as const;

const tierUnlock = (tier: string): V1014ScenarioV2GateDefinition['unlockTier'] =>
  tier === 'easy' ? 'starter' : tier === 'standard' ? 'standard' : tier === 'hard' ? 'advanced' : 'expert';

const minMissions = (tier: string) => (tier === 'easy' ? 1 : tier === 'standard' ? 2 : tier === 'hard' ? 3 : 4);

export function buildV1014ScenarioV2GateId(arch: string, tier: string, region: string): string {
  return `V1014_SCENARIO_V2_GATE_${arch.toUpperCase()}_${tier.toUpperCase()}_${region}`;
}

export const V1014_SCENARIO_V2_GATE_REGISTRY: V1014ScenarioV2GateDefinition[] = ARCH.flatMap(arch =>
  TIERS.flatMap(tier =>
    REGIONS.map(region => ({
      id: buildV1014ScenarioV2GateId(arch, tier, region),
      label: `${arch} / ${tier} / ${region}`,
      description: `Registry gate for ${arch} tier ${tier} in ${region}.`,
      minCompletedMissions: minMissions(tier),
      regionAffinity: region,
      archetypeAffinity: arch,
      unlockTier: tierUnlock(tier),
    })),
  ),
);

export const V1014_SCENARIO_V2_GATE_BY_ID: Record<string, V1014ScenarioV2GateDefinition> =
  Object.fromEntries(V1014_SCENARIO_V2_GATE_REGISTRY.map(g => [g.id, g]));

export function isV1014ScenarioV2GateOpen(
  gateId: string, completedScenarioIds: string[], completedMissionCount: number,
): boolean {
  const g = V1014_SCENARIO_V2_GATE_BY_ID[gateId];
  if (!g) return false;
  if (completedMissionCount < g.minCompletedMissions) return false;
  if (g.requiresScenarioIds?.length) {
    return g.requiresScenarioIds.every(id => completedScenarioIds.includes(id));
  }
  return true;
}
