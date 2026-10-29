/**
 * Agent 13 scale wave round 39 (O10-209) — compound circular product stewardship & industrial symbiosis federation orchestration depth.
 */

export type V1014CircularStewardshipBand =
  | 'linear_take_make'
  | 'pilot_stewardship'
  | 'stewardship_corridor'
  | 'federated_circular_stewardship_leader';

export type V1014SymbiosisFederationBand =
  | 'siloed_byproduct'
  | 'pilot_symbiosis_federation'
  | 'symbiosis_federation_hub'
  | 'deep_symbiosis_process_mesh';

export interface V1014CircularStewardshipInstrument {
  id: string;
  kind: 'extended_producer_responsibility_hub' | 'product_stewardship_corridor' | 'circularity_metrics_mesh' | 'federation_stewardship_tie';
  label: string;
  stewardshipScoreEq: number;
  stewardshipReliefFactor: number;
  symbiosisSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_CIRCULAR_STEWARDSHIP_CATALOG: readonly V1014CircularStewardshipInstrument[] = [
  {
    id: 'cs_epr',
    kind: 'extended_producer_responsibility_hub',
    label: 'Extended producer responsibility hub',
    stewardshipScoreEq: 45,
    stewardshipReliefFactor: 0.16,
    symbiosisSynergyFactor: 0.11,
    projectTypeHint: 'extended_producer_responsibility_hub',
  },
  {
    id: 'cs_prod',
    kind: 'product_stewardship_corridor',
    label: 'Product stewardship corridor',
    stewardshipScoreEq: 43,
    stewardshipReliefFactor: 0.15,
    symbiosisSynergyFactor: 0.12,
    projectTypeHint: 'product_stewardship_corridor',
  },
  {
    id: 'cs_metrics',
    kind: 'circularity_metrics_mesh',
    label: 'Circularity metrics federation mesh',
    stewardshipScoreEq: 47,
    stewardshipReliefFactor: 0.17,
    symbiosisSynergyFactor: 0.1,
    projectTypeHint: 'circularity_metrics_federation_mesh',
  },
  {
    id: 'cs_fed',
    kind: 'federation_stewardship_tie',
    label: 'Federation circular stewardship tie',
    stewardshipScoreEq: 49,
    stewardshipReliefFactor: 0.16,
    symbiosisSynergyFactor: 0.13,
    projectTypeHint: 'federation_circular_stewardship_tie',
  },
] as const;

export interface V1014SymbiosisFederationTemplate {
  id: string;
  kind: 'byproduct_federation_mesh' | 'shared_utility_federation_hub' | 'waste_heat_symbiosis_stack' | 'feedstock_orchestration_corridor';
  label: string;
  symbiosisScoreEq: number;
  symbiosisReliefFactor: number;
  stewardshipSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_SYMBIOSIS_FEDERATION_CATALOG: readonly V1014SymbiosisFederationTemplate[] = [
  {
    id: 'sf_byproduct',
    kind: 'byproduct_federation_mesh',
    label: 'Byproduct federation mesh',
    symbiosisScoreEq: 46,
    symbiosisReliefFactor: 0.15,
    stewardshipSynergyFactor: 0.1,
    projectTypeHint: 'byproduct_federation_symbiosis_mesh',
  },
  {
    id: 'sf_utility',
    kind: 'shared_utility_federation_hub',
    label: 'Shared-utility federation hub',
    symbiosisScoreEq: 44,
    symbiosisReliefFactor: 0.14,
    stewardshipSynergyFactor: 0.11,
    projectTypeHint: 'shared_utility_federation_hub',
  },
  {
    id: 'sf_heat',
    kind: 'waste_heat_symbiosis_stack',
    label: 'Waste-heat symbiosis stacking layer',
    symbiosisScoreEq: 48,
    symbiosisReliefFactor: 0.16,
    stewardshipSynergyFactor: 0.12,
    projectTypeHint: 'waste_heat_symbiosis_federation_stack',
  },
  {
    id: 'sf_feed',
    kind: 'feedstock_orchestration_corridor',
    label: 'Circular feedstock orchestration corridor',
    symbiosisScoreEq: 50,
    symbiosisReliefFactor: 0.17,
    stewardshipSynergyFactor: 0.13,
    projectTypeHint: 'circular_feedstock_federation_corridor',
  },
] as const;

export interface V1014RegionalCircularStewardshipLedger {
  regionId: string;
  band: V1014CircularStewardshipBand;
  stewardshipIndex: number;
  stewardshipBalance: number;
  circularStewardshipRelief: number;
  summary: string;
}

export interface V1014RegionalSymbiosisFederationLedger {
  regionId: string;
  band: V1014SymbiosisFederationBand;
  symbiosisIndex: number;
  symbiosisFederationRelief: number;
  summary: string;
}

export interface V1014CircularStewardshipPersistedSlice {
  stewardshipBalance: number;
  stewardshipIndex: number;
}

export interface V1014SymbiosisFederationPersistedSlice {
  symbiosisIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const STEWARDSHIP_HUB_REGIONS = new Set(['NSW', 'VIC', 'QLD', 'WA', 'SA']);

export function computeRegionalCircularStewardshipLedger(params: {
  regionId: string;
  maritimeShorePowerRelief: number;
  exportHydrogenCorridorRelief: number;
  greenProductPassportRelief: number;
  mineralsCircularRecoveryRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014CircularStewardshipPersistedSlice | null;
}): { ledger: V1014RegionalCircularStewardshipLedger; next: V1014CircularStewardshipPersistedSlice } {
  let stewardshipGain = 0;
  let stewardshipProxy = 0;
  let symbiosisSynergy = 0;
  for (const inst of V1014_CIRCULAR_STEWARDSHIP_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      stewardshipGain += inst.stewardshipScoreEq;
      stewardshipProxy += inst.stewardshipReliefFactor;
      symbiosisSynergy += inst.symbiosisSynergyFactor;
    }
  }
  if (STEWARDSHIP_HUB_REGIONS.has(params.regionId)) stewardshipProxy += 0.06;
  else stewardshipProxy *= 0.72;
  if (params.maritimeShorePowerRelief > 2.4) stewardshipGain += clamp(params.maritimeShorePowerRelief * 0.66, 0, 8);
  if (params.exportHydrogenCorridorRelief > 2.5) symbiosisSynergy += clamp(params.exportHydrogenCorridorRelief * 0.01, 0, 0.06);
  if (params.greenProductPassportRelief > 2.4) stewardshipProxy += clamp(params.greenProductPassportRelief * 0.008, 0, 0.05);
  if (params.mineralsCircularRecoveryRelief > 2.5) stewardshipGain += clamp(params.mineralsCircularRecoveryRelief * 0.58, 0, 7);
  stewardshipProxy += clamp(params.renewableShareScore / 105, 0, 0.09);

  const prevIdx = params.prev?.stewardshipIndex ?? 0;
  const prevBal = params.prev?.stewardshipBalance ?? 0;
  const stewardshipBalance = clamp(prevBal * 0.84 + stewardshipGain * 0.1, 0, 250);
  const stewardshipIndex = clamp(
    prevIdx * 0.81 + stewardshipBalance * 0.09 + stewardshipProxy * 74 + symbiosisSynergy * 21,
    0,
    191,
  );

  let band: V1014CircularStewardshipBand = 'linear_take_make';
  if (stewardshipIndex >= 121 || stewardshipGain >= 140) band = 'federated_circular_stewardship_leader';
  else if (stewardshipIndex >= 81 || stewardshipGain >= 94) band = 'stewardship_corridor';
  else if (stewardshipIndex >= 38 || stewardshipGain >= 36) band = 'pilot_stewardship';

  let circularStewardshipRelief = clamp(stewardshipProxy * 7.6 + stewardshipGain * 0.025 + symbiosisSynergy * 4.4, 0, 9.8);
  if (band === 'linear_take_make') circularStewardshipRelief *= 0.19;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      stewardshipIndex: clamp(stewardshipIndex, 0, 191),
      stewardshipBalance: clamp(stewardshipBalance, 0, 250),
      circularStewardshipRelief: clamp(circularStewardshipRelief, 0, 9.8),
      summary: `${params.regionId} stewardship ${band} · idx ${stewardshipIndex.toFixed(0)} · relief ${circularStewardshipRelief.toFixed(1)}`,
    },
    next: {
      stewardshipBalance: clamp(stewardshipBalance, 0, 250),
      stewardshipIndex: clamp(stewardshipIndex, 0, 191),
    },
  };
}

export function advanceRegionalSymbiosisFederationOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  stewardshipBand: V1014CircularStewardshipBand;
  industrialSymbiosisRelief: number;
  wasteHeatRecoveryRelief: number;
  completedProjectTypes: string[];
  prev?: V1014SymbiosisFederationPersistedSlice | null;
}): { ledger: V1014RegionalSymbiosisFederationLedger; next: V1014SymbiosisFederationPersistedSlice } {
  let symbiosisGain = 0;
  let symbiosisProxy = 0;
  let stewardshipSynergy = 0;
  for (const tpl of V1014_SYMBIOSIS_FEDERATION_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      symbiosisGain += tpl.symbiosisScoreEq;
      symbiosisProxy += tpl.symbiosisReliefFactor;
      stewardshipSynergy += tpl.stewardshipSynergyFactor;
    }
  }
  if (params.completedProjectTypes.includes('industrial_park_symbiosis_hub')) {
    symbiosisGain += 10;
    symbiosisProxy += 0.04;
  }
  if (params.stewardshipBand === 'stewardship_corridor' || params.stewardshipBand === 'federated_circular_stewardship_leader') {
    symbiosisGain += 16;
    stewardshipSynergy += 0.1;
  }
  if (params.industrialSymbiosisRelief > 2.4) {
    symbiosisGain += params.industrialSymbiosisRelief * 0.62;
    symbiosisProxy += clamp(params.industrialSymbiosisRelief * 0.007, 0, 0.04);
  }
  if (params.wasteHeatRecoveryRelief > 2.3) stewardshipSynergy += clamp(params.wasteHeatRecoveryRelief * 0.008, 0, 0.04);

  const stressLoad = clamp(params.gridStressPoints * 0.16, 0, 7);
  const prevIdx = params.prev?.symbiosisIndex ?? 0;
  const symbiosisIndex = clamp(
    prevIdx * 0.82 + symbiosisGain * 0.1 + symbiosisProxy * 24 - stressLoad * 0.02 + stewardshipSynergy * 21,
    0,
    193,
  );

  let band: V1014SymbiosisFederationBand = 'siloed_byproduct';
  if (symbiosisIndex >= 124 || symbiosisGain >= 146) band = 'deep_symbiosis_process_mesh';
  else if (symbiosisIndex >= 84 || symbiosisGain >= 100) band = 'symbiosis_federation_hub';
  else if (symbiosisIndex >= 39 || symbiosisGain >= 37) band = 'pilot_symbiosis_federation';

  let symbiosisFederationRelief = clamp(symbiosisIndex / 18.4 + symbiosisProxy * 5.9 + stewardshipSynergy * 6.1, 0, 9.5);
  if (band === 'siloed_byproduct') symbiosisFederationRelief = clamp(symbiosisFederationRelief * 0.17, 0, 1.8);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      symbiosisIndex: clamp(symbiosisIndex, 0, 193),
      symbiosisFederationRelief: clamp(symbiosisFederationRelief, 0, 9.5),
      summary: `${params.regionId} symbiosis fed ${band} · idx ${symbiosisIndex.toFixed(0)} · relief ${symbiosisFederationRelief.toFixed(1)}`,
    },
    next: { symbiosisIndex: clamp(symbiosisIndex, 0, 193) },
  };
}

export function runAgent13StewardshipSymbiosisScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_CIRCULAR_STEWARDSHIP_CATALOG.length >= 4);
  ok(V1014_SYMBIOSIS_FEDERATION_CATALOG.length >= 4);

  const stew = computeRegionalCircularStewardshipLedger({
    regionId: 'VIC',
    maritimeShorePowerRelief: 2.6,
    exportHydrogenCorridorRelief: 2.5,
    greenProductPassportRelief: 2.4,
    mineralsCircularRecoveryRelief: 2.5,
    renewableShareScore: 52,
    completedProjectTypes: ['extended_producer_responsibility_hub', 'federation_circular_stewardship_tie'],
  });
  ok(stew.ledger.circularStewardshipRelief >= 1.4 || stew.ledger.band !== 'linear_take_make');

  const sym = advanceRegionalSymbiosisFederationOrchestration({
    regionId: 'VIC',
    gridStressPoints: 14,
    stewardshipBand: stew.ledger.band,
    industrialSymbiosisRelief: 2.5,
    wasteHeatRecoveryRelief: 2.4,
    completedProjectTypes: ['byproduct_federation_symbiosis_mesh', 'waste_heat_symbiosis_federation_stack'],
  });
  ok(sym.ledger.symbiosisFederationRelief >= 1.2 || sym.ledger.band !== 'siloed_byproduct');

  const turnSc = runAgent13StewardshipSymbiosisTurnScenario(V1014_STEWARDSHIP_SYMBIOSIS_TURN_SCENARIOS[0]);
  ok(turnSc.passed);

  const gi = scoreAgent13StewardshipSymbiosisGIAlignment({
    actionText: 'Extended producer responsibility hub with byproduct federation symbiosis mesh and waste-heat symbiosis stack',
    stewardshipBand: 'stewardship_corridor',
    symbiosisBand: 'symbiosis_federation_hub',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13StewardshipSymbiosisTurnStep {
  turn: number;
  regionId: string;
  maritimeShorePowerRelief: number;
  exportHydrogenCorridorRelief: number;
  greenProductPassportRelief: number;
  mineralsCircularRecoveryRelief: number;
  industrialSymbiosisRelief: number;
  wasteHeatRecoveryRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  completedProjectTypes: string[];
}

export interface Agent13StewardshipSymbiosisTurnScenario {
  id: string;
  label: string;
  steps: Agent13StewardshipSymbiosisTurnStep[];
  expect: { minStewardshipReliefOnLast?: number; minSymbiosisReliefOnLast?: number };
}

export const V1014_STEWARDSHIP_SYMBIOSIS_TURN_SCENARIOS: readonly Agent13StewardshipSymbiosisTurnScenario[] = [
  {
    id: 'sc_ss_vic_escalation',
    label: 'VIC federated stewardship with symbiosis mesh',
    steps: [
      {
        turn: 1,
        regionId: 'VIC',
        maritimeShorePowerRelief: 1.9,
        exportHydrogenCorridorRelief: 1.8,
        greenProductPassportRelief: 1.9,
        mineralsCircularRecoveryRelief: 1.9,
        industrialSymbiosisRelief: 1.9,
        wasteHeatRecoveryRelief: 1.8,
        renewableShareScore: 42,
        gridStressPoints: 16,
        completedProjectTypes: ['extended_producer_responsibility_hub', 'byproduct_federation_symbiosis_mesh'],
      },
      {
        turn: 2,
        regionId: 'VIC',
        maritimeShorePowerRelief: 2.3,
        exportHydrogenCorridorRelief: 2.2,
        greenProductPassportRelief: 2.2,
        mineralsCircularRecoveryRelief: 2.2,
        industrialSymbiosisRelief: 2.2,
        wasteHeatRecoveryRelief: 2.1,
        renewableShareScore: 48,
        gridStressPoints: 15,
        completedProjectTypes: ['product_stewardship_corridor', 'shared_utility_federation_hub'],
      },
      {
        turn: 3,
        regionId: 'VIC',
        maritimeShorePowerRelief: 2.7,
        exportHydrogenCorridorRelief: 2.6,
        greenProductPassportRelief: 2.5,
        mineralsCircularRecoveryRelief: 2.5,
        industrialSymbiosisRelief: 2.5,
        wasteHeatRecoveryRelief: 2.4,
        renewableShareScore: 54,
        gridStressPoints: 13,
        completedProjectTypes: [
          'extended_producer_responsibility_hub',
          'product_stewardship_corridor',
          'circularity_metrics_federation_mesh',
          'federation_circular_stewardship_tie',
          'byproduct_federation_symbiosis_mesh',
          'shared_utility_federation_hub',
          'waste_heat_symbiosis_federation_stack',
          'circular_feedstock_federation_corridor',
          'industrial_park_symbiosis_hub',
        ],
      },
    ],
    expect: { minStewardshipReliefOnLast: 1.4, minSymbiosisReliefOnLast: 1.1 },
  },
] as const;

export function runAgent13StewardshipSymbiosisTurnScenario(
  scenario: Agent13StewardshipSymbiosisTurnScenario,
): { passed: boolean; detail: string; lastStewardshipRelief: number; lastSymbiosisRelief: number } {
  let stewMem: V1014CircularStewardshipPersistedSlice | null = null;
  let symMem: V1014SymbiosisFederationPersistedSlice | null = null;
  let lastStewardshipRelief = 0;
  let lastSymbiosisRelief = 0;

  for (const step of scenario.steps) {
    const stew = computeRegionalCircularStewardshipLedger({
      regionId: step.regionId,
      maritimeShorePowerRelief: step.maritimeShorePowerRelief,
      exportHydrogenCorridorRelief: step.exportHydrogenCorridorRelief,
      greenProductPassportRelief: step.greenProductPassportRelief,
      mineralsCircularRecoveryRelief: step.mineralsCircularRecoveryRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: stewMem,
    });
    stewMem = stew.next;
    lastStewardshipRelief = stew.ledger.circularStewardshipRelief;

    const sym = advanceRegionalSymbiosisFederationOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      stewardshipBand: stew.ledger.band,
      industrialSymbiosisRelief: step.industrialSymbiosisRelief,
      wasteHeatRecoveryRelief: step.wasteHeatRecoveryRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: symMem,
    });
    symMem = sym.next;
    lastSymbiosisRelief = sym.ledger.symbiosisFederationRelief;
  }

  if (scenario.expect.minStewardshipReliefOnLast != null && lastStewardshipRelief < scenario.expect.minStewardshipReliefOnLast) {
    return { passed: false, detail: `stew ${lastStewardshipRelief}`, lastStewardshipRelief, lastSymbiosisRelief };
  }
  if (scenario.expect.minSymbiosisReliefOnLast != null && lastSymbiosisRelief < scenario.expect.minSymbiosisReliefOnLast) {
    return { passed: false, detail: `sym ${lastSymbiosisRelief}`, lastStewardshipRelief, lastSymbiosisRelief };
  }
  return { passed: true, detail: 'ok', lastStewardshipRelief, lastSymbiosisRelief };
}

export function scoreAgent13StewardshipSymbiosisGIAlignment(params: {
  actionText: string;
  stewardshipBand?: string;
  symbiosisBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'producer responsibility',
    'product stewardship',
    'circularity',
    'symbiosis',
    'byproduct',
    'waste-heat',
    'waste heat',
    'feedstock',
    'industrial park symbiosis',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.15, 0, 2);
  if (params.stewardshipBand === 'federated_circular_stewardship_leader' || params.stewardshipBand === 'stewardship_corridor') {
    delta += hits.some(h => h.includes('stewardship') || h.includes('circularity') || h.includes('producer')) ? 0.32 : 0.08;
  }
  if (params.symbiosisBand === 'symbiosis_federation_hub' || params.symbiosisBand === 'deep_symbiosis_process_mesh') {
    delta += hits.some(h => h.includes('symbiosis') || h.includes('byproduct') || h.includes('heat')) ? 0.3 : 0.08;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason: delta > 0.25 ? `Stewardship symbiosis GI: ${hits.slice(0, 2).join(', ')} aligns with circular stewardship and symbiosis federation depth.` : null,
  };
}
