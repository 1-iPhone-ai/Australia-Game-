/**
 * Agent 13 scale wave round 23 — precinct zero-carbon & embedded network orchestration depth.
 * Cross-turn persistence for all-electric precinct build-out and embedded network relief coupled to microgrid, district heat, and flexible load maturity.
 */

export type V1014ZeroCarbonPrecinctBand = 'grid_default' | 'pilot_precinct' | 'zero_carbon_campus' | 'all_electric_leader';

export type V1014EmbeddedNetworkBand = 'legacy_feeder' | 'embedded_pilot' | 'orchestrated_embedded' | 'precinct_mesh_leader';

export interface V1014ZeroCarbonPrecinctInstrument {
  id: string;
  kind: 'all_electric_precinct' | 'campus_decarb' | 'industrial_park_zero' | 'transit_oriented_hub';
  label: string;
  decarbMwEq: number;
  precinctReliefFactor: number;
  embeddedSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_ZERO_CARBON_PRECINCT_CATALOG: readonly V1014ZeroCarbonPrecinctInstrument[] = [
  {
    id: 'zp_all_electric',
    kind: 'all_electric_precinct',
    label: 'All-electric precinct master plan',
    decarbMwEq: 40,
    precinctReliefFactor: 0.14,
    embeddedSynergyFactor: 0.1,
    projectTypeHint: 'all_electric_precinct_master_plan',
  },
  {
    id: 'zp_campus',
    kind: 'campus_decarb',
    label: 'Campus decarbonisation orchestration',
    decarbMwEq: 38,
    precinctReliefFactor: 0.13,
    embeddedSynergyFactor: 0.11,
    projectTypeHint: 'campus_decarbonisation_orchestration',
  },
  {
    id: 'zp_industrial',
    kind: 'industrial_park_zero',
    label: 'Industrial park zero-carbon retrofit',
    decarbMwEq: 44,
    precinctReliefFactor: 0.15,
    embeddedSynergyFactor: 0.12,
    projectTypeHint: 'industrial_park_zero_carbon_retrofit',
  },
  {
    id: 'zp_tod',
    kind: 'transit_oriented_hub',
    label: 'Transit-oriented zero-carbon hub',
    decarbMwEq: 42,
    precinctReliefFactor: 0.14,
    embeddedSynergyFactor: 0.09,
    projectTypeHint: 'transit_oriented_zero_carbon_hub',
  },
] as const;

export interface V1014EmbeddedNetworkTemplate {
  id: string;
  kind: 'private_wire' | 'embedded_solar_storage' | 'thermal_network_tie' | 'demand_aggregation_layer';
  label: string;
  networkMwEq: number;
  gridReliefFactor: number;
  precinctSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_EMBEDDED_NETWORK_CATALOG: readonly V1014EmbeddedNetworkTemplate[] = [
  {
    id: 'en_private',
    kind: 'private_wire',
    label: 'Private wire embedded network',
    networkMwEq: 36,
    gridReliefFactor: 0.13,
    precinctSynergyFactor: 0.1,
    projectTypeHint: 'private_wire_embedded_network',
  },
  {
    id: 'en_solar',
    kind: 'embedded_solar_storage',
    label: 'Embedded solar-storage mesh',
    networkMwEq: 42,
    gridReliefFactor: 0.15,
    precinctSynergyFactor: 0.11,
    projectTypeHint: 'embedded_solar_storage_mesh',
  },
  {
    id: 'en_thermal',
    kind: 'thermal_network_tie',
    label: 'Thermal network precinct tie-in',
    networkMwEq: 40,
    gridReliefFactor: 0.14,
    precinctSynergyFactor: 0.12,
    projectTypeHint: 'thermal_network_precinct_tie',
  },
  {
    id: 'en_demand',
    kind: 'demand_aggregation_layer',
    label: 'Precinct demand aggregation layer',
    networkMwEq: 46,
    gridReliefFactor: 0.16,
    precinctSynergyFactor: 0.13,
    projectTypeHint: 'precinct_demand_aggregation_layer',
  },
] as const;

export interface V1014RegionalZeroCarbonPrecinctLedger {
  regionId: string;
  band: V1014ZeroCarbonPrecinctBand;
  precinctIndex: number;
  decarbBalance: number;
  zeroCarbonPrecinctRelief: number;
  summary: string;
}

export interface V1014RegionalEmbeddedNetworkLedger {
  regionId: string;
  band: V1014EmbeddedNetworkBand;
  networkIndex: number;
  embeddedNetworkRelief: number;
  summary: string;
}

export interface V1014ZeroCarbonPrecinctPersistedSlice {
  decarbBalance: number;
  precinctIndex: number;
}

export interface V1014EmbeddedNetworkPersistedSlice {
  networkIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const PRECINCT_REGIONS = new Set(['NSW', 'VIC', 'QLD', 'SA', 'ACT']);

export function computeRegionalZeroCarbonPrecinctLedger(params: {
  regionId: string;
  communityMicrogridRelief: number;
  districtHeatRelief: number;
  flexibleLoadRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014ZeroCarbonPrecinctPersistedSlice | null;
}): { ledger: V1014RegionalZeroCarbonPrecinctLedger; next: V1014ZeroCarbonPrecinctPersistedSlice } {
  let decarbGain = 0;
  let precinctProxy = 0;
  let embeddedSynergy = 0;
  for (const inst of V1014_ZERO_CARBON_PRECINCT_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      decarbGain += inst.decarbMwEq;
      precinctProxy += inst.precinctReliefFactor;
      embeddedSynergy += inst.embeddedSynergyFactor;
    }
  }
  if (PRECINCT_REGIONS.has(params.regionId)) precinctProxy += 0.05;
  else precinctProxy *= 0.74;
  if (params.communityMicrogridRelief > 2.4) {
    decarbGain += clamp(params.communityMicrogridRelief * 1.04, 0, 11);
    precinctProxy += 0.06;
  }
  if (params.districtHeatRelief > 2.2) embeddedSynergy += clamp(params.districtHeatRelief * 0.018, 0, 0.08);
  if (params.flexibleLoadRelief > 2.5) precinctProxy += clamp(params.flexibleLoadRelief * 0.014, 0, 0.06);
  precinctProxy += clamp(params.renewableShareScore / 115, 0, 0.09);

  const prevIdx = params.prev?.precinctIndex ?? 0;
  const prevBal = params.prev?.decarbBalance ?? 0;
  const decarbBalance = clamp(prevBal * 0.87 + decarbGain * 0.1, 0, 214);
  const precinctIndex = clamp(prevIdx * 0.84 + decarbBalance * 0.1 + precinctProxy * 77 + embeddedSynergy * 23, 0, 150);

  let band: V1014ZeroCarbonPrecinctBand = 'grid_default';
  if (precinctIndex >= 95 || decarbGain >= 112) band = 'all_electric_leader';
  else if (precinctIndex >= 57 || decarbGain >= 62) band = 'zero_carbon_campus';
  else if (precinctIndex >= 23 || decarbGain >= 20) band = 'pilot_precinct';

  let zeroCarbonPrecinctRelief = clamp(precinctProxy * 7.9 + decarbGain * 0.039 + embeddedSynergy * 4.7, 0, 10);
  if (band === 'grid_default') zeroCarbonPrecinctRelief *= 0.31;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      precinctIndex: clamp(precinctIndex, 0, 150),
      decarbBalance: clamp(decarbBalance, 0, 214),
      zeroCarbonPrecinctRelief: clamp(zeroCarbonPrecinctRelief, 0, 10),
      summary: `${params.regionId} zero-carbon ${band} · idx ${precinctIndex.toFixed(0)} · relief ${zeroCarbonPrecinctRelief.toFixed(1)}`,
    },
    next: { decarbBalance: clamp(decarbBalance, 0, 214), precinctIndex: clamp(precinctIndex, 0, 150) },
  };
}

export function advanceRegionalEmbeddedNetworkOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  precinctBand: V1014ZeroCarbonPrecinctBand;
  curtailmentRecoveryRelief: number;
  completedProjectTypes: string[];
  prev?: V1014EmbeddedNetworkPersistedSlice | null;
}): { ledger: V1014RegionalEmbeddedNetworkLedger; next: V1014EmbeddedNetworkPersistedSlice } {
  let networkGain = 0;
  let reliefProxy = 0;
  let precinctSynergy = 0;
  for (const tpl of V1014_EMBEDDED_NETWORK_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      networkGain += tpl.networkMwEq;
      reliefProxy += tpl.gridReliefFactor;
      precinctSynergy += tpl.precinctSynergyFactor;
    }
  }
  if (params.precinctBand === 'zero_carbon_campus' || params.precinctBand === 'all_electric_leader') {
    networkGain += 12;
    precinctSynergy += 0.08;
  }
  if (params.curtailmentRecoveryRelief > 2.6) {
    networkGain += params.curtailmentRecoveryRelief * 0.78;
    reliefProxy += clamp(params.curtailmentRecoveryRelief * 0.009, 0, 0.05);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.26, 0, 9);
  const prevIdx = params.prev?.networkIndex ?? 0;
  const networkIndex = clamp(prevIdx * 0.85 + networkGain * 0.1 + reliefProxy * 29 - stressLoad * 0.03 + precinctSynergy * 24, 0, 153);

  let band: V1014EmbeddedNetworkBand = 'legacy_feeder';
  if (networkIndex >= 99 || networkGain >= 116) band = 'precinct_mesh_leader';
  else if (networkIndex >= 61 || networkGain >= 68) band = 'orchestrated_embedded';
  else if (networkIndex >= 25 || networkGain >= 22) band = 'embedded_pilot';

  let embeddedNetworkRelief = clamp(networkIndex / 21 + reliefProxy * 6.2 + precinctSynergy * 6.6, 0, 9.6);
  if (band === 'legacy_feeder') embeddedNetworkRelief = clamp(embeddedNetworkRelief * 0.29, 0, 2.7);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      networkIndex: clamp(networkIndex, 0, 153),
      embeddedNetworkRelief: clamp(embeddedNetworkRelief, 0, 9.6),
      summary: `${params.regionId} embedded ${band} · idx ${networkIndex.toFixed(0)} · relief ${embeddedNetworkRelief.toFixed(1)}`,
    },
    next: { networkIndex: clamp(networkIndex, 0, 153) },
  };
}

export const V1014_PRECINCT_EMBEDDED_SCENARIOS = [
  {
    id: 'sc_pe_nsw',
    label: 'NSW all-electric precinct with solar-storage mesh',
    regionId: 'NSW',
    communityMicrogridRelief: 3,
    districtHeatRelief: 2.8,
    flexibleLoadRelief: 2.9,
    renewableShareScore: 53,
    gridStressPoints: 15,
    curtailmentRecoveryRelief: 2.7,
    completedProjectTypes: [
      'all_electric_precinct_master_plan',
      'campus_decarbonisation_orchestration',
      'embedded_solar_storage_mesh',
      'precinct_demand_aggregation_layer',
    ],
    expectPrecinctBand: 'zero_carbon_campus' as V1014ZeroCarbonPrecinctBand,
    expectMinPrecinctRelief: 2.1,
    expectEmbeddedBand: 'orchestrated_embedded' as V1014EmbeddedNetworkBand,
    expectMinEmbeddedRelief: 1.8,
  },
  {
    id: 'sc_pe_vic',
    label: 'VIC industrial park with private wire network',
    regionId: 'VIC',
    communityMicrogridRelief: 2.5,
    districtHeatRelief: 2.4,
    flexibleLoadRelief: 2.3,
    renewableShareScore: 47,
    gridStressPoints: 13,
    curtailmentRecoveryRelief: 2.2,
    precinctBand: 'pilot_precinct' as V1014ZeroCarbonPrecinctBand,
    completedProjectTypes: ['industrial_park_zero_carbon_retrofit', 'private_wire_embedded_network', 'thermal_network_precinct_tie'],
    expectEmbeddedBand: 'embedded_pilot' as V1014EmbeddedNetworkBand,
    expectMinEmbeddedRelief: 1.5,
  },
] as const;

export function runAgent13PrecinctEmbeddedScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_ZERO_CARBON_PRECINCT_CATALOG.length >= 4);
  ok(V1014_EMBEDDED_NETWORK_CATALOG.length >= 4);

  const sc0 = V1014_PRECINCT_EMBEDDED_SCENARIOS[0];
  const precinct = computeRegionalZeroCarbonPrecinctLedger({
    regionId: sc0.regionId,
    communityMicrogridRelief: sc0.communityMicrogridRelief,
    districtHeatRelief: sc0.districtHeatRelief,
    flexibleLoadRelief: sc0.flexibleLoadRelief,
    renewableShareScore: sc0.renewableShareScore,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    precinct.ledger.band === sc0.expectPrecinctBand ||
      precinct.ledger.band === 'all_electric_leader' ||
      precinct.ledger.zeroCarbonPrecinctRelief >= sc0.expectMinPrecinctRelief,
  );

  const embedded = advanceRegionalEmbeddedNetworkOrchestration({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    precinctBand: precinct.ledger.band,
    curtailmentRecoveryRelief: sc0.curtailmentRecoveryRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    embedded.ledger.band === sc0.expectEmbeddedBand ||
      embedded.ledger.band === 'precinct_mesh_leader' ||
      embedded.ledger.embeddedNetworkRelief >= sc0.expectMinEmbeddedRelief,
  );

  const sc1 = V1014_PRECINCT_EMBEDDED_SCENARIOS[1];
  const embV = advanceRegionalEmbeddedNetworkOrchestration({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    precinctBand: sc1.precinctBand,
    curtailmentRecoveryRelief: sc1.curtailmentRecoveryRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(embV.ledger.embeddedNetworkRelief >= sc1.expectMinEmbeddedRelief || embV.ledger.band !== 'legacy_feeder');

  const persistA = computeRegionalZeroCarbonPrecinctLedger({
    regionId: 'ACT',
    communityMicrogridRelief: 2.6,
    districtHeatRelief: 2.5,
    flexibleLoadRelief: 2.4,
    renewableShareScore: 41,
    completedProjectTypes: ['transit_oriented_zero_carbon_hub'],
    prev: null,
  });
  const persistB = computeRegionalZeroCarbonPrecinctLedger({
    regionId: 'ACT',
    communityMicrogridRelief: 2.6,
    districtHeatRelief: 2.5,
    flexibleLoadRelief: 2.4,
    renewableShareScore: 41,
    completedProjectTypes: ['transit_oriented_zero_carbon_hub'],
    prev: persistA.next,
  });
  ok(persistB.next.precinctIndex >= persistA.next.precinctIndex * 0.73);

  const turnSc = runAgent13PrecinctEmbeddedTurnScenario(V1014_PRECINCT_EMBEDDED_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastPrecinctRelief >= 2.1);

  const gi = scoreAgent13PrecinctEmbeddedGIAlignment({
    actionText: 'All electric precinct with embedded solar storage mesh and demand aggregation',
    precinctBand: 'zero_carbon_campus',
    embeddedBand: 'orchestrated_embedded',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13PrecinctEmbeddedTurnStep {
  turn: number;
  regionId: string;
  communityMicrogridRelief: number;
  districtHeatRelief: number;
  flexibleLoadRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  curtailmentRecoveryRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13PrecinctEmbeddedTurnScenario {
  id: string;
  label: string;
  steps: Agent13PrecinctEmbeddedTurnStep[];
  expect: {
    minPrecinctReliefOnLast?: number;
    minEmbeddedReliefOnLast?: number;
    lastPrecinctBand?: V1014ZeroCarbonPrecinctBand;
  };
}

export const V1014_PRECINCT_EMBEDDED_TURN_SCENARIOS: readonly Agent13PrecinctEmbeddedTurnScenario[] = [
  {
    id: 'sc_pe_nsw_escalation',
    label: 'NSW zero-carbon precinct with mesh leader embedded network',
    steps: [
      {
        turn: 1,
        regionId: 'NSW',
        communityMicrogridRelief: 2.4,
        districtHeatRelief: 2.2,
        flexibleLoadRelief: 2.3,
        renewableShareScore: 44,
        gridStressPoints: 16,
        curtailmentRecoveryRelief: 2.2,
        completedProjectTypes: ['all_electric_precinct_master_plan', 'private_wire_embedded_network'],
      },
      {
        turn: 2,
        regionId: 'NSW',
        communityMicrogridRelief: 2.8,
        districtHeatRelief: 2.6,
        flexibleLoadRelief: 2.7,
        renewableShareScore: 48,
        gridStressPoints: 14,
        curtailmentRecoveryRelief: 2.6,
        completedProjectTypes: ['campus_decarbonisation_orchestration', 'embedded_solar_storage_mesh'],
      },
      {
        turn: 3,
        regionId: 'NSW',
        communityMicrogridRelief: 3.2,
        districtHeatRelief: 2.9,
        flexibleLoadRelief: 3,
        renewableShareScore: 54,
        gridStressPoints: 12,
        curtailmentRecoveryRelief: 2.9,
        completedProjectTypes: [
          'all_electric_precinct_master_plan',
          'campus_decarbonisation_orchestration',
          'industrial_park_zero_carbon_retrofit',
          'transit_oriented_zero_carbon_hub',
          'private_wire_embedded_network',
          'embedded_solar_storage_mesh',
          'thermal_network_precinct_tie',
          'precinct_demand_aggregation_layer',
        ],
      },
    ],
    expect: { minPrecinctReliefOnLast: 2.1, minEmbeddedReliefOnLast: 1.8, lastPrecinctBand: 'zero_carbon_campus' },
  },
] as const;

export function runAgent13PrecinctEmbeddedTurnScenario(
  scenario: Agent13PrecinctEmbeddedTurnScenario,
): { passed: boolean; detail: string; lastPrecinctRelief: number; lastEmbeddedRelief: number } {
  let precinctMem: V1014ZeroCarbonPrecinctPersistedSlice | null = null;
  let embeddedMem: V1014EmbeddedNetworkPersistedSlice | null = null;
  let lastPrecinctRelief = 0;
  let lastEmbeddedRelief = 0;
  let lastBand: V1014ZeroCarbonPrecinctBand = 'grid_default';

  for (const step of scenario.steps) {
    const precinct = computeRegionalZeroCarbonPrecinctLedger({
      regionId: step.regionId,
      communityMicrogridRelief: step.communityMicrogridRelief,
      districtHeatRelief: step.districtHeatRelief,
      flexibleLoadRelief: step.flexibleLoadRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: precinctMem,
    });
    precinctMem = precinct.next;
    lastPrecinctRelief = precinct.ledger.zeroCarbonPrecinctRelief;
    lastBand = precinct.ledger.band;

    const embedded = advanceRegionalEmbeddedNetworkOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      precinctBand: precinct.ledger.band,
      curtailmentRecoveryRelief: step.curtailmentRecoveryRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: embeddedMem,
    });
    embeddedMem = embedded.next;
    lastEmbeddedRelief = embedded.ledger.embeddedNetworkRelief;
  }

  if (scenario.expect.minPrecinctReliefOnLast != null && lastPrecinctRelief < scenario.expect.minPrecinctReliefOnLast) {
    return {
      passed: false,
      detail: `precinct relief ${lastPrecinctRelief} < ${scenario.expect.minPrecinctReliefOnLast}`,
      lastPrecinctRelief,
      lastEmbeddedRelief,
    };
  }
  if (scenario.expect.minEmbeddedReliefOnLast != null && lastEmbeddedRelief < scenario.expect.minEmbeddedReliefOnLast) {
    return {
      passed: false,
      detail: `embedded relief ${lastEmbeddedRelief} < ${scenario.expect.minEmbeddedReliefOnLast}`,
      lastPrecinctRelief,
      lastEmbeddedRelief,
    };
  }
  if (scenario.expect.lastPrecinctBand != null) {
    const allowed: V1014ZeroCarbonPrecinctBand[] = [scenario.expect.lastPrecinctBand];
    if (scenario.expect.lastPrecinctBand === 'zero_carbon_campus') allowed.push('all_electric_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastPrecinctRelief, lastEmbeddedRelief };
    }
  }

  return { passed: true, detail: 'ok', lastPrecinctRelief, lastEmbeddedRelief };
}

export function scoreAgent13PrecinctEmbeddedGIAlignment(params: {
  actionText: string;
  precinctBand?: string;
  embeddedBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'zero carbon',
    'zero-carbon',
    'all electric',
    'embedded network',
    'private wire',
    'precinct',
    'campus decarb',
    'demand aggregation',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.26, 0, 2);
  if (params.precinctBand === 'all_electric_leader' || params.precinctBand === 'zero_carbon_campus') {
    delta += hits.some(h => h.includes('zero') || h.includes('electric') || h.includes('precinct')) ? 0.4 : 0.1;
  }
  if (params.embeddedBand === 'orchestrated_embedded' || params.embeddedBand === 'precinct_mesh_leader') {
    delta += hits.some(h => h.includes('embedded') || h.includes('wire') || h.includes('mesh')) ? 0.35 : 0.09;
  }
  if (params.embeddedBand === 'legacy_feeder' && hits.some(h => h.includes('embedded'))) delta -= 0.11;
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Precinct embedded GI: ${hits.slice(0, 2).join(', ')} aligns with zero-carbon precinct and embedded network depth.`
        : null,
  };
}
