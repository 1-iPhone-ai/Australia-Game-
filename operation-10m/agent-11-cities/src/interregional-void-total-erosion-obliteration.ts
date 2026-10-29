import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularitySynthesisRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionAnnihilationRow,
  OP10M_A11_VoidTotalErosionObliterationBand,
  OP10M_A11_VoidTotalErosionObliterationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function obliterationBand(score: number): OP10M_A11_VoidTotalErosionObliterationBand {
  if (score < 21) return 'dormant';
  if (score < 37) return 'obliterating';
  if (score < 54) return 'total';
  return 'complete_obliteration';
}

export function op10mA11ComputeInterregionalVoidTotalErosionObliteration(args: {
  voidTotalErosionAnnihilation: OP10M_A11_VoidTotalErosionAnnihilationRow[];
  collapseOmniSingularitySynthesis: OP10M_A11_CollapseOmniSingularitySynthesisRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionObliterationRow[]; nationalIndex: number } {
  const annihilationByRegion = new Map(args.voidTotalErosionAnnihilation.map((a) => [a.regionId, a]));
  const synthesisByRegion = new Map(args.collapseOmniSingularitySynthesis.map((s) => [s.regionId, s]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionObliterationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const annihilation = annihilationByRegion.get(rid);
    const synthesis = synthesisByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const annihilationDrag = annihilation ? op10mA11Clamp(annihilation.annihilationScore * 0.55) : 18;
    const synthesisDrag = synthesis ? op10mA11Clamp(synthesis.synthesisScore * 0.51) : 16;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.48) : 15;

    const obliterationScore = op10mA11Clamp(annihilationDrag + synthesisDrag + frontDrag * 0.58);
    weighted += obliterationScore;

    const phases: string[] = [];
    if (annihilation && (annihilation.band === 'total' || annihilation.band === 'complete_annihilation')) {
      phases.push('annihilation obliterate');
    }
    if (synthesis && (synthesis.band === 'total' || synthesis.band === 'synthesis')) {
      phases.push('synthesis obliterate');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front obliterate');
    }
    if (!phases.length) phases.push('obliteration dormant');

    rows.push({
      regionId: rid,
      obliterationScore: op10mA11Round(obliterationScore),
      band: obliterationBand(obliterationScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion obliteration ${obliterationBand(obliterationScore)} (${op10mA11Round(obliterationScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.obliterationScore - a.obliterationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionObliteration(
  rows: OP10M_A11_VoidTotalErosionObliterationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_obliteration').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionObliterationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 55;
  return currentIndex >= 49 && currentIndex > priorIndex + 6;
}
