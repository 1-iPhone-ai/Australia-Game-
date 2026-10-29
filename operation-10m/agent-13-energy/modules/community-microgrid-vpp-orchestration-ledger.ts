/**
 * Agent 13 scale wave round 18 — community microgrid resilience & virtual power plant orchestration depth.
 * Cross-turn persistence for islanded backup corridors and distributed flex aggregation coupled to DER, V2G, and bushfire maturity.
 */

export type V1014CommunityMicrogridBand = 'grid_tied_only' | 'pilot_microgrid' | 'resilient_community' | 'islanded_leader';

export type V1014VppOrchestrationBand = 'unaggregated' | 'pilot_vpp' | 'orchestrated_flex' | 'national_vpp_mesh';

export interface V1014CommunityMicrogridInstrument {
  id: string;
  kind: 'rural_backup' | 'suburban_island' | 'industrial_park_micro' | 'remote_township';
  label: string;
  resilienceMwEq: number;
  islandReliefFactor: number;
  vppSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_COMMUNITY_MICROGRID_CATALOG: readonly V1014CommunityMicrogridInstrument[] = [
  {
    id: 'mg_rural',
    kind: 'rural_backup',
    label: 'Rural feeder backup microgrid',
    resilienceMwEq: 36,
    islandReliefFactor: 0.14,
    vppSynergyFactor: 0.1,
    projectTypeHint: 'rural_feeder_backup_microgrid',
  },
  {
    id: 'mg_suburban',
    kind: 'suburban_island',
    label: 'Suburban islanded resilience cluster',
    resilienceMwEq: 40,
    islandReliefFactor: 0.15,
    vppSynergyFactor: 0.11,
    projectTypeHint: 'suburban_islanded_resilience_cluster',
  },
  {
    id: 'mg_industrial',
    kind: 'industrial_park_micro',
    label: 'Industrial park microgrid orchestration',
    resilienceMwEq: 44,
    islandReliefFactor: 0.16,
    vppSynergyFactor: 0.12,
    projectTypeHint: 'industrial_park_microgrid_orchestration',
  },
  {
    id: 'mg_remote',
    kind: 'remote_township',
    label: 'Remote township hybrid microgrid',
    resilienceMwEq: 38,
    islandReliefFactor: 0.13,
    vppSynergyFactor: 0.09,
    projectTypeHint: 'remote_township_hybrid_microgrid',
  },
] as const;

export interface V1014VppOrchestrationTemplate {
  id: string;
  kind: 'rooftop_aggregation' | 'fleet_v2g_pool' | 'demand_flex_market' | 'bushfire_aware_dispatch';
  label: string;
  orchestrationMwEq: number;
  gridReliefFactor: number;
  microgridSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_VPP_ORCHESTRATION_CATALOG: readonly V1014VppOrchestrationTemplate[] = [
  {
    id: 'vpp_rooftop',
    kind: 'rooftop_aggregation',
    label: 'Rooftop solar aggregation pool',
    orchestrationMwEq: 42,
    gridReliefFactor: 0.15,
    microgridSynergyFactor: 0.1,
    projectTypeHint: 'rooftop_solar_aggregation_pool',
  },
  {
    id: 'vpp_v2g',
    kind: 'fleet_v2g_pool',
    label: 'Fleet V2G orchestration hub',
    orchestrationMwEq: 46,
    gridReliefFactor: 0.16,
    microgridSynergyFactor: 0.11,
    projectTypeHint: 'fleet_v2g_orchestration_hub',
  },
  {
    id: 'vpp_demand',
    kind: 'demand_flex_market',
    label: 'Community demand-flex market layer',
    orchestrationMwEq: 38,
    gridReliefFactor: 0.14,
    microgridSynergyFactor: 0.12,
    projectTypeHint: 'community_demand_flex_market',
  },
  {
    id: 'vpp_bushfire',
    kind: 'bushfire_aware_dispatch',
    label: 'Bushfire-aware VPP dispatch loop',
    orchestrationMwEq: 48,
    gridReliefFactor: 0.17,
    microgridSynergyFactor: 0.13,
    projectTypeHint: 'bushfire_aware_vpp_dispatch',
  },
] as const;

export interface V1014RegionalCommunityMicrogridLedger {
  regionId: string;
  band: V1014CommunityMicrogridBand;
  microgridIndex: number;
  resilienceBalance: number;
  communityMicrogridRelief: number;
  summary: string;
}

export interface V1014RegionalVppOrchestrationLedger {
  regionId: string;
  band: V1014VppOrchestrationBand;
  orchestrationIndex: number;
  vppOrchestrationRelief: number;
  summary: string;
}

export interface V1014MicrogridPersistedSlice {
  resilienceBalance: number;
  microgridIndex: number;
}

export interface V1014VppPersistedSlice {
  orchestrationIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const MICROGRID_REGIONS = new Set(['NSW', 'VIC', 'QLD', 'TAS', 'SA', 'WA', 'NT']);

export function computeRegionalCommunityMicrogridLedger(params: {
  regionId: string;
  bushfireGridRelief: number;
  rooftopDerRelief: number;
  seasonalArbitrageRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014MicrogridPersistedSlice | null;
}): { ledger: V1014RegionalCommunityMicrogridLedger; next: V1014MicrogridPersistedSlice } {
  let resilienceGain = 0;
  let islandProxy = 0;
  let vppSynergy = 0;
  for (const inst of V1014_COMMUNITY_MICROGRID_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      resilienceGain += inst.resilienceMwEq;
      islandProxy += inst.islandReliefFactor;
      vppSynergy += inst.vppSynergyFactor;
    }
  }
  if (MICROGRID_REGIONS.has(params.regionId)) islandProxy += 0.05;
  else islandProxy *= 0.74;
  if (params.bushfireGridRelief > 2.5) {
    resilienceGain += clamp(params.bushfireGridRelief * 1.1, 0, 12);
    islandProxy += 0.07;
  }
  if (params.rooftopDerRelief > 2.2) vppSynergy += clamp(params.rooftopDerRelief * 0.022, 0, 0.1);
  islandProxy += clamp(params.renewableShareScore / 118, 0, 0.09);
  if (params.seasonalArbitrageRelief > 2) islandProxy += clamp(params.seasonalArbitrageRelief * 0.018, 0, 0.08);

  const prevIdx = params.prev?.microgridIndex ?? 0;
  const prevBal = params.prev?.resilienceBalance ?? 0;
  const resilienceBalance = clamp(prevBal * 0.88 + resilienceGain * 0.11, 0, 210);
  const microgridIndex = clamp(
    prevIdx * 0.85 + resilienceBalance * 0.11 + islandProxy * 82 + vppSynergy * 24,
    0,
    148,
  );

  let band: V1014CommunityMicrogridBand = 'grid_tied_only';
  if (microgridIndex >= 94 || resilienceGain >= 112) band = 'islanded_leader';
  else if (microgridIndex >= 56 || resilienceGain >= 64) band = 'resilient_community';
  else if (microgridIndex >= 22 || resilienceGain >= 20) band = 'pilot_microgrid';

  let communityMicrogridRelief = clamp(islandProxy * 8.8 + resilienceGain * 0.044 + vppSynergy * 5.2, 0, 11);
  if (band === 'grid_tied_only') communityMicrogridRelief *= 0.36;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      microgridIndex: clamp(microgridIndex, 0, 148),
      resilienceBalance: clamp(resilienceBalance, 0, 210),
      communityMicrogridRelief: clamp(communityMicrogridRelief, 0, 11),
      summary: `${params.regionId} microgrid ${band} · idx ${microgridIndex.toFixed(0)} · relief ${communityMicrogridRelief.toFixed(1)}`,
    },
    next: { resilienceBalance: clamp(resilienceBalance, 0, 210), microgridIndex: clamp(microgridIndex, 0, 148) },
  };
}

export function advanceRegionalVppOrchestration(params: {
  regionId: string;
  gridStressPoints: number;
  microgridBand: V1014CommunityMicrogridBand;
  evV2gGridRelief: number;
  completedProjectTypes: string[];
  prev?: V1014VppPersistedSlice | null;
}): { ledger: V1014RegionalVppOrchestrationLedger; next: V1014VppPersistedSlice } {
  let orchGain = 0;
  let reliefProxy = 0;
  let microSynergy = 0;
  for (const tpl of V1014_VPP_ORCHESTRATION_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      orchGain += tpl.orchestrationMwEq;
      reliefProxy += tpl.gridReliefFactor;
      microSynergy += tpl.microgridSynergyFactor;
    }
  }
  if (params.microgridBand === 'resilient_community' || params.microgridBand === 'islanded_leader') {
    orchGain += 13;
    microSynergy += 0.08;
  }
  if (params.evV2gGridRelief > 2.6) {
    orchGain += params.evV2gGridRelief * 0.88;
    reliefProxy += clamp(params.evV2gGridRelief * 0.011, 0, 0.07);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.31, 0, 11);
  const prevIdx = params.prev?.orchestrationIndex ?? 0;
  const orchestrationIndex = clamp(prevIdx * 0.86 + orchGain * 0.1 + reliefProxy * 34 - stressLoad * 0.035 + microSynergy * 26, 0, 152);

  let band: V1014VppOrchestrationBand = 'unaggregated';
  if (orchestrationIndex >= 98 || orchGain >= 118) band = 'national_vpp_mesh';
  else if (orchestrationIndex >= 60 || orchGain >= 70) band = 'orchestrated_flex';
  else if (orchestrationIndex >= 26 || orchGain >= 24) band = 'pilot_vpp';

  let vppOrchestrationRelief = clamp(orchestrationIndex / 22 + reliefProxy * 6.8 + microSynergy * 7.2, 0, 10.2);
  if (band === 'unaggregated') vppOrchestrationRelief = clamp(vppOrchestrationRelief * 0.34, 0, 3.2);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      orchestrationIndex: clamp(orchestrationIndex, 0, 152),
      vppOrchestrationRelief: clamp(vppOrchestrationRelief, 0, 10.2),
      summary: `${params.regionId} VPP ${band} · idx ${orchestrationIndex.toFixed(0)} · relief ${vppOrchestrationRelief.toFixed(1)}`,
    },
    next: { orchestrationIndex: clamp(orchestrationIndex, 0, 152) },
  };
}

export const V1014_MICROGRID_VPP_SCENARIOS = [
  {
    id: 'sc_mg_nsw',
    label: 'NSW suburban microgrid with rooftop VPP pool',
    regionId: 'NSW',
    bushfireGridRelief: 3.4,
    rooftopDerRelief: 3.1,
    seasonalArbitrageRelief: 2.8,
    renewableShareScore: 52,
    gridStressPoints: 16,
    evV2gGridRelief: 3,
    completedProjectTypes: [
      'suburban_islanded_resilience_cluster',
      'industrial_park_microgrid_orchestration',
      'rooftop_solar_aggregation_pool',
      'fleet_v2g_orchestration_hub',
      'bushfire_aware_vpp_dispatch',
    ],
    expectMicrogridBand: 'resilient_community' as V1014CommunityMicrogridBand,
    expectMinMicroRelief: 2.5,
    expectVppBand: 'orchestrated_flex' as V1014VppOrchestrationBand,
    expectMinVppRelief: 2,
  },
  {
    id: 'sc_mg_tas',
    label: 'TAS remote township with demand-flex market',
    regionId: 'TAS',
    bushfireGridRelief: 2.8,
    rooftopDerRelief: 2.4,
    seasonalArbitrageRelief: 2.2,
    renewableShareScore: 48,
    gridStressPoints: 14,
    evV2gGridRelief: 2.5,
    microgridBand: 'pilot_microgrid' as V1014CommunityMicrogridBand,
    completedProjectTypes: ['remote_township_hybrid_microgrid', 'community_demand_flex_market', 'rooftop_solar_aggregation_pool'],
    expectVppBand: 'pilot_vpp' as V1014VppOrchestrationBand,
    expectMinVppRelief: 1.8,
  },
] as const;

export function runAgent13MicrogridVppScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_COMMUNITY_MICROGRID_CATALOG.length >= 4);
  ok(V1014_VPP_ORCHESTRATION_CATALOG.length >= 4);

  const sc0 = V1014_MICROGRID_VPP_SCENARIOS[0];
  const micro = computeRegionalCommunityMicrogridLedger({
    regionId: sc0.regionId,
    bushfireGridRelief: sc0.bushfireGridRelief,
    rooftopDerRelief: sc0.rooftopDerRelief,
    seasonalArbitrageRelief: sc0.seasonalArbitrageRelief,
    renewableShareScore: sc0.renewableShareScore,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    micro.ledger.band === sc0.expectMicrogridBand ||
      micro.ledger.band === 'islanded_leader' ||
      micro.ledger.communityMicrogridRelief >= sc0.expectMinMicroRelief,
  );

  const vpp = advanceRegionalVppOrchestration({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    microgridBand: micro.ledger.band,
    evV2gGridRelief: sc0.evV2gGridRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    vpp.ledger.band === sc0.expectVppBand ||
      vpp.ledger.band === 'national_vpp_mesh' ||
      vpp.ledger.vppOrchestrationRelief >= sc0.expectMinVppRelief,
  );

  const sc1 = V1014_MICROGRID_VPP_SCENARIOS[1];
  const vppT = advanceRegionalVppOrchestration({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    microgridBand: sc1.microgridBand,
    evV2gGridRelief: sc1.evV2gGridRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(vppT.ledger.vppOrchestrationRelief >= sc1.expectMinVppRelief || vppT.ledger.band !== 'unaggregated');

  const persistA = computeRegionalCommunityMicrogridLedger({
    regionId: 'VIC',
    bushfireGridRelief: 2.9,
    rooftopDerRelief: 2.7,
    seasonalArbitrageRelief: 2.4,
    renewableShareScore: 44,
    completedProjectTypes: ['rural_feeder_backup_microgrid'],
    prev: null,
  });
  const persistB = computeRegionalCommunityMicrogridLedger({
    regionId: 'VIC',
    bushfireGridRelief: 2.9,
    rooftopDerRelief: 2.7,
    seasonalArbitrageRelief: 2.4,
    renewableShareScore: 44,
    completedProjectTypes: ['rural_feeder_backup_microgrid'],
    prev: persistA.next,
  });
  ok(persistB.next.microgridIndex >= persistA.next.microgridIndex * 0.78);

  const turnSc = runAgent13MicrogridVppTurnScenario(V1014_MICROGRID_VPP_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastMicroRelief >= 2.5);

  const gi = scoreAgent13MicrogridVppGIAlignment({
    actionText: 'Suburban microgrid with rooftop aggregation and fleet V2G orchestration hub',
    microgridBand: 'resilient_community',
    vppBand: 'orchestrated_flex',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13MicrogridVppTurnStep {
  turn: number;
  regionId: string;
  bushfireGridRelief: number;
  rooftopDerRelief: number;
  seasonalArbitrageRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  evV2gGridRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13MicrogridVppTurnScenario {
  id: string;
  label: string;
  steps: Agent13MicrogridVppTurnStep[];
  expect: {
    minMicroReliefOnLast?: number;
    minVppReliefOnLast?: number;
    lastMicrogridBand?: V1014CommunityMicrogridBand;
  };
}

export const V1014_MICROGRID_VPP_TURN_SCENARIOS: readonly Agent13MicrogridVppTurnScenario[] = [
  {
    id: 'sc_mg_nsw_escalation',
    label: 'NSW microgrid build-out with national VPP mesh',
    steps: [
      {
        turn: 1,
        regionId: 'NSW',
        bushfireGridRelief: 2.6,
        rooftopDerRelief: 2.5,
        seasonalArbitrageRelief: 2.2,
        renewableShareScore: 46,
        gridStressPoints: 17,
        evV2gGridRelief: 2.4,
        completedProjectTypes: ['rural_feeder_backup_microgrid', 'suburban_islanded_resilience_cluster'],
      },
      {
        turn: 2,
        regionId: 'NSW',
        bushfireGridRelief: 3.1,
        rooftopDerRelief: 2.9,
        seasonalArbitrageRelief: 2.6,
        renewableShareScore: 50,
        gridStressPoints: 15,
        evV2gGridRelief: 2.8,
        completedProjectTypes: [
          'suburban_islanded_resilience_cluster',
          'rooftop_solar_aggregation_pool',
          'fleet_v2g_orchestration_hub',
        ],
      },
      {
        turn: 3,
        regionId: 'NSW',
        bushfireGridRelief: 3.6,
        rooftopDerRelief: 3.2,
        seasonalArbitrageRelief: 3,
        renewableShareScore: 56,
        gridStressPoints: 13,
        evV2gGridRelief: 3.2,
        completedProjectTypes: [
          'rural_feeder_backup_microgrid',
          'suburban_islanded_resilience_cluster',
          'industrial_park_microgrid_orchestration',
          'remote_township_hybrid_microgrid',
          'rooftop_solar_aggregation_pool',
          'fleet_v2g_orchestration_hub',
          'community_demand_flex_market',
          'bushfire_aware_vpp_dispatch',
        ],
      },
    ],
    expect: { minMicroReliefOnLast: 2.5, minVppReliefOnLast: 2, lastMicrogridBand: 'resilient_community' },
  },
] as const;

export function runAgent13MicrogridVppTurnScenario(
  scenario: Agent13MicrogridVppTurnScenario,
): { passed: boolean; detail: string; lastMicroRelief: number; lastVppRelief: number } {
  let microMem: V1014MicrogridPersistedSlice | null = null;
  let vppMem: V1014VppPersistedSlice | null = null;
  let lastMicroRelief = 0;
  let lastVppRelief = 0;
  let lastBand: V1014CommunityMicrogridBand = 'grid_tied_only';

  for (const step of scenario.steps) {
    const micro = computeRegionalCommunityMicrogridLedger({
      regionId: step.regionId,
      bushfireGridRelief: step.bushfireGridRelief,
      rooftopDerRelief: step.rooftopDerRelief,
      seasonalArbitrageRelief: step.seasonalArbitrageRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: microMem,
    });
    microMem = micro.next;
    lastMicroRelief = micro.ledger.communityMicrogridRelief;
    lastBand = micro.ledger.band;

    const vpp = advanceRegionalVppOrchestration({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      microgridBand: micro.ledger.band,
      evV2gGridRelief: step.evV2gGridRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: vppMem,
    });
    vppMem = vpp.next;
    lastVppRelief = vpp.ledger.vppOrchestrationRelief;
  }

  if (scenario.expect.minMicroReliefOnLast != null && lastMicroRelief < scenario.expect.minMicroReliefOnLast) {
    return {
      passed: false,
      detail: `micro relief ${lastMicroRelief} < ${scenario.expect.minMicroReliefOnLast}`,
      lastMicroRelief,
      lastVppRelief,
    };
  }
  if (scenario.expect.minVppReliefOnLast != null && lastVppRelief < scenario.expect.minVppReliefOnLast) {
    return {
      passed: false,
      detail: `vpp relief ${lastVppRelief} < ${scenario.expect.minVppReliefOnLast}`,
      lastMicroRelief,
      lastVppRelief,
    };
  }
  if (scenario.expect.lastMicrogridBand != null) {
    const allowed: V1014CommunityMicrogridBand[] = [scenario.expect.lastMicrogridBand];
    if (scenario.expect.lastMicrogridBand === 'resilient_community') allowed.push('islanded_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastMicroRelief, lastVppRelief };
    }
  }

  return { passed: true, detail: 'ok', lastMicroRelief, lastVppRelief };
}

export function scoreAgent13MicrogridVppGIAlignment(params: {
  actionText: string;
  microgridBand?: string;
  vppBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'microgrid',
    'virtual power plant',
    'vpp',
    'rooftop aggregation',
    'v2g',
    'islanded',
    'community flex',
    'bushfire dispatch',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.31, 0, 2);
  if (params.microgridBand === 'islanded_leader' || params.microgridBand === 'resilient_community') {
    delta += hits.some(h => h.includes('microgrid') || h.includes('islanded')) ? 0.46 : 0.14;
  }
  if (params.vppBand === 'orchestrated_flex' || params.vppBand === 'national_vpp_mesh') {
    delta += hits.some(h => h.includes('vpp') || h.includes('aggregation') || h.includes('v2g')) ? 0.4 : 0.1;
  }
  if (params.vppBand === 'unaggregated' && hits.some(h => h.includes('vpp'))) delta -= 0.14;
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Microgrid VPP GI: ${hits.slice(0, 2).join(', ')} aligns with community resilience and VPP orchestration depth.`
        : null,
  };
}
