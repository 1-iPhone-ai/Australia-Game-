/**
 * Agent 13 scale wave round 37 (O10-205) — compound community energy resilience & distributed backup federation orchestration depth.
 */

export type V1014CommunityEnergyResilienceBand =
  | 'fragile_supply'
  | 'pilot_resilience'
  | 'resilience_corridor'
  | 'federated_community_resilience_leader';

export type V1014DistributedBackupBand =
  | 'no_backup_mesh'
  | 'pilot_backup'
  | 'backup_hub'
  | 'deep_distributed_backup_mesh';

export interface V1014CommunityEnergyResilienceInstrument {
  id: string;
  kind: 'community_microgrid_resilience_hub' | 'islanded_cluster_corridor' | 'remote_hybrid_resilience_mesh' | 'federation_resilience_tie';
  label: string;
  resilienceScoreEq: number;
  resilienceReliefFactor: number;
  backupSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_COMMUNITY_RESILIENCE_ENERGY_CATALOG: readonly V1014CommunityEnergyResilienceInstrument[] = [
  {
    id: 'cre_hub',
    kind: 'community_microgrid_resilience_hub',
    label: 'Community microgrid resilience hub',
    resilienceScoreEq: 45,
    resilienceReliefFactor: 0.16,
    backupSynergyFactor: 0.11,
    projectTypeHint: 'suburban_islanded_resilience_cluster',
  },
  {
    id: 'cre_remote',
    kind: 'remote_hybrid_resilience_mesh',
    label: 'Remote hybrid resilience mesh',
    resilienceScoreEq: 47,
    resilienceReliefFactor: 0.17,
    backupSynergyFactor: 0.1,
    projectTypeHint: 'remote_township_hybrid_microgrid',
  },
  {
    id: 'cre_feeder',
    kind: 'islanded_cluster_corridor',
    label: 'Rural feeder backup corridor',
    resilienceScoreEq: 43,
    resilienceReliefFactor: 0.15,
    backupSynergyFactor: 0.12,
    projectTypeHint: 'rural_feeder_backup_microgrid',
  },
  {
    id: 'cre_fed',
    kind: 'federation_resilience_tie',
    label: 'Federation community resilience tie',
    resilienceScoreEq: 49,
    resilienceReliefFactor: 0.16,
    backupSynergyFactor: 0.13,
    projectTypeHint: 'federation_community_resilience_tie',
  },
] as const;

export interface V1014DistributedBackupTemplate {
  id: string;
  kind: 'vpp_bushfire_dispatch' | 'battery_backup_orchestration' | 'diesel_hybrid_backup_layer' | 'critical_load_backup_mesh';
  label: string;
  backupScoreEq: number;
  backupReliefFactor: number;
  resilienceSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_DISTRIBUTED_BACKUP_ORCHESTRATION_CATALOG: readonly V1014DistributedBackupTemplate[] = [
  {
    id: 'db_vpp',
    kind: 'vpp_bushfire_dispatch',
    label: 'Bushfire-aware VPP dispatch hub',
    backupScoreEq: 46,
    backupReliefFactor: 0.15,
    resilienceSynergyFactor: 0.1,
    projectTypeHint: 'bushfire_aware_vpp_dispatch',
  },
  {
    id: 'db_batt',
    kind: 'battery_backup_orchestration',
    label: 'Battery backup orchestration layer',
    backupScoreEq: 44,
    backupReliefFactor: 0.14,
    resilienceSynergyFactor: 0.11,
    projectTypeHint: 'community_battery_backup_orchestration',
  },
  {
    id: 'db_hybrid',
    kind: 'diesel_hybrid_backup_layer',
    label: 'Diesel-hybrid backup corridor',
    backupScoreEq: 42,
    backupReliefFactor: 0.14,
    resilienceSynergyFactor: 0.12,
    projectTypeHint: 'diesel_hybrid_backup_corridor',
  },
  {
    id: 'db_critical',
    kind: 'critical_load_backup_mesh',
    label: 'Critical-load backup mesh',
    backupScoreEq: 48,
    backupReliefFactor: 0.16,
    resilienceSynergyFactor: 0.13,
    projectTypeHint: 'critical_load_backup_mesh',
  },
] as const;

export interface V1014RegionalCommunityEnergyResilienceLedger {
  regionId: string;
  band: V1014CommunityEnergyResilienceBand;
  resilienceIndex: number;
  resilienceBalance: number;
  communityEnergyResilienceRelief: number;
  summary: string;
}

export interface V1014RegionalDistributedBackupLedger {
  regionId: string;
  band: V1014DistributedBackupBand;
  backupIndex: number;
  distributedBackupRelief: number;
  summary: string;
}

export interface V1014CommunityEnergyResiliencePersistedSlice {
  resilienceBalance: number;
  resilienceIndex: number;
}

export interface V1014DistributedBackupPersistedSlice {
  backupIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const RESILIENCE_HUB_REGIONS = new Set(['NSW', 'QLD', 'VIC', 'WA', 'SA', 'TAS']);

export function computeRegionalCommunityEnergyResilienceLedger(params: {
  regionId: string;
  interregionalInterconnectionRelief: number;
  industrialElectrificationFlexRelief: number;
  interconnectionBand: string;
  flexBand: string;
  floodHeatResilienceRelief: number;
  climateAdaptationRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014CommunityEnergyResiliencePersistedSlice | null;
}): { ledger: V1014RegionalCommunityEnergyResilienceLedger; next: V1014CommunityEnergyResiliencePersistedSlice } {
  let resilienceGain = 0;
  let resilienceProxy = 0;
  let backupSynergy = 0;
  for (const inst of V1014_COMMUNITY_RESILIENCE_ENERGY_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      resilienceGain += inst.resilienceScoreEq;
      resilienceProxy += inst.resilienceReliefFactor;
      backupSynergy += inst.backupSynergyFactor;
    }
  }
  if (params.completedProjectTypes.includes('federation_community_resilience_tie')) {
    resilienceGain += 20;
    resilienceProxy += 0.05;
  }
  if (RESILIENCE_HUB_REGIONS.has(params.regionId)) resilienceProxy += 0.06;
  else resilienceProxy *= 0.72;
  if (params.interregionalInterconnectionRelief > 2.5) {
    resilienceGain += clamp(params.interregionalInterconnectionRelief * 0.7, 0, 9);
    resilienceProxy += 0.05;
  }
  if (params.industrialElectrificationFlexRelief > 2.4) backupSynergy += clamp(params.industrialElectrificationFlexRelief * 0.01, 0, 0.06);
  if (params.interconnectionBand === 'interconnection_hub' || params.interconnectionBand === 'deep_interconnection_mesh') {
    resilienceGain += 14;
  }
  if (params.flexBand === 'electrification_corridor' || params.flexBand === 'federated_industrial_flex_leader') {
    backupSynergy += 0.08;
  }
  if (params.floodHeatResilienceRelief > 2.4) resilienceProxy += clamp(params.floodHeatResilienceRelief * 0.008, 0, 0.05);
  if (params.climateAdaptationRelief > 2.3) resilienceGain += clamp(params.climateAdaptationRelief * 0.6, 0, 7);
  resilienceProxy += clamp(params.renewableShareScore / 106, 0, 0.09);

  const prevIdx = params.prev?.resilienceIndex ?? 0;
  const prevBal = params.prev?.resilienceBalance ?? 0;
  const resilienceBalance = clamp(prevBal * 0.84 + resilienceGain * 0.1, 0, 246);
  const resilienceIndex = clamp(
    prevIdx * 0.81 + resilienceBalance * 0.09 + resilienceProxy * 76 + backupSynergy * 23,
    0,
    189,
  );

  let band: V1014CommunityEnergyResilienceBand = 'fragile_supply';
  if (resilienceIndex >= 119 || resilienceGain >= 136) band = 'federated_community_resilience_leader';
  else if (resilienceIndex >= 79 || resilienceGain >= 90) band = 'resilience_corridor';
  else if (resilienceIndex >= 36 || resilienceGain >= 34) band = 'pilot_resilience';

  let communityEnergyResilienceRelief = clamp(resilienceProxy * 7.8 + resilienceGain * 0.027 + backupSynergy * 4.6, 0, 10);
  if (band === 'fragile_supply') communityEnergyResilienceRelief *= 0.21;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      resilienceIndex: clamp(resilienceIndex, 0, 189),
      resilienceBalance: clamp(resilienceBalance, 0, 246),
      communityEnergyResilienceRelief: clamp(communityEnergyResilienceRelief, 0, 10),
      summary: `${params.regionId} community resilience ${band} · idx ${resilienceIndex.toFixed(0)} · relief ${communityEnergyResilienceRelief.toFixed(1)}`,
    },
    next: {
      resilienceBalance: clamp(resilienceBalance, 0, 246),
      resilienceIndex: clamp(resilienceIndex, 0, 189),
    },
  };
}

export function advanceRegionalDistributedBackupOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  resilienceBand: V1014CommunityEnergyResilienceBand;
  bushfireResilienceRelief: number;
  completedProjectTypes: string[];
  prev?: V1014DistributedBackupPersistedSlice | null;
}): { ledger: V1014RegionalDistributedBackupLedger; next: V1014DistributedBackupPersistedSlice } {
  let backupGain = 0;
  let backupProxy = 0;
  let resilienceSynergy = 0;
  for (const tpl of V1014_DISTRIBUTED_BACKUP_ORCHESTRATION_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      backupGain += tpl.backupScoreEq;
      backupProxy += tpl.backupReliefFactor;
      resilienceSynergy += tpl.resilienceSynergyFactor;
    }
  }
  if (params.resilienceBand === 'resilience_corridor' || params.resilienceBand === 'federated_community_resilience_leader') {
    backupGain += 17;
    resilienceSynergy += 0.1;
  }
  if (params.bushfireResilienceRelief > 2.4) {
    backupGain += params.bushfireResilienceRelief * 0.65;
    backupProxy += clamp(params.bushfireResilienceRelief * 0.007, 0, 0.04);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.18, 0, 7.5);
  const prevIdx = params.prev?.backupIndex ?? 0;
  const backupIndex = clamp(
    prevIdx * 0.82 + backupGain * 0.1 + backupProxy * 26 - stressLoad * 0.022 + resilienceSynergy * 23,
    0,
    191,
  );

  let band: V1014DistributedBackupBand = 'no_backup_mesh';
  if (backupIndex >= 122 || backupGain >= 142) band = 'deep_distributed_backup_mesh';
  else if (backupIndex >= 82 || backupGain >= 96) band = 'backup_hub';
  else if (backupIndex >= 37 || backupGain >= 35) band = 'pilot_backup';

  let distributedBackupRelief = clamp(backupIndex / 18 + backupProxy * 6.1 + resilienceSynergy * 6.3, 0, 9.7);
  if (band === 'no_backup_mesh') distributedBackupRelief = clamp(distributedBackupRelief * 0.19, 0, 2);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      backupIndex: clamp(backupIndex, 0, 191),
      distributedBackupRelief: clamp(distributedBackupRelief, 0, 9.7),
      summary: `${params.regionId} backup ${band} · idx ${backupIndex.toFixed(0)} · relief ${distributedBackupRelief.toFixed(1)}`,
    },
    next: { backupIndex: clamp(backupIndex, 0, 191) },
  };
}

export const V1014_RESILIENCE_BACKUP_SCENARIOS = [
  {
    id: 'sc_rb_qld',
    label: 'QLD islanded cluster with VPP dispatch',
    regionId: 'QLD',
    interregionalInterconnectionRelief: 2.8,
    industrialElectrificationFlexRelief: 2.7,
    interconnectionBand: 'interconnection_hub',
    flexBand: 'electrification_corridor',
    floodHeatResilienceRelief: 2.6,
    climateAdaptationRelief: 2.5,
    renewableShareScore: 53,
    gridStressPoints: 15,
    bushfireResilienceRelief: 2.5,
    completedProjectTypes: [
      'suburban_islanded_resilience_cluster',
      'federation_community_resilience_tie',
      'bushfire_aware_vpp_dispatch',
      'critical_load_backup_mesh',
    ],
    expectResilienceBand: 'resilience_corridor' as V1014CommunityEnergyResilienceBand,
    expectMinResilienceRelief: 1.7,
    expectBackupBand: 'backup_hub' as V1014DistributedBackupBand,
    expectMinBackupRelief: 1.4,
  },
] as const;

export function runAgent13ResilienceBackupScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_COMMUNITY_RESILIENCE_ENERGY_CATALOG.length >= 4);
  ok(V1014_DISTRIBUTED_BACKUP_ORCHESTRATION_CATALOG.length >= 4);

  const sc0 = V1014_RESILIENCE_BACKUP_SCENARIOS[0];
  const resilience = computeRegionalCommunityEnergyResilienceLedger({
    regionId: sc0.regionId,
    interregionalInterconnectionRelief: sc0.interregionalInterconnectionRelief,
    industrialElectrificationFlexRelief: sc0.industrialElectrificationFlexRelief,
    interconnectionBand: sc0.interconnectionBand,
    flexBand: sc0.flexBand,
    floodHeatResilienceRelief: sc0.floodHeatResilienceRelief,
    climateAdaptationRelief: sc0.climateAdaptationRelief,
    renewableShareScore: sc0.renewableShareScore,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    resilience.ledger.band === sc0.expectResilienceBand ||
      resilience.ledger.band === 'federated_community_resilience_leader' ||
      resilience.ledger.communityEnergyResilienceRelief >= sc0.expectMinResilienceRelief,
  );

  const backup = advanceRegionalDistributedBackupOrchestration({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    resilienceBand: resilience.ledger.band,
    bushfireResilienceRelief: sc0.bushfireResilienceRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    backup.ledger.band === sc0.expectBackupBand ||
      backup.ledger.band === 'deep_distributed_backup_mesh' ||
      backup.ledger.distributedBackupRelief >= sc0.expectMinBackupRelief,
  );

  const persistA = computeRegionalCommunityEnergyResilienceLedger({
    regionId: 'TAS',
    interregionalInterconnectionRelief: 2.2,
    industrialElectrificationFlexRelief: 2.1,
    interconnectionBand: 'pilot_interconnection',
    flexBand: 'pilot_electrification',
    floodHeatResilienceRelief: 2.2,
    climateAdaptationRelief: 2.1,
    renewableShareScore: 50,
    completedProjectTypes: ['rural_feeder_backup_microgrid'],
    prev: null,
  });
  const persistB = computeRegionalCommunityEnergyResilienceLedger({
    regionId: 'TAS',
    interregionalInterconnectionRelief: 2.2,
    industrialElectrificationFlexRelief: 2.1,
    interconnectionBand: 'pilot_interconnection',
    flexBand: 'pilot_electrification',
    floodHeatResilienceRelief: 2.2,
    climateAdaptationRelief: 2.1,
    renewableShareScore: 50,
    completedProjectTypes: ['rural_feeder_backup_microgrid'],
    prev: persistA.next,
  });
  ok(persistB.next.resilienceIndex >= persistA.next.resilienceIndex * 0.7);

  const turnSc = runAgent13ResilienceBackupTurnScenario(V1014_RESILIENCE_BACKUP_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastResilienceRelief >= 1.6);

  const gi = scoreAgent13ResilienceBackupGIAlignment({
    actionText: 'Community microgrid resilience with bushfire-aware VPP dispatch and critical-load backup mesh',
    resilienceBand: 'resilience_corridor',
    backupBand: 'backup_hub',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13ResilienceBackupTurnStep {
  turn: number;
  regionId: string;
  interregionalInterconnectionRelief: number;
  industrialElectrificationFlexRelief: number;
  floodHeatResilienceRelief: number;
  climateAdaptationRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  bushfireResilienceRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13ResilienceBackupTurnScenario {
  id: string;
  label: string;
  steps: Agent13ResilienceBackupTurnStep[];
  expect: { minResilienceReliefOnLast?: number; minBackupReliefOnLast?: number; lastResilienceBand?: V1014CommunityEnergyResilienceBand };
}

export const V1014_RESILIENCE_BACKUP_TURN_SCENARIOS: readonly Agent13ResilienceBackupTurnScenario[] = [
  {
    id: 'sc_rb_qld_escalation',
    label: 'QLD federated resilience with deep backup mesh',
    steps: [
      {
        turn: 1,
        regionId: 'QLD',
        interregionalInterconnectionRelief: 2,
        industrialElectrificationFlexRelief: 1.9,
        floodHeatResilienceRelief: 2,
        climateAdaptationRelief: 1.9,
        renewableShareScore: 42,
        gridStressPoints: 16,
        bushfireResilienceRelief: 2,
        completedProjectTypes: ['suburban_islanded_resilience_cluster', 'bushfire_aware_vpp_dispatch'],
      },
      {
        turn: 2,
        regionId: 'QLD',
        interregionalInterconnectionRelief: 2.4,
        industrialElectrificationFlexRelief: 2.3,
        floodHeatResilienceRelief: 2.3,
        climateAdaptationRelief: 2.2,
        renewableShareScore: 48,
        gridStressPoints: 15,
        bushfireResilienceRelief: 2.3,
        completedProjectTypes: ['rural_feeder_backup_microgrid', 'community_battery_backup_orchestration'],
      },
      {
        turn: 3,
        regionId: 'QLD',
        interregionalInterconnectionRelief: 2.8,
        industrialElectrificationFlexRelief: 2.7,
        floodHeatResilienceRelief: 2.6,
        climateAdaptationRelief: 2.5,
        renewableShareScore: 54,
        gridStressPoints: 13,
        bushfireResilienceRelief: 2.5,
        completedProjectTypes: [
          'suburban_islanded_resilience_cluster',
          'rural_feeder_backup_microgrid',
          'remote_township_hybrid_microgrid',
          'federation_community_resilience_tie',
          'bushfire_aware_vpp_dispatch',
          'community_battery_backup_orchestration',
          'diesel_hybrid_backup_corridor',
          'critical_load_backup_mesh',
        ],
      },
    ],
    expect: { minResilienceReliefOnLast: 1.6, minBackupReliefOnLast: 1.3, lastResilienceBand: 'resilience_corridor' },
  },
] as const;

export function runAgent13ResilienceBackupTurnScenario(
  scenario: Agent13ResilienceBackupTurnScenario,
): { passed: boolean; detail: string; lastResilienceRelief: number; lastBackupRelief: number } {
  let resilienceMem: V1014CommunityEnergyResiliencePersistedSlice | null = null;
  let backupMem: V1014DistributedBackupPersistedSlice | null = null;
  let lastResilienceRelief = 0;
  let lastBackupRelief = 0;
  let lastBand: V1014CommunityEnergyResilienceBand = 'fragile_supply';

  for (const step of scenario.steps) {
    const resilience = computeRegionalCommunityEnergyResilienceLedger({
      regionId: step.regionId,
      interregionalInterconnectionRelief: step.interregionalInterconnectionRelief,
      industrialElectrificationFlexRelief: step.industrialElectrificationFlexRelief,
      interconnectionBand: 'interconnection_hub',
      flexBand: 'electrification_corridor',
      floodHeatResilienceRelief: step.floodHeatResilienceRelief,
      climateAdaptationRelief: step.climateAdaptationRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: resilienceMem,
    });
    resilienceMem = resilience.next;
    lastResilienceRelief = resilience.ledger.communityEnergyResilienceRelief;
    lastBand = resilience.ledger.band;

    const backup = advanceRegionalDistributedBackupOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      resilienceBand: resilience.ledger.band,
      bushfireResilienceRelief: step.bushfireResilienceRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: backupMem,
    });
    backupMem = backup.next;
    lastBackupRelief = backup.ledger.distributedBackupRelief;
  }

  if (scenario.expect.minResilienceReliefOnLast != null && lastResilienceRelief < scenario.expect.minResilienceReliefOnLast) {
    return { passed: false, detail: `resilience ${lastResilienceRelief}`, lastResilienceRelief, lastBackupRelief };
  }
  if (scenario.expect.minBackupReliefOnLast != null && lastBackupRelief < scenario.expect.minBackupReliefOnLast) {
    return { passed: false, detail: `backup ${lastBackupRelief}`, lastResilienceRelief, lastBackupRelief };
  }
  if (scenario.expect.lastResilienceBand != null) {
    const allowed: V1014CommunityEnergyResilienceBand[] = [scenario.expect.lastResilienceBand];
    if (scenario.expect.lastResilienceBand === 'resilience_corridor') allowed.push('federated_community_resilience_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand}`, lastResilienceRelief, lastBackupRelief };
    }
  }

  return { passed: true, detail: 'ok', lastResilienceRelief, lastBackupRelief };
}

export function scoreAgent13ResilienceBackupGIAlignment(params: {
  actionText: string;
  resilienceBand?: string;
  backupBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'community resilience',
    'microgrid',
    'islanded',
    'backup mesh',
    'vpp dispatch',
    'bushfire',
    'critical-load',
    'critical load',
    'distributed backup',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.17, 0, 2);
  if (params.resilienceBand === 'federated_community_resilience_leader' || params.resilienceBand === 'resilience_corridor') {
    delta += hits.some(h => h.includes('community') || h.includes('microgrid') || h.includes('resilience')) ? 0.32 : 0.08;
  }
  if (params.backupBand === 'backup_hub' || params.backupBand === 'deep_distributed_backup_mesh') {
    delta += hits.some(h => h.includes('backup') || h.includes('vpp') || h.includes('critical')) ? 0.3 : 0.08;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason: delta > 0.25 ? `Resilience backup GI: ${hits.slice(0, 2).join(', ')} aligns with community resilience and backup depth.` : null,
  };
}
