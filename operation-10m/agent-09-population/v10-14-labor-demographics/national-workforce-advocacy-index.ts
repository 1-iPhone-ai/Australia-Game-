import { v1014laborClamp } from './bands';
import {
  type NationalAdvocacyResonanceOutlook,
  type NationalLaborDemographicsState,
  type NationalMentorshipAdvocacyCouplingBrief,
  type NationalSubjectAdvocacyReadinessBrief,
  type NationalWorkforceAdvocacyIndex,
  type WorkforceAdvocacyBand
} from './types';

function advocacyBand(index: number): WorkforceAdvocacyBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'advocacy';
}

export function computeNationalWorkforceAdvocacyIndex(
  state: NationalLaborDemographicsState,
  advocacyCoupling: NationalMentorshipAdvocacyCouplingBrief | null | undefined,
  advocacyResonance: NationalAdvocacyResonanceOutlook | null | undefined,
  subjectAdvocacy: NationalSubjectAdvocacyReadinessBrief | null | undefined
): NationalWorkforceAdvocacyIndex {
  if (!state.enabled || !advocacyCoupling || !advocacyResonance || !subjectAdvocacy) {
    return {
      turn: state.turn,
      advocacyIndex: 50,
      band: 'thin',
      advocacyDrag: 0,
      summary: 'Workforce advocacy idle — advocacy coupling, resonance, or subject advocacy unavailable.',
      stewardNote: 'Compute O10-211 wave-40 depth stack before advocacy guidance.'
    };
  }

  const advocacyDrag = v1014laborClamp(
    subjectAdvocacy.advocacyDrag * 0.35 +
      advocacyCoupling.mentorshipDrag * 0.3 +
      advocacyResonance.mentorshipDrag * 0.25 +
      (subjectAdvocacy.band === 'below_advocacy' || advocacyCoupling.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    advocacyCoupling.band === 'amplified' || advocacyCoupling.band === 'elevated'
      ? advocacyCoupling.couplingIndex * 0.2
      : advocacyCoupling.couplingIndex * 0.1;
  const resonanceLift =
    advocacyResonance.band === 'rising' || advocacyResonance.band === 'resonant'
      ? advocacyResonance.resonanceIndex * 0.18
      : advocacyResonance.resonanceIndex * 0.09;
  const subjectLift =
    subjectAdvocacy.band === 'advocacy_ready' || subjectAdvocacy.band === 'mentorship_locked'
      ? subjectAdvocacy.advocacyIndex * 0.22
      : subjectAdvocacy.advocacyIndex * 0.11;

  const advocacyIndex = v1014laborClamp(18 + couplingLift + resonanceLift + subjectLift - advocacyDrag);
  const band = advocacyBand(advocacyIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce advocacy — sequence mentorship-advocacy, advocacy resonance, and subject advocacy before post-6f7fa49 tranche.'
      : band === 'advocacy'
        ? 'Advocacy band — avoid corridor overload that breaks subject advocacy bands.'
        : 'Elevated advocacy — refresh subject advocacy checks each scale wave.';

  return {
    turn: state.turn,
    advocacyIndex,
    band,
    advocacyDrag,
    summary: `National workforce advocacy ${band} (index ${Math.round(advocacyIndex)}); advocacy drag ${Math.round(advocacyDrag)}.`,
    stewardNote
  };
}
