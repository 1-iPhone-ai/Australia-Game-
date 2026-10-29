/**
 * Agent 13 scale wave round 45 (O10-221) — compound offshore floating wind & marine export corridor federation orchestration depth.
 */

export type V1014OffshoreFloatingWindBand =
  | 'coastal_nascent'
  | 'pilot_floating_wind'
  | 'floating_wind_corridor'
  | 'federated_offshore_wind_leader';

export type V1014MarineExportCorridorFederationBand =
  | 'disconnected_marine'
  | 'pilot_export_corridor'
  | 'marine_export_hub'
  | 'deep_offshore_export_mesh';

export interface V1014OffshoreFloatingWindInstrument {
  id: string;
  kind: 'floating_wind_federation_hub' | 'array_export_corridor' | 'subsea_transmission_mesh' | 'federation_offshore_wind_tie';
  label: string;
  windScoreEq: number;
  offshoreWindReliefFactor: number;
  exportCorridorSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_OFFSHORE_FLOATING_WIND_CATALOG: readonly V1014OffshoreFloatingWindInstrument[] = [
  {
    id: 'ofw_hub',
    kind: 'floating_wind_federation_hub',
    label: 'Offshore floating-wind federation hub',
    windScoreEq: 49,
    offshoreWindReliefFactor: 0.17,
    exportCorridorSynergyFactor: 0.11,
    projectTypeHint: 'offshore_floating_wind_federation_hub',
  },
  {
    id: 'ofw_array',
    kind: 'array_export_corridor',
    label: 'Floating array export corridor',
    windScoreEq: 47,
    offshoreWindReliefFactor: 0.16,
    exportCorridorSynergyFactor: 0.12,
    projectTypeHint: 'floating_wind_array_export_corridor',
  },
  {
    id: 'ofw_subsea',
    kind: 'subsea_transmission_mesh',
    label: 'Subsea transmission federation mesh',
    windScoreEq: 51,
    offshoreWindReliefFactor: 0.18,
    exportCorridorSynergyFactor: 0.1,
    projectTypeHint: 'subsea_transmission_federation_mesh',
  },
  {
    id: 'ofw_fed',
    kind: 'federation_offshore_wind_tie',
    label: 'Federation offshore wind tie',
    windScoreEq: 53,
    offshoreWindReliefFactor: 0.17,
    exportCorridorSynergyFactor: 0.13,
    projectTypeHint: 'federation_offshore_floating_wind_tie',
  },
] as const;

export interface V1014MarineExportCorridorFederationTemplate {
  id: string;
  kind: 'export_cable_orchestration_hub' | 'shore_tie_green_corridor' | 'maritime_export_queue_stack' | 'trade_exposed_offshore_corridor';
  label: string;
  corridorScoreEq: number;
  corridorReliefFactor: number;
  offshoreWindSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_MARINE_EXPORT_CORRIDOR_FEDERATION_CATALOG: readonly V1014MarineExportCorridorFederationTemplate[] = [
  {
    id: 'mec_cable',
    kind: 'export_cable_orchestration_hub',
    label: 'Export cable orchestration hub',
    corridorScoreEq: 48,
    corridorReliefFactor: 0.16,
    offshoreWindSynergyFactor: 0.11,
    projectTypeHint: 'offshore_export_cable_orchestration_hub',
  },
  {
    id: 'mec_shore',
    kind: 'shore_tie_green_corridor',
    label: 'Marine renewable shore-tie corridor',
    corridorScoreEq: 46,
    corridorReliefFactor: 0.15,
    offshoreWindSynergyFactor: 0.12,
    projectTypeHint: 'marine_renewable_shore_tie_federation_corridor',
  },
  {
    id: 'mec_queue',
    kind: 'maritime_export_queue_stack',
    label: 'Maritime export queue stacking layer',
    corridorScoreEq: 50,
    corridorReliefFactor: 0.17,
    offshoreWindSynergyFactor: 0.1,
    projectTypeHint: 'maritime_export_queue_federation_stack',
  },
  {
    id: 'mec_trade',
    kind: 'trade_exposed_offshore_corridor',
    label: 'Trade-exposed offshore export corridor',
    corridorScoreEq: 52,
    corridorReliefFactor: 0.16,
    offshoreWindSynergyFactor: 0.13,
    projectTypeHint: 'trade_exposed_offshore_export_corridor',
  },
] as const;

export interface V1014RegionalOffshoreFloatingWindLedger {
  regionId: string;
  band: V1014OffshoreFloatingWindBand;
  windIndex: number;
  windBalance: number;
  offshoreFloatingWindRelief: number;
  summary: string;
}

export interface V1014RegionalMarineExportCorridorFederationLedger {
  regionId: string;
  band: V1014MarineExportCorridorFederationBand;
  corridorIndex: number;
  marineExportCorridorFederationRelief: number;
  summary: string;
}

export interface V1014OffshoreFloatingWindPersistedSlice {
  windBalance: number;
  windIndex: number;
}

export interface V1014MarineExportCorridorFederationPersistedSlice {
  corridorIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const OFFSHORE_WIND_REGIONS = new Set(['TAS', 'VIC', 'NSW', 'QLD', 'WA', 'SA']);

export function computeRegionalOffshoreFloatingWindLedger(params: {
  regionId: string;
  merchantArbitrationFederationRelief: number;
  transmissionMlfRelief: number;
  exportBufferFederationRelief: number;
  offshoreRenewableRelief: number;
  portGreenCorridorRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014OffshoreFloatingWindPersistedSlice | null;
}): { ledger: V1014RegionalOffshoreFloatingWindLedger; next: V1014OffshoreFloatingWindPersistedSlice } {
  let windGain = 0;
  let windProxy = 0;
  let corridorSynergy = 0;
  for (const inst of V1014_OFFSHORE_FLOATING_WIND_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      windGain += inst.windScoreEq;
      windProxy += inst.offshoreWindReliefFactor;
      corridorSynergy += inst.exportCorridorSynergyFactor;
    }
  }
  if (params.completedProjectTypes.includes('offshore_floating_wind')) {
    windGain += 12;
    windProxy += 0.05;
  }
  if (OFFSHORE_WIND_REGIONS.has(params.regionId)) windProxy += 0.07;
  else windProxy *= 0.68;
  if (params.merchantArbitrationFederationRelief > 2.3) corridorSynergy += clamp(params.merchantArbitrationFederationRelief * 0.008, 0, 0.05);
  if (params.transmissionMlfRelief > 2.3) windGain += clamp(params.transmissionMlfRelief * 0.5, 0, 7);
  if (params.exportBufferFederationRelief > 2.3) windProxy += clamp(params.exportBufferFederationRelief * 0.007, 0, 0.04);
  if (params.offshoreRenewableRelief > 2.2) windGain += clamp(params.offshoreRenewableRelief * 0.62, 0, 8);
  if (params.portGreenCorridorRelief > 2.2) corridorSynergy += clamp(params.portGreenCorridorRelief * 0.009, 0, 0.05);
  windProxy += clamp(params.renewableShareScore / 112, 0, 0.09);

  const prevIdx = params.prev?.windIndex ?? 0;
  const prevBal = params.prev?.windBalance ?? 0;
  const windBalance = clamp(prevBal * 0.8 + windGain * 0.1, 0, 260);
  const windIndex = clamp(prevIdx * 0.77 + windBalance * 0.09 + windProxy * 76 + corridorSynergy * 25, 0, 202);

  let band: V1014OffshoreFloatingWindBand = 'coastal_nascent';
  if (windIndex >= 128 || windGain >= 150) band = 'federated_offshore_wind_leader';
  else if (windIndex >= 88 || windGain >= 104) band = 'floating_wind_corridor';
  else if (windIndex >= 43 || windGain >= 41) band = 'pilot_floating_wind';

  let offshoreFloatingWindRelief = clamp(windProxy * 8.1 + windGain * 0.028 + corridorSynergy * 5, 0, 10.5);
  if (band === 'coastal_nascent') offshoreFloatingWindRelief *= 0.15;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      windIndex: clamp(windIndex, 0, 202),
      windBalance: clamp(windBalance, 0, 260),
      offshoreFloatingWindRelief: clamp(offshoreFloatingWindRelief, 0, 10.5),
      summary: `${params.regionId} offshore wind ${band} · idx ${windIndex.toFixed(0)} · relief ${offshoreFloatingWindRelief.toFixed(1)}`,
    },
    next: {
      windBalance: clamp(windBalance, 0, 260),
      windIndex: clamp(windIndex, 0, 202),
    },
  };
}

export function advanceRegionalMarineExportCorridorFederationOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  offshoreWindBand: V1014OffshoreFloatingWindBand;
  maritimeShorePowerRelief: number;
  exportHydrogenCorridorRelief: number;
  completedProjectTypes: string[];
  prev?: V1014MarineExportCorridorFederationPersistedSlice | null;
}): { ledger: V1014RegionalMarineExportCorridorFederationLedger; next: V1014MarineExportCorridorFederationPersistedSlice } {
  let corridorGain = 0;
  let corridorProxy = 0;
  let windSynergy = 0;
  for (const tpl of V1014_MARINE_EXPORT_CORRIDOR_FEDERATION_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      corridorGain += tpl.corridorScoreEq;
      corridorProxy += tpl.corridorReliefFactor;
      windSynergy += tpl.offshoreWindSynergyFactor;
    }
  }
  if (params.completedProjectTypes.includes('offshore_export_cable_corridor')) {
    corridorGain += 10;
    corridorProxy += 0.04;
  }
  if (params.offshoreWindBand === 'floating_wind_corridor' || params.offshoreWindBand === 'federated_offshore_wind_leader') {
    corridorGain += 19;
    windSynergy += 0.13;
  }
  if (params.maritimeShorePowerRelief > 2.3) {
    corridorGain += params.maritimeShorePowerRelief * 0.54;
    corridorProxy += clamp(params.maritimeShorePowerRelief * 0.007, 0, 0.04);
  }
  if (params.exportHydrogenCorridorRelief > 2.3) windSynergy += clamp(params.exportHydrogenCorridorRelief * 0.008, 0, 0.04);

  const stressLoad = clamp(params.gridStressPoints * 0.13, 0, 5.5);
  const prevIdx = params.prev?.corridorIndex ?? 0;
  const corridorIndex = clamp(
    prevIdx * 0.76 + corridorGain * 0.1 + corridorProxy * 26 - stressLoad * 0.02 + windSynergy * 26,
    0,
    203,
  );

  let band: V1014MarineExportCorridorFederationBand = 'disconnected_marine';
  if (corridorIndex >= 131 || corridorGain >= 156) band = 'deep_offshore_export_mesh';
  else if (corridorIndex >= 91 || corridorGain >= 110) band = 'marine_export_hub';
  else if (corridorIndex >= 45 || corridorGain >= 43) band = 'pilot_export_corridor';

  let marineExportCorridorFederationRelief = clamp(corridorIndex / 17.2 + corridorProxy * 6.3 + windSynergy * 6.8, 0, 10.4);
  if (band === 'disconnected_marine') marineExportCorridorFederationRelief = clamp(marineExportCorridorFederationRelief * 0.13, 0, 1.4);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      corridorIndex: clamp(corridorIndex, 0, 203),
      marineExportCorridorFederationRelief: clamp(marineExportCorridorFederationRelief, 0, 10.4),
      summary: `${params.regionId} marine export ${band} · idx ${corridorIndex.toFixed(0)} · relief ${marineExportCorridorFederationRelief.toFixed(1)}`,
    },
    next: { corridorIndex: clamp(corridorIndex, 0, 203) },
  };
}

export function runAgent13OffshoreWindExportFederationScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_OFFSHORE_FLOATING_WIND_CATALOG.length >= 4);
  ok(V1014_MARINE_EXPORT_CORRIDOR_FEDERATION_CATALOG.length >= 4);

  const wind = computeRegionalOffshoreFloatingWindLedger({
    regionId: 'TAS',
    merchantArbitrationFederationRelief: 2.5,
    transmissionMlfRelief: 2.4,
    exportBufferFederationRelief: 2.5,
    offshoreRenewableRelief: 2.7,
    portGreenCorridorRelief: 2.4,
    renewableShareScore: 56,
    completedProjectTypes: ['offshore_floating_wind_federation_hub', 'federation_offshore_floating_wind_tie', 'offshore_floating_wind'],
  });
  ok(wind.ledger.offshoreFloatingWindRelief >= 1.5 || wind.ledger.band !== 'coastal_nascent');

  const corridor = advanceRegionalMarineExportCorridorFederationOrchestration({
    regionId: 'TAS',
    gridStressPoints: 14,
    offshoreWindBand: wind.ledger.band,
    maritimeShorePowerRelief: 2.5,
    exportHydrogenCorridorRelief: 2.4,
    completedProjectTypes: ['offshore_export_cable_orchestration_hub', 'marine_renewable_shore_tie_federation_corridor'],
  });
  ok(corridor.ledger.marineExportCorridorFederationRelief >= 1.2 || corridor.ledger.band !== 'disconnected_marine');

  const turnSc = runAgent13OffshoreWindExportTurnScenario(V1014_OFFSHORE_WIND_EXPORT_TURN_SCENARIOS[0]);
  ok(turnSc.passed);

  const gi = scoreAgent13OffshoreWindExportGIAlignment({
    actionText: 'Offshore floating wind federation hub with export cable orchestration and marine renewable shore-tie corridor',
    offshoreWindBand: 'floating_wind_corridor',
    marineExportBand: 'marine_export_hub',
  });
  ok(gi.relevanceDelta > 0.85 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13OffshoreWindExportTurnStep {
  turn: number;
  regionId: string;
  merchantArbitrationFederationRelief: number;
  transmissionMlfRelief: number;
  exportBufferFederationRelief: number;
  offshoreRenewableRelief: number;
  portGreenCorridorRelief: number;
  maritimeShorePowerRelief: number;
  exportHydrogenCorridorRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  completedProjectTypes: string[];
}

export interface Agent13OffshoreWindExportTurnScenario {
  id: string;
  label: string;
  steps: Agent13OffshoreWindExportTurnStep[];
  expect: { minWindReliefOnLast?: number; minCorridorReliefOnLast?: number };
}

export const V1014_OFFSHORE_WIND_EXPORT_TURN_SCENARIOS: readonly Agent13OffshoreWindExportTurnScenario[] = [
  {
    id: 'sc_ow_tas_escalation',
    label: 'TAS offshore floating wind with marine export mesh',
    steps: [
      {
        turn: 1,
        regionId: 'TAS',
        merchantArbitrationFederationRelief: 1.9,
        transmissionMlfRelief: 1.8,
        exportBufferFederationRelief: 1.8,
        offshoreRenewableRelief: 2,
        portGreenCorridorRelief: 1.8,
        maritimeShorePowerRelief: 1.7,
        exportHydrogenCorridorRelief: 1.6,
        renewableShareScore: 44,
        gridStressPoints: 17,
        completedProjectTypes: ['offshore_floating_wind_federation_hub', 'offshore_export_cable_orchestration_hub'],
      },
      {
        turn: 2,
        regionId: 'TAS',
        merchantArbitrationFederationRelief: 2.2,
        transmissionMlfRelief: 2.1,
        exportBufferFederationRelief: 2.1,
        offshoreRenewableRelief: 2.3,
        portGreenCorridorRelief: 2.1,
        maritimeShorePowerRelief: 2,
        exportHydrogenCorridorRelief: 1.9,
        renewableShareScore: 50,
        gridStressPoints: 16,
        completedProjectTypes: ['floating_wind_array_export_corridor', 'maritime_export_queue_federation_stack'],
      },
      {
        turn: 3,
        regionId: 'TAS',
        merchantArbitrationFederationRelief: 2.6,
        transmissionMlfRelief: 2.5,
        exportBufferFederationRelief: 2.5,
        offshoreRenewableRelief: 2.7,
        portGreenCorridorRelief: 2.5,
        maritimeShorePowerRelief: 2.4,
        exportHydrogenCorridorRelief: 2.3,
        renewableShareScore: 57,
        gridStressPoints: 14,
        completedProjectTypes: [
          'offshore_floating_wind_federation_hub',
          'floating_wind_array_export_corridor',
          'subsea_transmission_federation_mesh',
          'federation_offshore_floating_wind_tie',
          'offshore_floating_wind',
          'offshore_export_cable_orchestration_hub',
          'marine_renewable_shore_tie_federation_corridor',
          'maritime_export_queue_federation_stack',
          'trade_exposed_offshore_export_corridor',
          'offshore_export_cable_corridor',
        ],
      },
    ],
    expect: { minWindReliefOnLast: 1.5, minCorridorReliefOnLast: 1.1 },
  },
] as const;

export function runAgent13OffshoreWindExportTurnScenario(
  scenario: Agent13OffshoreWindExportTurnScenario,
): { passed: boolean; detail: string; lastWindRelief: number; lastCorridorRelief: number } {
  let windMem: V1014OffshoreFloatingWindPersistedSlice | null = null;
  let corridorMem: V1014MarineExportCorridorFederationPersistedSlice | null = null;
  let lastWindRelief = 0;
  let lastCorridorRelief = 0;

  for (const step of scenario.steps) {
    const wind = computeRegionalOffshoreFloatingWindLedger({
      regionId: step.regionId,
      merchantArbitrationFederationRelief: step.merchantArbitrationFederationRelief,
      transmissionMlfRelief: step.transmissionMlfRelief,
      exportBufferFederationRelief: step.exportBufferFederationRelief,
      offshoreRenewableRelief: step.offshoreRenewableRelief,
      portGreenCorridorRelief: step.portGreenCorridorRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: windMem,
    });
    windMem = wind.next;
    lastWindRelief = wind.ledger.offshoreFloatingWindRelief;

    const corridor = advanceRegionalMarineExportCorridorFederationOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      offshoreWindBand: wind.ledger.band,
      maritimeShorePowerRelief: step.maritimeShorePowerRelief,
      exportHydrogenCorridorRelief: step.exportHydrogenCorridorRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: corridorMem,
    });
    corridorMem = corridor.next;
    lastCorridorRelief = corridor.ledger.marineExportCorridorFederationRelief;
  }

  if (scenario.expect.minWindReliefOnLast != null && lastWindRelief < scenario.expect.minWindReliefOnLast) {
    return { passed: false, detail: `wind ${lastWindRelief}`, lastWindRelief, lastCorridorRelief };
  }
  if (scenario.expect.minCorridorReliefOnLast != null && lastCorridorRelief < scenario.expect.minCorridorReliefOnLast) {
    return { passed: false, detail: `corridor ${lastCorridorRelief}`, lastWindRelief, lastCorridorRelief };
  }
  return { passed: true, detail: 'ok', lastWindRelief, lastCorridorRelief };
}

export function scoreAgent13OffshoreWindExportGIAlignment(params: {
  actionText: string;
  offshoreWindBand?: string;
  marineExportBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'offshore floating',
    'floating wind',
    'offshore wind',
    'subsea',
    'export cable',
    'marine export',
    'shore-tie',
    'shore tie',
    'maritime export',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.13, 0, 2);
  if (params.offshoreWindBand === 'federated_offshore_wind_leader' || params.offshoreWindBand === 'floating_wind_corridor') {
    delta += hits.some(h => h.includes('offshore') || h.includes('floating') || h.includes('subsea')) ? 0.33 : 0.08;
  }
  if (params.marineExportBand === 'marine_export_hub' || params.marineExportBand === 'deep_offshore_export_mesh') {
    delta += hits.some(h => h.includes('export') || h.includes('marine') || h.includes('cable')) ? 0.31 : 0.08;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Offshore wind export GI: ${hits.slice(0, 2).join(', ')} aligns with floating wind and marine export corridor federation depth.`
        : null,
  };
}
