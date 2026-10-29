import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityCosmismRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionDepletionRow,
  OP10M_A11_VoidTotalErosionExhaustionBand,
  OP10M_A11_VoidTotalErosionExhaustionRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function exhaustionBand(score: number): OP10M_A11_VoidTotalErosionExhaustionBand {
  if (score < 31) return 'dormant';
  if (score < 47) return 'exhausting';
  if (score < 64) return 'total';
  return 'complete_exhaustion';
}

export function op10mA11ComputeInterregionalVoidTotalErosionExhaustion(args: {
  voidTotalErosionDepletion: OP10M_A11_VoidTotalErosionDepletionRow[];
  collapseOmniSingularityCosmism: OP10M_A11_CollapseOmniSingularityCosmismRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionExhaustionRow[]; nationalIndex: number } {
  const depletionByRegion = new Map(args.voidTotalErosionDepletion.map((d) => [d.regionId, d]));
  const cosmismByRegion = new Map(args.collapseOmniSingularityCosmism.map((c) => [c.regionId, c]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionExhaustionRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const depletion = depletionByRegion.get(rid);
    const cosmism = cosmismByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const depletionDrag = depletion ? op10mA11Clamp(depletion.depletionScore * 0.53) : 23;
    const cosmismDrag = cosmism ? op10mA11Clamp(cosmism.cosmismScore * 0.49) : 21;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.46) : 20;

    const exhaustionScore = op10mA11Clamp(depletionDrag + cosmismDrag + frontDrag * 0.56);
    weighted += exhaustionScore;

    const phases: string[] = [];
    if (depletion && (depletion.band === 'total' || depletion.band === 'complete_depletion')) {
      phases.push('depletion exhaust');
    }
    if (cosmism && (cosmism.band === 'total' || cosmism.band === 'cosmism')) {
      phases.push('cosmism exhaust');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front exhaust');
    }
    if (!phases.length) phases.push('exhaustion dormant');

    rows.push({
      regionId: rid,
      exhaustionScore: op10mA11Round(exhaustionScore),
      band: exhaustionBand(exhaustionScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion exhaustion ${exhaustionBand(exhaustionScore)} (${op10mA11Round(exhaustionScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.exhaustionScore - a.exhaustionScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionExhaustion(
  rows: OP10M_A11_VoidTotalErosionExhaustionRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_exhaustion').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionExhaustionEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 65;
  return currentIndex >= 59 && currentIndex > priorIndex + 6;
}
