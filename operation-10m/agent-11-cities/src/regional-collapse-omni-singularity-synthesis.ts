import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseAbsoluteSingularityCulminationRow,
  OP10M_A11_CollapseOmniSingularitySynthesisBand,
  OP10M_A11_CollapseOmniSingularitySynthesisRow,
  OP10M_A11_ExistentialTotalNullityDecreeRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidCompleteErosionExtinctionRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function synthesisBand(score: number): OP10M_A11_CollapseOmniSingularitySynthesisBand {
  if (score < 21) return 'latent';
  if (score < 37) return 'forming';
  if (score < 54) return 'total';
  return 'synthesis';
}

export function op10mA11ComputeRegionalCollapseOmniSingularitySynthesis(args: {
  collapseAbsoluteSingularityCulmination: OP10M_A11_CollapseAbsoluteSingularityCulminationRow[];
  voidCompleteErosionExtinction: OP10M_A11_VoidCompleteErosionExtinctionRow[];
  existentialTotalNullityDecree: OP10M_A11_ExistentialTotalNullityDecreeRow[];
}): { rows: OP10M_A11_CollapseOmniSingularitySynthesisRow[]; nationalIndex: number } {
  const culminationByRegion = new Map(args.collapseAbsoluteSingularityCulmination.map((c) => [c.regionId, c]));
  const extinctionByRegion = new Map(args.voidCompleteErosionExtinction.map((e) => [e.regionId, e]));
  const decreeByRegion = new Map(args.existentialTotalNullityDecree.map((d) => [d.regionId, d]));

  const rows: OP10M_A11_CollapseOmniSingularitySynthesisRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const culmination = culminationByRegion.get(rid);
    const extinction = extinctionByRegion.get(rid);
    const decree = decreeByRegion.get(rid);

    const culminationDrag = culmination ? op10mA11Clamp(culmination.culminationScore * 0.58) : 19;
    const extinctionDrag = extinction ? op10mA11Clamp(extinction.extinctionScore * 0.54) : 17;
    const decreeDrag = decree ? op10mA11Clamp(decree.decreeScore * 0.51) : 16;

    const synthesisScore = op10mA11Clamp(culminationDrag + extinctionDrag + decreeDrag * 0.62);
    weighted += synthesisScore;

    const anchors: string[] = [];
    if (culmination && (culmination.band === 'total' || culmination.band === 'culmination')) {
      anchors.push('culmination synthesis');
    }
    if (extinction && (extinction.band === 'complete' || extinction.band === 'total_extinction')) {
      anchors.push('erosion synthesis');
    }
    if (decree && (decree.band === 'total' || decree.band === 'absolute_decree')) {
      anchors.push('nullity synthesis');
    }
    if (!anchors.length) anchors.push('synthesis latent');

    rows.push({
      regionId: rid,
      synthesisScore: op10mA11Round(synthesisScore),
      band: synthesisBand(synthesisScore),
      anchors: anchors.slice(0, 3),
      narrative: `${rid} collapse omni singularity synthesis ${synthesisBand(synthesisScore)} (${op10mA11Round(synthesisScore)}); ${anchors.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.synthesisScore - a.synthesisScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularitySynthesis(
  rows: OP10M_A11_CollapseOmniSingularitySynthesisRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'synthesis').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularitySynthesisEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 53;
  return currentIndex >= 47 && currentIndex > priorIndex + 6;
}
