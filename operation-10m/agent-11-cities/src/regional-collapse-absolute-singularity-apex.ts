import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseAbsoluteSingularityApexBand,
  OP10M_A11_CollapseAbsoluteSingularityApexRow,
  OP10M_A11_CollapseTotalSingularityVertexRow,
  OP10M_A11_ExistentialUltimateNullitySealRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTerminalErosionCascadeRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function apexBand(score: number): OP10M_A11_CollapseAbsoluteSingularityApexBand {
  if (score < 17) return 'latent';
  if (score < 33) return 'forming';
  if (score < 50) return 'total';
  return 'apex';
}

export function op10mA11ComputeRegionalCollapseAbsoluteSingularityApex(args: {
  collapseTotalSingularityVertex: OP10M_A11_CollapseTotalSingularityVertexRow[];
  voidTerminalErosionCascade: OP10M_A11_VoidTerminalErosionCascadeRow[];
  existentialUltimateNullitySeal: OP10M_A11_ExistentialUltimateNullitySealRow[];
}): { rows: OP10M_A11_CollapseAbsoluteSingularityApexRow[]; nationalIndex: number } {
  const vertexByRegion = new Map(args.collapseTotalSingularityVertex.map((v) => [v.regionId, v]));
  const cascadeByRegion = new Map(args.voidTerminalErosionCascade.map((c) => [c.regionId, c]));
  const sealByRegion = new Map(args.existentialUltimateNullitySeal.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_CollapseAbsoluteSingularityApexRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const vertex = vertexByRegion.get(rid);
    const cascade = cascadeByRegion.get(rid);
    const seal = sealByRegion.get(rid);

    const vertexDrag = vertex ? op10mA11Clamp(vertex.vertexScore * 0.54) : 15;
    const cascadeDrag = cascade ? op10mA11Clamp(cascade.cascadeScore * 0.5) : 13;
    const sealDrag = seal ? op10mA11Clamp(seal.sealScore * 0.47) : 12;

    const apexScore = op10mA11Clamp(vertexDrag + cascadeDrag + sealDrag * 0.57);
    weighted += apexScore;

    const anchors: string[] = [];
    if (vertex && (vertex.band === 'total' || vertex.band === 'vertex')) {
      anchors.push('vertex apex');
    }
    if (cascade && (cascade.band === 'cascade' || cascade.band === 'total_erosion')) {
      anchors.push('erosion apex');
    }
    if (seal && (seal.band === 'ultimate' || seal.band === 'total_seal')) {
      anchors.push('nullity apex');
    }
    if (!anchors.length) anchors.push('apex latent');

    rows.push({
      regionId: rid,
      apexScore: op10mA11Round(apexScore),
      band: apexBand(apexScore),
      anchors: anchors.slice(0, 3),
      narrative: `${rid} collapse absolute singularity apex ${apexBand(apexScore)} (${op10mA11Round(apexScore)}); ${anchors.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.apexScore - a.apexScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityApex(
  rows: OP10M_A11_CollapseAbsoluteSingularityApexRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'apex').map((r) => r.regionId);
}

export function op10mA11CollapseAbsoluteSingularityApexEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 49;
  return currentIndex >= 43 && currentIndex > priorIndex + 6;
}
