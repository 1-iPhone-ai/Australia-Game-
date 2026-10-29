import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectAdvocacyReadinessBrief,
  type NationalSubjectMentorshipReadinessBrief,
  type NationalWorkforceMentorshipIndex,
  type SubjectAdvocacyReadinessBand
} from './types';

function advocacyBand(index: number): SubjectAdvocacyReadinessBand {
  if (index <= 34) return 'below_advocacy';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'advocacy_ready';
  return 'mentorship_locked';
}

/** Round-40 / wave-40 subject advocacy readiness — mentorship × workforce mentorship (O10-211). */
export function computeNationalSubjectAdvocacyReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectMentorship: NationalSubjectMentorshipReadinessBrief | null | undefined,
  workforceMentorship: NationalWorkforceMentorshipIndex | null | undefined
): NationalSubjectAdvocacyReadinessBrief {
  if (!state.enabled || !subjectMentorship || !workforceMentorship) {
    return {
      turn: state.turn,
      advocacyIndex: 50,
      band: 'approaching',
      advocacyDrag: 0,
      summary: 'Subject advocacy readiness idle — subject mentorship or workforce mentorship unavailable.',
      stewardNote: 'Compute subject mentorship and workforce mentorship before advocacy guidance.'
    };
  }

  const advocacyDrag = v1014laborClamp(
    subjectMentorship.mentorshipDrag * 0.38 +
      workforceMentorship.mentorshipDrag * 0.38 +
      (subjectMentorship.band === 'below_mentorship' || workforceMentorship.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectMentorship.band === 'mentorship_ready' || subjectMentorship.band === 'reengagement_locked'
      ? subjectMentorship.mentorshipIndex * 0.27
      : subjectMentorship.mentorshipIndex * 0.14;
  const workforceLift =
    workforceMentorship.band === 'elevated' || workforceMentorship.band === 'mentorship'
      ? workforceMentorship.mentorshipIndex * 0.25
      : workforceMentorship.mentorshipIndex * 0.12;

  const advocacyIndex = v1014laborClamp(20 + subjectLift + workforceLift - advocacyDrag);
  const band = advocacyBand(advocacyIndex);

  const stewardNote =
    band === 'below_advocacy' || band === 'approaching'
      ? 'Approaching advocacy — hold O10-211 wave-40 scale until mentorship-advocacy syncs.'
      : band === 'mentorship_locked'
        ? 'Mentorship-locked advocacy — still monitor advocacy resonance during corridor peaks.'
        : 'Advocacy-ready — pair with workforce advocacy index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    advocacyIndex,
    band,
    advocacyDrag,
    summary: `Subject advocacy readiness ${band} (index ${Math.round(advocacyIndex)}); advocacy drag ${Math.round(advocacyDrag)}.`,
    stewardNote
  };
}
