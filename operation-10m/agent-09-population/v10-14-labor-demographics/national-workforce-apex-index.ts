import { v1014laborClamp } from './bands';
import {
  type NationalCulminationMentorshipCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalOnboardingSustainOutlook,
  type NationalSubjectApexReadinessBrief,
  type NationalWorkforceApexIndex,
  type WorkforceApexBand
} from './types';

function apexBand(index: number): WorkforceApexBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'summit';
}

export function computeNationalWorkforceApexIndex(
  state: NationalLaborDemographicsState,
  mentorshipCoupling: NationalCulminationMentorshipCouplingBrief | null | undefined,
  onboardingSustain: NationalOnboardingSustainOutlook | null | undefined,
  subjectApex: NationalSubjectApexReadinessBrief | null | undefined
): NationalWorkforceApexIndex {
  if (!state.enabled || !mentorshipCoupling || !onboardingSustain || !subjectApex) {
    return {
      turn: state.turn,
      apexIndex: 50,
      band: 'thin',
      apexDrag: 0,
      summary: 'Workforce apex idle — mentorship coupling, onboarding sustain, or subject apex unavailable.',
      stewardNote: 'Compute O10-183 wave-26 depth stack before apex guidance.'
    };
  }

  const apexDrag = v1014laborClamp(
    subjectApex.apexDrag * 0.35 +
      mentorshipCoupling.culminationDrag * 0.3 +
      onboardingSustain.anchorDrag * 0.25 +
      (subjectApex.band === 'below_apex' || mentorshipCoupling.band === 'decoupled' ? 8 : 2)
  );
  const mentorshipLift =
    mentorshipCoupling.band === 'guided' || mentorshipCoupling.band === 'elevated'
      ? mentorshipCoupling.couplingIndex * 0.2
      : mentorshipCoupling.couplingIndex * 0.1;
  const sustainLift =
    onboardingSustain.band === 'sustained' || onboardingSustain.band === 'deep'
      ? onboardingSustain.sustainIndex * 0.18
      : onboardingSustain.sustainIndex * 0.09;
  const subjectLift =
    subjectApex.band === 'apex_ready' || subjectApex.band === 'summit_locked'
      ? subjectApex.apexIndex * 0.22
      : subjectApex.apexIndex * 0.11;

  const apexIndex = v1014laborClamp(18 + mentorshipLift + sustainLift + subjectLift - apexDrag);
  const band = apexBand(apexIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce apex — sequence culmination-mentorship, onboarding sustain, and subject apex before post-de3079f9 tranche.'
      : band === 'summit'
        ? 'Summit apex — avoid corridor overload that breaks subject apex bands.'
        : 'Elevated apex — refresh subject apex checks each scale wave.';

  return {
    turn: state.turn,
    apexIndex,
    band,
    apexDrag,
    summary: `National workforce apex ${band} (index ${Math.round(apexIndex)}); apex drag ${Math.round(apexDrag)}.`,
    stewardNote
  };
}
