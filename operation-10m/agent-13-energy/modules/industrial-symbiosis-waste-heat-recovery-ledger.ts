/**
 * Agent 13 scale wave round 27 (O10-185) — industrial symbiosis & waste-heat recovery mesh orchestration depth.
 * Cross-turn persistence for symbiosis corridors and waste-heat recovery relief coupled to district heat,
 * circular recovery, industrial heat decarbonisation, and climate adaptation maturity.
 */

export type V1014IndustrialSymbiosisBand =
  | 'linear_supply'
  | 'pilot_symbiosis'
  | 'symbiosis_corridor'
  | 'circular_industrial_leader';

export type V1014WasteHeatRecoveryBand =
  | 'heat_dump_legacy'
  | 'pilot_recovery'
  | 'waste_heat_hub'
  | 'deep_recovery_mesh';

export interface V1014IndustrialSymbiosisInstrument {
  id: string;
  kind: 'byproduct_exchange_loop' | 'shared_utility_precinct' | 'industrial_park_symbiosis_hub' | 'circular_feedstock_orchestration';
  label: string;
  symbiosisMwEq: number;
  circularReliefFactor: number;
  heatRecoverySynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_INDUSTRIAL_SYMBIOSIS_CATALOG: readonly V1014IndustrialSymbiosisInstrument[] = [
  {
    id: 'is_byproduct',
    kind: 'byproduct_exchange_loop',
    label: 'Byproduct exchange symbiosis loop',
    symbiosisMwEq: 41,
    circularReliefFactor: 0.16,
    heatRecoverySynergyFactor: 0.11,
    projectTypeHint: 'byproduct_exchange_symbiosis_loop',
  },
  {
    id: 'is_utility',
    kind: 'shared_utility_precinct',
    label: 'Shared utility symbiosis precinct',
    symbiosisMwEq: 43,
    circularReliefFactor: 0.15,
    heatRecoverySynergyFactor: 0.12,
    projectTypeHint: 'shared_utility_symbiosis_precinct',
  },
  {
    id: 'is_park',
    kind: 'industrial_park_symbiosis_hub',
    label: 'Industrial park symbiosis hub',
    symbiosisMwEq: 45,
    circularReliefFactor: 0.17,
    heatRecoverySynergyFactor: 0.1,
    projectTypeHint: 'industrial_park_symbiosis_hub',
  },
  {
    id: 'is_feedstock',
    kind: 'circular_feedstock_orchestration',
    label: 'Circular feedstock orchestration layer',
    symbiosisMwEq: 47,
    circularReliefFactor: 0.16,
    heatRecoverySynergyFactor: 0.13,
    projectTypeHint: 'circular_feedstock_orchestration_layer',
  },
] as const;

export interface V1014WasteHeatRecoveryTemplate {
  id: string;
  kind: 'smelter_waste_heat_network' | 'process_heat_recovery_loop' | 'landfill_heat_coupling_hub' | 'district_heat_export_mesh';
  label: string;
  recoveryScoreEq: number;
  heatReliefFactor: number;
  symbiosisSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_WASTE_HEAT_RECOVERY_CATALOG: readonly V1014WasteHeatRecoveryTemplate[] = [
  {
    id: 'wh_smelter',
    kind: 'smelter_waste_heat_network',
    label: 'Smelter waste heat recovery network',
    recoveryScoreEq: 44,
    heatReliefFactor: 0.15,
    symbiosisSynergyFactor: 0.1,
    projectTypeHint: 'smelter_waste_heat_recovery_network',
  },
  {
    id: 'wh_process',
    kind: 'process_heat_recovery_loop',
    label: 'Process heat recovery loop',
    recoveryScoreEq: 46,
    heatReliefFactor: 0.16,
    symbiosisSynergyFactor: 0.11,
    projectTypeHint: 'process_heat_recovery_loop',
  },
  {
    id: 'wh_landfill',
    kind: 'landfill_heat_coupling_hub',
    label: 'Landfill heat coupling hub',
    recoveryScoreEq: 42,
    heatReliefFactor: 0.14,
    symbiosisSynergyFactor: 0.12,
    projectTypeHint: 'landfill_heat_coupling_hub',
  },
  {
    id: 'wh_district',
    kind: 'district_heat_export_mesh',
    label: 'District heat export recovery mesh',
    recoveryScoreEq: 48,
    heatReliefFactor: 0.17,
    symbiosisSynergyFactor: 0.13,
    projectTypeHint: 'district_heat_export_recovery_mesh',
  },
] as const;

export interface V1014RegionalIndustrialSymbiosisLedger {
  regionId: string;
  band: V1014IndustrialSymbiosisBand;
  symbiosisIndex: number;
  exchangeBalance: number;
  industrialSymbiosisRelief: number;
  summary: string;
}

export interface V1014RegionalWasteHeatRecoveryLedger {
  regionId: string;
  band: V1014WasteHeatRecoveryBand;
  recoveryIndex: number;
  wasteHeatRecoveryRelief: number;
  summary: string;
}

export interface V1014IndustrialSymbiosisPersistedSlice {
  exchangeBalance: number;
  symbiosisIndex: number;
}

export interface V1014WasteHeatRecoveryPersistedSlice {
  recoveryIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const SYMBIOSIS_REGIONS = new Set(['SA', 'WA', 'QLD', 'NSW', 'VIC']);

export function computeRegionalIndustrialSymbiosisLedger(params: {
  regionId: string;
  circularRelief: number;
  districtHeatRelief: number;
  industrialHeatRelief: number;
  climateAdaptationRelief: number;
  extractionScore: number;
  completedProjectTypes: string[];
  prev?: V1014IndustrialSymbiosisPersistedSlice | null;
}): { ledger: V1014RegionalIndustrialSymbiosisLedger; next: V1014IndustrialSymbiosisPersistedSlice } {
  let symbiosisGain = 0;
  let circularProxy = 0;
  let heatSynergy = 0;
  for (const inst of V1014_INDUSTRIAL_SYMBIOSIS_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      symbiosisGain += inst.symbiosisMwEq;
      circularProxy += inst.circularReliefFactor;
      heatSynergy += inst.heatRecoverySynergyFactor;
    }
  }
  if (SYMBIOSIS_REGIONS.has(params.regionId)) circularProxy += 0.05;
  else circularProxy *= 0.76;
  if (params.circularRelief > 2.5) {
    symbiosisGain += clamp(params.circularRelief * 0.86, 0, 10);
    circularProxy += 0.06;
  }
  if (params.districtHeatRelief > 2.4) heatSynergy += clamp(params.districtHeatRelief * 0.014, 0, 0.07);
  if (params.industrialHeatRelief > 2.6) symbiosisGain += clamp(params.industrialHeatRelief * 0.75, 0, 9);
  if (params.climateAdaptationRelief > 2.3) circularProxy += clamp(params.climateAdaptationRelief * 0.01, 0, 0.04);
  circularProxy += clamp(params.extractionScore / 105, 0, 0.08);

  const prevIdx = params.prev?.symbiosisIndex ?? 0;
  const prevBal = params.prev?.exchangeBalance ?? 0;
  const exchangeBalance = clamp(prevBal * 0.85 + symbiosisGain * 0.1, 0, 218);
  const symbiosisIndex = clamp(prevIdx * 0.82 + exchangeBalance * 0.09 + circularProxy * 76 + heatSynergy * 24, 0, 160);

  let band: V1014IndustrialSymbiosisBand = 'linear_supply';
  if (symbiosisIndex >= 101 || symbiosisGain >= 118) band = 'circular_industrial_leader';
  else if (symbiosisIndex >= 63 || symbiosisGain >= 68) band = 'symbiosis_corridor';
  else if (symbiosisIndex >= 26 || symbiosisGain >= 24) band = 'pilot_symbiosis';

  let industrialSymbiosisRelief = clamp(circularProxy * 7.8 + symbiosisGain * 0.036 + heatSynergy * 4.7, 0, 10);
  if (band === 'linear_supply') industrialSymbiosisRelief *= 0.29;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      symbiosisIndex: clamp(symbiosisIndex, 0, 160),
      exchangeBalance: clamp(exchangeBalance, 0, 218),
      industrialSymbiosisRelief: clamp(industrialSymbiosisRelief, 0, 10),
      summary: `${params.regionId} symbiosis ${band} · idx ${symbiosisIndex.toFixed(0)} · relief ${industrialSymbiosisRelief.toFixed(1)}`,
    },
    next: {
      exchangeBalance: clamp(exchangeBalance, 0, 218),
      symbiosisIndex: clamp(symbiosisIndex, 0, 160),
    },
  };
}

export function advanceRegionalWasteHeatRecoveryOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  symbiosisBand: V1014IndustrialSymbiosisBand;
  landfillMethaneRelief: number;
  completedProjectTypes: string[];
  prev?: V1014WasteHeatRecoveryPersistedSlice | null;
}): { ledger: V1014RegionalWasteHeatRecoveryLedger; next: V1014WasteHeatRecoveryPersistedSlice } {
  let recoveryGain = 0;
  let heatReliefProxy = 0;
  let symbiosisSynergy = 0;
  for (const tpl of V1014_WASTE_HEAT_RECOVERY_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      recoveryGain += tpl.recoveryScoreEq;
      heatReliefProxy += tpl.heatReliefFactor;
      symbiosisSynergy += tpl.symbiosisSynergyFactor;
    }
  }
  if (params.symbiosisBand === 'symbiosis_corridor' || params.symbiosisBand === 'circular_industrial_leader') {
    recoveryGain += 14;
    symbiosisSynergy += 0.09;
  }
  if (params.landfillMethaneRelief > 2.4) {
    recoveryGain += params.landfillMethaneRelief * 0.76;
    heatReliefProxy += clamp(params.landfillMethaneRelief * 0.007, 0, 0.04);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.24, 0, 9);
  const prevIdx = params.prev?.recoveryIndex ?? 0;
  const recoveryIndex = clamp(
    prevIdx * 0.83 + recoveryGain * 0.1 + heatReliefProxy * 27 - stressLoad * 0.029 + symbiosisSynergy * 24,
    0,
    166,
  );

  let band: V1014WasteHeatRecoveryBand = 'heat_dump_legacy';
  if (recoveryIndex >= 107 || recoveryGain >= 122) band = 'deep_recovery_mesh';
  else if (recoveryIndex >= 67 || recoveryGain >= 76) band = 'waste_heat_hub';
  else if (recoveryIndex >= 28 || recoveryGain >= 26) band = 'pilot_recovery';

  let wasteHeatRecoveryRelief = clamp(recoveryIndex / 18 + heatReliefProxy * 6.2 + symbiosisSynergy * 6.4, 0, 9.8);
  if (band === 'heat_dump_legacy') wasteHeatRecoveryRelief = clamp(wasteHeatRecoveryRelief * 0.27, 0, 2.5);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      recoveryIndex: clamp(recoveryIndex, 0, 166),
      wasteHeatRecoveryRelief: clamp(wasteHeatRecoveryRelief, 0, 9.8),
      summary: `${params.regionId} waste-heat ${band} · idx ${recoveryIndex.toFixed(0)} · relief ${wasteHeatRecoveryRelief.toFixed(1)}`,
    },
    next: { recoveryIndex: clamp(recoveryIndex, 0, 166) },
  };
}

export const V1014_SYMBIOSIS_WASTE_HEAT_SCENARIOS = [
  {
    id: 'sc_swh_sa',
    label: 'SA industrial park symbiosis with smelter waste heat',
    regionId: 'SA',
    circularRelief: 3,
    districtHeatRelief: 2.8,
    industrialHeatRelief: 3.1,
    climateAdaptationRelief: 2.6,
    extractionScore: 58,
    gridStressPoints: 15,
    landfillMethaneRelief: 2.5,
    completedProjectTypes: [
      'industrial_park_symbiosis_hub',
      'circular_feedstock_orchestration_layer',
      'smelter_waste_heat_recovery_network',
      'district_heat_export_recovery_mesh',
    ],
    expectSymbiosisBand: 'symbiosis_corridor' as V1014IndustrialSymbiosisBand,
    expectMinSymbiosisRelief: 2,
    expectRecoveryBand: 'waste_heat_hub' as V1014WasteHeatRecoveryBand,
    expectMinRecoveryRelief: 1.8,
  },
  {
    id: 'sc_swh_wa',
    label: 'WA byproduct exchange with process heat loop',
    regionId: 'WA',
    circularRelief: 2.6,
    districtHeatRelief: 2.4,
    industrialHeatRelief: 2.7,
    climateAdaptationRelief: 2.3,
    extractionScore: 52,
    gridStressPoints: 14,
    landfillMethaneRelief: 2.2,
    symbiosisBand: 'pilot_symbiosis' as V1014IndustrialSymbiosisBand,
    completedProjectTypes: ['byproduct_exchange_symbiosis_loop', 'process_heat_recovery_loop'],
    expectRecoveryBand: 'pilot_recovery' as V1014WasteHeatRecoveryBand,
    expectMinRecoveryRelief: 1.4,
  },
] as const;

export function runAgent13SymbiosisWasteHeatScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_INDUSTRIAL_SYMBIOSIS_CATALOG.length >= 4);
  ok(V1014_WASTE_HEAT_RECOVERY_CATALOG.length >= 4);

  const sc0 = V1014_SYMBIOSIS_WASTE_HEAT_SCENARIOS[0];
  const symbiosis = computeRegionalIndustrialSymbiosisLedger({
    regionId: sc0.regionId,
    circularRelief: sc0.circularRelief,
    districtHeatRelief: sc0.districtHeatRelief,
    industrialHeatRelief: sc0.industrialHeatRelief,
    climateAdaptationRelief: sc0.climateAdaptationRelief,
    extractionScore: sc0.extractionScore,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    symbiosis.ledger.band === sc0.expectSymbiosisBand ||
      symbiosis.ledger.band === 'circular_industrial_leader' ||
      symbiosis.ledger.industrialSymbiosisRelief >= sc0.expectMinSymbiosisRelief,
  );

  const recovery = advanceRegionalWasteHeatRecoveryOrchestration({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    symbiosisBand: symbiosis.ledger.band,
    landfillMethaneRelief: sc0.landfillMethaneRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    recovery.ledger.band === sc0.expectRecoveryBand ||
      recovery.ledger.band === 'deep_recovery_mesh' ||
      recovery.ledger.wasteHeatRecoveryRelief >= sc0.expectMinRecoveryRelief,
  );

  const sc1 = V1014_SYMBIOSIS_WASTE_HEAT_SCENARIOS[1];
  const recoveryW = advanceRegionalWasteHeatRecoveryOrchestration({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    symbiosisBand: sc1.symbiosisBand,
    landfillMethaneRelief: sc1.landfillMethaneRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(recoveryW.ledger.wasteHeatRecoveryRelief >= sc1.expectMinRecoveryRelief || recoveryW.ledger.band !== 'heat_dump_legacy');

  const persistA = computeRegionalIndustrialSymbiosisLedger({
    regionId: 'NSW',
    circularRelief: 2.4,
    districtHeatRelief: 2.2,
    industrialHeatRelief: 2.5,
    climateAdaptationRelief: 2.1,
    extractionScore: 48,
    completedProjectTypes: ['shared_utility_symbiosis_precinct'],
    prev: null,
  });
  const persistB = computeRegionalIndustrialSymbiosisLedger({
    regionId: 'NSW',
    circularRelief: 2.4,
    districtHeatRelief: 2.2,
    industrialHeatRelief: 2.5,
    climateAdaptationRelief: 2.1,
    extractionScore: 48,
    completedProjectTypes: ['shared_utility_symbiosis_precinct'],
    prev: persistA.next,
  });
  ok(persistB.next.symbiosisIndex >= persistA.next.symbiosisIndex * 0.7);

  const turnSc = runAgent13SymbiosisWasteHeatTurnScenario(V1014_SYMBIOSIS_WASTE_HEAT_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastSymbiosisRelief >= 2);

  const gi = scoreAgent13SymbiosisWasteHeatGIAlignment({
    actionText: 'Industrial park symbiosis hub with smelter waste heat and district heat export mesh',
    symbiosisBand: 'symbiosis_corridor',
    recoveryBand: 'waste_heat_hub',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13SymbiosisWasteHeatTurnStep {
  turn: number;
  regionId: string;
  circularRelief: number;
  districtHeatRelief: number;
  industrialHeatRelief: number;
  climateAdaptationRelief: number;
  extractionScore: number;
  gridStressPoints: number;
  landfillMethaneRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13SymbiosisWasteHeatTurnScenario {
  id: string;
  label: string;
  steps: Agent13SymbiosisWasteHeatTurnStep[];
  expect: {
    minSymbiosisReliefOnLast?: number;
    minRecoveryReliefOnLast?: number;
    lastSymbiosisBand?: V1014IndustrialSymbiosisBand;
  };
}

export const V1014_SYMBIOSIS_WASTE_HEAT_TURN_SCENARIOS: readonly Agent13SymbiosisWasteHeatTurnScenario[] = [
  {
    id: 'sc_swh_sa_escalation',
    label: 'SA symbiosis corridor with deep recovery mesh',
    steps: [
      {
        turn: 1,
        regionId: 'SA',
        circularRelief: 2.4,
        districtHeatRelief: 2.2,
        industrialHeatRelief: 2.5,
        climateAdaptationRelief: 2.2,
        extractionScore: 46,
        gridStressPoints: 16,
        landfillMethaneRelief: 2.2,
        completedProjectTypes: ['byproduct_exchange_symbiosis_loop', 'process_heat_recovery_loop'],
      },
      {
        turn: 2,
        regionId: 'SA',
        circularRelief: 2.7,
        districtHeatRelief: 2.5,
        industrialHeatRelief: 2.8,
        climateAdaptationRelief: 2.5,
        extractionScore: 52,
        gridStressPoints: 15,
        landfillMethaneRelief: 2.4,
        completedProjectTypes: ['shared_utility_symbiosis_precinct', 'landfill_heat_coupling_hub'],
      },
      {
        turn: 3,
        regionId: 'SA',
        circularRelief: 3.1,
        districtHeatRelief: 2.9,
        industrialHeatRelief: 3.2,
        climateAdaptationRelief: 2.8,
        extractionScore: 58,
        gridStressPoints: 13,
        landfillMethaneRelief: 2.7,
        completedProjectTypes: [
          'byproduct_exchange_symbiosis_loop',
          'shared_utility_symbiosis_precinct',
          'industrial_park_symbiosis_hub',
          'circular_feedstock_orchestration_layer',
          'smelter_waste_heat_recovery_network',
          'process_heat_recovery_loop',
          'landfill_heat_coupling_hub',
          'district_heat_export_recovery_mesh',
        ],
      },
    ],
    expect: { minSymbiosisReliefOnLast: 2, minRecoveryReliefOnLast: 1.8, lastSymbiosisBand: 'symbiosis_corridor' },
  },
] as const;

export function runAgent13SymbiosisWasteHeatTurnScenario(
  scenario: Agent13SymbiosisWasteHeatTurnScenario,
): { passed: boolean; detail: string; lastSymbiosisRelief: number; lastRecoveryRelief: number } {
  let symbiosisMem: V1014IndustrialSymbiosisPersistedSlice | null = null;
  let recoveryMem: V1014WasteHeatRecoveryPersistedSlice | null = null;
  let lastSymbiosisRelief = 0;
  let lastRecoveryRelief = 0;
  let lastBand: V1014IndustrialSymbiosisBand = 'linear_supply';

  for (const step of scenario.steps) {
    const symbiosis = computeRegionalIndustrialSymbiosisLedger({
      regionId: step.regionId,
      circularRelief: step.circularRelief,
      districtHeatRelief: step.districtHeatRelief,
      industrialHeatRelief: step.industrialHeatRelief,
      climateAdaptationRelief: step.climateAdaptationRelief,
      extractionScore: step.extractionScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: symbiosisMem,
    });
    symbiosisMem = symbiosis.next;
    lastSymbiosisRelief = symbiosis.ledger.industrialSymbiosisRelief;
    lastBand = symbiosis.ledger.band;

    const recovery = advanceRegionalWasteHeatRecoveryOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      symbiosisBand: symbiosis.ledger.band,
      landfillMethaneRelief: step.landfillMethaneRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: recoveryMem,
    });
    recoveryMem = recovery.next;
    lastRecoveryRelief = recovery.ledger.wasteHeatRecoveryRelief;
  }

  if (scenario.expect.minSymbiosisReliefOnLast != null && lastSymbiosisRelief < scenario.expect.minSymbiosisReliefOnLast) {
    return {
      passed: false,
      detail: `symbiosis relief ${lastSymbiosisRelief} < ${scenario.expect.minSymbiosisReliefOnLast}`,
      lastSymbiosisRelief,
      lastRecoveryRelief,
    };
  }
  if (scenario.expect.minRecoveryReliefOnLast != null && lastRecoveryRelief < scenario.expect.minRecoveryReliefOnLast) {
    return {
      passed: false,
      detail: `recovery relief ${lastRecoveryRelief} < ${scenario.expect.minRecoveryReliefOnLast}`,
      lastSymbiosisRelief,
      lastRecoveryRelief,
    };
  }
  if (scenario.expect.lastSymbiosisBand != null) {
    const allowed: V1014IndustrialSymbiosisBand[] = [scenario.expect.lastSymbiosisBand];
    if (scenario.expect.lastSymbiosisBand === 'symbiosis_corridor') allowed.push('circular_industrial_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastSymbiosisRelief, lastRecoveryRelief };
    }
  }

  return { passed: true, detail: 'ok', lastSymbiosisRelief, lastRecoveryRelief };
}

export function scoreAgent13SymbiosisWasteHeatGIAlignment(params: {
  actionText: string;
  symbiosisBand?: string;
  recoveryBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'industrial symbiosis',
    'waste heat',
    'byproduct exchange',
    'circular feedstock',
    'district heat export',
    'smelter waste heat',
    'process heat recovery',
    'symbiosis hub',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.22, 0, 2);
  if (params.symbiosisBand === 'circular_industrial_leader' || params.symbiosisBand === 'symbiosis_corridor') {
    delta += hits.some(h => h.includes('symbiosis') || h.includes('circular') || h.includes('byproduct')) ? 0.36 : 0.1;
  }
  if (params.recoveryBand === 'waste_heat_hub' || params.recoveryBand === 'deep_recovery_mesh') {
    delta += hits.some(h => h.includes('waste heat') || h.includes('heat recovery') || h.includes('district heat')) ? 0.33 : 0.09;
  }
  if (params.recoveryBand === 'heat_dump_legacy' && hits.some(h => h.includes('waste heat'))) delta -= 0.1;
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Symbiosis waste-heat GI: ${hits.slice(0, 2).join(', ')} aligns with industrial symbiosis and recovery mesh depth.`
        : null,
  };
}
