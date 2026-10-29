import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectMentorshipReadinessBrief,
  type NationalSubjectReengagementReadinessBrief,
  type NationalWorkforceReengagementIndex,
  type SubjectMentorshipReadinessBand
} from './types';

function mentorshipBand(index: number): SubjectMentorshipReadinessBand {
  if (index <= 34) return 'below_mentorship';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'mentorship_ready';
  return 'reengagement_locked';
}

/** Round-39 / wave-39 subject mentorship readiness — reengagement × workforce reengagement (O10-209). */
export function computeNationalSubjectMentorshipReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectReengagement: NationalSubjectReengagementReadinessBrief | null | undefined,
  workforceReengagement: NationalWorkforceReengagementIndex | null | undefined
): NationalSubjectMentorshipReadinessBrief {
  if (!state.enabled || !subjectReengagement || !workforceReengagement) {
    return {
      turn: state.turn,
      mentorshipIndex: 50,
      band: 'approaching',
      mentorshipDrag: 0,
      summary: 'Subject mentorship readiness idle — subject reengagement or workforce reengagement unavailable.',
      stewardNote: 'Compute subject reengagement and workforce reengagement before mentorship guidance.'
    };
  }

  const mentorshipDrag = v1014laborClamp(
    subjectReengagement.reengagementDrag * 0.38 +
      workforceReengagement.reengagementDrag * 0.38 +
      (subjectReengagement.band === 'below_reengagement' || workforceReengagement.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectReengagement.band === 'reengagement_ready' || subjectReengagement.band === 'retention_locked'
      ? subjectReengagement.reengagementIndex * 0.27
      : subjectReengagement.reengagementIndex * 0.14;
  const workforceLift =
    workforceReengagement.band === 'elevated' || workforceReengagement.band === 'reengagement'
      ? workforceReengagement.reengagementIndex * 0.25
      : workforceReengagement.reengagementIndex * 0.12;

  const mentorshipIndex = v1014laborClamp(20 + subjectLift + workforceLift - mentorshipDrag);
  const band = mentorshipBand(mentorshipIndex);

  const stewardNote =
    band === 'below_mentorship' || band === 'approaching'
      ? 'Approaching mentorship — hold O10-209 wave-39 scale until reengagement-mentorship syncs.'
      : band === 'reengagement_locked'
        ? 'Reengagement-locked mentorship — still monitor mentorship sustain during corridor peaks.'
        : 'Mentorship-ready — pair with workforce mentorship index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    mentorshipIndex,
    band,
    mentorshipDrag,
    summary: `Subject mentorship readiness ${band} (index ${Math.round(mentorshipIndex)}); mentorship drag ${Math.round(mentorshipDrag)}.`,
    stewardNote
  };
}
