import { v1014laborClamp } from './bands';
import { advocacyEaseForRegion } from './catalog/workforce-advocacy-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalResoluteAdvocacyCouplingBrief,
  type NationalWorkforceResoluteDepthIndex,
  type ResoluteAdvocacyCouplingBand
} from './types';

function couplingBand(index: number): ResoluteAdvocacyCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-52 / wave-52 resolute-advocacy coupling — resolute depth × advocacy (O10-237). */
export function computeNationalResoluteAdvocacyCouplingBrief(
  state: NationalLaborDemographicsState,
  resoluteDepth: NationalWorkforceResoluteDepthIndex | null | undefined
): NationalResoluteAdvocacyCouplingBrief {
  if (!state.enabled || !resoluteDepth) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      resoluteDrag: 0,
      summary: 'Resolute-advocacy coupling idle — workforce resolute depth unavailable.',
      stewardNote: 'Compute workforce resolute depth before advocacy coupling guidance.'
    };
  }

  let advocacyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    advocacyLift += advocacyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  advocacyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const resoluteDrag = v1014laborClamp(
    resoluteDepth.resoluteDrag * 0.46 +
      (resoluteDepth.band === 'fragile' || resoluteDepth.band === 'thin' ? 11 : 3)
  );
  const depthLift =
    resoluteDepth.band === 'elevated' || resoluteDepth.band === 'resolute'
      ? resoluteDepth.resoluteIndex * 0.22
      : resoluteDepth.resoluteIndex * 0.11;

  const couplingIndex = v1014laborClamp(22 + advocacyLift * 21 + depthLift - resoluteDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained resolute-advocacy link — deploy advocacy levers before wave-52 commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard advocacy resilience spikes that drain resolute buffers.'
        : 'Amplified coupling — pair advocacy packs with subject advocacy readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    resoluteDrag,
    summary: `Resolute-advocacy coupling ${band} (index ${Math.round(couplingIndex)}); resolute drag ${Math.round(resoluteDrag)}.`,
    stewardNote
  };
}
