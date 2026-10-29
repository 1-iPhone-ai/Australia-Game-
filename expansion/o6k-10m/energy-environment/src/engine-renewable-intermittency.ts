import type { V1014EnergyDepthRegionId } from './types';
import { V1014_ENERGY_DEPTH_bandIntermittency, V1014_ENERGY_DEPTH_clamp } from './primitives';
import { V1014_ENERGY_DEPTH_RENEWABLE_PROFILES } from './catalog/renewable-profiles';

export function V1014_ENERGY_DEPTH_computeIntermittency(
  regionId: V1014EnergyDepthRegionId,
  hourBucket: number,
  renewableShare: number,
): { band: ReturnType<typeof V1014_ENERGY_DEPTH_bandIntermittency>; sigma: number; forecastGapMw: number } {
  const profiles = V1014_ENERGY_DEPTH_RENEWABLE_PROFILES.filter(
    p => p.regionId === regionId && p.hourBucket === hourBucket % 24,
  );
  if (profiles.length === 0) {
    return { band: 'stable', sigma: 0.05, forecastGapMw: 0 };
  }
  let sigma = 0;
  let gap = 0;
  for (const p of profiles) {
    sigma += p.forecastErrorSigma * (p.gridCoupling === 'strong' ? 1.2 : p.gridCoupling === 'moderate' ? 1 : 0.75);
    const err = p.forecastErrorSigma * (1 - p.capacityFactor) * 120;
    gap += err;
  }
  sigma = sigma / profiles.length;
  const band = V1014_ENERGY_DEPTH_bandIntermittency(sigma, renewableShare);
  return {
    band,
    sigma: V1014_ENERGY_DEPTH_clamp(sigma, 0, 1),
    forecastGapMw: Math.round(gap),
  };
}

export function V1014_ENERGY_DEPTH_intermittencyReservePenalty(
  band: ReturnType<typeof V1014_ENERGY_DEPTH_bandIntermittency>,
): number {
  switch (band) {
    case 'stable':
      return 0;
    case 'variable':
      return 1.5;
    case 'volatile':
      return 3.5;
    case 'extreme':
      return 6;
  }
}
