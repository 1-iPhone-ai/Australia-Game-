import { v1014laborClamp } from './bands';
import { mentorshipEaseForRegion } from './catalog/workforce-mentorship-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type MentorshipEnduranceBand,
  type NationalLaborDemographicsState,
  type NationalMentorshipEnduranceOutlook,
  type NationalReengagementMomentumOutlook
} from './types';

function enduranceBand(index: number): MentorshipEnduranceBand {
  if (index <= 34) return 'depleted';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'sustained';
  return 'deep';
}

export function computeNationalMentorshipEnduranceOutlook(
  state: NationalLaborDemographicsState,
  reengagementMomentum: NationalReengagementMomentumOutlook | null | undefined
): NationalMentorshipEnduranceOutlook {
  if (!state.enabled || !reengagementMomentum) {
    return {
      turn: state.turn,
      enduranceIndex: 50,
      band: 'thin',
      momentumDrag: 0,
      summary: 'Mentorship endurance idle — reengagement momentum unavailable.',
      stewardNote: 'Compute reengagement momentum before mentorship endurance guidance.'
    };
  }

  let mentorshipLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    mentorshipLift += mentorshipEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  mentorshipLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const momentumDrag = v1014laborClamp(
    reengagementMomentum.pipelineDrag * 0.46 +
      (reengagementMomentum.band === 'stalled' || reengagementMomentum.band === 'patchy' ? 10 : 3)
  );
  const momentumLift =
    reengagementMomentum.band === 'building' || reengagementMomentum.band === 'surging'
      ? reengagementMomentum.momentumIndex * 0.2
      : reengagementMomentum.momentumIndex * 0.1;

  const enduranceIndex = v1014laborClamp(24 + mentorshipLift * 22 + momentumLift - momentumDrag);
  const band = enduranceBand(enduranceIndex);

  const stewardNote =
    band === 'depleted' || band === 'thin'
      ? 'Thin mentorship endurance — ease mentorship levers before subject tranche assembly.'
      : band === 'deep'
        ? 'Deep endurance band — verify durability-advocacy coupling before auto workforce pushes.'
        : 'Sustained endurance — align mentorship with hybrid remote participation checks.';

  return {
    turn: state.turn,
    enduranceIndex,
    band,
    momentumDrag,
    summary: `National mentorship endurance ${band} (index ${Math.round(enduranceIndex)}); momentum drag ${Math.round(momentumDrag)}.`,
    stewardNote
  };
}
