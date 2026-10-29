import { v1014laborClamp } from './bands';
import {
  type NationalAdvocacyInclusionCouplingBrief,
  type NationalInclusionEquityOutlook,
  type NationalLaborDemographicsState,
  type NationalSubjectInclusionReadinessBrief,
  type NationalWorkforceInclusionIndex,
  type WorkforceInclusionBand
} from './types';

function inclusionBand(index: number): WorkforceInclusionBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'inclusion';
}

export function computeNationalWorkforceInclusionIndex(
  state: NationalLaborDemographicsState,
  inclusionCoupling: NationalAdvocacyInclusionCouplingBrief | null | undefined,
  inclusionEquity: NationalInclusionEquityOutlook | null | undefined,
  subjectInclusion: NationalSubjectInclusionReadinessBrief | null | undefined
): NationalWorkforceInclusionIndex {
  if (!state.enabled || !inclusionCoupling || !inclusionEquity || !subjectInclusion) {
    return {
      turn: state.turn,
      inclusionIndex: 50,
      band: 'thin',
      inclusionDrag: 0,
      summary: 'Workforce inclusion idle — inclusion coupling, equity, or subject inclusion unavailable.',
      stewardNote: 'Compute O10-213 wave-41 depth stack before inclusion guidance.'
    };
  }

  const inclusionDrag = v1014laborClamp(
    subjectInclusion.inclusionDrag * 0.35 +
      inclusionCoupling.advocacyDrag * 0.3 +
      inclusionEquity.advocacyDrag * 0.25 +
      (subjectInclusion.band === 'below_inclusion' || inclusionCoupling.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    inclusionCoupling.band === 'amplified' || inclusionCoupling.band === 'elevated'
      ? inclusionCoupling.couplingIndex * 0.2
      : inclusionCoupling.couplingIndex * 0.1;
  const equityLift =
    inclusionEquity.band === 'rising' || inclusionEquity.band === 'equitable'
      ? inclusionEquity.equityIndex * 0.18
      : inclusionEquity.equityIndex * 0.09;
  const subjectLift =
    subjectInclusion.band === 'inclusion_ready' || subjectInclusion.band === 'advocacy_locked'
      ? subjectInclusion.inclusionIndex * 0.22
      : subjectInclusion.inclusionIndex * 0.11;

  const inclusionIndex = v1014laborClamp(18 + couplingLift + equityLift + subjectLift - inclusionDrag);
  const band = inclusionBand(inclusionIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce inclusion — sequence advocacy-inclusion, inclusion equity, and subject inclusion before post-875d6f3 tranche.'
      : band === 'inclusion'
        ? 'Inclusion band — avoid corridor overload that breaks subject inclusion bands.'
        : 'Elevated inclusion — refresh subject inclusion checks each scale wave.';

  return {
    turn: state.turn,
    inclusionIndex,
    band,
    inclusionDrag,
    summary: `National workforce inclusion ${band} (index ${Math.round(inclusionIndex)}); inclusion drag ${Math.round(inclusionDrag)}.`,
    stewardNote
  };
}
