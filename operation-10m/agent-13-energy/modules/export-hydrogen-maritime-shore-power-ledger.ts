/**
 * Agent 13 scale wave round 38 (O10-207) — compound export hydrogen corridor & maritime shore power federation orchestration depth.
 */

export type V1014ExportHydrogenCorridorBand =
  | 'nascent_export'
  | 'pilot_h2_corridor'
  | 'export_h2_corridor'
  | 'federated_h2_export_leader';

export type V1014MaritimeShorePowerBand =
  | 'unplugged_ports'
  | 'pilot_shore_power'
  | 'shore_power_hub'
  | 'deep_maritime_electrification_mesh';

export interface V1014ExportHydrogenCorridorInstrument {
  id: string;
  kind: 'export_h2_federation_hub' | 'ammonia_wheeling_corridor' | 'offshore_h2_export_mesh' | 'federation_h2_corridor_tie';
  label: string;
  exportScoreEq: number;
  corridorReliefFactor: number;
  shorePowerSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_EXPORT_H2_CORRIDOR_CATALOG: readonly V1014ExportHydrogenCorridorInstrument[] = [
  {
    id: 'eh2_hub',
    kind: 'export_h2_federation_hub',
    label: 'Export hydrogen federation hub',
    exportScoreEq: 48,
    corridorReliefFactor: 0.16,
    shorePowerSynergyFactor: 0.11,
    projectTypeHint: 'export_h2_federation_orchestration_hub',
  },
  {
    id: 'eh2_ammonia',
    kind: 'ammonia_wheeling_corridor',
    label: 'Ammonia export wheeling corridor',
    exportScoreEq: 46,
    corridorReliefFactor: 0.15,
    shorePowerSynergyFactor: 0.12,
    projectTypeHint: 'ammonia_export_federation_corridor',
  },
  {
    id: 'eh2_offshore',
    kind: 'offshore_h2_export_mesh',
    label: 'Offshore hydrogen export mesh',
    exportScoreEq: 50,
    corridorReliefFactor: 0.17,
    shorePowerSynergyFactor: 0.1,
    projectTypeHint: 'offshore_h2_export_federation_mesh',
  },
  {
    id: 'eh2_fed',
    kind: 'federation_h2_corridor_tie',
    label: 'Federation H2 export corridor tie',
    exportScoreEq: 52,
    corridorReliefFactor: 0.16,
    shorePowerSynergyFactor: 0.13,
    projectTypeHint: 'federation_h2_export_corridor_tie',
  },
] as const;

export interface V1014MaritimeShorePowerTemplate {
  id: string;
  kind: 'cold_ironing_federation' | 'shore_power_orchestration' | 'port_cargo_electrification' | 'hydrogen_bunkering_shore_mesh';
  label: string;
  shoreScoreEq: number;
  shoreReliefFactor: number;
  h2CorridorSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_MARITIME_SHORE_POWER_CATALOG: readonly V1014MaritimeShorePowerTemplate[] = [
  {
    id: 'msp_cold',
    kind: 'cold_ironing_federation',
    label: 'Cold-ironing federation corridor',
    shoreScoreEq: 45,
    shoreReliefFactor: 0.15,
    h2CorridorSynergyFactor: 0.1,
    projectTypeHint: 'cold_ironing_federation_corridor',
  },
  {
    id: 'msp_hub',
    kind: 'shore_power_orchestration',
    label: 'Maritime shore-power orchestration hub',
    shoreScoreEq: 47,
    shoreReliefFactor: 0.16,
    h2CorridorSynergyFactor: 0.11,
    projectTypeHint: 'maritime_shore_power_orchestration_hub',
  },
  {
    id: 'msp_cargo',
    kind: 'port_cargo_electrification',
    label: 'Port cargo electrification mesh',
    shoreScoreEq: 44,
    shoreReliefFactor: 0.14,
    h2CorridorSynergyFactor: 0.12,
    projectTypeHint: 'port_cargo_electrification_federation_mesh',
  },
  {
    id: 'msp_bunker',
    kind: 'hydrogen_bunkering_shore_mesh',
    label: 'Hydrogen bunkering shore mesh',
    shoreScoreEq: 49,
    shoreReliefFactor: 0.17,
    h2CorridorSynergyFactor: 0.13,
    projectTypeHint: 'hydrogen_bunkering_federation_mesh',
  },
] as const;

export interface V1014RegionalExportHydrogenCorridorLedger {
  regionId: string;
  band: V1014ExportHydrogenCorridorBand;
  exportIndex: number;
  exportBalance: number;
  exportHydrogenCorridorRelief: number;
  summary: string;
}

export interface V1014RegionalMaritimeShorePowerLedger {
  regionId: string;
  band: V1014MaritimeShorePowerBand;
  shoreIndex: number;
  maritimeShorePowerRelief: number;
  summary: string;
}

export interface V1014ExportHydrogenCorridorPersistedSlice {
  exportBalance: number;
  exportIndex: number;
}

export interface V1014MaritimeShorePowerPersistedSlice {
  shoreIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const H2_EXPORT_HUB_REGIONS = new Set(['QLD', 'WA', 'NSW', 'VIC', 'SA']);

export function computeRegionalExportHydrogenCorridorLedger(params: {
  regionId: string;
  communityEnergyResilienceRelief: number;
  distributedBackupRelief: number;
  resilienceBand: string;
  backupBand: string;
  greenHydrogenExportRelief: number;
  portGreenCorridorRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014ExportHydrogenCorridorPersistedSlice | null;
}): { ledger: V1014RegionalExportHydrogenCorridorLedger; next: V1014ExportHydrogenCorridorPersistedSlice } {
  let exportGain = 0;
  let corridorProxy = 0;
  let shoreSynergy = 0;
  for (const inst of V1014_EXPORT_H2_CORRIDOR_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      exportGain += inst.exportScoreEq;
      corridorProxy += inst.corridorReliefFactor;
      shoreSynergy += inst.shorePowerSynergyFactor;
    }
  }
  if (params.completedProjectTypes.includes('green_hydrogen_export_terminal_backbone')) {
    exportGain += 12;
    corridorProxy += 0.04;
  }
  if (params.completedProjectTypes.includes('ammonia_export_corridor_orchestration')) {
    exportGain += 10;
    shoreSynergy += 0.05;
  }
  if (H2_EXPORT_HUB_REGIONS.has(params.regionId)) corridorProxy += 0.06;
  else corridorProxy *= 0.71;
  if (params.communityEnergyResilienceRelief > 2.4) {
    exportGain += clamp(params.communityEnergyResilienceRelief * 0.68, 0, 9);
  }
  if (params.distributedBackupRelief > 2.3) shoreSynergy += clamp(params.distributedBackupRelief * 0.01, 0, 0.06);
  if (params.resilienceBand === 'resilience_corridor' || params.resilienceBand === 'federated_community_resilience_leader') {
    corridorProxy += 0.05;
  }
  if (params.greenHydrogenExportRelief > 2.7) {
    exportGain += params.greenHydrogenExportRelief * 0.75;
    corridorProxy += clamp(params.greenHydrogenExportRelief * 0.007, 0, 0.04);
  }
  if (params.portGreenCorridorRelief > 2.6) shoreSynergy += clamp(params.portGreenCorridorRelief * 0.009, 0, 0.05);
  corridorProxy += clamp(params.renewableShareScore / 103, 0, 0.1);

  const prevIdx = params.prev?.exportIndex ?? 0;
  const prevBal = params.prev?.exportBalance ?? 0;
  const exportBalance = clamp(prevBal * 0.84 + exportGain * 0.1, 0, 248);
  const exportIndex = clamp(prevIdx * 0.81 + exportBalance * 0.09 + corridorProxy * 75 + shoreSynergy * 22, 0, 190);

  let band: V1014ExportHydrogenCorridorBand = 'nascent_export';
  if (exportIndex >= 120 || exportGain >= 138) band = 'federated_h2_export_leader';
  else if (exportIndex >= 80 || exportGain >= 92) band = 'export_h2_corridor';
  else if (exportIndex >= 37 || exportGain >= 35) band = 'pilot_h2_corridor';

  let exportHydrogenCorridorRelief = clamp(corridorProxy * 7.7 + exportGain * 0.026 + shoreSynergy * 4.5, 0, 9.9);
  if (band === 'nascent_export') exportHydrogenCorridorRelief *= 0.2;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      exportIndex: clamp(exportIndex, 0, 190),
      exportBalance: clamp(exportBalance, 0, 248),
      exportHydrogenCorridorRelief: clamp(exportHydrogenCorridorRelief, 0, 9.9),
      summary: `${params.regionId} H2 export ${band} · idx ${exportIndex.toFixed(0)} · relief ${exportHydrogenCorridorRelief.toFixed(1)}`,
    },
    next: { exportBalance: clamp(exportBalance, 0, 248), exportIndex: clamp(exportIndex, 0, 190) },
  };
}

export function advanceRegionalMaritimeShorePowerOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  h2CorridorBand: V1014ExportHydrogenCorridorBand;
  offshoreShoreElectrificationRelief: number;
  completedProjectTypes: string[];
  prev?: V1014MaritimeShorePowerPersistedSlice | null;
}): { ledger: V1014RegionalMaritimeShorePowerLedger; next: V1014MaritimeShorePowerPersistedSlice } {
  let shoreGain = 0;
  let shoreProxy = 0;
  let h2Synergy = 0;
  for (const tpl of V1014_MARITIME_SHORE_POWER_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      shoreGain += tpl.shoreScoreEq;
      shoreProxy += tpl.shoreReliefFactor;
      h2Synergy += tpl.h2CorridorSynergyFactor;
    }
  }
  if (params.completedProjectTypes.includes('shore_power_cold_ironing_corridor')) {
    shoreGain += 11;
    shoreProxy += 0.04;
  }
  if (params.h2CorridorBand === 'export_h2_corridor' || params.h2CorridorBand === 'federated_h2_export_leader') {
    shoreGain += 18;
    h2Synergy += 0.1;
  }
  if (params.offshoreShoreElectrificationRelief > 2.5) {
    shoreGain += params.offshoreShoreElectrificationRelief * 0.64;
    shoreProxy += clamp(params.offshoreShoreElectrificationRelief * 0.007, 0, 0.04);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.17, 0, 7.2);
  const prevIdx = params.prev?.shoreIndex ?? 0;
  const shoreIndex = clamp(
    prevIdx * 0.82 + shoreGain * 0.1 + shoreProxy * 25 - stressLoad * 0.021 + h2Synergy * 22,
    0,
    192,
  );

  let band: V1014MaritimeShorePowerBand = 'unplugged_ports';
  if (shoreIndex >= 123 || shoreGain >= 144) band = 'deep_maritime_electrification_mesh';
  else if (shoreIndex >= 83 || shoreGain >= 98) band = 'shore_power_hub';
  else if (shoreIndex >= 38 || shoreGain >= 36) band = 'pilot_shore_power';

  let maritimeShorePowerRelief = clamp(shoreIndex / 18.2 + shoreProxy * 6 + h2Synergy * 6.2, 0, 9.6);
  if (band === 'unplugged_ports') maritimeShorePowerRelief = clamp(maritimeShorePowerRelief * 0.18, 0, 1.9);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      shoreIndex: clamp(shoreIndex, 0, 192),
      maritimeShorePowerRelief: clamp(maritimeShorePowerRelief, 0, 9.6),
      summary: `${params.regionId} shore power ${band} · idx ${shoreIndex.toFixed(0)} · relief ${maritimeShorePowerRelief.toFixed(1)}`,
    },
    next: { shoreIndex: clamp(shoreIndex, 0, 192) },
  };
}

export function runAgent13H2MaritimeScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_EXPORT_H2_CORRIDOR_CATALOG.length >= 4);
  ok(V1014_MARITIME_SHORE_POWER_CATALOG.length >= 4);

  const h2 = computeRegionalExportHydrogenCorridorLedger({
    regionId: 'QLD',
    communityEnergyResilienceRelief: 2.7,
    distributedBackupRelief: 2.6,
    resilienceBand: 'resilience_corridor',
    backupBand: 'backup_hub',
    greenHydrogenExportRelief: 2.9,
    portGreenCorridorRelief: 2.7,
    renewableShareScore: 54,
    completedProjectTypes: [
      'export_h2_federation_orchestration_hub',
      'federation_h2_export_corridor_tie',
      'green_hydrogen_export_terminal_backbone',
    ],
  });
  ok(h2.ledger.exportHydrogenCorridorRelief >= 1.6 || h2.ledger.band !== 'nascent_export');

  const shore = advanceRegionalMaritimeShorePowerOrchestration({
    regionId: 'QLD',
    gridStressPoints: 14,
    h2CorridorBand: h2.ledger.band,
    offshoreShoreElectrificationRelief: 2.6,
    completedProjectTypes: ['maritime_shore_power_orchestration_hub', 'hydrogen_bunkering_federation_mesh'],
  });
  ok(shore.ledger.maritimeShorePowerRelief >= 1.3 || shore.ledger.band !== 'unplugged_ports');

  const turnSc = runAgent13H2MaritimeTurnScenario(V1014_H2_MARITIME_TURN_SCENARIOS[0]);
  ok(turnSc.passed);

  const gi = scoreAgent13H2MaritimeGIAlignment({
    actionText: 'Export hydrogen federation hub with maritime shore-power orchestration and cold-ironing corridor',
    h2Band: 'export_h2_corridor',
    shoreBand: 'shore_power_hub',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13H2MaritimeTurnStep {
  turn: number;
  regionId: string;
  communityEnergyResilienceRelief: number;
  distributedBackupRelief: number;
  greenHydrogenExportRelief: number;
  portGreenCorridorRelief: number;
  offshoreShoreElectrificationRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  completedProjectTypes: string[];
}

export interface Agent13H2MaritimeTurnScenario {
  id: string;
  label: string;
  steps: Agent13H2MaritimeTurnStep[];
  expect: { minH2ReliefOnLast?: number; minShoreReliefOnLast?: number };
}

export const V1014_H2_MARITIME_TURN_SCENARIOS: readonly Agent13H2MaritimeTurnScenario[] = [
  {
    id: 'sc_hm_qld_escalation',
    label: 'QLD federated H2 export with maritime mesh',
    steps: [
      {
        turn: 1,
        regionId: 'QLD',
        communityEnergyResilienceRelief: 2,
        distributedBackupRelief: 1.9,
        greenHydrogenExportRelief: 2.1,
        portGreenCorridorRelief: 2,
        offshoreShoreElectrificationRelief: 2,
        renewableShareScore: 43,
        gridStressPoints: 16,
        completedProjectTypes: ['export_h2_federation_orchestration_hub', 'cold_ironing_federation_corridor'],
      },
      {
        turn: 2,
        regionId: 'QLD',
        communityEnergyResilienceRelief: 2.4,
        distributedBackupRelief: 2.3,
        greenHydrogenExportRelief: 2.5,
        portGreenCorridorRelief: 2.4,
        offshoreShoreElectrificationRelief: 2.3,
        renewableShareScore: 49,
        gridStressPoints: 15,
        completedProjectTypes: ['ammonia_export_federation_corridor', 'maritime_shore_power_orchestration_hub'],
      },
      {
        turn: 3,
        regionId: 'QLD',
        communityEnergyResilienceRelief: 2.8,
        distributedBackupRelief: 2.7,
        greenHydrogenExportRelief: 2.9,
        portGreenCorridorRelief: 2.7,
        offshoreShoreElectrificationRelief: 2.6,
        renewableShareScore: 55,
        gridStressPoints: 13,
        completedProjectTypes: [
          'export_h2_federation_orchestration_hub',
          'ammonia_export_federation_corridor',
          'offshore_h2_export_federation_mesh',
          'federation_h2_export_corridor_tie',
          'green_hydrogen_export_terminal_backbone',
          'cold_ironing_federation_corridor',
          'maritime_shore_power_orchestration_hub',
          'port_cargo_electrification_federation_mesh',
          'hydrogen_bunkering_federation_mesh',
        ],
      },
    ],
    expect: { minH2ReliefOnLast: 1.5, minShoreReliefOnLast: 1.2 },
  },
] as const;

export function runAgent13H2MaritimeTurnScenario(
  scenario: Agent13H2MaritimeTurnScenario,
): { passed: boolean; detail: string; lastH2Relief: number; lastShoreRelief: number } {
  let h2Mem: V1014ExportHydrogenCorridorPersistedSlice | null = null;
  let shoreMem: V1014MaritimeShorePowerPersistedSlice | null = null;
  let lastH2Relief = 0;
  let lastShoreRelief = 0;

  for (const step of scenario.steps) {
    const h2 = computeRegionalExportHydrogenCorridorLedger({
      regionId: step.regionId,
      communityEnergyResilienceRelief: step.communityEnergyResilienceRelief,
      distributedBackupRelief: step.distributedBackupRelief,
      resilienceBand: 'resilience_corridor',
      backupBand: 'backup_hub',
      greenHydrogenExportRelief: step.greenHydrogenExportRelief,
      portGreenCorridorRelief: step.portGreenCorridorRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: h2Mem,
    });
    h2Mem = h2.next;
    lastH2Relief = h2.ledger.exportHydrogenCorridorRelief;

    const shore = advanceRegionalMaritimeShorePowerOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      h2CorridorBand: h2.ledger.band,
      offshoreShoreElectrificationRelief: step.offshoreShoreElectrificationRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: shoreMem,
    });
    shoreMem = shore.next;
    lastShoreRelief = shore.ledger.maritimeShorePowerRelief;
  }

  if (scenario.expect.minH2ReliefOnLast != null && lastH2Relief < scenario.expect.minH2ReliefOnLast) {
    return { passed: false, detail: `h2 ${lastH2Relief}`, lastH2Relief, lastShoreRelief };
  }
  if (scenario.expect.minShoreReliefOnLast != null && lastShoreRelief < scenario.expect.minShoreReliefOnLast) {
    return { passed: false, detail: `shore ${lastShoreRelief}`, lastH2Relief, lastShoreRelief };
  }
  return { passed: true, detail: 'ok', lastH2Relief, lastShoreRelief };
}

export function scoreAgent13H2MaritimeGIAlignment(params: {
  actionText: string;
  h2Band?: string;
  shoreBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'export hydrogen',
    'h2 export',
    'ammonia export',
    'maritime shore',
    'shore-power',
    'shore power',
    'cold-ironing',
    'cold ironing',
    'hydrogen bunkering',
    'port cargo electrification',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.16, 0, 2);
  if (params.h2Band === 'federated_h2_export_leader' || params.h2Band === 'export_h2_corridor') {
    delta += hits.some(h => h.includes('hydrogen') || h.includes('ammonia')) ? 0.33 : 0.08;
  }
  if (params.shoreBand === 'shore_power_hub' || params.shoreBand === 'deep_maritime_electrification_mesh') {
    delta += hits.some(h => h.includes('shore') || h.includes('maritime') || h.includes('ironing')) ? 0.31 : 0.08;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason: delta > 0.25 ? `H2 maritime GI: ${hits.slice(0, 2).join(', ')} aligns with export corridor and shore power depth.` : null,
  };
}
