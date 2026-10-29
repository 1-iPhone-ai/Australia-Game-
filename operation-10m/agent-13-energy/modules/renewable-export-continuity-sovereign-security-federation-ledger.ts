/**
 * Agent 13 scale wave round 49 (O10-229) — sovereign renewable export continuity & sovereign export security federation orchestration depth.
 */

export type V1014RenewableExportContinuityBand =
  | 'isolated_continuity'
  | 'pilot_export_continuity'
  | 'renewable_export_continuity_corridor'
  | 'federated_renewable_export_continuity_leader';

export type V1014SovereignExportSecurityFederationBand =
  | 'fragile_security_mesh'
  | 'pilot_security_fed'
  | 'sovereign_export_security_hub'
  | 'deep_sovereign_export_security_mesh';

export interface V1014RenewableExportContinuityInstrument {
  id: string;
  kind:
    | 'renewable_export_continuity_hub'
    | 'sovereign_green_export_continuity_corridor'
    | 'export_continuity_orchestration_mesh'
    | 'federation_renewable_export_continuity_tie';
  label: string;
  continuityScoreEq: number;
  continuityReliefFactor: number;
  securitySynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_RENEWABLE_EXPORT_CONTINUITY_CATALOG: readonly V1014RenewableExportContinuityInstrument[] = [
  {
    id: 'ect_hub',
    kind: 'renewable_export_continuity_hub',
    label: 'Renewable export continuity hub',
    continuityScoreEq: 48,
    continuityReliefFactor: 0.17,
    securitySynergyFactor: 0.12,
    projectTypeHint: 'renewable_export_continuity_hub',
  },
  {
    id: 'ect_h2',
    kind: 'sovereign_green_export_continuity_corridor',
    label: 'Sovereign green export continuity corridor',
    continuityScoreEq: 46,
    continuityReliefFactor: 0.16,
    securitySynergyFactor: 0.13,
    projectTypeHint: 'sovereign_green_export_continuity_corridor',
  },
  {
    id: 'ect_mesh',
    kind: 'export_continuity_orchestration_mesh',
    label: 'Export continuity orchestration mesh',
    continuityScoreEq: 50,
    continuityReliefFactor: 0.18,
    securitySynergyFactor: 0.11,
    projectTypeHint: 'export_continuity_orchestration_mesh',
  },
  {
    id: 'ect_fed',
    kind: 'federation_renewable_export_continuity_tie',
    label: 'Federation sovereign renewable export continuity tie',
    continuityScoreEq: 52,
    continuityReliefFactor: 0.17,
    securitySynergyFactor: 0.14,
    projectTypeHint: 'federation_renewable_export_continuity_tie',
  },
] as const;

export interface V1014SovereignExportSecurityFederationTemplate {
  id: string;
  kind:
    | 'sovereign_export_load_stack'
    | 'export_coupling_security_hub'
    | 'national_renewable_export_security_mesh'
    | 'sovereign_export_continuity_corridor';
  label: string;
  securityScoreEq: number;
  securityReliefFactor: number;
  continuitySynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_SOVEREIGN_EXPORT_SECURITY_FEDERATION_CATALOG: readonly V1014SovereignExportSecurityFederationTemplate[] = [
  {
    id: 'tr_stack',
    kind: 'sovereign_export_load_stack',
    label: 'Sovereign export load stack',
    securityScoreEq: 47,
    securityReliefFactor: 0.16,
    continuitySynergyFactor: 0.12,
    projectTypeHint: 'sovereign_export_load_stack',
  },
  {
    id: 'tr_couple',
    kind: 'export_coupling_security_hub',
    label: 'Export coupling security hub',
    securityScoreEq: 49,
    securityReliefFactor: 0.17,
    continuitySynergyFactor: 0.13,
    projectTypeHint: 'export_coupling_security_hub',
  },
  {
    id: 'tr_mesh',
    kind: 'national_renewable_export_security_mesh',
    label: 'National sovereign renewable export security mesh',
    securityScoreEq: 51,
    securityReliefFactor: 0.18,
    continuitySynergyFactor: 0.11,
    projectTypeHint: 'national_renewable_export_security_mesh',
  },
  {
    id: 'tr_sec',
    kind: 'sovereign_export_continuity_corridor',
    label: 'Sovereign export continuity corridor',
    securityScoreEq: 45,
    securityReliefFactor: 0.15,
    continuitySynergyFactor: 0.11,
    projectTypeHint: 'sovereign_export_continuity_corridor',
  },
] as const;

export interface V1014RegionalRenewableExportContinuityLedger {
  regionId: string;
  band: V1014RenewableExportContinuityBand;
  continuityIndex: number;
  continuityBalance: number;
  renewableExportContinuityRelief: number;
  summary: string;
}

export interface V1014RegionalSovereignExportSecurityFederationLedger {
  regionId: string;
  band: V1014SovereignExportSecurityFederationBand;
  securityIndex: number;
  sovereignExportSecurityFederationRelief: number;
  summary: string;
}

export interface V1014RenewableExportContinuityPersistedSlice {
  continuityBalance: number;
  continuityIndex: number;
}

export interface V1014SovereignExportSecurityFederationPersistedSlice {
  securityIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const EXPORT_CORRIDOR_HUB_REGIONS = new Set(['QLD', 'NSW', 'VIC', 'WA']);

export function computeRegionalRenewableExportContinuityLedger(params: {
  regionId: string;
  exportCorridorTransmissionRelief: number;
  transmissionResilienceFederationRelief: number;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  safeguardCertificateRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014RenewableExportContinuityPersistedSlice | null;
}): { ledger: V1014RegionalRenewableExportContinuityLedger; next: V1014RenewableExportContinuityPersistedSlice } {
  let exportGain = 0;
  let exportProxy = 0;
  let resilienceSynergy = 0;
  for (const inst of V1014_RENEWABLE_EXPORT_CONTINUITY_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      exportGain += inst.continuityScoreEq;
      exportProxy += inst.continuityReliefFactor;
      resilienceSynergy += inst.securitySynergyFactor;
    }
  }
  if (params.completedProjectTypes.includes('renewable_export_continuity_recovery_hub')) {
    exportGain += 14;
    exportProxy += 0.05;
  }
  if (EXPORT_CORRIDOR_HUB_REGIONS.has(params.regionId)) exportProxy += 0.07;
  else exportProxy *= 0.68;
  if (params.exportCorridorTransmissionRelief > 2.4) resilienceSynergy += clamp(params.exportCorridorTransmissionRelief * 0.009, 0, 0.05);
  if (params.transmissionResilienceFederationRelief > 2.3) exportGain += clamp(params.transmissionResilienceFederationRelief * 0.5, 0, 6.5);
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

  let band: V1014RenewableExportContinuityBand = 'isolated_continuity';
  if (continuityIndex >= 132 || exportGain >= 155) band = 'federated_renewable_export_continuity_leader';
  else if (continuityIndex >= 92 || exportGain >= 110) band = 'renewable_export_continuity_corridor';
  else if (continuityIndex >= 46 || exportGain >= 44) band = 'pilot_export_continuity';

  let renewableExportContinuityRelief = clamp(exportProxy * 8.1 + exportGain * 0.028 + resilienceSynergy * 5.2, 0, 10.8);
  if (band === 'isolated_continuity') renewableExportContinuityRelief *= 0.13;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      continuityIndex: clamp(continuityIndex, 0, 208),
      continuityBalance: clamp(continuityBalance, 0, 262),
      renewableExportContinuityRelief: clamp(renewableExportContinuityRelief, 0, 10.8),
      summary: `${params.regionId} sovereign renewable export continuity ${band} · idx ${continuityIndex.toFixed(0)} · relief ${renewableExportContinuityRelief.toFixed(1)}`,
    },
    next: {
      continuityBalance: clamp(continuityBalance, 0, 262),
      continuityIndex: clamp(continuityIndex, 0, 208),
    },
  };
}

export function advanceRegionalSovereignExportSecurityFederationOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  renewableExportContinuityBand: V1014RenewableExportContinuityBand;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  completedProjectTypes: string[];
  prev?: V1014SovereignExportSecurityFederationPersistedSlice | null;
}): { ledger: V1014RegionalSovereignExportSecurityFederationLedger; next: V1014SovereignExportSecurityFederationPersistedSlice } {
  let resilienceGain = 0;
  let resilienceProxy = 0;
  let exportSynergy = 0;
  for (const tpl of V1014_SOVEREIGN_EXPORT_SECURITY_FEDERATION_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      resilienceGain += tpl.securityScoreEq;
      resilienceProxy += tpl.securityReliefFactor;
      exportSynergy += tpl.continuitySynergyFactor;
    }
  }
  if (params.renewableExportContinuityBand === 'renewable_export_continuity_corridor' || params.renewableExportContinuityBand === 'federated_renewable_export_continuity_leader') {
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

  let band: V1014SovereignExportSecurityFederationBand = 'fragile_security_mesh';
  if (securityIndex >= 134 || resilienceGain >= 160) band = 'deep_sovereign_export_security_mesh';
  else if (securityIndex >= 94 || resilienceGain >= 114) band = 'sovereign_export_security_hub';
  else if (securityIndex >= 48 || resilienceGain >= 46) band = 'pilot_security_fed';

  let sovereignExportSecurityFederationRelief = clamp(securityIndex / 16.5 + resilienceProxy * 6.5 + exportSynergy * 7.1, 0, 10.7);
  if (band === 'fragile_security_mesh') sovereignExportSecurityFederationRelief = clamp(sovereignExportSecurityFederationRelief * 0.12, 0, 1.25);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      securityIndex: clamp(securityIndex, 0, 208),
      sovereignExportSecurityFederationRelief: clamp(sovereignExportSecurityFederationRelief, 0, 10.7),
      summary: `${params.regionId} sovereign export security ${band} · idx ${securityIndex.toFixed(0)} · relief ${sovereignExportSecurityFederationRelief.toFixed(1)}`,
    },
    next: { securityIndex: clamp(securityIndex, 0, 208) },
  };
}

export function runAgent13RenewableExportContinuitySovereignSecurityScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_RENEWABLE_EXPORT_CONTINUITY_CATALOG.length >= 4);
  ok(V1014_SOVEREIGN_EXPORT_SECURITY_FEDERATION_CATALOG.length >= 4);

  const exportStep = computeRegionalRenewableExportContinuityLedger({
    regionId: 'NSW',
    exportCorridorTransmissionRelief: 2.6,
    transmissionResilienceFederationRelief: 2.5,
    interregionalInterconnectionRelief: 2.7,
    decarbonFederationRelief: 2.5,
    safeguardCertificateRelief: 2.4,
    renewableShareScore: 56,
    completedProjectTypes: ['renewable_export_continuity_hub', 'federation_renewable_export_continuity_tie', 'renewable_export_continuity_recovery_hub'],
  });
  ok(exportStep.ledger.renewableExportContinuityRelief >= 1.5 || exportStep.ledger.band !== 'isolated_continuity');

  const fed = advanceRegionalSovereignExportSecurityFederationOrchestration({
    regionId: 'NSW',
    gridStressPoints: 15,
    renewableExportContinuityBand: exportStep.ledger.band,
    interregionalInterconnectionRelief: 2.6,
    decarbonFederationRelief: 2.5,
    completedProjectTypes: ['sovereign_export_load_stack', 'export_coupling_security_hub'],
  });
  ok(fed.ledger.sovereignExportSecurityFederationRelief >= 1.25 || fed.ledger.band !== 'fragile_security_mesh');

  const turnSc = runAgent13RenewableExportContinuitySovereignSecurityTurnScenario(V1014_RENEWABLE_EXPORT_CONTINUITY_SOVEREIGN_SECURITY_TURN_SCENARIOS[0]);
  ok(turnSc.passed);

  const gi = scoreAgent13RenewableExportContinuitySovereignSecurityGIAlignment({
    actionText:
      'Renewable export continuity hub with green hydrogen sovereign renewable export continuity, sovereign export security orchestration mesh, sovereign renewable export load stack, and export coupling security resilience hub',
    renewableExportContinuityBand: 'renewable_export_continuity_corridor',
    sovereignExportSecurityFederationBand: 'sovereign_export_security_hub',
  });
  ok(gi.relevanceDelta > 0.85 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13RenewableExportContinuitySovereignSecurityTurnStep {
  turn: number;
  regionId: string;
  exportCorridorTransmissionRelief: number;
  transmissionResilienceFederationRelief: number;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  safeguardCertificateRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  completedProjectTypes: string[];
}

export interface Agent13RenewableExportContinuitySovereignSecurityTurnScenario {
  id: string;
  label: string;
  steps: Agent13RenewableExportContinuitySovereignSecurityTurnStep[];
  expect: { minContinuityReliefOnLast?: number; minSovereignSecurityReliefOnLast?: number };
}

export const V1014_RENEWABLE_EXPORT_CONTINUITY_SOVEREIGN_SECURITY_TURN_SCENARIOS: readonly Agent13RenewableExportContinuitySovereignSecurityTurnScenario[] = [
  {
    id: 'sc_ect_nsw_escalation',
    label: 'NSW sovereign renewable export continuity with sovereign export security mesh',
    steps: [
      {
        turn: 1,
        regionId: 'NSW',
        exportCorridorTransmissionRelief: 2,
        transmissionResilienceFederationRelief: 1.9,
        interregionalInterconnectionRelief: 2.1,
        decarbonFederationRelief: 2,
        safeguardCertificateRelief: 1.9,
        renewableShareScore: 44,
        gridStressPoints: 18,
        completedProjectTypes: ['renewable_export_continuity_hub', 'sovereign_export_load_stack'],
      },
      {
        turn: 2,
        regionId: 'NSW',
        exportCorridorTransmissionRelief: 2.3,
        transmissionResilienceFederationRelief: 2.2,
        interregionalInterconnectionRelief: 2.4,
        decarbonFederationRelief: 2.3,
        safeguardCertificateRelief: 2.2,
        renewableShareScore: 50,
        gridStressPoints: 17,
        completedProjectTypes: ['sovereign_green_export_continuity_corridor', 'national_renewable_export_security_mesh'],
      },
      {
        turn: 3,
        regionId: 'NSW',
        exportCorridorTransmissionRelief: 2.7,
        transmissionResilienceFederationRelief: 2.6,
        interregionalInterconnectionRelief: 2.8,
        decarbonFederationRelief: 2.7,
        safeguardCertificateRelief: 2.6,
        renewableShareScore: 57,
        gridStressPoints: 15,
        completedProjectTypes: [
          'renewable_export_continuity_hub',
          'sovereign_green_export_continuity_corridor',
          'export_continuity_orchestration_mesh',
          'federation_renewable_export_continuity_tie',
          'renewable_export_continuity_recovery_hub',
          'sovereign_export_load_stack',
          'export_coupling_security_hub',
          'national_renewable_export_security_mesh',
          'sovereign_export_continuity_corridor',
        ],
      },
    ],
    expect: { minContinuityReliefOnLast: 1.45, minSovereignSecurityReliefOnLast: 1.15 },
  },
] as const;

export function runAgent13RenewableExportContinuitySovereignSecurityTurnScenario(
  scenario: Agent13RenewableExportContinuitySovereignSecurityTurnScenario,
): { passed: boolean; detail: string; lastContinuityRelief: number; lastSovereignSecurityRelief: number } {
  let exportMem: V1014RenewableExportContinuityPersistedSlice | null = null;
  let fedMem: V1014SovereignExportSecurityFederationPersistedSlice | null = null;
  let lastContinuityRelief = 0;
  let lastSovereignSecurityRelief = 0;

  for (const step of scenario.steps) {
    const exportStep = computeRegionalRenewableExportContinuityLedger({
      regionId: step.regionId,
      exportCorridorTransmissionRelief: step.exportCorridorTransmissionRelief,
      transmissionResilienceFederationRelief: step.transmissionResilienceFederationRelief,
      interregionalInterconnectionRelief: step.interregionalInterconnectionRelief,
      decarbonFederationRelief: step.decarbonFederationRelief,
      safeguardCertificateRelief: step.safeguardCertificateRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: exportMem,
    });
    exportMem = exportStep.next;
    lastContinuityRelief = exportStep.ledger.renewableExportContinuityRelief;

    const fed = advanceRegionalSovereignExportSecurityFederationOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      renewableExportContinuityBand: exportStep.ledger.band,
      interregionalInterconnectionRelief: step.interregionalInterconnectionRelief,
      decarbonFederationRelief: step.decarbonFederationRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: fedMem,
    });
    fedMem = fed.next;
    lastSovereignSecurityRelief = fed.ledger.sovereignExportSecurityFederationRelief;
  }

  if (scenario.expect.minContinuityReliefOnLast != null && lastContinuityRelief < scenario.expect.minContinuityReliefOnLast) {
    return { passed: false, detail: `export ${lastContinuityRelief}`, lastContinuityRelief, lastSovereignSecurityRelief };
  }
  if (scenario.expect.minSovereignSecurityReliefOnLast != null && lastSovereignSecurityRelief < scenario.expect.minSovereignSecurityReliefOnLast) {
    return { passed: false, detail: `fed ${lastSovereignSecurityRelief}`, lastContinuityRelief, lastSovereignSecurityRelief };
  }
  return { passed: true, detail: 'ok', lastContinuityRelief, lastSovereignSecurityRelief };
}

export function scoreAgent13RenewableExportContinuitySovereignSecurityGIAlignment(params: {
  actionText: string;
  renewableExportContinuityBand?: string;
  sovereignExportSecurityFederationBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'sovereign renewable export continuity',
    'sovereign green export',
    'sovereign export security',
    'sovereign renewable export continuity',
    'sovereign renewable export',
    'export coupling security',
    'national renewable export',
    'sovereign export continuity',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.12, 0, 2);
  if (params.renewableExportContinuityBand === 'federated_renewable_export_continuity_leader' || params.renewableExportContinuityBand === 'renewable_export_continuity_corridor') {
    delta += hits.some(h => h.includes('export')) ? 0.35 : 0.08;
  }
  if (params.sovereignExportSecurityFederationBand === 'sovereign_export_security_hub' || params.sovereignExportSecurityFederationBand === 'deep_sovereign_export_security_mesh') {
    delta += hits.some(h => h.includes('transmission') || h.includes('resilience')) ? 0.33 : 0.08;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Renewable export continuity GI: ${hits.slice(0, 2).join(', ')} aligns with sovereign sovereign renewable export continuity and resilience federation depth.`
        : null,
  };
}
