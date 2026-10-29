import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalPinnacleRetentionCouplingBrief,
  type NationalRetentionCrestOutlook,
  type NationalSubjectSummitReadinessBrief,
  type NationalWorkforceSummitIndex,
  type WorkforceSummitBand
} from './types';

function summitBand(index: number): WorkforceSummitBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'zenith';
}

export function computeNationalWorkforceSummitIndex(
  state: NationalLaborDemographicsState,
  retentionCoupling: NationalPinnacleRetentionCouplingBrief | null | undefined,
  retentionCrest: NationalRetentionCrestOutlook | null | undefined,
  subjectSummit: NationalSubjectSummitReadinessBrief | null | undefined
): NationalWorkforceSummitIndex {
  if (!state.enabled || !retentionCoupling || !retentionCrest || !subjectSummit) {
    return {
      turn: state.turn,
      summitIndex: 50,
      band: 'thin',
      summitDrag: 0,
      summary: 'Workforce summit idle — retention coupling, retention crest, or subject summit unavailable.',
      stewardNote: 'Compute O10-187 wave-28 depth stack before summit guidance.'
    };
  }

  const summitDrag = v1014laborClamp(
    subjectSummit.summitDrag * 0.35 +
      retentionCoupling.pinnacleDrag * 0.3 +
      retentionCrest.thrustDrag * 0.25 +
      (subjectSummit.band === 'below_summit' || retentionCoupling.band === 'decoupled' ? 8 : 2)
  );
  const retentionLift =
    retentionCoupling.band === 'amplified' || retentionCoupling.band === 'elevated'
      ? retentionCoupling.couplingIndex * 0.2
      : retentionCoupling.couplingIndex * 0.1;
  const crestLift =
    retentionCrest.band === 'rising' || retentionCrest.band === 'cresting'
      ? retentionCrest.crestIndex * 0.18
      : retentionCrest.crestIndex * 0.09;
  const subjectLift =
    subjectSummit.band === 'summit_ready' || subjectSummit.band === 'zenith_locked'
      ? subjectSummit.summitIndex * 0.22
      : subjectSummit.summitIndex * 0.11;

  const summitIndex = v1014laborClamp(18 + retentionLift + crestLift + subjectLift - summitDrag);
  const band = summitBand(summitIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce summit — sequence pinnacle-retention, retention crest, and subject summit before post-b9e129bd tranche.'
      : band === 'zenith'
        ? 'Zenith summit — avoid corridor overload that breaks subject summit bands.'
        : 'Elevated summit — refresh subject summit checks each scale wave.';

  return {
    turn: state.turn,
    summitIndex,
    band,
    summitDrag,
    summary: `National workforce summit ${band} (index ${Math.round(summitIndex)}); summit drag ${Math.round(summitDrag)}.`,
    stewardNote
  };
}
