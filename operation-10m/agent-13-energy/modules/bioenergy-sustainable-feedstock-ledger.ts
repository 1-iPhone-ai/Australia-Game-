/**
 * Agent 13 scale wave round 16 — certified sustainable bioenergy feedstock & dispatchable biomass grid flex.
 * Cross-turn persistence for residue/stubble build-out and firming relief coupled to water–energy nexus maturity.
 */

export type V1014SustainableFeedstockBand = 'uncertified' | 'pilot_residue' | 'certified_sustainable' | 'circular_bioenergy_leader';

export type V1014BioenergyGridFlexBand = 'thermal_only' | 'hybrid_firming' | 'dispatchable_bio' | 'negative_emissions_path';

export interface V1014SustainableFeedstockInstrument {
  id: string;
  kind: 'forest_residue' | 'crop_stubble' | 'organic_waste_digestate' | 'drought_tolerant_biomass';
  label: string;
  feedstockMwEq: number;
  stewardshipReliefFactor: number;
  flexSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_SUSTAINABLE_FEEDSTOCK_CATALOG: readonly V1014SustainableFeedstockInstrument[] = [
  {
    id: 'bio_forest',
    kind: 'forest_residue',
    label: 'Certified forest residue hub',
    feedstockMwEq: 38,
    stewardshipReliefFactor: 0.15,
    flexSynergyFactor: 0.1,
    projectTypeHint: 'certified_forest_residue_hub',
  },
  {
    id: 'bio_stubble',
    kind: 'crop_stubble',
    label: 'Agricultural stubble brushings program',
    feedstockMwEq: 34,
    stewardshipReliefFactor: 0.14,
    flexSynergyFactor: 0.11,
    projectTypeHint: 'agricultural_stubble_brushings',
  },
  {
    id: 'bio_organic',
    kind: 'organic_waste_digestate',
    label: 'Organic waste digester feedstock loop',
    feedstockMwEq: 36,
    stewardshipReliefFactor: 0.13,
    flexSynergyFactor: 0.09,
    projectTypeHint: 'organic_waste_digester_feed',
  },
  {
    id: 'bio_drought_crop',
    kind: 'drought_tolerant_biomass',
    label: 'Drought-tolerant biomass crop corridor',
    feedstockMwEq: 40,
    stewardshipReliefFactor: 0.16,
    flexSynergyFactor: 0.12,
    projectTypeHint: 'drought_tolerant_biomass_crop',
  },
] as const;

export interface V1014BioenergyGridFlexTemplate {
  id: string;
  kind: 'biomass_peaker' | 'agricultural_chp' | 'beccs_co_benefit' | 'forest_thinning_biochar';
  label: string;
  firmingMwEq: number;
  gridReliefFactor: number;
  feedstockSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_BIOENERGY_GRID_FLEX_CATALOG: readonly V1014BioenergyGridFlexTemplate[] = [
  {
    id: 'flex_peaker',
    kind: 'biomass_peaker',
    label: 'Biomass dispatchable peaker',
    firmingMwEq: 44,
    gridReliefFactor: 0.16,
    feedstockSynergyFactor: 0.1,
    projectTypeHint: 'biomass_dispatchable_peaker',
  },
  {
    id: 'flex_chp',
    kind: 'agricultural_chp',
    label: 'Agricultural CHP orchestration',
    firmingMwEq: 38,
    gridReliefFactor: 0.14,
    feedstockSynergyFactor: 0.12,
    projectTypeHint: 'agricultural_chp_orchestration',
  },
  {
    id: 'flex_beccs',
    kind: 'beccs_co_benefit',
    label: 'BECCS co-benefit train',
    firmingMwEq: 46,
    gridReliefFactor: 0.15,
    feedstockSynergyFactor: 0.11,
    projectTypeHint: 'beccs_co_benefit_train',
  },
  {
    id: 'flex_biochar',
    kind: 'forest_thinning_biochar',
    label: 'Forest thinning biochar loop',
    firmingMwEq: 32,
    gridReliefFactor: 0.13,
    feedstockSynergyFactor: 0.09,
    projectTypeHint: 'forest_thinning_biochar_loop',
  },
] as const;

export interface V1014RegionalSustainableFeedstockLedger {
  regionId: string;
  band: V1014SustainableFeedstockBand;
  feedstockIndex: number;
  stewardshipBalance: number;
  sustainableFeedstockRelief: number;
  summary: string;
}

export interface V1014RegionalBioenergyGridFlexLedger {
  regionId: string;
  band: V1014BioenergyGridFlexBand;
  firmingIndex: number;
  bioenergyGridFlexRelief: number;
  summary: string;
}

export interface V1014FeedstockPersistedSlice {
  stewardshipBalance: number;
  feedstockIndex: number;
}

export interface V1014BioFlexPersistedSlice {
  firmingIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const BIOENERGY_REGIONS = new Set(['TAS', 'NSW', 'VIC', 'QLD', 'SA', 'WA']);

export function computeRegionalSustainableFeedstockLedger(params: {
  regionId: string;
  soilCarbonLandRelief: number;
  waterEnergyNexusRelief: number;
  renewableShareScore: number;
  completedProjectTypes: string[];
  prev?: V1014FeedstockPersistedSlice | null;
}): { ledger: V1014RegionalSustainableFeedstockLedger; next: V1014FeedstockPersistedSlice } {
  let feedGain = 0;
  let stewardshipProxy = 0;
  let flexSynergy = 0;
  for (const inst of V1014_SUSTAINABLE_FEEDSTOCK_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      feedGain += inst.feedstockMwEq;
      stewardshipProxy += inst.stewardshipReliefFactor;
      flexSynergy += inst.flexSynergyFactor;
    }
  }
  if (BIOENERGY_REGIONS.has(params.regionId)) stewardshipProxy += 0.05;
  else stewardshipProxy *= 0.7;
  if (params.soilCarbonLandRelief > 3) {
    feedGain += clamp(params.soilCarbonLandRelief * 1.1, 0, 12);
    stewardshipProxy += 0.06;
  }
  if (params.waterEnergyNexusRelief > 2.5) flexSynergy += clamp(params.waterEnergyNexusRelief * 0.025, 0, 0.12);
  stewardshipProxy += clamp(params.renewableShareScore / 118, 0, 0.1);

  const prevIdx = params.prev?.feedstockIndex ?? 0;
  const prevBal = params.prev?.stewardshipBalance ?? 0;
  const stewardshipBalance = clamp(prevBal * 0.9 + feedGain * 0.11, 0, 205);
  const feedstockIndex = clamp(
    prevIdx * 0.87 + stewardshipBalance * 0.11 + stewardshipProxy * 82 + flexSynergy * 24,
    0,
    148,
  );

  let band: V1014SustainableFeedstockBand = 'uncertified';
  if (feedstockIndex >= 94 || feedGain >= 112) band = 'circular_bioenergy_leader';
  else if (feedstockIndex >= 56 || feedGain >= 64) band = 'certified_sustainable';
  else if (feedstockIndex >= 22 || feedGain >= 20) band = 'pilot_residue';

  let sustainableFeedstockRelief = clamp(stewardshipProxy * 8.8 + feedGain * 0.048 + flexSynergy * 5.2, 0, 11);
  if (band === 'uncertified') sustainableFeedstockRelief *= 0.4;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      feedstockIndex: clamp(feedstockIndex, 0, 148),
      stewardshipBalance: clamp(stewardshipBalance, 0, 205),
      sustainableFeedstockRelief: clamp(sustainableFeedstockRelief, 0, 11),
      summary: `${params.regionId} feedstock ${band} · idx ${feedstockIndex.toFixed(0)} · relief ${sustainableFeedstockRelief.toFixed(1)}`,
    },
    next: { stewardshipBalance: clamp(stewardshipBalance, 0, 205), feedstockIndex: clamp(feedstockIndex, 0, 148) },
  };
}

export function advanceRegionalBioenergyGridFlex(params: {
  regionId: string;
  gridStressPoints: number;
  feedstockBand: V1014SustainableFeedstockBand;
  droughtDesalRelief: number;
  completedProjectTypes: string[];
  prev?: V1014BioFlexPersistedSlice | null;
}): { ledger: V1014RegionalBioenergyGridFlexLedger; next: V1014BioFlexPersistedSlice } {
  let firmGain = 0;
  let reliefProxy = 0;
  let feedSynergy = 0;
  for (const tpl of V1014_BIOENERGY_GRID_FLEX_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      firmGain += tpl.firmingMwEq;
      reliefProxy += tpl.gridReliefFactor;
      feedSynergy += tpl.feedstockSynergyFactor;
    }
  }
  if (params.feedstockBand === 'certified_sustainable' || params.feedstockBand === 'circular_bioenergy_leader') {
    firmGain += 12;
    feedSynergy += 0.08;
  }
  if (params.droughtDesalRelief > 3) {
    firmGain += params.droughtDesalRelief * 0.95;
    reliefProxy += clamp(params.droughtDesalRelief * 0.011, 0, 0.08);
  }

  const stressLoad = clamp(params.gridStressPoints * 0.34, 0, 12);
  const prevIdx = params.prev?.firmingIndex ?? 0;
  const firmingIndex = clamp(prevIdx * 0.88 + firmGain * 0.11 + reliefProxy * 34 - stressLoad * 0.04 + feedSynergy * 26, 0, 150);

  let band: V1014BioenergyGridFlexBand = 'thermal_only';
  if (firmingIndex >= 98 || firmGain >= 116) band = 'negative_emissions_path';
  else if (firmingIndex >= 60 || firmGain >= 70) band = 'dispatchable_bio';
  else if (firmingIndex >= 26 || firmGain >= 24) band = 'hybrid_firming';

  let bioenergyGridFlexRelief = clamp(firmingIndex / 22 + reliefProxy * 6.8 + feedSynergy * 7.4, 0, 10);
  if (band === 'thermal_only') bioenergyGridFlexRelief = clamp(bioenergyGridFlexRelief * 0.38, 0, 3.2);

  return {
    ledger: {
      regionId: params.regionId,
      band,
      firmingIndex: clamp(firmingIndex, 0, 150),
      bioenergyGridFlexRelief: clamp(bioenergyGridFlexRelief, 0, 10),
      summary: `${params.regionId} bio flex ${band} · firm idx ${firmingIndex.toFixed(0)} · relief ${bioenergyGridFlexRelief.toFixed(1)}`,
    },
    next: { firmingIndex: clamp(firmingIndex, 0, 150) },
  };
}

export const V1014_BIOENERGY_FEEDSTOCK_SCENARIOS = [
  {
    id: 'sc_bio_tas',
    label: 'TAS forest residue with biochar flex',
    regionId: 'TAS',
    soilCarbonLandRelief: 4,
    waterEnergyNexusRelief: 3,
    renewableShareScore: 52,
    gridStressPoints: 16,
    droughtDesalRelief: 3,
    completedProjectTypes: [
      'certified_forest_residue_hub',
      'forest_thinning_biochar_loop',
      'biomass_dispatchable_peaker',
    ],
    expectFeedBand: 'certified_sustainable' as V1014SustainableFeedstockBand,
    expectMinFeedRelief: 3,
    expectFlexBand: 'hybrid_firming' as V1014BioenergyGridFlexBand,
    expectMinFlexRelief: 2,
  },
  {
    id: 'sc_bio_nsw',
    label: 'NSW stubble CHP with drought biomass',
    regionId: 'NSW',
    soilCarbonLandRelief: 3.5,
    waterEnergyNexusRelief: 2.8,
    renewableShareScore: 48,
    gridStressPoints: 18,
    droughtDesalRelief: 2.5,
    feedstockBand: 'pilot_residue' as V1014SustainableFeedstockBand,
    completedProjectTypes: ['agricultural_stubble_brushings', 'agricultural_chp_orchestration', 'drought_tolerant_biomass_crop'],
    expectFlexBand: 'hybrid_firming' as V1014BioenergyGridFlexBand,
    expectMinFlexRelief: 2,
  },
] as const;

export function runAgent13BioenergyFeedstockScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_SUSTAINABLE_FEEDSTOCK_CATALOG.length >= 4);
  ok(V1014_BIOENERGY_GRID_FLEX_CATALOG.length >= 4);

  const sc0 = V1014_BIOENERGY_FEEDSTOCK_SCENARIOS[0];
  const feed = computeRegionalSustainableFeedstockLedger({
    regionId: sc0.regionId,
    soilCarbonLandRelief: sc0.soilCarbonLandRelief,
    waterEnergyNexusRelief: sc0.waterEnergyNexusRelief,
    renewableShareScore: sc0.renewableShareScore,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    feed.ledger.band === sc0.expectFeedBand ||
      feed.ledger.band === 'circular_bioenergy_leader' ||
      feed.ledger.sustainableFeedstockRelief >= sc0.expectMinFeedRelief,
  );

  const flex = advanceRegionalBioenergyGridFlex({
    regionId: sc0.regionId,
    gridStressPoints: sc0.gridStressPoints,
    feedstockBand: feed.ledger.band,
    droughtDesalRelief: sc0.droughtDesalRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    flex.ledger.band === sc0.expectFlexBand ||
      flex.ledger.band === 'dispatchable_bio' ||
      flex.ledger.bioenergyGridFlexRelief >= sc0.expectMinFlexRelief,
  );

  const sc1 = V1014_BIOENERGY_FEEDSTOCK_SCENARIOS[1];
  const flexN = advanceRegionalBioenergyGridFlex({
    regionId: sc1.regionId,
    gridStressPoints: sc1.gridStressPoints,
    feedstockBand: sc1.feedstockBand,
    droughtDesalRelief: sc1.droughtDesalRelief,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(flexN.ledger.bioenergyGridFlexRelief >= sc1.expectMinFlexRelief || flexN.ledger.band !== 'thermal_only');

  const persistA = computeRegionalSustainableFeedstockLedger({
    regionId: 'QLD',
    soilCarbonLandRelief: 3,
    waterEnergyNexusRelief: 2.5,
    renewableShareScore: 44,
    completedProjectTypes: ['certified_forest_residue_hub'],
    prev: null,
  });
  const persistB = computeRegionalSustainableFeedstockLedger({
    regionId: 'QLD',
    soilCarbonLandRelief: 3,
    waterEnergyNexusRelief: 2.5,
    renewableShareScore: 44,
    completedProjectTypes: ['certified_forest_residue_hub'],
    prev: persistA.next,
  });
  ok(persistB.next.feedstockIndex >= persistA.next.feedstockIndex * 0.82);

  const turnSc = runAgent13BioenergyFeedstockTurnScenario(V1014_BIOENERGY_FEEDSTOCK_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastFeedRelief >= 3);

  const gi = scoreAgent13BioenergyFeedstockGIAlignment({
    actionText: 'Certified forest residue with biomass peaker and agricultural CHP',
    feedstockBand: 'certified_sustainable',
    flexBand: 'dispatchable_bio',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13BioenergyFeedstockTurnStep {
  turn: number;
  regionId: string;
  soilCarbonLandRelief: number;
  waterEnergyNexusRelief: number;
  renewableShareScore: number;
  gridStressPoints: number;
  droughtDesalRelief: number;
  completedProjectTypes: string[];
}

export interface Agent13BioenergyFeedstockTurnScenario {
  id: string;
  label: string;
  steps: Agent13BioenergyFeedstockTurnStep[];
  expect: {
    minFeedReliefOnLast?: number;
    minFlexReliefOnLast?: number;
    lastFeedBand?: V1014SustainableFeedstockBand;
  };
}

export const V1014_BIOENERGY_FEEDSTOCK_TURN_SCENARIOS: readonly Agent13BioenergyFeedstockTurnScenario[] = [
  {
    id: 'sc_bio_tas_escalation',
    label: 'TAS residue build-out with dispatchable bio flex',
    steps: [
      {
        turn: 1,
        regionId: 'TAS',
        soilCarbonLandRelief: 3,
        waterEnergyNexusRelief: 2.5,
        renewableShareScore: 46,
        gridStressPoints: 18,
        droughtDesalRelief: 2.5,
        completedProjectTypes: ['certified_forest_residue_hub', 'organic_waste_digester_feed'],
      },
      {
        turn: 2,
        regionId: 'TAS',
        soilCarbonLandRelief: 3.5,
        waterEnergyNexusRelief: 3,
        renewableShareScore: 50,
        gridStressPoints: 17,
        droughtDesalRelief: 3,
        completedProjectTypes: ['certified_forest_residue_hub', 'biomass_dispatchable_peaker', 'forest_thinning_biochar_loop'],
      },
      {
        turn: 3,
        regionId: 'TAS',
        soilCarbonLandRelief: 4.5,
        waterEnergyNexusRelief: 3.5,
        renewableShareScore: 58,
        gridStressPoints: 15,
        droughtDesalRelief: 3.5,
        completedProjectTypes: [
          'certified_forest_residue_hub',
          'agricultural_stubble_brushings',
          'organic_waste_digester_feed',
          'drought_tolerant_biomass_crop',
          'biomass_dispatchable_peaker',
          'agricultural_chp_orchestration',
          'beccs_co_benefit_train',
          'forest_thinning_biochar_loop',
        ],
      },
    ],
    expect: { minFeedReliefOnLast: 3, minFlexReliefOnLast: 2, lastFeedBand: 'certified_sustainable' },
  },
] as const;

export function runAgent13BioenergyFeedstockTurnScenario(
  scenario: Agent13BioenergyFeedstockTurnScenario,
): { passed: boolean; detail: string; lastFeedRelief: number; lastFlexRelief: number } {
  let feedMem: V1014FeedstockPersistedSlice | null = null;
  let flexMem: V1014BioFlexPersistedSlice | null = null;
  let lastFeedRelief = 0;
  let lastFlexRelief = 0;
  let lastBand: V1014SustainableFeedstockBand = 'uncertified';

  for (const step of scenario.steps) {
    const feed = computeRegionalSustainableFeedstockLedger({
      regionId: step.regionId,
      soilCarbonLandRelief: step.soilCarbonLandRelief,
      waterEnergyNexusRelief: step.waterEnergyNexusRelief,
      renewableShareScore: step.renewableShareScore,
      completedProjectTypes: step.completedProjectTypes,
      prev: feedMem,
    });
    feedMem = feed.next;
    lastFeedRelief = feed.ledger.sustainableFeedstockRelief;
    lastBand = feed.ledger.band;

    const flex = advanceRegionalBioenergyGridFlex({
      regionId: step.regionId,
      gridStressPoints: step.gridStressPoints,
      feedstockBand: feed.ledger.band,
      droughtDesalRelief: step.droughtDesalRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: flexMem,
    });
    flexMem = flex.next;
    lastFlexRelief = flex.ledger.bioenergyGridFlexRelief;
  }

  if (scenario.expect.minFeedReliefOnLast != null && lastFeedRelief < scenario.expect.minFeedReliefOnLast) {
    return {
      passed: false,
      detail: `feed relief ${lastFeedRelief} < ${scenario.expect.minFeedReliefOnLast}`,
      lastFeedRelief,
      lastFlexRelief,
    };
  }
  if (scenario.expect.minFlexReliefOnLast != null && lastFlexRelief < scenario.expect.minFlexReliefOnLast) {
    return {
      passed: false,
      detail: `flex relief ${lastFlexRelief} < ${scenario.expect.minFlexReliefOnLast}`,
      lastFeedRelief,
      lastFlexRelief,
    };
  }
  if (scenario.expect.lastFeedBand != null) {
    const allowed: V1014SustainableFeedstockBand[] = [scenario.expect.lastFeedBand];
    if (scenario.expect.lastFeedBand === 'certified_sustainable') allowed.push('circular_bioenergy_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastFeedRelief, lastFlexRelief };
    }
  }

  return { passed: true, detail: 'ok', lastFeedRelief, lastFlexRelief };
}

export function scoreAgent13BioenergyFeedstockGIAlignment(params: {
  actionText: string;
  feedstockBand?: string;
  flexBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = [
    'bioenergy',
    'biomass',
    'forest residue',
    'stubble',
    'beccs',
    'biochar',
    'agricultural chp',
    'digestate',
  ].filter(k => text.includes(k));
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.34, 0, 2);
  if (params.feedstockBand === 'circular_bioenergy_leader' || params.feedstockBand === 'certified_sustainable') {
    delta += hits.some(h => h.includes('forest') || h.includes('biomass') || h.includes('stubble')) ? 0.5 : 0.18;
  }
  if (params.flexBand === 'dispatchable_bio' || params.flexBand === 'negative_emissions_path') {
    delta += hits.some(h => h.includes('beccs') || h.includes('chp') || h.includes('bioenergy')) ? 0.44 : 0.14;
  }
  if (params.flexBand === 'thermal_only' && hits.some(h => h.includes('beccs'))) delta -= 0.18;
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Bioenergy GI: ${hits.slice(0, 2).join(', ')} aligns with certified feedstock and biomass firming.`
        : null,
  };
}
