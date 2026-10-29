/**
 * Agent 13 scale wave round 19 — concentrated solar thermal & molten salt dispatch depth.
 * Cross-turn persistence for CSP build-out and thermal storage dispatch relief coupled to geothermal maturity and seasonal arbitrage.
 */

export type V1014CspMoltenSaltBand = 'no_csp' | 'pilot_trough' | 'utility_scale_csp' | 'thermal_export_leader';

export type V1014ThermalStorageDispatchBand = 'direct_steam' | 'salt_charge' | 'overnight_dispatch' | 'deep_thermal_flex';

export interface V1014CspMoltenSaltInstrument {
  id: string;
  kind: 'parabolic_trough' | 'power_tower' | 'molten_salt_tank' | 'solar_industrial_heat';
  label: string;
  thermalMwEq: number;
  cspReliefFactor: number;
  dispatchSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_CSP_MOLTEN_SALT_CATALOG: readonly V1014CspMoltenSaltInstrument[] = [
  {
    id: 'csp_trough',
    kind: 'parabolic_trough',
    label: 'Parabolic trough CSP corridor',
    thermalMwEq: 42,
    cspReliefFactor: 0.15,
    dispatchSynergyFactor: 0.1,
    projectTypeHint: 'parabolic_trough_csp_corridor',
  },
  {
    id: 'csp_tower',
    kind: 'power_tower',
    label: 'Central receiver power tower',
    thermalMwEq: 46,
    cspReliefFactor: 0.16,
    dispatchSynergyFactor: 0.11,
    projectTypeHint: 'central_receiver_power_tower',
  },
  {
    id: 'csp_salt',
    kind: 'molten_salt_tank',
    label: 'Molten salt thermal storage bank',
    thermalMwEq: 44,
    cspReliefFactor: 0.14,
    dispatchSynergyFactor: 0.12,
    projectTypeHint: 'molten_salt_thermal_storage_bank',
  },
  {
    id: 'csp_industrial',
    kind: 'solar_industrial_heat',
    label: 'Solar industrial process heat loop',
    thermalMwEq: 38,
    cspReliefFactor: 0.13,
    dispatchSynergyFactor: 0.09,
    projectTypeHint: 'solar_industrial_process_heat',
  },
] as const;

export interface V1014ThermalStorageDispatchTemplate {
  id: string;
  kind: 'evening_peaking' | 'overnight_salt_dispatch' | 'industrial_heat_shift' | 'renewable_firming_loop';
  label: string;
  dispatchMwEq: number;
  gridReliefFactor: number;
  cspSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_THERMAL_STORAGE_DISPATCH_CATALOG: readonly V1014ThermalStorageDispatchTemplate[] = [
  {
    id: 'td_evening',
    kind: 'evening_peaking',
    label: 'Evening peak thermal dispatch',
    dispatchMwEq: 40,
    gridReliefFactor: 0.14,
    cspSynergyFactor: 0.1,
    projectTypeHint: 'evening_peak_thermal_dispatch',
  },
  {
    id: 'td_overnight',
    kind: 'overnight_salt_dispatch',
    label: 'Overnight molten salt discharge',
    dispatchMwEq: 48,
    gridReliefFactor: 0.16,
    cspSynergyFactor: 0.12,
    projectTypeHint: 'overnight_molten_salt_discharge',
  },
  {
    id: 'td_industrial',
    kind: 'industrial_heat_shift',
    label: 'Industrial heat shift orchestration',
    dispatchMwEq: 36,
    gridReliefFactor: 0.13,
    cspSynergyFactor: 0.11,
    projectTypeHint: 'industrial_heat_shift_orchestration',
  },
  {
    id: 'td_firming',
    kind: 'renewable_firming_loop',
    label: 'Renewable firming thermal loop',
    dispatchMwEq: 44,
    gridReliefFactor: 0.15,
    cspSynergyFactor: 0.13,
    projectTypeHint: 'renewable_firming_thermal_loop',
  },
] as const;

export interface V1014RegionalCspMoltenSaltLedger {
  regionId: string;
  band: V1014CspMoltenSaltBand;
  cspIndex: number;
  saltStorageBalance: number;
  cspThermalRelief: number;
  summary: string;
}

export interface V1014RegionalThermalStorageDispatchLedger {
  regionId: string;
  band: V1014ThermalStorageDispatchBand;
  dispatchIndex: number;
  thermalStorageDispatchRelief: number;
  summary: string;
}

export interface V1014CspPersistedSlice {
  saltStorageBalance: number;
  cspIndex: number;
}

export interface V1014ThermalDispatchPersistedSlice {
  dispatchIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const CSP_REGIONS = new Set(['SA', 'QLD', 'NSW', 'WA', 'NT']);

export function computeRegionalCspMoltenSaltLedger(params: {
  regionId: string;
  geothermalHeatRelief: number;
  seasonalArbitrageRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014CspPersistedSlice | null;
}): { ledger: V1014RegionalCspMoltenSaltLedger; next: V1014CspPersistedSlice } {
  let thermalGain = 0;
  let cspProxy = 0;
  let dispatchSynergy = 0;
  for (const inst of V1014_CSP_MOLTEN_SALT_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      thermalGain += inst.thermalMwEq;
      cspProxy += inst.cspReliefFactor;
      dispatchSynergy += inst.dispatchSynergyFactor;
    }
  }
  if (CSP_REGIONS.has(params.regionId)) cspProxy += 0.06;
  else cspProxy *= 0.73;
  if (params.geothermalHeatRelief > 2.4) {
    thermalGain += clamp(params.geothermalHeatRelief * 1.05, 0, 11);
    cspProxy += 0.06;
  }
  if (params.seasonalArbitrageRelief > 2.6) dispatchSynergy += clamp(params.seasonalArbitrageRelief * 0.02, 0, 0.09);
  cspProxy += clamp(params.renewableShareScore / 112, 0, 0.1);

  const prevIdx = params.prev?.cspIndex ?? 0;
  const prevBal = params.prev?.saltStorageBalance ?? 0;
  const saltStorageBalance = clamp(prevBal * 0.87 + thermalGain * 0.1, 0, 215);
  const cspIndex = clamp(prevIdx * 0.84 + saltStorageBalance * 0.1 + cspProxy * 80 + dispatchSynergy * 25, 0, 150);

  let band: V1014CspMoltenSaltBand = 'no_csp';
  if (cspIndex >= 95 || thermalGain >= 116) band = 'thermal_export_leader';
  else if (cspIndex >= 57 || thermalGain >= 62) band = 'utility_scale_csp';
  else if (cspIndex >= 23 || thermalGain >= 21) band = 'pilot_trough';

  let cspThermalRelief = clamp(cspProxy * 8.6 + thermalGain * 0.043 + dispatchSynergy * 5.1, 0, 10.8);
  if (band === 'no_csp') cspThermalRelief *= 0.35;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      cspIndex: clamp(cspIndex, 0, 150),
      saltStorageBalance: clamp(saltStorageBalance, 0, 215),
      cspThermalRelief: clamp(cspThermalRelief, 0, 10.8),
      summary: `${params.regionId} CSP ${band} · idx ${cspIndex.toFixed(0)} · relief ${cspThermalRelief.toFixed(1)}`,
    },
    next: { saltStorageBalance: clamp(saltStorageBalance, 0, 215), cspIndex: clamp(cspIndex, 0, 150) },
  };
}

export function advanceRegionalThermalStorageDispatch(params: {
  regionId: string;
  gridStressPoints: number;
  cspBand: V1014CspMoltenSaltBand;
  vppOrchestrationRelief: number;
  completedProjectTypes: string[];
  prev?: V1014ThermalDispatchPersistedSlice | null;
}): { ledger: V1014RegionalThermalStorageDispatchLedger; next: V1014ThermalDispatchPersistedSlice } {
  let dispatchGain = 0;
  let reliefProxy = 0;
  let cspSynergy = 0;
  for (const tpl of V1014_THERMAL_STORAGE_DISPATCH_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      dispatchGain += tpl.dispatchMwEq;
      reliefProxy += tpl.gridReliefFactor;
      cspSynergy += tpl.cspSynergyFactor;
    }
  }
  if (params.cspBand === 'utility_scale_csp' || params.cspBand === 'thermal_export_leader') {
    dispatchGain += 12;
    cspSynergy += 0.08;
  }
  if (params.vppOrchestrationRelief > 2.5) {
    dispatchGain += params.vppOrchestrationRelief * 0.85;
    reliefProxy += clamp(params.vppOrchestrationRelief * 0.01, 0, 0.06);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.29, 0, 10);
  const prevIdx = params.prev?.dispatchIndex ?? 0;
  const dispatchIndex = clamp(prevIdx * 0.85 + dispatchGain * 0.1 + reliefProxy * 33 - stressLoad * 0.033 + cspSynergy * 25, 0, 153);

  let band: V1014ThermalStorageDispatchBand = 'direct_steam';
  if (dispatchIndex >= 99 || dispatchGain >= 116) band = 'deep_thermal_flex';
  else if (dispatchIndex >= 61 || dispatchGain >= 68) band = 'overnight_dispatch';
  else if (dispatchIndex >= 27 || dispatchGain >= 23) band = 'salt_charge';

  let thermalStorageDispatchRelief = clamp(dispatchIndex / 21 + reliefProxy * 6.6 + cspSynergy * 7, 0, 10);
  if (band === 'direct_steam') thermalStorageDispatchRelief = clamp(thermalStorageDispatchRelief * 0.33, 0, 3.1);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      dispatchIndex: clamp(dispatchIndex, 0, 153),
      thermalStorageDispatchRelief: clamp(thermalStorageDispatchRelief, 0, 10),
      summary: `${params.regionId} thermal dispatch ${band} · idx ${dispatchIndex.toFixed(0)} · relief ${thermalStorageDispatchRelief.toFixed(1)}`,
    },
    next: { dispatchIndex: clamp(dispatchIndex, 0, 153) },
  };
}

export const V1014_CSP_THERMAL_SCENARIOS = [
  {
    id: 'sc_csp_sa',
    label: 'SA power tower with overnight salt discharge',
    regionId: 'SA',
    geothermalHeatRelief: 3.2,
    seasonalArbitrageRelief: 2.9,
    renewableShareScore: 58,
    gridStressPoints: 15,
    vppOrchestrationRelief: 2.8,
    completedProjectTypes: [
      'central_receiver_power_tower',
      'molten_salt_thermal_storage_bank',
      'overnight_molten_salt_discharge',
      'renewable_firming_thermal_loop',
    ],
    expectCspBand: 'utility_scale_csp' as V1014CspMoltenSaltBand,
    expectMinCspRelief: 2.5,
    expectDispatchBand: 'overnight_dispatch' as V1014ThermalStorageDispatchBand,
    expectMinDispatchRelief: 2,
  },
  {
    id: 'sc_csp_nt',
    label: 'NT trough CSP with evening peak dispatch',
    regionId: 'NT',
    geothermalHeatRelief: 2.6,
    seasonalArbitrageRelief: 2.3,
    renewableShareScore: 46,
    gridStressPoints: 13,
    vppOrchestrationRelief: 2.2,
    cspBand: 'pilot_trough' as V1014CspMoltenSaltBand,
    completedProjectTypes: ['parabolic_trough_csp_corridor', 'evening_peak_thermal_dispatch', 'solar_industrial_process_heat'],
    expectDispatchBand: 'salt_charge' as V1014ThermalStorageDispatchBand,
    expectMinDispatchRelief: 1.7,
  },
] as const;

export function runAgent13CspThermalScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_CSP_MOLTEN_SALT_CATALOG.length >= 4);
  ok(V1014_THERMAL_STORAGE_DISPATCH_CATALOG.length >= 4);

  const sc0 = V1014_CSP_THERMAL_SCENARIOS[0];
  const csp = computeRegionalCspMoltenSaltLedger({
    regionId: sc0.regionId,
    geothermalHeatRelief: sc0.geothermalHeatRelief,
    seasonalArbitrageRelief: sc0.seasonalArbitrageRelief,
    renewableShareScore: sc0.renewableShareScore,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    csp.ledger.band === sc0.expectCspBand ||
      csp.ledger.band === 'thermal_export_leader' ||
      csp.ledger.cspThermalRelief >= sc0.expectMinCspRelief,
  );

  const dispatch = advanceRegionalThermalStorageDispatch({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    cspBand: csp.ledger.band,
    vppOrchestrationRelief: sc0.vppOrchestrationRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    dispatch.ledger.band === sc0.expectDispatchBand ||
      dispatch.ledger.band === 'deep_thermal_flex' ||
      dispatch.ledger.thermalStorageDispatchRelief >= sc0.expectMinDispatchRelief,
  );

  const sc1 = V1014_CSP_THERMAL_SCENARIOS[1];
  const dispatchN = advanceRegionalThermalStorageDispatch({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    cspBand: sc1.cspBand,
    vppOrchestrationRelief: sc1.vppOrchestrationRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(dispatchN.ledger.thermalStorageDispatchRelief >= sc1.expectMinDispatchRelief || dispatchN.ledger.band !== 'direct_steam');

  const persistA = computeRegionalCspMoltenSaltLedger({
    regionId: 'QLD',
    geothermalHeatRelief: 2.8,
    seasonalArbitrageRelief: 2.5,
    renewableShareScore: 42,
    completedProjectTypes: ['parabolic_trough_csp_corridor'],
    prev: null,
  });
  const persistB = computeRegionalCspMoltenSaltLedger({
    regionId: 'QLD',
    geothermalHeatRelief: 2.8,
    seasonalArbitrageRelief: 2.5,
    renewableShareScore: 42,
    completedProjectTypes: ['parabolic_trough_csp_corridor'],
    prev: persistA.next,
  });
  ok(persistB.next.cspIndex >= persistA.next.cspIndex * 0.77);

  const turnSc = runAgent13CspThermalTurnScenario(V1014_CSP_THERMAL_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastCspRelief >= 2.5);

  const gi = scoreAgent13CspThermalGIAlignment({
    actionText: 'Central receiver power tower with overnight molten salt discharge and renewable firming',
    cspBand: 'utility_scale_csp',
    dispatchBand: 'overnight_dispatch',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13CspThermalTurnStep {
  turn: number;
  regionId: string;
  geothermalHeatRelief: number;
  seasonalArbitrageRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  vppOrchestrationRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13CspThermalTurnScenario {
  id: string;
  label: string;
  steps: Agent13CspThermalTurnStep[];
  expect: {
    minCspReliefOnLast?: number;
    minDispatchReliefOnLast?: number;
    lastCspBand?: V1014CspMoltenSaltBand;
  };
}

export const V1014_CSP_THERMAL_TURN_SCENARIOS: readonly Agent13CspThermalTurnScenario[] = [
  {
    id: 'sc_csp_sa_escalation',
    label: 'SA CSP build-out with deep thermal flex',
    steps: [
      {
        turn: 1,
        regionId: 'SA',
        geothermalHeatRelief: 2.5,
        seasonalArbitrageRelief: 2.2,
        renewableShareScore: 44,
        gridStressPoints: 16,
        vppOrchestrationRelief: 2.3,
        completedProjectTypes: ['parabolic_trough_csp_corridor', 'molten_salt_thermal_storage_bank'],
      },
      {
        turn: 2,
        regionId: 'SA',
        geothermalHeatRelief: 2.9,
        seasonalArbitrageRelief: 2.6,
        renewableShareScore: 50,
        gridStressPoints: 14,
        vppOrchestrationRelief: 2.7,
        completedProjectTypes: ['central_receiver_power_tower', 'evening_peak_thermal_dispatch', 'overnight_molten_salt_discharge'],
      },
      {
        turn: 3,
        regionId: 'SA',
        geothermalHeatRelief: 3.4,
        seasonalArbitrageRelief: 3,
        renewableShareScore: 56,
        gridStressPoints: 12,
        vppOrchestrationRelief: 3.1,
        completedProjectTypes: [
          'parabolic_trough_csp_corridor',
          'central_receiver_power_tower',
          'molten_salt_thermal_storage_bank',
          'solar_industrial_process_heat',
          'evening_peak_thermal_dispatch',
          'overnight_molten_salt_discharge',
          'industrial_heat_shift_orchestration',
          'renewable_firming_thermal_loop',
        ],
      },
    ],
    expect: { minCspReliefOnLast: 2.5, minDispatchReliefOnLast: 2, lastCspBand: 'utility_scale_csp' },
  },
] as const;

export function runAgent13CspThermalTurnScenario(
  scenario: Agent13CspThermalTurnScenario,
): { passed: boolean; detail: string; lastCspRelief: number; lastDispatchRelief: number } {
  let cspMem: V1014CspPersistedSlice | null = null;
  let dispatchMem: V1014ThermalDispatchPersistedSlice | null = null;
  let lastCspRelief = 0;
  let lastDispatchRelief = 0;
  let lastBand: V1014CspMoltenSaltBand = 'no_csp';

  for (const step of scenario.steps) {
    const csp = computeRegionalCspMoltenSaltLedger({
      regionId: step.regionId,
      geothermalHeatRelief: step.geothermalHeatRelief,
      seasonalArbitrageRelief: step.seasonalArbitrageRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: cspMem,
    });
    cspMem = csp.next;
    lastCspRelief = csp.ledger.cspThermalRelief;
    lastBand = csp.ledger.band;

    const dispatch = advanceRegionalThermalStorageDispatch({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      cspBand: csp.ledger.band,
      vppOrchestrationRelief: step.vppOrchestrationRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: dispatchMem,
    });
    dispatchMem = dispatch.next;
    lastDispatchRelief = dispatch.ledger.thermalStorageDispatchRelief;
  }

  if (scenario.expect.minCspReliefOnLast != null && lastCspRelief < scenario.expect.minCspReliefOnLast) {
    return {
      passed: false,
      detail: `csp relief ${lastCspRelief} < ${scenario.expect.minCspReliefOnLast}`,
      lastCspRelief,
      lastDispatchRelief,
    };
  }
  if (scenario.expect.minDispatchReliefOnLast != null && lastDispatchRelief < scenario.expect.minDispatchReliefOnLast) {
    return {
      passed: false,
      detail: `dispatch relief ${lastDispatchRelief} < ${scenario.expect.minDispatchReliefOnLast}`,
      lastCspRelief,
      lastDispatchRelief,
    };
  }
  if (scenario.expect.lastCspBand != null) {
    const allowed: V1014CspMoltenSaltBand[] = [scenario.expect.lastCspBand];
    if (scenario.expect.lastCspBand === 'utility_scale_csp') allowed.push('thermal_export_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastCspRelief, lastDispatchRelief };
    }
  }

  return { passed: true, detail: 'ok', lastCspRelief, lastDispatchRelief };
}

export function scoreAgent13CspThermalGIAlignment(params: {
  actionText: string;
  cspBand?: string;
  dispatchBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'concentrated solar',
    'csp',
    'molten salt',
    'power tower',
    'parabolic trough',
    'thermal storage',
    'overnight dispatch',
    'solar thermal',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.3, 0, 2);
  if (params.cspBand === 'thermal_export_leader' || params.cspBand === 'utility_scale_csp') {
    delta += hits.some(h => h.includes('csp') || h.includes('tower') || h.includes('trough')) ? 0.44 : 0.12;
  }
  if (params.dispatchBand === 'overnight_dispatch' || params.dispatchBand === 'deep_thermal_flex') {
    delta += hits.some(h => h.includes('molten') || h.includes('thermal') || h.includes('overnight')) ? 0.38 : 0.1;
  }
  if (params.dispatchBand === 'direct_steam' && hits.some(h => h.includes('molten'))) delta -= 0.12;
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `CSP thermal GI: ${hits.slice(0, 2).join(', ')} aligns with molten salt dispatch depth.`
        : null,
  };
}
