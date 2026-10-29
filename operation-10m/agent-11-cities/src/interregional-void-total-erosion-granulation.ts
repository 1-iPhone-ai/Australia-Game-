import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularitySymbiosisRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionGranulationBand,
  OP10M_A11_VoidTotalErosionGranulationRow,
  OP10M_A11_VoidTotalErosionPulverizationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function granulationBand(score: number): OP10M_A11_VoidTotalErosionGranulationBand {
  if (score < 26) return 'dormant';
  if (score < 42) return 'granulating';
  if (score < 59) return 'total';
  return 'complete_granulation';
}

export function op10mA11ComputeInterregionalVoidTotalErosionGranulation(args: {
  voidTotalErosionPulverization: OP10M_A11_VoidTotalErosionPulverizationRow[];
  collapseOmniSingularitySymbiosis: OP10M_A11_CollapseOmniSingularitySymbiosisRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionGranulationRow[]; nationalIndex: number } {
  const pulverizationByRegion = new Map(args.voidTotalErosionPulverization.map((p) => [p.regionId, p]));
  const symbiosisByRegion = new Map(args.collapseOmniSingularitySymbiosis.map((s) => [s.regionId, s]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionGranulationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const pulverization = pulverizationByRegion.get(rid);
    const symbiosis = symbiosisByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const pulverizationDrag = pulverization ? op10mA11Clamp(pulverization.pulverizationScore * 0.48) : 18;
    const symbiosisDrag = symbiosis ? op10mA11Clamp(symbiosis.symbiosisScore * 0.44) : 16;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.41) : 15;

    const granulationScore = op10mA11Clamp(pulverizationDrag + symbiosisDrag + frontDrag * 0.51);
    weighted += granulationScore;

    const phases: string[] = [];
    if (pulverization && (pulverization.band === 'total' || pulverization.band === 'complete_pulverization')) {
      phases.push('pulverization granulate');
    }
    if (symbiosis && (symbiosis.band === 'total' || symbiosis.band === 'symbiosis')) {
      phases.push('symbiosis granulate');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front granulate');
    }
    if (!phases.length) phases.push('granulation dormant');

    rows.push({
      regionId: rid,
      granulationScore: op10mA11Round(granulationScore),
      band: granulationBand(granulationScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion granulation ${granulationBand(granulationScore)} (${op10mA11Round(granulationScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.granulationScore - a.granulationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionGranulation(
  rows: OP10M_A11_VoidTotalErosionGranulationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_granulation').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionGranulationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 60;
  return currentIndex >= 54 && currentIndex > priorIndex + 6;
}
