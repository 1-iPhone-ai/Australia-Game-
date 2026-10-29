/**
 * Agent 13 scale wave round 20 — grid-forming inverter & synthetic inertia orchestration depth.
 * Cross-turn persistence for inverter-led system strength and synthetic inertia relief coupled to firming, REZ spill, and thermal dispatch maturity.
 */

export type V1014GridFormingInverterBand = 'conventional_sync' | 'hybrid_forming' | 'grid_forming_leader' | 'synthetic_inertia_mesh';

export type V1014SyntheticInertiaBand = 'minimal_inertia' | 'battery_inertia' | 'synthetic_orchestrated' | 'system_strength_leader';

export interface V1014GridFormingInverterInstrument {
  id: string;
  kind: 'battery_grid_forming' | 'solar_grid_forming' | 'wind_grid_forming' | 'hybrid_inverter_hub';
  label: string;
  formingMwEq: number;
  strengthReliefFactor: number;
  inertiaSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_GRID_FORMING_INVERTER_CATALOG: readonly V1014GridFormingInverterInstrument[] = [
  {
    id: 'gf_battery',
    kind: 'battery_grid_forming',
    label: 'Battery grid-forming inverter fleet',
    formingMwEq: 44,
    strengthReliefFactor: 0.16,
    inertiaSynergyFactor: 0.11,
    projectTypeHint: 'battery_grid_forming_inverter_fleet',
  },
  {
    id: 'gf_solar',
    kind: 'solar_grid_forming',
    label: 'Solar grid-forming inverter corridor',
    formingMwEq: 40,
    strengthReliefFactor: 0.14,
    inertiaSynergyFactor: 0.1,
    projectTypeHint: 'solar_grid_forming_inverter_corridor',
  },
  {
    id: 'gf_wind',
    kind: 'wind_grid_forming',
    label: 'Wind grid-forming converter train',
    formingMwEq: 46,
    strengthReliefFactor: 0.15,
    inertiaSynergyFactor: 0.12,
    projectTypeHint: 'wind_grid_forming_converter_train',
  },
  {
    id: 'gf_hybrid',
    kind: 'hybrid_inverter_hub',
    label: 'Hybrid inverter strength hub',
    formingMwEq: 42,
    strengthReliefFactor: 0.13,
    inertiaSynergyFactor: 0.09,
    projectTypeHint: 'hybrid_inverter_strength_hub',
  },
] as const;

export interface V1014SyntheticInertiaTemplate {
  id: string;
  kind: 'fast_frequency' | 'virtual_inertia' | 'inertia_market' | 'weak_grid_stabilizer';
  label: string;
  inertiaMwEq: number;
  gridReliefFactor: number;
  formingSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_SYNTHETIC_INERTIA_CATALOG: readonly V1014SyntheticInertiaTemplate[] = [
  {
    id: 'si_fast_freq',
    kind: 'fast_frequency',
    label: 'Fast frequency response inertia layer',
    inertiaMwEq: 38,
    gridReliefFactor: 0.14,
    formingSynergyFactor: 0.1,
    projectTypeHint: 'fast_frequency_response_inertia',
  },
  {
    id: 'si_virtual',
    kind: 'virtual_inertia',
    label: 'Virtual inertia orchestration loop',
    inertiaMwEq: 46,
    gridReliefFactor: 0.16,
    formingSynergyFactor: 0.12,
    projectTypeHint: 'virtual_inertia_orchestration_loop',
  },
  {
    id: 'si_market',
    kind: 'inertia_market',
    label: 'Synthetic inertia market participation',
    inertiaMwEq: 42,
    gridReliefFactor: 0.15,
    formingSynergyFactor: 0.11,
    projectTypeHint: 'synthetic_inertia_market_participation',
  },
  {
    id: 'si_weak_grid',
    kind: 'weak_grid_stabilizer',
    label: 'Weak-grid stabilizer deployment',
    inertiaMwEq: 48,
    gridReliefFactor: 0.17,
    formingSynergyFactor: 0.13,
    projectTypeHint: 'weak_grid_stabilizer_deployment',
  },
] as const;

export interface V1014RegionalGridFormingInverterLedger {
  regionId: string;
  band: V1014GridFormingInverterBand;
  formingIndex: number;
  strengthBalance: number;
  gridFormingRelief: number;
  summary: string;
}

export interface V1014RegionalSyntheticInertiaLedger {
  regionId: string;
  band: V1014SyntheticInertiaBand;
  inertiaIndex: number;
  syntheticInertiaRelief: number;
  summary: string;
}

export interface V1014GridFormingPersistedSlice {
  strengthBalance: number;
  formingIndex: number;
}

export interface V1014SyntheticInertiaPersistedSlice {
  inertiaIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const GRID_FORMING_REGIONS = new Set(['SA', 'NSW', 'VIC', 'QLD', 'TAS', 'WA']);

export function computeRegionalGridFormingInverterLedger(params: {
  regionId: string;
  gridFirmingRelief: number;
  rezSpillRelief: number;
  thermalStorageDispatchRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014GridFormingPersistedSlice | null;
}): { ledger: V1014RegionalGridFormingInverterLedger; next: V1014GridFormingPersistedSlice } {
  let formingGain = 0;
  let strengthProxy = 0;
  let inertiaSynergy = 0;
  for (const inst of V1014_GRID_FORMING_INVERTER_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      formingGain += inst.formingMwEq;
      strengthProxy += inst.strengthReliefFactor;
      inertiaSynergy += inst.inertiaSynergyFactor;
    }
  }
  if (GRID_FORMING_REGIONS.has(params.regionId)) strengthProxy += 0.05;
  else strengthProxy *= 0.75;
  if (params.gridFirmingRelief > 2.6) {
    formingGain += clamp(params.gridFirmingRelief * 1.02, 0, 12);
    strengthProxy += 0.06;
  }
  if (params.rezSpillRelief > 2.8) inertiaSynergy += clamp(params.rezSpillRelief * 0.018, 0, 0.09);
  if (params.thermalStorageDispatchRelief > 2.2) strengthProxy += clamp(params.thermalStorageDispatchRelief * 0.016, 0, 0.07);
  strengthProxy += clamp(params.renewableShareScore / 116, 0, 0.09);

  const prevIdx = params.prev?.formingIndex ?? 0;
  const prevBal = params.prev?.strengthBalance ?? 0;
  const strengthBalance = clamp(prevBal * 0.88 + formingGain * 0.1, 0, 218);
  const formingIndex = clamp(prevIdx * 0.85 + strengthBalance * 0.1 + strengthProxy * 81 + inertiaSynergy * 24, 0, 151);

  let band: V1014GridFormingInverterBand = 'conventional_sync';
  if (formingIndex >= 96 || formingGain >= 114) band = 'synthetic_inertia_mesh';
  else if (formingIndex >= 58 || formingGain >= 64) band = 'grid_forming_leader';
  else if (formingIndex >= 24 || formingGain >= 22) band = 'hybrid_forming';

  let gridFormingRelief = clamp(strengthProxy * 8.4 + formingGain * 0.042 + inertiaSynergy * 5, 0, 10.6);
  if (band === 'conventional_sync') gridFormingRelief *= 0.34;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      formingIndex: clamp(formingIndex, 0, 151),
      strengthBalance: clamp(strengthBalance, 0, 218),
      gridFormingRelief: clamp(gridFormingRelief, 0, 10.6),
      summary: `${params.regionId} grid-forming ${band} · idx ${formingIndex.toFixed(0)} · relief ${gridFormingRelief.toFixed(1)}`,
    },
    next: { strengthBalance: clamp(strengthBalance, 0, 218), formingIndex: clamp(formingIndex, 0, 151) },
  };
}

export function advanceRegionalSyntheticInertiaOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  gridFormingBand: V1014GridFormingInverterBand;
  offshoreRenewableRelief: number;
  completedProjectTypes: string[];
  prev?: V1014SyntheticInertiaPersistedSlice | null;
}): { ledger: V1014RegionalSyntheticInertiaLedger; next: V1014SyntheticInertiaPersistedSlice } {
  let inertiaGain = 0;
  let reliefProxy = 0;
  let formingSynergy = 0;
  for (const tpl of V1014_SYNTHETIC_INERTIA_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      inertiaGain += tpl.inertiaMwEq;
      reliefProxy += tpl.gridReliefFactor;
      formingSynergy += tpl.formingSynergyFactor;
    }
  }
  if (params.gridFormingBand === 'grid_forming_leader' || params.gridFormingBand === 'synthetic_inertia_mesh') {
    inertiaGain += 13;
    formingSynergy += 0.08;
  }
  if (params.offshoreRenewableRelief > 2.7) {
    inertiaGain += params.offshoreRenewableRelief * 0.82;
    reliefProxy += clamp(params.offshoreRenewableRelief * 0.01, 0, 0.06);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.3, 0, 11);
  const prevIdx = params.prev?.inertiaIndex ?? 0;
  const inertiaIndex = clamp(prevIdx * 0.86 + inertiaGain * 0.1 + reliefProxy * 32 - stressLoad * 0.034 + formingSynergy * 26, 0, 154);

  let band: V1014SyntheticInertiaBand = 'minimal_inertia';
  if (inertiaIndex >= 100 || inertiaGain >= 118) band = 'system_strength_leader';
  else if (inertiaIndex >= 62 || inertiaGain >= 70) band = 'synthetic_orchestrated';
  else if (inertiaIndex >= 28 || inertiaGain >= 24) band = 'battery_inertia';

  let syntheticInertiaRelief = clamp(inertiaIndex / 22 + reliefProxy * 6.5 + formingSynergy * 7.1, 0, 10.1);
  if (band === 'minimal_inertia') syntheticInertiaRelief = clamp(syntheticInertiaRelief * 0.32, 0, 3);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      inertiaIndex: clamp(inertiaIndex, 0, 154),
      syntheticInertiaRelief: clamp(syntheticInertiaRelief, 0, 10.1),
      summary: `${params.regionId} synthetic inertia ${band} · idx ${inertiaIndex.toFixed(0)} · relief ${syntheticInertiaRelief.toFixed(1)}`,
    },
    next: { inertiaIndex: clamp(inertiaIndex, 0, 154) },
  };
}

export const V1014_GRID_INERTIA_SCENARIOS = [
  {
    id: 'sc_gf_sa',
    label: 'SA battery grid-forming with virtual inertia loop',
    regionId: 'SA',
    gridFirmingRelief: 3.3,
    rezSpillRelief: 3.1,
    thermalStorageDispatchRelief: 2.8,
    renewableShareScore: 56,
    gridStressPoints: 16,
    offshoreRenewableRelief: 2.9,
    completedProjectTypes: [
      'battery_grid_forming_inverter_fleet',
      'wind_grid_forming_converter_train',
      'virtual_inertia_orchestration_loop',
      'weak_grid_stabilizer_deployment',
    ],
    expectFormingBand: 'grid_forming_leader' as V1014GridFormingInverterBand,
    expectMinFormingRelief: 2.4,
    expectInertiaBand: 'synthetic_orchestrated' as V1014SyntheticInertiaBand,
    expectMinInertiaRelief: 2,
  },
  {
    id: 'sc_gf_tas',
    label: 'TAS hybrid forming with fast frequency response',
    regionId: 'TAS',
    gridFirmingRelief: 2.7,
    rezSpillRelief: 2.5,
    thermalStorageDispatchRelief: 2.3,
    renewableShareScore: 50,
    gridStressPoints: 14,
    offshoreRenewableRelief: 2.4,
    gridFormingBand: 'hybrid_forming' as V1014GridFormingInverterBand,
    completedProjectTypes: ['hybrid_inverter_strength_hub', 'fast_frequency_response_inertia', 'solar_grid_forming_inverter_corridor'],
    expectInertiaBand: 'battery_inertia' as V1014SyntheticInertiaBand,
    expectMinInertiaRelief: 1.8,
  },
] as const;

export function runAgent13GridInertiaScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_GRID_FORMING_INVERTER_CATALOG.length >= 4);
  ok(V1014_SYNTHETIC_INERTIA_CATALOG.length >= 4);

  const sc0 = V1014_GRID_INERTIA_SCENARIOS[0];
  const forming = computeRegionalGridFormingInverterLedger({
    regionId: sc0.regionId,
    gridFirmingRelief: sc0.gridFirmingRelief,
    rezSpillRelief: sc0.rezSpillRelief,
    thermalStorageDispatchRelief: sc0.thermalStorageDispatchRelief,
    renewableShareScore: sc0.renewableShareScore,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    forming.ledger.band === sc0.expectFormingBand ||
      forming.ledger.band === 'synthetic_inertia_mesh' ||
      forming.ledger.gridFormingRelief >= sc0.expectMinFormingRelief,
  );

  const inertia = advanceRegionalSyntheticInertiaOrchestration({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    gridFormingBand: forming.ledger.band,
    offshoreRenewableRelief: sc0.offshoreRenewableRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    inertia.ledger.band === sc0.expectInertiaBand ||
      inertia.ledger.band === 'system_strength_leader' ||
      inertia.ledger.syntheticInertiaRelief >= sc0.expectMinInertiaRelief,
  );

  const sc1 = V1014_GRID_INERTIA_SCENARIOS[1];
  const inertiaT = advanceRegionalSyntheticInertiaOrchestration({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    gridFormingBand: sc1.gridFormingBand,
    offshoreRenewableRelief: sc1.offshoreRenewableRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(inertiaT.ledger.syntheticInertiaRelief >= sc1.expectMinInertiaRelief || inertiaT.ledger.band !== 'minimal_inertia');

  const persistA = computeRegionalGridFormingInverterLedger({
    regionId: 'VIC',
    gridFirmingRelief: 2.8,
    rezSpillRelief: 2.6,
    thermalStorageDispatchRelief: 2.4,
    renewableShareScore: 44,
    completedProjectTypes: ['battery_grid_forming_inverter_fleet'],
    prev: null,
  });
  const persistB = computeRegionalGridFormingInverterLedger({
    regionId: 'VIC',
    gridFirmingRelief: 2.8,
    rezSpillRelief: 2.6,
    thermalStorageDispatchRelief: 2.4,
    renewableShareScore: 44,
    completedProjectTypes: ['battery_grid_forming_inverter_fleet'],
    prev: persistA.next,
  });
  ok(persistB.next.formingIndex >= persistA.next.formingIndex * 0.76);

  const turnSc = runAgent13GridInertiaTurnScenario(V1014_GRID_INERTIA_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastFormingRelief >= 2.4);

  const gi = scoreAgent13GridInertiaGIAlignment({
    actionText: 'Battery grid forming inverter with virtual inertia orchestration and weak grid stabilizer',
    formingBand: 'grid_forming_leader',
    inertiaBand: 'synthetic_orchestrated',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13GridInertiaTurnStep {
  turn: number;
  regionId: string;
  gridFirmingRelief: number;
  rezSpillRelief: number;
  thermalStorageDispatchRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  offshoreRenewableRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13GridInertiaTurnScenario {
  id: string;
  label: string;
  steps: Agent13GridInertiaTurnStep[];
  expect: {
    minFormingReliefOnLast?: number;
    minInertiaReliefOnLast?: number;
    lastFormingBand?: V1014GridFormingInverterBand;
  };
}

export const V1014_GRID_INERTIA_TURN_SCENARIOS: readonly Agent13GridInertiaTurnScenario[] = [
  {
    id: 'sc_gf_sa_escalation',
    label: 'SA grid-forming build-out with system strength leader',
    steps: [
      {
        turn: 1,
        regionId: 'SA',
        gridFirmingRelief: 2.5,
        rezSpillRelief: 2.4,
        thermalStorageDispatchRelief: 2.2,
        renewableShareScore: 46,
        gridStressPoints: 17,
        offshoreRenewableRelief: 2.3,
        completedProjectTypes: ['battery_grid_forming_inverter_fleet', 'solar_grid_forming_inverter_corridor'],
      },
      {
        turn: 2,
        regionId: 'SA',
        gridFirmingRelief: 2.9,
        rezSpillRelief: 2.8,
        thermalStorageDispatchRelief: 2.6,
        renewableShareScore: 50,
        gridStressPoints: 15,
        offshoreRenewableRelief: 2.7,
        completedProjectTypes: ['wind_grid_forming_converter_train', 'virtual_inertia_orchestration_loop'],
      },
      {
        turn: 3,
        regionId: 'SA',
        gridFirmingRelief: 3.4,
        rezSpillRelief: 3.2,
        thermalStorageDispatchRelief: 3,
        renewableShareScore: 56,
        gridStressPoints: 13,
        offshoreRenewableRelief: 3.1,
        completedProjectTypes: [
          'battery_grid_forming_inverter_fleet',
          'solar_grid_forming_inverter_corridor',
          'wind_grid_forming_converter_train',
          'hybrid_inverter_strength_hub',
          'fast_frequency_response_inertia',
          'virtual_inertia_orchestration_loop',
          'synthetic_inertia_market_participation',
          'weak_grid_stabilizer_deployment',
        ],
      },
    ],
    expect: { minFormingReliefOnLast: 2.4, minInertiaReliefOnLast: 2, lastFormingBand: 'grid_forming_leader' },
  },
] as const;

export function runAgent13GridInertiaTurnScenario(
  scenario: Agent13GridInertiaTurnScenario,
): { passed: boolean; detail: string; lastFormingRelief: number; lastInertiaRelief: number } {
  let formingMem: V1014GridFormingPersistedSlice | null = null;
  let inertiaMem: V1014SyntheticInertiaPersistedSlice | null = null;
  let lastFormingRelief = 0;
  let lastInertiaRelief = 0;
  let lastBand: V1014GridFormingInverterBand = 'conventional_sync';

  for (const step of scenario.steps) {
    const forming = computeRegionalGridFormingInverterLedger({
      regionId: step.regionId,
      gridFirmingRelief: step.gridFirmingRelief,
      rezSpillRelief: step.rezSpillRelief,
      thermalStorageDispatchRelief: step.thermalStorageDispatchRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: formingMem,
    });
    formingMem = forming.next;
    lastFormingRelief = forming.ledger.gridFormingRelief;
    lastBand = forming.ledger.band;

    const inertia = advanceRegionalSyntheticInertiaOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      gridFormingBand: forming.ledger.band,
      offshoreRenewableRelief: step.offshoreRenewableRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: inertiaMem,
    });
    inertiaMem = inertia.next;
    lastInertiaRelief = inertia.ledger.syntheticInertiaRelief;
  }

  if (scenario.expect.minFormingReliefOnLast != null && lastFormingRelief < scenario.expect.minFormingReliefOnLast) {
    return {
      passed: false,
      detail: `forming relief ${lastFormingRelief} < ${scenario.expect.minFormingReliefOnLast}`,
      lastFormingRelief,
      lastInertiaRelief,
    };
  }
  if (scenario.expect.minInertiaReliefOnLast != null && lastInertiaRelief < scenario.expect.minInertiaReliefOnLast) {
    return {
      passed: false,
      detail: `inertia relief ${lastInertiaRelief} < ${scenario.expect.minInertiaReliefOnLast}`,
      lastFormingRelief,
      lastInertiaRelief,
    };
  }
  if (scenario.expect.lastFormingBand != null) {
    const allowed: V1014GridFormingInverterBand[] = [scenario.expect.lastFormingBand];
    if (scenario.expect.lastFormingBand === 'grid_forming_leader') allowed.push('synthetic_inertia_mesh');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastFormingRelief, lastInertiaRelief };
    }
  }

  return { passed: true, detail: 'ok', lastFormingRelief, lastInertiaRelief };
}

export function scoreAgent13GridInertiaGIAlignment(params: {
  actionText: string;
  formingBand?: string;
  inertiaBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'grid forming',
    'grid-forming',
    'synthetic inertia',
    'virtual inertia',
    'system strength',
    'weak grid',
    'frequency response',
    'inverter',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.29, 0, 2);
  if (params.formingBand === 'synthetic_inertia_mesh' || params.formingBand === 'grid_forming_leader') {
    delta += hits.some(h => h.includes('grid') || h.includes('inverter')) ? 0.43 : 0.12;
  }
  if (params.inertiaBand === 'synthetic_orchestrated' || params.inertiaBand === 'system_strength_leader') {
    delta += hits.some(h => h.includes('inertia') || h.includes('frequency')) ? 0.39 : 0.1;
  }
  if (params.inertiaBand === 'minimal_inertia' && hits.some(h => h.includes('inertia'))) delta -= 0.13;
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Grid inertia GI: ${hits.slice(0, 2).join(', ')} aligns with grid-forming and synthetic inertia depth.`
        : null,
  };
}
