import { v1014laborClamp } from './bands';
import {
  type NationalDurabilityAdvocacyCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalMentorshipEnduranceOutlook,
  type NationalSubjectTrancheReadinessBrief,
  type NationalWorkforceEnduranceIndex,
  type WorkforceEnduranceBand
} from './types';

function enduranceBand(index: number): WorkforceEnduranceBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'steady';
  return 'hardened';
}

export function computeNationalWorkforceEnduranceIndex(
  state: NationalLaborDemographicsState,
  advocacyCoupling: NationalDurabilityAdvocacyCouplingBrief | null | undefined,
  mentorshipEndurance: NationalMentorshipEnduranceOutlook | null | undefined,
  subjectTranche: NationalSubjectTrancheReadinessBrief | null | undefined
): NationalWorkforceEnduranceIndex {
  if (!state.enabled || !advocacyCoupling || !mentorshipEndurance || !subjectTranche) {
    return {
      turn: state.turn,
      enduranceIndex: 50,
      band: 'thin',
      trancheDrag: 0,
      summary: 'Workforce endurance idle — advocacy coupling, mentorship endurance, or subject tranche unavailable.',
      stewardNote: 'Compute round-20 depth stack before endurance guidance.'
    };
  }

  const trancheDrag = v1014laborClamp(
    subjectTranche.trancheDrag * 0.35 +
      advocacyCoupling.durabilityDrag * 0.3 +
      mentorshipEndurance.momentumDrag * 0.25 +
      (subjectTranche.band === 'blocked' || advocacyCoupling.band === 'decoupled' ? 8 : 2)
  );
  const advocacyLift =
    advocacyCoupling.band === 'amplified' || advocacyCoupling.band === 'reinforced'
      ? advocacyCoupling.couplingIndex * 0.2
      : advocacyCoupling.couplingIndex * 0.1;
  const mentorshipLift =
    mentorshipEndurance.band === 'sustained' || mentorshipEndurance.band === 'deep'
      ? mentorshipEndurance.enduranceIndex * 0.18
      : mentorshipEndurance.enduranceIndex * 0.09;
  const trancheLift =
    subjectTranche.band === 'tranche_ready' || subjectTranche.band === 'cleared'
      ? subjectTranche.trancheIndex * 0.22
      : subjectTranche.trancheIndex * 0.11;

  const enduranceIndex = v1014laborClamp(18 + advocacyLift + mentorshipLift + trancheLift - trancheDrag);
  const band = enduranceBand(enduranceIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce endurance — sequence durability-advocacy, mentorship, and subject tranche before post-680b9954 tranche.'
      : band === 'hardened'
        ? 'Hardened endurance — avoid corridor overload that breaks subject tranche bands.'
        : 'Steady endurance — refresh subject tranche checks each scale wave.';

  return {
    turn: state.turn,
    enduranceIndex,
    band,
    trancheDrag,
    summary: `National workforce endurance ${band} (index ${Math.round(enduranceIndex)}); tranche drag ${Math.round(trancheDrag)}.`,
    stewardNote
  };
}
