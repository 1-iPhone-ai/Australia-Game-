import { v1014laborClamp } from './bands';
import {
  type NationalFortitudeInclusionCouplingBrief,
  type NationalHybridAnchorOutlook,
  type NationalLaborDemographicsState,
  type NationalSubjectCrownReadinessBrief,
  type NationalWorkforceCulminationIndex,
  type WorkforceCulminationBand
} from './types';

function culminationBand(index: number): WorkforceCulminationBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'ready';
  return 'summit';
}

export function computeNationalWorkforceCulminationIndex(
  state: NationalLaborDemographicsState,
  inclusionCoupling: NationalFortitudeInclusionCouplingBrief | null | undefined,
  hybridAnchor: NationalHybridAnchorOutlook | null | undefined,
  subjectCrown: NationalSubjectCrownReadinessBrief | null | undefined
): NationalWorkforceCulminationIndex {
  if (!state.enabled || !inclusionCoupling || !hybridAnchor || !subjectCrown) {
    return {
      turn: state.turn,
      culminationIndex: 50,
      band: 'thin',
      crownDrag: 0,
      summary: 'Workforce culmination idle — inclusion coupling, hybrid anchor, or subject crown unavailable.',
      stewardNote: 'Compute round-25 depth stack before culmination guidance.'
    };
  }

  const crownDrag = v1014laborClamp(
    subjectCrown.crownDrag * 0.35 +
      inclusionCoupling.fortitudeDrag * 0.3 +
      hybridAnchor.bindDrag * 0.25 +
      (subjectCrown.band === 'uncrowned' || inclusionCoupling.band === 'decoupled' ? 8 : 2)
  );
  const inclusionLift =
    inclusionCoupling.band === 'inclusive' || inclusionCoupling.band === 'elevated'
      ? inclusionCoupling.couplingIndex * 0.2
      : inclusionCoupling.couplingIndex * 0.1;
  const anchorLift =
    hybridAnchor.band === 'anchored' || hybridAnchor.band === 'fixed'
      ? hybridAnchor.anchorIndex * 0.18
      : hybridAnchor.anchorIndex * 0.09;
  const crownLift =
    subjectCrown.band === 'crowned' || subjectCrown.band === 'sealed'
      ? subjectCrown.crownIndex * 0.22
      : subjectCrown.crownIndex * 0.11;

  const culminationIndex = v1014laborClamp(18 + inclusionLift + anchorLift + crownLift - crownDrag);
  const band = culminationBand(culminationIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce culmination — sequence fortitude-inclusion, hybrid anchor, and subject crown before post-8d741ac7 tranche.'
      : band === 'summit'
        ? 'Summit culmination — avoid corridor overload that breaks subject crown bands.'
        : 'Ready culmination — refresh subject crown checks before Agent 25 chunk merge.';

  return {
    turn: state.turn,
    culminationIndex,
    band,
    crownDrag,
    summary: `National workforce culmination ${band} (index ${Math.round(culminationIndex)}); crown drag ${Math.round(crownDrag)}.`,
    stewardNote
  };
}
