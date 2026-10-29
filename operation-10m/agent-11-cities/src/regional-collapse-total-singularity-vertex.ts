import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityNodeRow,
  OP10M_A11_CollapseTotalSingularityVertexBand,
  OP10M_A11_CollapseTotalSingularityVertexRow,
  OP10M_A11_ExistentialFinalNullityLockRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidAbsoluteErosionSurgeRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function vertexBand(score: number): OP10M_A11_CollapseTotalSingularityVertexBand {
  if (score < 16) return 'latent';
  if (score < 32) return 'forming';
  if (score < 49) return 'total';
  return 'vertex';
}

export function op10mA11ComputeRegionalCollapseTotalSingularityVertex(args: {
  collapseOmniSingularityNode: OP10M_A11_CollapseOmniSingularityNodeRow[];
  voidAbsoluteErosionSurge: OP10M_A11_VoidAbsoluteErosionSurgeRow[];
  existentialFinalNullityLock: OP10M_A11_ExistentialFinalNullityLockRow[];
}): { rows: OP10M_A11_CollapseTotalSingularityVertexRow[]; nationalIndex: number } {
  const nodeByRegion = new Map(args.collapseOmniSingularityNode.map((n) => [n.regionId, n]));
  const surgeByRegion = new Map(args.voidAbsoluteErosionSurge.map((s) => [s.regionId, s]));
  const nullityByRegion = new Map(args.existentialFinalNullityLock.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_CollapseTotalSingularityVertexRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const node = nodeByRegion.get(rid);
    const surge = surgeByRegion.get(rid);
    const nullity = nullityByRegion.get(rid);

    const nodeDrag = node ? op10mA11Clamp(node.nodeScore * 0.53) : 14;
    const surgeDrag = surge ? op10mA11Clamp(surge.surgeScore * 0.49) : 12;
    const nullityDrag = nullity ? op10mA11Clamp(nullity.nullityScore * 0.46) : 11;

    const vertexScore = op10mA11Clamp(nodeDrag + surgeDrag + nullityDrag * 0.56);
    weighted += vertexScore;

    const anchors: string[] = [];
    if (node && (node.band === 'omni' || node.band === 'total_node')) {
      anchors.push('omni vertex');
    }
    if (surge && (surge.band === 'absolute' || surge.band === 'omni_erosion')) {
      anchors.push('erosion vertex');
    }
    if (nullity && (nullity.band === 'nullity' || nullity.band === 'final_nullity')) {
      anchors.push('nullity vertex');
    }
    if (!anchors.length) anchors.push('vertex latent');

    rows.push({
      regionId: rid,
      vertexScore: op10mA11Round(vertexScore),
      band: vertexBand(vertexScore),
      anchors: anchors.slice(0, 3),
      narrative: `${rid} collapse total singularity vertex ${vertexBand(vertexScore)} (${op10mA11Round(vertexScore)}); ${anchors.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.vertexScore - a.vertexScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityVertex(
  rows: OP10M_A11_CollapseTotalSingularityVertexRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'vertex').map((r) => r.regionId);
}

export function op10mA11CollapseTotalSingularityVertexEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 48;
  return currentIndex >= 42 && currentIndex > priorIndex + 6;
}
