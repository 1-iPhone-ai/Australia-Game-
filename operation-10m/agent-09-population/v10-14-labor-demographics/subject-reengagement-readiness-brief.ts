import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectReengagementReadinessBrief,
  type NationalSubjectRetentionReadinessBrief,
  type NationalWorkforceRetentionIndex,
  type SubjectReengagementReadinessBand
} from './types';

function reengagementBand(index: number): SubjectReengagementReadinessBand {
  if (index <= 34) return 'below_reengagement';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'reengagement_ready';
  return 'retention_locked';
}

/** Round-38 / wave-38 subject reengagement readiness — retention × workforce retention (O10-207). */
export function computeNationalSubjectReengagementReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectRetention: NationalSubjectRetentionReadinessBrief | null | undefined,
  workforceRetention: NationalWorkforceRetentionIndex | null | undefined
): NationalSubjectReengagementReadinessBrief {
  if (!state.enabled || !subjectRetention || !workforceRetention) {
    return {
      turn: state.turn,
      reengagementIndex: 50,
      band: 'approaching',
      reengagementDrag: 0,
      summary: 'Subject reengagement readiness idle — subject retention or workforce retention unavailable.',
      stewardNote: 'Compute subject retention and workforce retention before reengagement guidance.'
    };
  }

  const reengagementDrag = v1014laborClamp(
    subjectRetention.retentionDrag * 0.38 +
      workforceRetention.retentionDrag * 0.38 +
      (subjectRetention.band === 'below_retention' || workforceRetention.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectRetention.band === 'retention_ready' || subjectRetention.band === 'integration_locked'
      ? subjectRetention.retentionIndex * 0.27
      : subjectRetention.retentionIndex * 0.14;
  const workforceLift =
    workforceRetention.band === 'elevated' || workforceRetention.band === 'retention'
      ? workforceRetention.retentionIndex * 0.25
      : workforceRetention.retentionIndex * 0.12;

  const reengagementIndex = v1014laborClamp(20 + subjectLift + workforceLift - reengagementDrag);
  const band = reengagementBand(reengagementIndex);

  const stewardNote =
    band === 'below_reengagement' || band === 'approaching'
      ? 'Approaching reengagement — hold O10-207 wave-38 scale until retention-reengagement syncs.'
      : band === 'retention_locked'
        ? 'Retention-locked reengagement — still monitor reengagement alignment during corridor peaks.'
        : 'Reengagement-ready — pair with workforce reengagement index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    reengagementIndex,
    band,
    reengagementDrag,
    summary: `Subject reengagement readiness ${band} (index ${Math.round(reengagementIndex)}); reengagement drag ${Math.round(reengagementDrag)}.`,
    stewardNote
  };
}
