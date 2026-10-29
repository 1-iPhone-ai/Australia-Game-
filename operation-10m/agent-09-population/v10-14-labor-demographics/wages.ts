import { v1014laborClamp } from './bands';

/** Wage pressure from workforce strain, industry output index, and momentum. */
export function computeRegionalWagePressureRaw(params: {
  wfStrain: number;
  outputIndex: number;
  momentumBoost: number;
}): number {
  const { wfStrain, outputIndex, momentumBoost } = params;
  return v1014laborClamp(wfStrain * 0.45 + outputIndex * 0.35 + momentumBoost + 10);
}

export function workforceStrainForRegion(regionId: string, workforce: any): number {
  if (!workforce?.regions) return 50;
  const r = workforce.regions[regionId];
  if (!r) return 50;
  const ratio = Number(r.effectivePressureRatio ?? r.pressureRatio ?? 0.5);
  return v1014laborClamp(ratio * 100);
}
