import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectAssemblyContinuityBrief,
  type NationalSubjectWaveAssemblyBrief,
  type NationalWorkforceContinuityIndex,
  type SubjectWaveAssemblyBand
} from './types';

function assemblyBand(index: number): SubjectWaveAssemblyBand {
  if (index <= 34) return 'blocked';
  if (index <= 48) return 'gapped';
  if (index <= 62) return 'ready';
  return 'cleared';
}

/** Round-19 subject wave assembly — continuity stack gate for scale-wave commits. */
export function computeNationalSubjectWaveAssemblyBrief(
  state: NationalLaborDemographicsState,
  subjectContinuity: NationalSubjectAssemblyContinuityBrief | null | undefined,
  continuity: NationalWorkforceContinuityIndex | null | undefined
): NationalSubjectWaveAssemblyBrief {
  if (!state.enabled || !subjectContinuity || !continuity) {
    return {
      turn: state.turn,
      assemblyIndex: 50,
      band: 'gapped',
      waveDrag: 0,
      summary: 'Subject wave assembly idle — subject continuity or workforce continuity unavailable.',
      stewardNote: 'Compute subject assembly continuity and workforce continuity before wave assembly guidance.'
    };
  }

  const waveDrag = v1014laborClamp(
    subjectContinuity.assemblyDrag * 0.38 +
      continuity.assemblyDrag * 0.38 +
      (subjectContinuity.band === 'broken' || continuity.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectContinuity.band === 'continuous' || subjectContinuity.band === 'locked'
      ? subjectContinuity.continuityIndex * 0.27
      : subjectContinuity.continuityIndex * 0.14;
  const continuityLift =
    continuity.band === 'stable' || continuity.band === 'durable'
      ? continuity.continuityIndex * 0.25
      : continuity.continuityIndex * 0.12;

  const assemblyIndex = v1014laborClamp(20 + subjectLift + continuityLift - waveDrag);
  const band = assemblyBand(assemblyIndex);

  const stewardNote =
    band === 'blocked' || band === 'gapped'
      ? 'Gapped subject wave assembly — hold O10-168 scale commits until continuity-coordination syncs.'
      : band === 'cleared'
        ? 'Cleared wave assembly — still monitor reengagement momentum during seasonal peaks.'
        : 'Ready wave band — pair with workforce durability index each assembly tranche.';

  return {
    turn: state.turn,
    assemblyIndex,
    band,
    waveDrag,
    summary: `Subject wave assembly ${band} (index ${Math.round(assemblyIndex)}); wave drag ${Math.round(waveDrag)}.`,
    stewardNote
  };
}
