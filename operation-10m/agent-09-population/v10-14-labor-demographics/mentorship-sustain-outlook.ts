import { v1014laborClamp } from './bands';
import { mentorshipEaseForRegion } from './catalog/workforce-mentorship-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type MentorshipSustainBand,
  type NationalLaborDemographicsState,
  type NationalMentorshipSustainOutlook,
  type NationalReengagementAlignmentOutlook
} from './types';

function sustainBand(index: number): MentorshipSustainBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'sustained';
}

export function computeNationalMentorshipSustainOutlook(
  state: NationalLaborDemographicsState,
  reengagementAlignment: NationalReengagementAlignmentOutlook | null | undefined
): NationalMentorshipSustainOutlook {
  if (!state.enabled || !reengagementAlignment) {
    return {
      turn: state.turn,
      sustainIndex: 50,
      band: 'patchy',
      reengagementDrag: 0,
      summary: 'Mentorship sustain idle — reengagement alignment unavailable.',
      stewardNote: 'Compute reengagement alignment before mentorship sustain guidance.'
    };
  }

  let mentorshipLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    mentorshipLift += mentorshipEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  mentorshipLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const reengagementDrag = v1014laborClamp(
    reengagementAlignment.retentionDrag * 0.46 +
      (reengagementAlignment.band === 'ebbing' || reengagementAlignment.band === 'patchy' ? 10 : 3)
  );
  const alignmentLift =
    reengagementAlignment.band === 'rising' || reengagementAlignment.band === 'aligned'
      ? reengagementAlignment.alignmentIndex * 0.2
      : reengagementAlignment.alignmentIndex * 0.1;

  const sustainIndex = v1014laborClamp(24 + mentorshipLift * 22 + alignmentLift - reengagementDrag);
  const band = sustainBand(sustainIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy mentorship sustain — deploy mentorship levers before subject mentorship assembly.'
      : band === 'sustained'
        ? 'Sustained band — verify reengagement-mentorship coupling before auto workforce pushes.'
        : 'Rising sustain — align with reengagement alignment outlook checks.';

  return {
    turn: state.turn,
    sustainIndex,
    band,
    reengagementDrag,
    summary: `National mentorship sustain ${band} (index ${Math.round(sustainIndex)}); reengagement drag ${Math.round(reengagementDrag)}.`,
    stewardNote
  };
}
