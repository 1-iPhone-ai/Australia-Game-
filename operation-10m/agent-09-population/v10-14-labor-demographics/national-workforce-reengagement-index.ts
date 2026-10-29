import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalRetentionReengagementCouplingBrief,
  type NationalReengagementAlignmentOutlook,
  type NationalSubjectReengagementReadinessBrief,
  type NationalWorkforceReengagementIndex,
  type WorkforceReengagementBand
} from './types';

function reengagementBand(index: number): WorkforceReengagementBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'reengagement';
}

export function computeNationalWorkforceReengagementIndex(
  state: NationalLaborDemographicsState,
  reengagementCoupling: NationalRetentionReengagementCouplingBrief | null | undefined,
  reengagementAlignment: NationalReengagementAlignmentOutlook | null | undefined,
  subjectReengagement: NationalSubjectReengagementReadinessBrief | null | undefined
): NationalWorkforceReengagementIndex {
  if (!state.enabled || !reengagementCoupling || !reengagementAlignment || !subjectReengagement) {
    return {
      turn: state.turn,
      reengagementIndex: 50,
      band: 'thin',
      reengagementDrag: 0,
      summary: 'Workforce reengagement idle — reengagement coupling, alignment, or subject reengagement unavailable.',
      stewardNote: 'Compute O10-207 wave-38 depth stack before reengagement guidance.'
    };
  }

  const reengagementDrag = v1014laborClamp(
    subjectReengagement.reengagementDrag * 0.35 +
      reengagementCoupling.retentionDrag * 0.3 +
      reengagementAlignment.retentionDrag * 0.25 +
      (subjectReengagement.band === 'below_reengagement' || reengagementCoupling.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    reengagementCoupling.band === 'amplified' || reengagementCoupling.band === 'elevated'
      ? reengagementCoupling.couplingIndex * 0.2
      : reengagementCoupling.couplingIndex * 0.1;
  const alignmentLift =
    reengagementAlignment.band === 'rising' || reengagementAlignment.band === 'aligned'
      ? reengagementAlignment.alignmentIndex * 0.18
      : reengagementAlignment.alignmentIndex * 0.09;
  const subjectLift =
    subjectReengagement.band === 'reengagement_ready' || subjectReengagement.band === 'retention_locked'
      ? subjectReengagement.reengagementIndex * 0.22
      : subjectReengagement.reengagementIndex * 0.11;

  const reengagementIndex = v1014laborClamp(18 + couplingLift + alignmentLift + subjectLift - reengagementDrag);
  const band = reengagementBand(reengagementIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce reengagement — sequence retention-reengagement, reengagement alignment, and subject reengagement before post-b44b36f tranche.'
      : band === 'reengagement'
        ? 'Reengagement band — avoid corridor overload that breaks subject reengagement bands.'
        : 'Elevated reengagement — refresh subject reengagement checks each scale wave.';

  return {
    turn: state.turn,
    reengagementIndex,
    band,
    reengagementDrag,
    summary: `National workforce reengagement ${band} (index ${Math.round(reengagementIndex)}); reengagement drag ${Math.round(reengagementDrag)}.`,
    stewardNote
  };
}
