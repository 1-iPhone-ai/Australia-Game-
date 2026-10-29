import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseUltimateSingularityZenithRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidAbsoluteErosionTerminationBand,
  OP10M_A11_VoidAbsoluteErosionTerminationRow,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionFinalityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function terminationBand(score: number): OP10M_A11_VoidAbsoluteErosionTerminationBand {
  if (score < 18) return 'inactive';
  if (score < 34) return 'terminating';
  if (score < 51) return 'absolute';
  return 'total_termination';
}

export function op10mA11ComputeInterregionalVoidAbsoluteErosionTermination(args: {
  voidTotalErosionFinality: OP10M_A11_VoidTotalErosionFinalityRow[];
  collapseUltimateSingularityZenith: OP10M_A11_CollapseUltimateSingularityZenithRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidAbsoluteErosionTerminationRow[]; nationalIndex: number } {
  const finalityByRegion = new Map(args.voidTotalErosionFinality.map((f) => [f.regionId, f]));
  const zenithByRegion = new Map(args.collapseUltimateSingularityZenith.map((z) => [z.regionId, z]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidAbsoluteErosionTerminationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const finality = finalityByRegion.get(rid);
    const zenith = zenithByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const finalityDrag = finality ? op10mA11Clamp(finality.finalityScore * 0.54) : 16;
    const zenithDrag = zenith ? op10mA11Clamp(zenith.zenithScore * 0.5) : 14;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.47) : 13;

    const terminationScore = op10mA11Clamp(finalityDrag + zenithDrag + frontDrag * 0.57);
    weighted += terminationScore;

    const phases: string[] = [];
    if (finality && (finality.band === 'final' || finality.band === 'total_finality')) {
      phases.push('finality term');
    }
    if (zenith && (zenith.band === 'total' || zenith.band === 'zenith')) {
      phases.push('zenith term');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front term');
    }
    if (!phases.length) phases.push('termination inactive');

    rows.push({
      regionId: rid,
      terminationScore: op10mA11Round(terminationScore),
      band: terminationBand(terminationScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void absolute erosion termination ${terminationBand(terminationScore)} (${op10mA11Round(terminationScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.terminationScore - a.terminationScore), nationalIndex };
}

export function op10mA11RegionsWithAbsoluteErosionTermination(
  rows: OP10M_A11_VoidAbsoluteErosionTerminationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_termination').map((r) => r.regionId);
}

export function op10mA11VoidAbsoluteErosionTerminationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 52;
  return currentIndex >= 46 && currentIndex > priorIndex + 6;
}
