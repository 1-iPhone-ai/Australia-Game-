/**
 * Agent 13 scale wave round 28 (O10-187) — green hydrogen export corridor & electrolyser hub orchestration depth.
 * Cross-turn persistence for export corridors and electrolyser hub relief coupled to hydrogen grid maturity,
 * critical minerals supply, offshore renewable export, and merchant storage orchestration.
 */

export type V1014GreenHydrogenExportBand =
  | 'export_absent'
  | 'pilot_export_lane'
  | 'export_corridor_hub'
  | 'global_hydrogen_export_leader';

export type V1014ElectrolyserHubBand =
  | 'electrolyser_idle'
  | 'pilot_electrolyser'
  | 'hub_orchestration'
  | 'deep_electrolyser_mesh';

export interface V1014GreenHydrogenExportInstrument {
  id: string;
  kind: 'export_terminal_backbone' | 'ammonia_export_corridor' | 'pipeline_wheeling_hub' | 'offshore_h2_export_loop';
  label: string;
  exportMwEq: number;
  hydrogenReliefFactor: number;
  electrolyserSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_GREEN_HYDROGEN_EXPORT_CATALOG: readonly V1014GreenHydrogenExportInstrument[] = [
  {
    id: 'gh_terminal',
    kind: 'export_terminal_backbone',
    label: 'Green hydrogen export terminal backbone',
    exportMwEq: 48,
    hydrogenReliefFactor: 0.17,
    electrolyserSynergyFactor: 0.11,
    projectTypeHint: 'green_hydrogen_export_terminal_backbone',
  },
  {
    id: 'gh_ammonia',
    kind: 'ammonia_export_corridor',
    label: 'Ammonia export corridor orchestration',
    exportMwEq: 46,
    hydrogenReliefFactor: 0.16,
    electrolyserSynergyFactor: 0.12,
    projectTypeHint: 'ammonia_export_corridor_orchestration',
  },
  {
    id: 'gh_pipeline',
    kind: 'pipeline_wheeling_hub',
    label: 'Hydrogen pipeline wheeling hub',
    exportMwEq: 44,
    hydrogenReliefFactor: 0.15,
    electrolyserSynergyFactor: 0.1,
    projectTypeHint: 'hydrogen_pipeline_wheeling_hub',
  },
  {
    id: 'gh_offshore',
    kind: 'offshore_h2_export_loop',
    label: 'Offshore hydrogen export loop',
    exportMwEq: 50,
    hydrogenReliefFactor: 0.18,
    electrolyserSynergyFactor: 0.13,
    projectTypeHint: 'offshore_hydrogen_export_loop',
  },
] as const;

export interface V1014ElectrolyserHubTemplate {
  id: string;
  kind: 'rez_aligned_electrolyser' | 'curtailment_soaked_electrolyser' | 'minerals_coupled_electrolyser' | 'merchant_firming_electrolyser';
  label: string;
  electrolyserScoreEq: number;
  gridReliefFactor: number;
  exportSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_ELECTROLYSER_HUB_CATALOG: readonly V1014ElectrolyserHubTemplate[] = [
  {
    id: 'el_rez',
    kind: 'rez_aligned_electrolyser',
    label: 'REZ-aligned electrolyser fleet',
    electrolyserScoreEq: 45,
    gridReliefFactor: 0.15,
    exportSynergyFactor: 0.1,
    projectTypeHint: 'rez_aligned_electrolyser_fleet',
  },
  {
    id: 'el_curtail',
    kind: 'curtailment_soaked_electrolyser',
    label: 'Curtailment-soaked electrolyser hub',
    electrolyserScoreEq: 47,
    gridReliefFactor: 0.16,
    exportSynergyFactor: 0.11,
    projectTypeHint: 'curtailment_soaked_electrolyser_hub',
  },
  {
    id: 'el_minerals',
    kind: 'minerals_coupled_electrolyser',
    label: 'Minerals-coupled electrolyser nexus',
    electrolyserScoreEq: 46,
    gridReliefFactor: 0.14,
    exportSynergyFactor: 0.12,
    projectTypeHint: 'minerals_coupled_electrolyser_nexus',
  },
  {
    id: 'el_merchant',
    kind: 'merchant_firming_electrolyser',
    label: 'Merchant-firming electrolyser mesh',
    electrolyserScoreEq: 49,
    gridReliefFactor: 0.17,
    exportSynergyFactor: 0.13,
    projectTypeHint: 'merchant_firming_electrolyser_mesh',
  },
] as const;

export interface V1014RegionalGreenHydrogenExportLedger {
  regionId: string;
  band: V1014GreenHydrogenExportBand;
  exportIndex: number;
  exportBalance: number;
  greenHydrogenExportRelief: number;
  summary: string;
}

export interface V1014RegionalElectrolyserHubLedger {
  regionId: string;
  band: V1014ElectrolyserHubBand;
  electrolyserIndex: number;
  electrolyserHubRelief: number;
  summary: string;
}

export interface V1014GreenHydrogenExportPersistedSlice {
  exportBalance: number;
  exportIndex: number;
}

export interface V1014ElectrolyserHubPersistedSlice {
  electrolyserIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const EXPORT_REGIONS = new Set(['WA', 'QLD', 'NT', 'SA']);

export function computeRegionalGreenHydrogenExportLedger(params: {
  regionId: string;
  hydrogenGridRelief: number;
  mineralsSupplyRelief: number;
  offshoreRenewableRelief: number;
  merchantStorageRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014GreenHydrogenExportPersistedSlice | null;
}): { ledger: V1014RegionalGreenHydrogenExportLedger; next: V1014GreenHydrogenExportPersistedSlice } {
  let exportGain = 0;
  let hydrogenProxy = 0;
  let electrolyserSynergy = 0;
  for (const inst of V1014_GREEN_HYDROGEN_EXPORT_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      exportGain += inst.exportMwEq;
      hydrogenProxy += inst.hydrogenReliefFactor;
      electrolyserSynergy += inst.electrolyserSynergyFactor;
    }
  }
  if (EXPORT_REGIONS.has(params.regionId)) hydrogenProxy += 0.06;
  else hydrogenProxy *= 0.72;
  if (params.hydrogenGridRelief > 2.8) {
    exportGain += clamp(params.hydrogenGridRelief * 0.9, 0, 11);
    hydrogenProxy += 0.07;
  }
  if (params.mineralsSupplyRelief > 2.5) electrolyserSynergy += clamp(params.mineralsSupplyRelief * 0.013, 0, 0.08);
  if (params.offshoreRenewableRelief > 2.6) exportGain += clamp(params.offshoreRenewableRelief * 0.82, 0, 10);
  if (params.merchantStorageRelief > 2.4) hydrogenProxy += clamp(params.merchantStorageRelief * 0.009, 0, 0.05);
  hydrogenProxy += clamp(params.renewableShareScore / 110, 0, 0.09);

  const prevIdx = params.prev?.exportIndex ?? 0;
  const prevBal = params.prev?.exportBalance ?? 0;
  const exportBalance = clamp(prevBal * 0.84 + exportGain * 0.1, 0, 225);
  const exportIndex = clamp(prevIdx * 0.81 + exportBalance * 0.09 + hydrogenProxy * 79 + electrolyserSynergy * 25, 0, 168);

  let band: V1014GreenHydrogenExportBand = 'export_absent';
  if (exportIndex >= 108 || exportGain >= 124) band = 'global_hydrogen_export_leader';
  else if (exportIndex >= 68 || exportGain >= 72) band = 'export_corridor_hub';
  else if (exportIndex >= 28 || exportGain >= 26) band = 'pilot_export_lane';

  let greenHydrogenExportRelief = clamp(hydrogenProxy * 8.1 + exportGain * 0.035 + electrolyserSynergy * 4.8, 0, 10.3);
  if (band === 'export_absent') greenHydrogenExportRelief *= 0.27;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      exportIndex: clamp(exportIndex, 0, 168),
      exportBalance: clamp(exportBalance, 0, 225),
      greenHydrogenExportRelief: clamp(greenHydrogenExportRelief, 0, 10.3),
      summary: `${params.regionId} H2 export ${band} · idx ${exportIndex.toFixed(0)} · relief ${greenHydrogenExportRelief.toFixed(1)}`,
    },
    next: {
      exportBalance: clamp(exportBalance, 0, 225),
      exportIndex: clamp(exportIndex, 0, 168),
    },
  };
}

export function advanceRegionalElectrolyserHubOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  exportBand: V1014GreenHydrogenExportBand;
  transmissionCongestionRelief: number;
  completedProjectTypes: string[];
  prev?: V1014ElectrolyserHubPersistedSlice | null;
}): { ledger: V1014RegionalElectrolyserHubLedger; next: V1014ElectrolyserHubPersistedSlice } {
  let electrolyserGain = 0;
  let gridReliefProxy = 0;
  let exportSynergy = 0;
  for (const tpl of V1014_ELECTROLYSER_HUB_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      electrolyserGain += tpl.electrolyserScoreEq;
      gridReliefProxy += tpl.gridReliefFactor;
      exportSynergy += tpl.exportSynergyFactor;
    }
  }
  if (params.exportBand === 'export_corridor_hub' || params.exportBand === 'global_hydrogen_export_leader') {
    electrolyserGain += 16;
    exportSynergy += 0.1;
  }
  if (params.transmissionCongestionRelief > 2.7) {
    electrolyserGain += params.transmissionCongestionRelief * 0.74;
    gridReliefProxy += clamp(params.transmissionCongestionRelief * 0.008, 0, 0.04);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.25, 0, 10);
  const prevIdx = params.prev?.electrolyserIndex ?? 0;
  const electrolyserIndex = clamp(
    prevIdx * 0.82 + electrolyserGain * 0.1 + gridReliefProxy * 29 - stressLoad * 0.028 + exportSynergy * 26,
    0,
    170,
  );

  let band: V1014ElectrolyserHubBand = 'electrolyser_idle';
  if (electrolyserIndex >= 110 || electrolyserGain >= 126) band = 'deep_electrolyser_mesh';
  else if (electrolyserIndex >= 70 || electrolyserGain >= 80) band = 'hub_orchestration';
  else if (electrolyserIndex >= 30 || electrolyserGain >= 28) band = 'pilot_electrolyser';

  let electrolyserHubRelief = clamp(electrolyserIndex / 17.5 + gridReliefProxy * 6.4 + exportSynergy * 6.7, 0, 10);
  if (band === 'electrolyser_idle') electrolyserHubRelief = clamp(electrolyserHubRelief * 0.26, 0, 2.6);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      electrolyserIndex: clamp(electrolyserIndex, 0, 170),
      electrolyserHubRelief: clamp(electrolyserHubRelief, 0, 10),
      summary: `${params.regionId} electrolyser ${band} · idx ${electrolyserIndex.toFixed(0)} · relief ${electrolyserHubRelief.toFixed(1)}`,
    },
    next: { electrolyserIndex: clamp(electrolyserIndex, 0, 170) },
  };
}

export const V1014_H2_EXPORT_ELECTROLYSER_SCENARIOS = [
  {
    id: 'sc_he_wa',
    label: 'WA export terminal with REZ-aligned electrolyser fleet',
    regionId: 'WA',
    hydrogenGridRelief: 3.2,
    mineralsSupplyRelief: 2.9,
    offshoreRenewableRelief: 3,
    merchantStorageRelief: 2.8,
    renewableShareScore: 58,
    gridStressPoints: 16,
    transmissionCongestionRelief: 2.9,
    completedProjectTypes: [
      'green_hydrogen_export_terminal_backbone',
      'offshore_hydrogen_export_loop',
      'rez_aligned_electrolyser_fleet',
      'merchant_firming_electrolyser_mesh',
    ],
    expectExportBand: 'export_corridor_hub' as V1014GreenHydrogenExportBand,
    expectMinExportRelief: 2,
    expectElectrolyserBand: 'hub_orchestration' as V1014ElectrolyserHubBand,
    expectMinElectrolyserRelief: 1.8,
  },
  {
    id: 'sc_he_qld',
    label: 'QLD ammonia corridor with curtailment electrolyser',
    regionId: 'QLD',
    hydrogenGridRelief: 2.7,
    mineralsSupplyRelief: 2.5,
    offshoreRenewableRelief: 2.4,
    merchantStorageRelief: 2.5,
    renewableShareScore: 50,
    gridStressPoints: 15,
    transmissionCongestionRelief: 2.5,
    exportBand: 'pilot_export_lane' as V1014GreenHydrogenExportBand,
    completedProjectTypes: ['ammonia_export_corridor_orchestration', 'curtailment_soaked_electrolyser_hub'],
    expectElectrolyserBand: 'pilot_electrolyser' as V1014ElectrolyserHubBand,
    expectMinElectrolyserRelief: 1.4,
  },
] as const;

export function runAgent13H2ExportElectrolyserScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_GREEN_HYDROGEN_EXPORT_CATALOG.length >= 4);
  ok(V1014_ELECTROLYSER_HUB_CATALOG.length >= 4);

  const sc0 = V1014_H2_EXPORT_ELECTROLYSER_SCENARIOS[0];
  const exportLedger = computeRegionalGreenHydrogenExportLedger({
    regionId: sc0.regionId,
    hydrogenGridRelief: sc0.hydrogenGridRelief,
    mineralsSupplyRelief: sc0.mineralsSupplyRelief,
    offshoreRenewableRelief: sc0.offshoreRenewableRelief,
    merchantStorageRelief: sc0.merchantStorageRelief,
    renewableShareScore: sc0.renewableShareScore,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    exportLedger.ledger.band === sc0.expectExportBand ||
      exportLedger.ledger.band === 'global_hydrogen_export_leader' ||
      exportLedger.ledger.greenHydrogenExportRelief >= sc0.expectMinExportRelief,
  );

  const electrolyser = advanceRegionalElectrolyserHubOrchestration({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    exportBand: exportLedger.ledger.band,
    transmissionCongestionRelief: sc0.transmissionCongestionRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    electrolyser.ledger.band === sc0.expectElectrolyserBand ||
      electrolyser.ledger.band === 'deep_electrolyser_mesh' ||
      electrolyser.ledger.electrolyserHubRelief >= sc0.expectMinElectrolyserRelief,
  );

  const sc1 = V1014_H2_EXPORT_ELECTROLYSER_SCENARIOS[1];
  const electrolyserQ = advanceRegionalElectrolyserHubOrchestration({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    exportBand: sc1.exportBand,
    transmissionCongestionRelief: sc1.transmissionCongestionRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(
    electrolyserQ.ledger.electrolyserHubRelief >= sc1.expectMinElectrolyserRelief ||
      electrolyserQ.ledger.band !== 'electrolyser_idle',
  );

  const persistA = computeRegionalGreenHydrogenExportLedger({
    regionId: 'NT',
    hydrogenGridRelief: 2.5,
    mineralsSupplyRelief: 2.3,
    offshoreRenewableRelief: 2.4,
    merchantStorageRelief: 2.2,
    renewableShareScore: 46,
    completedProjectTypes: ['hydrogen_pipeline_wheeling_hub'],
    prev: null,
  });
  const persistB = computeRegionalGreenHydrogenExportLedger({
    regionId: 'NT',
    hydrogenGridRelief: 2.5,
    mineralsSupplyRelief: 2.3,
    offshoreRenewableRelief: 2.4,
    merchantStorageRelief: 2.2,
    renewableShareScore: 46,
    completedProjectTypes: ['hydrogen_pipeline_wheeling_hub'],
    prev: persistA.next,
  });
  ok(persistB.next.exportIndex >= persistA.next.exportIndex * 0.7);

  const turnSc = runAgent13H2ExportElectrolyserTurnScenario(V1014_H2_EXPORT_ELECTROLYSER_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastExportRelief >= 2);

  const gi = scoreAgent13H2ExportElectrolyserGIAlignment({
    actionText: 'Green hydrogen export terminal with REZ-aligned electrolyser and merchant firming mesh',
    exportBand: 'export_corridor_hub',
    electrolyserBand: 'hub_orchestration',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13H2ExportElectrolyserTurnStep {
  turn: number;
  regionId: string;
  hydrogenGridRelief: number;
  mineralsSupplyRelief: number;
  offshoreRenewableRelief: number;
  merchantStorageRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  transmissionCongestionRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13H2ExportElectrolyserTurnScenario {
  id: string;
  label: string;
  steps: Agent13H2ExportElectrolyserTurnStep[];
  expect: {
    minExportReliefOnLast?: number;
    minElectrolyserReliefOnLast?: number;
    lastExportBand?: V1014GreenHydrogenExportBand;
  };
}

export const V1014_H2_EXPORT_ELECTROLYSER_TURN_SCENARIOS: readonly Agent13H2ExportElectrolyserTurnScenario[] = [
  {
    id: 'sc_he_wa_escalation',
    label: 'WA hydrogen export with deep electrolyser mesh',
    steps: [
      {
        turn: 1,
        regionId: 'WA',
        hydrogenGridRelief: 2.4,
        mineralsSupplyRelief: 2.2,
        offshoreRenewableRelief: 2.3,
        merchantStorageRelief: 2.2,
        renewableShareScore: 44,
        gridStressPoints: 17,
        transmissionCongestionRelief: 2.3,
        completedProjectTypes: ['hydrogen_pipeline_wheeling_hub', 'rez_aligned_electrolyser_fleet'],
      },
      {
        turn: 2,
        regionId: 'WA',
        hydrogenGridRelief: 2.8,
        mineralsSupplyRelief: 2.6,
        offshoreRenewableRelief: 2.7,
        merchantStorageRelief: 2.6,
        renewableShareScore: 50,
        gridStressPoints: 15,
        transmissionCongestionRelief: 2.7,
        completedProjectTypes: ['green_hydrogen_export_terminal_backbone', 'curtailment_soaked_electrolyser_hub'],
      },
      {
        turn: 3,
        regionId: 'WA',
        hydrogenGridRelief: 3.2,
        mineralsSupplyRelief: 3,
        offshoreRenewableRelief: 3.1,
        merchantStorageRelief: 2.9,
        renewableShareScore: 58,
        gridStressPoints: 13,
        transmissionCongestionRelief: 3,
        completedProjectTypes: [
          'green_hydrogen_export_terminal_backbone',
          'ammonia_export_corridor_orchestration',
          'hydrogen_pipeline_wheeling_hub',
          'offshore_hydrogen_export_loop',
          'rez_aligned_electrolyser_fleet',
          'curtailment_soaked_electrolyser_hub',
          'minerals_coupled_electrolyser_nexus',
          'merchant_firming_electrolyser_mesh',
        ],
      },
    ],
    expect: { minExportReliefOnLast: 2, minElectrolyserReliefOnLast: 1.8, lastExportBand: 'export_corridor_hub' },
  },
] as const;

export function runAgent13H2ExportElectrolyserTurnScenario(
  scenario: Agent13H2ExportElectrolyserTurnScenario,
): { passed: boolean; detail: string; lastExportRelief: number; lastElectrolyserRelief: number } {
  let exportMem: V1014GreenHydrogenExportPersistedSlice | null = null;
  let electrolyserMem: V1014ElectrolyserHubPersistedSlice | null = null;
  let lastExportRelief = 0;
  let lastElectrolyserRelief = 0;
  let lastBand: V1014GreenHydrogenExportBand = 'export_absent';

  for (const step of scenario.steps) {
    const exportLedger = computeRegionalGreenHydrogenExportLedger({
      regionId: step.regionId,
      hydrogenGridRelief: step.hydrogenGridRelief,
      mineralsSupplyRelief: step.mineralsSupplyRelief,
      offshoreRenewableRelief: step.offshoreRenewableRelief,
      merchantStorageRelief: step.merchantStorageRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: exportMem,
    });
    exportMem = exportLedger.next;
    lastExportRelief = exportLedger.ledger.greenHydrogenExportRelief;
    lastBand = exportLedger.ledger.band;

    const electrolyser = advanceRegionalElectrolyserHubOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      exportBand: exportLedger.ledger.band,
      transmissionCongestionRelief: step.transmissionCongestionRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: electrolyserMem,
    });
    electrolyserMem = electrolyser.next;
    lastElectrolyserRelief = electrolyser.ledger.electrolyserHubRelief;
  }

  if (scenario.expect.minExportReliefOnLast != null && lastExportRelief < scenario.expect.minExportReliefOnLast) {
    return {
      passed: false,
      detail: `export relief ${lastExportRelief} < ${scenario.expect.minExportReliefOnLast}`,
      lastExportRelief,
      lastElectrolyserRelief,
    };
  }
  if (scenario.expect.minElectrolyserReliefOnLast != null && lastElectrolyserRelief < scenario.expect.minElectrolyserReliefOnLast) {
    return {
      passed: false,
      detail: `electrolyser relief ${lastElectrolyserRelief} < ${scenario.expect.minElectrolyserReliefOnLast}`,
      lastExportRelief,
      lastElectrolyserRelief,
    };
  }
  if (scenario.expect.lastExportBand != null) {
    const allowed: V1014GreenHydrogenExportBand[] = [scenario.expect.lastExportBand];
    if (scenario.expect.lastExportBand === 'export_corridor_hub') allowed.push('global_hydrogen_export_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastExportRelief, lastElectrolyserRelief };
    }
  }

  return { passed: true, detail: 'ok', lastExportRelief, lastElectrolyserRelief };
}

export function scoreAgent13H2ExportElectrolyserGIAlignment(params: {
  actionText: string;
  exportBand?: string;
  electrolyserBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'green hydrogen export',
    'hydrogen export terminal',
    'electrolyser',
    'ammonia export',
    'pipeline wheeling',
    'offshore hydrogen',
    'rez-aligned electrolyser',
    'merchant firming electrolyser',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.21, 0, 2);
  if (params.exportBand === 'global_hydrogen_export_leader' || params.exportBand === 'export_corridor_hub') {
    delta += hits.some(h => h.includes('export') || h.includes('ammonia') || h.includes('pipeline')) ? 0.37 : 0.1;
  }
  if (params.electrolyserBand === 'hub_orchestration' || params.electrolyserBand === 'deep_electrolyser_mesh') {
    delta += hits.some(h => h.includes('electrolyser') || h.includes('firming')) ? 0.34 : 0.09;
  }
  if (params.electrolyserBand === 'electrolyser_idle' && hits.some(h => h.includes('electrolyser'))) delta -= 0.1;
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `H2 export electrolyser GI: ${hits.slice(0, 2).join(', ')} aligns with export corridor and hub depth.`
        : null,
  };
}
