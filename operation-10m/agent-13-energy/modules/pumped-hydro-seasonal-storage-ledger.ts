/**
 * Agent 13 scale wave round 17 — pumped hydro expansion & seasonal storage arbitrage depth.
 * Cross-turn persistence for long-duration PHES build-out and seasonal shifting relief coupled to REZ spill and bio flex maturity.
 */

export type V1014PumpedHydroExpansionBand = 'undeveloped' | 'pilot_phes' | 'multi_gigawatt_phes' | 'seasonal_storage_leader';

export type V1014SeasonalStorageArbitrageBand = 'flat_profile' | 'shoulder_shift' | 'seasonal_arbitrage' | 'deep_seasonal_flex';

export interface V1014PumpedHydroExpansionInstrument {
  id: string;
  kind: 'snowy_expansion' | 'canyon_tailpond' | 'seawater_phes' | 'mine_void_phes';
  label: string;
  storageMwEq: number;
  hydroReliefFactor: number;
  arbitrageSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_PUMPED_HYDRO_EXPANSION_CATALOG: readonly V1014PumpedHydroExpansionInstrument[] = [
  {
    id: 'ph_snowy',
    kind: 'snowy_expansion',
    label: 'Snowy 2.0 style pumped hydro expansion',
    storageMwEq: 48,
    hydroReliefFactor: 0.17,
    arbitrageSynergyFactor: 0.11,
    projectTypeHint: 'snowy_pumped_hydro_expansion',
  },
  {
    id: 'ph_canyon',
    kind: 'canyon_tailpond',
    label: 'Canyon tailpond PHES corridor',
    storageMwEq: 42,
    hydroReliefFactor: 0.15,
    arbitrageSynergyFactor: 0.1,
    projectTypeHint: 'canyon_tailpond_phes',
  },
  {
    id: 'ph_seawater',
    kind: 'seawater_phes',
    label: 'Coastal seawater PHES scheme',
    storageMwEq: 40,
    hydroReliefFactor: 0.14,
    arbitrageSynergyFactor: 0.12,
    projectTypeHint: 'coastal_seawater_phes',
  },
  {
    id: 'ph_mine',
    kind: 'mine_void_phes',
    label: 'Abandoned mine void pumped storage',
    storageMwEq: 36,
    hydroReliefFactor: 0.13,
    arbitrageSynergyFactor: 0.09,
    projectTypeHint: 'abandoned_mine_void_phes',
  },
] as const;

export interface V1014SeasonalStorageArbitrageTemplate {
  id: string;
  kind: 'summer_winter_shift' | 'shoulder_soak' | 'drought_aware_dispatch' | 'interconnect_spill_loop';
  label: string;
  arbitrageMwEq: number;
  gridReliefFactor: number;
  hydroSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_SEASONAL_ARBITRAGE_CATALOG: readonly V1014SeasonalStorageArbitrageTemplate[] = [
  {
    id: 'arb_shift',
    kind: 'summer_winter_shift',
    label: 'Summer–winter renewable shift orchestration',
    arbitrageMwEq: 46,
    gridReliefFactor: 0.16,
    hydroSynergyFactor: 0.11,
    projectTypeHint: 'summer_winter_shift_orchestration',
  },
  {
    id: 'arb_shoulder',
    kind: 'shoulder_soak',
    label: 'Shoulder-season renewable soak program',
    arbitrageMwEq: 38,
    gridReliefFactor: 0.14,
    hydroSynergyFactor: 0.1,
    projectTypeHint: 'shoulder_season_renewable_soak',
  },
  {
    id: 'arb_drought',
    kind: 'drought_aware_dispatch',
    label: 'Drought-aware storage dispatch loop',
    arbitrageMwEq: 44,
    gridReliefFactor: 0.15,
    hydroSynergyFactor: 0.12,
    projectTypeHint: 'drought_aware_storage_dispatch',
  },
  {
    id: 'arb_spill',
    kind: 'interconnect_spill_loop',
    label: 'Interconnector spill arbitrage loop',
    arbitrageMwEq: 50,
    gridReliefFactor: 0.17,
    hydroSynergyFactor: 0.13,
    projectTypeHint: 'interconnect_spill_arbitrage_loop',
  },
] as const;

export interface V1014RegionalPumpedHydroExpansionLedger {
  regionId: string;
  band: V1014PumpedHydroExpansionBand;
  hydroIndex: number;
  reservoirBalance: number;
  pumpedHydroRelief: number;
  summary: string;
}

export interface V1014RegionalSeasonalStorageArbitrageLedger {
  regionId: string;
  band: V1014SeasonalStorageArbitrageBand;
  arbitrageIndex: number;
  seasonalArbitrageRelief: number;
  summary: string;
}

export interface V1014PumpedHydroPersistedSlice {
  reservoirBalance: number;
  hydroIndex: number;
}

export interface V1014SeasonalArbitragePersistedSlice {
  arbitrageIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const PHES_REGIONS = new Set(['NSW', 'VIC', 'QLD', 'TAS', 'SA', 'WA']);

export function computeRegionalPumpedHydroExpansionLedger(params: {
  regionId: string;
  rezSpillRelief: number;
  waterEnergyNexusRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014PumpedHydroPersistedSlice | null;
}): { ledger: V1014RegionalPumpedHydroExpansionLedger; next: V1014PumpedHydroPersistedSlice } {
  let storageGain = 0;
  let hydroProxy = 0;
  let arbSynergy = 0;
  for (const inst of V1014_PUMPED_HYDRO_EXPANSION_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      storageGain += inst.storageMwEq;
      hydroProxy += inst.hydroReliefFactor;
      arbSynergy += inst.arbitrageSynergyFactor;
    }
  }
  if (PHES_REGIONS.has(params.regionId)) hydroProxy += 0.05;
  else hydroProxy *= 0.72;
  if (params.rezSpillRelief > 3) {
    storageGain += clamp(params.rezSpillRelief * 1.05, 0, 14);
    hydroProxy += 0.06;
  }
  if (params.waterEnergyNexusRelief > 2.5) arbSynergy += clamp(params.waterEnergyNexusRelief * 0.024, 0, 0.11);
  hydroProxy += clamp(params.renewableShareScore / 115, 0, 0.1);

  const prevIdx = params.prev?.hydroIndex ?? 0;
  const prevBal = params.prev?.reservoirBalance ?? 0;
  const reservoirBalance = clamp(prevBal * 0.89 + storageGain * 0.1, 0, 220);
  const hydroIndex = clamp(
    prevIdx * 0.86 + reservoirBalance * 0.1 + hydroProxy * 84 + arbSynergy * 25,
    0,
    152,
  );

  let band: V1014PumpedHydroExpansionBand = 'undeveloped';
  if (hydroIndex >= 96 || storageGain >= 118) band = 'seasonal_storage_leader';
  else if (hydroIndex >= 58 || storageGain >= 66) band = 'multi_gigawatt_phes';
  else if (hydroIndex >= 24 || storageGain >= 22) band = 'pilot_phes';

  let pumpedHydroRelief = clamp(hydroProxy * 9.2 + storageGain * 0.046 + arbSynergy * 5.4, 0, 11.5);
  if (band === 'undeveloped') pumpedHydroRelief *= 0.38;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      hydroIndex: clamp(hydroIndex, 0, 152),
      reservoirBalance: clamp(reservoirBalance, 0, 220),
      pumpedHydroRelief: clamp(pumpedHydroRelief, 0, 11.5),
      summary: `${params.regionId} PHES ${band} · idx ${hydroIndex.toFixed(0)} · relief ${pumpedHydroRelief.toFixed(1)}`,
    },
    next: { reservoirBalance: clamp(reservoirBalance, 0, 220), hydroIndex: clamp(hydroIndex, 0, 152) },
  };
}

export function advanceRegionalSeasonalStorageArbitrage(params: {
  regionId: string;
  gridStressPoints: number;
  pumpedHydroBand: V1014PumpedHydroExpansionBand;
  bioenergyGridFlexRelief: number;
  completedProjectTypes: string[];
  prev?: V1014SeasonalArbitragePersistedSlice | null;
}): { ledger: V1014RegionalSeasonalStorageArbitrageLedger; next: V1014SeasonalArbitragePersistedSlice } {
  let arbGain = 0;
  let reliefProxy = 0;
  let hydroSynergy = 0;
  for (const tpl of V1014_SEASONAL_ARBITRAGE_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      arbGain += tpl.arbitrageMwEq;
      reliefProxy += tpl.gridReliefFactor;
      hydroSynergy += tpl.hydroSynergyFactor;
    }
  }
  if (params.pumpedHydroBand === 'multi_gigawatt_phes' || params.pumpedHydroBand === 'seasonal_storage_leader') {
    arbGain += 14;
    hydroSynergy += 0.09;
  }
  if (params.bioenergyGridFlexRelief > 2.8) {
    arbGain += params.bioenergyGridFlexRelief * 0.92;
    reliefProxy += clamp(params.bioenergyGridFlexRelief * 0.012, 0, 0.08);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.33, 0, 12);
  const prevIdx = params.prev?.arbitrageIndex ?? 0;
  const arbitrageIndex = clamp(prevIdx * 0.87 + arbGain * 0.1 + reliefProxy * 35 - stressLoad * 0.04 + hydroSynergy * 27, 0, 155);

  let band: V1014SeasonalStorageArbitrageBand = 'flat_profile';
  if (arbitrageIndex >= 100 || arbGain >= 120) band = 'deep_seasonal_flex';
  else if (arbitrageIndex >= 62 || arbGain >= 72) band = 'seasonal_arbitrage';
  else if (arbitrageIndex >= 28 || arbGain >= 26) band = 'shoulder_shift';

  let seasonalArbitrageRelief = clamp(arbitrageIndex / 21 + reliefProxy * 7 + hydroSynergy * 7.6, 0, 10.5);
  if (band === 'flat_profile') seasonalArbitrageRelief = clamp(seasonalArbitrageRelief * 0.36, 0, 3.4);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      arbitrageIndex: clamp(arbitrageIndex, 0, 155),
      seasonalArbitrageRelief: clamp(seasonalArbitrageRelief, 0, 10.5),
      summary: `${params.regionId} seasonal arb ${band} · idx ${arbitrageIndex.toFixed(0)} · relief ${seasonalArbitrageRelief.toFixed(1)}`,
    },
    next: { arbitrageIndex: clamp(arbitrageIndex, 0, 155) },
  };
}

export const V1014_PUMPED_HYDRO_SEASONAL_SCENARIOS = [
  {
    id: 'sc_phes_nsw',
    label: 'NSW Snowy expansion with summer–winter shift',
    regionId: 'NSW',
    rezSpillRelief: 4,
    waterEnergyNexusRelief: 3.2,
    renewableShareScore: 54,
    gridStressPoints: 17,
    bioenergyGridFlexRelief: 3.2,
    completedProjectTypes: ['snowy_pumped_hydro_expansion', 'summer_winter_shift_orchestration', 'interconnect_spill_arbitrage_loop'],
    expectHydroBand: 'multi_gigawatt_phes' as V1014PumpedHydroExpansionBand,
    expectMinHydroRelief: 3,
    expectArbBand: 'seasonal_arbitrage' as V1014SeasonalStorageArbitrageBand,
    expectMinArbRelief: 2,
  },
  {
    id: 'sc_phes_tas',
    label: 'TAS canyon PHES with shoulder soak',
    regionId: 'TAS',
    rezSpillRelief: 3.5,
    waterEnergyNexusRelief: 2.9,
    renewableShareScore: 50,
    gridStressPoints: 15,
    bioenergyGridFlexRelief: 2.6,
    pumpedHydroBand: 'pilot_phes' as V1014PumpedHydroExpansionBand,
    completedProjectTypes: ['canyon_tailpond_phes', 'shoulder_season_renewable_soak', 'drought_aware_storage_dispatch'],
    expectArbBand: 'shoulder_shift' as V1014SeasonalStorageArbitrageBand,
    expectMinArbRelief: 2,
  },
] as const;

export function runAgent13PumpedHydroSeasonalScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_PUMPED_HYDRO_EXPANSION_CATALOG.length >= 4);
  ok(V1014_SEASONAL_ARBITRAGE_CATALOG.length >= 4);

  const sc0 = V1014_PUMPED_HYDRO_SEASONAL_SCENARIOS[0];
  const hydro = computeRegionalPumpedHydroExpansionLedger({
    regionId: sc0.regionId,
    rezSpillRelief: sc0.rezSpillRelief,
    waterEnergyNexusRelief: sc0.waterEnergyNexusRelief,
    renewableShareScore: sc0.renewableShareScore,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    hydro.ledger.band === sc0.expectHydroBand ||
      hydro.ledger.band === 'seasonal_storage_leader' ||
      hydro.ledger.pumpedHydroRelief >= sc0.expectMinHydroRelief,
  );

  const arb = advanceRegionalSeasonalStorageArbitrage({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    pumpedHydroBand: hydro.ledger.band,
    bioenergyGridFlexRelief: sc0.bioenergyGridFlexRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    arb.ledger.band === sc0.expectArbBand ||
      arb.ledger.band === 'deep_seasonal_flex' ||
      arb.ledger.seasonalArbitrageRelief >= sc0.expectMinArbRelief,
  );

  const sc1 = V1014_PUMPED_HYDRO_SEASONAL_SCENARIOS[1];
  const arbT = advanceRegionalSeasonalStorageArbitrage({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    pumpedHydroBand: sc1.pumpedHydroBand,
    bioenergyGridFlexRelief: sc1.bioenergyGridFlexRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(arbT.ledger.seasonalArbitrageRelief >= sc1.expectMinArbRelief || arbT.ledger.band !== 'flat_profile');

  const persistA = computeRegionalPumpedHydroExpansionLedger({
    regionId: 'VIC',
    rezSpillRelief: 3,
    waterEnergyNexusRelief: 2.6,
    renewableShareScore: 46,
    completedProjectTypes: ['snowy_pumped_hydro_expansion'],
    prev: null,
  });
  const persistB = computeRegionalPumpedHydroExpansionLedger({
    regionId: 'VIC',
    rezSpillRelief: 3,
    waterEnergyNexusRelief: 2.6,
    renewableShareScore: 46,
    completedProjectTypes: ['snowy_pumped_hydro_expansion'],
    prev: persistA.next,
  });
  ok(persistB.next.hydroIndex >= persistA.next.hydroIndex * 0.8);

  const turnSc = runAgent13PumpedHydroSeasonalTurnScenario(V1014_PUMPED_HYDRO_SEASONAL_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastHydroRelief >= 3);

  const gi = scoreAgent13PumpedHydroSeasonalGIAlignment({
    actionText: 'Snowy pumped hydro with summer winter shift and interconnect spill arbitrage',
    hydroBand: 'multi_gigawatt_phes',
    arbBand: 'seasonal_arbitrage',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13PumpedHydroSeasonalTurnStep {
  turn: number;
  regionId: string;
  rezSpillRelief: number;
  waterEnergyNexusRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  bioenergyGridFlexRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13PumpedHydroSeasonalTurnScenario {
  id: string;
  label: string;
  steps: Agent13PumpedHydroSeasonalTurnStep[];
  expect: {
    minHydroReliefOnLast?: number;
    minArbReliefOnLast?: number;
    lastHydroBand?: V1014PumpedHydroExpansionBand;
  };
}

export const V1014_PUMPED_HYDRO_SEASONAL_TURN_SCENARIOS: readonly Agent13PumpedHydroSeasonalTurnScenario[] = [
  {
    id: 'sc_phes_nsw_escalation',
    label: 'NSW PHES build-out with deep seasonal flex',
    steps: [
      {
        turn: 1,
        regionId: 'NSW',
        rezSpillRelief: 3,
        waterEnergyNexusRelief: 2.6,
        renewableShareScore: 48,
        gridStressPoints: 18,
        bioenergyGridFlexRelief: 2.5,
        completedProjectTypes: ['snowy_pumped_hydro_expansion', 'canyon_tailpond_phes'],
      },
      {
        turn: 2,
        regionId: 'NSW',
        rezSpillRelief: 3.8,
        waterEnergyNexusRelief: 3,
        renewableShareScore: 52,
        gridStressPoints: 16,
        bioenergyGridFlexRelief: 3,
        completedProjectTypes: ['snowy_pumped_hydro_expansion', 'summer_winter_shift_orchestration', 'interconnect_spill_arbitrage_loop'],
      },
      {
        turn: 3,
        regionId: 'NSW',
        rezSpillRelief: 4.5,
        waterEnergyNexusRelief: 3.4,
        renewableShareScore: 58,
        gridStressPoints: 14,
        bioenergyGridFlexRelief: 3.5,
        completedProjectTypes: [
          'snowy_pumped_hydro_expansion',
          'canyon_tailpond_phes',
          'coastal_seawater_phes',
          'abandoned_mine_void_phes',
          'summer_winter_shift_orchestration',
          'shoulder_season_renewable_soak',
          'drought_aware_storage_dispatch',
          'interconnect_spill_arbitrage_loop',
        ],
      },
    ],
    expect: { minHydroReliefOnLast: 3, minArbReliefOnLast: 2, lastHydroBand: 'multi_gigawatt_phes' },
  },
] as const;

export function runAgent13PumpedHydroSeasonalTurnScenario(
  scenario: Agent13PumpedHydroSeasonalTurnScenario,
): { passed: boolean; detail: string; lastHydroRelief: number; lastArbRelief: number } {
  let hydroMem: V1014PumpedHydroPersistedSlice | null = null;
  let arbMem: V1014SeasonalArbitragePersistedSlice | null = null;
  let lastHydroRelief = 0;
  let lastArbRelief = 0;
  let lastBand: V1014PumpedHydroExpansionBand = 'undeveloped';

  for (const step of scenario.steps) {
    const hydro = computeRegionalPumpedHydroExpansionLedger({
      regionId: step.regionId,
      rezSpillRelief: step.rezSpillRelief,
      waterEnergyNexusRelief: step.waterEnergyNexusRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: hydroMem,
    });
    hydroMem = hydro.next;
    lastHydroRelief = hydro.ledger.pumpedHydroRelief;
    lastBand = hydro.ledger.band;

    const arb = advanceRegionalSeasonalStorageArbitrage({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      pumpedHydroBand: hydro.ledger.band,
      bioenergyGridFlexRelief: step.bioenergyGridFlexRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: arbMem,
    });
    arbMem = arb.next;
    lastArbRelief = arb.ledger.seasonalArbitrageRelief;
  }

  if (scenario.expect.minHydroReliefOnLast != null && lastHydroRelief < scenario.expect.minHydroReliefOnLast) {
    return {
      passed: false,
      detail: `hydro relief ${lastHydroRelief} < ${scenario.expect.minHydroReliefOnLast}`,
      lastHydroRelief,
      lastArbRelief,
    };
  }
  if (scenario.expect.minArbReliefOnLast != null && lastArbRelief < scenario.expect.minArbReliefOnLast) {
    return {
      passed: false,
      detail: `arb relief ${lastArbRelief} < ${scenario.expect.minArbReliefOnLast}`,
      lastHydroRelief,
      lastArbRelief,
    };
  }
  if (scenario.expect.lastHydroBand != null) {
    const allowed: V1014PumpedHydroExpansionBand[] = [scenario.expect.lastHydroBand];
    if (scenario.expect.lastHydroBand === 'multi_gigawatt_phes') allowed.push('seasonal_storage_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastHydroRelief, lastArbRelief };
    }
  }

  return { passed: true, detail: 'ok', lastHydroRelief, lastArbRelief };
}

export function scoreAgent13PumpedHydroSeasonalGIAlignment(params: {
  actionText: string;
  hydroBand?: string;
  arbBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'pumped hydro',
    'phes',
    'snowy',
    'seasonal storage',
    'summer winter',
    'shoulder season',
    'arbitrage',
    'long duration storage',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.33, 0, 2);
  if (params.hydroBand === 'seasonal_storage_leader' || params.hydroBand === 'multi_gigawatt_phes') {
    delta += hits.some(h => h.includes('pumped') || h.includes('snowy') || h.includes('phes')) ? 0.48 : 0.16;
  }
  if (params.arbBand === 'seasonal_arbitrage' || params.arbBand === 'deep_seasonal_flex') {
    delta += hits.some(h => h.includes('seasonal') || h.includes('arbitrage') || h.includes('summer')) ? 0.42 : 0.12;
  }
  if (params.arbBand === 'flat_profile' && hits.some(h => h.includes('arbitrage'))) delta -= 0.16;
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `PHES seasonal GI: ${hits.slice(0, 2).join(', ')} aligns with pumped hydro and seasonal arbitrage depth.`
        : null,
  };
}
