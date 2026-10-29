import { v1014laborClamp } from './bands';
import { resoluteEaseForRegion } from './catalog/workforce-resolute-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalSovereignResoluteHandoffCouplingBrief,
  type NationalWorkforceSovereignDepthIndex,
  type SovereignResoluteHandoffCouplingBand
} from './types';

function couplingBand(index: number): SovereignResoluteHandoffCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-55 capstone — sovereign-resolute handoff coupling on sovereign depth (O10-247). */
export function computeNationalSovereignResoluteHandoffCouplingBrief(
  state: NationalLaborDemographicsState,
  sovereignDepth: NationalWorkforceSovereignDepthIndex | null | undefined
): NationalSovereignResoluteHandoffCouplingBrief {
  if (!state.enabled || !sovereignDepth) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      sovereignDrag: 0,
      summary: 'Sovereign-resolute handoff idle — workforce sovereign depth unavailable.',
      stewardNote: 'Compute workforce sovereign depth before resolute handoff guidance.'
    };
  }

  let resoluteLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    resoluteLift += resoluteEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  resoluteLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const sovereignDrag = v1014laborClamp(
    sovereignDepth.sovereignDrag * 0.46 +
      (sovereignDepth.band === 'fragile' || sovereignDepth.band === 'thin' ? 11 : 3)
  );
  const depthLift =
    sovereignDepth.band === 'elevated' || sovereignDepth.band === 'sovereign'
      ? sovereignDepth.sovereignIndex * 0.22
      : sovereignDepth.sovereignIndex * 0.11;

  const couplingIndex = v1014laborClamp(22 + resoluteLift * 21 + depthLift - sovereignDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained sovereign-resolute handoff — deploy resolute levers before wave-55 integration.'
      : band === 'elevated'
        ? 'Elevated handoff — guard resolute spikes that drain sovereign buffers.'
        : 'Amplified handoff — pair resolute packs with subject sovereign readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    sovereignDrag,
    summary: `Sovereign-resolute handoff ${band} (index ${Math.round(couplingIndex)}); sovereign drag ${Math.round(sovereignDrag)}.`,
    stewardNote
  };
}
