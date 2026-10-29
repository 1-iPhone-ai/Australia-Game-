import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectAssemblyContinuityBrief,
  type NationalSubjectWorkforceReadinessBrief,
  type NationalWorkforceSustainmentIndex,
  type SubjectAssemblyContinuityBand
} from './types';

function continuityBand(index: number): SubjectAssemblyContinuityBand {
  if (index <= 34) return 'broken';
  if (index <= 48) return 'gapped';
  if (index <= 62) return 'continuous';
  return 'locked';
}

/** Round-18 subject continuity — assembly gate on subject readiness × sustainment. */
export function computeNationalSubjectAssemblyContinuityBrief(
  state: NationalLaborDemographicsState,
  subjectReadiness: NationalSubjectWorkforceReadinessBrief | null | undefined,
  sustainment: NationalWorkforceSustainmentIndex | null | undefined
): NationalSubjectAssemblyContinuityBrief {
  if (!state.enabled || !subjectReadiness || !sustainment) {
    return {
      turn: state.turn,
      continuityIndex: 50,
      band: 'gapped',
      assemblyDrag: 0,
      summary: 'Subject assembly continuity idle — subject readiness or sustainment unavailable.',
      stewardNote: 'Compute subject workforce readiness and sustainment before assembly continuity guidance.'
    };
  }

  const assemblyDrag = v1014laborClamp(
    subjectReadiness.readinessDrag * 0.4 +
      sustainment.subjectDrag * 0.4 +
      (subjectReadiness.band === 'unready' || sustainment.band === 'depleted' ? 12 : 3)
  );
  const subjectLift =
    subjectReadiness.band === 'subject_ready' || subjectReadiness.band === 'primed'
      ? subjectReadiness.subjectReadinessIndex * 0.28
      : subjectReadiness.subjectReadinessIndex * 0.14;
  const sustainmentLift =
    sustainment.band === 'sustained' || sustainment.band === 'resilient'
      ? sustainment.sustainmentIndex * 0.26
      : sustainment.sustainmentIndex * 0.13;

  const continuityIndex = v1014laborClamp(20 + subjectLift + sustainmentLift - assemblyDrag);
  const band = continuityBand(continuityIndex);

  const stewardNote =
    band === 'broken' || band === 'gapped'
      ? 'Gapped subject continuity — pause scale-wave assembly until sustainment and subject readiness align.'
      : band === 'locked'
        ? 'Locked continuity — still monitor onboarding velocity during corridor peaks.'
        : 'Continuous subject band — pair with sustainment-retention coupling each round.';

  return {
    turn: state.turn,
    continuityIndex,
    band,
    assemblyDrag,
    summary: `Subject assembly continuity ${band} (index ${Math.round(continuityIndex)}); assembly drag ${Math.round(assemblyDrag)}.`,
    stewardNote
  };
}
