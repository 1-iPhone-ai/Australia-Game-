import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseAbsoluteSingularityApexRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidCompleteErosionTerminalityRow,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionFinalityBand,
  OP10M_A11_VoidTotalErosionFinalityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function finalityBand(score: number): OP10M_A11_VoidTotalErosionFinalityBand {
  if (score < 17) return 'inactive';
  if (score < 33) return 'finalizing';
  if (score < 50) return 'final';
  return 'total_finality';
}

export function op10mA11ComputeInterregionalVoidTotalErosionFinality(args: {
  voidCompleteErosionTerminality: OP10M_A11_VoidCompleteErosionTerminalityRow[];
  collapseAbsoluteSingularityApex: OP10M_A11_CollapseAbsoluteSingularityApexRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionFinalityRow[]; nationalIndex: number } {
  const terminalityByRegion = new Map(args.voidCompleteErosionTerminality.map((t) => [t.regionId, t]));
  const apexByRegion = new Map(args.collapseAbsoluteSingularityApex.map((a) => [a.regionId, a]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionFinalityRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const terminality = terminalityByRegion.get(rid);
    const apex = apexByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const terminalityDrag = terminality ? op10mA11Clamp(terminality.terminalityScore * 0.53) : 15;
    const apexDrag = apex ? op10mA11Clamp(apex.apexScore * 0.49) : 13;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.46) : 12;

    const finalityScore = op10mA11Clamp(terminalityDrag + apexDrag + frontDrag * 0.56);
    weighted += finalityScore;

    const phases: string[] = [];
    if (terminality && (terminality.band === 'terminal' || terminality.band === 'total_terminality')) {
      phases.push('terminality final');
    }
    if (apex && (apex.band === 'total' || apex.band === 'apex')) {
      phases.push('apex final');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front final');
    }
    if (!phases.length) phases.push('finality inactive');

    rows.push({
      regionId: rid,
      finalityScore: op10mA11Round(finalityScore),
      band: finalityBand(finalityScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion finality ${finalityBand(finalityScore)} (${op10mA11Round(finalityScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.finalityScore - a.finalityScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionFinality(
  rows: OP10M_A11_VoidTotalErosionFinalityRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'final' || r.band === 'total_finality').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionFinalityEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 51;
  return currentIndex >= 45 && currentIndex > priorIndex + 6;
}
