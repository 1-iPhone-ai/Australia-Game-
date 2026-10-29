/**
 * Agent 13 scale wave round 21 — battery recycling circular supply & second-life storage orchestration depth.
 * Cross-turn persistence for end-of-life recovery corridors and repurposed storage relief coupled to circular recovery, minerals security, and grid-forming maturity.
 */

export type V1014BatteryRecyclingBand = 'landfill_risk' | 'pilot_recovery' | 'circular_battery_hub' | 'closed_loop_leader';

export type V1014SecondLifeStorageBand = 'scrap_only' | 'repurpose_pilot' | 'second_life_fleet' | 'deep_storage_reuse';

export interface V1014BatteryRecyclingInstrument {
  id: string;
  kind: 'ev_pack_recovery' | 'grid_battery_dismantle' | 'black_mass_refinery' | 'critical_mineral_reclaim';
  label: string;
  recoveryMwEq: number;
  stewardshipReliefFactor: number;
  secondLifeSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_BATTERY_RECYCLING_CATALOG: readonly V1014BatteryRecyclingInstrument[] = [
  {
    id: 'br_ev',
    kind: 'ev_pack_recovery',
    label: 'EV battery pack recovery corridor',
    recoveryMwEq: 38,
    stewardshipReliefFactor: 0.14,
    secondLifeSynergyFactor: 0.1,
    projectTypeHint: 'ev_battery_pack_recovery_corridor',
  },
  {
    id: 'br_grid',
    kind: 'grid_battery_dismantle',
    label: 'Grid-scale battery dismantling hub',
    recoveryMwEq: 42,
    stewardshipReliefFactor: 0.15,
    secondLifeSynergyFactor: 0.11,
    projectTypeHint: 'grid_scale_battery_dismantling_hub',
  },
  {
    id: 'br_black',
    kind: 'black_mass_refinery',
    label: 'Black mass hydromet refinery',
    recoveryMwEq: 44,
    stewardshipReliefFactor: 0.16,
    secondLifeSynergyFactor: 0.09,
    projectTypeHint: 'black_mass_hydromet_refinery',
  },
  {
    id: 'br_reclaim',
    kind: 'critical_mineral_reclaim',
    label: 'Critical mineral reclaim loop',
    recoveryMwEq: 40,
    stewardshipReliefFactor: 0.13,
    secondLifeSynergyFactor: 0.12,
    projectTypeHint: 'critical_mineral_reclaim_loop',
  },
] as const;

export interface V1014SecondLifeStorageTemplate {
  id: string;
  kind: 'telecom_backup' | 'community_solar_buffer' | 'industrial_peak_shave' | 'weak_grid_buffer';
  label: string;
  reuseMwEq: number;
  gridReliefFactor: number;
  recyclingSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_SECOND_LIFE_STORAGE_CATALOG: readonly V1014SecondLifeStorageTemplate[] = [
  {
    id: 'sl_telecom',
    kind: 'telecom_backup',
    label: 'Telecom backup second-life array',
    reuseMwEq: 36,
    gridReliefFactor: 0.13,
    recyclingSynergyFactor: 0.1,
    projectTypeHint: 'telecom_backup_second_life_array',
  },
  {
    id: 'sl_community',
    kind: 'community_solar_buffer',
    label: 'Community solar buffer reuse',
    reuseMwEq: 40,
    gridReliefFactor: 0.14,
    recyclingSynergyFactor: 0.11,
    projectTypeHint: 'community_solar_buffer_reuse',
  },
  {
    id: 'sl_industrial',
    kind: 'industrial_peak_shave',
    label: 'Industrial peak-shave second-life bank',
    reuseMwEq: 46,
    gridReliefFactor: 0.16,
    recyclingSynergyFactor: 0.12,
    projectTypeHint: 'industrial_peak_shave_second_life',
  },
  {
    id: 'sl_weak_grid',
    kind: 'weak_grid_buffer',
    label: 'Weak-grid buffer repurposing loop',
    reuseMwEq: 48,
    gridReliefFactor: 0.17,
    recyclingSynergyFactor: 0.13,
    projectTypeHint: 'weak_grid_buffer_repurposing',
  },
] as const;

export interface V1014RegionalBatteryRecyclingLedger {
  regionId: string;
  band: V1014BatteryRecyclingBand;
  recyclingIndex: number;
  recoveryBalance: number;
  batteryRecyclingRelief: number;
  summary: string;
}

export interface V1014RegionalSecondLifeStorageLedger {
  regionId: string;
  band: V1014SecondLifeStorageBand;
  reuseIndex: number;
  secondLifeStorageRelief: number;
  summary: string;
}

export interface V1014BatteryRecyclingPersistedSlice {
  recoveryBalance: number;
  recyclingIndex: number;
}

export interface V1014SecondLifePersistedSlice {
  reuseIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const RECYCLING_REGIONS = new Set(['SA', 'NSW', 'VIC', 'QLD', 'WA']);

export function computeRegionalBatteryRecyclingLedger(params: {
  regionId: string;
  circularRecoveryRelief: number;
  mineralsSupplyRelief: number;
  gridFormingRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014BatteryRecyclingPersistedSlice | null;
}): { ledger: V1014RegionalBatteryRecyclingLedger; next: V1014BatteryRecyclingPersistedSlice } {
  let recoveryGain = 0;
  let stewardshipProxy = 0;
  let secondLifeSynergy = 0;
  for (const inst of V1014_BATTERY_RECYCLING_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      recoveryGain += inst.recoveryMwEq;
      stewardshipProxy += inst.stewardshipReliefFactor;
      secondLifeSynergy += inst.secondLifeSynergyFactor;
    }
  }
  if (RECYCLING_REGIONS.has(params.regionId)) stewardshipProxy += 0.05;
  else stewardshipProxy *= 0.74;
  if (params.circularRecoveryRelief > 2.4) {
    recoveryGain += clamp(params.circularRecoveryRelief * 1.08, 0, 11);
    stewardshipProxy += 0.06;
  }
  if (params.mineralsSupplyRelief > 2.6) secondLifeSynergy += clamp(params.mineralsSupplyRelief * 0.019, 0, 0.08);
  if (params.gridFormingRelief > 2.2) stewardshipProxy += clamp(params.gridFormingRelief * 0.015, 0, 0.07);
  stewardshipProxy += clamp(params.renewableShareScore / 114, 0, 0.09);

  const prevIdx = params.prev?.recyclingIndex ?? 0;
  const prevBal = params.prev?.recoveryBalance ?? 0;
  const recoveryBalance = clamp(prevBal * 0.87 + recoveryGain * 0.11, 0, 212);
  const recyclingIndex = clamp(prevIdx * 0.84 + recoveryBalance * 0.1 + stewardshipProxy * 79 + secondLifeSynergy * 23, 0, 149);

  let band: V1014BatteryRecyclingBand = 'landfill_risk';
  if (recyclingIndex >= 94 || recoveryGain >= 112) band = 'closed_loop_leader';
  else if (recyclingIndex >= 56 || recoveryGain >= 62) band = 'circular_battery_hub';
  else if (recyclingIndex >= 22 || recoveryGain >= 20) band = 'pilot_recovery';

  let batteryRecyclingRelief = clamp(stewardshipProxy * 8.2 + recoveryGain * 0.041 + secondLifeSynergy * 4.9, 0, 10.4);
  if (band === 'landfill_risk') batteryRecyclingRelief *= 0.33;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      recyclingIndex: clamp(recyclingIndex, 0, 149),
      recoveryBalance: clamp(recoveryBalance, 0, 212),
      batteryRecyclingRelief: clamp(batteryRecyclingRelief, 0, 10.4),
      summary: `${params.regionId} battery recycling ${band} · idx ${recyclingIndex.toFixed(0)} · relief ${batteryRecyclingRelief.toFixed(1)}`,
    },
    next: { recoveryBalance: clamp(recoveryBalance, 0, 212), recyclingIndex: clamp(recyclingIndex, 0, 149) },
  };
}

export function advanceRegionalSecondLifeStorage(params: {
  regionId: string;
  gridStressPoints: number;
  recyclingBand: V1014BatteryRecyclingBand;
  syntheticInertiaRelief: number;
  completedProjectTypes: string[];
  prev?: V1014SecondLifePersistedSlice | null;
}): { ledger: V1014RegionalSecondLifeStorageLedger; next: V1014SecondLifePersistedSlice } {
  let reuseGain = 0;
  let reliefProxy = 0;
  let recyclingSynergy = 0;
  for (const tpl of V1014_SECOND_LIFE_STORAGE_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      reuseGain += tpl.reuseMwEq;
      reliefProxy += tpl.gridReliefFactor;
      recyclingSynergy += tpl.recyclingSynergyFactor;
    }
  }
  if (params.recyclingBand === 'circular_battery_hub' || params.recyclingBand === 'closed_loop_leader') {
    reuseGain += 12;
    recyclingSynergy += 0.08;
  }
  if (params.syntheticInertiaRelief > 2.5) {
    reuseGain += params.syntheticInertiaRelief * 0.8;
    reliefProxy += clamp(params.syntheticInertiaRelief * 0.01, 0, 0.06);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.28, 0, 10);
  const prevIdx = params.prev?.reuseIndex ?? 0;
  const reuseIndex = clamp(prevIdx * 0.85 + reuseGain * 0.1 + reliefProxy * 31 - stressLoad * 0.032 + recyclingSynergy * 24, 0, 152);

  let band: V1014SecondLifeStorageBand = 'scrap_only';
  if (reuseIndex >= 98 || reuseGain >= 116) band = 'deep_storage_reuse';
  else if (reuseIndex >= 60 || reuseGain >= 68) band = 'second_life_fleet';
  else if (reuseIndex >= 26 || reuseGain >= 22) band = 'repurpose_pilot';

  let secondLifeStorageRelief = clamp(reuseIndex / 21 + reliefProxy * 6.4 + recyclingSynergy * 6.9, 0, 9.9);
  if (band === 'scrap_only') secondLifeStorageRelief = clamp(secondLifeStorageRelief * 0.31, 0, 2.9);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      reuseIndex: clamp(reuseIndex, 0, 152),
      secondLifeStorageRelief: clamp(secondLifeStorageRelief, 0, 9.9),
      summary: `${params.regionId} second-life ${band} · idx ${reuseIndex.toFixed(0)} · relief ${secondLifeStorageRelief.toFixed(1)}`,
    },
    next: { reuseIndex: clamp(reuseIndex, 0, 152) },
  };
}

export const V1014_BATTERY_SECOND_LIFE_SCENARIOS = [
  {
    id: 'sc_br_sa',
    label: 'SA circular hub with industrial second-life bank',
    regionId: 'SA',
    circularRecoveryRelief: 3.1,
    mineralsSupplyRelief: 3,
    gridFormingRelief: 2.8,
    renewableShareScore: 54,
    gridStressPoints: 15,
    syntheticInertiaRelief: 2.7,
    completedProjectTypes: [
      'grid_scale_battery_dismantling_hub',
      'black_mass_hydromet_refinery',
      'industrial_peak_shave_second_life',
      'weak_grid_buffer_repurposing',
    ],
    expectRecyclingBand: 'circular_battery_hub' as V1014BatteryRecyclingBand,
    expectMinRecyclingRelief: 2.3,
    expectSecondLifeBand: 'second_life_fleet' as V1014SecondLifeStorageBand,
    expectMinSecondLifeRelief: 1.9,
  },
  {
    id: 'sc_br_vic',
    label: 'VIC EV recovery with community buffer reuse',
    regionId: 'VIC',
    circularRecoveryRelief: 2.6,
    mineralsSupplyRelief: 2.4,
    gridFormingRelief: 2.3,
    renewableShareScore: 48,
    gridStressPoints: 14,
    syntheticInertiaRelief: 2.2,
    recyclingBand: 'pilot_recovery' as V1014BatteryRecyclingBand,
    completedProjectTypes: ['ev_battery_pack_recovery_corridor', 'community_solar_buffer_reuse', 'telecom_backup_second_life_array'],
    expectSecondLifeBand: 'repurpose_pilot' as V1014SecondLifeStorageBand,
    expectMinSecondLifeRelief: 1.6,
  },
] as const;

export function runAgent13BatterySecondLifeScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_BATTERY_RECYCLING_CATALOG.length >= 4);
  ok(V1014_SECOND_LIFE_STORAGE_CATALOG.length >= 4);

  const sc0 = V1014_BATTERY_SECOND_LIFE_SCENARIOS[0];
  const recycling = computeRegionalBatteryRecyclingLedger({
    regionId: sc0.regionId,
    circularRecoveryRelief: sc0.circularRecoveryRelief,
    mineralsSupplyRelief: sc0.mineralsSupplyRelief,
    gridFormingRelief: sc0.gridFormingRelief,
    renewableShareScore: sc0.renewableShareScore,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    recycling.ledger.band === sc0.expectRecyclingBand ||
      recycling.ledger.band === 'closed_loop_leader' ||
      recycling.ledger.batteryRecyclingRelief >= sc0.expectMinRecyclingRelief,
  );

  const secondLife = advanceRegionalSecondLifeStorage({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    recyclingBand: recycling.ledger.band,
    syntheticInertiaRelief: sc0.syntheticInertiaRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    secondLife.ledger.band === sc0.expectSecondLifeBand ||
      secondLife.ledger.band === 'deep_storage_reuse' ||
      secondLife.ledger.secondLifeStorageRelief >= sc0.expectMinSecondLifeRelief,
  );

  const sc1 = V1014_BATTERY_SECOND_LIFE_SCENARIOS[1];
  const slV = advanceRegionalSecondLifeStorage({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    recyclingBand: sc1.recyclingBand,
    syntheticInertiaRelief: sc1.syntheticInertiaRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(slV.ledger.secondLifeStorageRelief >= sc1.expectMinSecondLifeRelief || slV.ledger.band !== 'scrap_only');

  const persistA = computeRegionalBatteryRecyclingLedger({
    regionId: 'QLD',
    circularRecoveryRelief: 2.7,
    mineralsSupplyRelief: 2.5,
    gridFormingRelief: 2.4,
    renewableShareScore: 42,
    completedProjectTypes: ['ev_battery_pack_recovery_corridor'],
    prev: null,
  });
  const persistB = computeRegionalBatteryRecyclingLedger({
    regionId: 'QLD',
    circularRecoveryRelief: 2.7,
    mineralsSupplyRelief: 2.5,
    gridFormingRelief: 2.4,
    renewableShareScore: 42,
    completedProjectTypes: ['ev_battery_pack_recovery_corridor'],
    prev: persistA.next,
  });
  ok(persistB.next.recyclingIndex >= persistA.next.recyclingIndex * 0.75);

  const turnSc = runAgent13BatterySecondLifeTurnScenario(V1014_BATTERY_SECOND_LIFE_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastRecyclingRelief >= 2.3);

  const gi = scoreAgent13BatterySecondLifeGIAlignment({
    actionText: 'EV battery pack recovery with black mass refinery and industrial second life peak shave',
    recyclingBand: 'circular_battery_hub',
    secondLifeBand: 'second_life_fleet',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13BatterySecondLifeTurnStep {
  turn: number;
  regionId: string;
  circularRecoveryRelief: number;
  mineralsSupplyRelief: number;
  gridFormingRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  syntheticInertiaRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13BatterySecondLifeTurnScenario {
  id: string;
  label: string;
  steps: Agent13BatterySecondLifeTurnStep[];
  expect: {
    minRecyclingReliefOnLast?: number;
    minSecondLifeReliefOnLast?: number;
    lastRecyclingBand?: V1014BatteryRecyclingBand;
  };
}

export const V1014_BATTERY_SECOND_LIFE_TURN_SCENARIOS: readonly Agent13BatterySecondLifeTurnScenario[] = [
  {
    id: 'sc_br_sa_escalation',
    label: 'SA battery circular build-out with deep storage reuse',
    steps: [
      {
        turn: 1,
        regionId: 'SA',
        circularRecoveryRelief: 2.4,
        mineralsSupplyRelief: 2.3,
        gridFormingRelief: 2.2,
        renewableShareScore: 44,
        gridStressPoints: 16,
        syntheticInertiaRelief: 2.2,
        completedProjectTypes: ['ev_battery_pack_recovery_corridor', 'grid_scale_battery_dismantling_hub'],
      },
      {
        turn: 2,
        regionId: 'SA',
        circularRecoveryRelief: 2.8,
        mineralsSupplyRelief: 2.7,
        gridFormingRelief: 2.6,
        renewableShareScore: 48,
        gridStressPoints: 14,
        syntheticInertiaRelief: 2.6,
        completedProjectTypes: ['black_mass_hydromet_refinery', 'community_solar_buffer_reuse'],
      },
      {
        turn: 3,
        regionId: 'SA',
        circularRecoveryRelief: 3.2,
        mineralsSupplyRelief: 3.1,
        gridFormingRelief: 3,
        renewableShareScore: 54,
        gridStressPoints: 12,
        syntheticInertiaRelief: 3,
        completedProjectTypes: [
          'ev_battery_pack_recovery_corridor',
          'grid_scale_battery_dismantling_hub',
          'black_mass_hydromet_refinery',
          'critical_mineral_reclaim_loop',
          'telecom_backup_second_life_array',
          'community_solar_buffer_reuse',
          'industrial_peak_shave_second_life',
          'weak_grid_buffer_repurposing',
        ],
      },
    ],
    expect: { minRecyclingReliefOnLast: 2.3, minSecondLifeReliefOnLast: 1.9, lastRecyclingBand: 'circular_battery_hub' },
  },
] as const;

export function runAgent13BatterySecondLifeTurnScenario(
  scenario: Agent13BatterySecondLifeTurnScenario,
): { passed: boolean; detail: string; lastRecyclingRelief: number; lastSecondLifeRelief: number } {
  let recyclingMem: V1014BatteryRecyclingPersistedSlice | null = null;
  let secondLifeMem: V1014SecondLifePersistedSlice | null = null;
  let lastRecyclingRelief = 0;
  let lastSecondLifeRelief = 0;
  let lastBand: V1014BatteryRecyclingBand = 'landfill_risk';

  for (const step of scenario.steps) {
    const recycling = computeRegionalBatteryRecyclingLedger({
      regionId: step.regionId,
      circularRecoveryRelief: step.circularRecoveryRelief,
      mineralsSupplyRelief: step.mineralsSupplyRelief,
      gridFormingRelief: step.gridFormingRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: recyclingMem,
    });
    recyclingMem = recycling.next;
    lastRecyclingRelief = recycling.ledger.batteryRecyclingRelief;
    lastBand = recycling.ledger.band;

    const secondLife = advanceRegionalSecondLifeStorage({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      recyclingBand: recycling.ledger.band,
      syntheticInertiaRelief: step.syntheticInertiaRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: secondLifeMem,
    });
    secondLifeMem = secondLife.next;
    lastSecondLifeRelief = secondLife.ledger.secondLifeStorageRelief;
  }

  if (scenario.expect.minRecyclingReliefOnLast != null && lastRecyclingRelief < scenario.expect.minRecyclingReliefOnLast) {
    return {
      passed: false,
      detail: `recycling relief ${lastRecyclingRelief} < ${scenario.expect.minRecyclingReliefOnLast}`,
      lastRecyclingRelief,
      lastSecondLifeRelief,
    };
  }
  if (scenario.expect.minSecondLifeReliefOnLast != null && lastSecondLifeRelief < scenario.expect.minSecondLifeReliefOnLast) {
    return {
      passed: false,
      detail: `second-life relief ${lastSecondLifeRelief} < ${scenario.expect.minSecondLifeReliefOnLast}`,
      lastRecyclingRelief,
      lastSecondLifeRelief,
    };
  }
  if (scenario.expect.lastRecyclingBand != null) {
    const allowed: V1014BatteryRecyclingBand[] = [scenario.expect.lastRecyclingBand];
    if (scenario.expect.lastRecyclingBand === 'circular_battery_hub') allowed.push('closed_loop_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastRecyclingRelief, lastSecondLifeRelief };
    }
  }

  return { passed: true, detail: 'ok', lastRecyclingRelief, lastSecondLifeRelief };
}

export function scoreAgent13BatterySecondLifeGIAlignment(params: {
  actionText: string;
  recyclingBand?: string;
  secondLifeBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'battery recycling',
    'second life',
    'second-life',
    'black mass',
    'ev battery',
    'repurpose',
    'circular battery',
    'critical mineral reclaim',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.28, 0, 2);
  if (params.recyclingBand === 'closed_loop_leader' || params.recyclingBand === 'circular_battery_hub') {
    delta += hits.some(h => h.includes('recycling') || h.includes('black mass')) ? 0.42 : 0.11;
  }
  if (params.secondLifeBand === 'second_life_fleet' || params.secondLifeBand === 'deep_storage_reuse') {
    delta += hits.some(h => h.includes('second') || h.includes('repurpose')) ? 0.37 : 0.1;
  }
  if (params.secondLifeBand === 'scrap_only' && hits.some(h => h.includes('second'))) delta -= 0.12;
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Battery second-life GI: ${hits.slice(0, 2).join(', ')} aligns with circular recovery and reuse depth.`
        : null,
  };
}
