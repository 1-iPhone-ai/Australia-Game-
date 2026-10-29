import { v1014laborClamp } from './bands';
import { resoluteEaseForRegion } from './catalog/workforce-resolute-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type AdvocacyResoluteCouplingBand,
  type NationalAdvocacyResoluteCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceAdvocacyDepthIndex
} from './types';

function couplingBand(index: number): AdvocacyResoluteCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-54 / wave-54 advocacy-resolute coupling — advocacy depth × resolute (O10-240). */
export function computeNationalAdvocacyResoluteCouplingBrief(
  state: NationalLaborDemographicsState,
  advocacyDepth: NationalWorkforceAdvocacyDepthIndex | null | undefined
): NationalAdvocacyResoluteCouplingBrief {
  if (!state.enabled || !advocacyDepth) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      advocacyDrag: 0,
      summary: 'Advocacy-resolute coupling idle — workforce advocacy depth unavailable.',
      stewardNote: 'Compute workforce advocacy depth before resolute coupling guidance.'
    };
  }

  let resoluteLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    resoluteLift += resoluteEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  resoluteLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const advocacyDrag = v1014laborClamp(
    advocacyDepth.advocacyDrag * 0.46 +
      (advocacyDepth.band === 'fragile' || advocacyDepth.band === 'thin' ? 11 : 3)
  );
  const depthLift =
    advocacyDepth.band === 'elevated' || advocacyDepth.band === 'advocacy'
      ? advocacyDepth.advocacyIndex * 0.22
      : advocacyDepth.advocacyIndex * 0.11;

  const couplingIndex = v1014laborClamp(22 + resoluteLift * 21 + depthLift - advocacyDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained advocacy-resolute link — deploy resolute levers before wave-54 commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard resolute resilience spikes that drain advocacy buffers.'
        : 'Amplified coupling — pair resolute packs with subject resolute readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    advocacyDrag,
    summary: `Advocacy-resolute coupling ${band} (index ${Math.round(couplingIndex)}); advocacy drag ${Math.round(advocacyDrag)}.`,
    stewardNote
  };
}
