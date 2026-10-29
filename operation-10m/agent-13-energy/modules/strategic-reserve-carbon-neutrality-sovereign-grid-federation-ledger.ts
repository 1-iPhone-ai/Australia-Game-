/**
 * Agent 13 scale wave round 53 (O10-237) — strategic reserve carbon neutrality & sovereign green grid federation orchestration depth.
 */

export type V1014StrategicReserveCarbonNeutralityBand =
  | 'isolated_reserve'
  | 'pilot_strategic_reserve'
  | 'strategic_reserve_carbon_neutrality_corridor'
  | 'federated_strategic_reserve_carbon_neutrality_leader';

export type V1014SovereignGreenGridFederationBand =
  | 'fragile_industrial_mesh'
  | 'pilot_industrial_fed'
  | 'sovereign_green_grid_federation_hub'
  | 'deep_sovereign_green_grid_federation_mesh';

export interface V1014StrategicReserveCarbonNeutralityInstrument {
  id: string;
  kind:
    | 'strategic_reserve_carbon_neutrality_hub'
    | 'sovereign_green_strategic_reserve_corridor'
    | 'strategic_reserve_coordination_mesh'
    | 'federation_strategic_reserve_carbon_neutrality_tie';
  label: string;
  reserveScoreEq: number;
  reserveReliefFactor: number;
  orchestrationSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_STRATEGIC_RESERVE_CARBON_NEUTRALITY_CATALOG: readonly V1014StrategicReserveCarbonNeutralityInstrument[] = [
  {
    id: 'ser_hub',
    kind: 'strategic_reserve_carbon_neutrality_hub',
    label: 'Strategic reserve carbon neutrality hub',
    reserveScoreEq: 48,
    reserveReliefFactor: 0.17,
    orchestrationSynergyFactor: 0.12,
    projectTypeHint: 'strategic_reserve_carbon_neutrality_hub',
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
    kind: 'federation_strategic_reserve_carbon_neutrality_tie',
    label: 'Federation strategic reserve carbon neutrality tie',
    reserveScoreEq: 52,
    reserveReliefFactor: 0.17,
    orchestrationSynergyFactor: 0.14,
    projectTypeHint: 'federation_strategic_reserve_carbon_neutrality_tie',
  },
] as const;

export interface V1014SovereignGreenGridFederationTemplate {
  id: string;
  kind:
    | 'sovereign_green_grid_load_stack'
    | 'strategic_reserve_coupling_hub'
    | 'national_sovereign_strategic_reserve_mesh'
    | 'sovereign_green_grid_federation_corridor';
  label: string;
  industrialScoreEq: number;
  industrialReliefFactor: number;
  reserveSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_SOVEREIGN_GREEN_GRID_FEDERATION_CATALOG: readonly V1014SovereignGreenGridFederationTemplate[] = [
  {
    id: 'nsf_stack',
    kind: 'sovereign_green_grid_load_stack',
    label: 'Defence industrial load stack',
    industrialScoreEq: 47,
    industrialReliefFactor: 0.16,
    reserveSynergyFactor: 0.12,
    projectTypeHint: 'sovereign_green_grid_load_stack',
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
    kind: 'sovereign_green_grid_federation_corridor',
    label: 'Sovereign green grid federation corridor',
    industrialScoreEq: 45,
    industrialReliefFactor: 0.15,
    reserveSynergyFactor: 0.11,
    projectTypeHint: 'sovereign_green_grid_federation_corridor',
  },
] as const;

export interface V1014RegionalStrategicReserveCarbonNeutralityLedger {
  regionId: string;
  band: V1014StrategicReserveCarbonNeutralityBand;
  reserveIndex: number;
  reserveBalance: number;
  strategicReserveCarbonNeutralityRelief: number;
  summary: string;
}

export interface V1014RegionalSovereignGreenGridFederationLedger {
  regionId: string;
  band: V1014SovereignGreenGridFederationBand;
  industrialIndex: number;
  sovereignGreenGridFederationRelief: number;
  summary: string;
}

export interface V1014StrategicReserveCarbonNeutralityPersistedSlice {
  reserveBalance: number;
  reserveIndex: number;
}

export interface V1014SovereignGreenGridFederationPersistedSlice {
  industrialIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const STRATEGIC_RESERVE_HUB_REGIONS = new Set(['QLD', 'NSW', 'VIC', 'WA']);

export function computeRegionalStrategicReserveCarbonNeutralityLedger(params: {
  regionId: string;
  nationalSecurityStrategicReserveRelief: number;
  sovereignGreenGridFederationRelief: number;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  safeguardCertificateRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014StrategicReserveCarbonNeutralityPersistedSlice | null;
}): { ledger: V1014RegionalStrategicReserveCarbonNeutralityLedger; next: V1014StrategicReserveCarbonNeutralityPersistedSlice } {
  let reserveGain = 0;
  let reserveProxy = 0;
  let orchestrationSynergy = 0;
  for (const inst of V1014_STRATEGIC_RESERVE_CARBON_NEUTRALITY_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      reserveGain += inst.reserveScoreEq;
      reserveProxy += inst.reserveReliefFactor;
      orchestrationSynergy += inst.orchestrationSynergyFactor;
    }
  }
  if (params.completedProjectTypes.includes('strategic_reserve_carbon_neutrality_recovery_hub')) {
    reserveGain += 14;
    reserveProxy += 0.05;
  }
  if (STRATEGIC_RESERVE_HUB_REGIONS.has(params.regionId)) reserveProxy += 0.07;
  else reserveProxy *= 0.68;
  if (params.nationalSecurityStrategicReserveRelief > 2.4) orchestrationSynergy += clamp(params.nationalSecurityStrategicReserveRelief * 0.009, 0, 0.05);
  if (params.sovereignGreenGridFederationRelief > 2.3) reserveGain += clamp(params.sovereignGreenGridFederationRelief * 0.5, 0, 6.5);
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

  let band: V1014StrategicReserveCarbonNeutralityBand = 'isolated_reserve';
  if (reserveIndex >= 132 || reserveGain >= 155) band = 'federated_strategic_reserve_carbon_neutrality_leader';
  else if (reserveIndex >= 92 || reserveGain >= 110) band = 'strategic_reserve_carbon_neutrality_corridor';
  else if (reserveIndex >= 46 || reserveGain >= 44) band = 'pilot_strategic_reserve';

  let strategicReserveCarbonNeutralityRelief = clamp(reserveProxy * 8.1 + reserveGain * 0.028 + orchestrationSynergy * 5.2, 0, 10.8);
  if (band === 'isolated_reserve') strategicReserveCarbonNeutralityRelief *= 0.13;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      reserveIndex: clamp(reserveIndex, 0, 208),
      reserveBalance: clamp(reserveBalance, 0, 262),
      strategicReserveCarbonNeutralityRelief: clamp(strategicReserveCarbonNeutralityRelief, 0, 10.8),
      summary: `${params.regionId} strategic reserve carbon neutrality corridor ${band} · idx ${reserveIndex.toFixed(0)} · relief ${strategicReserveCarbonNeutralityRelief.toFixed(1)}`,
    },
    next: {
      reserveBalance: clamp(reserveBalance, 0, 262),
      reserveIndex: clamp(reserveIndex, 0, 208),
    },
  };
}

export function advanceRegionalSovereignGreenGridFederationOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  strategicReserveCarbonNeutralityBand: V1014StrategicReserveCarbonNeutralityBand;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  completedProjectTypes: string[];
  prev?: V1014SovereignGreenGridFederationPersistedSlice | null;
}): { ledger: V1014RegionalSovereignGreenGridFederationLedger; next: V1014SovereignGreenGridFederationPersistedSlice } {
  let reserveGain = 0;
  let reserveProxy = 0;
  let industrialSynergy = 0;
  for (const tpl of V1014_SOVEREIGN_GREEN_GRID_FEDERATION_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      reserveGain += tpl.industrialScoreEq;
      reserveProxy += tpl.industrialReliefFactor;
      industrialSynergy += tpl.reserveSynergyFactor;
    }
  }
  if (params.strategicReserveCarbonNeutralityBand === 'strategic_reserve_carbon_neutrality_corridor' || params.strategicReserveCarbonNeutralityBand === 'federated_strategic_reserve_carbon_neutrality_leader') {
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

  let band: V1014SovereignGreenGridFederationBand = 'fragile_industrial_mesh';
  if (industrialIndex >= 134 || reserveGain >= 160) band = 'deep_sovereign_green_grid_federation_mesh';
  else if (industrialIndex >= 94 || reserveGain >= 114) band = 'sovereign_green_grid_federation_hub';
  else if (industrialIndex >= 48 || reserveGain >= 46) band = 'pilot_industrial_fed';

  let sovereignGreenGridFederationRelief = clamp(industrialIndex / 16.5 + reserveProxy * 6.5 + industrialSynergy * 7.1, 0, 10.7);
  if (band === 'fragile_industrial_mesh') sovereignGreenGridFederationRelief = clamp(sovereignGreenGridFederationRelief * 0.12, 0, 1.25);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      industrialIndex: clamp(industrialIndex, 0, 208),
      sovereignGreenGridFederationRelief: clamp(sovereignGreenGridFederationRelief, 0, 10.7),
      summary: `${params.regionId} sovereign green grid federation ${band} · idx ${industrialIndex.toFixed(0)} · relief ${sovereignGreenGridFederationRelief.toFixed(1)}`,
    },
    next: { industrialIndex: clamp(industrialIndex, 0, 208) },
  };
}

export function runAgent13StrategicReserveCarbonNeutralitySovereignGridScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_STRATEGIC_RESERVE_CARBON_NEUTRALITY_CATALOG.length >= 4);
  ok(V1014_SOVEREIGN_GREEN_GRID_FEDERATION_CATALOG.length >= 4);

  const reserveStep = computeRegionalStrategicReserveCarbonNeutralityLedger({
    regionId: 'NSW',
    nationalSecurityStrategicReserveRelief: 2.6,
    sovereignGreenGridFederationRelief: 2.5,
    interregionalInterconnectionRelief: 2.7,
    decarbonFederationRelief: 2.5,
    safeguardCertificateRelief: 2.4,
    renewableShareScore: 56,
    completedProjectTypes: ['strategic_reserve_carbon_neutrality_hub', 'federation_strategic_reserve_carbon_neutrality_tie', 'strategic_reserve_carbon_neutrality_recovery_hub'],
  });
  ok(reserveStep.ledger.strategicReserveCarbonNeutralityRelief >= 1.5 || reserveStep.ledger.band !== 'isolated_reserve');

  const indFed = advanceRegionalSovereignGreenGridFederationOrchestration({
    regionId: 'NSW',
    gridStressPoints: 15,
    strategicReserveCarbonNeutralityBand: reserveStep.ledger.band,
    interregionalInterconnectionRelief: 2.6,
    decarbonFederationRelief: 2.5,
    completedProjectTypes: ['sovereign_green_grid_load_stack', 'strategic_reserve_coupling_hub'],
  });
  ok(indFed.ledger.sovereignGreenGridFederationRelief >= 1.25 || indFed.ledger.band !== 'fragile_industrial_mesh');

  const turnSc = runAgent13StrategicReserveCarbonNeutralitySovereignGridTurnScenario(V1014_STRATEGIC_RESERVE_CARBON_NEUTRALITY_SOVEREIGN_GRID_TURN_SCENARIOS[0]);
  ok(turnSc.passed);

  const gi = scoreAgent13StrategicReserveCarbonNeutralitySovereignGridGIAlignment({
    actionText:
      'Strategic reserve carbon neutrality hub with sovereign green strategic reserve corridor, strategic reserve coordination mesh, defence industrial load stack, strategic reserve coupling hub, national sovereign strategic reserve mesh, and defence industrial corridor',
    strategicReserveCarbonNeutralityBand: 'strategic_reserve_carbon_neutrality_corridor',
    sovereignGreenGridFederationBand: 'sovereign_green_grid_federation_hub',
  });
  ok(gi.relevanceDelta > 0.85 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13StrategicReserveCarbonNeutralitySovereignGridTurnStep {
  turn: number;
  regionId: string;
  nationalSecurityStrategicReserveRelief: number;
  sovereignGreenGridFederationRelief: number;
  interregionalInterconnectionRelief: number;
  decarbonFederationRelief: number;
  safeguardCertificateRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  completedProjectTypes: string[];
}

export interface Agent13StrategicReserveCarbonNeutralitySovereignGridTurnScenario {
  id: string;
  label: string;
  steps: Agent13StrategicReserveCarbonNeutralitySovereignGridTurnStep[];
  expect: { minStrategicReserveReliefOnLast?: number; minSovereignGridReliefOnLast?: number };
}

export const V1014_STRATEGIC_RESERVE_CARBON_NEUTRALITY_SOVEREIGN_GRID_TURN_SCENARIOS: readonly Agent13StrategicReserveCarbonNeutralitySovereignGridTurnScenario[] = [
  {
    id: 'sc_nssr_nsw_escalation',
    label: 'NSW strategic reserve carbon neutrality corridor with sovereign green grid federation mesh',
    steps: [
      {
        turn: 1,
        regionId: 'NSW',
        nationalSecurityStrategicReserveRelief: 2,
        sovereignGreenGridFederationRelief: 1.9,
        interregionalInterconnectionRelief: 2.1,
        decarbonFederationRelief: 2,
        safeguardCertificateRelief: 1.9,
        renewableShareScore: 44,
        gridStressPoints: 18,
        completedProjectTypes: ['strategic_reserve_carbon_neutrality_hub', 'sovereign_green_grid_load_stack'],
      },
      {
        turn: 2,
        regionId: 'NSW',
        nationalSecurityStrategicReserveRelief: 2.3,
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
        nationalSecurityStrategicReserveRelief: 2.7,
        sovereignGreenGridFederationRelief: 2.6,
        interregionalInterconnectionRelief: 2.8,
        decarbonFederationRelief: 2.7,
        safeguardCertificateRelief: 2.6,
        renewableShareScore: 57,
        gridStressPoints: 15,
        completedProjectTypes: [
          'strategic_reserve_carbon_neutrality_hub',
          'sovereign_green_strategic_reserve_corridor',
          'strategic_reserve_coordination_mesh',
          'federation_strategic_reserve_carbon_neutrality_tie',
          'strategic_reserve_carbon_neutrality_recovery_hub',
          'sovereign_green_grid_load_stack',
          'strategic_reserve_coupling_hub',
          'national_sovereign_strategic_reserve_mesh',
          'sovereign_green_grid_federation_corridor',
        ],
      },
    ],
    expect: { minStrategicReserveReliefOnLast: 1.45, minSovereignGridReliefOnLast: 1.15 },
  },
] as const;

export function runAgent13StrategicReserveCarbonNeutralitySovereignGridTurnScenario(
  scenario: Agent13StrategicReserveCarbonNeutralitySovereignGridTurnScenario,
): { passed: boolean; detail: string; lastStrategicReserveRelief: number; lastSovereignGridRelief: number } {
  let reserveMem: V1014StrategicReserveCarbonNeutralityPersistedSlice | null = null;
  let indMem: V1014SovereignGreenGridFederationPersistedSlice | null = null;
  let lastStrategicReserveRelief = 0;
  let lastSovereignGridRelief = 0;

  for (const step of scenario.steps) {
    const reserveStep = computeRegionalStrategicReserveCarbonNeutralityLedger({
      regionId: step.regionId,
      nationalSecurityStrategicReserveRelief: step.nationalSecurityStrategicReserveRelief,
      sovereignGreenGridFederationRelief: step.sovereignGreenGridFederationRelief,
      interregionalInterconnectionRelief: step.interregionalInterconnectionRelief,
      decarbonFederationRelief: step.decarbonFederationRelief,
      safeguardCertificateRelief: step.safeguardCertificateRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: reserveMem,
    });
    reserveMem = reserveStep.next;
    lastStrategicReserveRelief = reserveStep.ledger.strategicReserveCarbonNeutralityRelief;

    const indFed = advanceRegionalSovereignGreenGridFederationOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      strategicReserveCarbonNeutralityBand: reserveStep.ledger.band,
      interregionalInterconnectionRelief: step.interregionalInterconnectionRelief,
      decarbonFederationRelief: step.decarbonFederationRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: indMem,
    });
    indMem = indFed.next;
    lastSovereignGridRelief = indFed.ledger.sovereignGreenGridFederationRelief;
  }

  if (scenario.expect.minStrategicReserveReliefOnLast != null && lastStrategicReserveRelief < scenario.expect.minStrategicReserveReliefOnLast) {
    return { passed: false, detail: `export ${lastStrategicReserveRelief}`, lastStrategicReserveRelief, lastSovereignGridRelief };
  }
  if (scenario.expect.minSovereignGridReliefOnLast != null && lastSovereignGridRelief < scenario.expect.minSovereignGridReliefOnLast) {
    return { passed: false, detail: `fed ${lastSovereignGridRelief}`, lastStrategicReserveRelief, lastSovereignGridRelief };
  }
  return { passed: true, detail: 'ok', lastStrategicReserveRelief, lastSovereignGridRelief };
}

export function scoreAgent13StrategicReserveCarbonNeutralitySovereignGridGIAlignment(params: {
  actionText: string;
  strategicReserveCarbonNeutralityBand?: string;
  sovereignGreenGridFederationBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'strategic reserve carbon neutrality',
    'sovereign green strategic reserve',
    'sovereign green grid federation',
    'strategic reserve coordination',
    'defence industrial load',
    'strategic reserve coupling',
    'national sovereign strategic reserve',
    'defence industrial corridor',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.12, 0, 2);
  if (params.strategicReserveCarbonNeutralityBand === 'federated_strategic_reserve_carbon_neutrality_leader' || params.strategicReserveCarbonNeutralityBand === 'strategic_reserve_carbon_neutrality_corridor') {
    delta += hits.some(h => h.includes('export')) ? 0.35 : 0.08;
  }
  if (params.sovereignGreenGridFederationBand === 'sovereign_green_grid_federation_hub' || params.sovereignGreenGridFederationBand === 'deep_sovereign_green_grid_federation_mesh') {
    delta += hits.some(h => h.includes('transmission') || h.includes('reserve')) ? 0.33 : 0.08;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Strategic reserve carbon neutrality GI: ${hits.slice(0, 2).join(', ')} aligns with strategic reserve carbon neutrality corridor and sovereign green grid federation depth.`
        : null,
  };
}
