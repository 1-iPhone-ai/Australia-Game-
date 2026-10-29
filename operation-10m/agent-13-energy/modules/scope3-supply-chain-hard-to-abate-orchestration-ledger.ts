/**
 * Agent 13 scale wave round 33 (O10-197) — compound scope-3 supply chain & hard-to-abate sector federation orchestration depth.
 * Cross-turn persistence for upstream supply-chain coverage and hard-to-abate abatement mesh coupled to net-zero pathway,
 * export carbon intensity, decarbon federation, and relief arbitration across the scale-wave stack.
 */

export type V1014Scope3SupplyChainBand =
  | 'opaque_upstream'
  | 'pilot_scope3_coverage'
  | 'supply_chain_corridor'
  | 'federated_scope3_leader';

export type V1014HardToAbateSectorBand =
  | 'unmitigated_process'
  | 'pilot_hard_to_abate'
  | 'hard_to_abate_hub'
  | 'deep_abatement_process_mesh';

export interface V1014Scope3SupplyChainInstrument {
  id: string;
  kind: 'upstream_emissions_hub' | 'supplier_engagement_corridor' | 'embodied_carbon_trace_mesh' | 'federation_scope3_tie';
  label: string;
  chainCoverageEq: number;
  scope3ReliefFactor: number;
  hardToAbateSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_SCOPE3_SUPPLY_CHAIN_CATALOG: readonly V1014Scope3SupplyChainInstrument[] = [
  {
    id: 's3_hub',
    kind: 'upstream_emissions_hub',
    label: 'Upstream scope-3 emissions accounting hub',
    chainCoverageEq: 45,
    scope3ReliefFactor: 0.16,
    hardToAbateSynergyFactor: 0.11,
    projectTypeHint: 'upstream_scope3_emissions_accounting_hub',
  },
  {
    id: 's3_supplier',
    kind: 'supplier_engagement_corridor',
    label: 'Supplier engagement decarbon corridor',
    chainCoverageEq: 43,
    scope3ReliefFactor: 0.15,
    hardToAbateSynergyFactor: 0.12,
    projectTypeHint: 'supplier_engagement_decarbon_corridor',
  },
  {
    id: 's3_trace',
    kind: 'embodied_carbon_trace_mesh',
    label: 'Embodied carbon traceability mesh',
    chainCoverageEq: 47,
    scope3ReliefFactor: 0.17,
    hardToAbateSynergyFactor: 0.1,
    projectTypeHint: 'embodied_carbon_traceability_mesh',
  },
  {
    id: 's3_fed',
    kind: 'federation_scope3_tie',
    label: 'Federation scope-3 coverage tie',
    chainCoverageEq: 49,
    scope3ReliefFactor: 0.16,
    hardToAbateSynergyFactor: 0.13,
    projectTypeHint: 'federation_scope3_coverage_tie',
  },
] as const;

export interface V1014HardToAbateSectorTemplate {
  id: string;
  kind: 'cement_clinker_abatement' | 'steel_dri_electrification' | 'alumina_process_heat_mesh' | 'saf_hard_to_abate_corridor';
  label: string;
  abatementScoreEq: number;
  processReliefFactor: number;
  scope3SynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_HARD_TO_ABATE_SECTOR_CATALOG: readonly V1014HardToAbateSectorTemplate[] = [
  {
    id: 'hta_cement',
    kind: 'cement_clinker_abatement',
    label: 'Cement clinker abatement corridor',
    abatementScoreEq: 46,
    processReliefFactor: 0.15,
    scope3SynergyFactor: 0.1,
    projectTypeHint: 'cement_clinker_abatement_corridor',
  },
  {
    id: 'hta_steel',
    kind: 'steel_dri_electrification',
    label: 'Steel DRI electrification hub',
    abatementScoreEq: 48,
    processReliefFactor: 0.16,
    scope3SynergyFactor: 0.11,
    projectTypeHint: 'steel_dri_electrification_hub',
  },
  {
    id: 'hta_alumina',
    kind: 'alumina_process_heat_mesh',
    label: 'Alumina process-heat abatement mesh',
    abatementScoreEq: 44,
    processReliefFactor: 0.14,
    scope3SynergyFactor: 0.12,
    projectTypeHint: 'alumina_process_heat_abatement_mesh',
  },
  {
    id: 'hta_saf',
    kind: 'saf_hard_to_abate_corridor',
    label: 'SAF hard-to-abate aviation corridor',
    abatementScoreEq: 50,
    processReliefFactor: 0.17,
    scope3SynergyFactor: 0.13,
    projectTypeHint: 'saf_hard_to_abate_aviation_corridor',
  },
] as const;

export interface V1014RegionalScope3SupplyChainLedger {
  regionId: string;
  band: V1014Scope3SupplyChainBand;
  chainIndex: number;
  coverageBalance: number;
  scope3SupplyChainRelief: number;
  summary: string;
}

export interface V1014RegionalHardToAbateLedger {
  regionId: string;
  band: V1014HardToAbateSectorBand;
  abatementIndex: number;
  hardToAbateRelief: number;
  summary: string;
}

export interface V1014Scope3SupplyChainPersistedSlice {
  coverageBalance: number;
  chainIndex: number;
}

export interface V1014HardToAbatePersistedSlice {
  abatementIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const SCOPE3_HUB_REGIONS = new Set(['NSW', 'QLD', 'VIC', 'WA', 'SA']);

export function computeRegionalScope3SupplyChainLedger(params: {
  regionId: string;
  netZeroPathwayRelief: number;
  exportCarbonIntensityRelief: number;
  pathwayBand: string;
  intensityBand: string;
  decarbonFederationRelief: number;
  reliefArbitrationRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014Scope3SupplyChainPersistedSlice | null;
}): { ledger: V1014RegionalScope3SupplyChainLedger; next: V1014Scope3SupplyChainPersistedSlice } {
  let chainGain = 0;
  let scope3Proxy = 0;
  let hardToAbateSynergy = 0;
  for (const inst of V1014_SCOPE3_SUPPLY_CHAIN_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      chainGain += inst.chainCoverageEq;
      scope3Proxy += inst.scope3ReliefFactor;
      hardToAbateSynergy += inst.hardToAbateSynergyFactor;
    }
  }
  if (SCOPE3_HUB_REGIONS.has(params.regionId)) scope3Proxy += 0.06;
  else scope3Proxy *= 0.72;
  if (params.netZeroPathwayRelief > 2.7) {
    chainGain += clamp(params.netZeroPathwayRelief * 0.78, 0, 10);
    scope3Proxy += 0.06;
  }
  if (params.exportCarbonIntensityRelief > 2.6) hardToAbateSynergy += clamp(params.exportCarbonIntensityRelief * 0.01, 0, 0.06);
  if (params.pathwayBand === 'pathway_corridor' || params.pathwayBand === 'net_zero_pathway_leader') {
    chainGain += 14;
    scope3Proxy += 0.05;
  }
  if (params.intensityBand === 'export_intensity_hub' || params.intensityBand === 'low_carbon_export_mesh') {
    hardToAbateSynergy += 0.08;
  }
  if (params.decarbonFederationRelief > 2.8) scope3Proxy += clamp(params.decarbonFederationRelief * 0.008, 0, 0.05);
  if (params.reliefArbitrationRelief > 2.5) chainGain += clamp(params.reliefArbitrationRelief * 0.65, 0, 7);
  scope3Proxy += clamp(params.renewableShareScore / 107, 0, 0.09);

  const prevIdx = params.prev?.chainIndex ?? 0;
  const prevBal = params.prev?.coverageBalance ?? 0;
  const coverageBalance = clamp(prevBal * 0.84 + chainGain * 0.1, 0, 238);
  const chainIndex = clamp(
    prevIdx * 0.81 + coverageBalance * 0.09 + scope3Proxy * 80 + hardToAbateSynergy * 27,
    0,
    184,
  );

  let band: V1014Scope3SupplyChainBand = 'opaque_upstream';
  if (chainIndex >= 115 || chainGain >= 128) band = 'federated_scope3_leader';
  else if (chainIndex >= 75 || chainGain >= 82) band = 'supply_chain_corridor';
  else if (chainIndex >= 32 || chainGain >= 30) band = 'pilot_scope3_coverage';

  let scope3SupplyChainRelief = clamp(scope3Proxy * 8.2 + chainGain * 0.031 + hardToAbateSynergy * 5, 0, 10.4);
  if (band === 'opaque_upstream') scope3SupplyChainRelief *= 0.25;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      chainIndex: clamp(chainIndex, 0, 184),
      coverageBalance: clamp(coverageBalance, 0, 238),
      scope3SupplyChainRelief: clamp(scope3SupplyChainRelief, 0, 10.4),
      summary: `${params.regionId} scope-3 ${band} · idx ${chainIndex.toFixed(0)} · relief ${scope3SupplyChainRelief.toFixed(1)}`,
    },
    next: {
      coverageBalance: clamp(coverageBalance, 0, 238),
      chainIndex: clamp(chainIndex, 0, 184),
    },
  };
}

export function advanceRegionalHardToAbateOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  scope3Band: V1014Scope3SupplyChainBand;
  greenHydrogenExportRelief: number;
  industrialSymbiosisRelief: number;
  completedProjectTypes: string[];
  prev?: V1014HardToAbatePersistedSlice | null;
}): { ledger: V1014RegionalHardToAbateLedger; next: V1014HardToAbatePersistedSlice } {
  let abatementGain = 0;
  let processReliefProxy = 0;
  let scope3Synergy = 0;
  for (const tpl of V1014_HARD_TO_ABATE_SECTOR_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      abatementGain += tpl.abatementScoreEq;
      processReliefProxy += tpl.processReliefFactor;
      scope3Synergy += tpl.scope3SynergyFactor;
    }
  }
  if (params.scope3Band === 'supply_chain_corridor' || params.scope3Band === 'federated_scope3_leader') {
    abatementGain += 17;
    scope3Synergy += 0.1;
  }
  if (params.greenHydrogenExportRelief > 2.7) {
    abatementGain += params.greenHydrogenExportRelief * 0.72;
    processReliefProxy += clamp(params.greenHydrogenExportRelief * 0.007, 0, 0.04);
  }
  if (params.industrialSymbiosisRelief > 2.5) {
    processReliefProxy += clamp(params.industrialSymbiosisRelief * 0.008, 0, 0.04);
    scope3Synergy += 0.05;
  }

  const stressLoad = clamp(params.gridStressPoints * 0.22, 0, 8.5);
  const prevIdx = params.prev?.abatementIndex ?? 0;
  const abatementIndex = clamp(
    prevIdx * 0.82 + abatementGain * 0.1 + processReliefProxy * 30 - stressLoad * 0.026 + scope3Synergy * 27,
    0,
    186,
  );

  let band: V1014HardToAbateSectorBand = 'unmitigated_process';
  if (abatementIndex >= 118 || abatementGain >= 134) band = 'deep_abatement_process_mesh';
  else if (abatementIndex >= 78 || abatementGain >= 88) band = 'hard_to_abate_hub';
  else if (abatementIndex >= 33 || abatementGain >= 31) band = 'pilot_hard_to_abate';

  let hardToAbateRelief = clamp(abatementIndex / 17.2 + processReliefProxy * 6.5 + scope3Synergy * 6.8, 0, 10.1);
  if (band === 'unmitigated_process') hardToAbateRelief = clamp(hardToAbateRelief * 0.23, 0, 2.4);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      abatementIndex: clamp(abatementIndex, 0, 186),
      hardToAbateRelief: clamp(hardToAbateRelief, 0, 10.1),
      summary: `${params.regionId} hard-to-abate ${band} · idx ${abatementIndex.toFixed(0)} · relief ${hardToAbateRelief.toFixed(1)}`,
    },
    next: { abatementIndex: clamp(abatementIndex, 0, 186) },
  };
}

export const V1014_SCOPE3_HARD_TO_ABATE_SCENARIOS = [
  {
    id: 'sc_s3_nsw',
    label: 'NSW upstream hub with steel DRI',
    regionId: 'NSW',
    netZeroPathwayRelief: 3,
    exportCarbonIntensityRelief: 2.9,
    pathwayBand: 'pathway_corridor',
    intensityBand: 'export_intensity_hub',
    decarbonFederationRelief: 2.9,
    reliefArbitrationRelief: 2.7,
    renewableShareScore: 54,
    gridStressPoints: 15,
    greenHydrogenExportRelief: 2.8,
    industrialSymbiosisRelief: 2.6,
    completedProjectTypes: [
      'upstream_scope3_emissions_accounting_hub',
      'federation_scope3_coverage_tie',
      'steel_dri_electrification_hub',
    ],
    expectScope3Band: 'supply_chain_corridor' as V1014Scope3SupplyChainBand,
    expectMinScope3Relief: 2,
    expectHardToAbateBand: 'hard_to_abate_hub' as V1014HardToAbateSectorBand,
    expectMinHardToAbateRelief: 1.7,
  },
  {
    id: 'sc_s3_wa',
    label: 'WA alumina mesh with SAF corridor',
    regionId: 'WA',
    netZeroPathwayRelief: 2.5,
    exportCarbonIntensityRelief: 2.4,
    pathwayBand: 'pilot_pathway',
    intensityBand: 'pilot_intensity_reduction',
    decarbonFederationRelief: 2.4,
    reliefArbitrationRelief: 2.3,
    renewableShareScore: 48,
    gridStressPoints: 14,
    greenHydrogenExportRelief: 2.4,
    industrialSymbiosisRelief: 2.5,
    scope3Band: 'pilot_scope3_coverage' as V1014Scope3SupplyChainBand,
    completedProjectTypes: ['alumina_process_heat_abatement_mesh', 'saf_hard_to_abate_aviation_corridor'],
    expectHardToAbateBand: 'pilot_hard_to_abate' as V1014HardToAbateSectorBand,
    expectMinHardToAbateRelief: 1.3,
  },
] as const;

export function runAgent13Scope3HardToAbateScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_SCOPE3_SUPPLY_CHAIN_CATALOG.length >= 4);
  ok(V1014_HARD_TO_ABATE_SECTOR_CATALOG.length >= 4);

  const sc0 = V1014_SCOPE3_HARD_TO_ABATE_SCENARIOS[0];
  const scope3 = computeRegionalScope3SupplyChainLedger({
    regionId: sc0.regionId,
    netZeroPathwayRelief: sc0.netZeroPathwayRelief,
    exportCarbonIntensityRelief: sc0.exportCarbonIntensityRelief,
    pathwayBand: sc0.pathwayBand,
    intensityBand: sc0.intensityBand,
    decarbonFederationRelief: sc0.decarbonFederationRelief,
    reliefArbitrationRelief: sc0.reliefArbitrationRelief,
    renewableShareScore: sc0.renewableShareScore,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    scope3.ledger.band === sc0.expectScope3Band ||
      scope3.ledger.band === 'federated_scope3_leader' ||
      scope3.ledger.scope3SupplyChainRelief >= sc0.expectMinScope3Relief,
  );

  const hardToAbate = advanceRegionalHardToAbateOrchestration({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    scope3Band: scope3.ledger.band,
    greenHydrogenExportRelief: sc0.greenHydrogenExportRelief,
    industrialSymbiosisRelief: sc0.industrialSymbiosisRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    hardToAbate.ledger.band === sc0.expectHardToAbateBand ||
      hardToAbate.ledger.band === 'deep_abatement_process_mesh' ||
      hardToAbate.ledger.hardToAbateRelief >= sc0.expectMinHardToAbateRelief,
  );

  const sc1 = V1014_SCOPE3_HARD_TO_ABATE_SCENARIOS[1];
  const hardToAbateW = advanceRegionalHardToAbateOrchestration({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    scope3Band: sc1.scope3Band,
    greenHydrogenExportRelief: sc1.greenHydrogenExportRelief,
    industrialSymbiosisRelief: sc1.industrialSymbiosisRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(
    hardToAbateW.ledger.hardToAbateRelief >= sc1.expectMinHardToAbateRelief ||
      hardToAbateW.ledger.band !== 'unmitigated_process',
  );

  const persistA = computeRegionalScope3SupplyChainLedger({
    regionId: 'VIC',
    netZeroPathwayRelief: 2.4,
    exportCarbonIntensityRelief: 2.3,
    pathwayBand: 'pilot_pathway',
    intensityBand: 'pilot_intensity_reduction',
    decarbonFederationRelief: 2.4,
    reliefArbitrationRelief: 2.2,
    renewableShareScore: 47,
    completedProjectTypes: ['supplier_engagement_decarbon_corridor'],
    prev: null,
  });
  const persistB = computeRegionalScope3SupplyChainLedger({
    regionId: 'VIC',
    netZeroPathwayRelief: 2.4,
    exportCarbonIntensityRelief: 2.3,
    pathwayBand: 'pilot_pathway',
    intensityBand: 'pilot_intensity_reduction',
    decarbonFederationRelief: 2.4,
    reliefArbitrationRelief: 2.2,
    renewableShareScore: 47,
    completedProjectTypes: ['supplier_engagement_decarbon_corridor'],
    prev: persistA.next,
  });
  ok(persistB.next.chainIndex >= persistA.next.chainIndex * 0.7);

  const turnSc = runAgent13Scope3HardToAbateTurnScenario(V1014_SCOPE3_HARD_TO_ABATE_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastScope3Relief >= 2);

  const gi = scoreAgent13Scope3HardToAbateGIAlignment({
    actionText: 'Upstream scope-3 emissions hub with steel DRI electrification and cement clinker abatement',
    scope3Band: 'supply_chain_corridor',
    hardToAbateBand: 'hard_to_abate_hub',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13Scope3HardToAbateTurnStep {
  turn: number;
  regionId: string;
  netZeroPathwayRelief: number;
  exportCarbonIntensityRelief: number;
  decarbonFederationRelief: number;
  reliefArbitrationRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  greenHydrogenExportRelief: number;
  industrialSymbiosisRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13Scope3HardToAbateTurnScenario {
  id: string;
  label: string;
  steps: Agent13Scope3HardToAbateTurnStep[];
  expect: {
    minScope3ReliefOnLast?: number;
    minHardToAbateReliefOnLast?: number;
    lastScope3Band?: V1014Scope3SupplyChainBand;
  };
}

export const V1014_SCOPE3_HARD_TO_ABATE_TURN_SCENARIOS: readonly Agent13Scope3HardToAbateTurnScenario[] = [
  {
    id: 'sc_s3_nsw_escalation',
    label: 'NSW federated scope-3 with deep abatement mesh',
    steps: [
      {
        turn: 1,
        regionId: 'NSW',
        netZeroPathwayRelief: 2.2,
        exportCarbonIntensityRelief: 2.1,
        decarbonFederationRelief: 2.2,
        reliefArbitrationRelief: 2.1,
        renewableShareScore: 43,
        gridStressPoints: 16,
        greenHydrogenExportRelief: 2.2,
        industrialSymbiosisRelief: 2.1,
        completedProjectTypes: ['upstream_scope3_emissions_accounting_hub', 'cement_clinker_abatement_corridor'],
      },
      {
        turn: 2,
        regionId: 'NSW',
        netZeroPathwayRelief: 2.6,
        exportCarbonIntensityRelief: 2.5,
        decarbonFederationRelief: 2.5,
        reliefArbitrationRelief: 2.4,
        renewableShareScore: 49,
        gridStressPoints: 15,
        greenHydrogenExportRelief: 2.5,
        industrialSymbiosisRelief: 2.4,
        completedProjectTypes: ['supplier_engagement_decarbon_corridor', 'steel_dri_electrification_hub'],
      },
      {
        turn: 3,
        regionId: 'NSW',
        netZeroPathwayRelief: 3,
        exportCarbonIntensityRelief: 2.9,
        decarbonFederationRelief: 2.9,
        reliefArbitrationRelief: 2.8,
        renewableShareScore: 55,
        gridStressPoints: 13,
        greenHydrogenExportRelief: 2.9,
        industrialSymbiosisRelief: 2.7,
        completedProjectTypes: [
          'upstream_scope3_emissions_accounting_hub',
          'supplier_engagement_decarbon_corridor',
          'embodied_carbon_traceability_mesh',
          'federation_scope3_coverage_tie',
          'cement_clinker_abatement_corridor',
          'steel_dri_electrification_hub',
          'alumina_process_heat_abatement_mesh',
          'saf_hard_to_abate_aviation_corridor',
        ],
      },
    ],
    expect: { minScope3ReliefOnLast: 2, minHardToAbateReliefOnLast: 1.7, lastScope3Band: 'supply_chain_corridor' },
  },
] as const;

export function runAgent13Scope3HardToAbateTurnScenario(
  scenario: Agent13Scope3HardToAbateTurnScenario,
): { passed: boolean; detail: string; lastScope3Relief: number; lastHardToAbateRelief: number } {
  let scope3Mem: V1014Scope3SupplyChainPersistedSlice | null = null;
  let hardToAbateMem: V1014HardToAbatePersistedSlice | null = null;
  let lastScope3Relief = 0;
  let lastHardToAbateRelief = 0;
  let lastBand: V1014Scope3SupplyChainBand = 'opaque_upstream';

  for (const step of scenario.steps) {
    const scope3 = computeRegionalScope3SupplyChainLedger({
      regionId: step.regionId,
      netZeroPathwayRelief: step.netZeroPathwayRelief,
      exportCarbonIntensityRelief: step.exportCarbonIntensityRelief,
      pathwayBand: 'pathway_corridor',
      intensityBand: 'export_intensity_hub',
      decarbonFederationRelief: step.decarbonFederationRelief,
      reliefArbitrationRelief: step.reliefArbitrationRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: scope3Mem,
    });
    scope3Mem = scope3.next;
    lastScope3Relief = scope3.ledger.scope3SupplyChainRelief;
    lastBand = scope3.ledger.band;

    const hardToAbate = advanceRegionalHardToAbateOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      scope3Band: scope3.ledger.band,
      greenHydrogenExportRelief: step.greenHydrogenExportRelief,
      industrialSymbiosisRelief: step.industrialSymbiosisRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: hardToAbateMem,
    });
    hardToAbateMem = hardToAbate.next;
    lastHardToAbateRelief = hardToAbate.ledger.hardToAbateRelief;
  }

  if (scenario.expect.minScope3ReliefOnLast != null && lastScope3Relief < scenario.expect.minScope3ReliefOnLast) {
    return {
      passed: false,
      detail: `scope3 relief ${lastScope3Relief} < ${scenario.expect.minScope3ReliefOnLast}`,
      lastScope3Relief,
      lastHardToAbateRelief,
    };
  }
  if (scenario.expect.minHardToAbateReliefOnLast != null && lastHardToAbateRelief < scenario.expect.minHardToAbateReliefOnLast) {
    return {
      passed: false,
      detail: `hard-to-abate relief ${lastHardToAbateRelief} < ${scenario.expect.minHardToAbateReliefOnLast}`,
      lastScope3Relief,
      lastHardToAbateRelief,
    };
  }
  if (scenario.expect.lastScope3Band != null) {
    const allowed: V1014Scope3SupplyChainBand[] = [scenario.expect.lastScope3Band];
    if (scenario.expect.lastScope3Band === 'supply_chain_corridor') allowed.push('federated_scope3_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastScope3Relief, lastHardToAbateRelief };
    }
  }

  return { passed: true, detail: 'ok', lastScope3Relief, lastHardToAbateRelief };
}

export function scoreAgent13Scope3HardToAbateGIAlignment(params: {
  actionText: string;
  scope3Band?: string;
  hardToAbateBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'scope-3',
    'scope 3',
    'upstream',
    'supply chain',
    'hard-to-abate',
    'hard to abate',
    'steel dri',
    'cement clinker',
    'alumina',
    'saf aviation',
    'embodied carbon trace',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.19, 0, 2);
  if (params.scope3Band === 'federated_scope3_leader' || params.scope3Band === 'supply_chain_corridor') {
    delta += hits.some(h => h.includes('scope') || h.includes('upstream') || h.includes('supply')) ? 0.36 : 0.1;
  }
  if (params.hardToAbateBand === 'hard_to_abate_hub' || params.hardToAbateBand === 'deep_abatement_process_mesh') {
    delta += hits.some(h => h.includes('abate') || h.includes('steel') || h.includes('cement') || h.includes('saf')) ? 0.34 : 0.08;
  }
  if (params.hardToAbateBand === 'unmitigated_process' && hits.some(h => h.includes('abate'))) delta -= 0.1;
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Scope-3 hard-to-abate GI: ${hits.slice(0, 2).join(', ')} aligns with supply-chain and process abatement depth.`
        : null,
  };
}
