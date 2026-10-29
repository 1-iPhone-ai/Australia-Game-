import type { V1014EnergyDepthDepletionCurveEntry, V1014EnergyDepthRegionId } from './types';
import { V1014_ENERGY_DEPTH_bandDepletion, V1014_ENERGY_DEPTH_clamp } from './primitives';
import { V1014_ENERGY_DEPTH_DEPLETION_CURVES } from './catalog/depletion-curves';

export function V1014_ENERGY_DEPTH_lookupDepletionCurves(
  regionId: V1014EnergyDepthRegionId,
): V1014EnergyDepthDepletionCurveEntry[] {
  return V1014_ENERGY_DEPTH_DEPLETION_CURVES.filter(c => c.regionId === regionId);
}

export function V1014_ENERGY_DEPTH_tickExtractionDepletion(
  regionId: V1014EnergyDepthRegionId,
  extractionPressure: number,
  cumulativeBySite: Record<string, number>,
  turnDelta = 1,
): { cumulativeBySite: Record<string, number>; band: ReturnType<typeof V1014_ENERGY_DEPTH_bandDepletion>; pressure: number } {
  const curves = V1014_ENERGY_DEPTH_lookupDepletionCurves(regionId);
  const next = { ...cumulativeBySite };
  let worstRemaining = 1;
  let totalPressure = 0;
  for (const curve of curves) {
    const prev = next[curve.id] ?? 0;
    const intensity = V1014_ENERGY_DEPTH_clamp(extractionPressure / 100, 0, 1.2);
    const extracted =
      (curve.initialReservesMt * 0.002 + intensity * curve.initialReservesMt * 0.008) * turnDelta;
    const cum = prev + extracted * (1 + curve.waterPenalty * 0.05);
    next[curve.id] = cum;
    const remaining = V1014_ENERGY_DEPTH_clamp(1 - cum / curve.initialReservesMt, 0, 1);
    if (remaining < worstRemaining) worstRemaining = remaining;
    totalPressure += intensity * curve.emissionsFactor;
  }
  const band = V1014_ENERGY_DEPTH_bandDepletion(worstRemaining);
  return {
    cumulativeBySite: next,
    band,
    pressure: V1014_ENERGY_DEPTH_clamp(totalPressure / Math.max(curves.length, 1), 0, 100),
  };
}

export function V1014_ENERGY_DEPTH_depletionEvidence(
  band: ReturnType<typeof V1014_ENERGY_DEPTH_bandDepletion>,
  regionId: V1014EnergyDepthRegionId,
): string[] {
  return [
    `depletion_band:${band}`,
    `region:${regionId}`,
    'source:20AY_depth_pass',
  ];
}
