import { v1014laborClamp } from './bands';
import { inclusionEaseForRegion } from './catalog/workforce-inclusion-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type InclusionResilienceBand,
  type NationalInclusionResilienceOutlook,
  type NationalLaborDemographicsState,
  type NationalMentorshipEnduranceOutlook
} from './types';

function resilienceBand(index: number): InclusionResilienceBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'cohesive';
  return 'robust';
}

export function computeNationalInclusionResilienceOutlook(
  state: NationalLaborDemographicsState,
  mentorshipEndurance: NationalMentorshipEnduranceOutlook | null | undefined
): NationalInclusionResilienceOutlook {
  if (!state.enabled || !mentorshipEndurance) {
    return {
      turn: state.turn,
      resilienceIndex: 50,
      band: 'patchy',
      enduranceDrag: 0,
      summary: 'Inclusion resilience idle — mentorship endurance unavailable.',
      stewardNote: 'Compute mentorship endurance before inclusion resilience guidance.'
    };
  }

  let inclusionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    inclusionLift += inclusionEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  inclusionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const enduranceDrag = v1014laborClamp(
    mentorshipEndurance.momentumDrag * 0.46 +
      (mentorshipEndurance.band === 'depleted' || mentorshipEndurance.band === 'thin' ? 10 : 3)
  );
  const mentorshipLift =
    mentorshipEndurance.band === 'sustained' || mentorshipEndurance.band === 'deep'
      ? mentorshipEndurance.enduranceIndex * 0.2
      : mentorshipEndurance.enduranceIndex * 0.1;

  const resilienceIndex = v1014laborClamp(24 + inclusionLift * 22 + mentorshipLift - enduranceDrag);
  const band = resilienceBand(resilienceIndex);

  const stewardNote =
    band === 'fragile' || band === 'patchy'
      ? 'Patchy inclusion resilience — deploy inclusion levers before subject commit assembly.'
      : band === 'robust'
        ? 'Robust resilience band — verify endurance-flexibility coupling before auto workforce pushes.'
        : 'Cohesive resilience — align inclusion with participation equity gap checks.';

  return {
    turn: state.turn,
    resilienceIndex,
    band,
    enduranceDrag,
    summary: `National inclusion resilience ${band} (index ${Math.round(resilienceIndex)}); endurance drag ${Math.round(enduranceDrag)}.`,
    stewardNote
  };
}
