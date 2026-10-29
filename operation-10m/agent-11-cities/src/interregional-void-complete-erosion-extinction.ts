import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseTotalSingularityNexusRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidAbsoluteErosionTerminationRow,
  OP10M_A11_VoidCompleteErosionExtinctionBand,
  OP10M_A11_VoidCompleteErosionExtinctionRow,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function extinctionBand(score: number): OP10M_A11_VoidCompleteErosionExtinctionBand {
  if (score < 19) return 'inactive';
  if (score < 35) return 'extinguishing';
  if (score < 52) return 'complete';
  return 'total_extinction';
}

export function op10mA11ComputeInterregionalVoidCompleteErosionExtinction(args: {
  voidAbsoluteErosionTermination: OP10M_A11_VoidAbsoluteErosionTerminationRow[];
  collapseTotalSingularityNexus: OP10M_A11_CollapseTotalSingularityNexusRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidCompleteErosionExtinctionRow[]; nationalIndex: number } {
  const terminationByRegion = new Map(args.voidAbsoluteErosionTermination.map((t) => [t.regionId, t]));
  const nexusByRegion = new Map(args.collapseTotalSingularityNexus.map((n) => [n.regionId, n]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidCompleteErosionExtinctionRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const termination = terminationByRegion.get(rid);
    const nexus = nexusByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const terminationDrag = termination ? op10mA11Clamp(termination.terminationScore * 0.55) : 17;
    const nexusDrag = nexus ? op10mA11Clamp(nexus.nexusScore * 0.51) : 15;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.48) : 14;

    const extinctionScore = op10mA11Clamp(terminationDrag + nexusDrag + frontDrag * 0.58);
    weighted += extinctionScore;

    const phases: string[] = [];
    if (termination && (termination.band === 'absolute' || termination.band === 'total_termination')) {
      phases.push('termination extinct');
    }
    if (nexus && (nexus.band === 'total' || nexus.band === 'nexus')) {
      phases.push('nexus extinct');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front extinct');
    }
    if (!phases.length) phases.push('extinction inactive');

    rows.push({
      regionId: rid,
      extinctionScore: op10mA11Round(extinctionScore),
      band: extinctionBand(extinctionScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void complete erosion extinction ${extinctionBand(extinctionScore)} (${op10mA11Round(extinctionScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.extinctionScore - a.extinctionScore), nationalIndex };
}

export function op10mA11RegionsWithCompleteErosionExtinction(
  rows: OP10M_A11_VoidCompleteErosionExtinctionRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'complete' || r.band === 'total_extinction').map((r) => r.regionId);
}

export function op10mA11VoidCompleteErosionExtinctionEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 53;
  return currentIndex >= 47 && currentIndex > priorIndex + 6;
}
