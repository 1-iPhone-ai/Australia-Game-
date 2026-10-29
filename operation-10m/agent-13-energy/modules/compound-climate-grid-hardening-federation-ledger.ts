/**
 * Agent 13 scale wave round 46 (O10-223) — compound climate grid hardening & federation resilience orchestration depth.
 */

export type V1014CompoundClimateHardeningBand =
  | 'exposed_grid'
  | 'pilot_hardening'
  | 'hardening_corridor'
  | 'federated_climate_hardening_leader';

export type V1014GridHardeningFederationBand =
  | 'fragile_mesh'
  | 'pilot_hardening_fed'
  | 'hardening_federation_hub'
  | 'deep_compound_resilience_mesh';

export interface V1014CompoundClimateHardeningInstrument {
  id: string;
  kind: 'compound_hazard_federation_hub' | 'flood_heat_hardening_corridor' | 'bushfire_line_orchestration_mesh' | 'federation_climate_hardening_tie';
  label: string;
  hardeningScoreEq: number;
  hardeningReliefFactor: number;
  federationSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_COMPOUND_CLIMATE_HARDENING_CATALOG: readonly V1014CompoundClimateHardeningInstrument[] = [
  {
    id: 'cch_hub',
    kind: 'compound_hazard_federation_hub',
    label: 'Compound hazard federation hub',
    hardeningScoreEq: 47,
    hardeningReliefFactor: 0.16,
    federationSynergyFactor: 0.11,
    projectTypeHint: 'compound_hazard_federation_hub',
  },
  {
    id: 'cch_flood',
    kind: 'flood_heat_hardening_corridor',
    label: 'Flood-heat hardening corridor',
    hardeningScoreEq: 45,
    hardeningReliefFactor: 0.15,
    federationSynergyFactor: 0.12,
    projectTypeHint: 'flood_heat_hardening_federation_corridor',
  },
  {
    id: 'cch_fire',
    kind: 'bushfire_line_orchestration_mesh',
    label: 'Bushfire line hardening mesh',
    hardeningScoreEq: 49,
    hardeningReliefFactor: 0.17,
    federationSynergyFactor: 0.1,
    projectTypeHint: 'bushfire_line_hardening_federation_mesh',
  },
  {
    id: 'cch_fed',
    kind: 'federation_climate_hardening_tie',
    label: 'Federation climate hardening tie',
    hardeningScoreEq: 51,
    hardeningReliefFactor: 0.16,
    federationSynergyFactor: 0.13,
    projectTypeHint: 'federation_climate_hardening_tie',
  },
] as const;

export interface V1014GridHardeningFederationTemplate {
  id: string;
  kind: 'community_resilience_stack' | 'distributed_backup_hardening_hub' | 'microgrid_island_federation' | 'trade_exposed_climate_corridor';
  label: string;
  federationScoreEq: number;
  federationReliefFactor: number;
  hardeningSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_GRID_HARDENING_FEDERATION_CATALOG: readonly V1014GridHardeningFederationTemplate[] = [
  {
    id: 'gh_comm',
    kind: 'community_resilience_stack',
    label: 'Community resilience stacking layer',
    federationScoreEq: 46,
    federationReliefFactor: 0.15,
    hardeningSynergyFactor: 0.11,
    projectTypeHint: 'community_resilience_federation_stack',
  },
  {
    id: 'gh_backup',
    kind: 'distributed_backup_hardening_hub',
    label: 'Distributed backup hardening hub',
    federationScoreEq: 48,
    federationReliefFactor: 0.16,
    hardeningSynergyFactor: 0.12,
    projectTypeHint: 'distributed_backup_hardening_federation_hub',
  },
  {
    id: 'gh_micro',
    kind: 'microgrid_island_federation',
    label: 'Microgrid island federation mesh',
    federationScoreEq: 50,
    federationReliefFactor: 0.17,
    hardeningSynergyFactor: 0.1,
    projectTypeHint: 'microgrid_island_federation_mesh',
  },
  {
    id: 'gh_trade',
    kind: 'trade_exposed_climate_corridor',
    label: 'Trade-exposed climate hardening corridor',
    federationScoreEq: 44,
    federationReliefFactor: 0.14,
    hardeningSynergyFactor: 0.1,
    projectTypeHint: 'trade_exposed_climate_hardening_corridor',
  },
] as const;

export interface V1014RegionalCompoundClimateHardeningLedger {
  regionId: string;
  band: V1014CompoundClimateHardeningBand;
  hardeningIndex: number;
  hardeningBalance: number;
  compoundClimateHardeningRelief: number;
  summary: string;
}

export interface V1014RegionalGridHardeningFederationLedger {
  regionId: string;
  band: V1014GridHardeningFederationBand;
  federationIndex: number;
  gridHardeningFederationRelief: number;
  summary: string;
}

export interface V1014CompoundClimateHardeningPersistedSlice {
  hardeningBalance: number;
  hardeningIndex: number;
}

export interface V1014GridHardeningFederationPersistedSlice {
  federationIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const HARDENING_HUB_REGIONS = new Set(['QLD', 'NSW', 'VIC', 'SA']);

export function computeRegionalCompoundClimateHardeningLedger(params: {
  regionId: string;
  marineExportCorridorFederationRelief: number;
  offshoreFloatingWindRelief: number;
  floodHeatResilienceRelief: number;
  bushfireResilienceRelief: number;
  communityEnergyResilienceRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014CompoundClimateHardeningPersistedSlice | null;
}): { ledger: V1014RegionalCompoundClimateHardeningLedger; next: V1014CompoundClimateHardeningPersistedSlice } {
  let hardeningGain = 0;
  let hardeningProxy = 0;
  let federationSynergy = 0;
  for (const inst of V1014_COMPOUND_CLIMATE_HARDENING_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      hardeningGain += inst.hardeningScoreEq;
      hardeningProxy += inst.hardeningReliefFactor;
      federationSynergy += inst.federationSynergyFactor;
    }
  }
  if (params.completedProjectTypes.includes('compound_hazard_recovery_hub')) {
    hardeningGain += 13;
    hardeningProxy += 0.05;
  }
  if (HARDENING_HUB_REGIONS.has(params.regionId)) hardeningProxy += 0.06;
  else hardeningProxy *= 0.69;
  if (params.marineExportCorridorFederationRelief > 2.3) federationSynergy += clamp(params.marineExportCorridorFederationRelief * 0.008, 0, 0.05);
  if (params.offshoreFloatingWindRelief > 2.3) hardeningGain += clamp(params.offshoreFloatingWindRelief * 0.48, 0, 6);
  if (params.floodHeatResilienceRelief > 2.2) {
    hardeningGain += clamp(params.floodHeatResilienceRelief * 0.58, 0, 7);
    hardeningProxy += clamp(params.floodHeatResilienceRelief * 0.007, 0, 0.04);
  }
  if (params.bushfireResilienceRelief > 2.2) federationSynergy += clamp(params.bushfireResilienceRelief * 0.009, 0, 0.05);
  if (params.communityEnergyResilienceRelief > 2.2) hardeningProxy += clamp(params.communityEnergyResilienceRelief * 0.007, 0, 0.04);
  hardeningProxy += clamp(params.renewableShareScore / 113, 0, 0.08);

  const prevIdx = params.prev?.hardeningIndex ?? 0;
  const prevBal = params.prev?.hardeningBalance ?? 0;
  const hardeningBalance = clamp(prevBal * 0.79 + hardeningGain * 0.1, 0, 258);
  const hardeningIndex = clamp(prevIdx * 0.76 + hardeningBalance * 0.09 + hardeningProxy * 75 + federationSynergy * 26, 0, 204);

  let band: V1014CompoundClimateHardeningBand = 'exposed_grid';
  if (hardeningIndex >= 130 || hardeningGain >= 152) band = 'federated_climate_hardening_leader';
  else if (hardeningIndex >= 90 || hardeningGain >= 108) band = 'hardening_corridor';
  else if (hardeningIndex >= 44 || hardeningGain >= 42) band = 'pilot_hardening';

  let compoundClimateHardeningRelief = clamp(hardeningProxy * 7.9 + hardeningGain * 0.027 + federationSynergy * 5.1, 0, 10.6);
  if (band === 'exposed_grid') compoundClimateHardeningRelief *= 0.14;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      hardeningIndex: clamp(hardeningIndex, 0, 204),
      hardeningBalance: clamp(hardeningBalance, 0, 258),
      compoundClimateHardeningRelief: clamp(compoundClimateHardeningRelief, 0, 10.6),
      summary: `${params.regionId} climate harden ${band} · idx ${hardeningIndex.toFixed(0)} · relief ${compoundClimateHardeningRelief.toFixed(1)}`,
    },
    next: {
      hardeningBalance: clamp(hardeningBalance, 0, 258),
      hardeningIndex: clamp(hardeningIndex, 0, 204),
    },
  };
}

export function advanceRegionalGridHardeningFederationOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  hardeningBand: V1014CompoundClimateHardeningBand;
  distributedBackupRelief: number;
  demandFlexFederationRelief: number;
  completedProjectTypes: string[];
  prev?: V1014GridHardeningFederationPersistedSlice | null;
}): { ledger: V1014RegionalGridHardeningFederationLedger; next: V1014GridHardeningFederationPersistedSlice } {
  let federationGain = 0;
  let federationProxy = 0;
  let hardeningSynergy = 0;
  for (const tpl of V1014_GRID_HARDENING_FEDERATION_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      federationGain += tpl.federationScoreEq;
      federationProxy += tpl.federationReliefFactor;
      hardeningSynergy += tpl.hardeningSynergyFactor;
    }
  }
  if (params.hardeningBand === 'hardening_corridor' || params.hardeningBand === 'federated_climate_hardening_leader') {
    federationGain += 19;
    hardeningSynergy += 0.13;
  }
  if (params.distributedBackupRelief > 2.2) {
    federationGain += params.distributedBackupRelief * 0.53;
    federationProxy += clamp(params.distributedBackupRelief * 0.007, 0, 0.04);
  }
  if (params.demandFlexFederationRelief > 2.2) hardeningSynergy += clamp(params.demandFlexFederationRelief * 0.008, 0, 0.04);

  const stressLoad = clamp(params.gridStressPoints * 0.15, 0, 6.4);
  const prevIdx = params.prev?.federationIndex ?? 0;
  const federationIndex = clamp(
    prevIdx * 0.75 + federationGain * 0.1 + federationProxy * 26 - stressLoad * 0.021 + hardeningSynergy * 27,
    0,
    205,
  );

  let band: V1014GridHardeningFederationBand = 'fragile_mesh';
  if (federationIndex >= 132 || federationGain >= 158) band = 'deep_compound_resilience_mesh';
  else if (federationIndex >= 92 || federationGain >= 112) band = 'hardening_federation_hub';
  else if (federationIndex >= 46 || federationGain >= 44) band = 'pilot_hardening_fed';

  let gridHardeningFederationRelief = clamp(federationIndex / 17 + federationProxy * 6.4 + hardeningSynergy * 7, 0, 10.5);
  if (band === 'fragile_mesh') gridHardeningFederationRelief = clamp(gridHardeningFederationRelief * 0.13, 0, 1.3);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      federationIndex: clamp(federationIndex, 0, 205),
      gridHardeningFederationRelief: clamp(gridHardeningFederationRelief, 0, 10.5),
      summary: `${params.regionId} grid harden fed ${band} · idx ${federationIndex.toFixed(0)} · relief ${gridHardeningFederationRelief.toFixed(1)}`,
    },
    next: { federationIndex: clamp(federationIndex, 0, 205) },
  };
}

export function runAgent13ClimateHardeningFederationScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_COMPOUND_CLIMATE_HARDENING_CATALOG.length >= 4);
  ok(V1014_GRID_HARDENING_FEDERATION_CATALOG.length >= 4);

  const harden = computeRegionalCompoundClimateHardeningLedger({
    regionId: 'QLD',
    marineExportCorridorFederationRelief: 2.5,
    offshoreFloatingWindRelief: 2.4,
    floodHeatResilienceRelief: 2.6,
    bushfireResilienceRelief: 2.5,
    communityEnergyResilienceRelief: 2.4,
    renewableShareScore: 55,
    completedProjectTypes: ['compound_hazard_federation_hub', 'federation_climate_hardening_tie', 'compound_hazard_recovery_hub'],
  });
  ok(harden.ledger.compoundClimateHardeningRelief >= 1.4 || harden.ledger.band !== 'exposed_grid');

  const fed = advanceRegionalGridHardeningFederationOrchestration({
    regionId: 'QLD',
    gridStressPoints: 16,
    hardeningBand: harden.ledger.band,
    distributedBackupRelief: 2.5,
    demandFlexFederationRelief: 2.4,
    completedProjectTypes: ['community_resilience_federation_stack', 'distributed_backup_hardening_federation_hub'],
  });
  ok(fed.ledger.gridHardeningFederationRelief >= 1.2 || fed.ledger.band !== 'fragile_mesh');

  const turnSc = runAgent13ClimateHardeningFederationTurnScenario(V1014_CLIMATE_HARDENING_FEDERATION_TURN_SCENARIOS[0]);
  ok(turnSc.passed);

  const gi = scoreAgent13ClimateHardeningFederationGIAlignment({
    actionText: 'Compound hazard federation hub with community resilience stack and distributed backup hardening hub',
    hardeningBand: 'hardening_corridor',
    gridHardeningBand: 'hardening_federation_hub',
  });
  ok(gi.relevanceDelta > 0.85 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13ClimateHardeningFederationTurnStep {
  turn: number;
  regionId: string;
  marineExportCorridorFederationRelief: number;
  offshoreFloatingWindRelief: number;
  floodHeatResilienceRelief: number;
  bushfireResilienceRelief: number;
  communityEnergyResilienceRelief: number;
  distributedBackupRelief: number;
  demandFlexFederationRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  completedProjectTypes: string[];
}

export interface Agent13ClimateHardeningFederationTurnScenario {
  id: string;
  label: string;
  steps: Agent13ClimateHardeningFederationTurnStep[];
  expect: { minHardeningReliefOnLast?: number; minGridHardeningReliefOnLast?: number };
}

export const V1014_CLIMATE_HARDENING_FEDERATION_TURN_SCENARIOS: readonly Agent13ClimateHardeningFederationTurnScenario[] = [
  {
    id: 'sc_ch_qld_escalation',
    label: 'QLD compound climate hardening with grid federation mesh',
    steps: [
      {
        turn: 1,
        regionId: 'QLD',
        marineExportCorridorFederationRelief: 1.9,
        offshoreFloatingWindRelief: 1.8,
        floodHeatResilienceRelief: 2,
        bushfireResilienceRelief: 1.9,
        communityEnergyResilienceRelief: 1.8,
        distributedBackupRelief: 1.8,
        demandFlexFederationRelief: 1.7,
        renewableShareScore: 43,
        gridStressPoints: 19,
        completedProjectTypes: ['compound_hazard_federation_hub', 'community_resilience_federation_stack'],
      },
      {
        turn: 2,
        regionId: 'QLD',
        marineExportCorridorFederationRelief: 2.2,
        offshoreFloatingWindRelief: 2.1,
        floodHeatResilienceRelief: 2.3,
        bushfireResilienceRelief: 2.2,
        communityEnergyResilienceRelief: 2.1,
        distributedBackupRelief: 2.1,
        demandFlexFederationRelief: 2,
        renewableShareScore: 49,
        gridStressPoints: 18,
        completedProjectTypes: ['flood_heat_hardening_federation_corridor', 'microgrid_island_federation_mesh'],
      },
      {
        turn: 3,
        regionId: 'QLD',
        marineExportCorridorFederationRelief: 2.6,
        offshoreFloatingWindRelief: 2.5,
        floodHeatResilienceRelief: 2.7,
        bushfireResilienceRelief: 2.6,
        communityEnergyResilienceRelief: 2.5,
        distributedBackupRelief: 2.5,
        demandFlexFederationRelief: 2.4,
        renewableShareScore: 56,
        gridStressPoints: 16,
        completedProjectTypes: [
          'compound_hazard_federation_hub',
          'flood_heat_hardening_federation_corridor',
          'bushfire_line_hardening_federation_mesh',
          'federation_climate_hardening_tie',
          'compound_hazard_recovery_hub',
          'community_resilience_federation_stack',
          'distributed_backup_hardening_federation_hub',
          'microgrid_island_federation_mesh',
          'trade_exposed_climate_hardening_corridor',
        ],
      },
    ],
    expect: { minHardeningReliefOnLast: 1.4, minGridHardeningReliefOnLast: 1.1 },
  },
] as const;

export function runAgent13ClimateHardeningFederationTurnScenario(
  scenario: Agent13ClimateHardeningFederationTurnScenario,
): { passed: boolean; detail: string; lastHardeningRelief: number; lastGridHardeningRelief: number } {
  let hardenMem: V1014CompoundClimateHardeningPersistedSlice | null = null;
  let fedMem: V1014GridHardeningFederationPersistedSlice | null = null;
  let lastHardeningRelief = 0;
  let lastGridHardeningRelief = 0;

  for (const step of scenario.steps) {
    const harden = computeRegionalCompoundClimateHardeningLedger({
      regionId: step.regionId,
      marineExportCorridorFederationRelief: step.marineExportCorridorFederationRelief,
      offshoreFloatingWindRelief: step.offshoreFloatingWindRelief,
      floodHeatResilienceRelief: step.floodHeatResilienceRelief,
      bushfireResilienceRelief: step.bushfireResilienceRelief,
      communityEnergyResilienceRelief: step.communityEnergyResilienceRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: hardenMem,
    });
    hardenMem = harden.next;
    lastHardeningRelief = harden.ledger.compoundClimateHardeningRelief;

    const fed = advanceRegionalGridHardeningFederationOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      hardeningBand: harden.ledger.band,
      distributedBackupRelief: step.distributedBackupRelief,
      demandFlexFederationRelief: step.demandFlexFederationRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: fedMem,
    });
    fedMem = fed.next;
    lastGridHardeningRelief = fed.ledger.gridHardeningFederationRelief;
  }

  if (scenario.expect.minHardeningReliefOnLast != null && lastHardeningRelief < scenario.expect.minHardeningReliefOnLast) {
    return { passed: false, detail: `harden ${lastHardeningRelief}`, lastHardeningRelief, lastGridHardeningRelief };
  }
  if (scenario.expect.minGridHardeningReliefOnLast != null && lastGridHardeningRelief < scenario.expect.minGridHardeningReliefOnLast) {
    return { passed: false, detail: `fed ${lastGridHardeningRelief}`, lastHardeningRelief, lastGridHardeningRelief };
  }
  return { passed: true, detail: 'ok', lastHardeningRelief, lastGridHardeningRelief };
}

export function scoreAgent13ClimateHardeningFederationGIAlignment(params: {
  actionText: string;
  hardeningBand?: string;
  gridHardeningBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'compound hazard',
    'flood-heat',
    'flood heat',
    'bushfire',
    'climate hardening',
    'community resilience',
    'distributed backup',
    'microgrid island',
    'grid hardening',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.12, 0, 2);
  if (params.hardeningBand === 'federated_climate_hardening_leader' || params.hardeningBand === 'hardening_corridor') {
    delta += hits.some(h => h.includes('compound') || h.includes('hazard') || h.includes('hardening')) ? 0.34 : 0.08;
  }
  if (params.gridHardeningBand === 'hardening_federation_hub' || params.gridHardeningBand === 'deep_compound_resilience_mesh') {
    delta += hits.some(h => h.includes('resilience') || h.includes('backup') || h.includes('microgrid')) ? 0.32 : 0.08;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Climate hardening GI: ${hits.slice(0, 2).join(', ')} aligns with compound climate hardening and grid federation depth.`
        : null,
  };
}
