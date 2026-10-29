import { v1014laborClamp } from './bands';
import {
  type NationalIntegrationRetentionCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalRetentionCohesionOutlook,
  type NationalSubjectRetentionReadinessBrief,
  type NationalWorkforceRetentionIndex,
  type WorkforceRetentionBand
} from './types';

function retentionBand(index: number): WorkforceRetentionBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'retention';
}

export function computeNationalWorkforceRetentionIndex(
  state: NationalLaborDemographicsState,
  retentionCoupling: NationalIntegrationRetentionCouplingBrief | null | undefined,
  retentionCohesion: NationalRetentionCohesionOutlook | null | undefined,
  subjectRetention: NationalSubjectRetentionReadinessBrief | null | undefined
): NationalWorkforceRetentionIndex {
  if (!state.enabled || !retentionCoupling || !retentionCohesion || !subjectRetention) {
    return {
      turn: state.turn,
      retentionIndex: 50,
      band: 'thin',
      retentionDrag: 0,
      summary: 'Workforce retention idle — retention coupling, retention cohesion, or subject retention unavailable.',
      stewardNote: 'Compute O10-205 wave-37 depth stack before retention guidance.'
    };
  }

  const retentionDrag = v1014laborClamp(
    subjectRetention.retentionDrag * 0.35 +
      retentionCoupling.integrationDrag * 0.3 +
      retentionCohesion.integrationDrag * 0.25 +
      (subjectRetention.band === 'below_retention' || retentionCoupling.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    retentionCoupling.band === 'amplified' || retentionCoupling.band === 'elevated'
      ? retentionCoupling.couplingIndex * 0.2
      : retentionCoupling.couplingIndex * 0.1;
  const cohesionLift =
    retentionCohesion.band === 'rising' || retentionCohesion.band === 'cohesion'
      ? retentionCohesion.cohesionIndex * 0.18
      : retentionCohesion.cohesionIndex * 0.09;
  const subjectLift =
    subjectRetention.band === 'retention_ready' || subjectRetention.band === 'integration_locked'
      ? subjectRetention.retentionIndex * 0.22
      : subjectRetention.retentionIndex * 0.11;

  const retentionIndex = v1014laborClamp(18 + couplingLift + cohesionLift + subjectLift - retentionDrag);
  const band = retentionBand(retentionIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce retention — sequence integration-retention, retention cohesion, and subject retention before post-cfb4603 tranche.'
      : band === 'retention'
        ? 'Retention band — avoid corridor overload that breaks subject retention bands.'
        : 'Elevated retention — refresh subject retention checks each scale wave.';

  return {
    turn: state.turn,
    retentionIndex,
    band,
    retentionDrag,
    summary: `National workforce retention ${band} (index ${Math.round(retentionIndex)}); retention drag ${Math.round(retentionDrag)}.`,
    stewardNote
  };
}
