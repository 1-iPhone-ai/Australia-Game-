/**
 * Agent 13 scale wave round 47 (O10-225) — sovereign interconnector & critical infrastructure federation orchestration depth.
 */

export type V1014SovereignInterconnectorBand =
  | 'isolated_link'
  | 'pilot_interconnector'
  | 'interconnector_corridor'
  | 'federated_sovereign_interconnector_leader';

export type V1014CriticalInfrastructureFederationBand =
  | 'fragile_infrastructure_mesh'
  | 'pilot_infrastructure_fed'
  | 'critical_infrastructure_hub'
  | 'deep_sovereign_resilience_mesh';

export interface V1014SovereignInterconnectorInstrument {
  id: string;
  kind: 'sovereign_interconnector_federation_hub' | 'flood_heat_interconnector_corridor' | 'critical_substation_orchestration_mesh' | 'federation_sovereign_interconnector_tie';
  label: string;
  interconnectorScoreEq: number;
  interconnectorReliefFactor: number;
  infrastructureSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_SOVEREIGN_INTERCONNECTOR_CATALOG: readonly V1014SovereignInterconnectorInstrument[] = [
  {
    id: 'cch_hub',
    kind: 'sovereign_interconnector_federation_hub',
    label: 'Sovereign interconnector federation hub',
    interconnectorScoreEq: 47,
    interconnectorReliefFactor: 0.16,
    infrastructureSynergyFactor: 0.11,
    projectTypeHint: 'sovereign_interconnector_federation_hub',
  },
  {
    id: 'cch_flood',
    kind: 'flood_heat_interconnector_corridor',
    label: 'Flood-heat hardening corridor',
    interconnectorScoreEq: 45,
    interconnectorReliefFactor: 0.15,
    infrastructureSynergyFactor: 0.12,
    projectTypeHint: 'cross_border_interconnector_corridor',
  },
  {
    id: 'cch_fire',
    kind: 'critical_substation_orchestration_mesh',
    label: 'Bushfire line hardening mesh',
    interconnectorScoreEq: 49,
    interconnectorReliefFactor: 0.17,
    infrastructureSynergyFactor: 0.1,
    projectTypeHint: 'critical_substation_orchestration_mesh',
  },
  {
    id: 'cch_fed',
    kind: 'federation_sovereign_interconnector_tie',
    label: 'Federation sovereign linking tie',
    interconnectorScoreEq: 51,
    interconnectorReliefFactor: 0.16,
    infrastructureSynergyFactor: 0.13,
    projectTypeHint: 'federation_sovereign_interconnector_tie',
  },
] as const;

export interface V1014CriticalInfrastructureFederationTemplate {
  id: string;
  kind: 'critical_load_infrastructure_stack' | 'grid_coupling_infrastructure_hub' | 'national_interconnector_federation_mesh' | 'sovereign_energy_security_corridor';
  label: string;
  infrastructureScoreEq: number;
  infrastructureReliefFactor: number;
  interconnectorSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_CRITICAL_INFRASTRUCTURE_FEDERATION_CATALOG: readonly V1014CriticalInfrastructureFederationTemplate[] = [
  {
    id: 'gh_comm',
    kind: 'critical_load_infrastructure_stack',
    label: 'Critical load infrastructure stack',
    infrastructureScoreEq: 46,
    infrastructureReliefFactor: 0.15,
    interconnectorSynergyFactor: 0.11,
    projectTypeHint: 'critical_load_infrastructure_stack',
  },
  {
    id: 'gh_backup',
    kind: 'grid_coupling_infrastructure_hub',
    label: 'Distributed backup hardening hub',
    infrastructureScoreEq: 48,
    infrastructureReliefFactor: 0.16,
    interconnectorSynergyFactor: 0.12,
    projectTypeHint: 'grid_coupling_infrastructure_hub',
  },
  {
    id: 'gh_micro',
    kind: 'national_interconnector_federation_mesh',
    label: 'Microgrid island federation mesh',
    infrastructureScoreEq: 50,
    infrastructureReliefFactor: 0.17,
    interconnectorSynergyFactor: 0.1,
    projectTypeHint: 'national_interconnector_federation_mesh',
  },
  {
    id: 'gh_trade',
    kind: 'sovereign_energy_security_corridor',
    label: 'Trade-exposed sovereign linking corridor',
    infrastructureScoreEq: 44,
    infrastructureReliefFactor: 0.14,
    interconnectorSynergyFactor: 0.1,
    projectTypeHint: 'sovereign_energy_security_corridor',
  },
] as const;

export interface V1014RegionalSovereignInterconnectorLedger {
  regionId: string;
  band: V1014SovereignInterconnectorBand;
  interconnectorIndex: number;
  interconnectorBalance: number;
  sovereignInterconnectorRelief: number;
  summary: string;
}

export interface V1014RegionalCriticalInfrastructureFederationLedger {
  regionId: string;
  band: V1014CriticalInfrastructureFederationBand;
  infrastructureIndex: number;
  criticalInfrastructureFederationRelief: number;
  summary: string;
}

export interface V1014SovereignInterconnectorPersistedSlice {
  interconnectorBalance: number;
  interconnectorIndex: number;
}

export interface V1014CriticalInfrastructureFederationPersistedSlice {
  infrastructureIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const INTERCONNECTOR_HUB_REGIONS = new Set(['QLD', 'NSW', 'VIC', 'SA']);

export function computeRegionalSovereignInterconnectorLedger(params: {
  regionId: string;
  compoundClimateHardeningRelief: number;
  gridHardeningFederationRelief: number;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  safeguardCertificateRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014SovereignInterconnectorPersistedSlice | null;
}): { ledger: V1014RegionalSovereignInterconnectorLedger; next: V1014SovereignInterconnectorPersistedSlice } {
  let interconnectorGain = 0;
  let interconnectorProxy = 0;
  let infrastructureSynergy = 0;
  for (const inst of V1014_SOVEREIGN_INTERCONNECTOR_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      interconnectorGain += inst.interconnectorScoreEq;
      interconnectorProxy += inst.interconnectorReliefFactor;
      infrastructureSynergy += inst.infrastructureSynergyFactor;
    }
  }
  if (params.completedProjectTypes.includes('sovereign_interconnector_recovery_hub')) {
    interconnectorGain += 13;
    interconnectorProxy += 0.05;
  }
  if (INTERCONNECTOR_HUB_REGIONS.has(params.regionId)) interconnectorProxy += 0.06;
  else interconnectorProxy *= 0.69;
  if (params.compoundClimateHardeningRelief > 2.3) infrastructureSynergy += clamp(params.compoundClimateHardeningRelief * 0.008, 0, 0.05);
  if (params.gridHardeningFederationRelief > 2.3) interconnectorGain += clamp(params.gridHardeningFederationRelief * 0.48, 0, 6);
  if (params.interregionalInterconnectionRelief > 2.2) {
    interconnectorGain += clamp(params.interregionalInterconnectionRelief * 0.58, 0, 7);
    interconnectorProxy += clamp(params.interregionalInterconnectionRelief * 0.007, 0, 0.04);
  }
  if (params.decarbonFederationRelief > 2.2) infrastructureSynergy += clamp(params.decarbonFederationRelief * 0.009, 0, 0.05);
  if (params.safeguardCertificateRelief > 2.2) interconnectorProxy += clamp(params.safeguardCertificateRelief * 0.007, 0, 0.04);
  interconnectorProxy += clamp(params.renewableShareScore / 113, 0, 0.08);

  const prevIdx = params.prev?.interconnectorIndex ?? 0;
  const prevBal = params.prev?.interconnectorBalance ?? 0;
  const interconnectorBalance = clamp(prevBal * 0.79 + interconnectorGain * 0.1, 0, 258);
  const interconnectorIndex = clamp(prevIdx * 0.76 + interconnectorBalance * 0.09 + interconnectorProxy * 75 + infrastructureSynergy * 26, 0, 204);

  let band: V1014SovereignInterconnectorBand = 'isolated_link';
  if (interconnectorIndex >= 130 || interconnectorGain >= 152) band = 'federated_sovereign_interconnector_leader';
  else if (interconnectorIndex >= 90 || interconnectorGain >= 108) band = 'interconnector_corridor';
  else if (interconnectorIndex >= 44 || interconnectorGain >= 42) band = 'pilot_interconnector';

  let sovereignInterconnectorRelief = clamp(interconnectorProxy * 7.9 + interconnectorGain * 0.027 + infrastructureSynergy * 5.1, 0, 10.6);
  if (band === 'isolated_link') sovereignInterconnectorRelief *= 0.14;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      interconnectorIndex: clamp(interconnectorIndex, 0, 204),
      interconnectorBalance: clamp(interconnectorBalance, 0, 258),
      sovereignInterconnectorRelief: clamp(sovereignInterconnectorRelief, 0, 10.6),
      summary: `${params.regionId} sovereign link ${band} · idx ${interconnectorIndex.toFixed(0)} · relief ${sovereignInterconnectorRelief.toFixed(1)}`,
    },
    next: {
      interconnectorBalance: clamp(interconnectorBalance, 0, 258),
      interconnectorIndex: clamp(interconnectorIndex, 0, 204),
    },
  };
}

export function advanceRegionalCriticalInfrastructureFederationOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  interconnectorBand: V1014SovereignInterconnectorBand;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  completedProjectTypes: string[];
  prev?: V1014CriticalInfrastructureFederationPersistedSlice | null;
}): { ledger: V1014RegionalCriticalInfrastructureFederationLedger; next: V1014CriticalInfrastructureFederationPersistedSlice } {
  let infrastructureGain = 0;
  let infrastructureProxy = 0;
  let interconnectorSynergy = 0;
  for (const tpl of V1014_CRITICAL_INFRASTRUCTURE_FEDERATION_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      infrastructureGain += tpl.infrastructureScoreEq;
      infrastructureProxy += tpl.infrastructureReliefFactor;
      interconnectorSynergy += tpl.interconnectorSynergyFactor;
    }
  }
  if (params.interconnectorBand === 'interconnector_corridor' || params.interconnectorBand === 'federated_sovereign_interconnector_leader') {
    infrastructureGain += 19;
    interconnectorSynergy += 0.13;
  }
  if (params.interregionalInterconnectionRelief > 2.2) {
    infrastructureGain += params.interregionalInterconnectionRelief * 0.53;
    infrastructureProxy += clamp(params.interregionalInterconnectionRelief * 0.007, 0, 0.04);
  }
  if (params.decarbonFederationRelief > 2.2) interconnectorSynergy += clamp(params.decarbonFederationRelief * 0.008, 0, 0.04);

  const stressLoad = clamp(params.gridStressPoints * 0.15, 0, 6.4);
  const prevIdx = params.prev?.infrastructureIndex ?? 0;
  const infrastructureIndex = clamp(
    prevIdx * 0.75 + infrastructureGain * 0.1 + infrastructureProxy * 26 - stressLoad * 0.021 + interconnectorSynergy * 27,
    0,
    205,
  );

  let band: V1014CriticalInfrastructureFederationBand = 'fragile_infrastructure_mesh';
  if (infrastructureIndex >= 132 || infrastructureGain >= 158) band = 'deep_sovereign_resilience_mesh';
  else if (infrastructureIndex >= 92 || infrastructureGain >= 112) band = 'critical_infrastructure_hub';
  else if (infrastructureIndex >= 46 || infrastructureGain >= 44) band = 'pilot_infrastructure_fed';

  let criticalInfrastructureFederationRelief = clamp(infrastructureIndex / 17 + infrastructureProxy * 6.4 + interconnectorSynergy * 7, 0, 10.5);
  if (band === 'fragile_infrastructure_mesh') criticalInfrastructureFederationRelief = clamp(criticalInfrastructureFederationRelief * 0.13, 0, 1.3);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      infrastructureIndex: clamp(infrastructureIndex, 0, 205),
      criticalInfrastructureFederationRelief: clamp(criticalInfrastructureFederationRelief, 0, 10.5),
      summary: `${params.regionId} critical infra fed ${band} · idx ${infrastructureIndex.toFixed(0)} · relief ${criticalInfrastructureFederationRelief.toFixed(1)}`,
    },
    next: { infrastructureIndex: clamp(infrastructureIndex, 0, 205) },
  };
}

export function runAgent13SovereignInterconnectorInfrastructureScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_SOVEREIGN_INTERCONNECTOR_CATALOG.length >= 4);
  ok(V1014_CRITICAL_INFRASTRUCTURE_FEDERATION_CATALOG.length >= 4);

  const harden = computeRegionalSovereignInterconnectorLedger({
    regionId: 'NSW',
    compoundClimateHardeningRelief: 2.5,
    gridHardeningFederationRelief: 2.4,
    interregionalInterconnectionRelief: 2.6,
    decarbonFederationRelief: 2.5,
    safeguardCertificateRelief: 2.4,
    renewableShareScore: 55,
    completedProjectTypes: ['sovereign_interconnector_federation_hub', 'federation_sovereign_interconnector_tie', 'sovereign_interconnector_recovery_hub'],
  });
  ok(harden.ledger.sovereignInterconnectorRelief >= 1.4 || harden.ledger.band !== 'isolated_link');

  const fed = advanceRegionalCriticalInfrastructureFederationOrchestration({
    regionId: 'NSW',
    gridStressPoints: 16,
    interconnectorBand: harden.ledger.band,
    interregionalInterconnectionRelief: 2.5,
    decarbonFederationRelief: 2.4,
    completedProjectTypes: ['critical_load_infrastructure_stack', 'grid_coupling_infrastructure_hub'],
  });
  ok(fed.ledger.criticalInfrastructureFederationRelief >= 1.2 || fed.ledger.band !== 'fragile_infrastructure_mesh');

  const turnSc = runAgent13SovereignInterconnectorInfrastructureTurnScenario(V1014_SOVEREIGN_INTERCONNECTOR_INFRA_TURN_SCENARIOS[0]);
  ok(turnSc.passed);

  const gi = scoreAgent13SovereignInterconnectorInfrastructureGIAlignment({
    actionText:
      'Sovereign interconnector federation hub with cross-border interconnector corridor, critical substation mesh, critical load infrastructure stack, and grid coupling infrastructure hub',
    interconnectorBand: 'interconnector_corridor',
    criticalInfrastructureBand: 'critical_infrastructure_hub',
  });
  ok(gi.relevanceDelta > 0.85 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13SovereignInterconnectorInfrastructureTurnStep {
  turn: number;
  regionId: string;
  compoundClimateHardeningRelief: number;
  gridHardeningFederationRelief: number;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  safeguardCertificateRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  completedProjectTypes: string[];
}

export interface Agent13SovereignInterconnectorInfrastructureTurnScenario {
  id: string;
  label: string;
  steps: Agent13SovereignInterconnectorInfrastructureTurnStep[];
  expect: { minInterconnectorReliefOnLast?: number; minCriticalInfrastructureReliefOnLast?: number };
}

export const V1014_SOVEREIGN_INTERCONNECTOR_INFRA_TURN_SCENARIOS: readonly Agent13SovereignInterconnectorInfrastructureTurnScenario[] = [
  {
    id: 'sc_si_nsw_escalation',
    label: 'NSW sovereign interconnector with critical infrastructure mesh',
    steps: [
      {
        turn: 1,
        regionId: 'NSW',
        compoundClimateHardeningRelief: 1.9,
        gridHardeningFederationRelief: 1.8,
        interregionalInterconnectionRelief: 2,
        decarbonFederationRelief: 1.9,
        safeguardCertificateRelief: 1.8,
        renewableShareScore: 43,
        gridStressPoints: 19,
        completedProjectTypes: ['sovereign_interconnector_federation_hub', 'critical_load_infrastructure_stack'],
      },
      {
        turn: 2,
        regionId: 'NSW',
        compoundClimateHardeningRelief: 2.2,
        gridHardeningFederationRelief: 2.1,
        interregionalInterconnectionRelief: 2.3,
        decarbonFederationRelief: 2.2,
        safeguardCertificateRelief: 2.1,
        renewableShareScore: 49,
        gridStressPoints: 18,
        completedProjectTypes: ['cross_border_interconnector_corridor', 'national_interconnector_federation_mesh'],
      },
      {
        turn: 3,
        regionId: 'NSW',
        compoundClimateHardeningRelief: 2.6,
        gridHardeningFederationRelief: 2.5,
        interregionalInterconnectionRelief: 2.7,
        decarbonFederationRelief: 2.6,
        safeguardCertificateRelief: 2.5,
        renewableShareScore: 56,
        gridStressPoints: 16,
        completedProjectTypes: [
          'sovereign_interconnector_federation_hub',
          'cross_border_interconnector_corridor',
          'critical_substation_orchestration_mesh',
          'federation_sovereign_interconnector_tie',
          'sovereign_interconnector_recovery_hub',
          'critical_load_infrastructure_stack',
          'grid_coupling_infrastructure_hub',
          'national_interconnector_federation_mesh',
          'sovereign_energy_security_corridor',
        ],
      },
    ],
    expect: { minInterconnectorReliefOnLast: 1.4, minCriticalInfrastructureReliefOnLast: 1.1 },
  },
] as const;

export function runAgent13SovereignInterconnectorInfrastructureTurnScenario(
  scenario: Agent13SovereignInterconnectorInfrastructureTurnScenario,
): { passed: boolean; detail: string; lastInterconnectorRelief: number; lastCriticalInfrastructureRelief: number } {
  let hardenMem: V1014SovereignInterconnectorPersistedSlice | null = null;
  let fedMem: V1014CriticalInfrastructureFederationPersistedSlice | null = null;
  let lastInterconnectorRelief = 0;
  let lastCriticalInfrastructureRelief = 0;

  for (const step of scenario.steps) {
    const harden = computeRegionalSovereignInterconnectorLedger({
      regionId: step.regionId,
      compoundClimateHardeningRelief: step.compoundClimateHardeningRelief,
      gridHardeningFederationRelief: step.gridHardeningFederationRelief,
      interregionalInterconnectionRelief: step.interregionalInterconnectionRelief,
      decarbonFederationRelief: step.decarbonFederationRelief,
      safeguardCertificateRelief: step.safeguardCertificateRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: hardenMem,
    });
    hardenMem = harden.next;
    lastInterconnectorRelief = harden.ledger.sovereignInterconnectorRelief;

    const fed = advanceRegionalCriticalInfrastructureFederationOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      interconnectorBand: harden.ledger.band,
      interregionalInterconnectionRelief: step.interregionalInterconnectionRelief,
      decarbonFederationRelief: step.decarbonFederationRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: fedMem,
    });
    fedMem = fed.next;
    lastCriticalInfrastructureRelief = fed.ledger.criticalInfrastructureFederationRelief;
  }

  if (scenario.expect.minInterconnectorReliefOnLast != null && lastInterconnectorRelief < scenario.expect.minInterconnectorReliefOnLast) {
    return { passed: false, detail: `harden ${lastInterconnectorRelief}`, lastInterconnectorRelief, lastCriticalInfrastructureRelief };
  }
  if (scenario.expect.minCriticalInfrastructureReliefOnLast != null && lastCriticalInfrastructureRelief < scenario.expect.minCriticalInfrastructureReliefOnLast) {
    return { passed: false, detail: `fed ${lastCriticalInfrastructureRelief}`, lastInterconnectorRelief, lastCriticalInfrastructureRelief };
  }
  return { passed: true, detail: 'ok', lastInterconnectorRelief, lastCriticalInfrastructureRelief };
}

export function scoreAgent13SovereignInterconnectorInfrastructureGIAlignment(params: {
  actionText: string;
  interconnectorBand?: string;
  criticalInfrastructureBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'sovereign interconnector',
    'cross-border',
    'interconnector',
    'critical substation',
    'sovereign linking',
    'critical load',
    'grid coupling',
    'national interconnector',
    'critical infrastructure',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.12, 0, 2);
  if (params.interconnectorBand === 'federated_sovereign_interconnector_leader' || params.interconnectorBand === 'interconnector_corridor') {
    delta += hits.some(h => h.includes('sovereign') || h.includes('interconnector')) ? 0.34 : 0.08;
  }
  if (params.criticalInfrastructureBand === 'critical_infrastructure_hub' || params.criticalInfrastructureBand === 'deep_sovereign_resilience_mesh') {
    delta += hits.some(h => h.includes('critical') || h.includes('infrastructure') || h.includes('coupling')) ? 0.32 : 0.08;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Sovereign interconnector GI: ${hits.slice(0, 2).join(', ')} aligns with compound sovereign linking and grid federation depth.`
        : null,
  };
}
