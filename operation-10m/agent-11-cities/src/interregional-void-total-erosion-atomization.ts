import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityCoalescenceRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionAtomizationBand,
  OP10M_A11_VoidTotalErosionAtomizationRow,
  OP10M_A11_VoidTotalErosionSublimationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function atomizationBand(score: number): OP10M_A11_VoidTotalErosionAtomizationBand {
  if (score < 24) return 'dormant';
  if (score < 40) return 'atomizing';
  if (score < 57) return 'total';
  return 'complete_atomization';
}

export function op10mA11ComputeInterregionalVoidTotalErosionAtomization(args: {
  voidTotalErosionSublimation: OP10M_A11_VoidTotalErosionSublimationRow[];
  collapseOmniSingularityCoalescence: OP10M_A11_CollapseOmniSingularityCoalescenceRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionAtomizationRow[]; nationalIndex: number } {
  const sublimationByRegion = new Map(args.voidTotalErosionSublimation.map((s) => [s.regionId, s]));
  const coalescenceByRegion = new Map(args.collapseOmniSingularityCoalescence.map((c) => [c.regionId, c]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionAtomizationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const sublimation = sublimationByRegion.get(rid);
    const coalescence = coalescenceByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const sublimationDrag = sublimation ? op10mA11Clamp(sublimation.sublimationScore * 0.5) : 18;
    const coalescenceDrag = coalescence ? op10mA11Clamp(coalescence.coalescenceScore * 0.46) : 16;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.43) : 15;

    const atomizationScore = op10mA11Clamp(sublimationDrag + coalescenceDrag + frontDrag * 0.53);
    weighted += atomizationScore;

    const phases: string[] = [];
    if (sublimation && (sublimation.band === 'total' || sublimation.band === 'complete_sublimation')) {
      phases.push('sublimation atomize');
    }
    if (coalescence && (coalescence.band === 'total' || coalescence.band === 'coalescence')) {
      phases.push('coalescence atomize');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front atomize');
    }
    if (!phases.length) phases.push('atomization dormant');

    rows.push({
      regionId: rid,
      atomizationScore: op10mA11Round(atomizationScore),
      band: atomizationBand(atomizationScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion atomization ${atomizationBand(atomizationScore)} (${op10mA11Round(atomizationScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.atomizationScore - a.atomizationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionAtomization(
  rows: OP10M_A11_VoidTotalErosionAtomizationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_atomization').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionAtomizationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 58;
  return currentIndex >= 52 && currentIndex > priorIndex + 6;
}
