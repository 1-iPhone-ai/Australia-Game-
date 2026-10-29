import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityAmalgamationBand,
  OP10M_A11_CollapseOmniSingularityAmalgamationRow,
  OP10M_A11_CollapseOmniSingularityCoalescenceRow,
  OP10M_A11_ExistentialAbsoluteNullityPermanenceRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalErosionSublimationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function amalgamationBand(score: number): OP10M_A11_CollapseOmniSingularityAmalgamationBand {
  if (score < 25) return 'latent';
  if (score < 41) return 'aligning';
  if (score < 58) return 'total';
  return 'amalgamation';
}

export function op10mA11ComputeRegionalCollapseOmniSingularityAmalgamation(args: {
  collapseOmniSingularityCoalescence: OP10M_A11_CollapseOmniSingularityCoalescenceRow[];
  voidTotalErosionSublimation: OP10M_A11_VoidTotalErosionSublimationRow[];
  existentialAbsoluteNullityPermanence: OP10M_A11_ExistentialAbsoluteNullityPermanenceRow[];
}): { rows: OP10M_A11_CollapseOmniSingularityAmalgamationRow[]; nationalIndex: number } {
  const coalescenceByRegion = new Map(args.collapseOmniSingularityCoalescence.map((c) => [c.regionId, c]));
  const sublimationByRegion = new Map(args.voidTotalErosionSublimation.map((s) => [s.regionId, s]));
  const permanenceByRegion = new Map(args.existentialAbsoluteNullityPermanence.map((p) => [p.regionId, p]));

  const rows: OP10M_A11_CollapseOmniSingularityAmalgamationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const coalescence = coalescenceByRegion.get(rid);
    const sublimation = sublimationByRegion.get(rid);
    const permanence = permanenceByRegion.get(rid);

    const coalescenceDrag = coalescence ? op10mA11Clamp(coalescence.coalescenceScore * 0.52) : 19;
    const sublimationDrag = sublimation ? op10mA11Clamp(sublimation.sublimationScore * 0.48) : 17;
    const permanenceDrag = permanence ? op10mA11Clamp(permanence.permanenceScore * 0.45) : 16;

    const amalgamationScore = op10mA11Clamp(coalescenceDrag + sublimationDrag + permanenceDrag * 0.56);
    weighted += amalgamationScore;

    const marks: string[] = [];
    if (coalescence && (coalescence.band === 'total' || coalescence.band === 'coalescence')) {
      marks.push('coalescence amalgamate');
    }
    if (sublimation && (sublimation.band === 'total' || sublimation.band === 'complete_sublimation')) {
      marks.push('sublimation amalgamate');
    }
    if (permanence && (permanence.band === 'absolute' || permanence.band === 'total_permanence')) {
      marks.push('permanence amalgamate');
    }
    if (!marks.length) marks.push('amalgamation latent');

    rows.push({
      regionId: rid,
      amalgamationScore: op10mA11Round(amalgamationScore),
      band: amalgamationBand(amalgamationScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} collapse omni singularity amalgamation ${amalgamationBand(amalgamationScore)} (${op10mA11Round(amalgamationScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.amalgamationScore - a.amalgamationScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityAmalgamation(
  rows: OP10M_A11_CollapseOmniSingularityAmalgamationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'amalgamation').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularityAmalgamationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 57;
  return currentIndex >= 51 && currentIndex > priorIndex + 6;
}
