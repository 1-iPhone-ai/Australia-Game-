import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectCommitReadinessBrief,
  type NationalSubjectTrancheReadinessBrief,
  type NationalWorkforceEnduranceIndex,
  type SubjectCommitReadinessBand
} from './types';

function commitBand(index: number): SubjectCommitReadinessBand {
  if (index <= 34) return 'held';
  if (index <= 48) return 'review';
  if (index <= 62) return 'commit_ready';
  return 'cleared';
}

/** Round-21 subject commit readiness — tranche × endurance gate for scale commits. */
export function computeNationalSubjectCommitReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectTranche: NationalSubjectTrancheReadinessBrief | null | undefined,
  endurance: NationalWorkforceEnduranceIndex | null | undefined
): NationalSubjectCommitReadinessBrief {
  if (!state.enabled || !subjectTranche || !endurance) {
    return {
      turn: state.turn,
      commitIndex: 50,
      band: 'review',
      commitDrag: 0,
      summary: 'Subject commit readiness idle — subject tranche or endurance unavailable.',
      stewardNote: 'Compute subject tranche readiness and workforce endurance before commit guidance.'
    };
  }

  const commitDrag = v1014laborClamp(
    subjectTranche.trancheDrag * 0.38 +
      endurance.trancheDrag * 0.38 +
      (subjectTranche.band === 'blocked' || endurance.band === 'fragile' ? 12 : 3)
  );
  const trancheLift =
    subjectTranche.band === 'tranche_ready' || subjectTranche.band === 'cleared'
      ? subjectTranche.trancheIndex * 0.27
      : subjectTranche.trancheIndex * 0.14;
  const enduranceLift =
    endurance.band === 'steady' || endurance.band === 'hardened'
      ? endurance.enduranceIndex * 0.25
      : endurance.enduranceIndex * 0.12;

  const commitIndex = v1014laborClamp(20 + trancheLift + enduranceLift - commitDrag);
  const band = commitBand(commitIndex);

  const stewardNote =
    band === 'held' || band === 'review'
      ? 'Review commit readiness — hold O10-173 scale commits until endurance-flexibility syncs.'
      : band === 'cleared'
        ? 'Cleared commit band — still monitor inclusion resilience during corridor peaks.'
        : 'Commit-ready — pair with workforce tenacity index each assembly tranche.';

  return {
    turn: state.turn,
    commitIndex,
    band,
    commitDrag,
    summary: `Subject commit readiness ${band} (index ${Math.round(commitIndex)}); commit drag ${Math.round(commitDrag)}.`,
    stewardNote
  };
}
