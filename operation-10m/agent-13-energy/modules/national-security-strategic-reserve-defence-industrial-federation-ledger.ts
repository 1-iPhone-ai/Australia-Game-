/**
 * Agent 13 scale wave round 52 (O10-235) — national security strategic reserve & defence industrial federation orchestration depth.
 */

export type V1014NationalSecurityStrategicReserveBand =
  | 'isolated_reserve'
  | 'pilot_strategic_reserve'
  | 'national_security_strategic_reserve_corridor'
  | 'federated_national_security_strategic_reserve_leader';

export type V1014DefenceIndustrialFederationBand =
  | 'fragile_industrial_mesh'
  | 'pilot_industrial_fed'
  | 'defence_industrial_federation_hub'
  | 'deep_defence_industrial_federation_mesh';

export interface V1014NationalSecurityStrategicReserveInstrument {
  id: string;
  kind:
    | 'national_security_strategic_reserve_hub'
    | 'sovereign_green_strategic_reserve_corridor'
    | 'strategic_reserve_coordination_mesh'
    | 'federation_national_security_strategic_reserve_tie';
  label: string;
  reserveScoreEq: number;
  reserveReliefFactor: number;
  orchestrationSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_NATIONAL_SECURITY_STRATEGIC_RESERVE_CATALOG: readonly V1014NationalSecurityStrategicReserveInstrument[] = [
  {
    id: 'ser_hub',
    kind: 'national_security_strategic_reserve_hub',
    label: 'National security strategic reserve hub',
    reserveScoreEq: 48,
    reserveReliefFactor: 0.17,
    orchestrationSynergyFactor: 0.12,
    projectTypeHint: 'national_security_strategic_reserve_hub',
  },
  {
    id: 'ser_h2',
    kind: 'sovereign_green_strategic_reserve_corridor',
    label: 'Sovereign green strategic reserve corridor',
    reserveScoreEq: 46,
    reserveReliefFactor: 0.16,
    orchestrationSynergyFactor: 0.13,
    projectTypeHint: 'sovereign_green_strategic_reserve_corridor',
  },
  {
    id: 'ser_mesh',
    kind: 'strategic_reserve_coordination_mesh',
    label: 'Strategic reserve coordination mesh',
    reserveScoreEq: 50,
    reserveReliefFactor: 0.18,
    orchestrationSynergyFactor: 0.11,
    projectTypeHint: 'strategic_reserve_coordination_mesh',
  },
  {
    id: 'ser_fed',
    kind: 'federation_national_security_strategic_reserve_tie',
    label: 'Federation national security strategic reserve tie',
    reserveScoreEq: 52,
    reserveReliefFactor: 0.17,
    orchestrationSynergyFactor: 0.14,
    projectTypeHint: 'federation_national_security_strategic_reserve_tie',
  },
] as const;

export interface V1014DefenceIndustrialFederationTemplate {
  id: string;
  kind:
    | 'defence_industrial_load_stack'
    | 'strategic_reserve_coupling_hub'
    | 'national_sovereign_strategic_reserve_mesh'
    | 'defence_industrial_federation_corridor';
  label: string;
  industrialScoreEq: number;
  industrialReliefFactor: number;
  reserveSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_DEFENCE_INDUSTRIAL_FEDERATION_CATALOG: readonly V1014DefenceIndustrialFederationTemplate[] = [
  {
    id: 'nsf_stack',
    kind: 'defence_industrial_load_stack',
    label: 'Defence industrial load stack',
    industrialScoreEq: 47,
    industrialReliefFactor: 0.16,
    reserveSynergyFactor: 0.12,
    projectTypeHint: 'defence_industrial_load_stack',
  },
  {
    id: 'nsf_couple',
    kind: 'strategic_reserve_coupling_hub',
    label: 'Strategic reserve coupling hub',
    industrialScoreEq: 49,
    industrialReliefFactor: 0.17,
    reserveSynergyFactor: 0.13,
    projectTypeHint: 'strategic_reserve_coupling_hub',
  },
  {
    id: 'nsf_mesh',
    kind: 'national_sovereign_strategic_reserve_mesh',
    label: 'National sovereign strategic reserve mesh',
    industrialScoreEq: 51,
    industrialReliefFactor: 0.18,
    reserveSynergyFactor: 0.11,
    projectTypeHint: 'national_sovereign_strategic_reserve_mesh',
  },
  {
    id: 'nsf_sec',
    kind: 'defence_industrial_federation_corridor',
    label: 'Defence industrial federation corridor',
    industrialScoreEq: 45,
    industrialReliefFactor: 0.15,
    reserveSynergyFactor: 0.11,
    projectTypeHint: 'defence_industrial_federation_corridor',
  },
] as const;

export interface V1014RegionalNationalSecurityStrategicReserveLedger {
  regionId: string;
  band: V1014NationalSecurityStrategicReserveBand;
  reserveIndex: number;
  reserveBalance: number;
  nationalSecurityStrategicReserveRelief: number;
  summary: string;
}

export interface V1014RegionalDefenceIndustrialFederationLedger {
  regionId: string;
  band: V1014DefenceIndustrialFederationBand;
  industrialIndex: number;
  defenceIndustrialFederationRelief: number;
  summary: string;
}

export interface V1014NationalSecurityStrategicReservePersistedSlice {
  reserveBalance: number;
  reserveIndex: number;
}

export interface V1014DefenceIndustrialFederationPersistedSlice {
  industrialIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const STRATEGIC_RESERVE_HUB_REGIONS = new Set(['QLD', 'NSW', 'VIC', 'WA']);

export function computeRegionalNationalSecurityStrategicReserveLedger(params: {
  regionId: string;
  nationalSecurityFederationRelief: number;
  sovereignExportResilienceRelief: number;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  safeguardCertificateRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014NationalSecurityStrategicReservePersistedSlice | null;
}): { ledger: V1014RegionalNationalSecurityStrategicReserveLedger; next: V1014NationalSecurityStrategicReservePersistedSlice } {
  let reserveGain = 0;
  let reserveProxy = 0;
  let orchestrationSynergy = 0;
  for (const inst of V1014_NATIONAL_SECURITY_STRATEGIC_RESERVE_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      reserveGain += inst.reserveScoreEq;
      reserveProxy += inst.reserveReliefFactor;
      orchestrationSynergy += inst.orchestrationSynergyFactor;
    }
  }
  if (params.completedProjectTypes.includes('national_security_strategic_reserve_recovery_hub')) {
    reserveGain += 14;
    reserveProxy += 0.05;
  }
  if (STRATEGIC_RESERVE_HUB_REGIONS.has(params.regionId)) reserveProxy += 0.07;
  else reserveProxy *= 0.68;
  if (params.nationalSecurityFederationRelief > 2.4) orchestrationSynergy += clamp(params.nationalSecurityFederationRelief * 0.009, 0, 0.05);
  if (params.sovereignExportResilienceRelief > 2.3) reserveGain += clamp(params.sovereignExportResilienceRelief * 0.5, 0, 6.5);
  if (params.interregionalInterconnectionRelief > 2.2) {
    reserveGain += clamp(params.interregionalInterconnectionRelief * 0.6, 0, 7.2);
    reserveProxy += clamp(params.interregionalInterconnectionRelief * 0.008, 0, 0.04);
  }
  if (params.decarbonFederationRelief > 2.2) orchestrationSynergy += clamp(params.decarbonFederationRelief * 0.01, 0, 0.05);
  if (params.safeguardCertificateRelief > 2.2) reserveProxy += clamp(params.safeguardCertificateRelief * 0.008, 0, 0.04);
  reserveProxy += clamp(params.renewableShareScore / 110, 0, 0.09);

  const prevIdx = params.prev?.reserveIndex ?? 0;
  const prevBal = params.prev?.reserveBalance ?? 0;
  const reserveBalance = clamp(prevBal * 0.78 + reserveGain * 0.11, 0, 262);
  const reserveIndex = clamp(prevIdx * 0.75 + reserveBalance * 0.1 + reserveProxy * 76 + orchestrationSynergy * 27, 0, 208);

  let band: V1014NationalSecurityStrategicReserveBand = 'isolated_reserve';
  if (reserveIndex >= 132 || reserveGain >= 155) band = 'federated_national_security_strategic_reserve_leader';
  else if (reserveIndex >= 92 || reserveGain >= 110) band = 'national_security_strategic_reserve_corridor';
  else if (reserveIndex >= 46 || reserveGain >= 44) band = 'pilot_strategic_reserve';

  let nationalSecurityStrategicReserveRelief = clamp(reserveProxy * 8.1 + reserveGain * 0.028 + orchestrationSynergy * 5.2, 0, 10.8);
  if (band === 'isolated_reserve') nationalSecurityStrategicReserveRelief *= 0.13;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      reserveIndex: clamp(reserveIndex, 0, 208),
      reserveBalance: clamp(reserveBalance, 0, 262),
      nationalSecurityStrategicReserveRelief: clamp(nationalSecurityStrategicReserveRelief, 0, 10.8),
      summary: `${params.regionId} national security strategic reserve corridor ${band} · idx ${reserveIndex.toFixed(0)} · relief ${nationalSecurityStrategicReserveRelief.toFixed(1)}`,
    },
    next: {
      reserveBalance: clamp(reserveBalance, 0, 262),
      reserveIndex: clamp(reserveIndex, 0, 208),
    },
  };
}

export function advanceRegionalDefenceIndustrialFederationOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  nationalSecurityStrategicReserveBand: V1014NationalSecurityStrategicReserveBand;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  completedProjectTypes: string[];
  prev?: V1014DefenceIndustrialFederationPersistedSlice | null;
}): { ledger: V1014RegionalDefenceIndustrialFederationLedger; next: V1014DefenceIndustrialFederationPersistedSlice } {
  let reserveGain = 0;
  let reserveProxy = 0;
  let industrialSynergy = 0;
  for (const tpl of V1014_DEFENCE_INDUSTRIAL_FEDERATION_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      reserveGain += tpl.industrialScoreEq;
      reserveProxy += tpl.industrialReliefFactor;
      industrialSynergy += tpl.reserveSynergyFactor;
    }
  }
  if (params.nationalSecurityStrategicReserveBand === 'national_security_strategic_reserve_corridor' || params.nationalSecurityStrategicReserveBand === 'federated_national_security_strategic_reserve_leader') {
    reserveGain += 20;
    industrialSynergy += 0.14;
  }
  if (params.interregionalInterconnectionRelief > 2.2) {
    reserveGain += params.interregionalInterconnectionRelief * 0.55;
    reserveProxy += clamp(params.interregionalInterconnectionRelief * 0.008, 0, 0.04);
  }
  if (params.decarbonFederationRelief > 2.2) industrialSynergy += clamp(params.decarbonFederationRelief * 0.009, 0, 0.04);

  const stressLoad = clamp(params.gridStressPoints * 0.16, 0, 6.6);
  const prevIdx = params.prev?.industrialIndex ?? 0;
  const industrialIndex = clamp(
    prevIdx * 0.74 + reserveGain * 0.11 + reserveProxy * 27 - stressLoad * 0.022 + industrialSynergy * 28,
    0,
    208,
  );

  let band: V1014DefenceIndustrialFederationBand = 'fragile_industrial_mesh';
  if (industrialIndex >= 134 || reserveGain >= 160) band = 'deep_defence_industrial_federation_mesh';
  else if (industrialIndex >= 94 || reserveGain >= 114) band = 'defence_industrial_federation_hub';
  else if (industrialIndex >= 48 || reserveGain >= 46) band = 'pilot_industrial_fed';

  let defenceIndustrialFederationRelief = clamp(industrialIndex / 16.5 + reserveProxy * 6.5 + industrialSynergy * 7.1, 0, 10.7);
  if (band === 'fragile_industrial_mesh') defenceIndustrialFederationRelief = clamp(defenceIndustrialFederationRelief * 0.12, 0, 1.25);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      industrialIndex: clamp(industrialIndex, 0, 208),
      defenceIndustrialFederationRelief: clamp(defenceIndustrialFederationRelief, 0, 10.7),
      summary: `${params.regionId} defence industrial federation ${band} · idx ${industrialIndex.toFixed(0)} · relief ${defenceIndustrialFederationRelief.toFixed(1)}`,
    },
    next: { industrialIndex: clamp(industrialIndex, 0, 208) },
  };
}

export function runAgent13NationalSecurityStrategicReserveDefenceIndustrialScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_NATIONAL_SECURITY_STRATEGIC_RESERVE_CATALOG.length >= 4);
  ok(V1014_DEFENCE_INDUSTRIAL_FEDERATION_CATALOG.length >= 4);

  const reserveStep = computeRegionalNationalSecurityStrategicReserveLedger({
    regionId: 'NSW',
    nationalSecurityFederationRelief: 2.6,
    sovereignExportResilienceRelief: 2.5,
    interregionalInterconnectionRelief: 2.7,
    decarbonFederationRelief: 2.5,
    safeguardCertificateRelief: 2.4,
    renewableShareScore: 56,
    completedProjectTypes: ['national_security_strategic_reserve_hub', 'federation_national_security_strategic_reserve_tie', 'national_security_strategic_reserve_recovery_hub'],
  });
  ok(reserveStep.ledger.nationalSecurityStrategicReserveRelief >= 1.5 || reserveStep.ledger.band !== 'isolated_reserve');

  const indFed = advanceRegionalDefenceIndustrialFederationOrchestration({
    regionId: 'NSW',
    gridStressPoints: 15,
    nationalSecurityStrategicReserveBand: reserveStep.ledger.band,
    interregionalInterconnectionRelief: 2.6,
    decarbonFederationRelief: 2.5,
    completedProjectTypes: ['defence_industrial_load_stack', 'strategic_reserve_coupling_hub'],
  });
  ok(indFed.ledger.defenceIndustrialFederationRelief >= 1.25 || indFed.ledger.band !== 'fragile_industrial_mesh');

  const turnSc = runAgent13NationalSecurityStrategicReserveDefenceIndustrialTurnScenario(V1014_NATIONAL_SECURITY_STRATEGIC_RESERVE_DEFENCE_INDUSTRIAL_TURN_SCENARIOS[0]);
  ok(turnSc.passed);

  const gi = scoreAgent13NationalSecurityStrategicReserveDefenceIndustrialGIAlignment({
    actionText:
      'National security strategic reserve hub with sovereign green strategic reserve corridor, strategic reserve coordination mesh, defence industrial load stack, strategic reserve coupling hub, national sovereign strategic reserve mesh, and defence industrial corridor',
    nationalSecurityStrategicReserveBand: 'national_security_strategic_reserve_corridor',
    defenceIndustrialFederationBand: 'defence_industrial_federation_hub',
  });
  ok(gi.relevanceDelta > 0.85 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13NationalSecurityStrategicReserveDefenceIndustrialTurnStep {
  turn: number;
  regionId: string;
  nationalSecurityFederationRelief: number;
  sovereignExportResilienceRelief: number;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  safeguardCertificateRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  completedProjectTypes: string[];
}

export interface Agent13NationalSecurityStrategicReserveDefenceIndustrialTurnScenario {
  id: string;
  label: string;
  steps: Agent13NationalSecurityStrategicReserveDefenceIndustrialTurnStep[];
  expect: { minStrategicReserveReliefOnLast?: number; minDefenceIndustrialReliefOnLast?: number };
}

export const V1014_NATIONAL_SECURITY_STRATEGIC_RESERVE_DEFENCE_INDUSTRIAL_TURN_SCENARIOS: readonly Agent13NationalSecurityStrategicReserveDefenceIndustrialTurnScenario[] = [
  {
    id: 'sc_nssr_nsw_escalation',
    label: 'NSW national security strategic reserve corridor with defence industrial federation mesh',
    steps: [
      {
        turn: 1,
        regionId: 'NSW',
        nationalSecurityFederationRelief: 2,
        sovereignExportResilienceRelief: 1.9,
        interregionalInterconnectionRelief: 2.1,
        decarbonFederationRelief: 2,
        safeguardCertificateRelief: 1.9,
        renewableShareScore: 44,
        gridStressPoints: 18,
        completedProjectTypes: ['national_security_strategic_reserve_hub', 'defence_industrial_load_stack'],
      },
      {
        turn: 2,
        regionId: 'NSW',
        nationalSecurityFederationRelief: 2.3,
        sovereignExportResilienceRelief: 2.2,
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
        nationalSecurityFederationRelief: 2.7,
        sovereignExportResilienceRelief: 2.6,
        interregionalInterconnectionRelief: 2.8,
        decarbonFederationRelief: 2.7,
        safeguardCertificateRelief: 2.6,
        renewableShareScore: 57,
        gridStressPoints: 15,
        completedProjectTypes: [
          'national_security_strategic_reserve_hub',
          'sovereign_green_strategic_reserve_corridor',
          'strategic_reserve_coordination_mesh',
          'federation_national_security_strategic_reserve_tie',
          'national_security_strategic_reserve_recovery_hub',
          'defence_industrial_load_stack',
          'strategic_reserve_coupling_hub',
          'national_sovereign_strategic_reserve_mesh',
          'defence_industrial_federation_corridor',
        ],
      },
    ],
    expect: { minStrategicReserveReliefOnLast: 1.45, minDefenceIndustrialReliefOnLast: 1.15 },
  },
] as const;

export function runAgent13NationalSecurityStrategicReserveDefenceIndustrialTurnScenario(
  scenario: Agent13NationalSecurityStrategicReserveDefenceIndustrialTurnScenario,
): { passed: boolean; detail: string; lastStrategicReserveRelief: number; lastDefenceIndustrialRelief: number } {
  let reserveMem: V1014NationalSecurityStrategicReservePersistedSlice | null = null;
  let indMem: V1014DefenceIndustrialFederationPersistedSlice | null = null;
  let lastStrategicReserveRelief = 0;
  let lastDefenceIndustrialRelief = 0;

  for (const step of scenario.steps) {
    const reserveStep = computeRegionalNationalSecurityStrategicReserveLedger({
      regionId: step.regionId,
      nationalSecurityFederationRelief: step.nationalSecurityFederationRelief,
      sovereignExportResilienceRelief: step.sovereignExportResilienceRelief,
      interregionalInterconnectionRelief: step.interregionalInterconnectionRelief,
      decarbonFederationRelief: step.decarbonFederationRelief,
      safeguardCertificateRelief: step.safeguardCertificateRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: reserveMem,
    });
    reserveMem = reserveStep.next;
    lastStrategicReserveRelief = reserveStep.ledger.nationalSecurityStrategicReserveRelief;

    const indFed = advanceRegionalDefenceIndustrialFederationOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      nationalSecurityStrategicReserveBand: reserveStep.ledger.band,
      interregionalInterconnectionRelief: step.interregionalInterconnectionRelief,
      decarbonFederationRelief: step.decarbonFederationRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: indMem,
    });
    indMem = indFed.next;
    lastDefenceIndustrialRelief = indFed.ledger.defenceIndustrialFederationRelief;
  }

  if (scenario.expect.minStrategicReserveReliefOnLast != null && lastStrategicReserveRelief < scenario.expect.minStrategicReserveReliefOnLast) {
    return { passed: false, detail: `export ${lastStrategicReserveRelief}`, lastStrategicReserveRelief, lastDefenceIndustrialRelief };
  }
  if (scenario.expect.minDefenceIndustrialReliefOnLast != null && lastDefenceIndustrialRelief < scenario.expect.minDefenceIndustrialReliefOnLast) {
    return { passed: false, detail: `fed ${lastDefenceIndustrialRelief}`, lastStrategicReserveRelief, lastDefenceIndustrialRelief };
  }
  return { passed: true, detail: 'ok', lastStrategicReserveRelief, lastDefenceIndustrialRelief };
}

export function scoreAgent13NationalSecurityStrategicReserveDefenceIndustrialGIAlignment(params: {
  actionText: string;
  nationalSecurityStrategicReserveBand?: string;
  defenceIndustrialFederationBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'national security strategic reserve',
    'sovereign green strategic reserve',
    'defence industrial federation',
    'strategic reserve coordination',
    'defence industrial load',
    'strategic reserve coupling',
    'national sovereign strategic reserve',
    'defence industrial corridor',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.12, 0, 2);
  if (params.nationalSecurityStrategicReserveBand === 'federated_national_security_strategic_reserve_leader' || params.nationalSecurityStrategicReserveBand === 'national_security_strategic_reserve_corridor') {
    delta += hits.some(h => h.includes('export')) ? 0.35 : 0.08;
  }
  if (params.defenceIndustrialFederationBand === 'defence_industrial_federation_hub' || params.defenceIndustrialFederationBand === 'deep_defence_industrial_federation_mesh') {
    delta += hits.some(h => h.includes('transmission') || h.includes('reserve')) ? 0.33 : 0.08;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `National security strategic reserve GI: ${hits.slice(0, 2).join(', ')} aligns with national security strategic reserve corridor and defence industrial federation depth.`
        : null,
  };
}
