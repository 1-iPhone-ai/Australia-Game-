/**
 * Agent 13 scale wave round 26 (O10-183) — climate adaptation hardening & flood-heat resilience orchestration depth.
 * Cross-turn persistence for adaptation corridors and flood-heat industrial resilience relief
 * coupled to bushfire grid relief, drought-desal, blue carbon, and biodiversity coexistence maturity.
 */

export type V1014ClimateAdaptationHardeningBand =
  | 'exposed_legacy'
  | 'pilot_hardening'
  | 'adaptation_corridor'
  | 'climate_resilient_leader';

export type V1014FloodHeatResilienceBand =
  | 'vulnerable_mesh'
  | 'pilot_resilience'
  | 'flood_heat_hub'
  | 'industrial_resilience_mesh';

export interface V1014ClimateAdaptationHardeningInstrument {
  id: string;
  kind: 'substation_flood_barrier' | 'heat_derating_orchestration' | 'coastal_adaptation_backbone' | 'industrial_climate_hardening_loop';
  label: string;
  hardeningMwEq: number;
  adaptationReliefFactor: number;
  resilienceSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_CLIMATE_ADAPTATION_HARDENING_CATALOG: readonly V1014ClimateAdaptationHardeningInstrument[] = [
  {
    id: 'ca_flood_barrier',
    kind: 'substation_flood_barrier',
    label: 'Substation flood barrier mesh',
    hardeningMwEq: 40,
    adaptationReliefFactor: 0.16,
    resilienceSynergyFactor: 0.11,
    projectTypeHint: 'substation_flood_barrier_mesh',
  },
  {
    id: 'ca_heat_derate',
    kind: 'heat_derating_orchestration',
    label: 'Heat derating orchestration layer',
    hardeningMwEq: 42,
    adaptationReliefFactor: 0.15,
    resilienceSynergyFactor: 0.12,
    projectTypeHint: 'heat_derating_orchestration_layer',
  },
  {
    id: 'ca_coastal',
    kind: 'coastal_adaptation_backbone',
    label: 'Coastal adaptation backbone corridor',
    hardeningMwEq: 44,
    adaptationReliefFactor: 0.17,
    resilienceSynergyFactor: 0.1,
    projectTypeHint: 'coastal_adaptation_backbone_corridor',
  },
  {
    id: 'ca_industrial',
    kind: 'industrial_climate_hardening_loop',
    label: 'Industrial climate hardening loop',
    hardeningMwEq: 46,
    adaptationReliefFactor: 0.16,
    resilienceSynergyFactor: 0.13,
    projectTypeHint: 'industrial_climate_hardening_loop',
  },
] as const;

export interface V1014FloodHeatResilienceTemplate {
  id: string;
  kind: 'flood_microgrid_island' | 'heat_stress_demand_orchestration' | 'industrial_cooling_nexus' | 'compound_hazard_recovery_hub';
  label: string;
  resilienceScoreEq: number;
  gridReliefFactor: number;
  adaptationSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_FLOOD_HEAT_RESILIENCE_CATALOG: readonly V1014FloodHeatResilienceTemplate[] = [
  {
    id: 'fh_microgrid',
    kind: 'flood_microgrid_island',
    label: 'Flood microgrid island cluster',
    resilienceScoreEq: 43,
    gridReliefFactor: 0.15,
    adaptationSynergyFactor: 0.1,
    projectTypeHint: 'flood_microgrid_island_cluster',
  },
  {
    id: 'fh_heat_demand',
    kind: 'heat_stress_demand_orchestration',
    label: 'Heat stress demand orchestration hub',
    resilienceScoreEq: 45,
    gridReliefFactor: 0.16,
    adaptationSynergyFactor: 0.11,
    projectTypeHint: 'heat_stress_demand_orchestration_hub',
  },
  {
    id: 'fh_cooling',
    kind: 'industrial_cooling_nexus',
    label: 'Industrial cooling resilience nexus',
    resilienceScoreEq: 47,
    gridReliefFactor: 0.17,
    adaptationSynergyFactor: 0.12,
    projectTypeHint: 'industrial_cooling_resilience_nexus',
  },
  {
    id: 'fh_compound',
    kind: 'compound_hazard_recovery_hub',
    label: 'Compound hazard recovery hub',
    resilienceScoreEq: 49,
    gridReliefFactor: 0.16,
    adaptationSynergyFactor: 0.13,
    projectTypeHint: 'compound_hazard_recovery_hub',
  },
] as const;

export interface V1014RegionalClimateAdaptationHardeningLedger {
  regionId: string;
  band: V1014ClimateAdaptationHardeningBand;
  adaptationIndex: number;
  hardeningBalance: number;
  climateAdaptationRelief: number;
  summary: string;
}

export interface V1014RegionalFloodHeatResilienceLedger {
  regionId: string;
  band: V1014FloodHeatResilienceBand;
  resilienceIndex: number;
  floodHeatResilienceRelief: number;
  summary: string;
}

export interface V1014ClimateAdaptationHardeningPersistedSlice {
  hardeningBalance: number;
  adaptationIndex: number;
}

export interface V1014FloodHeatResiliencePersistedSlice {
  resilienceIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const ADAPTATION_REGIONS = new Set(['QLD', 'NSW', 'NT', 'WA', 'TAS']);

export function computeRegionalClimateAdaptationHardeningLedger(params: {
  regionId: string;
  bushfireGridRelief: number;
  droughtDesalRelief: number;
  blueCarbonCoastalRelief: number;
  biodiversityCoexistenceRelief: number;
  climatePressure: number;
  completedProjectTypes: string[];
  prev?: V1014ClimateAdaptationHardeningPersistedSlice | null;
}): { ledger: V1014RegionalClimateAdaptationHardeningLedger; next: V1014ClimateAdaptationHardeningPersistedSlice } {
  let hardeningGain = 0;
  let adaptationProxy = 0;
  let resilienceSynergy = 0;
  for (const inst of V1014_CLIMATE_ADAPTATION_HARDENING_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      hardeningGain += inst.hardeningMwEq;
      adaptationProxy += inst.adaptationReliefFactor;
      resilienceSynergy += inst.resilienceSynergyFactor;
    }
  }
  if (ADAPTATION_REGIONS.has(params.regionId)) adaptationProxy += 0.05;
  else adaptationProxy *= 0.75;
  if (params.bushfireGridRelief > 2.5) {
    hardeningGain += clamp(params.bushfireGridRelief * 0.88, 0, 10);
    adaptationProxy += 0.06;
  }
  if (params.droughtDesalRelief > 2.2) resilienceSynergy += clamp(params.droughtDesalRelief * 0.015, 0, 0.07);
  if (params.blueCarbonCoastalRelief > 2.1) adaptationProxy += clamp(params.blueCarbonCoastalRelief * 0.011, 0, 0.05);
  if (params.biodiversityCoexistenceRelief > 2.4) hardeningGain += clamp(params.biodiversityCoexistenceRelief * 0.7, 0, 8);
  adaptationProxy += clamp(params.climatePressure / 95, 0, 0.07);

  const prevIdx = params.prev?.adaptationIndex ?? 0;
  const prevBal = params.prev?.hardeningBalance ?? 0;
  const hardeningBalance = clamp(prevBal * 0.84 + hardeningGain * 0.1, 0, 215);
  const adaptationIndex = clamp(
    prevIdx * 0.81 + hardeningBalance * 0.09 + adaptationProxy * 77 + resilienceSynergy * 25,
    0,
    162,
  );

  let band: V1014ClimateAdaptationHardeningBand = 'exposed_legacy';
  if (adaptationIndex >= 103 || hardeningGain >= 120) band = 'climate_resilient_leader';
  else if (adaptationIndex >= 64 || hardeningGain >= 70) band = 'adaptation_corridor';
  else if (adaptationIndex >= 27 || hardeningGain >= 26) band = 'pilot_hardening';

  let climateAdaptationRelief = clamp(adaptationProxy * 8 + hardeningGain * 0.037 + resilienceSynergy * 4.9, 0, 10.2);
  if (band === 'exposed_legacy') climateAdaptationRelief *= 0.28;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      adaptationIndex: clamp(adaptationIndex, 0, 162),
      hardeningBalance: clamp(hardeningBalance, 0, 215),
      climateAdaptationRelief: clamp(climateAdaptationRelief, 0, 10.2),
      summary: `${params.regionId} adaptation ${band} · idx ${adaptationIndex.toFixed(0)} · relief ${climateAdaptationRelief.toFixed(1)}`,
    },
    next: {
      hardeningBalance: clamp(hardeningBalance, 0, 215),
      adaptationIndex: clamp(adaptationIndex, 0, 162),
    },
  };
}

export function advanceRegionalFloodHeatResilienceOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  adaptationBand: V1014ClimateAdaptationHardeningBand;
  communityMicrogridRelief: number;
  completedProjectTypes: string[];
  prev?: V1014FloodHeatResiliencePersistedSlice | null;
}): { ledger: V1014RegionalFloodHeatResilienceLedger; next: V1014FloodHeatResiliencePersistedSlice } {
  let resilienceGain = 0;
  let gridReliefProxy = 0;
  let adaptationSynergy = 0;
  for (const tpl of V1014_FLOOD_HEAT_RESILIENCE_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      resilienceGain += tpl.resilienceScoreEq;
      gridReliefProxy += tpl.gridReliefFactor;
      adaptationSynergy += tpl.adaptationSynergyFactor;
    }
  }
  if (params.adaptationBand === 'adaptation_corridor' || params.adaptationBand === 'climate_resilient_leader') {
    resilienceGain += 15;
    adaptationSynergy += 0.09;
  }
  if (params.communityMicrogridRelief > 2.6) {
    resilienceGain += params.communityMicrogridRelief * 0.8;
    gridReliefProxy += clamp(params.communityMicrogridRelief * 0.008, 0, 0.04);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.26, 0, 10);
  const prevIdx = params.prev?.resilienceIndex ?? 0;
  const resilienceIndex = clamp(
    prevIdx * 0.82 + resilienceGain * 0.1 + gridReliefProxy * 28 - stressLoad * 0.03 + adaptationSynergy * 25,
    0,
    164,
  );

  let band: V1014FloodHeatResilienceBand = 'vulnerable_mesh';
  if (resilienceIndex >= 106 || resilienceGain >= 124) band = 'industrial_resilience_mesh';
  else if (resilienceIndex >= 68 || resilienceGain >= 78) band = 'flood_heat_hub';
  else if (resilienceIndex >= 29 || resilienceGain >= 28) band = 'pilot_resilience';

  let floodHeatResilienceRelief = clamp(resilienceIndex / 18.5 + gridReliefProxy * 6.3 + adaptationSynergy * 6.6, 0, 9.9);
  if (band === 'vulnerable_mesh') floodHeatResilienceRelief = clamp(floodHeatResilienceRelief * 0.26, 0, 2.4);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      resilienceIndex: clamp(resilienceIndex, 0, 164),
      floodHeatResilienceRelief: clamp(floodHeatResilienceRelief, 0, 9.9),
      summary: `${params.regionId} flood-heat ${band} · idx ${resilienceIndex.toFixed(0)} · relief ${floodHeatResilienceRelief.toFixed(1)}`,
    },
    next: { resilienceIndex: clamp(resilienceIndex, 0, 164) },
  };
}

export const V1014_CLIMATE_FLOOD_HEAT_SCENARIOS = [
  {
    id: 'sc_cfh_qld',
    label: 'QLD substation flood barrier with compound hazard hub',
    regionId: 'QLD',
    bushfireGridRelief: 3,
    droughtDesalRelief: 2.8,
    blueCarbonCoastalRelief: 2.6,
    biodiversityCoexistenceRelief: 2.7,
    climatePressure: 18,
    gridStressPoints: 17,
    communityMicrogridRelief: 2.9,
    completedProjectTypes: [
      'substation_flood_barrier_mesh',
      'industrial_climate_hardening_loop',
      'compound_hazard_recovery_hub',
      'heat_stress_demand_orchestration_hub',
    ],
    expectAdaptationBand: 'adaptation_corridor' as V1014ClimateAdaptationHardeningBand,
    expectMinAdaptationRelief: 2,
    expectResilienceBand: 'flood_heat_hub' as V1014FloodHeatResilienceBand,
    expectMinResilienceRelief: 1.8,
  },
  {
    id: 'sc_cfh_nsw',
    label: 'NSW heat derating with flood microgrid',
    regionId: 'NSW',
    bushfireGridRelief: 2.6,
    droughtDesalRelief: 2.4,
    blueCarbonCoastalRelief: 2.3,
    biodiversityCoexistenceRelief: 2.5,
    climatePressure: 16,
    gridStressPoints: 15,
    communityMicrogridRelief: 2.5,
    adaptationBand: 'pilot_hardening' as V1014ClimateAdaptationHardeningBand,
    completedProjectTypes: ['heat_derating_orchestration_layer', 'flood_microgrid_island_cluster'],
    expectResilienceBand: 'pilot_resilience' as V1014FloodHeatResilienceBand,
    expectMinResilienceRelief: 1.4,
  },
] as const;

export function runAgent13ClimateFloodHeatScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_CLIMATE_ADAPTATION_HARDENING_CATALOG.length >= 4);
  ok(V1014_FLOOD_HEAT_RESILIENCE_CATALOG.length >= 4);

  const sc0 = V1014_CLIMATE_FLOOD_HEAT_SCENARIOS[0];
  const adaptation = computeRegionalClimateAdaptationHardeningLedger({
    regionId: sc0.regionId,
    bushfireGridRelief: sc0.bushfireGridRelief,
    droughtDesalRelief: sc0.droughtDesalRelief,
    blueCarbonCoastalRelief: sc0.blueCarbonCoastalRelief,
    biodiversityCoexistenceRelief: sc0.biodiversityCoexistenceRelief,
    climatePressure: sc0.climatePressure,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    adaptation.ledger.band === sc0.expectAdaptationBand ||
      adaptation.ledger.band === 'climate_resilient_leader' ||
      adaptation.ledger.climateAdaptationRelief >= sc0.expectMinAdaptationRelief,
  );

  const resilience = advanceRegionalFloodHeatResilienceOrchestration({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    adaptationBand: adaptation.ledger.band,
    communityMicrogridRelief: sc0.communityMicrogridRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    resilience.ledger.band === sc0.expectResilienceBand ||
      resilience.ledger.band === 'industrial_resilience_mesh' ||
      resilience.ledger.floodHeatResilienceRelief >= sc0.expectMinResilienceRelief,
  );

  const sc1 = V1014_CLIMATE_FLOOD_HEAT_SCENARIOS[1];
  const resilienceN = advanceRegionalFloodHeatResilienceOrchestration({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    adaptationBand: sc1.adaptationBand,
    communityMicrogridRelief: sc1.communityMicrogridRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(
    resilienceN.ledger.floodHeatResilienceRelief >= sc1.expectMinResilienceRelief ||
      resilienceN.ledger.band !== 'vulnerable_mesh',
  );

  const persistA = computeRegionalClimateAdaptationHardeningLedger({
    regionId: 'WA',
    bushfireGridRelief: 2.4,
    droughtDesalRelief: 2.2,
    blueCarbonCoastalRelief: 2.1,
    biodiversityCoexistenceRelief: 2.3,
    climatePressure: 14,
    completedProjectTypes: ['coastal_adaptation_backbone_corridor'],
    prev: null,
  });
  const persistB = computeRegionalClimateAdaptationHardeningLedger({
    regionId: 'WA',
    bushfireGridRelief: 2.4,
    droughtDesalRelief: 2.2,
    blueCarbonCoastalRelief: 2.1,
    biodiversityCoexistenceRelief: 2.3,
    climatePressure: 14,
    completedProjectTypes: ['coastal_adaptation_backbone_corridor'],
    prev: persistA.next,
  });
  ok(persistB.next.adaptationIndex >= persistA.next.adaptationIndex * 0.7);

  const turnSc = runAgent13ClimateFloodHeatTurnScenario(V1014_CLIMATE_FLOOD_HEAT_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastAdaptationRelief >= 2);

  const gi = scoreAgent13ClimateFloodHeatGIAlignment({
    actionText: 'Substation flood barrier with compound hazard recovery and heat stress orchestration',
    adaptationBand: 'adaptation_corridor',
    resilienceBand: 'flood_heat_hub',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13ClimateFloodHeatTurnStep {
  turn: number;
  regionId: string;
  bushfireGridRelief: number;
  droughtDesalRelief: number;
  blueCarbonCoastalRelief: number;
  biodiversityCoexistenceRelief: number;
  climatePressure: number;
  gridStressPoints: number;
  communityMicrogridRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13ClimateFloodHeatTurnScenario {
  id: string;
  label: string;
  steps: Agent13ClimateFloodHeatTurnStep[];
  expect: {
    minAdaptationReliefOnLast?: number;
    minResilienceReliefOnLast?: number;
    lastAdaptationBand?: V1014ClimateAdaptationHardeningBand;
  };
}

export const V1014_CLIMATE_FLOOD_HEAT_TURN_SCENARIOS: readonly Agent13ClimateFloodHeatTurnScenario[] = [
  {
    id: 'sc_cfh_qld_escalation',
    label: 'QLD climate hardening with industrial resilience mesh',
    steps: [
      {
        turn: 1,
        regionId: 'QLD',
        bushfireGridRelief: 2.4,
        droughtDesalRelief: 2.2,
        blueCarbonCoastalRelief: 2.1,
        biodiversityCoexistenceRelief: 2.3,
        climatePressure: 20,
        gridStressPoints: 18,
        communityMicrogridRelief: 2.4,
        completedProjectTypes: ['substation_flood_barrier_mesh', 'heat_derating_orchestration_layer'],
      },
      {
        turn: 2,
        regionId: 'QLD',
        bushfireGridRelief: 2.7,
        droughtDesalRelief: 2.5,
        blueCarbonCoastalRelief: 2.4,
        biodiversityCoexistenceRelief: 2.6,
        climatePressure: 18,
        gridStressPoints: 16,
        communityMicrogridRelief: 2.7,
        completedProjectTypes: ['coastal_adaptation_backbone_corridor', 'flood_microgrid_island_cluster'],
      },
      {
        turn: 3,
        regionId: 'QLD',
        bushfireGridRelief: 3.1,
        droughtDesalRelief: 2.9,
        blueCarbonCoastalRelief: 2.7,
        biodiversityCoexistenceRelief: 2.9,
        climatePressure: 16,
        gridStressPoints: 14,
        communityMicrogridRelief: 3,
        completedProjectTypes: [
          'substation_flood_barrier_mesh',
          'heat_derating_orchestration_layer',
          'coastal_adaptation_backbone_corridor',
          'industrial_climate_hardening_loop',
          'flood_microgrid_island_cluster',
          'heat_stress_demand_orchestration_hub',
          'industrial_cooling_resilience_nexus',
          'compound_hazard_recovery_hub',
        ],
      },
    ],
    expect: { minAdaptationReliefOnLast: 2, minResilienceReliefOnLast: 1.8, lastAdaptationBand: 'adaptation_corridor' },
  },
] as const;

export function runAgent13ClimateFloodHeatTurnScenario(
  scenario: Agent13ClimateFloodHeatTurnScenario,
): { passed: boolean; detail: string; lastAdaptationRelief: number; lastResilienceRelief: number } {
  let adaptationMem: V1014ClimateAdaptationHardeningPersistedSlice | null = null;
  let resilienceMem: V1014FloodHeatResiliencePersistedSlice | null = null;
  let lastAdaptationRelief = 0;
  let lastResilienceRelief = 0;
  let lastBand: V1014ClimateAdaptationHardeningBand = 'exposed_legacy';

  for (const step of scenario.steps) {
    const adaptation = computeRegionalClimateAdaptationHardeningLedger({
      regionId: step.regionId,
      bushfireGridRelief: step.bushfireGridRelief,
      droughtDesalRelief: step.droughtDesalRelief,
      blueCarbonCoastalRelief: step.blueCarbonCoastalRelief,
      biodiversityCoexistenceRelief: step.biodiversityCoexistenceRelief,
      climatePressure: step.climatePressure,
      completedProjectTypes: step.completedProjectTypes,
      prev: adaptationMem,
    });
    adaptationMem = adaptation.next;
    lastAdaptationRelief = adaptation.ledger.climateAdaptationRelief;
    lastBand = adaptation.ledger.band;

    const resilience = advanceRegionalFloodHeatResilienceOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      adaptationBand: adaptation.ledger.band,
      communityMicrogridRelief: step.communityMicrogridRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: resilienceMem,
    });
    resilienceMem = resilience.next;
    lastResilienceRelief = resilience.ledger.floodHeatResilienceRelief;
  }

  if (scenario.expect.minAdaptationReliefOnLast != null && lastAdaptationRelief < scenario.expect.minAdaptationReliefOnLast) {
    return {
      passed: false,
      detail: `adaptation relief ${lastAdaptationRelief} < ${scenario.expect.minAdaptationReliefOnLast}`,
      lastAdaptationRelief,
      lastResilienceRelief,
    };
  }
  if (scenario.expect.minResilienceReliefOnLast != null && lastResilienceRelief < scenario.expect.minResilienceReliefOnLast) {
    return {
      passed: false,
      detail: `resilience relief ${lastResilienceRelief} < ${scenario.expect.minResilienceReliefOnLast}`,
      lastAdaptationRelief,
      lastResilienceRelief,
    };
  }
  if (scenario.expect.lastAdaptationBand != null) {
    const allowed: V1014ClimateAdaptationHardeningBand[] = [scenario.expect.lastAdaptationBand];
    if (scenario.expect.lastAdaptationBand === 'adaptation_corridor') allowed.push('climate_resilient_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastAdaptationRelief, lastResilienceRelief };
    }
  }

  return { passed: true, detail: 'ok', lastAdaptationRelief, lastResilienceRelief };
}

export function scoreAgent13ClimateFloodHeatGIAlignment(params: {
  actionText: string;
  adaptationBand?: string;
  resilienceBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'climate adaptation',
    'flood barrier',
    'heat stress',
    'compound hazard',
    'flood microgrid',
    'heat derating',
    'industrial cooling',
    'coastal adaptation',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.23, 0, 2);
  if (params.adaptationBand === 'climate_resilient_leader' || params.adaptationBand === 'adaptation_corridor') {
    delta += hits.some(h => h.includes('adaptation') || h.includes('flood') || h.includes('coastal')) ? 0.37 : 0.1;
  }
  if (params.resilienceBand === 'flood_heat_hub' || params.resilienceBand === 'industrial_resilience_mesh') {
    delta += hits.some(h => h.includes('heat') || h.includes('flood') || h.includes('compound')) ? 0.34 : 0.09;
  }
  if (params.resilienceBand === 'vulnerable_mesh' && hits.some(h => h.includes('flood'))) delta -= 0.1;
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Climate flood-heat GI: ${hits.slice(0, 2).join(', ')} aligns with adaptation hardening and resilience depth.`
        : null,
  };
}
