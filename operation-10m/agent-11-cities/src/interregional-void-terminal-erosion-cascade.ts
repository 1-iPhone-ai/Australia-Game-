import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityNodeRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidAbsoluteErosionSurgeRow,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTerminalErosionCascadeBand,
  OP10M_A11_VoidTerminalErosionCascadeRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function cascadeBand(score: number): OP10M_A11_VoidTerminalErosionCascadeBand {
  if (score < 15) return 'inactive';
  if (score < 31) return 'terminalizing';
  if (score < 48) return 'cascade';
  return 'total_erosion';
}

export function op10mA11ComputeInterregionalVoidTerminalErosionCascade(args: {
  voidAbsoluteErosionSurge: OP10M_A11_VoidAbsoluteErosionSurgeRow[];
  collapseOmniSingularityNode: OP10M_A11_CollapseOmniSingularityNodeRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTerminalErosionCascadeRow[]; nationalIndex: number } {
  const surgeByRegion = new Map(args.voidAbsoluteErosionSurge.map((s) => [s.regionId, s]));
  const nodeByRegion = new Map(args.collapseOmniSingularityNode.map((n) => [n.regionId, n]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTerminalErosionCascadeRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const surge = surgeByRegion.get(rid);
    const node = nodeByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const surgeDrag = surge ? op10mA11Clamp(surge.surgeScore * 0.54) : 13;
    const nodeDrag = node ? op10mA11Clamp(node.nodeScore * 0.48) : 12;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.44) : 10;

    const cascadeScore = op10mA11Clamp(surgeDrag + nodeDrag + frontDrag * 0.52);
    weighted += cascadeScore;

    const phases: string[] = [];
    if (surge && (surge.band === 'absolute' || surge.band === 'omni_erosion')) {
      phases.push('surge terminal');
    }
    if (node && (node.band === 'omni' || node.band === 'total_node')) {
      phases.push('node terminal');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front terminal');
    }
    if (!phases.length) phases.push('cascade inactive');

    rows.push({
      regionId: rid,
      cascadeScore: op10mA11Round(cascadeScore),
      band: cascadeBand(cascadeScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void terminal erosion cascade ${cascadeBand(cascadeScore)} (${op10mA11Round(cascadeScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.cascadeScore - a.cascadeScore), nationalIndex };
}

export function op10mA11RegionsWithTotalTerminalErosion(
  rows: OP10M_A11_VoidTerminalErosionCascadeRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'cascade' || r.band === 'total_erosion').map((r) => r.regionId);
}

export function op10mA11VoidTerminalErosionCascadeEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 49;
  return currentIndex >= 43 && currentIndex > priorIndex + 6;
}
