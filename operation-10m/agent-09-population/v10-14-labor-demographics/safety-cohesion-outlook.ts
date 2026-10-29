import { v1014laborClamp } from './bands';
import { safetyEaseForRegion } from './catalog/workforce-safety-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalInclusionResilienceOutlook,
  type NationalLaborDemographicsState,
  type NationalSafetyCohesionOutlook,
  type SafetyCohesionBand
} from './types';

function cohesionBand(index: number): SafetyCohesionBand {
  if (index <= 34) return 'exposed';
  if (index <= 48) return 'uneven';
  if (index <= 62) return 'guarded';
  return 'shielded';
}

export function computeNationalSafetyCohesionOutlook(
  state: NationalLaborDemographicsState,
  inclusionResilience: NationalInclusionResilienceOutlook | null | undefined
): NationalSafetyCohesionOutlook {
  if (!state.enabled || !inclusionResilience) {
    return {
      turn: state.turn,
      cohesionIndex: 50,
      band: 'uneven',
      resilienceDrag: 0,
      summary: 'Safety cohesion idle — inclusion resilience unavailable.',
      stewardNote: 'Compute inclusion resilience before safety cohesion guidance.'
    };
  }

  let safetyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    safetyLift += safetyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  safetyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const resilienceDrag = v1014laborClamp(
    inclusionResilience.enduranceDrag * 0.46 +
      (inclusionResilience.band === 'fragile' || inclusionResilience.band === 'patchy' ? 10 : 3)
  );
  const inclusionLift =
    inclusionResilience.band === 'cohesive' || inclusionResilience.band === 'robust'
      ? inclusionResilience.resilienceIndex * 0.2
      : inclusionResilience.resilienceIndex * 0.1;

  const cohesionIndex = v1014laborClamp(24 + safetyLift * 22 + inclusionLift - resilienceDrag);
  const band = cohesionBand(cohesionIndex);

  const stewardNote =
    band === 'exposed' || band === 'uneven'
      ? 'Uneven safety cohesion — deploy safety levers before subject release assembly.'
      : band === 'shielded'
        ? 'Shielded cohesion band — verify tenacity-care coupling before auto workforce pushes.'
        : 'Guarded cohesion — align safety with essential worker participation checks.';

  return {
    turn: state.turn,
    cohesionIndex,
    band,
    resilienceDrag,
    summary: `National safety cohesion ${band} (index ${Math.round(cohesionIndex)}); resilience drag ${Math.round(resilienceDrag)}.`,
    stewardNote
  };
}
