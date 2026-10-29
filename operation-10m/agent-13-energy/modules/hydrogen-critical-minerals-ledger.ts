/**
 * Agent 13 scale wave round 6 — green hydrogen export pathways & critical minerals supply security.
 * Cross-turn persistence for electrolyser build-out momentum and minerals processing resilience.
 */

export type V1014HydrogenExportBand = 'nascent' | 'pilot' | 'export_ready' | 'hub_leader';

export type V1014MineralsSecurityBand = 'exposed' | 'balanced' | 'secure' | 'strategic_reserve';

export interface V1014HydrogenPathwayInstrument {
  id: string;
  kind: 'electrolyser_hub' | 'ammonia_export' | 'pipeline_blend' | 'industrial_heat';
  label: string;
  mwEqPerTurn: number;
  gridReliefFactor: number;
  mineralsDemandFactor: number;
  projectTypeHint: string;
}

export const V1014_HYDROGEN_PATHWAY_CATALOG: readonly V1014HydrogenPathwayInstrument[] = [
  {
    id: 'h2_electrolyser',
    kind: 'electrolyser_hub',
    label: 'Regional electrolyser hub',
    mwEqPerTurn: 48,
    gridReliefFactor: 0.16,
    mineralsDemandFactor: 0.22,
    projectTypeHint: 'green_hydrogen_hub',
  },
  {
    id: 'h2_ammonia',
    kind: 'ammonia_export',
    label: 'Green ammonia export terminal',
    mwEqPerTurn: 62,
    gridReliefFactor: 0.11,
    mineralsDemandFactor: 0.18,
    projectTypeHint: 'ammonia_export_terminal',
  },
  {
    id: 'h2_blend',
    kind: 'pipeline_blend',
    label: 'Gas network hydrogen blend',
    mwEqPerTurn: 28,
    gridReliefFactor: 0.09,
    mineralsDemandFactor: 0.08,
    projectTypeHint: 'hydrogen_pipeline_blend',
  },
  {
    id: 'h2_heat',
    kind: 'industrial_heat',
    label: 'Industrial hydrogen heat cluster',
    mwEqPerTurn: 36,
    gridReliefFactor: 0.14,
    mineralsDemandFactor: 0.12,
    projectTypeHint: 'hydrogen_industrial_heat',
  },
] as const;

export interface V1014CriticalMineralsTemplate {
  id: string;
  kind: 'lithium_chain' | 'nickel_processing' | 'rare_earths' | 'copper_grid';
  label: string;
  securityUnitsPerTurn: number;
  supplyReliefFactor: number;
  hydrogenBoostFactor: number;
  projectTypeHint: string;
}

export const V1014_CRITICAL_MINERALS_CATALOG: readonly V1014CriticalMineralsTemplate[] = [
  {
    id: 'min_lithium',
    kind: 'lithium_chain',
    label: 'Lithium hydroxide chain',
    securityUnitsPerTurn: 14,
    supplyReliefFactor: 0.13,
    hydrogenBoostFactor: 0.1,
    projectTypeHint: 'lithium_processing',
  },
  {
    id: 'min_nickel',
    kind: 'nickel_processing',
    label: 'Nickel sulphide processing',
    securityUnitsPerTurn: 11,
    supplyReliefFactor: 0.11,
    hydrogenBoostFactor: 0.08,
    projectTypeHint: 'nickel_processing',
  },
  {
    id: 'min_ree',
    kind: 'rare_earths',
    label: 'Rare earth separation plant',
    securityUnitsPerTurn: 9,
    supplyReliefFactor: 0.15,
    hydrogenBoostFactor: 0.06,
    projectTypeHint: 'rare_earth_separation',
  },
  {
    id: 'min_copper',
    kind: 'copper_grid',
    label: 'Copper grid metals refinery',
    securityUnitsPerTurn: 12,
    supplyReliefFactor: 0.1,
    hydrogenBoostFactor: 0.07,
    projectTypeHint: 'copper_refinery',
  },
] as const;

export interface V1014RegionalHydrogenLedger {
  regionId: string;
  band: V1014HydrogenExportBand;
  exportIndex: number;
  electrolyserBalance: number;
  hydrogenGridRelief: number;
  summary: string;
}

export interface V1014RegionalMineralsLedger {
  regionId: string;
  band: V1014MineralsSecurityBand;
  securityIndex: number;
  mineralsSupplyRelief: number;
  summary: string;
}

export interface V1014HydrogenPersistedSlice {
  electrolyserBalance: number;
  exportIndex: number;
}

export interface V1014MineralsPersistedSlice {
  securityIndex: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

export function computeRegionalHydrogenLedger(params: {
  regionId: string;
  renewableShareScore: number;
  gridStressPoints: number;
  circularRecoveryRelief: number;
  completedProjectTypes: string[];
  prev?: V1014HydrogenPersistedSlice | null;
}): { ledger: V1014RegionalHydrogenLedger; next: V1014HydrogenPersistedSlice } {
  let mwGain = 0;
  let gridReliefProxy = 0;
  let mineralsLoad = 0;
  for (const inst of V1014_HYDROGEN_PATHWAY_CATALOG) {
    if (params.completedProjectTypes.includes(inst.projectTypeHint)) {
      mwGain += inst.mwEqPerTurn;
      gridReliefProxy += inst.gridReliefFactor;
      mineralsLoad += inst.mineralsDemandFactor;
    }
  }
  mwGain += clamp(params.renewableShareScore / 14, 0, 18);
  mwGain += clamp(params.circularRecoveryRelief * 2.2, 0, 14);
  gridReliefProxy += clamp(params.gridStressPoints > 14 ? 0.04 : 0, 0, 0.06);

  const prevBal = params.prev?.electrolyserBalance ?? mwGain * 0.32;
  const prevIdx = params.prev?.exportIndex ?? mwGain * 0.55;
  const exportIndex = clamp(prevIdx * 0.86 + mwGain * 0.14 - mineralsLoad * 8, 0, 150);
  const electrolyserBalance = clamp(prevBal * 0.88 + mwGain - mineralsLoad * 6, -20, 85);
  const readinessGap = exportIndex - electrolyserBalance;

  let band: V1014HydrogenExportBand = 'nascent';
  let hydrogenGridRelief = clamp(gridReliefProxy * 10 + mwGain * 0.08, 0, 12);
  if (readinessGap >= 38 || params.renewableShareScore < 12) {
    band = 'nascent';
    hydrogenGridRelief *= 0.35;
  } else if (readinessGap >= 18) {
    band = 'pilot';
    hydrogenGridRelief *= 0.65;
  } else if (exportIndex >= 72 && electrolyserBalance >= 28) {
    band = 'hub_leader';
    hydrogenGridRelief += 2.5;
  } else if (exportIndex >= 42) {
    band = 'export_ready';
    hydrogenGridRelief += 1.2;
  }

  return {
    ledger: {
      regionId: params.regionId,
      band,
      exportIndex: clamp(exportIndex, 0, 150),
      electrolyserBalance: clamp(electrolyserBalance, -20, 85),
      hydrogenGridRelief: clamp(hydrogenGridRelief, 0, 15),
      summary: `Hydrogen export ${band} in ${params.regionId} (export index ${exportIndex.toFixed(0)}, electrolyser ${electrolyserBalance.toFixed(0)}).`,
    },
    next: {
      electrolyserBalance: clamp(electrolyserBalance, -20, 85),
      exportIndex: clamp(exportIndex, 0, 150),
    },
  };
}

export function advanceRegionalMineralsSupply(params: {
  regionId: string;
  extractionScore: number;
  miningIndustryStrength: number;
  hydrogenBand: V1014HydrogenExportBand;
  completedProjectTypes: string[];
  prev?: V1014MineralsPersistedSlice | null;
}): { ledger: V1014RegionalMineralsLedger; next: V1014MineralsPersistedSlice } {
  let securityGain = 0;
  let hydrogenBoost = 0;
  for (const tpl of V1014_CRITICAL_MINERALS_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      securityGain += tpl.securityUnitsPerTurn;
      hydrogenBoost += tpl.hydrogenBoostFactor;
    }
  }
  securityGain += clamp(params.miningIndustryStrength / 12, 0, 10);
  if (params.hydrogenBand === 'hub_leader') securityGain += 8;
  if (params.hydrogenBand === 'nascent' && params.extractionScore > 70) securityGain -= 4;

  const demandLoad = clamp(params.extractionScore * 0.42 + params.miningIndustryStrength * 0.35, 0, 95);
  const prevIdx = params.prev?.securityIndex ?? securityGain * 0.5;
  const securityIndex = clamp(prevIdx * 0.87 + securityGain * 0.13 - demandLoad * 0.05 + hydrogenBoost * 12, 0, 140);
  const mineralsSupplyRelief = clamp(securityIndex / 24 + hydrogenBoost * 6, 0, 11);

  let band: V1014MineralsSecurityBand = 'exposed';
  if (securityIndex >= 88) band = 'strategic_reserve';
  else if (securityIndex >= 52) band = 'secure';
  else if (securityIndex >= 26) band = 'balanced';

  return {
    ledger: {
      regionId: params.regionId,
      band,
      securityIndex: clamp(securityIndex, 0, 140),
      mineralsSupplyRelief,
      summary: `Critical minerals ${band} in ${params.regionId} (security ${securityIndex.toFixed(0)}, relieves ${mineralsSupplyRelief.toFixed(1)} pressure).`,
    },
    next: { securityIndex: clamp(securityIndex, 0, 140) },
  };
}

export const V1014_HYDROGEN_MINERALS_SCENARIOS = [
  {
    id: 'sc_h2_hub_sa',
    label: 'SA hydrogen hub leader with electrolyser',
    regionId: 'SA',
    renewableShareScore: 62,
    gridStressPoints: 10,
    circularRecoveryRelief: 4,
    completedProjectTypes: ['green_hydrogen_hub', 'ammonia_export_terminal', 'hydrogen_industrial_heat'],
    expectBand: 'export_ready' as V1014HydrogenExportBand,
    expectMinRelief: 4,
  },
  {
    id: 'sc_min_secure_wa',
    label: 'WA balanced minerals with full processing chain',
    regionId: 'WA',
    extractionScore: 38,
    miningIndustryStrength: 72,
    hydrogenBand: 'hub_leader' as V1014HydrogenExportBand,
    completedProjectTypes: ['lithium_processing', 'nickel_processing', 'copper_refinery', 'rare_earth_separation'],
    expectBand: 'balanced' as V1014MineralsSecurityBand,
    expectMinRelief: 2.5,
  },
] as const;

export function runAgent13HydrogenMineralsScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_HYDROGEN_PATHWAY_CATALOG.length >= 4);
  ok(V1014_CRITICAL_MINERALS_CATALOG.length >= 4);

  const sc0 = V1014_HYDROGEN_MINERALS_SCENARIOS[0];
  const h2 = computeRegionalHydrogenLedger({
    regionId: sc0.regionId,
    renewableShareScore: sc0.renewableShareScore,
    gridStressPoints: sc0.gridStressPoints,
    circularRecoveryRelief: sc0.circularRecoveryRelief,
    completedProjectTypes: [...sc0.completedProjectTypes],
  });
  ok(
    (h2.ledger.band === sc0.expectBand || h2.ledger.band === 'hub_leader') &&
      h2.ledger.hydrogenGridRelief >= sc0.expectMinRelief,
  );

  const sc1 = V1014_HYDROGEN_MINERALS_SCENARIOS[1];
  const min = advanceRegionalMineralsSupply({
    regionId: sc1.regionId,
    extractionScore: sc1.extractionScore,
    miningIndustryStrength: sc1.miningIndustryStrength,
    hydrogenBand: sc1.hydrogenBand,
    completedProjectTypes: [...sc1.completedProjectTypes],
  });
  ok(min.ledger.band === sc1.expectBand || min.ledger.band === 'secure' || min.ledger.band === 'strategic_reserve');
  ok(min.ledger.mineralsSupplyRelief >= sc1.expectMinRelief);

  const nascent = computeRegionalHydrogenLedger({
    regionId: 'NT',
    renewableShareScore: 6,
    gridStressPoints: 22,
    circularRecoveryRelief: 0,
    completedProjectTypes: [],
    prev: null,
  });
  ok(nascent.ledger.band === 'nascent' && nascent.ledger.hydrogenGridRelief < 5);

  const persistA = advanceRegionalMineralsSupply({
    regionId: 'QLD',
    extractionScore: 40,
    miningIndustryStrength: 44,
    hydrogenBand: 'pilot',
    completedProjectTypes: ['lithium_processing'],
    prev: null,
  });
  const persistB = advanceRegionalMineralsSupply({
    regionId: 'QLD',
    extractionScore: 40,
    miningIndustryStrength: 44,
    hydrogenBand: 'pilot',
    completedProjectTypes: ['lithium_processing'],
    prev: persistA.next,
  });
  ok(persistB.next.securityIndex >= persistA.next.securityIndex * 0.82);

  return { passed, failed, total: passed + failed };
}
