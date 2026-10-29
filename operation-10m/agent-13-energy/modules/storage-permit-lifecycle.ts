/**
 * Agent 13 scale wave round 3 — storage flexibility dispatch & environmental permit lifecycle.
 */

export type V1014StorageFlexibilityBand = 'minimal' | 'moderate' | 'strong' | 'surplus';

export interface V1014StorageAssetTemplate {
  id: string;
  kind: 'battery_grid' | 'pumped_hydro' | 'virtual_power_plant' | 'gas_peaker_backup';
  label: string;
  dischargeMw: number;
  durationHours: number;
  gridStressReliefFactor: number;
  projectTypeHint: string;
}

export const V1014_STORAGE_FLEXIBILITY_CATALOG: readonly V1014StorageAssetTemplate[] = [
  { id: 'st_battery', kind: 'battery_grid', label: 'Grid-scale battery', dischargeMw: 120, durationHours: 2, gridStressReliefFactor: 0.18, projectTypeHint: 'battery_grid' },
  { id: 'st_pumped', kind: 'pumped_hydro', label: 'Pumped hydro storage', dischargeMw: 250, durationHours: 8, gridStressReliefFactor: 0.22, projectTypeHint: 'pumped_hydro' },
  { id: 'st_vpp', kind: 'virtual_power_plant', label: 'Virtual power plant', dischargeMw: 80, durationHours: 1.5, gridStressReliefFactor: 0.12, projectTypeHint: 'distributed_solar' },
  { id: 'st_peaker', kind: 'gas_peaker_backup', label: 'Gas peaker backup', dischargeMw: 180, durationHours: 4, gridStressReliefFactor: 0.08, projectTypeHint: 'gas_peaker' },
] as const;

export interface V1014RegionalStorageFlexibility {
  regionId: string;
  band: V1014StorageFlexibilityBand;
  effectiveMw: number;
  gridStressRelief: number;
  summary: string;
}

export type V1014PermitUtilizationBand = 'compliant' | 'tight' | 'breach';

export interface V1014RegionalPermitLedger {
  regionId: string;
  utilized: number;
  cap: number;
  band: V1014PermitUtilizationBand;
  pressureAdd: number;
  summary: string;
}

export interface V1014PermitPersistedSlice {
  utilized: number;
}

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Number.isFinite(x) ? x : a));

export function computeRegionalStorageFlexibility(params: {
  regionId: string;
  renewableShareScore: number;
  gridStressPoints: number;
  completedProjectTypes: string[];
}): V1014RegionalStorageFlexibility {
  let effectiveMw = 0;
  for (const tpl of V1014_STORAGE_FLEXIBILITY_CATALOG) {
    if (params.completedProjectTypes.includes(tpl.projectTypeHint)) {
      effectiveMw += tpl.dischargeMw * tpl.gridStressReliefFactor;
    }
  }
  effectiveMw += clamp(params.renewableShareScore / 15, 0, 40);
  const gridStressRelief = clamp(effectiveMw / 25 + (params.gridStressPoints > 10 ? effectiveMw / 40 : 0), 0, 12);
  let band: V1014StorageFlexibilityBand = 'minimal';
  if (effectiveMw >= 90) band = 'surplus';
  else if (effectiveMw >= 55) band = 'strong';
  else if (effectiveMw >= 25) band = 'moderate';

  return {
    regionId: params.regionId,
    band,
    effectiveMw: clamp(effectiveMw, 0, 200),
    gridStressRelief,
    summary: `Storage flexibility ${band} in ${params.regionId} (${effectiveMw.toFixed(0)} MW-eq) relieves ${gridStressRelief.toFixed(1)} grid stress.`,
  };
}

export function advanceRegionalPermitLedger(params: {
  regionId: string;
  siteCount: number;
  highRiskSiteCount: number;
  extractionScore: number;
  prev?: V1014PermitPersistedSlice | null;
}): { ledger: V1014RegionalPermitLedger; next: V1014PermitPersistedSlice } {
  const cap = clamp(40 + params.siteCount * 3 - params.highRiskSiteCount * 2, 20, 120);
  const drift = params.extractionScore * 0.45 + params.highRiskSiteCount * 4;
  const prevUtil = params.prev?.utilized ?? cap * 0.35;
  const utilized = clamp(prevUtil * 0.92 + drift * 0.08, 0, cap * 1.15);
  const ratio = utilized / cap;
  let band: V1014PermitUtilizationBand = 'compliant';
  let pressureAdd = 0;
  if (ratio >= 1.05) {
    band = 'breach';
    pressureAdd = clamp((ratio - 1) * 18, 2, 14);
  } else if (ratio >= 0.88) {
    band = 'tight';
    pressureAdd = clamp((ratio - 0.88) * 10, 0, 6);
  }
  return {
    ledger: {
      regionId: params.regionId,
      utilized: clamp(utilized, 0, cap * 1.2),
      cap,
      band,
      pressureAdd,
      summary: `Permit ledger ${band} in ${params.regionId} (${utilized.toFixed(0)}/${cap.toFixed(0)} utilization).`,
    },
    next: { utilized },
  };
}

export const V1014_STORAGE_PERMIT_SCENARIOS = [
  {
    id: 'sc_storage_winter_peak',
    label: 'Winter peak with battery relief',
    completedProjectTypes: ['battery_grid', 'pumped_hydro'],
    renewableShareScore: 42,
    gridStressPoints: 16,
    expectMinRelief: 4,
  },
  {
    id: 'sc_permit_breach_mining',
    label: 'Mining permit breach pressure',
    siteCount: 12,
    highRiskSiteCount: 8,
    extractionScore: 85,
    prevUtilized: 95,
    expectBand: 'breach' as V1014PermitUtilizationBand,
  },
] as const;

export function runAgent13StoragePermitScaleSelfTests(): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;
  const ok = (cond: boolean) => {
    if (cond) passed += 1;
    else failed += 1;
  };

  ok(V1014_STORAGE_FLEXIBILITY_CATALOG.length >= 4);
  const flex = computeRegionalStorageFlexibility({
    regionId: 'SA',
    renewableShareScore: 50,
    gridStressPoints: 14,
    completedProjectTypes: ['battery_grid', 'pumped_hydro'],
  });
  ok(flex.gridStressRelief >= 4 && flex.band !== 'minimal');

  const sc = V1014_STORAGE_PERMIT_SCENARIOS[0];
  const flex2 = computeRegionalStorageFlexibility({
    regionId: 'NSW',
    renewableShareScore: sc.renewableShareScore,
    gridStressPoints: sc.gridStressPoints,
    completedProjectTypes: [...sc.completedProjectTypes],
  });
  ok(flex2.gridStressRelief >= sc.expectMinRelief);

  const permitSc = V1014_STORAGE_PERMIT_SCENARIOS[1];
  const { ledger } = advanceRegionalPermitLedger({
    regionId: 'WA',
    siteCount: permitSc.siteCount,
    highRiskSiteCount: permitSc.highRiskSiteCount,
    extractionScore: permitSc.extractionScore,
    prev: { utilized: permitSc.prevUtilized },
  });
  ok(ledger.band === permitSc.expectBand && ledger.pressureAdd > 0);

  let prev: V1014PermitPersistedSlice = { utilized: 30 };
  const t1 = advanceRegionalPermitLedger({ regionId: 'QLD', siteCount: 6, highRiskSiteCount: 2, extractionScore: 70, prev });
  prev = t1.next;
  const t2 = advanceRegionalPermitLedger({ regionId: 'QLD', siteCount: 6, highRiskSiteCount: 2, extractionScore: 72, prev });
  ok(t2.ledger.utilized !== t1.ledger.utilized);

  return { passed, failed, total: passed + failed };
}
