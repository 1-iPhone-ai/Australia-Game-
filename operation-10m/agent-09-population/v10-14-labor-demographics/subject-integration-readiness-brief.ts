import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectIntegrationReadinessBrief,
  type NationalSubjectSynthesisReadinessBrief,
  type NationalWorkforceSynthesisIndex,
  type SubjectIntegrationReadinessBand
} from './types';

function integrationBand(index: number): SubjectIntegrationReadinessBand {
  if (index <= 34) return 'below_integration';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'integration_ready';
  return 'synthesis_locked';
}

/** Round-36 / wave-36 subject integration readiness — synthesis × workforce synthesis (O10-203). */
export function computeNationalSubjectIntegrationReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectSynthesis: NationalSubjectSynthesisReadinessBrief | null | undefined,
  workforceSynthesis: NationalWorkforceSynthesisIndex | null | undefined
): NationalSubjectIntegrationReadinessBrief {
  if (!state.enabled || !subjectSynthesis || !workforceSynthesis) {
    return {
      turn: state.turn,
      integrationIndex: 50,
      band: 'approaching',
      integrationDrag: 0,
      summary: 'Subject integration readiness idle — subject synthesis or workforce synthesis unavailable.',
      stewardNote: 'Compute subject synthesis and workforce synthesis before integration guidance.'
    };
  }

  const integrationDrag = v1014laborClamp(
    subjectSynthesis.synthesisDrag * 0.38 +
      workforceSynthesis.synthesisDrag * 0.38 +
      (subjectSynthesis.band === 'below_synthesis' || workforceSynthesis.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectSynthesis.band === 'synthesis_ready' || subjectSynthesis.band === 'unification_locked'
      ? subjectSynthesis.synthesisIndex * 0.27
      : subjectSynthesis.synthesisIndex * 0.14;
  const workforceLift =
    workforceSynthesis.band === 'elevated' || workforceSynthesis.band === 'synthesis'
      ? workforceSynthesis.synthesisIndex * 0.25
      : workforceSynthesis.synthesisIndex * 0.12;

  const integrationIndex = v1014laborClamp(20 + subjectLift + workforceLift - integrationDrag);
  const band = integrationBand(integrationIndex);

  const stewardNote =
    band === 'below_integration' || band === 'approaching'
      ? 'Approaching integration — hold O10-203 wave-36 scale until synthesis-onboarding syncs.'
      : band === 'synthesis_locked'
        ? 'Synthesis-locked integration — still monitor onboarding integration during corridor peaks.'
        : 'Integration-ready — pair with workforce integration index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    integrationIndex,
    band,
    integrationDrag,
    summary: `Subject integration readiness ${band} (index ${Math.round(integrationIndex)}); integration drag ${Math.round(integrationDrag)}.`,
    stewardNote
  };
}
