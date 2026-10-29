/**
 * Agent 13 scale wave round 25 — nature-positive siting & biodiversity coexistence orchestration depth.
 * Cross-turn persistence for nature-positive renewable siting corridors and biodiversity coexistence relief
 * coupled to stewardship, agrivoltaics, blue carbon, and zero-carbon precinct maturity.
 */

export type V1014NaturePositiveSitingBand =
  | 'legacy_siting'
  | 'pilot_nature_positive'
  | 'co_design_corridor'
  | 'regeneration_aligned_leader';

export type V1014BiodiversityCoexistenceBand =
  | 'conflict_prone'
  | 'mitigation_pilot'
  | 'coexistence_hub'
  | 'net_gain_stewardship';

export interface V1014NaturePositiveSitingInstrument {
  id: string;
  kind: 'regeneration_corridor' | 'dual_use_renewable_paddock' | 'habitat_buffer_orchestration' | 'nature_positive_rez_siting';
  label: string;
  sitingMwEq: number;
  stewardshipReliefFactor: number;
  coexistenceSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_NATURE_POSITIVE_SITING_CATALOG: readonly V1014NaturePositiveSitingInstrument[] = [
  {
    id: 'np_regen',
    kind: 'regeneration_corridor',
    label: 'Regeneration corridor siting loop',
    sitingMwEq: 38,
    stewardshipReliefFactor: 0.17,
    coexistenceSynergyFactor: 0.11,
    projectTypeHint: 'regeneration_corridor_siting_loop',
  },
  {
    id: 'np_dual',
    kind: 'dual_use_renewable_paddock',
    label: 'Dual-use renewable paddock mesh',
    sitingMwEq: 42,
    stewardshipReliefFactor: 0.16,
    coexistenceSynergyFactor: 0.12,
    projectTypeHint: 'dual_use_renewable_paddock_mesh',
  },
  {
    id: 'np_buffer',
    kind: 'habitat_buffer_orchestration',
    label: 'Habitat buffer orchestration layer',
    sitingMwEq: 40,
    stewardshipReliefFactor: 0.15,
    coexistenceSynergyFactor: 0.13,
    projectTypeHint: 'habitat_buffer_orchestration_layer',
  },
  {
    id: 'np_rez',
    kind: 'nature_positive_rez_siting',
    label: 'Nature-positive REZ siting master plan',
    sitingMwEq: 46,
    stewardshipReliefFactor: 0.18,
    coexistenceSynergyFactor: 0.14,
    projectTypeHint: 'nature_positive_rez_siting_master_plan',
  },
] as const;

export interface V1014BiodiversityCoexistenceTemplate {
  id: string;
  kind: 'offset_stacking_hub' | 'species_sensitive_routing' | 'indigenous_stewardship_tie' | 'net_gain_monitoring_mesh';
  label: string;
  coexistenceScoreEq: number;
  landReliefFactor: number;
  sitingSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_BIODIVERSITY_COEXISTENCE_CATALOG: readonly V1014BiodiversityCoexistenceTemplate[] = [
  {
    id: 'bc_offset',
    kind: 'offset_stacking_hub',
    label: 'Biodiversity offset stacking hub',
    coexistenceScoreEq: 44,
    landReliefFactor: 0.16,
    sitingSynergyFactor: 0.1,
    projectTypeHint: 'biodiversity_offset_stacking_hub',
  },
  {
    id: 'bc_routing',
    kind: 'species_sensitive_routing',
    label: 'Species-sensitive routing corridor',
    coexistenceScoreEq: 42,
    landReliefFactor: 0.15,
    sitingSynergyFactor: 0.11,
    projectTypeHint: 'species_sensitive_routing_corridor',
  },
  {
    id: 'bc_indigenous',
    kind: 'indigenous_stewardship_tie',
    label: 'Indigenous stewardship coexistence tie',
    coexistenceScoreEq: 48,
    landReliefFactor: 0.17,
    sitingSynergyFactor: 0.12,
    projectTypeHint: 'indigenous_stewardship_coexistence_tie',
  },
  {
    id: 'bc_net_gain',
    kind: 'net_gain_monitoring_mesh',
    label: 'Net gain monitoring mesh',
    coexistenceScoreEq: 46,
    landReliefFactor: 0.16,
    sitingSynergyFactor: 0.13,
    projectTypeHint: 'net_gain_monitoring_mesh',
  },
] as const;

export interface V1014RegionalNaturePositiveSitingLedger {
  regionId: string;
  band: V1014NaturePositiveSitingBand;
  sitingIndex: number;
  regenerationBalance: number;
  naturePositiveSitingRelief: number;
  summary: string;
}

export interface V1014RegionalBiodiversityCoexistenceLedger {
  regionId: string;
  band: V1014BiodiversityCoexistenceBand;
  coexistenceIndex: number;
  biodiversityCoexistenceRelief: number;
  summary: string;
}

export interface V1014NaturePositiveSitingPersistedSlice {
  regenerationBalance: number;
  sitingIndex: number;
}

export interface V1014BiodiversityCoexistencePersistedSlice {
  coexistenceIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const STEWARDSHIP_REGIONS = new Set(['QLD', 'NSW', 'NT', 'WA', 'TAS']);

export function computeRegionalNaturePositiveSitingLedger(params: {
  regionId: string;
  landStewardshipRelief: number;
  agrivoltaicsLandRelief: number;
  blueCarbonCoastalRelief: number;
  zeroCarbonPrecinctRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014NaturePositiveSitingPersistedSlice | null;
}): { ledger: V1014RegionalNaturePositiveSitingLedger; next: V1014NaturePositiveSitingPersistedSlice } {
  let sitingGain = 0;
  let stewardshipProxy = 0;
  let coexistenceSynergy = 0;
  for (const inst of V1014_NATURE_POSITIVE_SITING_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      sitingGain += inst.sitingMwEq;
      stewardshipProxy += inst.stewardshipReliefFactor;
      coexistenceSynergy += inst.coexistenceSynergyFactor;
    }
  }
  if (STEWARDSHIP_REGIONS.has(params.regionId)) stewardshipProxy += 0.05;
  else stewardshipProxy *= 0.74;
  if (params.landStewardshipRelief > 2.4) {
    sitingGain += clamp(params.landStewardshipRelief * 0.92, 0, 11);
    stewardshipProxy += 0.06;
  }
  if (params.agrivoltaicsLandRelief > 2.2) coexistenceSynergy += clamp(params.agrivoltaicsLandRelief * 0.016, 0, 0.08);
  if (params.blueCarbonCoastalRelief > 2.1) stewardshipProxy += clamp(params.blueCarbonCoastalRelief * 0.012, 0, 0.05);
  if (params.zeroCarbonPrecinctRelief > 2.5) sitingGain += clamp(params.zeroCarbonPrecinctRelief * 0.78, 0, 9);
  stewardshipProxy += clamp(params.renewableShareScore / 118, 0, 0.08);

  const prevIdx = params.prev?.sitingIndex ?? 0;
  const prevBal = params.prev?.regenerationBalance ?? 0;
  const regenerationBalance = clamp(prevBal * 0.85 + sitingGain * 0.11, 0, 210);
  const sitingIndex = clamp(
    prevIdx * 0.82 + regenerationBalance * 0.09 + stewardshipProxy * 78 + coexistenceSynergy * 24,
    0,
    158,
  );

  let band: V1014NaturePositiveSitingBand = 'legacy_siting';
  if (sitingIndex >= 100 || sitingGain >= 118) band = 'regeneration_aligned_leader';
  else if (sitingIndex >= 62 || sitingGain >= 68) band = 'co_design_corridor';
  else if (sitingIndex >= 26 || sitingGain >= 24) band = 'pilot_nature_positive';

  let naturePositiveSitingRelief = clamp(stewardshipProxy * 7.9 + sitingGain * 0.036 + coexistenceSynergy * 4.8, 0, 10.1);
  if (band === 'legacy_siting') naturePositiveSitingRelief *= 0.29;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      sitingIndex: clamp(sitingIndex, 0, 158),
      regenerationBalance: clamp(regenerationBalance, 0, 210),
      naturePositiveSitingRelief: clamp(naturePositiveSitingRelief, 0, 10.1),
      summary: `${params.regionId} nature siting ${band} · idx ${sitingIndex.toFixed(0)} · relief ${naturePositiveSitingRelief.toFixed(1)}`,
    },
    next: {
      regenerationBalance: clamp(regenerationBalance, 0, 210),
      sitingIndex: clamp(sitingIndex, 0, 158),
    },
  };
}

export function advanceRegionalBiodiversityCoexistenceOrchestration(params: {
  regionId: string;
  environmentalPressure: number;
  sitingBand: V1014NaturePositiveSitingBand;
  transmissionCongestionRelief: number;
  completedProjectTypes: string[];
  prev?: V1014BiodiversityCoexistencePersistedSlice | null;
}): { ledger: V1014RegionalBiodiversityCoexistenceLedger; next: V1014BiodiversityCoexistencePersistedSlice } {
  let coexistenceGain = 0;
  let landReliefProxy = 0;
  let sitingSynergy = 0;
  for (const tpl of V1014_BIODIVERSITY_COEXISTENCE_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      coexistenceGain += tpl.coexistenceScoreEq;
      landReliefProxy += tpl.landReliefFactor;
      sitingSynergy += tpl.sitingSynergyFactor;
    }
  }
  if (params.sitingBand === 'co_design_corridor' || params.sitingBand === 'regeneration_aligned_leader') {
    coexistenceGain += 14;
    sitingSynergy += 0.09;
  }
  if (params.transmissionCongestionRelief > 2.6) {
    coexistenceGain += params.transmissionCongestionRelief * 0.72;
    landReliefProxy += clamp(params.transmissionCongestionRelief * 0.008, 0, 0.04);
  }

  const pressureLoad = clamp(params.environmentalPressure * 0.22, 0, 11);
  const prevIdx = params.prev?.coexistenceIndex ?? 0;
  const coexistenceIndex = clamp(
    prevIdx * 0.83 + coexistenceGain * 0.1 + landReliefProxy * 29 - pressureLoad * 0.031 + sitingSynergy * 24,
    0,
    160,
  );

  let band: V1014BiodiversityCoexistenceBand = 'conflict_prone';
  if (coexistenceIndex >= 104 || coexistenceGain >= 122) band = 'net_gain_stewardship';
  else if (coexistenceIndex >= 66 || coexistenceGain >= 76) band = 'coexistence_hub';
  else if (coexistenceIndex >= 28 || coexistenceGain >= 26) band = 'mitigation_pilot';

  let biodiversityCoexistenceRelief = clamp(coexistenceIndex / 19 + landReliefProxy * 6.2 + sitingSynergy * 6.5, 0, 9.8);
  if (band === 'conflict_prone') biodiversityCoexistenceRelief = clamp(biodiversityCoexistenceRelief * 0.27, 0, 2.5);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      coexistenceIndex: clamp(coexistenceIndex, 0, 160),
      biodiversityCoexistenceRelief: clamp(biodiversityCoexistenceRelief, 0, 9.8),
      summary: `${params.regionId} coexistence ${band} · idx ${coexistenceIndex.toFixed(0)} · relief ${biodiversityCoexistenceRelief.toFixed(1)}`,
    },
    next: { coexistenceIndex: clamp(coexistenceIndex, 0, 160) },
  };
}

export const V1014_NATURE_COEXISTENCE_SCENARIOS = [
  {
    id: 'sc_nc_qld',
    label: 'QLD nature-positive REZ with offset stacking',
    regionId: 'QLD',
    landStewardshipRelief: 3.1,
    agrivoltaicsLandRelief: 2.8,
    blueCarbonCoastalRelief: 2.6,
    zeroCarbonPrecinctRelief: 2.9,
    renewableShareScore: 54,
    environmentalPressure: 42,
    transmissionCongestionRelief: 2.8,
    completedProjectTypes: [
      'nature_positive_rez_siting_master_plan',
      'dual_use_renewable_paddock_mesh',
      'biodiversity_offset_stacking_hub',
      'net_gain_monitoring_mesh',
    ],
    expectSitingBand: 'co_design_corridor' as V1014NaturePositiveSitingBand,
    expectMinSitingRelief: 2,
    expectCoexistenceBand: 'coexistence_hub' as V1014BiodiversityCoexistenceBand,
    expectMinCoexistenceRelief: 1.8,
  },
  {
    id: 'sc_nc_tas',
    label: 'TAS habitat buffer with species routing',
    regionId: 'TAS',
    landStewardshipRelief: 2.7,
    agrivoltaicsLandRelief: 2.4,
    blueCarbonCoastalRelief: 2.5,
    zeroCarbonPrecinctRelief: 2.3,
    renewableShareScore: 48,
    environmentalPressure: 38,
    transmissionCongestionRelief: 2.4,
    sitingBand: 'pilot_nature_positive' as V1014NaturePositiveSitingBand,
    completedProjectTypes: ['habitat_buffer_orchestration_layer', 'species_sensitive_routing_corridor'],
    expectCoexistenceBand: 'mitigation_pilot' as V1014BiodiversityCoexistenceBand,
    expectMinCoexistenceRelief: 1.4,
  },
] as const;

export function runAgent13NatureCoexistenceScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_NATURE_POSITIVE_SITING_CATALOG.length >= 4);
  ok(V1014_BIODIVERSITY_COEXISTENCE_CATALOG.length >= 4);

  const sc0 = V1014_NATURE_COEXISTENCE_SCENARIOS[0];
  const siting = computeRegionalNaturePositiveSitingLedger({
    regionId: sc0.regionId,
    landStewardshipRelief: sc0.landStewardshipRelief,
    agrivoltaicsLandRelief: sc0.agrivoltaicsLandRelief,
    blueCarbonCoastalRelief: sc0.blueCarbonCoastalRelief,
    zeroCarbonPrecinctRelief: sc0.zeroCarbonPrecinctRelief,
    renewableShareScore: sc0.renewableShareScore,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    siting.ledger.band === sc0.expectSitingBand ||
      siting.ledger.band === 'regeneration_aligned_leader' ||
      siting.ledger.naturePositiveSitingRelief >= sc0.expectMinSitingRelief,
  );

  const coexistence = advanceRegionalBiodiversityCoexistenceOrchestration({
    regionId: sc0.regionId,
    environmentalPressure: sc0.environmentalPressure,
    sitingBand: siting.ledger.band,
    transmissionCongestionRelief: sc0.transmissionCongestionRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    coexistence.ledger.band === sc0.expectCoexistenceBand ||
      coexistence.ledger.band === 'net_gain_stewardship' ||
      coexistence.ledger.biodiversityCoexistenceRelief >= sc0.expectMinCoexistenceRelief,
  );

  const sc1 = V1014_NATURE_COEXISTENCE_SCENARIOS[1];
  const coexistenceT = advanceRegionalBiodiversityCoexistenceOrchestration({
    regionId: sc1.regionId,
    environmentalPressure: sc1.environmentalPressure,
    sitingBand: sc1.sitingBand,
    transmissionCongestionRelief: sc1.transmissionCongestionRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(
    coexistenceT.ledger.biodiversityCoexistenceRelief >= sc1.expectMinCoexistenceRelief ||
      coexistenceT.ledger.band !== 'conflict_prone',
  );

  const persistA = computeRegionalNaturePositiveSitingLedger({
    regionId: 'NSW',
    landStewardshipRelief: 2.5,
    agrivoltaicsLandRelief: 2.3,
    blueCarbonCoastalRelief: 2.2,
    zeroCarbonPrecinctRelief: 2.4,
    renewableShareScore: 44,
    completedProjectTypes: ['regeneration_corridor_siting_loop'],
    prev: null,
  });
  const persistB = computeRegionalNaturePositiveSitingLedger({
    regionId: 'NSW',
    landStewardshipRelief: 2.5,
    agrivoltaicsLandRelief: 2.3,
    blueCarbonCoastalRelief: 2.2,
    zeroCarbonPrecinctRelief: 2.4,
    renewableShareScore: 44,
    completedProjectTypes: ['regeneration_corridor_siting_loop'],
    prev: persistA.next,
  });
  ok(persistB.next.sitingIndex >= persistA.next.sitingIndex * 0.7);

  const turnSc = runAgent13NatureCoexistenceTurnScenario(V1014_NATURE_COEXISTENCE_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastSitingRelief >= 2);

  const gi = scoreAgent13NatureCoexistenceGIAlignment({
    actionText: 'Nature-positive REZ siting with biodiversity offset stacking and net gain monitoring',
    sitingBand: 'co_design_corridor',
    coexistenceBand: 'coexistence_hub',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13NatureCoexistenceTurnStep {
  turn: number;
  regionId: string;
  landStewardshipRelief: number;
  agrivoltaicsLandRelief: number;
  blueCarbonCoastalRelief: number;
  zeroCarbonPrecinctRelief: number;
  renewableShareScore: number;
  environmentalPressure: number;
  transmissionCongestionRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13NatureCoexistenceTurnScenario {
  id: string;
  label: string;
  steps: Agent13NatureCoexistenceTurnStep[];
  expect: {
    minSitingReliefOnLast?: number;
    minCoexistenceReliefOnLast?: number;
    lastSitingBand?: V1014NaturePositiveSitingBand;
  };
}

export const V1014_NATURE_COEXISTENCE_TURN_SCENARIOS: readonly Agent13NatureCoexistenceTurnScenario[] = [
  {
    id: 'sc_nc_qld_escalation',
    label: 'QLD nature-positive siting with net gain stewardship',
    steps: [
      {
        turn: 1,
        regionId: 'QLD',
        landStewardshipRelief: 2.4,
        agrivoltaicsLandRelief: 2.2,
        blueCarbonCoastalRelief: 2.1,
        zeroCarbonPrecinctRelief: 2.3,
        renewableShareScore: 42,
        environmentalPressure: 48,
        transmissionCongestionRelief: 2.2,
        completedProjectTypes: ['regeneration_corridor_siting_loop', 'habitat_buffer_orchestration_layer'],
      },
      {
        turn: 2,
        regionId: 'QLD',
        landStewardshipRelief: 2.8,
        agrivoltaicsLandRelief: 2.6,
        blueCarbonCoastalRelief: 2.4,
        zeroCarbonPrecinctRelief: 2.7,
        renewableShareScore: 48,
        environmentalPressure: 44,
        transmissionCongestionRelief: 2.6,
        completedProjectTypes: ['dual_use_renewable_paddock_mesh', 'species_sensitive_routing_corridor'],
      },
      {
        turn: 3,
        regionId: 'QLD',
        landStewardshipRelief: 3.2,
        agrivoltaicsLandRelief: 2.9,
        blueCarbonCoastalRelief: 2.7,
        zeroCarbonPrecinctRelief: 3,
        renewableShareScore: 55,
        environmentalPressure: 40,
        transmissionCongestionRelief: 3,
        completedProjectTypes: [
          'regeneration_corridor_siting_loop',
          'dual_use_renewable_paddock_mesh',
          'habitat_buffer_orchestration_layer',
          'nature_positive_rez_siting_master_plan',
          'biodiversity_offset_stacking_hub',
          'species_sensitive_routing_corridor',
          'indigenous_stewardship_coexistence_tie',
          'net_gain_monitoring_mesh',
        ],
      },
    ],
    expect: { minSitingReliefOnLast: 2, minCoexistenceReliefOnLast: 1.8, lastSitingBand: 'co_design_corridor' },
  },
] as const;

export function runAgent13NatureCoexistenceTurnScenario(
  scenario: Agent13NatureCoexistenceTurnScenario,
): { passed: boolean; detail: string; lastSitingRelief: number; lastCoexistenceRelief: number } {
  let sitingMem: V1014NaturePositiveSitingPersistedSlice | null = null;
  let coexistenceMem: V1014BiodiversityCoexistencePersistedSlice | null = null;
  let lastSitingRelief = 0;
  let lastCoexistenceRelief = 0;
  let lastBand: V1014NaturePositiveSitingBand = 'legacy_siting';

  for (const step of scenario.steps) {
    const siting = computeRegionalNaturePositiveSitingLedger({
      regionId: step.regionId,
      landStewardshipRelief: step.landStewardshipRelief,
      agrivoltaicsLandRelief: step.agrivoltaicsLandRelief,
      blueCarbonCoastalRelief: step.blueCarbonCoastalRelief,
      zeroCarbonPrecinctRelief: step.zeroCarbonPrecinctRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: sitingMem,
    });
    sitingMem = siting.next;
    lastSitingRelief = siting.ledger.naturePositiveSitingRelief;
    lastBand = siting.ledger.band;

    const coexistence = advanceRegionalBiodiversityCoexistenceOrchestration({
      regionId: step.regionId,
      environmentalPressure: step.environmentalPressure,
      sitingBand: siting.ledger.band,
      transmissionCongestionRelief: step.transmissionCongestionRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: coexistenceMem,
    });
    coexistenceMem = coexistence.next;
    lastCoexistenceRelief = coexistence.ledger.biodiversityCoexistenceRelief;
  }

  if (scenario.expect.minSitingReliefOnLast != null && lastSitingRelief < scenario.expect.minSitingReliefOnLast) {
    return {
      passed: false,
      detail: `siting relief ${lastSitingRelief} < ${scenario.expect.minSitingReliefOnLast}`,
      lastSitingRelief,
      lastCoexistenceRelief,
    };
  }
  if (scenario.expect.minCoexistenceReliefOnLast != null && lastCoexistenceRelief < scenario.expect.minCoexistenceReliefOnLast) {
    return {
      passed: false,
      detail: `coexistence relief ${lastCoexistenceRelief} < ${scenario.expect.minCoexistenceReliefOnLast}`,
      lastSitingRelief,
      lastCoexistenceRelief,
    };
  }
  if (scenario.expect.lastSitingBand != null) {
    const allowed: V1014NaturePositiveSitingBand[] = [scenario.expect.lastSitingBand];
    if (scenario.expect.lastSitingBand === 'co_design_corridor') allowed.push('regeneration_aligned_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastSitingRelief, lastCoexistenceRelief };
    }
  }

  return { passed: true, detail: 'ok', lastSitingRelief, lastCoexistenceRelief };
}

export function scoreAgent13NatureCoexistenceGIAlignment(params: {
  actionText: string;
  sitingBand?: string;
  coexistenceBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'nature-positive',
    'nature positive',
    'biodiversity coexistence',
    'offset stacking',
    'net gain',
    'habitat buffer',
    'species-sensitive',
    'regeneration corridor',
    'dual-use renewable',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.24, 0, 2);
  if (params.sitingBand === 'regeneration_aligned_leader' || params.sitingBand === 'co_design_corridor') {
    delta += hits.some(h => h.includes('nature') || h.includes('regeneration') || h.includes('habitat')) ? 0.38 : 0.1;
  }
  if (params.coexistenceBand === 'coexistence_hub' || params.coexistenceBand === 'net_gain_stewardship') {
    delta += hits.some(h => h.includes('biodiversity') || h.includes('offset') || h.includes('net gain')) ? 0.35 : 0.09;
  }
  if (params.coexistenceBand === 'conflict_prone' && hits.some(h => h.includes('biodiversity'))) delta -= 0.1;
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Nature coexistence GI: ${hits.slice(0, 2).join(', ')} aligns with siting and biodiversity stewardship depth.`
        : null,
  };
}
