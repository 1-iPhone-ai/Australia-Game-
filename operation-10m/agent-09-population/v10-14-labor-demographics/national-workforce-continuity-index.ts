import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalOnboardingVelocityOutlook,
  type NationalSubjectAssemblyContinuityBrief,
  type NationalSustainmentRetentionCouplingBrief,
  type NationalWorkforceContinuityIndex,
  type WorkforceContinuityBand
} from './types';

function continuityBand(index: number): WorkforceContinuityBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'stable';
  return 'durable';
}

export function computeNationalWorkforceContinuityIndex(
  state: NationalLaborDemographicsState,
  sustainmentCoupling: NationalSustainmentRetentionCouplingBrief | null | undefined,
  onboardingVelocity: NationalOnboardingVelocityOutlook | null | undefined,
  subjectContinuity: NationalSubjectAssemblyContinuityBrief | null | undefined
): NationalWorkforceContinuityIndex {
  if (!state.enabled || !sustainmentCoupling || !onboardingVelocity || !subjectContinuity) {
    return {
      turn: state.turn,
      continuityIndex: 50,
      band: 'thin',
      assemblyDrag: 0,
      summary: 'Workforce continuity idle — sustainment coupling, onboarding velocity, or subject continuity unavailable.',
      stewardNote: 'Compute round-18 depth stack before continuity guidance.'
    };
  }

  const assemblyDrag = v1014laborClamp(
    subjectContinuity.assemblyDrag * 0.35 +
      sustainmentCoupling.sustainmentDrag * 0.3 +
      onboardingVelocity.pipelineDrag * 0.25 +
      (subjectContinuity.band === 'broken' || sustainmentCoupling.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    sustainmentCoupling.band === 'linked' || sustainmentCoupling.band === 'reinforced'
      ? sustainmentCoupling.couplingIndex * 0.2
      : sustainmentCoupling.couplingIndex * 0.1;
  const onboardingLift =
    onboardingVelocity.band === 'steady' || onboardingVelocity.band === 'surging'
      ? onboardingVelocity.velocityIndex * 0.18
      : onboardingVelocity.velocityIndex * 0.09;
  const subjectLift =
    subjectContinuity.band === 'continuous' || subjectContinuity.band === 'locked'
      ? subjectContinuity.continuityIndex * 0.22
      : subjectContinuity.continuityIndex * 0.11;

  const continuityIndex = v1014laborClamp(18 + couplingLift + onboardingLift + subjectLift - assemblyDrag);
  const band = continuityBand(continuityIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce continuity — sequence sustainment-retention, onboarding, and subject assembly before O10-167.'
      : band === 'durable'
        ? 'Durable continuity — avoid corridor overload that breaks subject assembly bands.'
        : 'Stable continuity — refresh subject assembly checks each scale wave.';

  return {
    turn: state.turn,
    continuityIndex,
    band,
    assemblyDrag,
    summary: `National workforce continuity ${band} (index ${Math.round(continuityIndex)}); assembly drag ${Math.round(assemblyDrag)}.`,
    stewardNote
  };
}
