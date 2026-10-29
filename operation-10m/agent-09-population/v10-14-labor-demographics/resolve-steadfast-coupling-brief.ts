import { v1014laborClamp } from './bands';
import { steadfastEaseForRegion } from './catalog/workforce-steadfast-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalResolveSteadfastCouplingBrief,
  type NationalWorkforceResolveDepthIndex,
  type ResolveSteadfastCouplingBand
} from './types';

function couplingBand(index: number): ResolveSteadfastCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-51 / wave-51 resolve-steadfast coupling — resolve depth × steadfast (O10-233). */
export function computeNationalResolveSteadfastCouplingBrief(
  state: NationalLaborDemographicsState,
  resolveDepth: NationalWorkforceResolveDepthIndex | null | undefined
): NationalResolveSteadfastCouplingBrief {
  if (!state.enabled || !resolveDepth) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      resolveDrag: 0,
      summary: 'Resolve-steadfast coupling idle — workforce resolve depth unavailable.',
      stewardNote: 'Compute workforce resolve depth before steadfast coupling guidance.'
    };
  }

  let steadfastLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    steadfastLift += steadfastEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  steadfastLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const resolveDrag = v1014laborClamp(
    resolveDepth.resolveDrag * 0.46 +
      (resolveDepth.band === 'fragile' || resolveDepth.band === 'thin' ? 11 : 3)
  );
  const depthLift =
    resolveDepth.band === 'elevated' || resolveDepth.band === 'resolve'
      ? resolveDepth.resolveIndex * 0.22
      : resolveDepth.resolveIndex * 0.11;

  const couplingIndex = v1014laborClamp(22 + steadfastLift * 21 + depthLift - resolveDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained resolve-steadfast link — deploy steadfast levers before wave-51 commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard steadfast resilience spikes that drain resolve buffers.'
        : 'Amplified coupling — pair steadfast packs with subject steadfast readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    resolveDrag,
    summary: `Resolve-steadfast coupling ${band} (index ${Math.round(couplingIndex)}); resolve drag ${Math.round(resolveDrag)}.`,
    stewardNote
  };
}
