import { v1014laborClamp } from './bands';
import {
  type NationalIntegratedLaborReadinessOutlook,
  type NationalLaborDemographicsState,
  type NationalRetentionReliabilityCouplingBrief,
  type NationalSubjectWorkforceReadinessBrief,
  type SubjectWorkforceReadinessBand
} from './types';

function readinessBand(index: number): SubjectWorkforceReadinessBand {
  if (index <= 34) return 'unready';
  if (index <= 48) return 'caution';
  if (index <= 62) return 'subject_ready';
  return 'primed';
}

/** Round-17 subject readiness — assembly-facing gate on reliability + retention + integrated readiness. */
export function computeNationalSubjectWorkforceReadinessBrief(
  state: NationalLaborDemographicsState,
  retentionCoupling: NationalRetentionReliabilityCouplingBrief | null | undefined,
  integratedReadiness: NationalIntegratedLaborReadinessOutlook | null | undefined
): NationalSubjectWorkforceReadinessBrief {
  if (!state.enabled || !retentionCoupling || !integratedReadiness) {
    return {
      turn: state.turn,
      subjectReadinessIndex: 50,
      band: 'caution',
      readinessDrag: 0,
      summary: 'Subject workforce readiness idle — retention coupling or integrated readiness unavailable.',
      stewardNote: 'Compute retention-reliability coupling and integrated readiness before subject guidance.'
    };
  }

  const readinessDrag = v1014laborClamp(
    integratedReadiness.stabilityDrag * 0.45 +
      retentionCoupling.reliabilityDrag * 0.35 +
      (integratedReadiness.band === 'unprepared' || integratedReadiness.band === 'caution' ? 10 : 2)
  );
  const retentionLift =
    retentionCoupling.band === 'anchored' || retentionCoupling.band === 'reinforced'
      ? retentionCoupling.couplingIndex * 0.28
      : retentionCoupling.couplingIndex * 0.14;
  const integratedLift =
    integratedReadiness.band === 'ready' || integratedReadiness.band === 'primed'
      ? integratedReadiness.readinessIndex * 0.3
      : integratedReadiness.readinessIndex * 0.16;

  const subjectReadinessIndex = v1014laborClamp(22 + retentionLift + integratedLift - readinessDrag);
  const band = readinessBand(subjectReadinessIndex);

  const stewardNote =
    band === 'unready' || band === 'caution'
      ? 'Subject readiness caution — stabilize retention-reliability before Agent 25 assembly wave commits.'
      : band === 'primed'
        ? 'Primed subject readiness — still verify upskilling velocity before auto workforce pushes.'
        : 'Subject-ready band — monitor sustainment index during seasonal peaks.';

  return {
    turn: state.turn,
    subjectReadinessIndex,
    band,
    readinessDrag,
    summary: `Subject workforce readiness ${band} (index ${Math.round(subjectReadinessIndex)}); readiness drag ${Math.round(readinessDrag)}.`,
    stewardNote
  };
}
