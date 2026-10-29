/**
 * Agent 13 scale wave round 5 — biodiversity land-offset ledger & circular waste recovery.
 * Cross-turn persistence for stewardship credit drift and industrial symbiosis recovery.
 */

export type V1014BiodiversityStewardshipBand = 'intact' | 'managed' | 'degraded' | 'critical_loss';

export type V1014CircularRecoveryBand = 'nascent' | 'emerging' | 'material' | 'leading';

export interface V1014BiodiversityOffsetInstrument {
  id: string;
  kind: 'rehabilitation_reserve' | 'koala_corridor' | 'wetland_buffer' | 'indigenous_care_country';
  label: string;
  stewardshipUnitsPerTurn: number;
  pressureReliefFactor: number;
  circularBoostFactor: number;
  projectTypeHint: string;
}

export const V1014_BIODIVERSITY_OFFSET_CATALOG: readonly V1014BiodiversityOffsetInstrument[] = [
  {
    id: 'bio_rehab_reserve',
    kind: 'rehabilitation_reserve',
    label: 'Mine rehabilitation reserve',
    stewardshipUnitsPerTurn: 11,
    pressureReliefFactor: 0.18,
    circularBoostFactor: 0.12,
    projectTypeHint: 'rehabilitation_program',
  },
  {
    id: 'bio_koala_corridor',
    kind: 'koala_corridor',
    label: 'Koala habitat corridor',
    stewardshipUnitsPerTurn: 9,
    pressureReliefFactor: 0.14,
    circularBoostFactor: 0.06,
    projectTypeHint: 'habitat_corridor',
  },
  {
    id: 'bio_wetland',
    kind: 'wetland_buffer',
    label: 'Wetland buffer restoration',
    stewardshipUnitsPerTurn: 8,
    pressureReliefFactor: 0.16,
    circularBoostFactor: 0.1,
    projectTypeHint: 'wetland_restoration',
  },
  {
    id: 'bio_care_country',
    kind: 'indigenous_care_country',
    label: 'Indigenous care-for-country partnership',
    stewardshipUnitsPerTurn: 13,
    pressureReliefFactor: 0.22,
    circularBoostFactor: 0.08,
    projectTypeHint: 'care_country_partnership',
  },
] as const;

export interface V1014CircularRecoveryTemplate {
  id: string;
  kind: 'tailings_reuse' | 'waste_to_energy' | 'industrial_symbiosis' | 'water_recycling_loop';
  label: string;
  recoveryMwEq: number;
  emissionsReliefProxy: number;
  projectTypeHint: string;
}

export const V1014_CIRCULAR_RECOVERY_CATALOG: readonly V1014CircularRecoveryTemplate[] = [
  {
    id: 'circ_tailings',
    kind: 'tailings_reuse',
    label: 'Tailings reprocessing loop',
    recoveryMwEq: 42,
    emissionsReliefProxy: 0.11,
    projectTypeHint: 'tailings_reprocessing',
  },
  {
    id: 'circ_wte',
    kind: 'waste_to_energy',
    label: 'Municipal waste-to-energy',
    recoveryMwEq: 55,
    emissionsReliefProxy: 0.09,
    projectTypeHint: 'waste_to_energy',
  },
  {
    id: 'circ_symbiosis',
    kind: 'industrial_symbiosis',
    label: 'Industrial symbiosis hub',
    recoveryMwEq: 38,
    emissionsReliefProxy: 0.14,
    projectTypeHint: 'industrial_symbiosis',
  },
  {
    id: 'circ_water_loop',
    kind: 'water_recycling_loop',
    label: 'Closed-loop water recycling',
    recoveryMwEq: 28,
    emissionsReliefProxy: 0.07,
    projectTypeHint: 'water_recycling',
  },
] as const;

export interface V1014RegionalBiodiversityLedger {
  regionId: string;
  band: V1014BiodiversityStewardshipBand;
  stewardshipIndex: number;
  offsetBalance: number;
  landStewardshipRelief: number;
  summary: string;
}

export interface V1014RegionalCircularLedger {
  regionId: string;
  band: V1014CircularRecoveryBand;
  recoveryIndex: number;
  circularRelief: number;
  summary: string;
}

export interface V1014BiodiversityPersistedSlice {
  offsetBalance: number;
  stewardshipIndex: number;
}

export interface V1014CircularPersistedSlice {
  recoveryIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

export function computeRegionalBiodiversityLedger(params: {
  regionId: string;
  extractionScore: number;
  highRiskSiteCount: number;
  waterStressPressure: number;
  emissionsPressureRelief: number;
  completedProjectTypes: string[];
  prev?: V1014BiodiversityPersistedSlice | null;
}): { ledger: V1014RegionalBiodiversityLedger; next: V1014BiodiversityPersistedSlice } {
  let offsetGain = 0;
  let circularBoost = 0;
  for (const inst of V1014_BIODIVERSITY_OFFSET_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      offsetGain += inst.stewardshipUnitsPerTurn;
      circularBoost += inst.circularBoostFactor;
    }
  }
  offsetGain += clamp(params.emissionsPressureRelief * 0.35, 0, 8);

  const habitatLoad = clamp(
    params.extractionScore * 0.48 +
      params.highRiskSiteCount * 9 +
      params.waterStressPressure * 0.55 -
      offsetGain * 0.4,
    0,
    120,
  );
  const prevBal = params.prev?.offsetBalance ?? offsetGain * 0.35;
  const prevStew = params.prev?.stewardshipIndex ?? habitatLoad * 0.8;
  const stewardshipIndex = clamp(prevStew * 0.88 + habitatLoad * 0.12 - offsetGain * 0.25, 0, 130);
  const offsetBalance = clamp(prevBal * 0.9 + offsetGain - habitatLoad * 0.06, -30, 75);
  const deficit = stewardshipIndex - offsetBalance;

  let band: V1014BiodiversityStewardshipBand = 'managed';
  let landStewardshipRelief = clamp(offsetGain * 0.12 + circularBoost * 6, 0, 11);
  if (deficit >= 42 || params.highRiskSiteCount >= 4) {
    band = 'critical_loss';
    landStewardshipRelief = 0;
  } else if (deficit >= 20) {
    band = 'degraded';
    landStewardshipRelief *= 0.4;
  } else if (offsetBalance >= 22 && stewardshipIndex < 38) {
    band = 'intact';
    landStewardshipRelief += 2.5;
  }

  return {
    ledger: {
      regionId: params.regionId,
      band,
      stewardshipIndex: clamp(stewardshipIndex, 0, 130),
      offsetBalance: clamp(offsetBalance, -30, 75),
      landStewardshipRelief: clamp(landStewardshipRelief, 0, 14),
      summary: `Biodiversity stewardship ${band} in ${params.regionId} (stewardship ${stewardshipIndex.toFixed(0)}, offsets ${offsetBalance.toFixed(0)}).`,
    },
    next: {
      offsetBalance: clamp(offsetBalance, -30, 75),
      stewardshipIndex: clamp(stewardshipIndex, 0, 130),
    },
  };
}

export function advanceRegionalCircularRecovery(params: {
  regionId: string;
  extractionScore: number;
  renewableShareScore: number;
  biodiversityBand: V1014BiodiversityStewardshipBand;
  completedProjectTypes: string[];
  prev?: V1014CircularPersistedSlice | null;
}): { ledger: V1014RegionalCircularLedger; next: V1014CircularPersistedSlice } {
  let recoveryMw = 0;
  let emissionsProxy = 0;
  for (const tpl of V1014_CIRCULAR_RECOVERY_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      recoveryMw += tpl.recoveryMwEq;
      emissionsProxy += tpl.emissionsReliefProxy;
    }
  }
  recoveryMw += clamp(params.renewableShareScore / 18, 0, 22);
  if (params.biodiversityBand === 'intact') recoveryMw += 12;
  if (params.biodiversityBand === 'critical_loss') recoveryMw *= 0.55;

  const prevIdx = params.prev?.recoveryIndex ?? recoveryMw * 0.45;
  const recoveryIndex = clamp(prevIdx * 0.87 + recoveryMw * 0.13, 0, 160);
  const circularRelief = clamp(recoveryIndex / 22 + emissionsProxy * 8, 0, 12);

  let band: V1014CircularRecoveryBand = 'nascent';
  if (recoveryIndex >= 95) band = 'leading';
  else if (recoveryIndex >= 58) band = 'material';
  else if (recoveryIndex >= 28) band = 'emerging';

  return {
    ledger: {
      regionId: params.regionId,
      band,
      recoveryIndex: clamp(recoveryIndex, 0, 160),
      circularRelief,
      summary: `Circular recovery ${band} in ${params.regionId} (index ${recoveryIndex.toFixed(0)}, relieves ${circularRelief.toFixed(1)} pressure).`,
    },
    next: { recoveryIndex: clamp(recoveryIndex, 0, 160) },
  };
}

export const V1014_BIODIVERSITY_CIRCULAR_SCENARIOS = [
  {
    id: 'sc_bio_intact_tas',
    label: 'TAS intact stewardship with care country',
    regionId: 'TAS',
    extractionScore: 22,
    highRiskSiteCount: 0,
    waterStressPressure: 2,
    emissionsPressureRelief: 6,
    completedProjectTypes: ['care_country_partnership', 'wetland_restoration', 'rehabilitation_program'],
    expectBand: 'intact' as V1014BiodiversityStewardshipBand,
    expectMinRelief: 3,
  },
  {
    id: 'sc_circ_leading_sa',
    label: 'SA leading circular symbiosis',
    regionId: 'SA',
    extractionScore: 35,
    renewableShareScore: 68,
    biodiversityBand: 'intact' as V1014BiodiversityStewardshipBand,
    completedProjectTypes: ['industrial_symbiosis', 'waste_to_energy', 'water_recycling', 'tailings_reprocessing'],
    expectBand: 'material' as V1014CircularRecoveryBand,
    expectMinRelief: 4,
  },
] as const;

export function runAgent13BiodiversityCircularScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_BIODIVERSITY_OFFSET_CATALOG.length >= 4);
  ok(V1014_CIRCULAR_RECOVERY_CATALOG.length >= 4);

  const sc0 = V1014_BIODIVERSITY_CIRCULAR_SCENARIOS[0];
  const bio = computeRegionalBiodiversityLedger({
    regionId: sc0.regionId,
    extractionScore: sc0.extractionScore,
    highRiskSiteCount: sc0.highRiskSiteCount,
    waterStressPressure: sc0.waterStressPressure,
    emissionsPressureRelief: sc0.emissionsPressureRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(bio.ledger.band === sc0.expectBand && bio.ledger.landStewardshipRelief >= sc0.expectMinRelief);

  const sc1 = V1014_BIODIVERSITY_CIRCULAR_SCENARIOS[1];
  const circ = advanceRegionalCircularRecovery({
    regionId: sc1.regionId,
    extractionScore: sc1.extractionScore,
    renewableShareScore: sc1.renewableShareScore,
    biodiversityBand: sc1.biodiversityBand,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(circ.ledger.band === sc1.expectBand && circ.ledger.circularRelief >= sc1.expectMinRelief);

  const critical = computeRegionalBiodiversityLedger({
    regionId: 'WA',
    extractionScore: 90,
    highRiskSiteCount: 5,
    waterStressPressure: 18,
    emissionsPressureRelief: 0,
    completedProjectTypes: [],
    prev: { offsetBalance: -8, stewardshipIndex: 88 },
  });
  ok(critical.ledger.band === 'critical_loss' || critical.ledger.band === 'degraded');

  const persistA = advanceRegionalCircularRecovery({
    regionId: 'QLD',
    extractionScore: 48,
    renewableShareScore: 42,
    biodiversityBand: 'managed',
    completedProjectTypes: ['waste_to_energy'],
    prev: null,
  });
  const persistB = advanceRegionalCircularRecovery({
    regionId: 'QLD',
    extractionScore: 48,
    renewableShareScore: 42,
    biodiversityBand: 'managed',
    completedProjectTypes: ['waste_to_energy'],
    prev: persistA.next,
  });
  ok(persistB.next.recoveryIndex >= persistA.next.recoveryIndex * 0.85);

  const nascent = advanceRegionalCircularRecovery({
    regionId: 'NT',
    extractionScore: 70,
    renewableShareScore: 8,
    biodiversityBand: 'critical_loss',
    completedProjectTypes: [],
    prev: null,
  });
  ok(nascent.ledger.band === 'nascent' && nascent.ledger.circularRelief < 4);

  return { passed, failed, total: passed + failed };
}
