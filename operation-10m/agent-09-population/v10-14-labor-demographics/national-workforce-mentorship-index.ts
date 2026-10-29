import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalMentorshipSustainOutlook,
  type NationalReengagementMentorshipCouplingBrief,
  type NationalSubjectMentorshipReadinessBrief,
  type NationalWorkforceMentorshipIndex,
  type WorkforceMentorshipBand
} from './types';

function mentorshipBand(index: number): WorkforceMentorshipBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'mentorship';
}

export function computeNationalWorkforceMentorshipIndex(
  state: NationalLaborDemographicsState,
  mentorshipCoupling: NationalReengagementMentorshipCouplingBrief | null | undefined,
  mentorshipSustain: NationalMentorshipSustainOutlook | null | undefined,
  subjectMentorship: NationalSubjectMentorshipReadinessBrief | null | undefined
): NationalWorkforceMentorshipIndex {
  if (!state.enabled || !mentorshipCoupling || !mentorshipSustain || !subjectMentorship) {
    return {
      turn: state.turn,
      mentorshipIndex: 50,
      band: 'thin',
      mentorshipDrag: 0,
      summary: 'Workforce mentorship idle — mentorship coupling, sustain, or subject mentorship unavailable.',
      stewardNote: 'Compute O10-209 wave-39 depth stack before mentorship guidance.'
    };
  }

  const mentorshipDrag = v1014laborClamp(
    subjectMentorship.mentorshipDrag * 0.35 +
      mentorshipCoupling.reengagementDrag * 0.3 +
      mentorshipSustain.reengagementDrag * 0.25 +
      (subjectMentorship.band === 'below_mentorship' || mentorshipCoupling.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    mentorshipCoupling.band === 'amplified' || mentorshipCoupling.band === 'elevated'
      ? mentorshipCoupling.couplingIndex * 0.2
      : mentorshipCoupling.couplingIndex * 0.1;
  const sustainLift =
    mentorshipSustain.band === 'rising' || mentorshipSustain.band === 'sustained'
      ? mentorshipSustain.sustainIndex * 0.18
      : mentorshipSustain.sustainIndex * 0.09;
  const subjectLift =
    subjectMentorship.band === 'mentorship_ready' || subjectMentorship.band === 'reengagement_locked'
      ? subjectMentorship.mentorshipIndex * 0.22
      : subjectMentorship.mentorshipIndex * 0.11;

  const mentorshipIndex = v1014laborClamp(18 + couplingLift + sustainLift + subjectLift - mentorshipDrag);
  const band = mentorshipBand(mentorshipIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce mentorship — sequence reengagement-mentorship, mentorship sustain, and subject mentorship before post-6134c6a tranche.'
      : band === 'mentorship'
        ? 'Mentorship band — avoid corridor overload that breaks subject mentorship bands.'
        : 'Elevated mentorship — refresh subject mentorship checks each scale wave.';

  return {
    turn: state.turn,
    mentorshipIndex,
    band,
    mentorshipDrag,
    summary: `National workforce mentorship ${band} (index ${Math.round(mentorshipIndex)}); mentorship drag ${Math.round(mentorshipDrag)}.`,
    stewardNote
  };
}
