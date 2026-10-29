/**
 * Agent 13 scale wave round 50 (O10-231) — national export orchestration & sovereign continuity federation orchestration depth.
 */

export type V1014NationalExportOrchestrationBand =
  | 'isolated_orchestration'
  | 'pilot_export_orchestration'
  | 'national_export_orchestration_corridor'
  | 'federated_national_export_orchestration_leader';

export type V1014SovereignContinuityFederationBand =
  | 'fragile_continuity_mesh'
  | 'pilot_continuity_fed'
  | 'sovereign_continuity_federation_hub'
  | 'deep_sovereign_continuity_federation_mesh';

export interface V1014NationalExportOrchestrationInstrument {
  id: string;
  kind:
    | 'national_export_orchestration_hub'
    | 'sovereign_green_export_orchestration_corridor'
    | 'export_orchestration_coordination_mesh'
    | 'federation_national_export_orchestration_tie';
  label: string;
  continuityScoreEq: number;
  continuityReliefFactor: number;
  securitySynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_NATIONAL_EXPORT_ORCHESTRATION_CATALOG: readonly V1014NationalExportOrchestrationInstrument[] = [
  {
    id: 'neo_hub',
    kind: 'national_export_orchestration_hub',
    label: 'National export orchestration hub',
    continuityScoreEq: 48,
    continuityReliefFactor: 0.17,
    securitySynergyFactor: 0.12,
    projectTypeHint: 'national_export_orchestration_hub',
  },
  {
    id: 'neo_h2',
    kind: 'sovereign_green_export_orchestration_corridor',
    label: 'Sovereign green export continuity corridor',
    continuityScoreEq: 46,
    continuityReliefFactor: 0.16,
    securitySynergyFactor: 0.13,
    projectTypeHint: 'sovereign_green_export_orchestration_corridor',
  },
  {
    id: 'neo_mesh',
    kind: 'export_orchestration_coordination_mesh',
    label: 'Export continuity orchestration mesh',
    continuityScoreEq: 50,
    continuityReliefFactor: 0.18,
    securitySynergyFactor: 0.11,
    projectTypeHint: 'export_orchestration_coordination_mesh',
  },
  {
    id: 'neo_fed',
    kind: 'federation_national_export_orchestration_tie',
    label: 'Federation national export orchestration corridor tie',
    continuityScoreEq: 52,
    continuityReliefFactor: 0.17,
    securitySynergyFactor: 0.14,
    projectTypeHint: 'federation_national_export_orchestration_tie',
  },
] as const;

export interface V1014SovereignContinuityFederationTemplate {
  id: string;
  kind:
    | 'sovereign_orchestration_load_stack'
    | 'export_orchestration_coupling_hub'
    | 'national_sovereign_export_orchestration_mesh'
    | 'sovereign_continuity_federation_corridor';
  label: string;
  securityScoreEq: number;
  securityReliefFactor: number;
  continuitySynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_SOVEREIGN_CONTINUITY_FEDERATION_CATALOG: readonly V1014SovereignContinuityFederationTemplate[] = [
  {
    id: 'scf_stack',
    kind: 'sovereign_orchestration_load_stack',
    label: 'Sovereign export load stack',
    securityScoreEq: 47,
    securityReliefFactor: 0.16,
    continuitySynergyFactor: 0.12,
    projectTypeHint: 'sovereign_orchestration_load_stack',
  },
  {
    id: 'scf_couple',
    kind: 'export_orchestration_coupling_hub',
    label: 'Export coupling security hub',
    securityScoreEq: 49,
    securityReliefFactor: 0.17,
    continuitySynergyFactor: 0.13,
    projectTypeHint: 'export_orchestration_coupling_hub',
  },
  {
    id: 'scf_mesh',
    kind: 'national_sovereign_export_orchestration_mesh',
    label: 'National sovereign renewable export security mesh',
    securityScoreEq: 51,
    securityReliefFactor: 0.18,
    continuitySynergyFactor: 0.11,
    projectTypeHint: 'national_sovereign_export_orchestration_mesh',
  },
  {
    id: 'scf_sec',
    kind: 'sovereign_continuity_federation_corridor',
    label: 'Sovereign export continuity corridor',
    securityScoreEq: 45,
    securityReliefFactor: 0.15,
    continuitySynergyFactor: 0.11,
    projectTypeHint: 'sovereign_continuity_federation_corridor',
  },
] as const;

export interface V1014RegionalNationalExportOrchestrationLedger {
  regionId: string;
  band: V1014NationalExportOrchestrationBand;
  continuityIndex: number;
  continuityBalance: number;
  nationalExportOrchestrationRelief: number;
  summary: string;
}

export interface V1014RegionalSovereignContinuityFederationLedger {
  regionId: string;
  band: V1014SovereignContinuityFederationBand;
  securityIndex: number;
  sovereignContinuityFederationRelief: number;
  summary: string;
}

export interface V1014NationalExportOrchestrationPersistedSlice {
  continuityBalance: number;
  continuityIndex: number;
}

export interface V1014SovereignContinuityFederationPersistedSlice {
  securityIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const NATIONAL_ORCHESTRATION_HUB_REGIONS = new Set(['QLD', 'NSW', 'VIC', 'WA']);

export function computeRegionalNationalExportOrchestrationLedger(params: {
  regionId: string;
  sovereignExportSecurityFederationRelief: number;
  renewableExportContinuityRelief: number;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  safeguardCertificateRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014NationalExportOrchestrationPersistedSlice | null;
}): { ledger: V1014RegionalNationalExportOrchestrationLedger; next: V1014NationalExportOrchestrationPersistedSlice } {
  let exportGain = 0;
  let exportProxy = 0;
  let resilienceSynergy = 0;
  for (const inst of V1014_NATIONAL_EXPORT_ORCHESTRATION_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      exportGain += inst.continuityScoreEq;
      exportProxy += inst.continuityReliefFactor;
      resilienceSynergy += inst.securitySynergyFactor;
    }
  }
  if (params.completedProjectTypes.includes('national_export_orchestration_recovery_hub')) {
    exportGain += 14;
    exportProxy += 0.05;
  }
  if (NATIONAL_ORCHESTRATION_HUB_REGIONS.has(params.regionId)) exportProxy += 0.07;
  else exportProxy *= 0.68;
  if (params.sovereignExportSecurityFederationRelief > 2.4) resilienceSynergy += clamp(params.sovereignExportSecurityFederationRelief * 0.009, 0, 0.05);
  if (params.renewableExportContinuityRelief > 2.3) exportGain += clamp(params.renewableExportContinuityRelief * 0.5, 0, 6.5);
  if (params.interregionalInterconnectionRelief > 2.2) {
    exportGain += clamp(params.interregionalInterconnectionRelief * 0.6, 0, 7.2);
    exportProxy += clamp(params.interregionalInterconnectionRelief * 0.008, 0, 0.04);
  }
  if (params.decarbonFederationRelief > 2.2) resilienceSynergy += clamp(params.decarbonFederationRelief * 0.01, 0, 0.05);
  if (params.safeguardCertificateRelief > 2.2) exportProxy += clamp(params.safeguardCertificateRelief * 0.008, 0, 0.04);
  exportProxy += clamp(params.renewableShareScore / 110, 0, 0.09);

  const prevIdx = params.prev?.continuityIndex ?? 0;
  const prevBal = params.prev?.continuityBalance ?? 0;
  const continuityBalance = clamp(prevBal * 0.78 + exportGain * 0.11, 0, 262);
  const continuityIndex = clamp(prevIdx * 0.75 + continuityBalance * 0.1 + exportProxy * 76 + resilienceSynergy * 27, 0, 208);

  let band: V1014NationalExportOrchestrationBand = 'isolated_orchestration';
  if (continuityIndex >= 132 || exportGain >= 155) band = 'federated_national_export_orchestration_leader';
  else if (continuityIndex >= 92 || exportGain >= 110) band = 'national_export_orchestration_corridor';
  else if (continuityIndex >= 46 || exportGain >= 44) band = 'pilot_export_orchestration';

  let nationalExportOrchestrationRelief = clamp(exportProxy * 8.1 + exportGain * 0.028 + resilienceSynergy * 5.2, 0, 10.8);
  if (band === 'isolated_orchestration') nationalExportOrchestrationRelief *= 0.13;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      continuityIndex: clamp(continuityIndex, 0, 208),
      continuityBalance: clamp(continuityBalance, 0, 262),
      nationalExportOrchestrationRelief: clamp(nationalExportOrchestrationRelief, 0, 10.8),
      summary: `${params.regionId} national export orchestration corridor ${band} · idx ${continuityIndex.toFixed(0)} · relief ${nationalExportOrchestrationRelief.toFixed(1)}`,
    },
    next: {
      continuityBalance: clamp(continuityBalance, 0, 262),
      continuityIndex: clamp(continuityIndex, 0, 208),
    },
  };
}

export function advanceRegionalSovereignContinuityFederationOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  nationalExportOrchestrationBand: V1014NationalExportOrchestrationBand;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  completedProjectTypes: string[];
  prev?: V1014SovereignContinuityFederationPersistedSlice | null;
}): { ledger: V1014RegionalSovereignContinuityFederationLedger; next: V1014SovereignContinuityFederationPersistedSlice } {
  let resilienceGain = 0;
  let resilienceProxy = 0;
  let exportSynergy = 0;
  for (const tpl of V1014_SOVEREIGN_CONTINUITY_FEDERATION_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      resilienceGain += tpl.securityScoreEq;
      resilienceProxy += tpl.securityReliefFactor;
      exportSynergy += tpl.continuitySynergyFactor;
    }
  }
  if (params.nationalExportOrchestrationBand === 'national_export_orchestration_corridor' || params.nationalExportOrchestrationBand === 'federated_national_export_orchestration_leader') {
    resilienceGain += 20;
    exportSynergy += 0.14;
  }
  if (params.interregionalInterconnectionRelief > 2.2) {
    resilienceGain += params.interregionalInterconnectionRelief * 0.55;
    resilienceProxy += clamp(params.interregionalInterconnectionRelief * 0.008, 0, 0.04);
  }
  if (params.decarbonFederationRelief > 2.2) exportSynergy += clamp(params.decarbonFederationRelief * 0.009, 0, 0.04);

  const stressLoad = clamp(params.gridStressPoints * 0.16, 0, 6.6);
  const prevIdx = params.prev?.securityIndex ?? 0;
  const securityIndex = clamp(
    prevIdx * 0.74 + resilienceGain * 0.11 + resilienceProxy * 27 - stressLoad * 0.022 + exportSynergy * 28,
    0,
    208,
  );

  let band: V1014SovereignContinuityFederationBand = 'fragile_continuity_mesh';
  if (securityIndex >= 134 || resilienceGain >= 160) band = 'deep_sovereign_continuity_federation_mesh';
  else if (securityIndex >= 94 || resilienceGain >= 114) band = 'sovereign_continuity_federation_hub';
  else if (securityIndex >= 48 || resilienceGain >= 46) band = 'pilot_continuity_fed';

  let sovereignContinuityFederationRelief = clamp(securityIndex / 16.5 + resilienceProxy * 6.5 + exportSynergy * 7.1, 0, 10.7);
  if (band === 'fragile_continuity_mesh') sovereignContinuityFederationRelief = clamp(sovereignContinuityFederationRelief * 0.12, 0, 1.25);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      securityIndex: clamp(securityIndex, 0, 208),
      sovereignContinuityFederationRelief: clamp(sovereignContinuityFederationRelief, 0, 10.7),
      summary: `${params.regionId} sovereign continuity federation ${band} · idx ${securityIndex.toFixed(0)} · relief ${sovereignContinuityFederationRelief.toFixed(1)}`,
    },
    next: { securityIndex: clamp(securityIndex, 0, 208) },
  };
}

export function runAgent13NationalExportOrchestrationSovereignContinuityScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_NATIONAL_EXPORT_ORCHESTRATION_CATALOG.length >= 4);
  ok(V1014_SOVEREIGN_CONTINUITY_FEDERATION_CATALOG.length >= 4);

  const exportStep = computeRegionalNationalExportOrchestrationLedger({
    regionId: 'NSW',
    sovereignExportSecurityFederationRelief: 2.6,
    renewableExportContinuityRelief: 2.5,
    interregionalInterconnectionRelief: 2.7,
    decarbonFederationRelief: 2.5,
    safeguardCertificateRelief: 2.4,
    renewableShareScore: 56,
    completedProjectTypes: ['national_export_orchestration_hub', 'federation_national_export_orchestration_tie', 'national_export_orchestration_recovery_hub'],
  });
  ok(exportStep.ledger.nationalExportOrchestrationRelief >= 1.5 || exportStep.ledger.band !== 'isolated_orchestration');

  const fed = advanceRegionalSovereignContinuityFederationOrchestration({
    regionId: 'NSW',
    gridStressPoints: 15,
    nationalExportOrchestrationBand: exportStep.ledger.band,
    interregionalInterconnectionRelief: 2.6,
    decarbonFederationRelief: 2.5,
    completedProjectTypes: ['sovereign_orchestration_load_stack', 'export_orchestration_coupling_hub'],
  });
  ok(fed.ledger.sovereignContinuityFederationRelief >= 1.25 || fed.ledger.band !== 'fragile_continuity_mesh');

  const turnSc = runAgent13NationalExportOrchestrationSovereignContinuityTurnScenario(V1014_NATIONAL_EXPORT_ORCHESTRATION_SOVEREIGN_CONTINUITY_TURN_SCENARIOS[0]);
  ok(turnSc.passed);

  const gi = scoreAgent13NationalExportOrchestrationSovereignContinuityGIAlignment({
    actionText:
      'National export orchestration hub with sovereign green export orchestration corridor, export orchestration coordination mesh, sovereign orchestration load stack, export orchestration coupling hub, national sovereign export orchestration mesh, and sovereign continuity corridor',
    nationalExportOrchestrationBand: 'national_export_orchestration_corridor',
    sovereignContinuityFederationBand: 'sovereign_continuity_federation_hub',
  });
  ok(gi.relevanceDelta > 0.85 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13NationalExportOrchestrationSovereignContinuityTurnStep {
  turn: number;
  regionId: string;
  sovereignExportSecurityFederationRelief: number;
  renewableExportContinuityRelief: number;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  safeguardCertificateRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  completedProjectTypes: string[];
}

export interface Agent13NationalExportOrchestrationSovereignContinuityTurnScenario {
  id: string;
  label: string;
  steps: Agent13NationalExportOrchestrationSovereignContinuityTurnStep[];
  expect: { minContinuityReliefOnLast?: number; minSovereignContinuityReliefOnLast?: number };
}

export const V1014_NATIONAL_EXPORT_ORCHESTRATION_SOVEREIGN_CONTINUITY_TURN_SCENARIOS: readonly Agent13NationalExportOrchestrationSovereignContinuityTurnScenario[] = [
  {
    id: 'sc_neo_nsw_escalation',
    label: 'NSW national export orchestration corridor with sovereign continuity federation mesh',
    steps: [
      {
        turn: 1,
        regionId: 'NSW',
        sovereignExportSecurityFederationRelief: 2,
        renewableExportContinuityRelief: 1.9,
        interregionalInterconnectionRelief: 2.1,
        decarbonFederationRelief: 2,
        safeguardCertificateRelief: 1.9,
        renewableShareScore: 44,
        gridStressPoints: 18,
        completedProjectTypes: ['national_export_orchestration_hub', 'sovereign_orchestration_load_stack'],
      },
      {
        turn: 2,
        regionId: 'NSW',
        sovereignExportSecurityFederationRelief: 2.3,
        renewableExportContinuityRelief: 2.2,
        interregionalInterconnectionRelief: 2.4,
        decarbonFederationRelief: 2.3,
        safeguardCertificateRelief: 2.2,
        renewableShareScore: 50,
        gridStressPoints: 17,
        completedProjectTypes: ['sovereign_green_export_orchestration_corridor', 'national_sovereign_export_orchestration_mesh'],
      },
      {
        turn: 3,
        regionId: 'NSW',
        sovereignExportSecurityFederationRelief: 2.7,
        renewableExportContinuityRelief: 2.6,
        interregionalInterconnectionRelief: 2.8,
        decarbonFederationRelief: 2.7,
        safeguardCertificateRelief: 2.6,
        renewableShareScore: 57,
        gridStressPoints: 15,
        completedProjectTypes: [
          'national_export_orchestration_hub',
          'sovereign_green_export_orchestration_corridor',
          'export_orchestration_coordination_mesh',
          'federation_national_export_orchestration_tie',
          'national_export_orchestration_recovery_hub',
          'sovereign_orchestration_load_stack',
          'export_orchestration_coupling_hub',
          'national_sovereign_export_orchestration_mesh',
          'sovereign_continuity_federation_corridor',
        ],
      },
    ],
    expect: { minContinuityReliefOnLast: 1.45, minSovereignContinuityReliefOnLast: 1.15 },
  },
] as const;

export function runAgent13NationalExportOrchestrationSovereignContinuityTurnScenario(
  scenario: Agent13NationalExportOrchestrationSovereignContinuityTurnScenario,
): { passed: boolean; detail: string; lastContinuityRelief: number; lastSovereignContinuityRelief: number } {
  let exportMem: V1014NationalExportOrchestrationPersistedSlice | null = null;
  let fedMem: V1014SovereignContinuityFederationPersistedSlice | null = null;
  let lastContinuityRelief = 0;
  let lastSovereignContinuityRelief = 0;

  for (const step of scenario.steps) {
    const exportStep = computeRegionalNationalExportOrchestrationLedger({
      regionId: step.regionId,
      sovereignExportSecurityFederationRelief: step.sovereignExportSecurityFederationRelief,
      renewableExportContinuityRelief: step.renewableExportContinuityRelief,
      interregionalInterconnectionRelief: step.interregionalInterconnectionRelief,
      decarbonFederationRelief: step.decarbonFederationRelief,
      safeguardCertificateRelief: step.safeguardCertificateRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: exportMem,
    });
    exportMem = exportStep.next;
    lastContinuityRelief = exportStep.ledger.nationalExportOrchestrationRelief;

    const fed = advanceRegionalSovereignContinuityFederationOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      nationalExportOrchestrationBand: exportStep.ledger.band,
      interregionalInterconnectionRelief: step.interregionalInterconnectionRelief,
      decarbonFederationRelief: step.decarbonFederationRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: fedMem,
    });
    fedMem = fed.next;
    lastSovereignContinuityRelief = fed.ledger.sovereignContinuityFederationRelief;
  }

  if (scenario.expect.minContinuityReliefOnLast != null && lastContinuityRelief < scenario.expect.minContinuityReliefOnLast) {
    return { passed: false, detail: `export ${lastContinuityRelief}`, lastContinuityRelief, lastSovereignContinuityRelief };
  }
  if (scenario.expect.minSovereignContinuityReliefOnLast != null && lastSovereignContinuityRelief < scenario.expect.minSovereignContinuityReliefOnLast) {
    return { passed: false, detail: `fed ${lastSovereignContinuityRelief}`, lastContinuityRelief, lastSovereignContinuityRelief };
  }
  return { passed: true, detail: 'ok', lastContinuityRelief, lastSovereignContinuityRelief };
}

export function scoreAgent13NationalExportOrchestrationSovereignContinuityGIAlignment(params: {
  actionText: string;
  nationalExportOrchestrationBand?: string;
  sovereignContinuityFederationBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'national export orchestration',
    'sovereign green export orchestration',
    'sovereign continuity federation',
    'export orchestration coordination',
    'sovereign orchestration load',
    'export orchestration coupling',
    'national sovereign export orchestration',
    'sovereign continuity corridor',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.12, 0, 2);
  if (params.nationalExportOrchestrationBand === 'federated_national_export_orchestration_leader' || params.nationalExportOrchestrationBand === 'national_export_orchestration_corridor') {
    delta += hits.some(h => h.includes('export')) ? 0.35 : 0.08;
  }
  if (params.sovereignContinuityFederationBand === 'sovereign_continuity_federation_hub' || params.sovereignContinuityFederationBand === 'deep_sovereign_continuity_federation_mesh') {
    delta += hits.some(h => h.includes('transmission') || h.includes('resilience')) ? 0.33 : 0.08;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `National export orchestration GI: ${hits.slice(0, 2).join(', ')} aligns with sovereign national export orchestration corridor and resilience federation depth.`
        : null,
  };
}
