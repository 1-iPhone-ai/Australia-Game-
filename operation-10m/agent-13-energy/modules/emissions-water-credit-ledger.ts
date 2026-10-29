/**
 * Agent 13 scale wave round 4 — regional emissions credit ledger & water allocation stress.
 * Cross-turn persistence for carbon balance drift and drought-cycle water caps.
 */

export type V1014CarbonCreditBand = 'surplus' | 'balanced' | 'deficit' | 'critical_deficit';

export type V1014WaterStressBand = 'secure' | 'tight' | 'stressed' | 'emergency';

export interface V1014EmissionsCreditInstrument {
  id: string;
  kind: 'renewable_offset' | 'efficiency_certificate' | 'land_rehab_credit' | 'grid_decarbonization';
  label: string;
  creditUnitsPerTurn: number;
  waterReliefFactor: number;
  emissionsReliefFactor: number;
  projectTypeHint: string;
}

export const V1014_EMISSIONS_CREDIT_CATALOG: readonly V1014EmissionsCreditInstrument[] = [
  {
    id: 'cred_renewable_offset',
    kind: 'renewable_offset',
    label: 'Renewable generation offset',
    creditUnitsPerTurn: 14,
    waterReliefFactor: 0.04,
    emissionsReliefFactor: 0.22,
    projectTypeHint: 'renewable_grid',
  },
  {
    id: 'cred_efficiency',
    kind: 'efficiency_certificate',
    label: 'Industrial efficiency certificate',
    creditUnitsPerTurn: 8,
    waterReliefFactor: 0.08,
    emissionsReliefFactor: 0.12,
    projectTypeHint: 'efficiency_retrofit',
  },
  {
    id: 'cred_rehab',
    kind: 'land_rehab_credit',
    label: 'Mine rehabilitation credit',
    creditUnitsPerTurn: 6,
    waterReliefFactor: 0.06,
    emissionsReliefFactor: 0.09,
    projectTypeHint: 'rehabilitation_program',
  },
  {
    id: 'cred_grid_decarb',
    kind: 'grid_decarbonization',
    label: 'Grid decarbonization bundle',
    creditUnitsPerTurn: 18,
    waterReliefFactor: 0.05,
    emissionsReliefFactor: 0.28,
    projectTypeHint: 'battery_grid',
  },
] as const;

export interface V1014RegionalEmissionsLedger {
  regionId: string;
  band: V1014CarbonCreditBand;
  netEmissionsIndex: number;
  creditBalance: number;
  pressureRelief: number;
  summary: string;
}

export interface V1014RegionalWaterLedger {
  regionId: string;
  band: V1014WaterStressBand;
  allocationUsed: number;
  allocationCap: number;
  pressureAdd: number;
  summary: string;
}

export interface V1014CarbonPersistedSlice {
  creditBalance: number;
  netEmissionsIndex: number;
}

export interface V1014WaterPersistedSlice {
  allocationUsed: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

export function computeRegionalEmissionsLedger(params: {
  regionId: string;
  extractionScore: number;
  renewableShareScore: number;
  siteEmissionsLoad: number;
  completedProjectTypes: string[];
  prev?: V1014CarbonPersistedSlice | null;
}): { ledger: V1014RegionalEmissionsLedger; next: V1014CarbonPersistedSlice } {
  let creditGain = 0;
  let waterReliefProxy = 0;
  for (const inst of V1014_EMISSIONS_CREDIT_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      creditGain += inst.creditUnitsPerTurn;
      waterReliefProxy += inst.waterReliefFactor;
    }
  }
  creditGain += clamp(params.renewableShareScore / 12, 0, 18);

  const emissionsLoad = clamp(
    params.extractionScore * 0.55 + params.siteEmissionsLoad * 8 + (100 - params.renewableShareScore) * 0.15,
    0,
    120,
  );
  const prevBal = params.prev?.creditBalance ?? creditGain * 0.4;
  const prevNet = params.prev?.netEmissionsIndex ?? emissionsLoad * 0.85;
  const netEmissionsIndex = clamp(prevNet * 0.9 + emissionsLoad * 0.1 - creditGain * 0.35, 0, 130);
  const creditBalance = clamp(prevBal * 0.88 + creditGain - emissionsLoad * 0.08, -40, 80);
  const deficit = netEmissionsIndex - creditBalance;

  let band: V1014CarbonCreditBand = 'balanced';
  let pressureRelief = clamp(creditGain * 0.15 + params.renewableShareScore / 25, 0, 10);
  if (deficit >= 45) {
    band = 'critical_deficit';
    pressureRelief = 0;
  } else if (deficit >= 22) {
    band = 'deficit';
    pressureRelief *= 0.35;
  } else if (creditBalance >= 25 && netEmissionsIndex < 35) {
    band = 'surplus';
    pressureRelief += 2 + waterReliefProxy * 4;
  }

  return {
    ledger: {
      regionId: params.regionId,
      band,
      netEmissionsIndex: clamp(netEmissionsIndex, 0, 130),
      creditBalance: clamp(creditBalance, -40, 80),
      pressureRelief: clamp(pressureRelief, 0, 14),
      summary: `Emissions ledger ${band} in ${params.regionId} (net ${netEmissionsIndex.toFixed(0)}, credits ${creditBalance.toFixed(0)}).`,
    },
    next: {
      creditBalance: clamp(creditBalance, -40, 80),
      netEmissionsIndex: clamp(netEmissionsIndex, 0, 130),
    },
  };
}

export function advanceRegionalWaterAllocation(params: {
  regionId: string;
  waterIntensityLoad: number;
  climateHazardPressure: number;
  extractionScore: number;
  emissionsBand: V1014CarbonCreditBand;
  prev?: V1014WaterPersistedSlice | null;
}): { ledger: V1014RegionalWaterLedger; next: V1014WaterPersistedSlice } {
  const cap = clamp(55 - params.climateHazardPressure * 0.35 + (params.emissionsBand === 'surplus' ? 8 : 0), 25, 90);
  const demand = clamp(params.waterIntensityLoad * 12 + params.extractionScore * 0.42, 0, cap * 1.25);
  const prevUsed = params.prev?.allocationUsed ?? cap * 0.42;
  const allocationUsed = clamp(prevUsed * 0.91 + demand * 0.09, 0, cap * 1.2);
  const ratio = allocationUsed / cap;

  let band: V1014WaterStressBand = 'secure';
  let pressureAdd = 0;
  if (ratio >= 1.08) {
    band = 'emergency';
    pressureAdd = clamp((ratio - 1) * 22, 4, 18);
  } else if (ratio >= 0.92) {
    band = 'stressed';
    pressureAdd = clamp((ratio - 0.92) * 14, 1, 10);
  } else if (ratio >= 0.75) {
    band = 'tight';
    pressureAdd = clamp((ratio - 0.75) * 6, 0, 5);
  }

  if (params.emissionsBand === 'critical_deficit') {
    pressureAdd += 2;
    if (band === 'secure') band = 'tight';
  }

  return {
    ledger: {
      regionId: params.regionId,
      band,
      allocationUsed: clamp(allocationUsed, 0, cap * 1.2),
      allocationCap: cap,
      pressureAdd,
      summary: `Water allocation ${band} in ${params.regionId} (${allocationUsed.toFixed(0)}/${cap.toFixed(0)} used).`,
    },
    next: { allocationUsed: clamp(allocationUsed, 0, cap * 1.2) },
  };
}

export const V1014_EMISSIONS_WATER_SCENARIOS = [
  {
    id: 'sc_emissions_surplus_sa',
    label: 'SA renewable surplus credits',
    regionId: 'SA',
    extractionScore: 28,
    renewableShareScore: 72,
    siteEmissionsLoad: 2,
    completedProjectTypes: ['renewable_grid', 'battery_grid', 'efficiency_retrofit'],
    expectBand: 'surplus' as V1014CarbonCreditBand,
    expectMinRelief: 4,
  },
  {
    id: 'sc_water_emergency_wa',
    label: 'WA drought emergency allocation',
    regionId: 'WA',
    waterIntensityLoad: 6.5,
    climateHazardPressure: 28,
    extractionScore: 82,
    emissionsBand: 'deficit' as V1014CarbonCreditBand,
    prevUsed: 78,
    expectBand: 'emergency' as V1014WaterStressBand,
  },
] as const;

export function runAgent13EmissionsWaterScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_EMISSIONS_CREDIT_CATALOG.length >= 4);

  const sc0 = V1014_EMISSIONS_WATER_SCENARIOS[0];
  const em = computeRegionalEmissionsLedger({
    regionId: sc0.regionId,
    extractionScore: sc0.extractionScore,
    renewableShareScore: sc0.renewableShareScore,
    siteEmissionsLoad: sc0.siteEmissionsLoad,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(em.ledger.band === sc0.expectBand && em.ledger.pressureRelief >= sc0.expectMinRelief);

  const sc1 = V1014_EMISSIONS_WATER_SCENARIOS[1];
  const water = advanceRegionalWaterAllocation({
    regionId: sc1.regionId,
    waterIntensityLoad: sc1.waterIntensityLoad,
    climateHazardPressure: sc1.climateHazardPressure,
    extractionScore: sc1.extractionScore,
    emissionsBand: sc1.emissionsBand,
    prev: { allocationUsed: sc1.prevUsed },
  });
  ok(water.ledger.band === sc1.expectBand && water.ledger.pressureAdd >= 4);

  const deficit = computeRegionalEmissionsLedger({
    regionId: 'WA',
    extractionScore: 88,
    renewableShareScore: 8,
    siteEmissionsLoad: 9,
    completedProjectTypes: [],
    prev: { creditBalance: -5, netEmissionsIndex: 95 },
  });
  ok(deficit.ledger.band === 'critical_deficit' || deficit.ledger.band === 'deficit');

  const persistA = computeRegionalEmissionsLedger({
    regionId: 'QLD',
    extractionScore: 50,
    renewableShareScore: 40,
    siteEmissionsLoad: 4,
    completedProjectTypes: ['renewable_grid'],
    prev: null,
  });
  const persistB = computeRegionalEmissionsLedger({
    regionId: 'QLD',
    extractionScore: 50,
    renewableShareScore: 40,
    siteEmissionsLoad: 4,
    completedProjectTypes: ['renewable_grid'],
    prev: persistA.next,
  });
  ok(Math.abs(persistB.next.netEmissionsIndex - persistA.next.netEmissionsIndex) < 25);

  const waterSecure = advanceRegionalWaterAllocation({
    regionId: 'TAS',
    waterIntensityLoad: 0.8,
    climateHazardPressure: 2,
    extractionScore: 20,
    emissionsBand: 'surplus',
    prev: null,
  });
  ok(waterSecure.ledger.band === 'secure' && waterSecure.ledger.pressureAdd === 0);

  return { passed, failed, total: passed + failed };
}
