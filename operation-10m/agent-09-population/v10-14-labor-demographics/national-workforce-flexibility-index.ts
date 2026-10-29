import { v1014laborClamp } from './bands';
import {
  type NationalFlexibilityFlowOutlook,
  type NationalInclusionFlexibilityCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalSubjectFlexibilityReadinessBrief,
  type NationalWorkforceFlexibilityIndex,
  type WorkforceFlexibilityBand
} from './types';

function flexibilityBand(index: number): WorkforceFlexibilityBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'flexibility';
}

export function computeNationalWorkforceFlexibilityIndex(
  state: NationalLaborDemographicsState,
  flexibilityCoupling: NationalInclusionFlexibilityCouplingBrief | null | undefined,
  flexibilityFlow: NationalFlexibilityFlowOutlook | null | undefined,
  subjectFlexibility: NationalSubjectFlexibilityReadinessBrief | null | undefined
): NationalWorkforceFlexibilityIndex {
  if (!state.enabled || !flexibilityCoupling || !flexibilityFlow || !subjectFlexibility) {
    return {
      turn: state.turn,
      flexibilityIndex: 50,
      band: 'thin',
      flexibilityDrag: 0,
      summary: 'Workforce flexibility idle — flexibility coupling, flow, or subject flexibility unavailable.',
      stewardNote: 'Compute O10-215 wave-42 depth stack before flexibility guidance.'
    };
  }

  const flexibilityDrag = v1014laborClamp(
    subjectFlexibility.flexibilityDrag * 0.35 +
      flexibilityCoupling.inclusionDrag * 0.3 +
      flexibilityFlow.inclusionDrag * 0.25 +
      (subjectFlexibility.band === 'below_flexibility' || flexibilityCoupling.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    flexibilityCoupling.band === 'amplified' || flexibilityCoupling.band === 'elevated'
      ? flexibilityCoupling.couplingIndex * 0.2
      : flexibilityCoupling.couplingIndex * 0.1;
  const flowLift =
    flexibilityFlow.band === 'rising' || flexibilityFlow.band === 'flowing'
      ? flexibilityFlow.flowIndex * 0.18
      : flexibilityFlow.flowIndex * 0.09;
  const subjectLift =
    subjectFlexibility.band === 'flexibility_ready' || subjectFlexibility.band === 'inclusion_locked'
      ? subjectFlexibility.flexibilityIndex * 0.22
      : subjectFlexibility.flexibilityIndex * 0.11;

  const flexibilityIndex = v1014laborClamp(18 + couplingLift + flowLift + subjectLift - flexibilityDrag);
  const band = flexibilityBand(flexibilityIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce flexibility — sequence inclusion-flexibility, flexibility flow, and subject flexibility before post-431df5d tranche.'
      : band === 'flexibility'
        ? 'Flexibility band — avoid corridor overload that breaks subject flexibility bands.'
        : 'Elevated flexibility — refresh subject flexibility checks each scale wave.';

  return {
    turn: state.turn,
    flexibilityIndex,
    band,
    flexibilityDrag,
    summary: `National workforce flexibility ${band} (index ${Math.round(flexibilityIndex)}); flexibility drag ${Math.round(flexibilityDrag)}.`,
    stewardNote
  };
}
