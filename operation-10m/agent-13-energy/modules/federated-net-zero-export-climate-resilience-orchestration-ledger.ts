/**
 * Agent 13 scale wave round 54 (O10-240) — federated net-zero export orchestration & climate resilience export federation federation orchestration depth.
 */

export type V1014FederatedNetZeroExportBand =
  | 'isolated_export_lane'
  | 'pilot_federated_export'
  | 'federated_net_zero_export_corridor'
  | 'federated_net_zero_export_leader';

export type V1014ClimateResilienceExportFederationBand =
  | 'fragile_resilience_mesh'
  | 'pilot_resilience_fed'
  | 'climate_resilience_export_federation_hub'
  | 'deep_climate_resilience_export_federation_mesh';

export interface V1014FederatedNetZeroExportInstrument {
  id: string;
  kind:
    | 'federated_net_zero_export_hub'
    | 'sovereign_green_strategic_reserve_corridor'
    | 'strategic_reserve_coordination_mesh'
    | 'federation_federated_net_zero_export_tie';
  label: string;
  exportScoreEq: number;
  exportReliefFactor: number;
  orchestrationSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_FEDERATED_NET_ZERO_EXPORT_CATALOG: readonly V1014FederatedNetZeroExportInstrument[] = [
  {
    id: 'ser_hub',
    kind: 'federated_net_zero_export_hub',
    label: 'Federated net-zero export hub',
    exportScoreEq: 48,
    exportReliefFactor: 0.17,
    orchestrationSynergyFactor: 0.12,
    projectTypeHint: 'federated_net_zero_export_hub',
  },
  {
    id: 'ser_h2',
    kind: 'sovereign_green_strategic_reserve_corridor',
    label: 'Sovereign green strategic reserve corridor',
    exportScoreEq: 46,
    exportReliefFactor: 0.16,
    orchestrationSynergyFactor: 0.13,
    projectTypeHint: 'sovereign_green_strategic_reserve_corridor',
  },
  {
    id: 'ser_mesh',
    kind: 'strategic_reserve_coordination_mesh',
    label: 'Strategic reserve coordination mesh',
    exportScoreEq: 50,
    exportReliefFactor: 0.18,
    orchestrationSynergyFactor: 0.11,
    projectTypeHint: 'strategic_reserve_coordination_mesh',
  },
  {
    id: 'ser_fed',
    kind: 'federation_federated_net_zero_export_tie',
    label: 'Federation federated net-zero export neutrality tie',
    exportScoreEq: 52,
    exportReliefFactor: 0.17,
    orchestrationSynergyFactor: 0.14,
    projectTypeHint: 'federation_federated_net_zero_export_tie',
  },
] as const;

export interface V1014ClimateResilienceExportFederationTemplate {
  id: string;
  kind:
    | 'climate_resilience_export_load_stack'
    | 'strategic_reserve_coupling_hub'
    | 'national_sovereign_strategic_reserve_mesh'
    | 'climate_resilience_export_federation_corridor';
  label: string;
  resilienceScoreEq: number;
  resilienceReliefFactor: number;
  resilienceSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_CLIMATE_RESILIENCE_EXPORT_FEDERATION_CATALOG: readonly V1014ClimateResilienceExportFederationTemplate[] = [
  {
    id: 'nsf_stack',
    kind: 'climate_resilience_export_load_stack',
    label: 'Climate resilience export load stack',
    resilienceScoreEq: 47,
    resilienceReliefFactor: 0.16,
    resilienceSynergyFactor: 0.12,
    projectTypeHint: 'climate_resilience_export_load_stack',
  },
  {
    id: 'nsf_couple',
    kind: 'strategic_reserve_coupling_hub',
    label: 'Strategic reserve coupling hub',
    resilienceScoreEq: 49,
    resilienceReliefFactor: 0.17,
    resilienceSynergyFactor: 0.13,
    projectTypeHint: 'strategic_reserve_coupling_hub',
  },
  {
    id: 'nsf_mesh',
    kind: 'national_sovereign_strategic_reserve_mesh',
    label: 'National sovereign strategic reserve mesh',
    resilienceScoreEq: 51,
    resilienceReliefFactor: 0.18,
    resilienceSynergyFactor: 0.11,
    projectTypeHint: 'national_sovereign_strategic_reserve_mesh',
  },
  {
    id: 'nsf_sec',
    kind: 'climate_resilience_export_federation_corridor',
    label: 'Sovereign green grid federation corridor',
    resilienceScoreEq: 45,
    resilienceReliefFactor: 0.15,
    resilienceSynergyFactor: 0.11,
    projectTypeHint: 'climate_resilience_export_federation_corridor',
  },
] as const;

export interface V1014RegionalFederatedNetZeroExportLedger {
  regionId: string;
  band: V1014FederatedNetZeroExportBand;
  exportIndex: number;
  exportBalance: number;
  federatedNetZeroExportRelief: number;
  summary: string;
}

export interface V1014RegionalClimateResilienceExportFederationLedger {
  regionId: string;
  band: V1014ClimateResilienceExportFederationBand;
  resilienceIndex: number;
  climateResilienceExportFederationRelief: number;
  summary: string;
}

export interface V1014FederatedNetZeroExportPersistedSlice {
  exportBalance: number;
  exportIndex: number;
}

export interface V1014ClimateResilienceExportFederationPersistedSlice {
  resilienceIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const NET_ZERO_EXPORT_HUB_REGIONS = new Set(['QLD', 'NSW', 'VIC', 'WA']);

export function computeRegionalFederatedNetZeroExportLedger(params: {
  regionId: string;
  strategicReserveCarbonNeutralityRelief: number;
  sovereignGreenGridFederationRelief: number;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  safeguardCertificateRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014FederatedNetZeroExportPersistedSlice | null;
}): { ledger: V1014RegionalFederatedNetZeroExportLedger; next: V1014FederatedNetZeroExportPersistedSlice } {
  let exportGain = 0;
  let exportProxy = 0;
  let orchestrationSynergy = 0;
  for (const inst of V1014_FEDERATED_NET_ZERO_EXPORT_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      exportGain += inst.exportScoreEq;
      exportProxy += inst.exportReliefFactor;
      orchestrationSynergy += inst.orchestrationSynergyFactor;
    }
  }
  if (params.completedProjectTypes.includes('federated_net_zero_export_recovery_hub')) {
    exportGain += 14;
    exportProxy += 0.05;
  }
  if (NET_ZERO_EXPORT_HUB_REGIONS.has(params.regionId)) exportProxy += 0.07;
  else exportProxy *= 0.68;
  if (params.strategicReserveCarbonNeutralityRelief > 2.4) orchestrationSynergy += clamp(params.strategicReserveCarbonNeutralityRelief * 0.009, 0, 0.05);
  if (params.sovereignGreenGridFederationRelief > 2.3) exportGain += clamp(params.sovereignGreenGridFederationRelief * 0.5, 0, 6.5);
  if (params.interregionalInterconnectionRelief > 2.2) {
    exportGain += clamp(params.interregionalInterconnectionRelief * 0.6, 0, 7.2);
    exportProxy += clamp(params.interregionalInterconnectionRelief * 0.008, 0, 0.04);
  }
  if (params.decarbonFederationRelief > 2.2) orchestrationSynergy += clamp(params.decarbonFederationRelief * 0.01, 0, 0.05);
  if (params.safeguardCertificateRelief > 2.2) exportProxy += clamp(params.safeguardCertificateRelief * 0.008, 0, 0.04);
  exportProxy += clamp(params.renewableShareScore / 110, 0, 0.09);

  const prevIdx = params.prev?.exportIndex ?? 0;
  const prevBal = params.prev?.exportBalance ?? 0;
  const exportBalance = clamp(prevBal * 0.78 + exportGain * 0.11, 0, 262);
  const exportIndex = clamp(prevIdx * 0.75 + exportBalance * 0.1 + exportProxy * 76 + orchestrationSynergy * 27, 0, 208);

  let band: V1014FederatedNetZeroExportBand = 'isolated_export_lane';
  if (exportIndex >= 132 || exportGain >= 155) band = 'federated_net_zero_export_leader';
  else if (exportIndex >= 92 || exportGain >= 110) band = 'federated_net_zero_export_corridor';
  else if (exportIndex >= 46 || exportGain >= 44) band = 'pilot_federated_export';

  let federatedNetZeroExportRelief = clamp(exportProxy * 8.1 + exportGain * 0.028 + orchestrationSynergy * 5.2, 0, 10.8);
  if (band === 'isolated_export_lane') federatedNetZeroExportRelief *= 0.13;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      exportIndex: clamp(exportIndex, 0, 208),
      exportBalance: clamp(exportBalance, 0, 262),
      federatedNetZeroExportRelief: clamp(federatedNetZeroExportRelief, 0, 10.8),
      summary: `${params.regionId} federated net-zero export neutrality corridor ${band} · idx ${exportIndex.toFixed(0)} · relief ${federatedNetZeroExportRelief.toFixed(1)}`,
    },
    next: {
      exportBalance: clamp(exportBalance, 0, 262),
      exportIndex: clamp(exportIndex, 0, 208),
    },
  };
}

export function advanceRegionalClimateResilienceExportFederationOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  federatedNetZeroExportBand: V1014FederatedNetZeroExportBand;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  completedProjectTypes: string[];
  prev?: V1014ClimateResilienceExportFederationPersistedSlice | null;
}): { ledger: V1014RegionalClimateResilienceExportFederationLedger; next: V1014ClimateResilienceExportFederationPersistedSlice } {
  let exportGain = 0;
  let exportProxy = 0;
  let resilienceSynergy = 0;
  for (const tpl of V1014_CLIMATE_RESILIENCE_EXPORT_FEDERATION_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      exportGain += tpl.resilienceScoreEq;
      exportProxy += tpl.resilienceReliefFactor;
      resilienceSynergy += tpl.resilienceSynergyFactor;
    }
  }
  if (params.federatedNetZeroExportBand === 'federated_net_zero_export_corridor' || params.federatedNetZeroExportBand === 'federated_federated_net_zero_export_leader') {
    exportGain += 20;
    resilienceSynergy += 0.14;
  }
  if (params.interregionalInterconnectionRelief > 2.2) {
    exportGain += params.interregionalInterconnectionRelief * 0.55;
    exportProxy += clamp(params.interregionalInterconnectionRelief * 0.008, 0, 0.04);
  }
  if (params.decarbonFederationRelief > 2.2) resilienceSynergy += clamp(params.decarbonFederationRelief * 0.009, 0, 0.04);

  const stressLoad = clamp(params.gridStressPoints * 0.16, 0, 6.6);
  const prevIdx = params.prev?.resilienceIndex ?? 0;
  const resilienceIndex = clamp(
    prevIdx * 0.74 + exportGain * 0.11 + exportProxy * 27 - stressLoad * 0.022 + resilienceSynergy * 28,
    0,
    208,
  );

  let band: V1014ClimateResilienceExportFederationBand = 'fragile_resilience_mesh';
  if (resilienceIndex >= 134 || exportGain >= 160) band = 'deep_climate_resilience_export_federation_mesh';
  else if (resilienceIndex >= 94 || exportGain >= 114) band = 'climate_resilience_export_federation_hub';
  else if (resilienceIndex >= 48 || exportGain >= 46) band = 'pilot_resilience_fed';

  let climateResilienceExportFederationRelief = clamp(resilienceIndex / 16.5 + exportProxy * 6.5 + resilienceSynergy * 7.1, 0, 10.7);
  if (band === 'fragile_resilience_mesh') climateResilienceExportFederationRelief = clamp(climateResilienceExportFederationRelief * 0.12, 0, 1.25);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      resilienceIndex: clamp(resilienceIndex, 0, 208),
      climateResilienceExportFederationRelief: clamp(climateResilienceExportFederationRelief, 0, 10.7),
      summary: `${params.regionId} climate resilience export federation ${band} · idx ${resilienceIndex.toFixed(0)} · relief ${climateResilienceExportFederationRelief.toFixed(1)}`,
    },
    next: { resilienceIndex: clamp(resilienceIndex, 0, 208) },
  };
}

export function runAgent13FederatedNetZeroExportClimateResilienceScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_FEDERATED_NET_ZERO_EXPORT_CATALOG.length >= 4);
  ok(V1014_CLIMATE_RESILIENCE_EXPORT_FEDERATION_CATALOG.length >= 4);

  const reserveStep = computeRegionalFederatedNetZeroExportLedger({
    regionId: 'NSW',
    strategicReserveCarbonNeutralityRelief: 2.6,
    sovereignGreenGridFederationRelief: 2.5,
    interregionalInterconnectionRelief: 2.7,
    decarbonFederationRelief: 2.5,
    safeguardCertificateRelief: 2.4,
    renewableShareScore: 56,
    completedProjectTypes: ['federated_net_zero_export_hub', 'federation_federated_net_zero_export_tie', 'federated_net_zero_export_recovery_hub'],
  });
  ok(reserveStep.ledger.federatedNetZeroExportRelief >= 1.5 || reserveStep.ledger.band !== 'isolated_export_lane');

  const indFed = advanceRegionalClimateResilienceExportFederationOrchestration({
    regionId: 'NSW',
    gridStressPoints: 15,
    federatedNetZeroExportBand: reserveStep.ledger.band,
    interregionalInterconnectionRelief: 2.6,
    decarbonFederationRelief: 2.5,
    completedProjectTypes: ['climate_resilience_export_load_stack', 'strategic_reserve_coupling_hub'],
  });
  ok(indFed.ledger.climateResilienceExportFederationRelief >= 1.25 || indFed.ledger.band !== 'fragile_resilience_mesh');

  const turnSc = runAgent13FederatedNetZeroExportClimateResilienceTurnScenario(V1014_FEDERATED_NET_ZERO_EXPORT_CLIMATE_RESILIENCE_TURN_SCENARIOS[0]);
  ok(turnSc.passed);

  const gi = scoreAgent13FederatedNetZeroExportClimateResilienceGIAlignment({
    actionText:
      'Federated net-zero export hub with sovereign green strategic reserve corridor, federated net-zero coordination mesh, climate resilience export load stack, net-zero export coupling hub, national climate resilience export mesh mesh, and climate resilience export corridor',
    federatedNetZeroExportBand: 'federated_net_zero_export_corridor',
    climateResilienceExportFederationBand: 'climate_resilience_export_federation_hub',
  });
  ok(gi.relevanceDelta > 0.85 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13FederatedNetZeroExportClimateResilienceTurnStep {
  turn: number;
  regionId: string;
  strategicReserveCarbonNeutralityRelief: number;
  sovereignGreenGridFederationRelief: number;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  safeguardCertificateRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  completedProjectTypes: string[];
}

export interface Agent13FederatedNetZeroExportClimateResilienceTurnScenario {
  id: string;
  label: string;
  steps: Agent13FederatedNetZeroExportClimateResilienceTurnStep[];
  expect: { minStrategicReserveReliefOnLast?: number; minSovereignGridReliefOnLast?: number };
}

export const V1014_FEDERATED_NET_ZERO_EXPORT_CLIMATE_RESILIENCE_TURN_SCENARIOS: readonly Agent13FederatedNetZeroExportClimateResilienceTurnScenario[] = [
  {
    id: 'sc_nssr_nsw_escalation',
    label: 'NSW federated net-zero export neutrality corridor with climate resilience export federation mesh',
    steps: [
      {
        turn: 1,
        regionId: 'NSW',
        strategicReserveCarbonNeutralityRelief: 2,
        sovereignGreenGridFederationRelief: 1.9,
        interregionalInterconnectionRelief: 2.1,
        decarbonFederationRelief: 2,
        safeguardCertificateRelief: 1.9,
        renewableShareScore: 44,
        gridStressPoints: 18,
        completedProjectTypes: ['federated_net_zero_export_hub', 'climate_resilience_export_load_stack'],
      },
      {
        turn: 2,
        regionId: 'NSW',
        strategicReserveCarbonNeutralityRelief: 2.3,
        sovereignGreenGridFederationRelief: 2.2,
        interregionalInterconnectionRelief: 2.4,
        decarbonFederationRelief: 2.3,
        safeguardCertificateRelief: 2.2,
        renewableShareScore: 50,
        gridStressPoints: 17,
        completedProjectTypes: ['sovereign_green_strategic_reserve_corridor', 'national_sovereign_strategic_reserve_mesh'],
      },
      {
        turn: 3,
        regionId: 'NSW',
        strategicReserveCarbonNeutralityRelief: 2.7,
        sovereignGreenGridFederationRelief: 2.6,
        interregionalInterconnectionRelief: 2.8,
        decarbonFederationRelief: 2.7,
        safeguardCertificateRelief: 2.6,
        renewableShareScore: 57,
        gridStressPoints: 15,
        completedProjectTypes: [
          'federated_net_zero_export_hub',
          'sovereign_green_strategic_reserve_corridor',
          'strategic_reserve_coordination_mesh',
          'federation_federated_net_zero_export_tie',
          'federated_net_zero_export_recovery_hub',
          'climate_resilience_export_load_stack',
          'strategic_reserve_coupling_hub',
          'national_sovereign_strategic_reserve_mesh',
          'climate_resilience_export_federation_corridor',
        ],
      },
    ],
    expect: { minStrategicReserveReliefOnLast: 1.45, minSovereignGridReliefOnLast: 1.15 },
  },
] as const;

export function runAgent13FederatedNetZeroExportClimateResilienceTurnScenario(
  scenario: Agent13FederatedNetZeroExportClimateResilienceTurnScenario,
): { passed: boolean; detail: string; lastStrategicReserveRelief: number; lastSovereignGridRelief: number } {
  let reserveMem: V1014FederatedNetZeroExportPersistedSlice | null = null;
  let indMem: V1014ClimateResilienceExportFederationPersistedSlice | null = null;
  let lastStrategicReserveRelief = 0;
  let lastSovereignGridRelief = 0;

  for (const step of scenario.steps) {
    const reserveStep = computeRegionalFederatedNetZeroExportLedger({
      regionId: step.regionId,
      strategicReserveCarbonNeutralityRelief: step.strategicReserveCarbonNeutralityRelief,
      sovereignGreenGridFederationRelief: step.sovereignGreenGridFederationRelief,
      interregionalInterconnectionRelief: step.interregionalInterconnectionRelief,
      decarbonFederationRelief: step.decarbonFederationRelief,
      safeguardCertificateRelief: step.safeguardCertificateRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: reserveMem,
    });
    reserveMem = reserveStep.next;
    lastStrategicReserveRelief = reserveStep.ledger.federatedNetZeroExportRelief;

    const indFed = advanceRegionalClimateResilienceExportFederationOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      federatedNetZeroExportBand: reserveStep.ledger.band,
      interregionalInterconnectionRelief: step.interregionalInterconnectionRelief,
      decarbonFederationRelief: step.decarbonFederationRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: indMem,
    });
    indMem = indFed.next;
    lastSovereignGridRelief = indFed.ledger.climateResilienceExportFederationRelief;
  }

  if (scenario.expect.minStrategicReserveReliefOnLast != null && lastStrategicReserveRelief < scenario.expect.minStrategicReserveReliefOnLast) {
    return { passed: false, detail: `export ${lastStrategicReserveRelief}`, lastStrategicReserveRelief, lastSovereignGridRelief };
  }
  if (scenario.expect.minSovereignGridReliefOnLast != null && lastSovereignGridRelief < scenario.expect.minSovereignGridReliefOnLast) {
    return { passed: false, detail: `fed ${lastSovereignGridRelief}`, lastStrategicReserveRelief, lastSovereignGridRelief };
  }
  return { passed: true, detail: 'ok', lastStrategicReserveRelief, lastSovereignGridRelief };
}

export function scoreAgent13FederatedNetZeroExportClimateResilienceGIAlignment(params: {
  actionText: string;
  federatedNetZeroExportBand?: string;
  climateResilienceExportFederationBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'federated net-zero export neutrality',
    'sovereign green strategic reserve',
    'climate resilience export federation',
    'federated net-zero coordination',
    'climate resilience export load',
    'net-zero export coupling',
    'national climate resilience export mesh',
    'climate resilience export corridor',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.12, 0, 2);
  if (params.federatedNetZeroExportBand === 'federated_net_zero_export_leader' || params.federatedNetZeroExportBand === 'federated_net_zero_export_corridor') {
    delta += hits.some(h => h.includes('export')) ? 0.35 : 0.08;
  }
  if (params.climateResilienceExportFederationBand === 'climate_resilience_export_federation_hub' || params.climateResilienceExportFederationBand === 'deep_climate_resilience_export_federation_mesh') {
    delta += hits.some(h => h.includes('transmission') || h.includes('reserve')) ? 0.33 : 0.08;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Federated net-zero export GI: ${hits.slice(0, 2).join(', ')} aligns with federated net-zero export neutrality corridor and climate resilience export federation depth.`
        : null,
  };
}
