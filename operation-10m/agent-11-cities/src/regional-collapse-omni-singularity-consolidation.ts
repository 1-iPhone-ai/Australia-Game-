import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityConsolidationBand,
  OP10M_A11_CollapseOmniSingularityConsolidationRow,
  OP10M_A11_CollapseOmniSingularityUnificationRow,
  OP10M_A11_ExistentialAbsoluteNullityPerpetuityRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalErosionEliminationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function consolidationBand(score: number): OP10M_A11_CollapseOmniSingularityConsolidationBand {
  if (score < 23) return 'latent';
  if (score < 39) return 'aligning';
  if (score < 56) return 'total';
  return 'consolidation';
}

export function op10mA11ComputeRegionalCollapseOmniSingularityConsolidation(args: {
  collapseOmniSingularityUnification: OP10M_A11_CollapseOmniSingularityUnificationRow[];
  voidTotalErosionElimination: OP10M_A11_VoidTotalErosionEliminationRow[];
  existentialAbsoluteNullityPerpetuity: OP10M_A11_ExistentialAbsoluteNullityPerpetuityRow[];
}): { rows: OP10M_A11_CollapseOmniSingularityConsolidationRow[]; nationalIndex: number } {
  const unificationByRegion = new Map(args.collapseOmniSingularityUnification.map((u) => [u.regionId, u]));
  const eliminationByRegion = new Map(args.voidTotalErosionElimination.map((e) => [e.regionId, e]));
  const perpetuityByRegion = new Map(args.existentialAbsoluteNullityPerpetuity.map((p) => [p.regionId, p]));

  const rows: OP10M_A11_CollapseOmniSingularityConsolidationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const unification = unificationByRegion.get(rid);
    const elimination = eliminationByRegion.get(rid);
    const perpetuity = perpetuityByRegion.get(rid);

    const unificationDrag = unification ? op10mA11Clamp(unification.unificationScore * 0.54) : 19;
    const eliminationDrag = elimination ? op10mA11Clamp(elimination.eliminationScore * 0.5) : 17;
    const perpetuityDrag = perpetuity ? op10mA11Clamp(perpetuity.perpetuityScore * 0.47) : 16;

    const consolidationScore = op10mA11Clamp(unificationDrag + eliminationDrag + perpetuityDrag * 0.58);
    weighted += consolidationScore;

    const marks: string[] = [];
    if (unification && (unification.band === 'total' || unification.band === 'unification')) {
      marks.push('unification consolidate');
    }
    if (elimination && (elimination.band === 'total' || elimination.band === 'complete_elimination')) {
      marks.push('elimination consolidate');
    }
    if (perpetuity && (perpetuity.band === 'absolute' || perpetuity.band === 'total_perpetuity')) {
      marks.push('perpetuity consolidate');
    }
    if (!marks.length) marks.push('consolidation latent');

    rows.push({
      regionId: rid,
      consolidationScore: op10mA11Round(consolidationScore),
      band: consolidationBand(consolidationScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} collapse omni singularity consolidation ${consolidationBand(consolidationScore)} (${op10mA11Round(consolidationScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.consolidationScore - a.consolidationScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityConsolidation(
  rows: OP10M_A11_CollapseOmniSingularityConsolidationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'consolidation').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularityConsolidationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 55;
  return currentIndex >= 49 && currentIndex > priorIndex + 6;
}
