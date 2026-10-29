import { v1014laborClamp } from './bands';
import { sovereignEaseForRegion } from './catalog/workforce-sovereign-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalResoluteSovereignCouplingBrief,
  type NationalWorkforceResoluteDepthIndex,
  type ResoluteSovereignCouplingBand
} from './types';

function couplingBand(index: number): ResoluteSovereignCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-55 / wave-55 resolute-sovereign coupling — resolute depth × sovereign levers (O10-247). */
export function computeNationalResoluteSovereignCouplingBrief(
  state: NationalLaborDemographicsState,
  resoluteDepth: NationalWorkforceResoluteDepthIndex | null | undefined
): NationalResoluteSovereignCouplingBrief {
  if (!state.enabled || !resoluteDepth) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      resoluteDrag: 0,
      summary: 'Resolute-sovereign coupling idle — workforce resolute depth unavailable.',
      stewardNote: 'Compute workforce resolute depth before sovereign coupling guidance.'
    };
  }

  let sovereignLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    sovereignLift += sovereignEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  sovereignLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const resoluteDrag = v1014laborClamp(
    resoluteDepth.resoluteDrag * 0.46 +
      (resoluteDepth.band === 'fragile' || resoluteDepth.band === 'thin' ? 11 : 3)
  );
  const depthLift =
    resoluteDepth.band === 'elevated' || resoluteDepth.band === 'resolute'
      ? resoluteDepth.resoluteIndex * 0.22
      : resoluteDepth.resoluteIndex * 0.11;

  const couplingIndex = v1014laborClamp(22 + sovereignLift * 21 + depthLift - resoluteDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained resolute-sovereign link — deploy sovereign levers before O10-247 wave-55 commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard sovereign resilience spikes that drain resolute buffers.'
        : 'Amplified coupling — pair sovereign packs with subject sovereign readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    resoluteDrag,
    summary: `Resolute-sovereign coupling ${band} (index ${Math.round(couplingIndex)}); resolute drag ${Math.round(resoluteDrag)}.`,
    stewardNote
  };
}
