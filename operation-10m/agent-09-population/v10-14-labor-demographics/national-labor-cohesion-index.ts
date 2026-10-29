import { v1014laborClamp } from './bands';
import { coordinationEaseForRegion } from './catalog/workforce-coordination-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type LaborCohesionBand,
  type NationalCapacityParticipationAlignmentBrief,
  type NationalIntergenerationalWorkforceBalanceOutlook,
  type NationalLaborCohesionIndex,
  type NationalLaborDemographicsState,
  type NationalLaborMarketStabilityOutlook
} from './types';

function cohesionBand(index: number): LaborCohesionBand {
  if (index <= 34) return 'fragmented';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'cohesive';
  return 'unified';
}

export function computeNationalLaborCohesionIndex(
  state: NationalLaborDemographicsState,
  stability: NationalLaborMarketStabilityOutlook | null | undefined,
  intergenerational: NationalIntergenerationalWorkforceBalanceOutlook | null | undefined,
  alignment: NationalCapacityParticipationAlignmentBrief | null | undefined
): NationalLaborCohesionIndex {
  if (!state.enabled || !stability || !intergenerational || !alignment) {
    return {
      turn: state.turn,
      cohesionIndex: 50,
      band: 'patchy',
      stabilityDrag: 0,
      summary: 'National labor cohesion idle — stability, balance, or alignment unavailable.',
      stewardNote: 'Compute stability, intergenerational balance, and alignment before cohesion guidance.'
    };
  }

  let coordinationLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    coordinationLift += coordinationEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  coordinationLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const stabilityDrag =
    stability.band === 'volatile'
      ? 16
      : stability.band === 'fragile'
        ? 10
        : stability.stressDrag * 0.4;
  const balanceLift =
    intergenerational.band === 'balanced' || intergenerational.band === 'renewal'
      ? intergenerational.balanceIndex * 0.28
      : intergenerational.balanceIndex * 0.14;
  const alignmentLift =
    alignment.band === 'aligned' || alignment.band === 'reinforcing'
      ? alignment.alignmentIndex * 0.26
      : alignment.alignmentIndex * 0.12;
  const gapDrag = intergenerational.pipelineGap * 0.12;

  const cohesionIndex = v1014laborClamp(
    28 + balanceLift + alignmentLift + coordinationLift * 20 - stabilityDrag - gapDrag
  );
  const band = cohesionBand(cohesionIndex);

  const stewardNote =
    band === 'fragmented' || band === 'patchy'
      ? 'Patchy labor cohesion — deploy coordination and safety levers before corridor moves.'
      : band === 'unified'
        ? 'Unified cohesion — avoid stacked shocks that thin essential-worker buffers.'
        : 'Cohesive band — maintain intergenerational balance while scaling participation.';

  return {
    turn: state.turn,
    cohesionIndex,
    band,
    stabilityDrag,
    summary: `National labor cohesion ${band} (index ${Math.round(cohesionIndex)}); stability drag ${Math.round(stabilityDrag)}.`,
    stewardNote
  };
}
