import { v1014laborClamp } from './bands';
import { advocacyEaseForRegion } from './catalog/workforce-advocacy-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalSteadfastAdvocacyCouplingBrief,
  type NationalWorkforceSteadfastDepthIndex,
  type SteadfastAdvocacyCouplingBand
} from './types';

function couplingBand(index: number): SteadfastAdvocacyCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-52 / wave-52 steadfast-advocacy coupling — steadfast depth × advocacy (O10-235). */
export function computeNationalSteadfastAdvocacyCouplingBrief(
  state: NationalLaborDemographicsState,
  steadfastDepth: NationalWorkforceSteadfastDepthIndex | null | undefined
): NationalSteadfastAdvocacyCouplingBrief {
  if (!state.enabled || !steadfastDepth) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      steadfastDrag: 0,
      summary: 'Steadfast-advocacy coupling idle — workforce steadfast depth unavailable.',
      stewardNote: 'Compute workforce steadfast depth before advocacy coupling guidance.'
    };
  }

  let advocacyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    advocacyLift += advocacyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  advocacyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const steadfastDrag = v1014laborClamp(
    steadfastDepth.steadfastDrag * 0.46 +
      (steadfastDepth.band === 'fragile' || steadfastDepth.band === 'thin' ? 11 : 3)
  );
  const depthLift =
    steadfastDepth.band === 'elevated' || steadfastDepth.band === 'steadfast'
      ? steadfastDepth.steadfastIndex * 0.22
      : steadfastDepth.steadfastIndex * 0.11;

  const couplingIndex = v1014laborClamp(22 + advocacyLift * 21 + depthLift - steadfastDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained steadfast-advocacy link — deploy advocacy levers before wave-52 commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard advocacy resilience spikes that drain steadfast buffers.'
        : 'Amplified coupling — pair advocacy packs with subject advocacy readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    steadfastDrag,
    summary: `Steadfast-advocacy coupling ${band} (index ${Math.round(couplingIndex)}); steadfast drag ${Math.round(steadfastDrag)}.`,
    stewardNote
  };
}
