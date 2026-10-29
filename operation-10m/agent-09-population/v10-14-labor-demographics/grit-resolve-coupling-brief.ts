import { v1014laborClamp } from './bands';
import { resolveEaseForRegion } from './catalog/workforce-resolve-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type GritResolveCouplingBand,
  type NationalGritResolveCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceGritDepthIndex
} from './types';

function couplingBand(index: number): GritResolveCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-50 / wave-50 grit-resolve coupling — grit depth × resolve (O10-231). */
export function computeNationalGritResolveCouplingBrief(
  state: NationalLaborDemographicsState,
  gritDepth: NationalWorkforceGritDepthIndex | null | undefined
): NationalGritResolveCouplingBrief {
  if (!state.enabled || !gritDepth) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      gritDrag: 0,
      summary: 'Grit-resolve coupling idle — workforce grit depth unavailable.',
      stewardNote: 'Compute workforce grit depth before resolve coupling guidance.'
    };
  }

  let resolveLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    resolveLift += resolveEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  resolveLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const gritDrag = v1014laborClamp(
    gritDepth.gritDrag * 0.46 +
      (gritDepth.band === 'fragile' || gritDepth.band === 'thin' ? 11 : 3)
  );
  const depthLift =
    gritDepth.band === 'elevated' || gritDepth.band === 'grit'
      ? gritDepth.gritIndex * 0.22
      : gritDepth.gritIndex * 0.11;

  const couplingIndex = v1014laborClamp(22 + resolveLift * 21 + depthLift - gritDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained grit-resolve link — deploy resolve levers before wave-50 commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard resolve resilience spikes that drain grit buffers.'
        : 'Amplified coupling — pair resolve packs with subject resolve readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    gritDrag,
    summary: `Grit-resolve coupling ${band} (index ${Math.round(couplingIndex)}); grit drag ${Math.round(gritDrag)}.`,
    stewardNote
  };
}
