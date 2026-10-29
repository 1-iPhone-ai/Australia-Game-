/**
 * Agent 13 scale wave round 32 (O10-195) — compound net-zero pathway & export carbon intensity federation orchestration depth.
 * Cross-turn persistence for net-zero pathway corridors and export carbon intensity relief coupled to decarbon federation,
 * relief arbitration, emissions credits, and climate transition momentum.
 */

export type V1014NetZeroPathwayBand =
  | 'baseline_intensity'
  | 'pilot_pathway'
  | 'pathway_corridor'
  | 'net_zero_pathway_leader';

export type V1014ExportCarbonIntensityBand =
  | 'carbon_exposed_export'
  | 'pilot_intensity_reduction'
  | 'export_intensity_hub'
  | 'low_carbon_export_mesh';

export interface V1014NetZeroPathwayInstrument {
  id: string;
  kind: 'scope12_pathway_orchestration' | 'industrial_abatement_stack' | 'renewable_matched_pathway' | 'federation_pathway_tie';
  label: string;
  pathwayMwEq: number;
  abatementReliefFactor: number;
  exportIntensitySynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_NET_ZERO_PATHWAY_CATALOG: readonly V1014NetZeroPathwayInstrument[] = [
  {
    id: 'nz_scope12',
    kind: 'scope12_pathway_orchestration',
    label: 'Scope 1-2 pathway orchestration hub',
    pathwayMwEq: 46,
    abatementReliefFactor: 0.17,
    exportIntensitySynergyFactor: 0.11,
    projectTypeHint: 'scope12_pathway_orchestration_hub',
  },
  {
    id: 'nz_abate',
    kind: 'industrial_abatement_stack',
    label: 'Industrial abatement stacking corridor',
    pathwayMwEq: 44,
    abatementReliefFactor: 0.16,
    exportIntensitySynergyFactor: 0.12,
    projectTypeHint: 'industrial_abatement_stacking_corridor',
  },
  {
    id: 'nz_renew',
    kind: 'renewable_matched_pathway',
    label: 'Renewable-matched net-zero pathway',
    pathwayMwEq: 48,
    abatementReliefFactor: 0.18,
    exportIntensitySynergyFactor: 0.1,
    projectTypeHint: 'renewable_matched_net_zero_pathway',
  },
  {
    id: 'nz_fed',
    kind: 'federation_pathway_tie',
    label: 'Federation net-zero pathway tie',
    pathwayMwEq: 50,
    abatementReliefFactor: 0.16,
    exportIntensitySynergyFactor: 0.13,
    projectTypeHint: 'federation_net_zero_pathway_tie',
  },
] as const;

export interface V1014ExportCarbonIntensityTemplate {
  id: string;
  kind: 'export_embodied_carbon_hub' | 'cbam_alignment_corridor' | 'low_carbon_certificate_stack' | 'trade_exposed_abatement_mesh';
  label: string;
  intensityScoreEq: number;
  emissionsReliefFactor: number;
  pathwaySynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_EXPORT_CARBON_INTENSITY_CATALOG: readonly V1014ExportCarbonIntensityTemplate[] = [
  {
    id: 'ec_embodied',
    kind: 'export_embodied_carbon_hub',
    label: 'Export embodied carbon accounting hub',
    intensityScoreEq: 45,
    emissionsReliefFactor: 0.15,
    pathwaySynergyFactor: 0.1,
    projectTypeHint: 'export_embodied_carbon_accounting_hub',
  },
  {
    id: 'ec_cbam',
    kind: 'cbam_alignment_corridor',
    label: 'CBAM alignment export corridor',
    intensityScoreEq: 47,
    emissionsReliefFactor: 0.16,
    pathwaySynergyFactor: 0.11,
    projectTypeHint: 'cbam_alignment_export_corridor',
  },
  {
    id: 'ec_cert',
    kind: 'low_carbon_certificate_stack',
    label: 'Low-carbon certificate stacking layer',
    intensityScoreEq: 43,
    emissionsReliefFactor: 0.14,
    pathwaySynergyFactor: 0.12,
    projectTypeHint: 'low_carbon_certificate_stacking_layer',
  },
  {
    id: 'ec_trade',
    kind: 'trade_exposed_abatement_mesh',
    label: 'Trade-exposed abatement mesh',
    intensityScoreEq: 49,
    emissionsReliefFactor: 0.17,
    pathwaySynergyFactor: 0.13,
    projectTypeHint: 'trade_exposed_abatement_mesh',
  },
] as const;

export interface V1014RegionalNetZeroPathwayLedger {
  regionId: string;
  band: V1014NetZeroPathwayBand;
  pathwayIndex: number;
  abatementBalance: number;
  netZeroPathwayRelief: number;
  summary: string;
}

export interface V1014RegionalExportCarbonIntensityLedger {
  regionId: string;
  band: V1014ExportCarbonIntensityBand;
  intensityIndex: number;
  exportCarbonIntensityRelief: number;
  summary: string;
}

export interface V1014NetZeroPathwayPersistedSlice {
  abatementBalance: number;
  pathwayIndex: number;
}

export interface V1014ExportCarbonIntensityPersistedSlice {
  intensityIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const PATHWAY_REGIONS = new Set(['NSW', 'QLD', 'VIC', 'WA', 'SA']);

export function computeRegionalNetZeroPathwayLedger(params: {
  regionId: string;
  decarbonFederationRelief: number;
  reliefArbitrationRelief: number;
  emissionsCreditRelief: number;
  ccsEmissionsRelief: number;
  renewableShareScore: number;
  climateTransitionMomentum: number;
  completedProjectTypes: string[];
  prev?: V1014NetZeroPathwayPersistedSlice | null;
}): { ledger: V1014RegionalNetZeroPathwayLedger; next: V1014NetZeroPathwayPersistedSlice } {
  let pathwayGain = 0;
  let abatementProxy = 0;
  let exportSynergy = 0;
  for (const inst of V1014_NET_ZERO_PATHWAY_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      pathwayGain += inst.pathwayMwEq;
      abatementProxy += inst.abatementReliefFactor;
      exportSynergy += inst.exportIntensitySynergyFactor;
    }
  }
  if (PATHWAY_REGIONS.has(params.regionId)) abatementProxy += 0.06;
  else abatementProxy *= 0.72;
  if (params.decarbonFederationRelief > 2.8) {
    pathwayGain += clamp(params.decarbonFederationRelief * 0.82, 0, 10);
    abatementProxy += 0.07;
  }
  if (params.reliefArbitrationRelief > 2.6) exportSynergy += clamp(params.reliefArbitrationRelief * 0.011, 0, 0.06);
  if (params.emissionsCreditRelief > 2.5) abatementProxy += clamp(params.emissionsCreditRelief * 0.009, 0, 0.05);
  if (params.ccsEmissionsRelief > 2.4) pathwayGain += clamp(params.ccsEmissionsRelief * 0.7, 0, 8);
  abatementProxy += clamp(params.climateTransitionMomentum * 0.04, 0, 0.08);
  abatementProxy += clamp(params.renewableShareScore / 106, 0, 0.09);

  const prevIdx = params.prev?.pathwayIndex ?? 0;
  const prevBal = params.prev?.abatementBalance ?? 0;
  const abatementBalance = clamp(prevBal * 0.84 + pathwayGain * 0.1, 0, 235);
  const pathwayIndex = clamp(prevIdx * 0.81 + abatementBalance * 0.09 + abatementProxy * 82 + exportSynergy * 28, 0, 180);

  let band: V1014NetZeroPathwayBand = 'baseline_intensity';
  if (pathwayIndex >= 114 || pathwayGain >= 130) band = 'net_zero_pathway_leader';
  else if (pathwayIndex >= 74 || pathwayGain >= 80) band = 'pathway_corridor';
  else if (pathwayIndex >= 31 || pathwayGain >= 29) band = 'pilot_pathway';

  let netZeroPathwayRelief = clamp(abatementProxy * 8.4 + pathwayGain * 0.032 + exportSynergy * 5.2, 0, 10.6);
  if (band === 'baseline_intensity') netZeroPathwayRelief *= 0.25;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      pathwayIndex: clamp(pathwayIndex, 0, 180),
      abatementBalance: clamp(abatementBalance, 0, 235),
      netZeroPathwayRelief: clamp(netZeroPathwayRelief, 0, 10.6),
      summary: `${params.regionId} net-zero ${band} · idx ${pathwayIndex.toFixed(0)} · relief ${netZeroPathwayRelief.toFixed(1)}`,
    },
    next: {
      abatementBalance: clamp(abatementBalance, 0, 235),
      pathwayIndex: clamp(pathwayIndex, 0, 180),
    },
  };
}

export function advanceRegionalExportCarbonIntensityOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  pathwayBand: V1014NetZeroPathwayBand;
  greenHydrogenExportRelief: number;
  completedProjectTypes: string[];
  prev?: V1014ExportCarbonIntensityPersistedSlice | null;
}): { ledger: V1014RegionalExportCarbonIntensityLedger; next: V1014ExportCarbonIntensityPersistedSlice } {
  let intensityGain = 0;
  let emissionsReliefProxy = 0;
  let pathwaySynergy = 0;
  for (const tpl of V1014_EXPORT_CARBON_INTENSITY_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      intensityGain += tpl.intensityScoreEq;
      emissionsReliefProxy += tpl.emissionsReliefFactor;
      pathwaySynergy += tpl.pathwaySynergyFactor;
    }
  }
  if (params.pathwayBand === 'pathway_corridor' || params.pathwayBand === 'net_zero_pathway_leader') {
    intensityGain += 18;
    pathwaySynergy += 0.1;
  }
  if (params.greenHydrogenExportRelief > 2.8) {
    intensityGain += params.greenHydrogenExportRelief * 0.75;
    emissionsReliefProxy += clamp(params.greenHydrogenExportRelief * 0.007, 0, 0.04);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.23, 0, 9);
  const prevIdx = params.prev?.intensityIndex ?? 0;
  const intensityIndex = clamp(
    prevIdx * 0.82 + intensityGain * 0.1 + emissionsReliefProxy * 31 - stressLoad * 0.027 + pathwaySynergy * 28,
    0,
    182,
  );

  let band: V1014ExportCarbonIntensityBand = 'carbon_exposed_export';
  if (intensityIndex >= 116 || intensityGain >= 132) band = 'low_carbon_export_mesh';
  else if (intensityIndex >= 76 || intensityGain >= 86) band = 'export_intensity_hub';
  else if (intensityIndex >= 32 || intensityGain >= 30) band = 'pilot_intensity_reduction';

  let exportCarbonIntensityRelief = clamp(intensityIndex / 16.8 + emissionsReliefProxy * 6.7 + pathwaySynergy * 7, 0, 10.2);
  if (band === 'carbon_exposed_export') exportCarbonIntensityRelief = clamp(exportCarbonIntensityRelief * 0.24, 0, 2.5);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      intensityIndex: clamp(intensityIndex, 0, 182),
      exportCarbonIntensityRelief: clamp(exportCarbonIntensityRelief, 0, 10.2),
      summary: `${params.regionId} export CI ${band} · idx ${intensityIndex.toFixed(0)} · relief ${exportCarbonIntensityRelief.toFixed(1)}`,
    },
    next: { intensityIndex: clamp(intensityIndex, 0, 182) },
  };
}

export const V1014_PATHWAY_EXPORT_CI_SCENARIOS = [
  {
    id: 'sc_pe_qld',
    label: 'QLD scope12 pathway with CBAM corridor',
    regionId: 'QLD',
    decarbonFederationRelief: 3,
    reliefArbitrationRelief: 2.8,
    emissionsCreditRelief: 2.9,
    ccsEmissionsRelief: 2.6,
    renewableShareScore: 55,
    climateTransitionMomentum: 0.42,
    gridStressPoints: 15,
    greenHydrogenExportRelief: 2.9,
    completedProjectTypes: [
      'scope12_pathway_orchestration_hub',
      'federation_net_zero_pathway_tie',
      'cbam_alignment_export_corridor',
      'trade_exposed_abatement_mesh',
    ],
    expectPathwayBand: 'pathway_corridor' as V1014NetZeroPathwayBand,
    expectMinPathwayRelief: 2,
    expectIntensityBand: 'export_intensity_hub' as V1014ExportCarbonIntensityBand,
    expectMinIntensityRelief: 1.8,
  },
  {
    id: 'sc_pe_sa',
    label: 'SA abatement stack with certificate layer',
    regionId: 'SA',
    decarbonFederationRelief: 2.6,
    reliefArbitrationRelief: 2.5,
    emissionsCreditRelief: 2.5,
    ccsEmissionsRelief: 2.4,
    renewableShareScore: 50,
    climateTransitionMomentum: 0.35,
    gridStressPoints: 14,
    greenHydrogenExportRelief: 2.5,
    pathwayBand: 'pilot_pathway' as V1014NetZeroPathwayBand,
    completedProjectTypes: ['industrial_abatement_stacking_corridor', 'low_carbon_certificate_stacking_layer'],
    expectIntensityBand: 'pilot_intensity_reduction' as V1014ExportCarbonIntensityBand,
    expectMinIntensityRelief: 1.4,
  },
] as const;

export function runAgent13PathwayExportCiScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_NET_ZERO_PATHWAY_CATALOG.length >= 4);
  ok(V1014_EXPORT_CARBON_INTENSITY_CATALOG.length >= 4);

  const sc0 = V1014_PATHWAY_EXPORT_CI_SCENARIOS[0];
  const pathway = computeRegionalNetZeroPathwayLedger({
    regionId: sc0.regionId,
    decarbonFederationRelief: sc0.decarbonFederationRelief,
    reliefArbitrationRelief: sc0.reliefArbitrationRelief,
    emissionsCreditRelief: sc0.emissionsCreditRelief,
    ccsEmissionsRelief: sc0.ccsEmissionsRelief,
    renewableShareScore: sc0.renewableShareScore,
    climateTransitionMomentum: sc0.climateTransitionMomentum,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    pathway.ledger.band === sc0.expectPathwayBand ||
      pathway.ledger.band === 'net_zero_pathway_leader' ||
      pathway.ledger.netZeroPathwayRelief >= sc0.expectMinPathwayRelief,
  );

  const intensity = advanceRegionalExportCarbonIntensityOrchestration({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    pathwayBand: pathway.ledger.band,
    greenHydrogenExportRelief: sc0.greenHydrogenExportRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    intensity.ledger.band === sc0.expectIntensityBand ||
      intensity.ledger.band === 'low_carbon_export_mesh' ||
      intensity.ledger.exportCarbonIntensityRelief >= sc0.expectMinIntensityRelief,
  );

  const sc1 = V1014_PATHWAY_EXPORT_CI_SCENARIOS[1];
  const intensityS = advanceRegionalExportCarbonIntensityOrchestration({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    pathwayBand: sc1.pathwayBand,
    greenHydrogenExportRelief: sc1.greenHydrogenExportRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(
    intensityS.ledger.exportCarbonIntensityRelief >= sc1.expectMinIntensityRelief ||
      intensityS.ledger.band !== 'carbon_exposed_export',
  );

  const persistA = computeRegionalNetZeroPathwayLedger({
    regionId: 'VIC',
    decarbonFederationRelief: 2.4,
    reliefArbitrationRelief: 2.3,
    emissionsCreditRelief: 2.4,
    ccsEmissionsRelief: 2.2,
    renewableShareScore: 46,
    climateTransitionMomentum: 0.3,
    completedProjectTypes: ['renewable_matched_net_zero_pathway'],
    prev: null,
  });
  const persistB = computeRegionalNetZeroPathwayLedger({
    regionId: 'VIC',
    decarbonFederationRelief: 2.4,
    reliefArbitrationRelief: 2.3,
    emissionsCreditRelief: 2.4,
    ccsEmissionsRelief: 2.2,
    renewableShareScore: 46,
    climateTransitionMomentum: 0.3,
    completedProjectTypes: ['renewable_matched_net_zero_pathway'],
    prev: persistA.next,
  });
  ok(persistB.next.pathwayIndex >= persistA.next.pathwayIndex * 0.7);

  const turnSc = runAgent13PathwayExportCiTurnScenario(V1014_PATHWAY_EXPORT_CI_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastPathwayRelief >= 2);

  const gi = scoreAgent13PathwayExportCiGIAlignment({
    actionText: 'Scope 1-2 pathway with CBAM alignment export corridor and trade-exposed abatement mesh',
    pathwayBand: 'pathway_corridor',
    intensityBand: 'export_intensity_hub',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13PathwayExportCiTurnStep {
  turn: number;
  regionId: string;
  decarbonFederationRelief: number;
  reliefArbitrationRelief: number;
  emissionsCreditRelief: number;
  ccsEmissionsRelief: number;
  renewableShareScore: number;
  climateTransitionMomentum: number;
  gridStressPoints: number;
  greenHydrogenExportRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13PathwayExportCiTurnScenario {
  id: string;
  label: string;
  steps: Agent13PathwayExportCiTurnStep[];
  expect: {
    minPathwayReliefOnLast?: number;
    minIntensityReliefOnLast?: number;
    lastPathwayBand?: V1014NetZeroPathwayBand;
  };
}

export const V1014_PATHWAY_EXPORT_CI_TURN_SCENARIOS: readonly Agent13PathwayExportCiTurnScenario[] = [
  {
    id: 'sc_pe_qld_escalation',
    label: 'QLD net-zero leader with low-carbon export mesh',
    steps: [
      {
        turn: 1,
        regionId: 'QLD',
        decarbonFederationRelief: 2.3,
        reliefArbitrationRelief: 2.2,
        emissionsCreditRelief: 2.3,
        ccsEmissionsRelief: 2.1,
        renewableShareScore: 44,
        climateTransitionMomentum: 0.28,
        gridStressPoints: 16,
        greenHydrogenExportRelief: 2.3,
        completedProjectTypes: ['scope12_pathway_orchestration_hub', 'export_embodied_carbon_accounting_hub'],
      },
      {
        turn: 2,
        regionId: 'QLD',
        decarbonFederationRelief: 2.7,
        reliefArbitrationRelief: 2.5,
        emissionsCreditRelief: 2.6,
        ccsEmissionsRelief: 2.4,
        renewableShareScore: 50,
        climateTransitionMomentum: 0.35,
        gridStressPoints: 15,
        greenHydrogenExportRelief: 2.6,
        completedProjectTypes: ['industrial_abatement_stacking_corridor', 'cbam_alignment_export_corridor'],
      },
      {
        turn: 3,
        regionId: 'QLD',
        decarbonFederationRelief: 3.1,
        reliefArbitrationRelief: 2.9,
        emissionsCreditRelief: 3,
        ccsEmissionsRelief: 2.7,
        renewableShareScore: 56,
        climateTransitionMomentum: 0.44,
        gridStressPoints: 13,
        greenHydrogenExportRelief: 3,
        completedProjectTypes: [
          'scope12_pathway_orchestration_hub',
          'industrial_abatement_stacking_corridor',
          'renewable_matched_net_zero_pathway',
          'federation_net_zero_pathway_tie',
          'export_embodied_carbon_accounting_hub',
          'cbam_alignment_export_corridor',
          'low_carbon_certificate_stacking_layer',
          'trade_exposed_abatement_mesh',
        ],
      },
    ],
    expect: { minPathwayReliefOnLast: 2, minIntensityReliefOnLast: 1.8, lastPathwayBand: 'pathway_corridor' },
  },
] as const;

export function runAgent13PathwayExportCiTurnScenario(
  scenario: Agent13PathwayExportCiTurnScenario,
): { passed: boolean; detail: string; lastPathwayRelief: number; lastIntensityRelief: number } {
  let pathwayMem: V1014NetZeroPathwayPersistedSlice | null = null;
  let intensityMem: V1014ExportCarbonIntensityPersistedSlice | null = null;
  let lastPathwayRelief = 0;
  let lastIntensityRelief = 0;
  let lastBand: V1014NetZeroPathwayBand = 'baseline_intensity';

  for (const step of scenario.steps) {
    const pathway = computeRegionalNetZeroPathwayLedger({
      regionId: step.regionId,
      decarbonFederationRelief: step.decarbonFederationRelief,
      reliefArbitrationRelief: step.reliefArbitrationRelief,
      emissionsCreditRelief: step.emissionsCreditRelief,
      ccsEmissionsRelief: step.ccsEmissionsRelief,
      renewableShareScore: step.renewableShareScore,
      climateTransitionMomentum: step.climateTransitionMomentum,
      completedProjectTypes: step.completedProjectTypes,
      prev: pathwayMem,
    });
    pathwayMem = pathway.next;
    lastPathwayRelief = pathway.ledger.netZeroPathwayRelief;
    lastBand = pathway.ledger.band;

    const intensity = advanceRegionalExportCarbonIntensityOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      pathwayBand: pathway.ledger.band,
      greenHydrogenExportRelief: step.greenHydrogenExportRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: intensityMem,
    });
    intensityMem = intensity.next;
    lastIntensityRelief = intensity.ledger.exportCarbonIntensityRelief;
  }

  if (scenario.expect.minPathwayReliefOnLast != null && lastPathwayRelief < scenario.expect.minPathwayReliefOnLast) {
    return {
      passed: false,
      detail: `pathway relief ${lastPathwayRelief} < ${scenario.expect.minPathwayReliefOnLast}`,
      lastPathwayRelief,
      lastIntensityRelief,
    };
  }
  if (scenario.expect.minIntensityReliefOnLast != null && lastIntensityRelief < scenario.expect.minIntensityReliefOnLast) {
    return {
      passed: false,
      detail: `intensity relief ${lastIntensityRelief} < ${scenario.expect.minIntensityReliefOnLast}`,
      lastPathwayRelief,
      lastIntensityRelief,
    };
  }
  if (scenario.expect.lastPathwayBand != null) {
    const allowed: V1014NetZeroPathwayBand[] = [scenario.expect.lastPathwayBand];
    if (scenario.expect.lastPathwayBand === 'pathway_corridor') allowed.push('net_zero_pathway_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastPathwayRelief, lastIntensityRelief };
    }
  }

  return { passed: true, detail: 'ok', lastPathwayRelief, lastIntensityRelief };
}

export function scoreAgent13PathwayExportCiGIAlignment(params: {
  actionText: string;
  pathwayBand?: string;
  intensityBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'net-zero pathway',
    'scope 1-2',
    'scope12',
    'cbam alignment',
    'export carbon',
    'embodied carbon',
    'low-carbon certificate',
    'trade-exposed abatement',
    'industrial abatement',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.2, 0, 2);
  if (params.pathwayBand === 'net_zero_pathway_leader' || params.pathwayBand === 'pathway_corridor') {
    delta += hits.some(h => h.includes('pathway') || h.includes('abatement') || h.includes('net-zero')) ? 0.38 : 0.1;
  }
  if (params.intensityBand === 'export_intensity_hub' || params.intensityBand === 'low_carbon_export_mesh') {
    delta += hits.some(h => h.includes('export') || h.includes('cbam') || h.includes('carbon')) ? 0.35 : 0.09;
  }
  if (params.intensityBand === 'carbon_exposed_export' && hits.some(h => h.includes('export'))) delta -= 0.1;
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Pathway export CI GI: ${hits.slice(0, 2).join(', ')} aligns with net-zero pathway and export intensity depth.`
        : null,
  };
}
