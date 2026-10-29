/**
 * Agent 13 scale wave round 29 (O10-189) — critical minerals circular recovery & battery supply chain orchestration depth.
 * Cross-turn persistence for minerals circular corridors and battery supply chain relief coupled to minerals supply,
 * battery recycling, second-life storage, circular recovery, and green hydrogen export maturity.
 */

export type V1014MineralsCircularRecoveryBand =
  | 'linear_extraction'
  | 'pilot_circularity'
  | 'recovery_corridor'
  | 'closed_loop_minerals_leader';

export type V1014BatterySupplyChainBand =
  | 'supply_fragile'
  | 'pilot_supply_mesh'
  | 'battery_supply_hub'
  | 'resilient_supply_mesh';

export interface V1014MineralsCircularRecoveryInstrument {
  id: string;
  kind: 'black_mass_recovery' | 'cathode_recycling_loop' | 'rare_earth_recovery_hub' | 'industrial_scrap_orchestration';
  label: string;
  recoveryMwEq: number;
  mineralsReliefFactor: number;
  batterySynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_MINERALS_CIRCULAR_RECOVERY_CATALOG: readonly V1014MineralsCircularRecoveryInstrument[] = [
  {
    id: 'mc_black_mass',
    kind: 'black_mass_recovery',
    label: 'Black mass recovery corridor',
    recoveryMwEq: 42,
    mineralsReliefFactor: 0.16,
    batterySynergyFactor: 0.11,
    projectTypeHint: 'black_mass_recovery_corridor',
  },
  {
    id: 'mc_cathode',
    kind: 'cathode_recycling_loop',
    label: 'Cathode recycling loop hub',
    recoveryMwEq: 44,
    mineralsReliefFactor: 0.15,
    batterySynergyFactor: 0.12,
    projectTypeHint: 'cathode_recycling_loop_hub',
  },
  {
    id: 'mc_rare_earth',
    kind: 'rare_earth_recovery_hub',
    label: 'Rare earth recovery orchestration hub',
    recoveryMwEq: 46,
    mineralsReliefFactor: 0.17,
    batterySynergyFactor: 0.1,
    projectTypeHint: 'rare_earth_recovery_orchestration_hub',
  },
  {
    id: 'mc_scrap',
    kind: 'industrial_scrap_orchestration',
    label: 'Industrial scrap circular orchestration',
    recoveryMwEq: 40,
    mineralsReliefFactor: 0.14,
    batterySynergyFactor: 0.13,
    projectTypeHint: 'industrial_scrap_circular_orchestration',
  },
] as const;

export interface V1014BatterySupplyChainTemplate {
  id: string;
  kind: 'domestic_cathode_precursor' | 'second_life_coupling_hub' | 'export_aligned_battery_supply' | 'electrolyser_minerals_nexus';
  label: string;
  supplyScoreEq: number;
  gridReliefFactor: number;
  mineralsSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_BATTERY_SUPPLY_CHAIN_CATALOG: readonly V1014BatterySupplyChainTemplate[] = [
  {
    id: 'bs_precursor',
    kind: 'domestic_cathode_precursor',
    label: 'Domestic cathode precursor mesh',
    supplyScoreEq: 45,
    gridReliefFactor: 0.15,
    mineralsSynergyFactor: 0.1,
    projectTypeHint: 'domestic_cathode_precursor_mesh',
  },
  {
    id: 'bs_second_life',
    kind: 'second_life_coupling_hub',
    label: 'Second-life coupling supply hub',
    supplyScoreEq: 43,
    gridReliefFactor: 0.14,
    mineralsSynergyFactor: 0.11,
    projectTypeHint: 'second_life_coupling_supply_hub',
  },
  {
    id: 'bs_export',
    kind: 'export_aligned_battery_supply',
    label: 'Export-aligned battery supply corridor',
    supplyScoreEq: 47,
    gridReliefFactor: 0.16,
    mineralsSynergyFactor: 0.12,
    projectTypeHint: 'export_aligned_battery_supply_corridor',
  },
  {
    id: 'bs_electrolyser',
    kind: 'electrolyser_minerals_nexus',
    label: 'Electrolyser-minerals supply nexus',
    supplyScoreEq: 49,
    gridReliefFactor: 0.17,
    mineralsSynergyFactor: 0.13,
    projectTypeHint: 'electrolyser_minerals_supply_nexus',
  },
] as const;

export interface V1014RegionalMineralsCircularRecoveryLedger {
  regionId: string;
  band: V1014MineralsCircularRecoveryBand;
  recoveryIndex: number;
  circularBalance: number;
  mineralsCircularRecoveryRelief: number;
  summary: string;
}

export interface V1014RegionalBatterySupplyChainLedger {
  regionId: string;
  band: V1014BatterySupplyChainBand;
  supplyIndex: number;
  batterySupplyChainRelief: number;
  summary: string;
}

export interface V1014MineralsCircularRecoveryPersistedSlice {
  circularBalance: number;
  recoveryIndex: number;
}

export interface V1014BatterySupplyChainPersistedSlice {
  supplyIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const MINERALS_REGIONS = new Set(['WA', 'QLD', 'NT', 'NSW']);

export function computeRegionalMineralsCircularRecoveryLedger(params: {
  regionId: string;
  mineralsSupplyRelief: number;
  circularRelief: number;
  batteryRecyclingRelief: number;
  secondLifeStorageRelief: number;
  greenHydrogenExportRelief: number;
  extractionScore: number;
  completedProjectTypes: string[];
  prev?: V1014MineralsCircularRecoveryPersistedSlice | null;
}): { ledger: V1014RegionalMineralsCircularRecoveryLedger; next: V1014MineralsCircularRecoveryPersistedSlice } {
  let recoveryGain = 0;
  let mineralsProxy = 0;
  let batterySynergy = 0;
  for (const inst of V1014_MINERALS_CIRCULAR_RECOVERY_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      recoveryGain += inst.recoveryMwEq;
      mineralsProxy += inst.mineralsReliefFactor;
      batterySynergy += inst.batterySynergyFactor;
    }
  }
  if (MINERALS_REGIONS.has(params.regionId)) mineralsProxy += 0.06;
  else mineralsProxy *= 0.74;
  if (params.mineralsSupplyRelief > 2.7) {
    recoveryGain += clamp(params.mineralsSupplyRelief * 0.88, 0, 11);
    mineralsProxy += 0.07;
  }
  if (params.circularRelief > 2.4) batterySynergy += clamp(params.circularRelief * 0.014, 0, 0.07);
  if (params.batteryRecyclingRelief > 2.5) mineralsProxy += clamp(params.batteryRecyclingRelief * 0.01, 0, 0.05);
  if (params.secondLifeStorageRelief > 2.3) recoveryGain += clamp(params.secondLifeStorageRelief * 0.68, 0, 8);
  if (params.greenHydrogenExportRelief > 2.6) batterySynergy += clamp(params.greenHydrogenExportRelief * 0.012, 0, 0.06);
  mineralsProxy += clamp(params.extractionScore / 108, 0, 0.08);

  const prevIdx = params.prev?.recoveryIndex ?? 0;
  const prevBal = params.prev?.circularBalance ?? 0;
  const circularBalance = clamp(prevBal * 0.85 + recoveryGain * 0.1, 0, 220);
  const recoveryIndex = clamp(prevIdx * 0.82 + circularBalance * 0.09 + mineralsProxy * 78 + batterySynergy * 25, 0, 166);

  let band: V1014MineralsCircularRecoveryBand = 'linear_extraction';
  if (recoveryIndex >= 105 || recoveryGain >= 120) band = 'closed_loop_minerals_leader';
  else if (recoveryIndex >= 66 || recoveryGain >= 70) band = 'recovery_corridor';
  else if (recoveryIndex >= 27 || recoveryGain >= 25) band = 'pilot_circularity';

  let mineralsCircularRecoveryRelief = clamp(mineralsProxy * 7.9 + recoveryGain * 0.036 + batterySynergy * 4.9, 0, 10.1);
  if (band === 'linear_extraction') mineralsCircularRecoveryRelief *= 0.28;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      recoveryIndex: clamp(recoveryIndex, 0, 166),
      circularBalance: clamp(circularBalance, 0, 220),
      mineralsCircularRecoveryRelief: clamp(mineralsCircularRecoveryRelief, 0, 10.1),
      summary: `${params.regionId} minerals circular ${band} · idx ${recoveryIndex.toFixed(0)} · relief ${mineralsCircularRecoveryRelief.toFixed(1)}`,
    },
    next: {
      circularBalance: clamp(circularBalance, 0, 220),
      recoveryIndex: clamp(recoveryIndex, 0, 166),
    },
  };
}

export function advanceRegionalBatterySupplyChainOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  recoveryBand: V1014MineralsCircularRecoveryBand;
  electrolyserHubRelief: number;
  completedProjectTypes: string[];
  prev?: V1014BatterySupplyChainPersistedSlice | null;
}): { ledger: V1014RegionalBatterySupplyChainLedger; next: V1014BatterySupplyChainPersistedSlice } {
  let supplyGain = 0;
  let gridReliefProxy = 0;
  let mineralsSynergy = 0;
  for (const tpl of V1014_BATTERY_SUPPLY_CHAIN_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      supplyGain += tpl.supplyScoreEq;
      gridReliefProxy += tpl.gridReliefFactor;
      mineralsSynergy += tpl.mineralsSynergyFactor;
    }
  }
  if (params.recoveryBand === 'recovery_corridor' || params.recoveryBand === 'closed_loop_minerals_leader') {
    supplyGain += 15;
    mineralsSynergy += 0.09;
  }
  if (params.electrolyserHubRelief > 2.7) {
    supplyGain += params.electrolyserHubRelief * 0.73;
    gridReliefProxy += clamp(params.electrolyserHubRelief * 0.007, 0, 0.04);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.24, 0, 9);
  const prevIdx = params.prev?.supplyIndex ?? 0;
  const supplyIndex = clamp(
    prevIdx * 0.83 + supplyGain * 0.1 + gridReliefProxy * 28 - stressLoad * 0.029 + mineralsSynergy * 25,
    0,
    168,
  );

  let band: V1014BatterySupplyChainBand = 'supply_fragile';
  if (supplyIndex >= 108 || supplyGain >= 124) band = 'resilient_supply_mesh';
  else if (supplyIndex >= 69 || supplyGain >= 78) band = 'battery_supply_hub';
  else if (supplyIndex >= 29 || supplyGain >= 27) band = 'pilot_supply_mesh';

  let batterySupplyChainRelief = clamp(supplyIndex / 17.8 + gridReliefProxy * 6.3 + mineralsSynergy * 6.5, 0, 9.9);
  if (band === 'supply_fragile') batterySupplyChainRelief = clamp(batterySupplyChainRelief * 0.26, 0, 2.5);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      supplyIndex: clamp(supplyIndex, 0, 168),
      batterySupplyChainRelief: clamp(batterySupplyChainRelief, 0, 9.9),
      summary: `${params.regionId} battery supply ${band} · idx ${supplyIndex.toFixed(0)} · relief ${batterySupplyChainRelief.toFixed(1)}`,
    },
    next: { supplyIndex: clamp(supplyIndex, 0, 168) },
  };
}

export const V1014_MINERALS_BATTERY_SUPPLY_SCENARIOS = [
  {
    id: 'sc_mb_wa',
    label: 'WA black mass with export-aligned battery supply',
    regionId: 'WA',
    mineralsSupplyRelief: 3.1,
    circularRelief: 2.8,
    batteryRecyclingRelief: 2.9,
    secondLifeStorageRelief: 2.7,
    greenHydrogenExportRelief: 2.8,
    extractionScore: 60,
    gridStressPoints: 15,
    electrolyserHubRelief: 2.9,
    completedProjectTypes: [
      'black_mass_recovery_corridor',
      'rare_earth_recovery_orchestration_hub',
      'export_aligned_battery_supply_corridor',
      'electrolyser_minerals_supply_nexus',
    ],
    expectRecoveryBand: 'recovery_corridor' as V1014MineralsCircularRecoveryBand,
    expectMinRecoveryRelief: 2,
    expectSupplyBand: 'battery_supply_hub' as V1014BatterySupplyChainBand,
    expectMinSupplyRelief: 1.8,
  },
  {
    id: 'sc_mb_nsw',
    label: 'NSW cathode loop with second-life coupling',
    regionId: 'NSW',
    mineralsSupplyRelief: 2.6,
    circularRelief: 2.5,
    batteryRecyclingRelief: 2.6,
    secondLifeStorageRelief: 2.4,
    greenHydrogenExportRelief: 2.2,
    extractionScore: 50,
    gridStressPoints: 14,
    electrolyserHubRelief: 2.4,
    recoveryBand: 'pilot_circularity' as V1014MineralsCircularRecoveryBand,
    completedProjectTypes: ['cathode_recycling_loop_hub', 'second_life_coupling_supply_hub'],
    expectSupplyBand: 'pilot_supply_mesh' as V1014BatterySupplyChainBand,
    expectMinSupplyRelief: 1.4,
  },
] as const;

export function runAgent13MineralsBatterySupplyScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_MINERALS_CIRCULAR_RECOVERY_CATALOG.length >= 4);
  ok(V1014_BATTERY_SUPPLY_CHAIN_CATALOG.length >= 4);

  const sc0 = V1014_MINERALS_BATTERY_SUPPLY_SCENARIOS[0];
  const recovery = computeRegionalMineralsCircularRecoveryLedger({
    regionId: sc0.regionId,
    mineralsSupplyRelief: sc0.mineralsSupplyRelief,
    circularRelief: sc0.circularRelief,
    batteryRecyclingRelief: sc0.batteryRecyclingRelief,
    secondLifeStorageRelief: sc0.secondLifeStorageRelief,
    greenHydrogenExportRelief: sc0.greenHydrogenExportRelief,
    extractionScore: sc0.extractionScore,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    recovery.ledger.band === sc0.expectRecoveryBand ||
      recovery.ledger.band === 'closed_loop_minerals_leader' ||
      recovery.ledger.mineralsCircularRecoveryRelief >= sc0.expectMinRecoveryRelief,
  );

  const supply = advanceRegionalBatterySupplyChainOrchestration({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    recoveryBand: recovery.ledger.band,
    electrolyserHubRelief: sc0.electrolyserHubRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    supply.ledger.band === sc0.expectSupplyBand ||
      supply.ledger.band === 'resilient_supply_mesh' ||
      supply.ledger.batterySupplyChainRelief >= sc0.expectMinSupplyRelief,
  );

  const sc1 = V1014_MINERALS_BATTERY_SUPPLY_SCENARIOS[1];
  const supplyN = advanceRegionalBatterySupplyChainOrchestration({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    recoveryBand: sc1.recoveryBand,
    electrolyserHubRelief: sc1.electrolyserHubRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(supplyN.ledger.batterySupplyChainRelief >= sc1.expectMinSupplyRelief || supplyN.ledger.band !== 'supply_fragile');

  const persistA = computeRegionalMineralsCircularRecoveryLedger({
    regionId: 'QLD',
    mineralsSupplyRelief: 2.5,
    circularRelief: 2.3,
    batteryRecyclingRelief: 2.4,
    secondLifeStorageRelief: 2.2,
    greenHydrogenExportRelief: 2.3,
    extractionScore: 48,
    completedProjectTypes: ['industrial_scrap_circular_orchestration'],
    prev: null,
  });
  const persistB = computeRegionalMineralsCircularRecoveryLedger({
    regionId: 'QLD',
    mineralsSupplyRelief: 2.5,
    circularRelief: 2.3,
    batteryRecyclingRelief: 2.4,
    secondLifeStorageRelief: 2.2,
    greenHydrogenExportRelief: 2.3,
    extractionScore: 48,
    completedProjectTypes: ['industrial_scrap_circular_orchestration'],
    prev: persistA.next,
  });
  ok(persistB.next.recoveryIndex >= persistA.next.recoveryIndex * 0.7);

  const turnSc = runAgent13MineralsBatterySupplyTurnScenario(V1014_MINERALS_BATTERY_SUPPLY_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastRecoveryRelief >= 2);

  const gi = scoreAgent13MineralsBatterySupplyGIAlignment({
    actionText: 'Black mass recovery with export-aligned battery supply and electrolyser minerals nexus',
    recoveryBand: 'recovery_corridor',
    supplyBand: 'battery_supply_hub',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13MineralsBatterySupplyTurnStep {
  turn: number;
  regionId: string;
  mineralsSupplyRelief: number;
  circularRelief: number;
  batteryRecyclingRelief: number;
  secondLifeStorageRelief: number;
  greenHydrogenExportRelief: number;
  extractionScore: number;
  gridStressPoints: number;
  electrolyserHubRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13MineralsBatterySupplyTurnScenario {
  id: string;
  label: string;
  steps: Agent13MineralsBatterySupplyTurnStep[];
  expect: {
    minRecoveryReliefOnLast?: number;
    minSupplyReliefOnLast?: number;
    lastRecoveryBand?: V1014MineralsCircularRecoveryBand;
  };
}

export const V1014_MINERALS_BATTERY_SUPPLY_TURN_SCENARIOS: readonly Agent13MineralsBatterySupplyTurnScenario[] = [
  {
    id: 'sc_mb_wa_escalation',
    label: 'WA closed-loop minerals with resilient supply mesh',
    steps: [
      {
        turn: 1,
        regionId: 'WA',
        mineralsSupplyRelief: 2.4,
        circularRelief: 2.2,
        batteryRecyclingRelief: 2.3,
        secondLifeStorageRelief: 2.1,
        greenHydrogenExportRelief: 2.2,
        extractionScore: 46,
        gridStressPoints: 16,
        electrolyserHubRelief: 2.3,
        completedProjectTypes: ['black_mass_recovery_corridor', 'domestic_cathode_precursor_mesh'],
      },
      {
        turn: 2,
        regionId: 'WA',
        mineralsSupplyRelief: 2.7,
        circularRelief: 2.5,
        batteryRecyclingRelief: 2.6,
        secondLifeStorageRelief: 2.4,
        greenHydrogenExportRelief: 2.5,
        extractionScore: 52,
        gridStressPoints: 15,
        electrolyserHubRelief: 2.6,
        completedProjectTypes: ['cathode_recycling_loop_hub', 'second_life_coupling_supply_hub'],
      },
      {
        turn: 3,
        regionId: 'WA',
        mineralsSupplyRelief: 3.1,
        circularRelief: 2.9,
        batteryRecyclingRelief: 3,
        secondLifeStorageRelief: 2.8,
        greenHydrogenExportRelief: 2.9,
        extractionScore: 60,
        gridStressPoints: 13,
        electrolyserHubRelief: 3,
        completedProjectTypes: [
          'black_mass_recovery_corridor',
          'cathode_recycling_loop_hub',
          'rare_earth_recovery_orchestration_hub',
          'industrial_scrap_circular_orchestration',
          'domestic_cathode_precursor_mesh',
          'second_life_coupling_supply_hub',
          'export_aligned_battery_supply_corridor',
          'electrolyser_minerals_supply_nexus',
        ],
      },
    ],
    expect: { minRecoveryReliefOnLast: 2, minSupplyReliefOnLast: 1.8, lastRecoveryBand: 'recovery_corridor' },
  },
] as const;

export function runAgent13MineralsBatterySupplyTurnScenario(
  scenario: Agent13MineralsBatterySupplyTurnScenario,
): { passed: boolean; detail: string; lastRecoveryRelief: number; lastSupplyRelief: number } {
  let recoveryMem: V1014MineralsCircularRecoveryPersistedSlice | null = null;
  let supplyMem: V1014BatterySupplyChainPersistedSlice | null = null;
  let lastRecoveryRelief = 0;
  let lastSupplyRelief = 0;
  let lastBand: V1014MineralsCircularRecoveryBand = 'linear_extraction';

  for (const step of scenario.steps) {
    const recovery = computeRegionalMineralsCircularRecoveryLedger({
      regionId: step.regionId,
      mineralsSupplyRelief: step.mineralsSupplyRelief,
      circularRelief: step.circularRelief,
      batteryRecyclingRelief: step.batteryRecyclingRelief,
      secondLifeStorageRelief: step.secondLifeStorageRelief,
      greenHydrogenExportRelief: step.greenHydrogenExportRelief,
      extractionScore: step.extractionScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: recoveryMem,
    });
    recoveryMem = recovery.next;
    lastRecoveryRelief = recovery.ledger.mineralsCircularRecoveryRelief;
    lastBand = recovery.ledger.band;

    const supply = advanceRegionalBatterySupplyChainOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      recoveryBand: recovery.ledger.band,
      electrolyserHubRelief: step.electrolyserHubRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: supplyMem,
    });
    supplyMem = supply.next;
    lastSupplyRelief = supply.ledger.batterySupplyChainRelief;
  }

  if (scenario.expect.minRecoveryReliefOnLast != null && lastRecoveryRelief < scenario.expect.minRecoveryReliefOnLast) {
    return {
      passed: false,
      detail: `recovery relief ${lastRecoveryRelief} < ${scenario.expect.minRecoveryReliefOnLast}`,
      lastRecoveryRelief,
      lastSupplyRelief,
    };
  }
  if (scenario.expect.minSupplyReliefOnLast != null && lastSupplyRelief < scenario.expect.minSupplyReliefOnLast) {
    return {
      passed: false,
      detail: `supply relief ${lastSupplyRelief} < ${scenario.expect.minSupplyReliefOnLast}`,
      lastRecoveryRelief,
      lastSupplyRelief,
    };
  }
  if (scenario.expect.lastRecoveryBand != null) {
    const allowed: V1014MineralsCircularRecoveryBand[] = [scenario.expect.lastRecoveryBand];
    if (scenario.expect.lastRecoveryBand === 'recovery_corridor') allowed.push('closed_loop_minerals_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastRecoveryRelief, lastSupplyRelief };
    }
  }

  return { passed: true, detail: 'ok', lastRecoveryRelief, lastSupplyRelief };
}

export function scoreAgent13MineralsBatterySupplyGIAlignment(params: {
  actionText: string;
  recoveryBand?: string;
  supplyBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'black mass recovery',
    'cathode recycling',
    'rare earth recovery',
    'battery supply',
    'second-life coupling',
    'electrolyser minerals',
    'circular orchestration',
    'critical minerals',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.22, 0, 2);
  if (params.recoveryBand === 'closed_loop_minerals_leader' || params.recoveryBand === 'recovery_corridor') {
    delta += hits.some(h => h.includes('recovery') || h.includes('circular') || h.includes('black mass')) ? 0.36 : 0.1;
  }
  if (params.supplyBand === 'battery_supply_hub' || params.supplyBand === 'resilient_supply_mesh') {
    delta += hits.some(h => h.includes('battery') || h.includes('supply') || h.includes('cathode')) ? 0.33 : 0.09;
  }
  if (params.supplyBand === 'supply_fragile' && hits.some(h => h.includes('battery'))) delta -= 0.1;
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Minerals battery supply GI: ${hits.slice(0, 2).join(', ')} aligns with circular recovery and supply mesh depth.`
        : null,
  };
}
