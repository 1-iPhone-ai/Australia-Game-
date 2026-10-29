import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseTotalSingularityVertexRow,
  OP10M_A11_ExistentialFinalNullityClosureBand,
  OP10M_A11_ExistentialFinalNullityClosureRow,
  OP10M_A11_ExistentialFinalNullityLockRow,
  OP10M_A11_ExistentialUltimateNullitySealRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function closureBand(score: number): OP10M_A11_ExistentialFinalNullityClosureBand {
  if (score < 18) return 'trace';
  if (score < 34) return 'closing';
  if (score < 51) return 'final';
  return 'total_closure';
}

export function op10mA11ComputeSettlementExistentialFinalNullityClosure(args: {
  existentialUltimateNullitySeal: OP10M_A11_ExistentialUltimateNullitySealRow[];
  collapseTotalSingularityVertex: OP10M_A11_CollapseTotalSingularityVertexRow[];
  existentialFinalNullityLock: OP10M_A11_ExistentialFinalNullityLockRow[];
}): { rows: OP10M_A11_ExistentialFinalNullityClosureRow[]; nationalIndex: number } {
  const sealByRegion = new Map(args.existentialUltimateNullitySeal.map((s) => [s.regionId, s]));
  const vertexByRegion = new Map(args.collapseTotalSingularityVertex.map((v) => [v.regionId, v]));
  const lockByRegion = new Map(args.existentialFinalNullityLock.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_ExistentialFinalNullityClosureRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const seal = sealByRegion.get(rid);
    const vertex = vertexByRegion.get(rid);
    const lock = lockByRegion.get(rid);

    const sealDrag = seal ? op10mA11Clamp(seal.sealScore * 0.51) : 14;
    const vertexDrag = vertex ? op10mA11Clamp(vertex.vertexScore * 0.47) : 12;
    const lockDrag = lock ? op10mA11Clamp(lock.nullityScore * 0.48) : 11;

    const closureScore = op10mA11Clamp(sealDrag + vertexDrag + lockDrag * 0.58);
    weighted += closureScore;

    const marks: string[] = [];
    if (seal && (seal.band === 'ultimate' || seal.band === 'total_seal')) {
      marks.push('seal closure');
    }
    if (vertex && (vertex.band === 'total' || vertex.band === 'vertex')) {
      marks.push('vertex closure');
    }
    if (lock && (lock.band === 'nullity' || lock.band === 'final_nullity')) {
      marks.push('nullity closure');
    }
    if (!marks.length) marks.push('closure trace');

    rows.push({
      regionId: rid,
      closureScore: op10mA11Round(closureScore),
      band: closureBand(closureScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential final nullity closure ${closureBand(closureScore)} (${op10mA11Round(closureScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.closureScore - a.closureScore), nationalIndex };
}

export function op10mA11RegionsWithTotalFinalNullityClosure(
  rows: OP10M_A11_ExistentialFinalNullityClosureRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'final' || r.band === 'total_closure').map((r) => r.regionId);
}

export function op10mA11ExistentialFinalNullityClosureEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 51;
  return currentIndex >= 45 && currentIndex > priorIndex + 6;
}
