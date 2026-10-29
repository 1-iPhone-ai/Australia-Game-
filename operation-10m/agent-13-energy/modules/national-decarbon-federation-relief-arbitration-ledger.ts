/**
 * Agent 13 scale wave round 31 (O10-193) — national decarbon federation & inter-regional relief arbitration orchestration depth.
 * Cross-turn persistence for federation corridors and relief arbitration mesh coupled to export, minerals circular,
 * offshore-shore, transmission, and nature-positive siting maturity across the scale-wave stack.
 */

export type V1014DecarbonFederationBand =
  | 'siloed_regions'
  | 'pilot_federation'
  | 'federation_corridor'
  | 'national_decarbon_federation_leader';

export type V1014ReliefArbitrationBand =
  | 'unstacked_relief'
  | 'pilot_arbitration'
  | 'arbitration_hub'
  | 'deep_relief_arbitration_mesh';

export interface V1014DecarbonFederationInstrument {
  id: string;
  kind: 'federation_orchestration_hub' | 'export_environment_federation' | 'spillover_coordination_corridor' | 'cross_border_decarbon_tie';
  label: string;
  federationMwEq: number;
  federationReliefFactor: number;
  arbitrationSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_DECARBON_FEDERATION_CATALOG: readonly V1014DecarbonFederationInstrument[] = [
  {
    id: 'df_hub',
    kind: 'federation_orchestration_hub',
    label: 'Decarbon federation orchestration hub',
    federationMwEq: 47,
    federationReliefFactor: 0.17,
    arbitrationSynergyFactor: 0.11,
    projectTypeHint: 'decarbon_federation_orchestration_hub',
  },
  {
    id: 'df_export',
    kind: 'export_environment_federation',
    label: 'Export-environment federation loop',
    federationMwEq: 45,
    federationReliefFactor: 0.16,
    arbitrationSynergyFactor: 0.12,
    projectTypeHint: 'export_environment_federation_loop',
  },
  {
    id: 'df_spill',
    kind: 'spillover_coordination_corridor',
    label: 'Spillover coordination corridor',
    federationMwEq: 43,
    federationReliefFactor: 0.15,
    arbitrationSynergyFactor: 0.13,
    projectTypeHint: 'spillover_coordination_corridor',
  },
  {
    id: 'df_cross',
    kind: 'cross_border_decarbon_tie',
    label: 'Cross-border decarbon federation tie',
    federationMwEq: 49,
    federationReliefFactor: 0.18,
    arbitrationSynergyFactor: 0.1,
    projectTypeHint: 'cross_border_decarbon_federation_tie',
  },
] as const;

export interface V1014ReliefArbitrationTemplate {
  id: string;
  kind: 'multi_domain_arbitration_mesh' | 'relief_stacking_hub' | 'inter_regional_arbitration_layer' | 'federation_recovery_mesh';
  label: string;
  arbitrationScoreEq: number;
  pressureReliefFactor: number;
  federationSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_RELIEF_ARBITRATION_CATALOG: readonly V1014ReliefArbitrationTemplate[] = [
  {
    id: 'ra_mesh',
    kind: 'multi_domain_arbitration_mesh',
    label: 'Multi-domain pressure arbitration mesh',
    arbitrationScoreEq: 46,
    pressureReliefFactor: 0.16,
    federationSynergyFactor: 0.1,
    projectTypeHint: 'multi_domain_pressure_arbitration_mesh',
  },
  {
    id: 'ra_stack',
    kind: 'relief_stacking_hub',
    label: 'Relief stacking arbitration hub',
    arbitrationScoreEq: 44,
    pressureReliefFactor: 0.15,
    federationSynergyFactor: 0.11,
    projectTypeHint: 'relief_stacking_arbitration_hub',
  },
  {
    id: 'ra_inter',
    kind: 'inter_regional_arbitration_layer',
    label: 'Inter-regional relief arbitration layer',
    arbitrationScoreEq: 48,
    pressureReliefFactor: 0.17,
    federationSynergyFactor: 0.12,
    projectTypeHint: 'inter_regional_relief_arbitration_layer',
  },
  {
    id: 'ra_recovery',
    kind: 'federation_recovery_mesh',
    label: 'Federation recovery arbitration mesh',
    arbitrationScoreEq: 50,
    pressureReliefFactor: 0.16,
    federationSynergyFactor: 0.13,
    projectTypeHint: 'federation_recovery_arbitration_mesh',
  },
] as const;

export interface V1014RegionalDecarbonFederationLedger {
  regionId: string;
  band: V1014DecarbonFederationBand;
  federationIndex: number;
  federationBalance: number;
  decarbonFederationRelief: number;
  summary: string;
}

export interface V1014RegionalReliefArbitrationLedger {
  regionId: string;
  band: V1014ReliefArbitrationBand;
  arbitrationIndex: number;
  reliefArbitrationRelief: number;
  summary: string;
}

export interface V1014DecarbonFederationPersistedSlice {
  federationBalance: number;
  federationIndex: number;
}

export interface V1014ReliefArbitrationPersistedSlice {
  arbitrationIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const FEDERATION_HUB_REGIONS = new Set(['NSW', 'QLD', 'VIC', 'WA', 'SA']);

export function computeRegionalDecarbonFederationLedger(params: {
  regionId: string;
  portGreenCorridorRelief: number;
  offshoreShoreElectrificationRelief: number;
  mineralsCircularRecoveryRelief: number;
  greenHydrogenExportRelief: number;
  transmissionCongestionRelief: number;
  naturePositiveSitingRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014DecarbonFederationPersistedSlice | null;
}): { ledger: V1014RegionalDecarbonFederationLedger; next: V1014DecarbonFederationPersistedSlice } {
  let federationGain = 0;
  let federationProxy = 0;
  let arbitrationSynergy = 0;
  for (const inst of V1014_DECARBON_FEDERATION_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      federationGain += inst.federationMwEq;
      federationProxy += inst.federationReliefFactor;
      arbitrationSynergy += inst.arbitrationSynergyFactor;
    }
  }
  if (FEDERATION_HUB_REGIONS.has(params.regionId)) federationProxy += 0.06;
  else federationProxy *= 0.73;
  if (params.portGreenCorridorRelief > 2.7) {
    federationGain += clamp(params.portGreenCorridorRelief * 0.85, 0, 10);
    federationProxy += 0.06;
  }
  if (params.offshoreShoreElectrificationRelief > 2.6) arbitrationSynergy += clamp(params.offshoreShoreElectrificationRelief * 0.012, 0, 0.07);
  if (params.mineralsCircularRecoveryRelief > 2.5) federationProxy += clamp(params.mineralsCircularRecoveryRelief * 0.009, 0, 0.05);
  if (params.greenHydrogenExportRelief > 2.8) federationGain += clamp(params.greenHydrogenExportRelief * 0.8, 0, 9);
  if (params.transmissionCongestionRelief > 2.6) arbitrationSynergy += clamp(params.transmissionCongestionRelief * 0.011, 0, 0.06);
  if (params.naturePositiveSitingRelief > 2.4) federationProxy += clamp(params.naturePositiveSitingRelief * 0.008, 0, 0.04);
  federationProxy += clamp(params.renewableShareScore / 108, 0, 0.09);

  const prevIdx = params.prev?.federationIndex ?? 0;
  const prevBal = params.prev?.federationBalance ?? 0;
  const federationBalance = clamp(prevBal * 0.85 + federationGain * 0.1, 0, 232);
  const federationIndex = clamp(
    prevIdx * 0.82 + federationBalance * 0.09 + federationProxy * 81 + arbitrationSynergy * 27,
    0,
    176,
  );

  let band: V1014DecarbonFederationBand = 'siloed_regions';
  if (federationIndex >= 112 || federationGain >= 128) band = 'national_decarbon_federation_leader';
  else if (federationIndex >= 72 || federationGain >= 76) band = 'federation_corridor';
  else if (federationIndex >= 30 || federationGain >= 28) band = 'pilot_federation';

  let decarbonFederationRelief = clamp(federationProxy * 8.3 + federationGain * 0.033 + arbitrationSynergy * 5.1, 0, 10.5);
  if (band === 'siloed_regions') decarbonFederationRelief *= 0.26;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      federationIndex: clamp(federationIndex, 0, 176),
      federationBalance: clamp(federationBalance, 0, 232),
      decarbonFederationRelief: clamp(decarbonFederationRelief, 0, 10.5),
      summary: `${params.regionId} federation ${band} · idx ${federationIndex.toFixed(0)} · relief ${decarbonFederationRelief.toFixed(1)}`,
    },
    next: {
      federationBalance: clamp(federationBalance, 0, 232),
      federationIndex: clamp(federationIndex, 0, 176),
    },
  };
}

export function advanceRegionalReliefArbitrationOrchestration(params: {
  regionId: string;
  environmentalPressure: number;
  federationBand: V1014DecarbonFederationBand;
  biodiversityCoexistenceRelief: number;
  completedProjectTypes: string[];
  prev?: V1014ReliefArbitrationPersistedSlice | null;
}): { ledger: V1014RegionalReliefArbitrationLedger; next: V1014ReliefArbitrationPersistedSlice } {
  let arbitrationGain = 0;
  let pressureReliefProxy = 0;
  let federationSynergy = 0;
  for (const tpl of V1014_RELIEF_ARBITRATION_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      arbitrationGain += tpl.arbitrationScoreEq;
      pressureReliefProxy += tpl.pressureReliefFactor;
      federationSynergy += tpl.federationSynergyFactor;
    }
  }
  if (params.federationBand === 'federation_corridor' || params.federationBand === 'national_decarbon_federation_leader') {
    arbitrationGain += 17;
    federationSynergy += 0.1;
  }
  if (params.biodiversityCoexistenceRelief > 2.5) {
    arbitrationGain += params.biodiversityCoexistenceRelief * 0.68;
    pressureReliefProxy += clamp(params.biodiversityCoexistenceRelief * 0.007, 0, 0.04);
  }

  const pressureLoad = clamp(params.environmentalPressure * 0.2, 0, 10);
  const prevIdx = params.prev?.arbitrationIndex ?? 0;
  const arbitrationIndex = clamp(
    prevIdx * 0.83 + arbitrationGain * 0.1 + pressureReliefProxy * 30 - pressureLoad * 0.027 + federationSynergy * 27,
    0,
    178,
  );

  let band: V1014ReliefArbitrationBand = 'unstacked_relief';
  if (arbitrationIndex >= 114 || arbitrationGain >= 130) band = 'deep_relief_arbitration_mesh';
  else if (arbitrationIndex >= 74 || arbitrationGain >= 84) band = 'arbitration_hub';
  else if (arbitrationIndex >= 31 || arbitrationGain >= 29) band = 'pilot_arbitration';

  let reliefArbitrationRelief = clamp(arbitrationIndex / 17 + pressureReliefProxy * 6.6 + federationSynergy * 6.9, 0, 10.1);
  if (band === 'unstacked_relief') reliefArbitrationRelief = clamp(reliefArbitrationRelief * 0.25, 0, 2.5);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      arbitrationIndex: clamp(arbitrationIndex, 0, 178),
      reliefArbitrationRelief: clamp(reliefArbitrationRelief, 0, 10.1),
      summary: `${params.regionId} arbitration ${band} · idx ${arbitrationIndex.toFixed(0)} · relief ${reliefArbitrationRelief.toFixed(1)}`,
    },
    next: { arbitrationIndex: clamp(arbitrationIndex, 0, 178) },
  };
}

export const V1014_FEDERATION_ARBITRATION_SCENARIOS = [
  {
    id: 'sc_fa_nsw',
    label: 'NSW federation hub with inter-regional arbitration',
    regionId: 'NSW',
    portGreenCorridorRelief: 2.9,
    offshoreShoreElectrificationRelief: 2.7,
    mineralsCircularRecoveryRelief: 2.8,
    greenHydrogenExportRelief: 2.6,
    transmissionCongestionRelief: 2.7,
    naturePositiveSitingRelief: 2.5,
    renewableShareScore: 52,
    environmentalPressure: 38,
    biodiversityCoexistenceRelief: 2.6,
    completedProjectTypes: [
      'decarbon_federation_orchestration_hub',
      'spillover_coordination_corridor',
      'inter_regional_relief_arbitration_layer',
      'federation_recovery_arbitration_mesh',
    ],
    expectFederationBand: 'federation_corridor' as V1014DecarbonFederationBand,
    expectMinFederationRelief: 2,
    expectArbitrationBand: 'arbitration_hub' as V1014ReliefArbitrationBand,
    expectMinArbitrationRelief: 1.8,
  },
  {
    id: 'sc_fa_vic',
    label: 'VIC relief stacking with export federation',
    regionId: 'VIC',
    portGreenCorridorRelief: 2.5,
    offshoreShoreElectrificationRelief: 2.4,
    mineralsCircularRecoveryRelief: 2.5,
    greenHydrogenExportRelief: 2.4,
    transmissionCongestionRelief: 2.5,
    naturePositiveSitingRelief: 2.3,
    renewableShareScore: 48,
    environmentalPressure: 40,
    biodiversityCoexistenceRelief: 2.4,
    federationBand: 'pilot_federation' as V1014DecarbonFederationBand,
    completedProjectTypes: ['export_environment_federation_loop', 'relief_stacking_arbitration_hub'],
    expectArbitrationBand: 'pilot_arbitration' as V1014ReliefArbitrationBand,
    expectMinArbitrationRelief: 1.4,
  },
] as const;

export function runAgent13FederationArbitrationScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_DECARBON_FEDERATION_CATALOG.length >= 4);
  ok(V1014_RELIEF_ARBITRATION_CATALOG.length >= 4);

  const sc0 = V1014_FEDERATION_ARBITRATION_SCENARIOS[0];
  const federation = computeRegionalDecarbonFederationLedger({
    regionId: sc0.regionId,
    portGreenCorridorRelief: sc0.portGreenCorridorRelief,
    offshoreShoreElectrificationRelief: sc0.offshoreShoreElectrificationRelief,
    mineralsCircularRecoveryRelief: sc0.mineralsCircularRecoveryRelief,
    greenHydrogenExportRelief: sc0.greenHydrogenExportRelief,
    transmissionCongestionRelief: sc0.transmissionCongestionRelief,
    naturePositiveSitingRelief: sc0.naturePositiveSitingRelief,
    renewableShareScore: sc0.renewableShareScore,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    federation.ledger.band === sc0.expectFederationBand ||
      federation.ledger.band === 'national_decarbon_federation_leader' ||
      federation.ledger.decarbonFederationRelief >= sc0.expectMinFederationRelief,
  );

  const arbitration = advanceRegionalReliefArbitrationOrchestration({
    regionId: sc0.regionId,
    environmentalPressure: sc0.environmentalPressure,
    federationBand: federation.ledger.band,
    biodiversityCoexistenceRelief: sc0.biodiversityCoexistenceRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    arbitration.ledger.band === sc0.expectArbitrationBand ||
      arbitration.ledger.band === 'deep_relief_arbitration_mesh' ||
      arbitration.ledger.reliefArbitrationRelief >= sc0.expectMinArbitrationRelief,
  );

  const sc1 = V1014_FEDERATION_ARBITRATION_SCENARIOS[1];
  const arbitrationV = advanceRegionalReliefArbitrationOrchestration({
    regionId: sc1.regionId,
    environmentalPressure: sc1.environmentalPressure,
    federationBand: sc1.federationBand,
    biodiversityCoexistenceRelief: sc1.biodiversityCoexistenceRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(
    arbitrationV.ledger.reliefArbitrationRelief >= sc1.expectMinArbitrationRelief ||
      arbitrationV.ledger.band !== 'unstacked_relief',
  );

  const persistA = computeRegionalDecarbonFederationLedger({
    regionId: 'QLD',
    portGreenCorridorRelief: 2.4,
    offshoreShoreElectrificationRelief: 2.3,
    mineralsCircularRecoveryRelief: 2.4,
    greenHydrogenExportRelief: 2.5,
    transmissionCongestionRelief: 2.4,
    naturePositiveSitingRelief: 2.2,
    renewableShareScore: 46,
    completedProjectTypes: ['cross_border_decarbon_federation_tie'],
    prev: null,
  });
  const persistB = computeRegionalDecarbonFederationLedger({
    regionId: 'QLD',
    portGreenCorridorRelief: 2.4,
    offshoreShoreElectrificationRelief: 2.3,
    mineralsCircularRecoveryRelief: 2.4,
    greenHydrogenExportRelief: 2.5,
    transmissionCongestionRelief: 2.4,
    naturePositiveSitingRelief: 2.2,
    renewableShareScore: 46,
    completedProjectTypes: ['cross_border_decarbon_federation_tie'],
    prev: persistA.next,
  });
  ok(persistB.next.federationIndex >= persistA.next.federationIndex * 0.7);

  const turnSc = runAgent13FederationArbitrationTurnScenario(V1014_FEDERATION_ARBITRATION_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastFederationRelief >= 2);

  const gi = scoreAgent13FederationArbitrationGIAlignment({
    actionText: 'Decarbon federation orchestration with inter-regional relief arbitration and spillover coordination',
    federationBand: 'federation_corridor',
    arbitrationBand: 'arbitration_hub',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13FederationArbitrationTurnStep {
  turn: number;
  regionId: string;
  portGreenCorridorRelief: number;
  offshoreShoreElectrificationRelief: number;
  mineralsCircularRecoveryRelief: number;
  greenHydrogenExportRelief: number;
  transmissionCongestionRelief: number;
  naturePositiveSitingRelief: number;
  renewableShareScore: number;
  environmentalPressure: number;
  biodiversityCoexistenceRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13FederationArbitrationTurnScenario {
  id: string;
  label: string;
  steps: Agent13FederationArbitrationTurnStep[];
  expect: {
    minFederationReliefOnLast?: number;
    minArbitrationReliefOnLast?: number;
    lastFederationBand?: V1014DecarbonFederationBand;
  };
}

export const V1014_FEDERATION_ARBITRATION_TURN_SCENARIOS: readonly Agent13FederationArbitrationTurnScenario[] = [
  {
    id: 'sc_fa_nsw_escalation',
    label: 'NSW national federation with deep arbitration mesh',
    steps: [
      {
        turn: 1,
        regionId: 'NSW',
        portGreenCorridorRelief: 2.3,
        offshoreShoreElectrificationRelief: 2.2,
        mineralsCircularRecoveryRelief: 2.3,
        greenHydrogenExportRelief: 2.2,
        transmissionCongestionRelief: 2.2,
        naturePositiveSitingRelief: 2.1,
        renewableShareScore: 44,
        environmentalPressure: 44,
        biodiversityCoexistenceRelief: 2.2,
        completedProjectTypes: ['decarbon_federation_orchestration_hub', 'multi_domain_pressure_arbitration_mesh'],
      },
      {
        turn: 2,
        regionId: 'NSW',
        portGreenCorridorRelief: 2.6,
        offshoreShoreElectrificationRelief: 2.5,
        mineralsCircularRecoveryRelief: 2.6,
        greenHydrogenExportRelief: 2.5,
        transmissionCongestionRelief: 2.5,
        naturePositiveSitingRelief: 2.4,
        renewableShareScore: 48,
        environmentalPressure: 41,
        biodiversityCoexistenceRelief: 2.5,
        completedProjectTypes: ['export_environment_federation_loop', 'relief_stacking_arbitration_hub'],
      },
      {
        turn: 3,
        regionId: 'NSW',
        portGreenCorridorRelief: 3,
        offshoreShoreElectrificationRelief: 2.8,
        mineralsCircularRecoveryRelief: 2.9,
        greenHydrogenExportRelief: 2.7,
        transmissionCongestionRelief: 2.8,
        naturePositiveSitingRelief: 2.6,
        renewableShareScore: 54,
        environmentalPressure: 36,
        biodiversityCoexistenceRelief: 2.8,
        completedProjectTypes: [
          'decarbon_federation_orchestration_hub',
          'export_environment_federation_loop',
          'spillover_coordination_corridor',
          'cross_border_decarbon_federation_tie',
          'multi_domain_pressure_arbitration_mesh',
          'relief_stacking_arbitration_hub',
          'inter_regional_relief_arbitration_layer',
          'federation_recovery_arbitration_mesh',
        ],
      },
    ],
    expect: { minFederationReliefOnLast: 2, minArbitrationReliefOnLast: 1.8, lastFederationBand: 'federation_corridor' },
  },
] as const;

export function runAgent13FederationArbitrationTurnScenario(
  scenario: Agent13FederationArbitrationTurnScenario,
): { passed: boolean; detail: string; lastFederationRelief: number; lastArbitrationRelief: number } {
  let federationMem: V1014DecarbonFederationPersistedSlice | null = null;
  let arbitrationMem: V1014ReliefArbitrationPersistedSlice | null = null;
  let lastFederationRelief = 0;
  let lastArbitrationRelief = 0;
  let lastBand: V1014DecarbonFederationBand = 'siloed_regions';

  for (const step of scenario.steps) {
    const federation = computeRegionalDecarbonFederationLedger({
      regionId: step.regionId,
      portGreenCorridorRelief: step.portGreenCorridorRelief,
      offshoreShoreElectrificationRelief: step.offshoreShoreElectrificationRelief,
      mineralsCircularRecoveryRelief: step.mineralsCircularRecoveryRelief,
      greenHydrogenExportRelief: step.greenHydrogenExportRelief,
      transmissionCongestionRelief: step.transmissionCongestionRelief,
      naturePositiveSitingRelief: step.naturePositiveSitingRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: federationMem,
    });
    federationMem = federation.next;
    lastFederationRelief = federation.ledger.decarbonFederationRelief;
    lastBand = federation.ledger.band;

    const arbitration = advanceRegionalReliefArbitrationOrchestration({
      regionId: step.regionId,
      environmentalPressure: step.environmentalPressure,
      federationBand: federation.ledger.band,
      biodiversityCoexistenceRelief: step.biodiversityCoexistenceRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: arbitrationMem,
    });
    arbitrationMem = arbitration.next;
    lastArbitrationRelief = arbitration.ledger.reliefArbitrationRelief;
  }

  if (scenario.expect.minFederationReliefOnLast != null && lastFederationRelief < scenario.expect.minFederationReliefOnLast) {
    return {
      passed: false,
      detail: `federation relief ${lastFederationRelief} < ${scenario.expect.minFederationReliefOnLast}`,
      lastFederationRelief,
      lastArbitrationRelief,
    };
  }
  if (scenario.expect.minArbitrationReliefOnLast != null && lastArbitrationRelief < scenario.expect.minArbitrationReliefOnLast) {
    return {
      passed: false,
      detail: `arbitration relief ${lastArbitrationRelief} < ${scenario.expect.minArbitrationReliefOnLast}`,
      lastFederationRelief,
      lastArbitrationRelief,
    };
  }
  if (scenario.expect.lastFederationBand != null) {
    const allowed: V1014DecarbonFederationBand[] = [scenario.expect.lastFederationBand];
    if (scenario.expect.lastFederationBand === 'federation_corridor') allowed.push('national_decarbon_federation_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastFederationRelief, lastArbitrationRelief };
    }
  }

  return { passed: true, detail: 'ok', lastFederationRelief, lastArbitrationRelief };
}

export function scoreAgent13FederationArbitrationGIAlignment(params: {
  actionText: string;
  federationBand?: string;
  arbitrationBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'decarbon federation',
    'relief arbitration',
    'inter-regional',
    'spillover coordination',
    'relief stacking',
    'export-environment federation',
    'multi-domain arbitration',
    'cross-border decarbon',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.2, 0, 2);
  if (params.federationBand === 'national_decarbon_federation_leader' || params.federationBand === 'federation_corridor') {
    delta += hits.some(h => h.includes('federation') || h.includes('spillover') || h.includes('cross-border')) ? 0.37 : 0.1;
  }
  if (params.arbitrationBand === 'arbitration_hub' || params.arbitrationBand === 'deep_relief_arbitration_mesh') {
    delta += hits.some(h => h.includes('arbitration') || h.includes('stacking') || h.includes('inter-regional')) ? 0.34 : 0.09;
  }
  if (params.arbitrationBand === 'unstacked_relief' && hits.some(h => h.includes('arbitration'))) delta -= 0.1;
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Federation arbitration GI: ${hits.slice(0, 2).join(', ')} aligns with national decarbon federation and relief arbitration depth.`
        : null,
  };
}
