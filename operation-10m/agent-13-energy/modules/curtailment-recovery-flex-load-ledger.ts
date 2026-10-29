/**
 * Agent 13 scale wave round 22 — renewable curtailment recovery & flexible industrial load orchestration depth.
 * Cross-turn persistence for spill recovery corridors and dispatchable load relief coupled to demand flex, seasonal arbitrage, and second-life storage maturity.
 */

export type V1014CurtailmentRecoveryBand = 'unmanaged_spill' | 'pilot_recovery' | 'orchestrated_recovery' | 'zero_spill_leader';

export type V1014FlexibleLoadOrchestrationBand = 'fixed_load' | 'shiftable_load' | 'industrial_flex_hub' | 'deep_load_orchestration';

export interface V1014CurtailmentRecoveryInstrument {
  id: string;
  kind: 'rez_spill_soak' | 'export_corridor_shift' | 'storage_soak' | 'curtailment_market';
  label: string;
  recoveryMwEq: number;
  spillReliefFactor: number;
  flexSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_CURTAILMENT_RECOVERY_CATALOG: readonly V1014CurtailmentRecoveryInstrument[] = [
  {
    id: 'cr_soak',
    kind: 'rez_spill_soak',
    label: 'REZ spill soak recovery loop',
    recoveryMwEq: 42,
    spillReliefFactor: 0.15,
    flexSynergyFactor: 0.1,
    projectTypeHint: 'rez_spill_soak_recovery_loop',
  },
  {
    id: 'cr_export',
    kind: 'export_corridor_shift',
    label: 'Export corridor curtailment shift',
    recoveryMwEq: 46,
    spillReliefFactor: 0.16,
    flexSynergyFactor: 0.11,
    projectTypeHint: 'export_corridor_curtailment_shift',
  },
  {
    id: 'cr_storage',
    kind: 'storage_soak',
    label: 'Storage soak curtailment recovery',
    recoveryMwEq: 40,
    spillReliefFactor: 0.14,
    flexSynergyFactor: 0.12,
    projectTypeHint: 'storage_soak_curtailment_recovery',
  },
  {
    id: 'cr_market',
    kind: 'curtailment_market',
    label: 'Curtailment recovery market layer',
    recoveryMwEq: 44,
    spillReliefFactor: 0.13,
    flexSynergyFactor: 0.09,
    projectTypeHint: 'curtailment_recovery_market_layer',
  },
] as const;

export interface V1014FlexibleLoadOrchestrationTemplate {
  id: string;
  kind: 'smelter_flex' | 'data_centre_shift' | 'cold_chain_dispatch' | 'industrial_demand_orchestration';
  label: string;
  flexMwEq: number;
  gridReliefFactor: number;
  recoverySynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_FLEXIBLE_LOAD_ORCHESTRATION_CATALOG: readonly V1014FlexibleLoadOrchestrationTemplate[] = [
  {
    id: 'fl_smelter',
    kind: 'smelter_flex',
    label: 'Smelter flexible load orchestration',
    flexMwEq: 48,
    gridReliefFactor: 0.16,
    recoverySynergyFactor: 0.11,
    projectTypeHint: 'smelter_flexible_load_orchestration',
  },
  {
    id: 'fl_dc',
    kind: 'data_centre_shift',
    label: 'Data centre workload shift program',
    flexMwEq: 38,
    gridReliefFactor: 0.14,
    recoverySynergyFactor: 0.1,
    projectTypeHint: 'data_centre_workload_shift',
  },
  {
    id: 'fl_cold',
    kind: 'cold_chain_dispatch',
    label: 'Cold-chain dispatchable load loop',
    flexMwEq: 36,
    gridReliefFactor: 0.13,
    recoverySynergyFactor: 0.12,
    projectTypeHint: 'cold_chain_dispatchable_load',
  },
  {
    id: 'fl_industrial',
    kind: 'industrial_demand_orchestration',
    label: 'Industrial demand orchestration hub',
    flexMwEq: 44,
    gridReliefFactor: 0.15,
    recoverySynergyFactor: 0.13,
    projectTypeHint: 'industrial_demand_orchestration_hub',
  },
] as const;

export interface V1014RegionalCurtailmentRecoveryLedger {
  regionId: string;
  band: V1014CurtailmentRecoveryBand;
  recoveryIndex: number;
  spillBalance: number;
  curtailmentRecoveryRelief: number;
  summary: string;
}

export interface V1014RegionalFlexibleLoadOrchestrationLedger {
  regionId: string;
  band: V1014FlexibleLoadOrchestrationBand;
  flexIndex: number;
  flexibleLoadRelief: number;
  summary: string;
}

export interface V1014CurtailmentPersistedSlice {
  spillBalance: number;
  recoveryIndex: number;
}

export interface V1014FlexLoadPersistedSlice {
  flexIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const RECOVERY_REGIONS = new Set(['QLD', 'NSW', 'SA', 'VIC', 'WA']);

export function computeRegionalCurtailmentRecoveryLedger(params: {
  regionId: string;
  seasonalArbitrageRelief: number;
  demandFlexRelief: number;
  secondLifeStorageRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014CurtailmentPersistedSlice | null;
}): { ledger: V1014RegionalCurtailmentRecoveryLedger; next: V1014CurtailmentPersistedSlice } {
  let recoveryGain = 0;
  let spillProxy = 0;
  let flexSynergy = 0;
  for (const inst of V1014_CURTAILMENT_RECOVERY_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      recoveryGain += inst.recoveryMwEq;
      spillProxy += inst.spillReliefFactor;
      flexSynergy += inst.flexSynergyFactor;
    }
  }
  if (RECOVERY_REGIONS.has(params.regionId)) spillProxy += 0.05;
  else spillProxy *= 0.73;
  if (params.seasonalArbitrageRelief > 2.5) {
    recoveryGain += clamp(params.seasonalArbitrageRelief * 1.06, 0, 12);
    spillProxy += 0.06;
  }
  if (params.demandFlexRelief > 2.4) flexSynergy += clamp(params.demandFlexRelief * 0.02, 0, 0.09);
  if (params.secondLifeStorageRelief > 2.2) spillProxy += clamp(params.secondLifeStorageRelief * 0.014, 0, 0.06);
  spillProxy += clamp(params.renewableShareScore / 113, 0, 0.09);

  const prevIdx = params.prev?.recoveryIndex ?? 0;
  const prevBal = params.prev?.spillBalance ?? 0;
  const spillBalance = clamp(prevBal * 0.86 + recoveryGain * 0.1, 0, 216);
  const recoveryIndex = clamp(prevIdx * 0.84 + spillBalance * 0.1 + spillProxy * 78 + flexSynergy * 24, 0, 151);

  let band: V1014CurtailmentRecoveryBand = 'unmanaged_spill';
  if (recoveryIndex >= 96 || recoveryGain >= 114) band = 'zero_spill_leader';
  else if (recoveryIndex >= 58 || recoveryGain >= 64) band = 'orchestrated_recovery';
  else if (recoveryIndex >= 24 || recoveryGain >= 22) band = 'pilot_recovery';

  let curtailmentRecoveryRelief = clamp(spillProxy * 8.1 + recoveryGain * 0.04 + flexSynergy * 4.8, 0, 10.2);
  if (band === 'unmanaged_spill') curtailmentRecoveryRelief *= 0.32;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      recoveryIndex: clamp(recoveryIndex, 0, 151),
      spillBalance: clamp(spillBalance, 0, 216),
      curtailmentRecoveryRelief: clamp(curtailmentRecoveryRelief, 0, 10.2),
      summary: `${params.regionId} curtailment ${band} · idx ${recoveryIndex.toFixed(0)} · relief ${curtailmentRecoveryRelief.toFixed(1)}`,
    },
    next: { spillBalance: clamp(spillBalance, 0, 216), recoveryIndex: clamp(recoveryIndex, 0, 151) },
  };
}

export function advanceRegionalFlexibleLoadOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  curtailmentBand: V1014CurtailmentRecoveryBand;
  rezSpillRelief: number;
  completedProjectTypes: string[];
  prev?: V1014FlexLoadPersistedSlice | null;
}): { ledger: V1014RegionalFlexibleLoadOrchestrationLedger; next: V1014FlexLoadPersistedSlice } {
  let flexGain = 0;
  let reliefProxy = 0;
  let recoverySynergy = 0;
  for (const tpl of V1014_FLEXIBLE_LOAD_ORCHESTRATION_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      flexGain += tpl.flexMwEq;
      reliefProxy += tpl.gridReliefFactor;
      recoverySynergy += tpl.recoverySynergyFactor;
    }
  }
  if (params.curtailmentBand === 'orchestrated_recovery' || params.curtailmentBand === 'zero_spill_leader') {
    flexGain += 13;
    recoverySynergy += 0.08;
  }
  if (params.rezSpillRelief > 2.8) {
    flexGain += params.rezSpillRelief * 0.86;
    reliefProxy += clamp(params.rezSpillRelief * 0.01, 0, 0.06);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.27, 0, 10);
  const prevIdx = params.prev?.flexIndex ?? 0;
  const flexIndex = clamp(prevIdx * 0.85 + flexGain * 0.1 + reliefProxy * 30 - stressLoad * 0.031 + recoverySynergy * 25, 0, 155);

  let band: V1014FlexibleLoadOrchestrationBand = 'fixed_load';
  if (flexIndex >= 101 || flexGain >= 118) band = 'deep_load_orchestration';
  else if (flexIndex >= 63 || flexGain >= 72) band = 'industrial_flex_hub';
  else if (flexIndex >= 27 || flexGain >= 24) band = 'shiftable_load';

  let flexibleLoadRelief = clamp(flexIndex / 22 + reliefProxy * 6.3 + recoverySynergy * 6.8, 0, 9.8);
  if (band === 'fixed_load') flexibleLoadRelief = clamp(flexibleLoadRelief * 0.3, 0, 2.8);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      flexIndex: clamp(flexIndex, 0, 155),
      flexibleLoadRelief: clamp(flexibleLoadRelief, 0, 9.8),
      summary: `${params.regionId} flex load ${band} · idx ${flexIndex.toFixed(0)} · relief ${flexibleLoadRelief.toFixed(1)}`,
    },
    next: { flexIndex: clamp(flexIndex, 0, 155) },
  };
}

export const V1014_CURTAILMENT_FLEX_SCENARIOS = [
  {
    id: 'sc_cf_qld',
    label: 'QLD REZ spill soak with smelter flex',
    regionId: 'QLD',
    seasonalArbitrageRelief: 3,
    demandFlexRelief: 2.9,
    secondLifeStorageRelief: 2.6,
    renewableShareScore: 55,
    gridStressPoints: 16,
    rezSpillRelief: 3.2,
    completedProjectTypes: [
      'rez_spill_soak_recovery_loop',
      'export_corridor_curtailment_shift',
      'smelter_flexible_load_orchestration',
      'industrial_demand_orchestration_hub',
    ],
    expectRecoveryBand: 'orchestrated_recovery' as V1014CurtailmentRecoveryBand,
    expectMinRecoveryRelief: 2.2,
    expectFlexBand: 'industrial_flex_hub' as V1014FlexibleLoadOrchestrationBand,
    expectMinFlexRelief: 1.9,
  },
  {
    id: 'sc_cf_nsw',
    label: 'NSW storage soak with data centre shift',
    regionId: 'NSW',
    seasonalArbitrageRelief: 2.6,
    demandFlexRelief: 2.5,
    secondLifeStorageRelief: 2.3,
    renewableShareScore: 49,
    gridStressPoints: 14,
    rezSpillRelief: 2.7,
    curtailmentBand: 'pilot_recovery' as V1014CurtailmentRecoveryBand,
    completedProjectTypes: ['storage_soak_curtailment_recovery', 'data_centre_workload_shift', 'cold_chain_dispatchable_load'],
    expectFlexBand: 'shiftable_load' as V1014FlexibleLoadOrchestrationBand,
    expectMinFlexRelief: 1.6,
  },
] as const;

export function runAgent13CurtailmentFlexScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_CURTAILMENT_RECOVERY_CATALOG.length >= 4);
  ok(V1014_FLEXIBLE_LOAD_ORCHESTRATION_CATALOG.length >= 4);

  const sc0 = V1014_CURTAILMENT_FLEX_SCENARIOS[0];
  const recovery = computeRegionalCurtailmentRecoveryLedger({
    regionId: sc0.regionId,
    seasonalArbitrageRelief: sc0.seasonalArbitrageRelief,
    demandFlexRelief: sc0.demandFlexRelief,
    secondLifeStorageRelief: sc0.secondLifeStorageRelief,
    renewableShareScore: sc0.renewableShareScore,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    recovery.ledger.band === sc0.expectRecoveryBand ||
      recovery.ledger.band === 'zero_spill_leader' ||
      recovery.ledger.curtailmentRecoveryRelief >= sc0.expectMinRecoveryRelief,
  );

  const flex = advanceRegionalFlexibleLoadOrchestration({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    curtailmentBand: recovery.ledger.band,
    rezSpillRelief: sc0.rezSpillRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    flex.ledger.band === sc0.expectFlexBand ||
      flex.ledger.band === 'deep_load_orchestration' ||
      flex.ledger.flexibleLoadRelief >= sc0.expectMinFlexRelief,
  );

  const sc1 = V1014_CURTAILMENT_FLEX_SCENARIOS[1];
  const flexN = advanceRegionalFlexibleLoadOrchestration({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    curtailmentBand: sc1.curtailmentBand,
    rezSpillRelief: sc1.rezSpillRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(flexN.ledger.flexibleLoadRelief >= sc1.expectMinFlexRelief || flexN.ledger.band !== 'fixed_load');

  const persistA = computeRegionalCurtailmentRecoveryLedger({
    regionId: 'SA',
    seasonalArbitrageRelief: 2.5,
    demandFlexRelief: 2.4,
    secondLifeStorageRelief: 2.2,
    renewableShareScore: 43,
    completedProjectTypes: ['rez_spill_soak_recovery_loop'],
    prev: null,
  });
  const persistB = computeRegionalCurtailmentRecoveryLedger({
    regionId: 'SA',
    seasonalArbitrageRelief: 2.5,
    demandFlexRelief: 2.4,
    secondLifeStorageRelief: 2.2,
    renewableShareScore: 43,
    completedProjectTypes: ['rez_spill_soak_recovery_loop'],
    prev: persistA.next,
  });
  ok(persistB.next.recoveryIndex >= persistA.next.recoveryIndex * 0.74);

  const turnSc = runAgent13CurtailmentFlexTurnScenario(V1014_CURTAILMENT_FLEX_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastRecoveryRelief >= 2.2);

  const gi = scoreAgent13CurtailmentFlexGIAlignment({
    actionText: 'REZ spill soak recovery with smelter flexible load orchestration',
    recoveryBand: 'orchestrated_recovery',
    flexBand: 'industrial_flex_hub',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13CurtailmentFlexTurnStep {
  turn: number;
  regionId: string;
  seasonalArbitrageRelief: number;
  demandFlexRelief: number;
  secondLifeStorageRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  rezSpillRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13CurtailmentFlexTurnScenario {
  id: string;
  label: string;
  steps: Agent13CurtailmentFlexTurnStep[];
  expect: {
    minRecoveryReliefOnLast?: number;
    minFlexReliefOnLast?: number;
    lastRecoveryBand?: V1014CurtailmentRecoveryBand;
  };
}

export const V1014_CURTAILMENT_FLEX_TURN_SCENARIOS: readonly Agent13CurtailmentFlexTurnScenario[] = [
  {
    id: 'sc_cf_qld_escalation',
    label: 'QLD curtailment recovery with deep load orchestration',
    steps: [
      {
        turn: 1,
        regionId: 'QLD',
        seasonalArbitrageRelief: 2.3,
        demandFlexRelief: 2.2,
        secondLifeStorageRelief: 2,
        renewableShareScore: 45,
        gridStressPoints: 17,
        rezSpillRelief: 2.5,
        completedProjectTypes: ['rez_spill_soak_recovery_loop', 'storage_soak_curtailment_recovery'],
      },
      {
        turn: 2,
        regionId: 'QLD',
        seasonalArbitrageRelief: 2.7,
        demandFlexRelief: 2.6,
        secondLifeStorageRelief: 2.4,
        renewableShareScore: 50,
        gridStressPoints: 15,
        rezSpillRelief: 2.9,
        completedProjectTypes: ['export_corridor_curtailment_shift', 'smelter_flexible_load_orchestration'],
      },
      {
        turn: 3,
        regionId: 'QLD',
        seasonalArbitrageRelief: 3.1,
        demandFlexRelief: 3,
        secondLifeStorageRelief: 2.8,
        renewableShareScore: 56,
        gridStressPoints: 13,
        rezSpillRelief: 3.3,
        completedProjectTypes: [
          'rez_spill_soak_recovery_loop',
          'export_corridor_curtailment_shift',
          'storage_soak_curtailment_recovery',
          'curtailment_recovery_market_layer',
          'smelter_flexible_load_orchestration',
          'data_centre_workload_shift',
          'cold_chain_dispatchable_load',
          'industrial_demand_orchestration_hub',
        ],
      },
    ],
    expect: { minRecoveryReliefOnLast: 2.2, minFlexReliefOnLast: 1.9, lastRecoveryBand: 'orchestrated_recovery' },
  },
] as const;

export function runAgent13CurtailmentFlexTurnScenario(
  scenario: Agent13CurtailmentFlexTurnScenario,
): { passed: boolean; detail: string; lastRecoveryRelief: number; lastFlexRelief: number } {
  let recoveryMem: V1014CurtailmentPersistedSlice | null = null;
  let flexMem: V1014FlexLoadPersistedSlice | null = null;
  let lastRecoveryRelief = 0;
  let lastFlexRelief = 0;
  let lastBand: V1014CurtailmentRecoveryBand = 'unmanaged_spill';

  for (const step of scenario.steps) {
    const recovery = computeRegionalCurtailmentRecoveryLedger({
      regionId: step.regionId,
      seasonalArbitrageRelief: step.seasonalArbitrageRelief,
      demandFlexRelief: step.demandFlexRelief,
      secondLifeStorageRelief: step.secondLifeStorageRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: recoveryMem,
    });
    recoveryMem = recovery.next;
    lastRecoveryRelief = recovery.ledger.curtailmentRecoveryRelief;
    lastBand = recovery.ledger.band;

    const flex = advanceRegionalFlexibleLoadOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      curtailmentBand: recovery.ledger.band,
      rezSpillRelief: step.rezSpillRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: flexMem,
    });
    flexMem = flex.next;
    lastFlexRelief = flex.ledger.flexibleLoadRelief;
  }

  if (scenario.expect.minRecoveryReliefOnLast != null && lastRecoveryRelief < scenario.expect.minRecoveryReliefOnLast) {
    return {
      passed: false,
      detail: `recovery relief ${lastRecoveryRelief} < ${scenario.expect.minRecoveryReliefOnLast}`,
      lastRecoveryRelief,
      lastFlexRelief,
    };
  }
  if (scenario.expect.minFlexReliefOnLast != null && lastFlexRelief < scenario.expect.minFlexReliefOnLast) {
    return {
      passed: false,
      detail: `flex relief ${lastFlexRelief} < ${scenario.expect.minFlexReliefOnLast}`,
      lastRecoveryRelief,
      lastFlexRelief,
    };
  }
  if (scenario.expect.lastRecoveryBand != null) {
    const allowed: V1014CurtailmentRecoveryBand[] = [scenario.expect.lastRecoveryBand];
    if (scenario.expect.lastRecoveryBand === 'orchestrated_recovery') allowed.push('zero_spill_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastRecoveryRelief, lastFlexRelief };
    }
  }

  return { passed: true, detail: 'ok', lastRecoveryRelief, lastFlexRelief };
}

export function scoreAgent13CurtailmentFlexGIAlignment(params: {
  actionText: string;
  recoveryBand?: string;
  flexBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'curtailment',
    'spill recovery',
    'spill soak',
    'flexible load',
    'smelter flex',
    'demand orchestration',
    'renewable spill',
    'shiftable load',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.27, 0, 2);
  if (params.recoveryBand === 'zero_spill_leader' || params.recoveryBand === 'orchestrated_recovery') {
    delta += hits.some(h => h.includes('curtailment') || h.includes('spill')) ? 0.41 : 0.11;
  }
  if (params.flexBand === 'industrial_flex_hub' || params.flexBand === 'deep_load_orchestration') {
    delta += hits.some(h => h.includes('flex') || h.includes('orchestration') || h.includes('smelter')) ? 0.36 : 0.1;
  }
  if (params.flexBand === 'fixed_load' && hits.some(h => h.includes('flex'))) delta -= 0.12;
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Curtailment flex GI: ${hits.slice(0, 2).join(', ')} aligns with spill recovery and load orchestration depth.`
        : null,
  };
}
