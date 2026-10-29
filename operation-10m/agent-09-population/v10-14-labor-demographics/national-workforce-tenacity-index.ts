import { v1014laborClamp } from './bands';
import {
  type NationalEnduranceFlexibilityCouplingBrief,
  type NationalInclusionResilienceOutlook,
  type NationalLaborDemographicsState,
  type NationalSubjectCommitReadinessBrief,
  type NationalWorkforceTenacityIndex,
  type WorkforceTenacityBand
} from './types';

function tenacityBand(index: number): WorkforceTenacityBand {
  if (index <= 34) return 'brittle';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'firm';
  return 'fortified';
}

export function computeNationalWorkforceTenacityIndex(
  state: NationalLaborDemographicsState,
  flexibilityCoupling: NationalEnduranceFlexibilityCouplingBrief | null | undefined,
  inclusionResilience: NationalInclusionResilienceOutlook | null | undefined,
  subjectCommit: NationalSubjectCommitReadinessBrief | null | undefined
): NationalWorkforceTenacityIndex {
  if (!state.enabled || !flexibilityCoupling || !inclusionResilience || !subjectCommit) {
    return {
      turn: state.turn,
      tenacityIndex: 50,
      band: 'thin',
      commitDrag: 0,
      summary: 'Workforce tenacity idle — flexibility coupling, inclusion resilience, or subject commit unavailable.',
      stewardNote: 'Compute round-21 depth stack before tenacity guidance.'
    };
  }

  const commitDrag = v1014laborClamp(
    subjectCommit.commitDrag * 0.35 +
      flexibilityCoupling.enduranceDrag * 0.3 +
      inclusionResilience.enduranceDrag * 0.25 +
      (subjectCommit.band === 'held' || flexibilityCoupling.band === 'decoupled' ? 8 : 2)
  );
  const flexibilityLift =
    flexibilityCoupling.band === 'elastic' || flexibilityCoupling.band === 'anchored'
      ? flexibilityCoupling.couplingIndex * 0.2
      : flexibilityCoupling.couplingIndex * 0.1;
  const inclusionLift =
    inclusionResilience.band === 'cohesive' || inclusionResilience.band === 'robust'
      ? inclusionResilience.resilienceIndex * 0.18
      : inclusionResilience.resilienceIndex * 0.09;
  const commitLift =
    subjectCommit.band === 'commit_ready' || subjectCommit.band === 'cleared'
      ? subjectCommit.commitIndex * 0.22
      : subjectCommit.commitIndex * 0.11;

  const tenacityIndex = v1014laborClamp(18 + flexibilityLift + inclusionLift + commitLift - commitDrag);
  const band = tenacityBand(tenacityIndex);

  const stewardNote =
    band === 'brittle' || band === 'thin'
      ? 'Thin workforce tenacity — sequence endurance-flexibility, inclusion, and subject commit before post-99f2e72b tranche.'
      : band === 'fortified'
        ? 'Fortified tenacity — avoid corridor overload that breaks subject commit bands.'
        : 'Firm tenacity — refresh subject commit checks each scale wave.';

  return {
    turn: state.turn,
    tenacityIndex,
    band,
    commitDrag,
    summary: `National workforce tenacity ${band} (index ${Math.round(tenacityIndex)}); commit drag ${Math.round(commitDrag)}.`,
    stewardNote
  };
}
