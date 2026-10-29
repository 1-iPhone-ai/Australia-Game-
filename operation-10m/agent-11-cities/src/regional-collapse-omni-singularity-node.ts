import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseExistenceSingularityPointRow,
  OP10M_A11_CollapseOmniSingularityNodeBand,
  OP10M_A11_CollapseOmniSingularityNodeRow,
  OP10M_A11_ExistentialAbsoluteZeroLockRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function nodeBand(score: number): OP10M_A11_CollapseOmniSingularityNodeBand {
  if (score < 18) return 'peripheral';
  if (score < 34) return 'convergent';
  if (score < 51) return 'omni';
  return 'total_node';
}

export function op10mA11ComputeRegionalCollapseOmniSingularityNode(args: {
  collapseExistenceSingularityPoint: OP10M_A11_CollapseExistenceSingularityPointRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
  existentialAbsoluteZeroLock: OP10M_A11_ExistentialAbsoluteZeroLockRow[];
}): { rows: OP10M_A11_CollapseOmniSingularityNodeRow[]; nationalIndex: number } {
  const pointByRegion = new Map(args.collapseExistenceSingularityPoint.map((p) => [p.regionId, p]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));
  const zeroByRegion = new Map(args.existentialAbsoluteZeroLock.map((z) => [z.regionId, z]));

  const rows: OP10M_A11_CollapseOmniSingularityNodeRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const point = pointByRegion.get(rid);
    const front = frontByRegion.get(rid);
    const zero = zeroByRegion.get(rid);

    const pointDrag = point ? op10mA11Clamp(point.pointScore * 0.51) : 14;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.47) : 12;
    const zeroDrag = zero ? op10mA11Clamp(zero.zeroScore * 0.44) : 11;

    const nodeScore = op10mA11Clamp(pointDrag + frontDrag + zeroDrag * 0.54);
    weighted += nodeScore;

    const facets: string[] = [];
    if (point && (point.band === 'singular' || point.band === 'existential')) {
      facets.push('existence node');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      facets.push('void front node');
    }
    if (zero && (zero.band === 'zero' || zero.band === 'absolute_zero')) {
      facets.push('zero node');
    }
    if (!facets.length) facets.push('node latent');

    rows.push({
      regionId: rid,
      nodeScore: op10mA11Round(nodeScore),
      band: nodeBand(nodeScore),
      facets: facets.slice(0, 3),
      narrative: `${rid} collapse omni singularity node ${nodeBand(nodeScore)} (${op10mA11Round(nodeScore)}); ${facets.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.nodeScore - a.nodeScore), nationalIndex };
}

export function op10mA11RegionsWithTotalOmniSingularityNode(
  rows: OP10M_A11_CollapseOmniSingularityNodeRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'omni' || r.band === 'total_node').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularityNodeEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 49;
  return currentIndex >= 43 && currentIndex > priorIndex + 6;
}
