import { v1014laborClamp } from './bands';
import {
  type NationalCareBalanceOutlook,
  type NationalLaborDemographicsState,
  type NationalSafetyCareCouplingBrief,
  type NationalSubjectCareReadinessBrief,
  type NationalWorkforceCareIndex,
  type WorkforceCareBand
} from './types';

function careBand(index: number): WorkforceCareBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'care';
}

export function computeNationalWorkforceCareIndex(
  state: NationalLaborDemographicsState,
  careCoupling: NationalSafetyCareCouplingBrief | null | undefined,
  careBalance: NationalCareBalanceOutlook | null | undefined,
  subjectCare: NationalSubjectCareReadinessBrief | null | undefined
): NationalWorkforceCareIndex {
  if (!state.enabled || !careCoupling || !careBalance || !subjectCare) {
    return {
      turn: state.turn,
      careIndex: 50,
      band: 'thin',
      careDrag: 0,
      summary: 'Workforce care idle — care coupling, balance, or subject care unavailable.',
      stewardNote: 'Compute O10-223 wave-46 depth stack before care guidance.'
    };
  }

  const careDrag = v1014laborClamp(
    subjectCare.careDrag * 0.35 +
      careCoupling.safetyDrag * 0.3 +
      careBalance.safetyDrag * 0.25 +
      (subjectCare.band === 'below_care' || careCoupling.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    careCoupling.band === 'amplified' || careCoupling.band === 'elevated'
      ? careCoupling.couplingIndex * 0.2
      : careCoupling.couplingIndex * 0.1;
  const balanceLift =
    careBalance.band === 'rising' || careBalance.band === 'balanced'
      ? careBalance.balanceIndex * 0.18
      : careBalance.balanceIndex * 0.09;
  const subjectLift =
    subjectCare.band === 'care_ready' || subjectCare.band === 'safety_locked'
      ? subjectCare.careIndex * 0.22
      : subjectCare.careIndex * 0.11;

  const careIndex = v1014laborClamp(18 + couplingLift + balanceLift + subjectLift - careDrag);
  const band = careBand(careIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce care — sequence safety-care, care balance, and subject care before post-a9bb07e5 tranche.'
      : band === 'care'
        ? 'Care band — avoid corridor overload that breaks subject care bands.'
        : 'Elevated care — refresh subject care checks each scale wave.';

  return {
    turn: state.turn,
    careIndex,
    band,
    careDrag,
    summary: `National workforce care ${band} (index ${Math.round(careIndex)}); care drag ${Math.round(careDrag)}.`,
    stewardNote
  };
}
