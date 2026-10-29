import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityAmalgamationRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionAtomizationRow,
  OP10M_A11_VoidTotalErosionPulverizationBand,
  OP10M_A11_VoidTotalErosionPulverizationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function pulverizationBand(score: number): OP10M_A11_VoidTotalErosionPulverizationBand {
  if (score < 25) return 'dormant';
  if (score < 41) return 'pulverizing';
  if (score < 58) return 'total';
  return 'complete_pulverization';
}

export function op10mA11ComputeInterregionalVoidTotalErosionPulverization(args: {
  voidTotalErosionAtomization: OP10M_A11_VoidTotalErosionAtomizationRow[];
  collapseOmniSingularityAmalgamation: OP10M_A11_CollapseOmniSingularityAmalgamationRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionPulverizationRow[]; nationalIndex: number } {
  const atomizationByRegion = new Map(args.voidTotalErosionAtomization.map((a) => [a.regionId, a]));
  const amalgamationByRegion = new Map(args.collapseOmniSingularityAmalgamation.map((a) => [a.regionId, a]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionPulverizationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const atomization = atomizationByRegion.get(rid);
    const amalgamation = amalgamationByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const atomizationDrag = atomization ? op10mA11Clamp(atomization.atomizationScore * 0.49) : 18;
    const amalgamationDrag = amalgamation ? op10mA11Clamp(amalgamation.amalgamationScore * 0.45) : 16;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.42) : 15;

    const pulverizationScore = op10mA11Clamp(atomizationDrag + amalgamationDrag + frontDrag * 0.52);
    weighted += pulverizationScore;

    const phases: string[] = [];
    if (atomization && (atomization.band === 'total' || atomization.band === 'complete_atomization')) {
      phases.push('atomization pulverize');
    }
    if (amalgamation && (amalgamation.band === 'total' || amalgamation.band === 'amalgamation')) {
      phases.push('amalgamation pulverize');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front pulverize');
    }
    if (!phases.length) phases.push('pulverization dormant');

    rows.push({
      regionId: rid,
      pulverizationScore: op10mA11Round(pulverizationScore),
      band: pulverizationBand(pulverizationScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion pulverization ${pulverizationBand(pulverizationScore)} (${op10mA11Round(pulverizationScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.pulverizationScore - a.pulverizationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionPulverization(
  rows: OP10M_A11_VoidTotalErosionPulverizationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_pulverization').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionPulverizationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 59;
  return currentIndex >= 53 && currentIndex > priorIndex + 6;
}
