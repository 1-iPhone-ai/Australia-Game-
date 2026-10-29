import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseExistenceSingularityPointRow,
  OP10M_A11_CollapseOmniSingularityNodeRow,
  OP10M_A11_ExistentialFinalNullityLockRow,
  OP10M_A11_ExistentialUltimateNullitySealBand,
  OP10M_A11_ExistentialUltimateNullitySealRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function sealBand(score: number): OP10M_A11_ExistentialUltimateNullitySealBand {
  if (score < 17) return 'trace';
  if (score < 33) return 'sealing';
  if (score < 50) return 'ultimate';
  return 'total_seal';
}

export function op10mA11ComputeSettlementExistentialUltimateNullitySeal(args: {
  existentialFinalNullityLock: OP10M_A11_ExistentialFinalNullityLockRow[];
  collapseOmniSingularityNode: OP10M_A11_CollapseOmniSingularityNodeRow[];
  collapseExistenceSingularityPoint: OP10M_A11_CollapseExistenceSingularityPointRow[];
}): { rows: OP10M_A11_ExistentialUltimateNullitySealRow[]; nationalIndex: number } {
  const nullityByRegion = new Map(args.existentialFinalNullityLock.map((f) => [f.regionId, f]));
  const nodeByRegion = new Map(args.collapseOmniSingularityNode.map((n) => [n.regionId, n]));
  const pointByRegion = new Map(args.collapseExistenceSingularityPoint.map((p) => [p.regionId, p]));

  const rows: OP10M_A11_ExistentialUltimateNullitySealRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const nullity = nullityByRegion.get(rid);
    const node = nodeByRegion.get(rid);
    const point = pointByRegion.get(rid);

    const nullityDrag = nullity ? op10mA11Clamp(nullity.nullityScore * 0.54) : 14;
    const nodeDrag = node ? op10mA11Clamp(node.nodeScore * 0.5) : 12;
    const pointDrag = point ? op10mA11Clamp(point.pointScore * 0.45) : 11;

    const sealScore = op10mA11Clamp(nullityDrag + nodeDrag + pointDrag * 0.57);
    weighted += sealScore;

    const marks: string[] = [];
    if (nullity && (nullity.band === 'nullity' || nullity.band === 'final_nullity')) {
      marks.push('final nullity seal');
    }
    if (node && (node.band === 'omni' || node.band === 'total_node')) {
      marks.push('omni seal');
    }
    if (point && (point.band === 'singular' || point.band === 'existential')) {
      marks.push('existence seal');
    }
    if (!marks.length) marks.push('seal trace');

    rows.push({
      regionId: rid,
      sealScore: op10mA11Round(sealScore),
      band: sealBand(sealScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential ultimate nullity seal ${sealBand(sealScore)} (${op10mA11Round(sealScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.sealScore - a.sealScore), nationalIndex };
}

export function op10mA11RegionsWithTotalUltimateNullitySeal(
  rows: OP10M_A11_ExistentialUltimateNullitySealRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'ultimate' || r.band === 'total_seal').map((r) => r.regionId);
}

export function op10mA11ExistentialUltimateNullitySealEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 50;
  return currentIndex >= 44 && currentIndex > priorIndex + 6;
}
