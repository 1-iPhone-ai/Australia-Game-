/**
 * Agent 13 scale wave round 42 (O10-215) — compound hydrogen LDES storage & export buffer federation orchestration depth.
 */

export type V1014HydrogenLdesStorageBand =
  | 'nascent_storage'
  | 'pilot_h2_ldes'
  | 'h2_ldes_corridor'
  | 'federated_h2_ldes_leader';

export type V1014ExportBufferFederationBand =
  | 'volatile_export'
  | 'pilot_export_buffer'
  | 'export_buffer_hub'
  | 'deep_export_firming_mesh';

export interface V1014HydrogenLdesStorageInstrument {
  id: string;
  kind: 'h2_ldes_federation_hub' | 'salt_cavern_storage_corridor' | 'electrolyzer_buffer_mesh' | 'federation_h2_ldes_tie';
  label: string;
  storageScoreEq: number;
  ldesReliefFactor: number;
  exportBufferSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_H2_LDES_STORAGE_CATALOG: readonly V1014HydrogenLdesStorageInstrument[] = [
  {
    id: 'hl_hub',
    kind: 'h2_ldes_federation_hub',
    label: 'Hydrogen LDES federation hub',
    storageScoreEq: 48,
    ldesReliefFactor: 0.17,
    exportBufferSynergyFactor: 0.11,
    projectTypeHint: 'hydrogen_ldes_federation_hub',
  },
  {
    id: 'hl_salt',
    kind: 'salt_cavern_storage_corridor',
    label: 'Salt-cavern hydrogen storage corridor',
    storageScoreEq: 46,
    ldesReliefFactor: 0.16,
    exportBufferSynergyFactor: 0.12,
    projectTypeHint: 'salt_cavern_h2_storage_corridor',
  },
  {
    id: 'hl_elec',
    kind: 'electrolyzer_buffer_mesh',
    label: 'Electrolyzer buffer federation mesh',
    storageScoreEq: 50,
    ldesReliefFactor: 0.18,
    exportBufferSynergyFactor: 0.1,
    projectTypeHint: 'electrolyzer_buffer_federation_mesh',
  },
  {
    id: 'hl_fed',
    kind: 'federation_h2_ldes_tie',
    label: 'Federation hydrogen LDES tie',
    storageScoreEq: 52,
    ldesReliefFactor: 0.17,
    exportBufferSynergyFactor: 0.13,
    projectTypeHint: 'federation_hydrogen_ldes_tie',
  },
] as const;

export interface V1014ExportBufferFederationTemplate {
  id: string;
  kind: 'export_firming_buffer_hub' | 'maritime_export_queue_mesh' | 'certificate_linked_export_stack' | 'trade_exposed_firming_corridor';
  label: string;
  bufferScoreEq: number;
  bufferReliefFactor: number;
  ldesSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_EXPORT_BUFFER_FEDERATION_CATALOG: readonly V1014ExportBufferFederationTemplate[] = [
  {
    id: 'eb_firm',
    kind: 'export_firming_buffer_hub',
    label: 'Export firming buffer hub',
    bufferScoreEq: 47,
    bufferReliefFactor: 0.16,
    ldesSynergyFactor: 0.11,
    projectTypeHint: 'export_firming_buffer_hub',
  },
  {
    id: 'eb_marine',
    kind: 'maritime_export_queue_mesh',
    label: 'Maritime export queue federation mesh',
    bufferScoreEq: 45,
    bufferReliefFactor: 0.15,
    ldesSynergyFactor: 0.12,
    projectTypeHint: 'maritime_export_queue_federation_mesh',
  },
  {
    id: 'eb_cert',
    kind: 'certificate_linked_export_stack',
    label: 'Certificate-linked export stack corridor',
    bufferScoreEq: 49,
    bufferReliefFactor: 0.17,
    ldesSynergyFactor: 0.1,
    projectTypeHint: 'certificate_linked_export_stack_corridor',
  },
  {
    id: 'eb_trade',
    kind: 'trade_exposed_firming_corridor',
    label: 'Trade-exposed export firming corridor',
    bufferScoreEq: 51,
    bufferReliefFactor: 0.16,
    ldesSynergyFactor: 0.13,
    projectTypeHint: 'trade_exposed_export_firming_corridor',
  },
] as const;

export interface V1014RegionalHydrogenLdesStorageLedger {
  regionId: string;
  band: V1014HydrogenLdesStorageBand;
  ldesIndex: number;
  ldesBalance: number;
  hydrogenLdesStorageRelief: number;
  summary: string;
}

export interface V1014RegionalExportBufferFederationLedger {
  regionId: string;
  band: V1014ExportBufferFederationBand;
  bufferIndex: number;
  exportBufferFederationRelief: number;
  summary: string;
}

export interface V1014HydrogenLdesStoragePersistedSlice {
  ldesBalance: number;
  ldesIndex: number;
}

export interface V1014ExportBufferFederationPersistedSlice {
  bufferIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const H2_LDES_REGIONS = new Set(['QLD', 'WA', 'NSW', 'SA', 'VIC']);

export function computeRegionalHydrogenLdesStorageLedger(params: {
  regionId: string;
  exportHydrogenCorridorRelief: number;
  maritimeShorePowerRelief: number;
  decarbonCertificateStackRelief: number;
  safeguardTradeBufferRelief: number;
  communityEnergyResilienceRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014HydrogenLdesStoragePersistedSlice | null;
}): { ledger: V1014RegionalHydrogenLdesStorageLedger; next: V1014HydrogenLdesStoragePersistedSlice } {
  let storageGain = 0;
  let ldesProxy = 0;
  let bufferSynergy = 0;
  for (const inst of V1014_H2_LDES_STORAGE_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      storageGain += inst.storageScoreEq;
      ldesProxy += inst.ldesReliefFactor;
      bufferSynergy += inst.exportBufferSynergyFactor;
    }
  }
  if (H2_LDES_REGIONS.has(params.regionId)) ldesProxy += 0.07;
  else ldesProxy *= 0.69;
  if (params.exportHydrogenCorridorRelief > 2.4) storageGain += clamp(params.exportHydrogenCorridorRelief * 0.68, 0, 9);
  if (params.maritimeShorePowerRelief > 2.3) bufferSynergy += clamp(params.maritimeShorePowerRelief * 0.009, 0, 0.05);
  if (params.decarbonCertificateStackRelief > 2.3) ldesProxy += clamp(params.decarbonCertificateStackRelief * 0.007, 0, 0.04);
  if (params.safeguardTradeBufferRelief > 2.3) bufferSynergy += clamp(params.safeguardTradeBufferRelief * 0.008, 0, 0.05);
  if (params.communityEnergyResilienceRelief > 2.2) storageGain += clamp(params.communityEnergyResilienceRelief * 0.5, 0, 6);
  ldesProxy += clamp(params.renewableShareScore / 107, 0, 0.09);

  const prevIdx = params.prev?.ldesIndex ?? 0;
  const prevBal = params.prev?.ldesBalance ?? 0;
  const ldesBalance = clamp(prevBal * 0.81 + storageGain * 0.1, 0, 258);
  const ldesIndex = clamp(prevIdx * 0.78 + ldesBalance * 0.09 + ldesProxy * 77 + bufferSynergy * 24, 0, 198);

  let band: V1014HydrogenLdesStorageBand = 'nascent_storage';
  if (ldesIndex >= 125 || storageGain >= 148) band = 'federated_h2_ldes_leader';
  else if (ldesIndex >= 85 || storageGain >= 102) band = 'h2_ldes_corridor';
  else if (ldesIndex >= 41 || storageGain >= 39) band = 'pilot_h2_ldes';

  let hydrogenLdesStorageRelief = clamp(ldesProxy * 8 + storageGain * 0.027 + bufferSynergy * 4.8, 0, 10.3);
  if (band === 'nascent_storage') hydrogenLdesStorageRelief *= 0.16;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      ldesIndex: clamp(ldesIndex, 0, 198),
      ldesBalance: clamp(ldesBalance, 0, 258),
      hydrogenLdesStorageRelief: clamp(hydrogenLdesStorageRelief, 0, 10.3),
      summary: `${params.regionId} H2 LDES ${band} · idx ${ldesIndex.toFixed(0)} · relief ${hydrogenLdesStorageRelief.toFixed(1)}`,
    },
    next: {
      ldesBalance: clamp(ldesBalance, 0, 258),
      ldesIndex: clamp(ldesIndex, 0, 198),
    },
  };
}

export function advanceRegionalExportBufferFederationOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  ldesStorageBand: V1014HydrogenLdesStorageBand;
  distributedBackupRelief: number;
  interconnectionFlexRelief: number;
  completedProjectTypes: string[];
  prev?: V1014ExportBufferFederationPersistedSlice | null;
}): { ledger: V1014RegionalExportBufferFederationLedger; next: V1014ExportBufferFederationPersistedSlice } {
  let bufferGain = 0;
  let bufferProxy = 0;
  let ldesSynergy = 0;
  for (const tpl of V1014_EXPORT_BUFFER_FEDERATION_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      bufferGain += tpl.bufferScoreEq;
      bufferProxy += tpl.bufferReliefFactor;
      ldesSynergy += tpl.ldesSynergyFactor;
    }
  }
  if (params.completedProjectTypes.includes('export_h2_federation_orchestration_hub')) {
    bufferGain += 12;
    bufferProxy += 0.05;
  }
  if (params.ldesStorageBand === 'h2_ldes_corridor' || params.ldesStorageBand === 'federated_h2_ldes_leader') {
    bufferGain += 19;
    ldesSynergy += 0.13;
  }
  if (params.distributedBackupRelief > 2.2) {
    bufferGain += params.distributedBackupRelief * 0.52;
    bufferProxy += clamp(params.distributedBackupRelief * 0.007, 0, 0.04);
  }
  if (params.interconnectionFlexRelief > 2.1) ldesSynergy += clamp(params.interconnectionFlexRelief * 0.008, 0, 0.04);

  const stressLoad = clamp(params.gridStressPoints * 0.13, 0, 5.8);
  const prevIdx = params.prev?.bufferIndex ?? 0;
  const bufferIndex = clamp(
    prevIdx * 0.79 + bufferGain * 0.1 + bufferProxy * 25 - stressLoad * 0.02 + ldesSynergy * 24,
    0,
    199,
  );

  let band: V1014ExportBufferFederationBand = 'volatile_export';
  if (bufferIndex >= 128 || bufferGain >= 152) band = 'deep_export_firming_mesh';
  else if (bufferIndex >= 88 || bufferGain >= 106) band = 'export_buffer_hub';
  else if (bufferIndex >= 43 || bufferGain >= 41) band = 'pilot_export_buffer';

  let exportBufferFederationRelief = clamp(bufferIndex / 17.8 + bufferProxy * 6.2 + ldesSynergy * 6.4, 0, 10.2);
  if (band === 'volatile_export') exportBufferFederationRelief = clamp(exportBufferFederationRelief * 0.14, 0, 1.5);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      bufferIndex: clamp(bufferIndex, 0, 199),
      exportBufferFederationRelief: clamp(exportBufferFederationRelief, 0, 10.2),
      summary: `${params.regionId} export buffer ${band} · idx ${bufferIndex.toFixed(0)} · relief ${exportBufferFederationRelief.toFixed(1)}`,
    },
    next: { bufferIndex: clamp(bufferIndex, 0, 199) },
  };
}

export function runAgent13H2LdesExportBufferScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_H2_LDES_STORAGE_CATALOG.length >= 4);
  ok(V1014_EXPORT_BUFFER_FEDERATION_CATALOG.length >= 4);

  const ldes = computeRegionalHydrogenLdesStorageLedger({
    regionId: 'QLD',
    exportHydrogenCorridorRelief: 2.7,
    maritimeShorePowerRelief: 2.5,
    decarbonCertificateStackRelief: 2.5,
    safeguardTradeBufferRelief: 2.4,
    communityEnergyResilienceRelief: 2.4,
    renewableShareScore: 55,
    completedProjectTypes: ['hydrogen_ldes_federation_hub', 'federation_hydrogen_ldes_tie'],
  });
  ok(ldes.ledger.hydrogenLdesStorageRelief >= 1.5 || ldes.ledger.band !== 'nascent_storage');

  const expBuf = advanceRegionalExportBufferFederationOrchestration({
    regionId: 'QLD',
    gridStressPoints: 15,
    ldesStorageBand: ldes.ledger.band,
    distributedBackupRelief: 2.5,
    interconnectionFlexRelief: 2.3,
    completedProjectTypes: ['export_firming_buffer_hub', 'certificate_linked_export_stack_corridor'],
  });
  ok(expBuf.ledger.exportBufferFederationRelief >= 1.2 || expBuf.ledger.band !== 'volatile_export');

  const turnSc = runAgent13H2LdesExportBufferTurnScenario(V1014_H2_LDES_EXPORT_BUFFER_TURN_SCENARIOS[0]);
  ok(turnSc.passed);

  const gi = scoreAgent13H2LdesExportBufferGIAlignment({
    actionText: 'Hydrogen LDES federation hub with export firming buffer and certificate-linked export stack corridor',
    ldesBand: 'h2_ldes_corridor',
    exportBufferBand: 'export_buffer_hub',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13H2LdesExportBufferTurnStep {
  turn: number;
  regionId: string;
  exportHydrogenCorridorRelief: number;
  maritimeShorePowerRelief: number;
  decarbonCertificateStackRelief: number;
  safeguardTradeBufferRelief: number;
  communityEnergyResilienceRelief: number;
  distributedBackupRelief: number;
  interconnectionFlexRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  completedProjectTypes: string[];
}

export interface Agent13H2LdesExportBufferTurnScenario {
  id: string;
  label: string;
  steps: Agent13H2LdesExportBufferTurnStep[];
  expect: { minLdesReliefOnLast?: number; minExportBufferReliefOnLast?: number };
}

export const V1014_H2_LDES_EXPORT_BUFFER_TURN_SCENARIOS: readonly Agent13H2LdesExportBufferTurnScenario[] = [
  {
    id: 'sc_he_qld_escalation',
    label: 'QLD hydrogen LDES with export buffer mesh',
    steps: [
      {
        turn: 1,
        regionId: 'QLD',
        exportHydrogenCorridorRelief: 2,
        maritimeShorePowerRelief: 1.9,
        decarbonCertificateStackRelief: 1.8,
        safeguardTradeBufferRelief: 1.8,
        communityEnergyResilienceRelief: 1.9,
        distributedBackupRelief: 1.8,
        interconnectionFlexRelief: 1.7,
        renewableShareScore: 44,
        gridStressPoints: 18,
        completedProjectTypes: ['hydrogen_ldes_federation_hub', 'export_firming_buffer_hub'],
      },
      {
        turn: 2,
        regionId: 'QLD',
        exportHydrogenCorridorRelief: 2.4,
        maritimeShorePowerRelief: 2.2,
        decarbonCertificateStackRelief: 2.1,
        safeguardTradeBufferRelief: 2.1,
        communityEnergyResilienceRelief: 2.2,
        distributedBackupRelief: 2.1,
        interconnectionFlexRelief: 2,
        renewableShareScore: 50,
        gridStressPoints: 16,
        completedProjectTypes: ['salt_cavern_h2_storage_corridor', 'maritime_export_queue_federation_mesh'],
      },
      {
        turn: 3,
        regionId: 'QLD',
        exportHydrogenCorridorRelief: 2.8,
        maritimeShorePowerRelief: 2.6,
        decarbonCertificateStackRelief: 2.5,
        safeguardTradeBufferRelief: 2.5,
        communityEnergyResilienceRelief: 2.5,
        distributedBackupRelief: 2.5,
        interconnectionFlexRelief: 2.4,
        renewableShareScore: 57,
        gridStressPoints: 14,
        completedProjectTypes: [
          'hydrogen_ldes_federation_hub',
          'salt_cavern_h2_storage_corridor',
          'electrolyzer_buffer_federation_mesh',
          'federation_hydrogen_ldes_tie',
          'export_firming_buffer_hub',
          'maritime_export_queue_federation_mesh',
          'certificate_linked_export_stack_corridor',
          'trade_exposed_export_firming_corridor',
          'export_h2_federation_orchestration_hub',
        ],
      },
    ],
    expect: { minLdesReliefOnLast: 1.5, minExportBufferReliefOnLast: 1.1 },
  },
] as const;

export function runAgent13H2LdesExportBufferTurnScenario(
  scenario: Agent13H2LdesExportBufferTurnScenario,
): { passed: boolean; detail: string; lastLdesRelief: number; lastExportBufferRelief: number } {
  let ldesMem: V1014HydrogenLdesStoragePersistedSlice | null = null;
  let bufMem: V1014ExportBufferFederationPersistedSlice | null = null;
  let lastLdesRelief = 0;
  let lastExportBufferRelief = 0;

  for (const step of scenario.steps) {
    const ldes = computeRegionalHydrogenLdesStorageLedger({
      regionId: step.regionId,
      exportHydrogenCorridorRelief: step.exportHydrogenCorridorRelief,
      maritimeShorePowerRelief: step.maritimeShorePowerRelief,
      decarbonCertificateStackRelief: step.decarbonCertificateStackRelief,
      safeguardTradeBufferRelief: step.safeguardTradeBufferRelief,
      communityEnergyResilienceRelief: step.communityEnergyResilienceRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: ldesMem,
    });
    ldesMem = ldes.next;
    lastLdesRelief = ldes.ledger.hydrogenLdesStorageRelief;

    const expBuf = advanceRegionalExportBufferFederationOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      ldesStorageBand: ldes.ledger.band,
      distributedBackupRelief: step.distributedBackupRelief,
      interconnectionFlexRelief: step.interconnectionFlexRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: bufMem,
    });
    bufMem = expBuf.next;
    lastExportBufferRelief = expBuf.ledger.exportBufferFederationRelief;
  }

  if (scenario.expect.minLdesReliefOnLast != null && lastLdesRelief < scenario.expect.minLdesReliefOnLast) {
    return { passed: false, detail: `ldes ${lastLdesRelief}`, lastLdesRelief, lastExportBufferRelief };
  }
  if (scenario.expect.minExportBufferReliefOnLast != null && lastExportBufferRelief < scenario.expect.minExportBufferReliefOnLast) {
    return { passed: false, detail: `buf ${lastExportBufferRelief}`, lastLdesRelief, lastExportBufferRelief };
  }
  return { passed: true, detail: 'ok', lastLdesRelief, lastExportBufferRelief };
}

export function scoreAgent13H2LdesExportBufferGIAlignment(params: {
  actionText: string;
  ldesBand?: string;
  exportBufferBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'hydrogen ldes',
    'ldes',
    'salt cavern',
    'electrolyzer buffer',
    'export firming',
    'export buffer',
    'maritime export',
    'certificate-linked export',
    'h2 storage',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.14, 0, 2);
  if (params.ldesBand === 'federated_h2_ldes_leader' || params.ldesBand === 'h2_ldes_corridor') {
    delta += hits.some(h => h.includes('ldes') || h.includes('hydrogen') || h.includes('storage')) ? 0.33 : 0.08;
  }
  if (params.exportBufferBand === 'export_buffer_hub' || params.exportBufferBand === 'deep_export_firming_mesh') {
    delta += hits.some(h => h.includes('export') || h.includes('firming') || h.includes('buffer')) ? 0.31 : 0.08;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `H2 LDES export GI: ${hits.slice(0, 2).join(', ')} aligns with hydrogen LDES storage and export buffer federation depth.`
        : null,
  };
}
