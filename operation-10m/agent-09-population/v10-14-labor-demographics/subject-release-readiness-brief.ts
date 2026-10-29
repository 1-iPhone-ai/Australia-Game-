import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectCommitReadinessBrief,
  type NationalSubjectReleaseReadinessBrief,
  type NationalWorkforceTenacityIndex,
  type SubjectReleaseReadinessBand
} from './types';

function releaseBand(index: number): SubjectReleaseReadinessBand {
  if (index <= 34) return 'held';
  if (index <= 48) return 'staged';
  if (index <= 62) return 'release_ready';
  return 'cleared';
}

/** Round-22 subject release readiness — commit × tenacity gate for scale release. */
export function computeNationalSubjectReleaseReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectCommit: NationalSubjectCommitReadinessBrief | null | undefined,
  tenacity: NationalWorkforceTenacityIndex | null | undefined
): NationalSubjectReleaseReadinessBrief {
  if (!state.enabled || !subjectCommit || !tenacity) {
    return {
      turn: state.turn,
      releaseIndex: 50,
      band: 'staged',
      releaseDrag: 0,
      summary: 'Subject release readiness idle — subject commit or tenacity unavailable.',
      stewardNote: 'Compute subject commit readiness and workforce tenacity before release guidance.'
    };
  }

  const releaseDrag = v1014laborClamp(
    subjectCommit.commitDrag * 0.38 +
      tenacity.commitDrag * 0.38 +
      (subjectCommit.band === 'held' || tenacity.band === 'brittle' ? 12 : 3)
  );
  const commitLift =
    subjectCommit.band === 'commit_ready' || subjectCommit.band === 'cleared'
      ? subjectCommit.commitIndex * 0.27
      : subjectCommit.commitIndex * 0.14;
  const tenacityLift =
    tenacity.band === 'firm' || tenacity.band === 'fortified'
      ? tenacity.tenacityIndex * 0.25
      : tenacity.tenacityIndex * 0.12;

  const releaseIndex = v1014laborClamp(20 + commitLift + tenacityLift - releaseDrag);
  const band = releaseBand(releaseIndex);

  const stewardNote =
    band === 'held' || band === 'staged'
      ? 'Staged release readiness — hold O10-175 scale release until tenacity-care syncs.'
      : band === 'cleared'
        ? 'Cleared release band — still monitor safety cohesion during corridor peaks.'
        : 'Release-ready — pair with workforce steadfast index each assembly tranche.';

  return {
    turn: state.turn,
    releaseIndex,
    band,
    releaseDrag,
    summary: `Subject release readiness ${band} (index ${Math.round(releaseIndex)}); release drag ${Math.round(releaseDrag)}.`,
    stewardNote
  };
}
