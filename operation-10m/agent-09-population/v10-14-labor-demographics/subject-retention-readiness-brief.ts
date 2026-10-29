import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectIntegrationReadinessBrief,
  type NationalSubjectRetentionReadinessBrief,
  type NationalWorkforceIntegrationIndex,
  type SubjectRetentionReadinessBand
} from './types';

function retentionBand(index: number): SubjectRetentionReadinessBand {
  if (index <= 34) return 'below_retention';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'retention_ready';
  return 'integration_locked';
}

/** Round-37 / wave-37 subject retention readiness — integration × workforce integration (O10-205). */
export function computeNationalSubjectRetentionReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectIntegration: NationalSubjectIntegrationReadinessBrief | null | undefined,
  workforceIntegration: NationalWorkforceIntegrationIndex | null | undefined
): NationalSubjectRetentionReadinessBrief {
  if (!state.enabled || !subjectIntegration || !workforceIntegration) {
    return {
      turn: state.turn,
      retentionIndex: 50,
      band: 'approaching',
      retentionDrag: 0,
      summary: 'Subject retention readiness idle — subject integration or workforce integration unavailable.',
      stewardNote: 'Compute subject integration and workforce integration before retention guidance.'
    };
  }

  const retentionDrag = v1014laborClamp(
    subjectIntegration.integrationDrag * 0.38 +
      workforceIntegration.integrationDrag * 0.38 +
      (subjectIntegration.band === 'below_integration' || workforceIntegration.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectIntegration.band === 'integration_ready' || subjectIntegration.band === 'synthesis_locked'
      ? subjectIntegration.integrationIndex * 0.27
      : subjectIntegration.integrationIndex * 0.14;
  const workforceLift =
    workforceIntegration.band === 'elevated' || workforceIntegration.band === 'integration'
      ? workforceIntegration.integrationIndex * 0.25
      : workforceIntegration.integrationIndex * 0.12;

  const retentionIndex = v1014laborClamp(20 + subjectLift + workforceLift - retentionDrag);
  const band = retentionBand(retentionIndex);

  const stewardNote =
    band === 'below_retention' || band === 'approaching'
      ? 'Approaching retention — hold O10-205 wave-37 scale until integration-retention syncs.'
      : band === 'integration_locked'
        ? 'Integration-locked retention — still monitor retention cohesion during corridor peaks.'
        : 'Retention-ready — pair with workforce retention index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    retentionIndex,
    band,
    retentionDrag,
    summary: `Subject retention readiness ${band} (index ${Math.round(retentionIndex)}); retention drag ${Math.round(retentionDrag)}.`,
    stewardNote
  };
}
