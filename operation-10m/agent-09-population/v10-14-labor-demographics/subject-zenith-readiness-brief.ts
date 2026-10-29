import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectSummitReadinessBrief,
  type NationalSubjectZenithReadinessBrief,
  type NationalWorkforceSummitIndex,
  type SubjectZenithReadinessBand
} from './types';

function zenithBand(index: number): SubjectZenithReadinessBand {
  if (index <= 34) return 'below_zenith';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'zenith_ready';
  return 'horizon_locked';
}

/** Round-29 / wave-29 subject zenith readiness — summit × workforce summit (O10-189). */
export function computeNationalSubjectZenithReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectSummit: NationalSubjectSummitReadinessBrief | null | undefined,
  workforceSummit: NationalWorkforceSummitIndex | null | undefined
): NationalSubjectZenithReadinessBrief {
  if (!state.enabled || !subjectSummit || !workforceSummit) {
    return {
      turn: state.turn,
      zenithIndex: 50,
      band: 'approaching',
      zenithDrag: 0,
      summary: 'Subject zenith readiness idle — subject summit or workforce summit unavailable.',
      stewardNote: 'Compute subject summit and workforce summit before zenith guidance.'
    };
  }

  const zenithDrag = v1014laborClamp(
    subjectSummit.summitDrag * 0.38 +
      workforceSummit.summitDrag * 0.38 +
      (subjectSummit.band === 'below_summit' || workforceSummit.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectSummit.band === 'summit_ready' || subjectSummit.band === 'zenith_locked'
      ? subjectSummit.summitIndex * 0.27
      : subjectSummit.summitIndex * 0.14;
  const workforceLift =
    workforceSummit.band === 'elevated' || workforceSummit.band === 'zenith'
      ? workforceSummit.summitIndex * 0.25
      : workforceSummit.summitIndex * 0.12;

  const zenithIndex = v1014laborClamp(20 + subjectLift + workforceLift - zenithDrag);
  const band = zenithBand(zenithIndex);

  const stewardNote =
    band === 'below_zenith' || band === 'approaching'
      ? 'Approaching zenith — hold O10-189 wave-29 scale until summit-coordination syncs.'
      : band === 'horizon_locked'
        ? 'Horizon-locked zenith — still monitor coordination horizon during corridor peaks.'
        : 'Zenith-ready — pair with workforce zenith index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    zenithIndex,
    band,
    zenithDrag,
    summary: `Subject zenith readiness ${band} (index ${Math.round(zenithIndex)}); zenith drag ${Math.round(zenithDrag)}.`,
    stewardNote
  };
}
