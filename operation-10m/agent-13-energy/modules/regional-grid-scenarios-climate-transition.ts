/**
 * Agent 13 scale wave — regional grid scenarios & climate transition depth (read-only diagnostics).
 */

import type { V1014GridStressBand } from './grid-coupling';

export type V1014GridScenarioArchetype =
  | 'baseline_interconnected'
  | 'renewable_export_corridor'
  | 'mining_demand_spike'
  | 'islanded_supply'
  | 'interconnector_constrained'
  | 'distributed_solar_ramp'
  | 'gas_peaker_reliance'
  | 'hydro_drought_coupling';

export interface V1014RegionalGridScenario {
  id: string;
  regionId: string;
  archetype: V1014GridScenarioArchetype;
  label: string;
  stressModifier: number;
  recoveryBias: number;
  renewableAffinity: number;
  documentation: string;
}

export type V1014ClimateTransitionStage =
  | 'legacy_heavy'
  | 'hybrid_transition'
  | 'accelerated_decarbonization'
  | 'net_zero_pathway';

export interface V1014ClimateTransitionProfile {
  stage: V1014ClimateTransitionStage;
  depth: number;
  momentum: number;
  summary: string;
}

const REGIONS = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as const;

const ARCHETYPE_META: Record<
  V1014GridScenarioArchetype,
  { label: string; stress: number; recovery: number; ren: number; doc: string }
> = {
  baseline_interconnected: {
    label: 'Baseline NEM interconnection',
    stress: 0,
    recovery: 2,
    ren: 0.5,
    doc: 'Standard east-coast grid coupling; neutral scenario stress.',
  },
  renewable_export_corridor: {
    label: 'Renewable export corridor',
    stress: 4,
    recovery: 5,
    ren: 1.2,
    doc: 'High renewable output tests export limits and local grid hosting.',
  },
  mining_demand_spike: {
    label: 'Mining demand spike',
    stress: 8,
    recovery: 1,
    ren: -0.3,
    doc: 'Pilbara-style load ramps increase regional utilization without price mutation.',
  },
  islanded_supply: {
    label: 'Islanded regional supply',
    stress: 10,
    recovery: 3,
    ren: 0.2,
    doc: 'Weak interconnection raises local balancing risk.',
  },
  interconnector_constrained: {
    label: 'Interconnector constrained',
    stress: 7,
    recovery: 4,
    ren: 0.4,
    doc: 'Flow limits between regions amplify local bottlenecks.',
  },
  distributed_solar_ramp: {
    label: 'Distributed solar ramp',
    stress: 3,
    recovery: 6,
    ren: 1.0,
    doc: 'Rooftop and DER growth shifts midday net load patterns.',
  },
  gas_peaker_reliance: {
    label: 'Gas peaker reliance',
    stress: 6,
    recovery: 2,
    ren: -0.5,
    doc: 'Thermal firming dominates during renewable lulls.',
  },
  hydro_drought_coupling: {
    label: 'Hydro drought coupling',
    stress: 9,
    recovery: 2,
    ren: 0.1,
    doc: 'Storage drawdown links water stress to evening peak shortfall.',
  },
};

const ARCHETYPES = Object.keys(ARCHETYPE_META) as V1014GridScenarioArchetype[];

function regionalArchetypeOrder(regionId: string): V1014GridScenarioArchetype[] {
  const offset = REGIONS.indexOf(regionId as (typeof REGIONS)[number]);
  const rotated = [...ARCHETYPES.slice(offset % ARCHETYPES.length), ...ARCHETYPES.slice(0, offset % ARCHETYPES.length)];
  return rotated;
}

function buildScenarioCatalog(): V1014RegionalGridScenario[] {
  const out: V1014RegionalGridScenario[] = [];
  for (const regionId of REGIONS) {
    const order = regionalArchetypeOrder(regionId);
    order.forEach((archetype, idx) => {
      const meta = ARCHETYPE_META[archetype];
      const variant = idx + 1;
      out.push({
        id: `grid_sc_${regionId.toLowerCase()}_${archetype}_${variant}`,
        regionId,
        archetype,
        label: `${meta.label} — ${regionId} v${variant}`,
        stressModifier: meta.stress + (variant % 3),
        recoveryBias: meta.recovery + (variant % 2),
        renewableAffinity: meta.ren,
        documentation: `${meta.doc} Scenario variant ${variant} for ${regionId}.`,
      });
    });
  }
  return out;
}

export const V1014_REGIONAL_GRID_SCENARIOS: readonly V1014RegionalGridScenario[] = buildScenarioCatalog();

export const V1014_REGIONAL_GRID_SCENARIOS_BY_ID: Record<string, V1014RegionalGridScenario> = Object.fromEntries(
  V1014_REGIONAL_GRID_SCENARIOS.map(s => [s.id, s]),
);

export function selectRegionalGridScenario(params: {
  regionId: string;
  gridStressBand: V1014GridStressBand;
  renewableShareScore: number;
  extractionScore: number;
}): V1014RegionalGridScenario {
  const candidates = V1014_REGIONAL_GRID_SCENARIOS.filter(s => s.regionId === params.regionId);
  if (!candidates.length) {
    return V1014_REGIONAL_GRID_SCENARIOS[0];
  }
  let best = candidates[0];
  let bestScore = -Infinity;
  for (const c of candidates) {
    let score = c.recoveryBias - c.stressModifier * 0.2;
    score += c.renewableAffinity * (params.renewableShareScore / 40);
    if (params.gridStressBand === 'critical' || params.gridStressBand === 'bottlenecked') {
      score += c.stressModifier * 0.15;
    }
    score += params.extractionScore / 200;
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return best;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

export function computeClimateTransitionProfile(params: {
  renewableShareScore: number;
  extractionScore: number;
  environmentalPressure: number;
  gridStressPoints: number;
  renewableBand: string;
}): V1014ClimateTransitionProfile {
  const ren = params.renewableShareScore;
  const extract = params.extractionScore;
  const pressure = params.environmentalPressure;
  const grid = params.gridStressPoints;

  let depth = ren * 0.55 + Math.max(0, 40 - extract) * 0.35 - pressure * 0.25 - grid * 0.4;
  depth += params.renewableBand === 'leading' ? 12 : params.renewableBand === 'material' ? 6 : 0;
  depth = clamp(depth, 0, 100);

  let stage: V1014ClimateTransitionStage = 'legacy_heavy';
  if (depth >= 72) stage = 'net_zero_pathway';
  else if (depth >= 52) stage = 'accelerated_decarbonization';
  else if (depth >= 30) stage = 'hybrid_transition';

  const momentum = clamp((ren - extract * 0.3 - grid * 1.5) / 50, -1, 1);
  const summary = `Climate transition ${stage} (depth ${depth.toFixed(0)}, momentum ${momentum >= 0 ? '+' : ''}${momentum.toFixed(2)}).`;

  return { stage, depth, momentum, summary };
}

export function runV1014RegionalGridClimateScaleSelfTests(): {
  passed: number;
  failed: number;
  total: number;
} {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_REGIONAL_GRID_SCENARIOS.length === REGIONS.length * ARCHETYPES.length);
  ok(V1014_REGIONAL_GRID_SCENARIOS.every(s => s.id.startsWith('grid_sc_')));
  const wa = selectRegionalGridScenario({
    regionId: 'WA',
    gridStressBand: 'critical',
    renewableShareScore: 25,
    extractionScore: 70,
  });
  ok(wa.regionId === 'WA');
  const tr = computeClimateTransitionProfile({
    renewableShareScore: 65,
    extractionScore: 30,
    environmentalPressure: 40,
    gridStressPoints: 6,
    renewableBand: 'leading',
  });
  ok(tr.depth >= 30);
  ok(['hybrid_transition', 'accelerated_decarbonization', 'net_zero_pathway'].includes(tr.stage));

  return { passed, failed, total: passed + failed };
}
