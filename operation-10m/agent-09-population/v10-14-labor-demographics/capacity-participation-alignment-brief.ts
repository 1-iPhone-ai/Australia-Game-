import { v1014laborClamp } from './bands';
import type {
  CapacityParticipationAlignmentBand,
  NationalCapacityParticipationAlignmentBrief,
  NationalLaborDemographicsState,
  NationalParticipationEquityGapBrief,
  NationalRegionalLaborAbsorptionBrief,
  NationalWorkforceCapacityBridge
} from './types';

function alignmentBand(index: number): CapacityParticipationAlignmentBand {
  if (index <= 34) return 'misaligned';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'aligned';
  return 'reinforcing';
}

export function computeNationalCapacityParticipationAlignmentBrief(
  state: NationalLaborDemographicsState,
  capacity: NationalWorkforceCapacityBridge | null | undefined,
  equity: NationalParticipationEquityGapBrief | null | undefined,
  absorption: NationalRegionalLaborAbsorptionBrief | null | undefined
): NationalCapacityParticipationAlignmentBrief {
  if (!state.enabled || !capacity || !equity || !absorption) {
    return {
      turn: state.turn,
      alignmentIndex: 50,
      band: 'strained',
      capacityGapDrag: 0,
      summary: 'Capacity-participation alignment idle — capacity, equity, or absorption unavailable.',
      stewardNote: 'Compute capacity bridge, equity, and absorption before alignment guidance.'
    };
  }

  const capacityGapDrag =
    capacity.nationalBand === 'critical_gap'
      ? 20
      : capacity.nationalBand === 'tight'
        ? 13
        : capacity.nationalBand === 'balanced'
          ? 5
          : 0;
  const equityLift =
    equity.band === 'inclusive' || equity.band === 'narrowing' ? equity.equityIndex * 0.26 : equity.equityIndex * 0.14;
  const absorptionLift =
    absorption.band === 'headroom' || absorption.band === 'absorbing' ? absorption.absorptionIndex * 0.22 : 0;
  const linkageLift = state.employmentLinkageScore * 0.18;

  const alignmentIndex = v1014laborClamp(30 + equityLift + absorptionLift + linkageLift - capacityGapDrag);
  const band = alignmentBand(alignmentIndex);

  const stewardNote =
    band === 'misaligned' || band === 'strained'
      ? 'Strained capacity-participation alignment — ease equity gaps before forcing corridor absorption.'
      : band === 'reinforcing'
        ? 'Reinforcing alignment — maintain coordination levers while scaling participation.'
        : 'Aligned capacity-participation — watch critical capacity gaps in inbound hubs.';

  return {
    turn: state.turn,
    alignmentIndex,
    band,
    capacityGapDrag,
    summary: `Capacity-participation alignment ${band} (index ${Math.round(alignmentIndex)}); capacity drag ${Math.round(capacityGapDrag)}.`,
    stewardNote
  };
}
