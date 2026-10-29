import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectWorkforceReadinessBrief,
  type NationalUpskillingVelocityOutlook,
  type NationalWorkforceReliabilityIndex,
  type NationalWorkforceSustainmentIndex,
  type WorkforceSustainmentBand
} from './types';

function sustainmentBand(index: number): WorkforceSustainmentBand {
  if (index <= 34) return 'depleted';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'sustained';
  return 'resilient';
}

export function computeNationalWorkforceSustainmentIndex(
  state: NationalLaborDemographicsState,
  reliability: NationalWorkforceReliabilityIndex | null | undefined,
  upskillingVelocity: NationalUpskillingVelocityOutlook | null | undefined,
  subjectReadiness: NationalSubjectWorkforceReadinessBrief | null | undefined
): NationalWorkforceSustainmentIndex {
  if (!state.enabled || !reliability || !upskillingVelocity || !subjectReadiness) {
    return {
      turn: state.turn,
      sustainmentIndex: 50,
      band: 'thin',
      subjectDrag: 0,
      summary: 'Workforce sustainment idle — reliability, upskilling velocity, or subject readiness unavailable.',
      stewardNote: 'Compute round-17 depth stack before sustainment guidance.'
    };
  }

  const subjectDrag = v1014laborClamp(
    subjectReadiness.readinessDrag * 0.4 +
      upskillingVelocity.mismatchDrag * 0.35 +
      (subjectReadiness.band === 'unready' || subjectReadiness.band === 'caution' ? 8 : 2)
  );
  const reliabilityLift =
    reliability.band === 'reliable' || reliability.band === 'robust'
      ? reliability.reliabilityIndex * 0.22
      : reliability.reliabilityIndex * 0.11;
  const velocityLift =
    upskillingVelocity.band === 'active' || upskillingVelocity.band === 'accelerating'
      ? upskillingVelocity.velocityIndex * 0.2
      : upskillingVelocity.velocityIndex * 0.1;
  const subjectLift =
    subjectReadiness.band === 'subject_ready' || subjectReadiness.band === 'primed'
      ? subjectReadiness.subjectReadinessIndex * 0.24
      : subjectReadiness.subjectReadinessIndex * 0.12;

  const sustainmentIndex = v1014laborClamp(20 + reliabilityLift + velocityLift + subjectLift - subjectDrag);
  const band = sustainmentBand(sustainmentIndex);

  const stewardNote =
    band === 'depleted' || band === 'thin'
      ? 'Thin sustainment — sequence retention, upskilling, and subject readiness before scale-wave assembly.'
      : band === 'resilient'
        ? 'Resilient sustainment — avoid corridor overload that drains reliability pools.'
        : 'Sustained band — pair subject readiness checks with seasonal scheduling relief.';

  return {
    turn: state.turn,
    sustainmentIndex,
    band,
    subjectDrag,
    summary: `National workforce sustainment ${band} (index ${Math.round(sustainmentIndex)}); subject drag ${Math.round(subjectDrag)}.`,
    stewardNote
  };
}
