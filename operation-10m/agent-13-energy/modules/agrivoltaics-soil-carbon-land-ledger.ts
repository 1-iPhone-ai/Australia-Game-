/**
 * Agent 13 scale wave round 11 — agrivoltaics dual-use land & soil-carbon stewardship nexus.
 * Cross-turn persistence for farm-solar co-location momentum and land-based carbon relief on the grid margin.
 */

export type V1014AgrivoltaicsBand = 'pasture_only' | 'pilot_co_location' | 'dual_use_farm' | 'agri_solar_leader';

export type V1014SoilCarbonLandBand = 'depleted' | 'recovering' | 'stewardship_active' | 'carbon_rich_corridor';

export interface V1014AgrivoltaicsInstrument {
  id: string;
  kind: 'sheep_grazing_solar' | 'horticulture_canopy' | 'broadacre_tracking' | 'indigenous_land_partnership';
  label: string;
  mwEqPerTurn: number;
  landReliefFactor: number;
  soilSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_AGRIVOLTAICS_CATALOG: readonly V1014AgrivoltaicsInstrument[] = [
  {
    id: 'agri_sheep',
    kind: 'sheep_grazing_solar',
    label: 'Sheep-grazing solar paddock',
    mwEqPerTurn: 38,
    landReliefFactor: 0.14,
    soilSynergyFactor: 0.1,
    projectTypeHint: 'sheep_grazing_solar_paddock',
  },
  {
    id: 'agri_hort',
    kind: 'horticulture_canopy',
    label: 'Horticulture canopy solar',
    mwEqPerTurn: 32,
    landReliefFactor: 0.12,
    soilSynergyFactor: 0.11,
    projectTypeHint: 'horticulture_canopy_solar',
  },
  {
    id: 'agri_broadacre',
    kind: 'broadacre_tracking',
    label: 'Broadacre tracking agrivoltaics',
    mwEqPerTurn: 44,
    landReliefFactor: 0.16,
    soilSynergyFactor: 0.09,
    projectTypeHint: 'broadacre_agrivoltaics',
  },
  {
    id: 'agri_partnership',
    kind: 'indigenous_land_partnership',
    label: 'Indigenous land partnership solar',
    mwEqPerTurn: 36,
    landReliefFactor: 0.15,
    soilSynergyFactor: 0.13,
    projectTypeHint: 'indigenous_land_solar_partnership',
  },
] as const;

export interface V1014SoilCarbonLandTemplate {
  id: string;
  kind: 'regenerative_pasture' | 'cover_crop_rotation' | 'biochar_amendment' | 'rangeland_restoration';
  label: string;
  carbonMwEq: number;
  landStewardshipFactor: number;
  agriSynergyFactor: number;
  projectTypeHint: string;
}

export const V1014_SOIL_CARBON_LAND_CATALOG: readonly V1014SoilCarbonLandTemplate[] = [
  {
    id: 'soil_regen',
    kind: 'regenerative_pasture',
    label: 'Regenerative pasture carbon program',
    carbonMwEq: 40,
    landStewardshipFactor: 0.15,
    agriSynergyFactor: 0.1,
    projectTypeHint: 'regenerative_pasture_carbon',
  },
  {
    id: 'soil_cover',
    kind: 'cover_crop_rotation',
    label: 'Cover-crop rotation stewardship',
    carbonMwEq: 34,
    landStewardshipFactor: 0.13,
    agriSynergyFactor: 0.11,
    projectTypeHint: 'cover_crop_rotation_stewardship',
  },
  {
    id: 'soil_biochar',
    kind: 'biochar_amendment',
    label: 'Biochar soil amendment corridor',
    carbonMwEq: 46,
    landStewardshipFactor: 0.17,
    agriSynergyFactor: 0.08,
    projectTypeHint: 'biochar_soil_amendment',
  },
  {
    id: 'soil_rangeland',
    kind: 'rangeland_restoration',
    label: 'Rangeland restoration carbon sink',
    carbonMwEq: 42,
    landStewardshipFactor: 0.16,
    agriSynergyFactor: 0.12,
    projectTypeHint: 'rangeland_restoration_carbon',
  },
] as const;

export interface V1014RegionalAgrivoltaicsLedger {
  regionId: string;
  band: V1014AgrivoltaicsBand;
  dualUseIndex: number;
  paddockBalance: number;
  agrivoltaicsLandRelief: number;
  summary: string;
}

export interface V1014RegionalSoilCarbonLandLedger {
  regionId: string;
  band: V1014SoilCarbonLandBand;
  stewardshipIndex: number;
  soilCarbonLandRelief: number;
  summary: string;
}

export interface V1014AgrivoltaicsPersistedSlice {
  paddockBalance: number;
  dualUseIndex: number;
}

export interface V1014SoilCarbonPersistedSlice {
  stewardshipIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

const RURAL_AGRI_REGIONS = new Set(['NSW', 'QLD', 'VIC', 'SA', 'WA', 'TAS', 'NT']);

export function computeRegionalAgrivoltaicsLedger(params: {
  regionId: string;
  renewableShareScore: number;
  landStewardshipRelief: number;
  circularRecoveryRelief: number;
  evV2gGridRelief: number;
  completedProjectTypes: string[];
  prev?: V1014AgrivoltaicsPersistedSlice | null;
}): { ledger: V1014RegionalAgrivoltaicsLedger; next: V1014AgrivoltaicsPersistedSlice } {
  let mwGain = 0;
  let landProxy = 0;
  let soilSynergy = 0;
  for (const inst of V1014_AGRIVOLTAICS_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      mwGain += inst.mwEqPerTurn;
      landProxy += inst.landReliefFactor;
      soilSynergy += inst.soilSynergyFactor;
    }
  }
  landProxy += clamp(params.renewableShareScore / 108, 0, 0.12);
  if (RURAL_AGRI_REGIONS.has(params.regionId)) landProxy += 0.05;
  else landProxy *= 0.68;

  const prevIdx = params.prev?.dualUseIndex ?? 0;
  const prevPaddock = params.prev?.paddockBalance ?? 0;
  const paddockBalance = clamp(prevPaddock * 0.91 + mwGain * 0.1, 0, 205);
  const dualUseIndex = clamp(
    prevIdx * 0.87 + paddockBalance * 0.13 + landProxy * 84 + soilSynergy * 24,
    0,
    146,
  );

  let band: V1014AgrivoltaicsBand = 'pasture_only';
  if (dualUseIndex >= 93 || mwGain >= 110) band = 'agri_solar_leader';
  else if (dualUseIndex >= 58 || mwGain >= 64) band = 'dual_use_farm';
  else if (dualUseIndex >= 24 || mwGain >= 22) band = 'pilot_co_location';

  let agrivoltaicsLandRelief = clamp(landProxy * 9.2 + mwGain * 0.052 + soilSynergy * 5, 0, 12);
  if (params.landStewardshipRelief > 3) agrivoltaicsLandRelief += clamp(params.landStewardshipRelief * 0.09, 0, 1.8);
  if (params.circularRecoveryRelief > 2) agrivoltaicsLandRelief += clamp(params.circularRecoveryRelief * 0.07, 0, 1.4);
  if (params.evV2gGridRelief > 4) agrivoltaicsLandRelief += clamp(params.evV2gGridRelief * 0.06, 0, 1.2);
  if (band === 'pasture_only') agrivoltaicsLandRelief *= 0.42;

  return {
    ledger: {
      regionId: params.regionId,
      band,
      dualUseIndex: clamp(dualUseIndex, 0, 146),
      paddockBalance: clamp(paddockBalance, 0, 205),
      agrivoltaicsLandRelief: clamp(agrivoltaicsLandRelief, 0, 13),
      summary: `${params.regionId} agrivoltaics ${band} · dual-use idx ${dualUseIndex.toFixed(0)} · relief ${agrivoltaicsLandRelief.toFixed(1)}`,
    },
    next: { paddockBalance, dualUseIndex: clamp(dualUseIndex, 0, 146) },
  };
}

export function advanceRegionalSoilCarbonLand(params: {
  regionId: string;
  extractionScore: number;
  waterStressPressure: number;
  agrivoltaicsBand: V1014AgrivoltaicsBand;
  completedProjectTypes: string[];
  prev?: V1014SoilCarbonPersistedSlice | null;
}): { ledger: V1014RegionalSoilCarbonLandLedger; next: V1014SoilCarbonPersistedSlice } {
  let carbonGain = 0;
  let stewardshipProxy = 0;
  let agriSynergy = 0;
  for (const tpl of V1014_SOIL_CARBON_LAND_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      carbonGain += tpl.carbonMwEq;
      stewardshipProxy += tpl.landStewardshipFactor;
      agriSynergy += tpl.agriSynergyFactor;
    }
  }
  if (params.agrivoltaicsBand === 'dual_use_farm' || params.agrivoltaicsBand === 'agri_solar_leader') {
    carbonGain += 12;
    agriSynergy += 0.08;
  }
  if (params.extractionScore > 45) {
    carbonGain += clamp((params.extractionScore - 45) * 0.35, 0, 14);
    stewardshipProxy += 0.04;
  }

  const waterLoad = clamp(params.waterStressPressure * 0.08, 0, 12);
  const prevIdx = params.prev?.stewardshipIndex ?? 0;
  const stewardshipIndex = clamp(
    prevIdx * 0.89 + carbonGain * 0.11 + stewardshipProxy * 37 - waterLoad * 0.05 + agriSynergy * 27,
    0,
    150,
  );

  let band: V1014SoilCarbonLandBand = 'depleted';
  if (stewardshipIndex >= 94 || carbonGain >= 112) band = 'carbon_rich_corridor';
  else if (stewardshipIndex >= 56 || carbonGain >= 66) band = 'stewardship_active';
  else if (stewardshipIndex >= 22 || carbonGain >= 20) band = 'recovering';

  const soilCarbonLandRelief = clamp(stewardshipIndex / 24 + stewardshipProxy * 7.2 + agriSynergy * 8, 0, 11);
  if (band === 'depleted') {
    return {
      ledger: {
        regionId: params.regionId,
        band,
        stewardshipIndex: clamp(stewardshipIndex, 0, 150),
        soilCarbonLandRelief: clamp(soilCarbonLandRelief * 0.35, 0, 3.5),
        summary: `${params.regionId} soil carbon depleted · idx ${stewardshipIndex.toFixed(0)}`,
      },
      next: { stewardshipIndex: clamp(stewardshipIndex, 0, 150) },
    };
  }

  return {
    ledger: {
      regionId: params.regionId,
      band,
      stewardshipIndex: clamp(stewardshipIndex, 0, 150),
      soilCarbonLandRelief: clamp(soilCarbonLandRelief, 0, 11),
      summary: `${params.regionId} soil carbon ${band} · stewardship idx ${stewardshipIndex.toFixed(0)} · relief ${soilCarbonLandRelief.toFixed(1)}`,
    },
    next: { stewardshipIndex: clamp(stewardshipIndex, 0, 150) },
  };
}

export const V1014_AGRI_SOIL_SCENARIOS = [
  {
    id: 'sc_agri_sa',
    label: 'SA broadacre agrivoltaics with regenerative pasture',
    regionId: 'SA',
    renewableShareScore: 54,
    landStewardshipRelief: 5,
    circularRecoveryRelief: 3,
    evV2gGridRelief: 4,
    extractionScore: 38,
    waterStressPressure: 14,
    completedProjectTypes: [
      'broadacre_agrivoltaics',
      'sheep_grazing_solar_paddock',
      'regenerative_pasture_carbon',
      'cover_crop_rotation_stewardship',
    ],
    expectAgriBand: 'dual_use_farm' as V1014AgrivoltaicsBand,
    expectMinAgriRelief: 3,
    expectSoilBand: 'stewardship_active' as V1014SoilCarbonLandBand,
    expectMinSoilRelief: 2,
  },
  {
    id: 'sc_soil_qld',
    label: 'QLD rangeland restoration with horticulture canopy',
    regionId: 'QLD',
    renewableShareScore: 42,
    landStewardshipRelief: 3,
    circularRecoveryRelief: 2,
    evV2gGridRelief: 2,
    extractionScore: 52,
    waterStressPressure: 18,
    agrivoltaicsBand: 'pilot_co_location' as V1014AgrivoltaicsBand,
    completedProjectTypes: ['horticulture_canopy_solar', 'rangeland_restoration_carbon', 'biochar_soil_amendment'],
    expectSoilBand: 'recovering' as V1014SoilCarbonLandBand,
    expectMinSoilRelief: 2,
  },
] as const;

export function runAgent13AgriSoilScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_AGRIVOLTAICS_CATALOG.length >= 4);
  ok(V1014_SOIL_CARBON_LAND_CATALOG.length >= 4);

  const sc0 = V1014_AGRI_SOIL_SCENARIOS[0];
  const agri = computeRegionalAgrivoltaicsLedger({
    regionId: sc0.regionId,
    renewableShareScore: sc0.renewableShareScore,
    landStewardshipRelief: sc0.landStewardshipRelief,
    circularRecoveryRelief: sc0.circularRecoveryRelief,
    evV2gGridRelief: sc0.evV2gGridRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    agri.ledger.band === sc0.expectAgriBand ||
      agri.ledger.band === 'agri_solar_leader' ||
      agri.ledger.agrivoltaicsLandRelief >= sc0.expectMinAgriRelief,
  );

  const soil = advanceRegionalSoilCarbonLand({
    regionId: sc0.regionId,
    extractionScore: sc0.extractionScore,
    waterStressPressure: sc0.waterStressPressure,
    agrivoltaicsBand: agri.ledger.band,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    soil.ledger.band === sc0.expectSoilBand ||
      soil.ledger.band === 'carbon_rich_corridor' ||
      soil.ledger.soilCarbonLandRelief >= sc0.expectMinSoilRelief,
  );

  const sc1 = V1014_AGRI_SOIL_SCENARIOS[1];
  const soilQ = advanceRegionalSoilCarbonLand({
    regionId: sc1.regionId,
    extractionScore: sc1.extractionScore,
    waterStressPressure: sc1.waterStressPressure,
    agrivoltaicsBand: sc1.agrivoltaicsBand,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(soilQ.ledger.soilCarbonLandRelief >= sc1.expectMinSoilRelief || soilQ.ledger.band !== 'depleted');

  const persistA = computeRegionalAgrivoltaicsLedger({
    regionId: 'NSW',
    renewableShareScore: 48,
    landStewardshipRelief: 4,
    circularRecoveryRelief: 2,
    evV2gGridRelief: 3,
    completedProjectTypes: ['sheep_grazing_solar_paddock'],
    prev: null,
  });
  const persistB = computeRegionalAgrivoltaicsLedger({
    regionId: 'NSW',
    renewableShareScore: 48,
    landStewardshipRelief: 4,
    circularRecoveryRelief: 2,
    evV2gGridRelief: 3,
    completedProjectTypes: ['sheep_grazing_solar_paddock'],
    prev: persistA.next,
  });
  ok(persistB.next.dualUseIndex >= persistA.next.dualUseIndex * 0.82);

  const turnSc = runAgent13AgriSoilTurnScenario(V1014_AGRI_SOIL_TURN_SCENARIOS[0]);
  ok(turnSc.passed && turnSc.lastAgriRelief >= 3);

  const gi = scoreAgent13AgriSoilGIAlignment({
    actionText: 'Broadacre agrivoltaics with regenerative pasture soil carbon stewardship',
    agriBand: 'dual_use_farm',
    soilBand: 'stewardship_active',
  });
  ok(gi.relevanceDelta > 1 && !!gi.reason);

  return { passed, failed, total: passed + failed };
}

export interface Agent13AgriSoilTurnStep {
  turn: number;
  regionId: string;
  renewableShareScore: number;
  landStewardshipRelief: number;
  circularRecoveryRelief: number;
  evV2gGridRelief: number;
  extractionScore: number;
  waterStressPressure: number;
  completedProjectTypes: string[];
}

export interface Agent13AgriSoilTurnScenario {
  id: string;
  label: string;
  steps: Agent13AgriSoilTurnStep[];
  expect: {
    minAgriReliefOnLast?: number;
    minSoilReliefOnLast?: number;
    lastAgriBand?: V1014AgrivoltaicsBand;
  };
}

export const V1014_AGRI_SOIL_TURN_SCENARIOS: readonly Agent13AgriSoilTurnScenario[] = [
  {
    id: 'sc_agri_soil_sa',
    label: 'SA agrivoltaics expansion with soil carbon corridor across turns',
    steps: [
      {
        turn: 1,
        regionId: 'SA',
        renewableShareScore: 44,
        landStewardshipRelief: 3.5,
        circularRecoveryRelief: 2,
        evV2gGridRelief: 3,
        extractionScore: 42,
        waterStressPressure: 16,
        completedProjectTypes: ['sheep_grazing_solar_paddock', 'regenerative_pasture_carbon'],
      },
      {
        turn: 2,
        regionId: 'SA',
        renewableShareScore: 50,
        landStewardshipRelief: 4.5,
        circularRecoveryRelief: 2.5,
        evV2gGridRelief: 3.5,
        extractionScore: 40,
        waterStressPressure: 15,
        completedProjectTypes: ['sheep_grazing_solar_paddock', 'broadacre_agrivoltaics', 'cover_crop_rotation_stewardship'],
      },
      {
        turn: 3,
        regionId: 'SA',
        renewableShareScore: 56,
        landStewardshipRelief: 5.5,
        circularRecoveryRelief: 3.5,
        evV2gGridRelief: 4.5,
        extractionScore: 36,
        waterStressPressure: 13,
        completedProjectTypes: [
          'sheep_grazing_solar_paddock',
          'broadacre_agrivoltaics',
          'indigenous_land_solar_partnership',
          'regenerative_pasture_carbon',
          'cover_crop_rotation_stewardship',
          'biochar_soil_amendment',
        ],
      },
    ],
    expect: { minAgriReliefOnLast: 3, minSoilReliefOnLast: 2, lastAgriBand: 'dual_use_farm' },
  },
] as const;

export function runAgent13AgriSoilTurnScenario(
  scenario: Agent13AgriSoilTurnScenario,
): { passed: boolean; detail: string; lastAgriRelief: number; lastSoilRelief: number } {
  let agriMem: V1014AgrivoltaicsPersistedSlice | null = null;
  let soilMem: V1014SoilCarbonPersistedSlice | null = null;
  let lastAgriRelief = 0;
  let lastSoilRelief = 0;
  let lastBand: V1014AgrivoltaicsBand = 'pasture_only';

  for (const step of scenario.steps) {
    const agri = computeRegionalAgrivoltaicsLedger({
      regionId: step.regionId,
      renewableShareScore: step.renewableShareScore,
      landStewardshipRelief: step.landStewardshipRelief,
      circularRecoveryRelief: step.circularRecoveryRelief,
      evV2gGridRelief: step.evV2gGridRelief,
      completedProjectTypes: step.completedProjectTypes,
      prev: agriMem,
    });
    agriMem = agri.next;
    lastAgriRelief = agri.ledger.agrivoltaicsLandRelief;
    lastBand = agri.ledger.band;

    const soil = advanceRegionalSoilCarbonLand({
      regionId: step.regionId,
      extractionScore: step.extractionScore,
      waterStressPressure: step.waterStressPressure,
      agrivoltaicsBand: agri.ledger.band,
      completedProjectTypes: step.completedProjectTypes,
      prev: soilMem,
    });
    soilMem = soil.next;
    lastSoilRelief = soil.ledger.soilCarbonLandRelief;
  }

  if (scenario.expect.minAgriReliefOnLast != null && lastAgriRelief < scenario.expect.minAgriReliefOnLast) {
    return {
      passed: false,
      detail: `agri relief ${lastAgriRelief} < ${scenario.expect.minAgriReliefOnLast}`,
      lastAgriRelief,
      lastSoilRelief,
    };
  }
  if (scenario.expect.minSoilReliefOnLast != null && lastSoilRelief < scenario.expect.minSoilReliefOnLast) {
    return {
      passed: false,
      detail: `soil relief ${lastSoilRelief} < ${scenario.expect.minSoilReliefOnLast}`,
      lastAgriRelief,
      lastSoilRelief,
    };
  }
  if (scenario.expect.lastAgriBand != null) {
    const allowed: V1014AgrivoltaicsBand[] = [scenario.expect.lastAgriBand];
    if (scenario.expect.lastAgriBand === 'dual_use_farm') allowed.push('agri_solar_leader');
    if (!allowed.includes(lastBand)) {
      return { passed: false, detail: `band ${lastBand} not allowed`, lastAgriRelief, lastSoilRelief };
    }
  }

  return { passed: true, detail: 'ok', lastAgriRelief, lastSoilRelief };
}

export function scoreAgent13AgriSoilGIAlignment(params: {
  actionText: string;
  agriBand?: string;
  soilBand?: string;
}): { relevanceDelta: number; reason: string | null } {
  const text = params.actionText.toLowerCase();
  const hits = ['agrivoltaics', 'dual-use', 'farm solar', 'soil carbon', 'regenerative', 'pasture', 'rangeland', 'biochar'].filter(
    k => text.includes(k),
  );
  if (!hits.length) return { relevanceDelta: 0, reason: null };
  let delta = clamp(hits.length * 0.35, 0, 2);
  if (params.agriBand === 'agri_solar_leader' || params.agriBand === 'dual_use_farm') {
    delta += hits.some(h => h.includes('agri') || h.includes('farm') || h.includes('dual')) ? 0.5 : 0.17;
  }
  if (params.soilBand === 'carbon_rich_corridor' || params.soilBand === 'stewardship_active') {
    delta += hits.some(h => h.includes('soil') || h.includes('carbon') || h.includes('regenerative')) ? 0.48 : 0.16;
  }
  if (params.soilBand === 'depleted' && hits.some(h => h.includes('carbon'))) {
    delta -= 0.22;
  }
  delta = clamp(delta, -1, 2.5);
  return {
    relevanceDelta: delta,
    reason:
      delta > 0.25
        ? `Agri/soil GI: ${hits.slice(0, 2).join(', ')} aligns with dual-use land energy and carbon stewardship.`
        : null,
  };
}
