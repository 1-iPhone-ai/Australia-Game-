import { v1014laborClamp } from './bands';
import { flexibilityEaseForRegion } from './catalog/workforce-flexibility-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type EnduranceFlexibilityCouplingBand,
  type NationalEnduranceFlexibilityCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceEnduranceIndex
} from './types';

function couplingBand(index: number): EnduranceFlexibilityCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'elastic';
  return 'anchored';
}

export function computeNationalEnduranceFlexibilityCouplingBrief(
  state: NationalLaborDemographicsState,
  endurance: NationalWorkforceEnduranceIndex | null | undefined
): NationalEnduranceFlexibilityCouplingBrief {
  if (!state.enabled || !endurance) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      enduranceDrag: 0,
      summary: 'Endurance-flexibility coupling idle — workforce endurance unavailable.',
      stewardNote: 'Compute workforce endurance before flexibility coupling guidance.'
    };
  }

  let flexibilityLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    flexibilityLift += flexibilityEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  flexibilityLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const enduranceDrag = v1014laborClamp(
    endurance.trancheDrag * 0.48 +
      (endurance.band === 'fragile' || endurance.band === 'thin' ? 11 : 3)
  );
  const enduranceLift =
    endurance.band === 'steady' || endurance.band === 'hardened'
      ? endurance.enduranceIndex * 0.24
      : endurance.enduranceIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + flexibilityLift * 21 + enduranceLift - enduranceDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained endurance-flexibility link — ease flexibility levers before round-21 commit pushes.'
      : band === 'anchored'
        ? 'Anchored coupling — guard inclusion spikes that drain flexibility buffers.'
        : 'Elastic coupling — pair flexibility packs with subject commit readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    enduranceDrag,
    summary: `Endurance-flexibility coupling ${band} (index ${Math.round(couplingIndex)}); endurance drag ${Math.round(enduranceDrag)}.`,
    stewardNote
  };
}
