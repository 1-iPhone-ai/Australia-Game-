/**
 * Agent 13 scale wave round 51 (O10-233) — sovereign export resilience & national security federation orchestration depth.
 */

export type V1014SovereignExportResilienceBand =
  | 'isolated_resilience'
  | 'pilot_export_resilience'
  | 'sovereign_export_resilience_corridor'
  | 'federated_sovereign_export_resilience_leader';

export type V1014NationalSecurityFederationBand =
  | 'fragile_security_mesh'
  | 'pilot_security_fed'
  | 'national_security_federation_hub'
  | 'deep_national_security_federation_mesh';

export interface V1014SovereignExportResilienceInstrument {
  id: string;
  kind:
    | 'sovereign_export_resilience_hub'
    | 'sovereign_green_export_resilience_corridor'
    | 'export_resilience_coordination_mesh'
    | 'federation_sovereign_export_resilience_tie';
  label: string;
  resilienceScoreEq: number;
  resilienceReliefFactor: number;
  orchestrationSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_SOVEREIGN_EXPORT_RESILIENCE_CATALOG: readonly V1014SovereignExportResilienceInstrument[] = [
  {
    id: 'ser_hub',
    kind: 'sovereign_export_resilience_hub',
    label: 'Sovereign export resilience hub',
    resilienceScoreEq: 48,
    resilienceReliefFactor: 0.17,
    orchestrationSynergyFactor: 0.12,
    projectTypeHint: 'sovereign_export_resilience_hub',
  },
  {
    id: 'ser_h2',
    kind: 'sovereign_green_export_resilience_corridor',
    label: 'Sovereign green export continuity corridor',
    resilienceScoreEq: 46,
    resilienceReliefFactor: 0.16,
    orchestrationSynergyFactor: 0.13,
    projectTypeHint: 'sovereign_green_export_resilience_corridor',
  },
  {
    id: 'ser_mesh',
    kind: 'export_resilience_coordination_mesh',
    label: 'Export continuity orchestration mesh',
    resilienceScoreEq: 50,
    resilienceReliefFactor: 0.18,
    orchestrationSynergyFactor: 0.11,
    projectTypeHint: 'export_resilience_coordination_mesh',
  },
  {
    id: 'ser_fed',
    kind: 'federation_sovereign_export_resilience_tie',
    label: 'Federation sovereign export resilience corridor tie',
    resilienceScoreEq: 52,
    resilienceReliefFactor: 0.17,
    orchestrationSynergyFactor: 0.14,
    projectTypeHint: 'federation_sovereign_export_resilience_tie',
  },
] as const;

export interface V1014NationalSecurityFederationTemplate {
  id: string;
  kind:
    | 'national_security_load_stack'
    | 'export_resilience_coupling_hub'
    | 'national_sovereign_export_resilience_mesh'
    | 'national_security_federation_corridor';
  label: string;
  securityScoreEq: number;
  securityReliefFactor: number;
  resilienceSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_NATIONAL_SECURITY_FEDERATION_CATALOG: readonly V1014NationalSecurityFederationTemplate[] = [
  {
    id: 'nsf_stack',
    kind: 'national_security_load_stack',
    label: 'Sovereign export load stack',
    securityScoreEq: 47,
    securityReliefFactor: 0.16,
    resilienceSynergyFactor: 0.12,
    projectTypeHint: 'national_security_load_stack',
  },
  {
    id: 'nsf_couple',
    kind: 'export_resilience_coupling_hub',
    label: 'Export coupling security hub',
    securityScoreEq: 49,
    securityReliefFactor: 0.17,
    resilienceSynergyFactor: 0.13,
    projectTypeHint: 'export_resilience_coupling_hub',
  },
  {
    id: 'nsf_mesh',
    kind: 'national_sovereign_export_resilience_mesh',
    label: 'National sovereign renewable export security mesh',
    securityScoreEq: 51,
    securityReliefFactor: 0.18,
    resilienceSynergyFactor: 0.11,
    projectTypeHint: 'national_sovereign_export_resilience_mesh',
  },
  {
    id: 'nsf_sec',
    kind: 'national_security_federation_corridor',
    label: 'Sovereign export continuity corridor',
    securityScoreEq: 45,
    securityReliefFactor: 0.15,
    resilienceSynergyFactor: 0.11,
    projectTypeHint: 'national_security_federation_corridor',
  },
] as const;

export interface V1014RegionalSovereignExportResilienceLedger {
  regionId: string;
  band: V1014SovereignExportResilienceBand;
  resilienceIndex: number;
  resilienceBalance: number;
  sovereignExportResilienceRelief: number;
  summary: string;
}

export interface V1014RegionalNationalSecurityFederationLedger {
  regionId: string;
  band: V1014NationalSecurityFederationBand;
  securityIndex: number;
  nationalSecurityFederationRelief: number;
  summary: string;
}

export interface V1014SovereignExportResiliencePersistedSlice {
  resilienceBalance: number;
  resilienceIndex: number;
}

export interface V1014NationalSecurityFederationPersistedSlice {
  securityIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const SOVEREIGN_RESILIENCE_HUB_REGIONS = new Set(['QLD', 'NSW', 'VIC', 'WA']);

export function computeRegionalSovereignExportResilienceLedger(params: {
  regionId: string;
  sovereignContinuityFederationRelief: number;
  nationalExportOrchestrationRelief: number;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  safeguardCertificateRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014SovereignExportResiliencePersistedSlice | null;
}): { ledger: V1014RegionalSovereignExportResilienceLedger; next: V1014SovereignExportResiliencePersistedSlice } {
  let resilienceGain = 0;
  let resilienceProxy = 0;
  let orchestrationSynergy = 0;
  for (const inst of V1014_SOVEREIGN_EXPORT_RESILIENCE_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      resilienceGain += inst.resilienceScoreEq;
      resilienceProxy += inst.resilienceReliefFactor;
      orchestrationSynergy += inst.orchestrationSynergyFactor;
    }
  }
  if (params.completedProjectTypes.includes('sovereign_export_resilience_recovery_hub')) {
    resilienceGain += 14;
    resilienceProxy += 0.05;
  }
  if (SOVEREIGN_RESILIENCE_HUB_REGIONS.has(params.regionId)) resilienceProxy += 0.07;
  else resilienceProxy *= 0.68;
  if (params.sovereignContinuityFederationRelief > 2.4) orchestrationSynergy += clamp(params.sovereignContinuityFederationRelief * 0.009, 0, 0.05);
  if (params.nationalExportOrchestrationRelief > 2.3) resilienceGain += clamp(params.nationalExportOrchestrationRelief * 0.5, 0, 6.5);
  if (params.interregionalInterconnectionRelief > 2.2) {
    resilienceGain += clamp(params.interregionalInterconnectionRelief * 0.6, 0, 7.2);
    resilienceProxy += clamp(params.interregionalInterconnectionRelief * 0.008, 0, 0.04);
  }
  if (params.decarbonFederationRelief > 2.2) orchestrationSynergy += clamp(params.decarbonFederationRelief * 0.01, 0, 0.05);
  if (params.safeguardCertificateRelief > 2.2) resilienceProxy += clamp(params.safeguardCertificateRelief * 0.008, 0, 0.04);
  resilienceProxy += clamp(params.renewableShareScore / 110, 0, 0.09);

  const prevIdx = params.prev?.resilienceIndex ?? 0;
  const prevBal = params.prev?.resilienceBalance ?? 0;
  const resilienceBalance = clamp(prevBal * 0.78 + resilienceGain * 0.11, 0, 262);
  const resilienceIndex = clamp(prevIdx * 0.75 + resilienceBalance * 0.1 + resilienceProxy * 76 + orchestrationSynergy * 27, 0, 208);

  let band: V1014SovereignExportResilienceBand = 'isolated_resilience';
  if (resilienceIndex >= 132 || resilienceGain >= 155) band = 'federated_sovereign_export_resilience_leader';
  else if (resilienceIndex >= 92 || resilienceGain >= 110) band = 'sovereign_export_resilience_corridor';
  else if (resilienceIndex >= 46 || resilienceGain >= 44) band = 'pilot_export_resilience';

  let sovereignExportResilienceRelief = clamp(resilienceProxy * 8.1 + resilienceGain * 0.028 + orchestrationSynergy * 5.2, 0, 10.8);
  if (band === 'isolated_resilience') sovereignExportResilienceRelief *= 0.13;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      resilienceIndex: clamp(resilienceIndex, 0, 208),
      resilienceBalance: clamp(resilienceBalance, 0, 262),
      sovereignExportResilienceRelief: clamp(sovereignExportResilienceRelief, 0, 10.8),
      summary: `${params.regionId} sovereign export resilience corridor ${band} · idx ${resilienceIndex.toFixed(0)} · relief ${sovereignExportResilienceRelief.toFixed(1)}`,
    },
    next: {
      resilienceBalance: clamp(resilienceBalance, 0, 262),
      resilienceIndex: clamp(resilienceIndex, 0, 208),
    },
  };
}

export function advanceRegionalNationalSecurityFederationOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  sovereignExportResilienceBand: V1014SovereignExportResilienceBand;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  completedProjectTypes: string[];
  prev?: V1014NationalSecurityFederationPersistedSlice | null;
}): { ledger: V1014RegionalNationalSecurityFederationLedger; next: V1014NationalSecurityFederationPersistedSlice } {
  let resilienceGain = 0;
  let resilienceProxy = 0;
  let exportSynergy = 0;
  for (const tpl of V1014_NATIONAL_SECURITY_FEDERATION_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      resilienceGain += tpl.securityScoreEq;
      resilienceProxy += tpl.securityReliefFactor;
      exportSynergy += tpl.resilienceSynergyFactor;
    }
  }
  if (params.sovereignExportResilienceBand === 'sovereign_export_resilience_corridor' || params.sovereignExportResilienceBand === 'federated_sovereign_export_resilience_leader') {
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

  let band: V1014NationalSecurityFederationBand = 'fragile_security_mesh';
  if (securityIndex >= 134 || resilienceGain >= 160) band = 'deep_national_security_federation_mesh';
  else if (securityIndex >= 94 || resilienceGain >= 114) band = 'national_security_federation_hub';
  else if (securityIndex >= 48 || resilienceGain >= 46) band = 'pilot_security_fed';

  let nationalSecurityFederationRelief = clamp(securityIndex / 16.5 + resilienceProxy * 6.5 + exportSynergy * 7.1, 0, 10.7);
  if (band === 'fragile_security_mesh') nationalSecurityFederationRelief = clamp(nationalSecurityFederationRelief * 0.12, 0, 1.25);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      securityIndex: clamp(securityIndex, 0, 208),
      nationalSecurityFederationRelief: clamp(nationalSecurityFederationRelief, 0, 10.7),
      summary: `${params.regionId} national security federation ${band} · idx ${securityIndex.toFixed(0)} · relief ${nationalSecurityFederationRelief.toFixed(1)}`,
    },
    next: { securityIndex: clamp(securityIndex, 0, 208) },
  };
}

export function runAgent13SovereignExportResilienceNationalSecurityScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_SOVEREIGN_EXPORT_RESILIENCE_CATALOG.length >= 4);
  ok(V1014_NATIONAL_SECURITY_FEDERATION_CATALOG.length >= 4);

  const resilienceStep = computeRegionalSovereignExportResilienceLedger({
    regionId: 'NSW',
    sovereignContinuityFederationRelief: 2.6,
    nationalExportOrchestrationRelief: 2.5,
    interregionalInterconnectionRelief: 2.7,
    decarbonFederationRelief: 2.5,
    safeguardCertificateRelief: 2.4,
    renewableShareScore: 56,
    completedProjectTypes: ['sovereign_export_resilience_hub', 'federation_sovereign_export_resilience_tie', 'sovereign_export_resilience_recovery_hub'],
  });
  ok(resilienceStep.ledger.sovereignExportResilienceRelief >= 1.5 || resilienceStep.ledger.band !== 'isolated_resilience');

  const fed = advanceRegionalNationalSecurityFederationOrchestration({
    regionId: 'NSW',
    gridStressPoints: 15,
    sovereignExportResilienceBand: resilienceStep.ledger.band,
    interregionalInterconnectionRelief: 2.6,
    decarbonFederationRelief: 2.5,
    completedProjectTypes: ['national_security_load_stack', 'export_resilience_coupling_hub'],
  });
  ok(fed.ledger.nationalSecurityFederationRelief >= 1.25 || fed.ledger.band !== 'fragile_security_mesh');

  const turnSc = runAgent13SovereignExportResilienceNationalSecurityTurnScenario(V1014_SOVEREIGN_EXPORT_RESILIENCE_NATIONAL_SECURITY_TURN_SCENARIOS[0]);
  ok(turnSc.passed);

  const gi = scoreAgent13SovereignExportResilienceNationalSecurityGIAlignment({
    actionText:
      'Sovereign export resilience hub with sovereign green export resilience corridor, export resilience coordination mesh, national security load stack, export resilience coupling hub, national sovereign export resilience mesh, and national security corridor',
    sovereignExportResilienceBand: 'sovereign_export_resilience_corridor',
    nationalSecurityFederationBand: 'national_security_federation_hub',
  });
  ok(gi.relevanceDelta > 0.85 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13SovereignExportResilienceNationalSecurityTurnStep {
  turn: number;
  regionId: string;
  sovereignContinuityFederationRelief: number;
  nationalExportOrchestrationRelief: number;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  safeguardCertificateRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  completedProjectTypes: string[];
}

export interface Agent13SovereignExportResilienceNationalSecurityTurnScenario {
  id: string;
  label: string;
  steps: Agent13SovereignExportResilienceNationalSecurityTurnStep[];
  expect: { minResilienceReliefOnLast?: number; minNationalSecurityReliefOnLast?: number };
}

export const V1014_SOVEREIGN_EXPORT_RESILIENCE_NATIONAL_SECURITY_TURN_SCENARIOS: readonly Agent13SovereignExportResilienceNationalSecurityTurnScenario[] = [
  {
    id: 'sc_ser_nsw_escalation',
    label: 'NSW sovereign export resilience corridor with national security federation mesh',
    steps: [
      {
        turn: 1,
        regionId: 'NSW',
        sovereignContinuityFederationRelief: 2,
        nationalExportOrchestrationRelief: 1.9,
        interregionalInterconnectionRelief: 2.1,
        decarbonFederationRelief: 2,
        safeguardCertificateRelief: 1.9,
        renewableShareScore: 44,
        gridStressPoints: 18,
        completedProjectTypes: ['sovereign_export_resilience_hub', 'national_security_load_stack'],
      },
      {
        turn: 2,
        regionId: 'NSW',
        sovereignContinuityFederationRelief: 2.3,
        nationalExportOrchestrationRelief: 2.2,
        interregionalInterconnectionRelief: 2.4,
        decarbonFederationRelief: 2.3,
        safeguardCertificateRelief: 2.2,
        renewableShareScore: 50,
        gridStressPoints: 17,
        completedProjectTypes: ['sovereign_green_export_resilience_corridor', 'national_sovereign_export_resilience_mesh'],
      },
      {
        turn: 3,
        regionId: 'NSW',
        sovereignContinuityFederationRelief: 2.7,
        nationalExportOrchestrationRelief: 2.6,
        interregionalInterconnectionRelief: 2.8,
        decarbonFederationRelief: 2.7,
        safeguardCertificateRelief: 2.6,
        renewableShareScore: 57,
        gridStressPoints: 15,
        completedProjectTypes: [
          'sovereign_export_resilience_hub',
          'sovereign_green_export_resilience_corridor',
          'export_resilience_coordination_mesh',
          'federation_sovereign_export_resilience_tie',
          'sovereign_export_resilience_recovery_hub',
          'national_security_load_stack',
          'export_resilience_coupling_hub',
          'national_sovereign_export_resilience_mesh',
          'national_security_federation_corridor',
        ],
      },
    ],
    expect: { minResilienceReliefOnLast: 1.45, minNationalSecurityReliefOnLast: 1.15 },
  },
] as const;

export function runAgent13SovereignExportResilienceNationalSecurityTurnScenario(
  scenario: Agent13SovereignExportResilienceNationalSecurityTurnScenario,
): { passed: boolean; detail: string; lastResilienceRelief: number; lastNationalSecurityRelief: number } {
  let resilienceMem: V1014SovereignExportResiliencePersistedSlice | null = null;
  let secMem: V1014NationalSecurityFederationPersistedSlice | null = null;
  let lastResilienceRelief = 0;
  let lastNationalSecurityRelief = 0;

  for (const step of scenario.steps) {
    const resilienceStep = computeRegionalSovereignExportResilienceLedger({
      regionId: step.regionId,
      sovereignContinuityFederationRelief: step.sovereignContinuityFederationRelief,
      nationalExportOrchestrationRelief: step.nationalExportOrchestrationRelief,
      interregionalInterconnectionRelief: step.interregionalInterconnectionRelief,
      decarbonFederationRelief: step.decarbonFederationRelief,
      safeguardCertificateRelief: step.safeguardCertificateRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: resilienceMem,
    });
    resilienceMem = resilienceStep.next;
    lastResilienceRelief = resilienceStep.ledger.sovereignExportResilienceRelief;

    const fed = advanceRegionalNationalSecurityFederationOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      sovereignExportResilienceBand: resilienceStep.ledger.band,
      interregionalInterconnectionRelief: step.interregionalInterconnectionRelief,
      decarbonFederationRelief: step.decarbonFederationRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: secMem,
    });
    secMem = fed.next;
    lastNationalSecurityRelief = fed.ledger.nationalSecurityFederationRelief;
  }

  if (scenario.expect.minResilienceReliefOnLast != null && lastResilienceRelief < scenario.expect.minResilienceReliefOnLast) {
    return { passed: false, detail: `export ${lastResilienceRelief}`, lastResilienceRelief, lastNationalSecurityRelief };
  }
  if (scenario.expect.minNationalSecurityReliefOnLast != null && lastNationalSecurityRelief < scenario.expect.minNationalSecurityReliefOnLast) {
    return { passed: false, detail: `fed ${lastNationalSecurityRelief}`, lastResilienceRelief, lastNationalSecurityRelief };
  }
  return { passed: true, detail: 'ok', lastResilienceRelief, lastNationalSecurityRelief };
}

export function scoreAgent13SovereignExportResilienceNationalSecurityGIAlignment(params: {
  actionText: string;
  sovereignExportResilienceBand?: string;
  nationalSecurityFederationBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'sovereign export resilience',
    'sovereign green export resilience',
    'national security federation',
    'export resilience coordination',
    'national security load',
    'export resilience coupling',
    'national sovereign export resilience',
    'national security corridor',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.12, 0, 2);
  if (params.sovereignExportResilienceBand === 'federated_sovereign_export_resilience_leader' || params.sovereignExportResilienceBand === 'sovereign_export_resilience_corridor') {
    delta += hits.some(h => h.includes('export')) ? 0.35 : 0.08;
  }
  if (params.nationalSecurityFederationBand === 'national_security_federation_hub' || params.nationalSecurityFederationBand === 'deep_national_security_federation_mesh') {
    delta += hits.some(h => h.includes('transmission') || h.includes('resilience')) ? 0.33 : 0.08;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Sovereign export resilience GI: ${hits.slice(0, 2).join(', ')} aligns with sovereign export resilience corridor and national security federation depth.`
        : null,
  };
}
