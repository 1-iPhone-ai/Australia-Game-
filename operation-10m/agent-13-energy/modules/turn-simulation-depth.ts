/**
 * Agent 13 scale wave round 2 — turn hook, inter-regional grid coupling spillover,
 * GI ranking alignment, and multi-turn scenario simulation (deterministic).
 */

/** Minimal regional profile slice for spillover (matches V1014RegionalEnergyProfile fields used here). */
export interface V1014RegionalEnergyProfileSpillover {
  regionId: string;
  extractionBand: string;
  renewableBand: string;
  constraintBand: string;
  extractionScore: number;
  renewableShareScore: number;
  environmentalPressure: number;
  gridStressBand: string;
  gridStressPoints: number;
  gridRecoveryBand: string;
  gridRecoveryPoints: number;
  extractionEfficiencyScore: number;
  extractionEfficiencyBand: string;
  activeGridScenarioId: string;
  climateTransitionStage: string;
  climateTransitionDepth: number;
  activeClimateHazards: unknown[];
  activeRuleIds: string[];
  activeSiteIds: string[];
  activeAssetIds: string[];
  evidence: string[];
}

export interface V1014InterRegionalGridLink {
  id: string;
  fromRegionId: string;
  toRegionId: string;
  capacityMw: number;
  couplingStrength: number;
  documentation: string;
}

export const V1014_INTERREGIONAL_GRID_LINKS: readonly V1014InterRegionalGridLink[] = [
  { id: 'link_nsw_vic', fromRegionId: 'NSW', toRegionId: 'VIC', capacityMw: 1800, couplingStrength: 0.82, documentation: 'Primary NEM corridor between NSW and VIC.' },
  { id: 'link_qld_nsw', fromRegionId: 'QLD', toRegionId: 'NSW', capacityMw: 1500, couplingStrength: 0.75, documentation: 'Queensland export path into southern demand centres.' },
  { id: 'link_sa_vic', fromRegionId: 'SA', toRegionId: 'VIC', capacityMw: 650, couplingStrength: 0.68, documentation: 'Heywood-style interconnection stress proxy.' },
  { id: 'link_sa_nsw', fromRegionId: 'SA', toRegionId: 'NSW', capacityMw: 330, couplingStrength: 0.55, documentation: 'Secondary SA–NSW transfer capacity.' },
  { id: 'link_vic_tas', fromRegionId: 'VIC', toRegionId: 'TAS', capacityMw: 500, couplingStrength: 0.7, documentation: 'Basslink marine interconnector coupling.' },
  { id: 'link_wa_island', fromRegionId: 'WA', toRegionId: 'WA', capacityMw: 0, couplingStrength: 0.15, documentation: 'SWIS islanded grid — internal loop only (self-link metadata).' },
  { id: 'link_nt_qld', fromRegionId: 'NT', toRegionId: 'QLD', capacityMw: 120, couplingStrength: 0.35, documentation: 'Remote NT coupling via QLD grid extension (weak).' },
  { id: 'link_act_nsw', fromRegionId: 'ACT', toRegionId: 'NSW', capacityMw: 400, couplingStrength: 0.9, documentation: 'ACT embedded within NSW network envelope.' },
] as const;

export interface V1014InterRegionalFlow {
  linkId: string;
  fromRegionId: string;
  toRegionId: string;
  spilloverPressure: number;
  summary: string;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

export function computeInterRegionalSpillover(
  regions: Record<string, V1014RegionalEnergyProfileSpillover>,
): { flows: V1014InterRegionalFlow[]; adjustedRegions: Record<string, V1014RegionalEnergyProfileSpillover> } {
  const adjusted: Record<string, V1014RegionalEnergyProfileSpillover> = { ...regions };
  const flows: V1014InterRegionalFlow[] = [];

  for (const link of V1014_INTERREGIONAL_GRID_LINKS) {
    if (link.fromRegionId === link.toRegionId) continue;
    const from = regions[link.fromRegionId];
    const to = regions[link.toRegionId];
    if (!from || !to) continue;
    const stressDelta = from.gridStressPoints - to.gridStressPoints;
    if (stressDelta <= 2) continue;
    const spillover = clamp(stressDelta * link.couplingStrength * 0.35, 0, 8);
    if (spillover < 0.5) continue;
    flows.push({
      linkId: link.id,
      fromRegionId: link.fromRegionId,
      toRegionId: link.toRegionId,
      spilloverPressure: spillover,
      summary: `${link.fromRegionId} grid stress spills ${spillover.toFixed(1)} pressure into ${link.toRegionId}.`,
    });
    const target = adjusted[link.toRegionId];
    if (target) {
      adjusted[link.toRegionId] = {
        ...target,
        environmentalPressure: clamp(target.environmentalPressure + spillover, 0, 100),
        evidence: [...target.evidence, flows[flows.length - 1].summary].slice(0, 8),
      };
    }
  }

  return { flows, adjustedRegions: adjusted };
}

export interface Agent13TurnHookParams {
  turn: number;
  enabled: boolean;
  compute: () => { state: Agent13TurnHookStateSlice; persisted: unknown };
}

export interface Agent13TurnHookStateSlice {
  turn: number;
  inputHash: string;
  regions: Record<string, V1014RegionalEnergyProfileSpillover>;
  industryModifiers: Array<{ regionId: string; industry: string; delta: number }>;
  national: { summary: string };
}

export interface Agent13TurnHookResult {
  ok: boolean;
  turn: number;
  interRegionalFlowCount: number;
  turnSimulationDigest: string;
  state: Agent13TurnHookStateSlice & {
    interRegionalFlows: V1014InterRegionalFlow[];
    turnSimulationDigest: string;
  };
  persisted: unknown;
}

export function executeAgent13IndustrialEnergyTurnHook(params: Agent13TurnHookParams): Agent13TurnHookResult {
  const { state, persisted } = params.compute();
  const { flows, adjustedRegions } = computeInterRegionalSpillover(state.regions);
  const digest = `t${params.turn}|flows${flows.length}|hash${state.inputHash}`;
  const merged = {
    ...state,
    regions: adjustedRegions,
    interRegionalFlows: flows,
    turnSimulationDigest: digest,
  };
  return {
    ok: params.enabled,
    turn: params.turn,
    interRegionalFlowCount: flows.length,
    turnSimulationDigest: digest,
    state: merged,
    persisted,
  };
}

export interface Agent13EnergyGIActionSlice {
  id: string;
  title?: string;
  category?: string;
  regionId?: string | null;
  description?: string;
}

export interface Agent13EnergyGIAlignment {
  relevanceDelta: number;
  reason: string | null;
  tags: string[];
}

const ENERGY_GI_KEYWORDS = ['renewable', 'solar', 'wind', 'grid', 'energy', 'mining', 'environment', 'emissions', 'hydrogen', 'battery'];

export function scoreAgent13EnergyEnvironmentGIAlignment(
  action: Agent13EnergyGIActionSlice,
  state: { regions: Record<string, V1014RegionalEnergyProfileSpillover>; national?: { constraintBand?: string } } | null | undefined,
): Agent13EnergyGIAlignment {
  if (!state) return { relevanceDelta: 0, reason: null, tags: [] };
  const text = `${action.title || ''} ${action.category || ''} ${action.description || ''}`.toLowerCase();
  const hits = ENERGY_GI_KEYWORDS.filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null, tags: [] };

  const regionId = action.regionId || undefined;
  const profile = regionId ? state.regions[regionId] : undefined;
  let delta = clamp(hits.length * 0.35, 0, 1.5);
  const tags = ['agent13_energy_gi', ...hits.slice(0, 3)];

  if (profile) {
    if (profile.constraintBand === 'critical' && hits.some(h => h === 'environment' || h === 'emissions')) {
      delta += 0.8;
    }
    if (profile.climateTransitionStage === 'net_zero_pathway' && hits.some(h => h === 'renewable' || h === 'wind' || h === 'solar')) {
      delta += 0.6;
    }
    if (profile.gridStressBand === 'critical' && hits.includes('grid')) {
      delta -= 0.4;
    }
  }

  delta = clamp(delta, -1.5, 2);
  const reason =
    delta > 0.2
      ? `Energy/environment layer: ${hits.slice(0, 2).join(', ')} aligns with regional transition profile.`
      : delta < -0.2
        ? 'High grid stress — action may conflict with regional energy stability (GI hint only).'
        : null;

  return { relevanceDelta: delta, reason, tags };
}

export interface Agent13EnergyScenarioStep {
  turn: number;
  livingRegions: unknown;
  nationalSystems?: unknown;
  crises?: Array<{ id: string; status: string; category: string; affectedRegions: string[] }>;
}

export interface Agent13EnergyScenarioDefinition {
  id: string;
  label: string;
  steps: Agent13EnergyScenarioStep[];
  expect: { minInterRegionalFlowsOnLastTurn?: number; minRegions?: number };
}

export const V1014_ENERGY_TURN_SCENARIOS: readonly Agent13EnergyScenarioDefinition[] = [
  {
    id: 'sc_east_coast_heatwave_cascade',
    label: 'East coast heatwave grid cascade',
    steps: [
      {
        turn: 1,
        livingRegions: { regions: { NSW: { sectors: { energy: 85, renewables: 20 } }, VIC: { sectors: { energy: 70, renewables: 25 } } } },
        nationalSystems: { regions: { NSW: { networks: { energy: { condition: 'strained', utilization: 0.82 } } } } },
      },
      {
        turn: 2,
        livingRegions: { regions: { NSW: { sectors: { energy: 92, renewables: 18 } }, VIC: { sectors: { energy: 78, renewables: 22 } } } },
        nationalSystems: {
          regions: {
            NSW: { networks: { energy: { condition: 'critical', utilization: 0.94 } } },
            VIC: { networks: { energy: { condition: 'bottlenecked', utilization: 0.88 } } },
          },
        },
        crises: [{ id: 'heat_1', status: 'active', category: 'extreme heatwave', affectedRegions: ['NSW', 'VIC'] }],
      },
    ],
    expect: { minRegions: 8, minInterRegionalFlowsOnLastTurn: 1 },
  },
  {
    id: 'sc_wa_mining_renewables_bridge',
    label: 'WA mining with renewable bridge',
    steps: [
      {
        turn: 3,
        livingRegions: { regions: { WA: { sectors: { mining: 90, energy: 75, renewables: 35 } } } },
        nationalSystems: { regions: { WA: { networks: { energy: { condition: 'bottlenecked', utilization: 0.8 } } } } },
      },
    ],
    expect: { minRegions: 8 },
  },
] as const;

export function runAgent13EnergyScenarioSimulation(
  scenario: Agent13EnergyScenarioDefinition,
  computeFn: (step: Agent13EnergyScenarioStep) => Agent13TurnHookResult,
): { passed: boolean; detail: string; lastFlows: number } {
  let lastFlows = 0;
  for (const step of scenario.steps) {
    const result = computeFn(step);
    if (!result.ok) return { passed: false, detail: `compute failed turn ${step.turn}`, lastFlows };
    if (Object.keys(result.state.regions).length < (scenario.expect.minRegions || 1)) {
      return { passed: false, detail: `region count turn ${step.turn}`, lastFlows };
    }
    lastFlows = result.interRegionalFlowCount;
  }
  if (scenario.expect.minInterRegionalFlowsOnLastTurn != null && lastFlows < scenario.expect.minInterRegionalFlowsOnLastTurn) {
    return { passed: false, detail: `flows ${lastFlows} < min ${scenario.expect.minInterRegionalFlowsOnLastTurn}`, lastFlows };
  }
  return { passed: true, detail: 'ok', lastFlows };
}

export function runAgent13TurnSimulationDepthSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_INTERREGIONAL_GRID_LINKS.length >= 7);
  ok(V1014_ENERGY_TURN_SCENARIOS.length >= 2);

  const regions: Record<string, V1014RegionalEnergyProfileSpillover> = {
    NSW: {
      regionId: 'NSW',
      extractionBand: 'moderate',
      renewableBand: 'emerging',
      constraintBand: 'watch',
      extractionScore: 40,
      renewableShareScore: 25,
      environmentalPressure: 50,
      gridStressBand: 'critical',
      gridStressPoints: 20,
      gridRecoveryBand: 'gradual',
      gridRecoveryPoints: 6,
      extractionEfficiencyScore: 45,
      extractionEfficiencyBand: 'fair',
      activeGridScenarioId: 'grid_sc_nsw_baseline_interconnected_1',
      climateTransitionStage: 'hybrid_transition',
      climateTransitionDepth: 35,
      activeClimateHazards: [],
      activeRuleIds: [],
      activeSiteIds: [],
      activeAssetIds: [],
      evidence: [],
    },
    VIC: {
      regionId: 'VIC',
      extractionBand: 'moderate',
      renewableBand: 'emerging',
      constraintBand: 'clear',
      extractionScore: 35,
      renewableShareScore: 30,
      environmentalPressure: 30,
      gridStressBand: 'strained',
      gridStressPoints: 8,
      gridRecoveryBand: 'gradual',
      gridRecoveryPoints: 5,
      extractionEfficiencyScore: 50,
      extractionEfficiencyBand: 'fair',
      activeGridScenarioId: 'grid_sc_vic_baseline_interconnected_1',
      climateTransitionStage: 'hybrid_transition',
      climateTransitionDepth: 38,
      activeClimateHazards: [],
      activeRuleIds: [],
      activeSiteIds: [],
      activeAssetIds: [],
      evidence: [],
    },
  };

  const spill = computeInterRegionalSpillover(regions);
  ok(spill.flows.length >= 1);
  ok((spill.adjustedRegions.VIC?.environmentalPressure || 0) > (regions.VIC?.environmentalPressure || 0));

  const gi = scoreAgent13EnergyEnvironmentGIAlignment(
    { id: 'a1', title: 'Expand offshore wind grid link', category: 'energy', regionId: 'NSW', description: 'renewable grid' },
    { regions: spill.adjustedRegions },
  );
  ok(gi.relevanceDelta > 0 && !!gi.reason);

  const hook = executeAgent13IndustrialEnergyTurnHook({
    turn: 2,
    enabled: true,
    compute: () => ({
      state: {
        turn: 2,
        inputHash: 'test',
        regions,
        industryModifiers: [],
        national: { summary: 'test' },
      },
      persisted: {},
    }),
  });
  ok(hook.interRegionalFlowCount >= 1 && hook.state.turnSimulationDigest.includes('flows'));

  return { passed, failed, total: passed + failed };
}
