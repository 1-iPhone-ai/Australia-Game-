import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalOnboardingIntegrationOutlook,
  type NationalSubjectIntegrationReadinessBrief,
  type NationalSynthesisOnboardingCouplingBrief,
  type NationalWorkforceIntegrationIndex,
  type WorkforceIntegrationBand
} from './types';

function integrationBand(index: number): WorkforceIntegrationBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'integration';
}

export function computeNationalWorkforceIntegrationIndex(
  state: NationalLaborDemographicsState,
  onboardingCoupling: NationalSynthesisOnboardingCouplingBrief | null | undefined,
  onboardingIntegration: NationalOnboardingIntegrationOutlook | null | undefined,
  subjectIntegration: NationalSubjectIntegrationReadinessBrief | null | undefined
): NationalWorkforceIntegrationIndex {
  if (!state.enabled || !onboardingCoupling || !onboardingIntegration || !subjectIntegration) {
    return {
      turn: state.turn,
      integrationIndex: 50,
      band: 'thin',
      integrationDrag: 0,
      summary: 'Workforce integration idle — onboarding coupling, onboarding integration, or subject integration unavailable.',
      stewardNote: 'Compute O10-203 wave-36 depth stack before integration guidance.'
    };
  }

  const integrationDrag = v1014laborClamp(
    subjectIntegration.integrationDrag * 0.35 +
      onboardingCoupling.synthesisDrag * 0.3 +
      onboardingIntegration.synthesisDrag * 0.25 +
      (subjectIntegration.band === 'below_integration' || onboardingCoupling.band === 'decoupled' ? 8 : 2)
  );
  const onboardingLift =
    onboardingCoupling.band === 'amplified' || onboardingCoupling.band === 'elevated'
      ? onboardingCoupling.couplingIndex * 0.2
      : onboardingCoupling.couplingIndex * 0.1;
  const outlookLift =
    onboardingIntegration.band === 'rising' || onboardingIntegration.band === 'integration'
      ? onboardingIntegration.integrationIndex * 0.18
      : onboardingIntegration.integrationIndex * 0.09;
  const subjectLift =
    subjectIntegration.band === 'integration_ready' || subjectIntegration.band === 'synthesis_locked'
      ? subjectIntegration.integrationIndex * 0.22
      : subjectIntegration.integrationIndex * 0.11;

  const integrationIndex = v1014laborClamp(18 + onboardingLift + outlookLift + subjectLift - integrationDrag);
  const band = integrationBand(integrationIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce integration — sequence synthesis-onboarding, onboarding integration, and subject integration before post-ea2bb03 tranche.'
      : band === 'integration'
        ? 'Integration band — avoid corridor overload that breaks subject integration bands.'
        : 'Elevated integration — refresh subject integration checks each scale wave.';

  return {
    turn: state.turn,
    integrationIndex,
    band,
    integrationDrag,
    summary: `National workforce integration ${band} (index ${Math.round(integrationIndex)}); integration drag ${Math.round(integrationDrag)}.`,
    stewardNote
  };
}
