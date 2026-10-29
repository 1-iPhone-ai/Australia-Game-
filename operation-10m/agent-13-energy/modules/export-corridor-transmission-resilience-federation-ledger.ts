/**
 * Agent 13 scale wave round 48 (O10-227) — export corridor transmission & resilience federation orchestration depth.
 */

export type V1014ExportCorridorTransmissionBand =
  | 'isolated_export'
  | 'pilot_export_corridor'
  | 'export_transmission_corridor'
  | 'federated_export_transmission_leader';

export type V1014TransmissionResilienceFederationBand =
  | 'fragile_resilience_mesh'
  | 'pilot_resilience_fed'
  | 'transmission_resilience_hub'
  | 'deep_export_resilience_mesh';

export interface V1014ExportCorridorTransmissionInstrument {
  id: string;
  kind:
    | 'export_corridor_transmission_hub'
    | 'green_hydrogen_export_corridor'
    | 'transmission_resilience_orchestration_mesh'
    | 'federation_export_corridor_transmission_tie';
  label: string;
  exportScoreEq: number;
  exportReliefFactor: number;
  resilienceSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_EXPORT_CORRIDOR_TRANSMISSION_CATALOG: readonly V1014ExportCorridorTransmissionInstrument[] = [
  {
    id: 'ect_hub',
    kind: 'export_corridor_transmission_hub',
    label: 'Export corridor transmission hub',
    exportScoreEq: 48,
    exportReliefFactor: 0.17,
    resilienceSynergyFactor: 0.12,
    projectTypeHint: 'export_corridor_transmission_hub',
  },
  {
    id: 'ect_h2',
    kind: 'green_hydrogen_export_corridor',
    label: 'Green hydrogen export corridor',
    exportScoreEq: 46,
    exportReliefFactor: 0.16,
    resilienceSynergyFactor: 0.13,
    projectTypeHint: 'green_hydrogen_export_corridor',
  },
  {
    id: 'ect_mesh',
    kind: 'transmission_resilience_orchestration_mesh',
    label: 'Transmission resilience orchestration mesh',
    exportScoreEq: 50,
    exportReliefFactor: 0.18,
    resilienceSynergyFactor: 0.11,
    projectTypeHint: 'transmission_resilience_orchestration_mesh',
  },
  {
    id: 'ect_fed',
    kind: 'federation_export_corridor_transmission_tie',
    label: 'Federation export corridor transmission tie',
    exportScoreEq: 52,
    exportReliefFactor: 0.17,
    resilienceSynergyFactor: 0.14,
    projectTypeHint: 'federation_export_corridor_transmission_tie',
  },
] as const;

export interface V1014TransmissionResilienceFederationTemplate {
  id: string;
  kind:
    | 'renewable_export_load_stack'
    | 'transmission_coupling_resilience_hub'
    | 'national_export_transmission_mesh'
    | 'export_energy_security_corridor';
  label: string;
  resilienceScoreEq: number;
  resilienceReliefFactor: number;
  exportSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_TRANSMISSION_RESILIENCE_FEDERATION_CATALOG: readonly V1014TransmissionResilienceFederationTemplate[] = [
  {
    id: 'tr_stack',
    kind: 'renewable_export_load_stack',
    label: 'Renewable export load stack',
    resilienceScoreEq: 47,
    resilienceReliefFactor: 0.16,
    exportSynergyFactor: 0.12,
    projectTypeHint: 'renewable_export_load_stack',
  },
  {
    id: 'tr_couple',
    kind: 'transmission_coupling_resilience_hub',
    label: 'Transmission coupling resilience hub',
    resilienceScoreEq: 49,
    resilienceReliefFactor: 0.17,
    exportSynergyFactor: 0.13,
    projectTypeHint: 'transmission_coupling_resilience_hub',
  },
  {
    id: 'tr_mesh',
    kind: 'national_export_transmission_mesh',
    label: 'National export transmission mesh',
    resilienceScoreEq: 51,
    resilienceReliefFactor: 0.18,
    exportSynergyFactor: 0.11,
    projectTypeHint: 'national_export_transmission_mesh',
  },
  {
    id: 'tr_sec',
    kind: 'export_energy_security_corridor',
    label: 'Export energy security corridor',
    resilienceScoreEq: 45,
    resilienceReliefFactor: 0.15,
    exportSynergyFactor: 0.11,
    projectTypeHint: 'export_energy_security_corridor',
  },
] as const;

export interface V1014RegionalExportCorridorTransmissionLedger {
  regionId: string;
  band: V1014ExportCorridorTransmissionBand;
  exportIndex: number;
  exportBalance: number;
  exportCorridorTransmissionRelief: number;
  summary: string;
}

export interface V1014RegionalTransmissionResilienceFederationLedger {
  regionId: string;
  band: V1014TransmissionResilienceFederationBand;
  resilienceIndex: number;
  transmissionResilienceFederationRelief: number;
  summary: string;
}

export interface V1014ExportCorridorTransmissionPersistedSlice {
  exportBalance: number;
  exportIndex: number;
}

export interface V1014TransmissionResilienceFederationPersistedSlice {
  resilienceIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const EXPORT_CORRIDOR_HUB_REGIONS = new Set(['QLD', 'NSW', 'VIC', 'WA']);

export function computeRegionalExportCorridorTransmissionLedger(params: {
  regionId: string;
  sovereignInterconnectorRelief: number;
  criticalInfrastructureFederationRelief: number;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  safeguardCertificateRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014ExportCorridorTransmissionPersistedSlice | null;
}): { ledger: V1014RegionalExportCorridorTransmissionLedger; next: V1014ExportCorridorTransmissionPersistedSlice } {
  let exportGain = 0;
  let exportProxy = 0;
  let resilienceSynergy = 0;
  for (const inst of V1014_EXPORT_CORRIDOR_TRANSMISSION_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      exportGain += inst.exportScoreEq;
      exportProxy += inst.exportReliefFactor;
      resilienceSynergy += inst.resilienceSynergyFactor;
    }
  }
  if (params.completedProjectTypes.includes('export_corridor_recovery_hub')) {
    exportGain += 14;
    exportProxy += 0.05;
  }
  if (EXPORT_CORRIDOR_HUB_REGIONS.has(params.regionId)) exportProxy += 0.07;
  else exportProxy *= 0.68;
  if (params.sovereignInterconnectorRelief > 2.4) resilienceSynergy += clamp(params.sovereignInterconnectorRelief * 0.009, 0, 0.05);
  if (params.criticalInfrastructureFederationRelief > 2.3) exportGain += clamp(params.criticalInfrastructureFederationRelief * 0.5, 0, 6.5);
  if (params.interregionalInterconnectionRelief > 2.2) {
    exportGain += clamp(params.interregionalInterconnectionRelief * 0.6, 0, 7.2);
    exportProxy += clamp(params.interregionalInterconnectionRelief * 0.008, 0, 0.04);
  }
  if (params.decarbonFederationRelief > 2.2) resilienceSynergy += clamp(params.decarbonFederationRelief * 0.01, 0, 0.05);
  if (params.safeguardCertificateRelief > 2.2) exportProxy += clamp(params.safeguardCertificateRelief * 0.008, 0, 0.04);
  exportProxy += clamp(params.renewableShareScore / 110, 0, 0.09);

  const prevIdx = params.prev?.exportIndex ?? 0;
  const prevBal = params.prev?.exportBalance ?? 0;
  const exportBalance = clamp(prevBal * 0.78 + exportGain * 0.11, 0, 262);
  const exportIndex = clamp(prevIdx * 0.75 + exportBalance * 0.1 + exportProxy * 76 + resilienceSynergy * 27, 0, 208);

  let band: V1014ExportCorridorTransmissionBand = 'isolated_export';
  if (exportIndex >= 132 || exportGain >= 155) band = 'federated_export_transmission_leader';
  else if (exportIndex >= 92 || exportGain >= 110) band = 'export_transmission_corridor';
  else if (exportIndex >= 46 || exportGain >= 44) band = 'pilot_export_corridor';

  let exportCorridorTransmissionRelief = clamp(exportProxy * 8.1 + exportGain * 0.028 + resilienceSynergy * 5.2, 0, 10.8);
  if (band === 'isolated_export') exportCorridorTransmissionRelief *= 0.13;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      exportIndex: clamp(exportIndex, 0, 208),
      exportBalance: clamp(exportBalance, 0, 262),
      exportCorridorTransmissionRelief: clamp(exportCorridorTransmissionRelief, 0, 10.8),
      summary: `${params.regionId} export corridor ${band} · idx ${exportIndex.toFixed(0)} · relief ${exportCorridorTransmissionRelief.toFixed(1)}`,
    },
    next: {
      exportBalance: clamp(exportBalance, 0, 262),
      exportIndex: clamp(exportIndex, 0, 208),
    },
  };
}

export function advanceRegionalTransmissionResilienceFederationOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  exportCorridorBand: V1014ExportCorridorTransmissionBand;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  completedProjectTypes: string[];
  prev?: V1014TransmissionResilienceFederationPersistedSlice | null;
}): { ledger: V1014RegionalTransmissionResilienceFederationLedger; next: V1014TransmissionResilienceFederationPersistedSlice } {
  let resilienceGain = 0;
  let resilienceProxy = 0;
  let exportSynergy = 0;
  for (const tpl of V1014_TRANSMISSION_RESILIENCE_FEDERATION_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      resilienceGain += tpl.resilienceScoreEq;
      resilienceProxy += tpl.resilienceReliefFactor;
      exportSynergy += tpl.exportSynergyFactor;
    }
  }
  if (params.exportCorridorBand === 'export_transmission_corridor' || params.exportCorridorBand === 'federated_export_transmission_leader') {
    resilienceGain += 20;
    exportSynergy += 0.14;
  }
  if (params.interregionalInterconnectionRelief > 2.2) {
    resilienceGain += params.interregionalInterconnectionRelief * 0.55;
    resilienceProxy += clamp(params.interregionalInterconnectionRelief * 0.008, 0, 0.04);
  }
  if (params.decarbonFederationRelief > 2.2) exportSynergy += clamp(params.decarbonFederationRelief * 0.009, 0, 0.04);

  const stressLoad = clamp(params.gridStressPoints * 0.16, 0, 6.6);
  const prevIdx = params.prev?.resilienceIndex ?? 0;
  const resilienceIndex = clamp(
    prevIdx * 0.74 + resilienceGain * 0.11 + resilienceProxy * 27 - stressLoad * 0.022 + exportSynergy * 28,
    0,
    208,
  );

  let band: V1014TransmissionResilienceFederationBand = 'fragile_resilience_mesh';
  if (resilienceIndex >= 134 || resilienceGain >= 160) band = 'deep_export_resilience_mesh';
  else if (resilienceIndex >= 94 || resilienceGain >= 114) band = 'transmission_resilience_hub';
  else if (resilienceIndex >= 48 || resilienceGain >= 46) band = 'pilot_resilience_fed';

  let transmissionResilienceFederationRelief = clamp(resilienceIndex / 16.5 + resilienceProxy * 6.5 + exportSynergy * 7.1, 0, 10.7);
  if (band === 'fragile_resilience_mesh') transmissionResilienceFederationRelief = clamp(transmissionResilienceFederationRelief * 0.12, 0, 1.25);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      resilienceIndex: clamp(resilienceIndex, 0, 208),
      transmissionResilienceFederationRelief: clamp(transmissionResilienceFederationRelief, 0, 10.7),
      summary: `${params.regionId} transmission resilience ${band} · idx ${resilienceIndex.toFixed(0)} · relief ${transmissionResilienceFederationRelief.toFixed(1)}`,
    },
    next: { resilienceIndex: clamp(resilienceIndex, 0, 208) },
  };
}

export function runAgent13ExportCorridorTransmissionResilienceScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_EXPORT_CORRIDOR_TRANSMISSION_CATALOG.length >= 4);
  ok(V1014_TRANSMISSION_RESILIENCE_FEDERATION_CATALOG.length >= 4);

  const exportStep = computeRegionalExportCorridorTransmissionLedger({
    regionId: 'NSW',
    sovereignInterconnectorRelief: 2.6,
    criticalInfrastructureFederationRelief: 2.5,
    interregionalInterconnectionRelief: 2.7,
    decarbonFederationRelief: 2.5,
    safeguardCertificateRelief: 2.4,
    renewableShareScore: 56,
    completedProjectTypes: ['export_corridor_transmission_hub', 'federation_export_corridor_transmission_tie', 'export_corridor_recovery_hub'],
  });
  ok(exportStep.ledger.exportCorridorTransmissionRelief >= 1.5 || exportStep.ledger.band !== 'isolated_export');

  const fed = advanceRegionalTransmissionResilienceFederationOrchestration({
    regionId: 'NSW',
    gridStressPoints: 15,
    exportCorridorBand: exportStep.ledger.band,
    interregionalInterconnectionRelief: 2.6,
    decarbonFederationRelief: 2.5,
    completedProjectTypes: ['renewable_export_load_stack', 'transmission_coupling_resilience_hub'],
  });
  ok(fed.ledger.transmissionResilienceFederationRelief >= 1.25 || fed.ledger.band !== 'fragile_resilience_mesh');

  const turnSc = runAgent13ExportCorridorTransmissionResilienceTurnScenario(V1014_EXPORT_CORRIDOR_TRANSMISSION_RESILIENCE_TURN_SCENARIOS[0]);
  ok(turnSc.passed);

  const gi = scoreAgent13ExportCorridorTransmissionResilienceGIAlignment({
    actionText:
      'Export corridor transmission hub with green hydrogen export corridor, transmission resilience orchestration mesh, renewable export load stack, and transmission coupling resilience hub',
    exportCorridorBand: 'export_transmission_corridor',
    transmissionResilienceBand: 'transmission_resilience_hub',
  });
  ok(gi.relevanceDelta > 0.85 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13ExportCorridorTransmissionResilienceTurnStep {
  turn: number;
  regionId: string;
  sovereignInterconnectorRelief: number;
  criticalInfrastructureFederationRelief: number;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  safeguardCertificateRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  completedProjectTypes: string[];
}

export interface Agent13ExportCorridorTransmissionResilienceTurnScenario {
  id: string;
  label: string;
  steps: Agent13ExportCorridorTransmissionResilienceTurnStep[];
  expect: { minExportReliefOnLast?: number; minTransmissionResilienceReliefOnLast?: number };
}

export const V1014_EXPORT_CORRIDOR_TRANSMISSION_RESILIENCE_TURN_SCENARIOS: readonly Agent13ExportCorridorTransmissionResilienceTurnScenario[] = [
  {
    id: 'sc_ect_nsw_escalation',
    label: 'NSW export corridor with transmission resilience mesh',
    steps: [
      {
        turn: 1,
        regionId: 'NSW',
        sovereignInterconnectorRelief: 2,
        criticalInfrastructureFederationRelief: 1.9,
        interregionalInterconnectionRelief: 2.1,
        decarbonFederationRelief: 2,
        safeguardCertificateRelief: 1.9,
        renewableShareScore: 44,
        gridStressPoints: 18,
        completedProjectTypes: ['export_corridor_transmission_hub', 'renewable_export_load_stack'],
      },
      {
        turn: 2,
        regionId: 'NSW',
        sovereignInterconnectorRelief: 2.3,
        criticalInfrastructureFederationRelief: 2.2,
        interregionalInterconnectionRelief: 2.4,
        decarbonFederationRelief: 2.3,
        safeguardCertificateRelief: 2.2,
        renewableShareScore: 50,
        gridStressPoints: 17,
        completedProjectTypes: ['green_hydrogen_export_corridor', 'national_export_transmission_mesh'],
      },
      {
        turn: 3,
        regionId: 'NSW',
        sovereignInterconnectorRelief: 2.7,
        criticalInfrastructureFederationRelief: 2.6,
        interregionalInterconnectionRelief: 2.8,
        decarbonFederationRelief: 2.7,
        safeguardCertificateRelief: 2.6,
        renewableShareScore: 57,
        gridStressPoints: 15,
        completedProjectTypes: [
          'export_corridor_transmission_hub',
          'green_hydrogen_export_corridor',
          'transmission_resilience_orchestration_mesh',
          'federation_export_corridor_transmission_tie',
          'export_corridor_recovery_hub',
          'renewable_export_load_stack',
          'transmission_coupling_resilience_hub',
          'national_export_transmission_mesh',
          'export_energy_security_corridor',
        ],
      },
    ],
    expect: { minExportReliefOnLast: 1.45, minTransmissionResilienceReliefOnLast: 1.15 },
  },
] as const;

export function runAgent13ExportCorridorTransmissionResilienceTurnScenario(
  scenario: Agent13ExportCorridorTransmissionResilienceTurnScenario,
): { passed: boolean; detail: string; lastExportRelief: number; lastTransmissionResilienceRelief: number } {
  let exportMem: V1014ExportCorridorTransmissionPersistedSlice | null = null;
  let fedMem: V1014TransmissionResilienceFederationPersistedSlice | null = null;
  let lastExportRelief = 0;
  let lastTransmissionResilienceRelief = 0;

  for (const step of scenario.steps) {
    const exportStep = computeRegionalExportCorridorTransmissionLedger({
      regionId: step.regionId,
      sovereignInterconnectorRelief: step.sovereignInterconnectorRelief,
      criticalInfrastructureFederationRelief: step.criticalInfrastructureFederationRelief,
      interregionalInterconnectionRelief: step.interregionalInterconnectionRelief,
      decarbonFederationRelief: step.decarbonFederationRelief,
      safeguardCertificateRelief: step.safeguardCertificateRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: exportMem,
    });
    exportMem = exportStep.next;
    lastExportRelief = exportStep.ledger.exportCorridorTransmissionRelief;

    const fed = advanceRegionalTransmissionResilienceFederationOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      exportCorridorBand: exportStep.ledger.band,
      interregionalInterconnectionRelief: step.interregionalInterconnectionRelief,
      decarbonFederationRelief: step.decarbonFederationRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: fedMem,
    });
    fedMem = fed.next;
    lastTransmissionResilienceRelief = fed.ledger.transmissionResilienceFederationRelief;
  }

  if (scenario.expect.minExportReliefOnLast != null && lastExportRelief < scenario.expect.minExportReliefOnLast) {
    return { passed: false, detail: `export ${lastExportRelief}`, lastExportRelief, lastTransmissionResilienceRelief };
  }
  if (scenario.expect.minTransmissionResilienceReliefOnLast != null && lastTransmissionResilienceRelief < scenario.expect.minTransmissionResilienceReliefOnLast) {
    return { passed: false, detail: `fed ${lastTransmissionResilienceRelief}`, lastExportRelief, lastTransmissionResilienceRelief };
  }
  return { passed: true, detail: 'ok', lastExportRelief, lastTransmissionResilienceRelief };
}

export function scoreAgent13ExportCorridorTransmissionResilienceGIAlignment(params: {
  actionText: string;
  exportCorridorBand?: string;
  transmissionResilienceBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'export corridor',
    'green hydrogen export',
    'transmission resilience',
    'export transmission',
    'renewable export',
    'transmission coupling',
    'national export',
    'export energy security',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.12, 0, 2);
  if (params.exportCorridorBand === 'federated_export_transmission_leader' || params.exportCorridorBand === 'export_transmission_corridor') {
    delta += hits.some(h => h.includes('export')) ? 0.35 : 0.08;
  }
  if (params.transmissionResilienceBand === 'transmission_resilience_hub' || params.transmissionResilienceBand === 'deep_export_resilience_mesh') {
    delta += hits.some(h => h.includes('transmission') || h.includes('resilience')) ? 0.33 : 0.08;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Export corridor GI: ${hits.slice(0, 2).join(', ')} aligns with sovereign export transmission and resilience federation depth.`
        : null,
  };
}
