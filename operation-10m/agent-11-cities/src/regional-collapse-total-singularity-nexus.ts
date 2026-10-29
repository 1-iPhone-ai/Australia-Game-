import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseTotalSingularityNexusBand,
  OP10M_A11_CollapseTotalSingularityNexusRow,
  OP10M_A11_CollapseUltimateSingularityZenithRow,
  OP10M_A11_ExistentialAbsoluteNullityVerdictRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalErosionFinalityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function nexusBand(score: number): OP10M_A11_CollapseTotalSingularityNexusBand {
  if (score < 19) return 'latent';
  if (score < 35) return 'forming';
  if (score < 52) return 'total';
  return 'nexus';
}

export function op10mA11ComputeRegionalCollapseTotalSingularityNexus(args: {
  collapseUltimateSingularityZenith: OP10M_A11_CollapseUltimateSingularityZenithRow[];
  voidTotalErosionFinality: OP10M_A11_VoidTotalErosionFinalityRow[];
  existentialAbsoluteNullityVerdict: OP10M_A11_ExistentialAbsoluteNullityVerdictRow[];
}): { rows: OP10M_A11_CollapseTotalSingularityNexusRow[]; nationalIndex: number } {
  const zenithByRegion = new Map(args.collapseUltimateSingularityZenith.map((z) => [z.regionId, z]));
  const finalityByRegion = new Map(args.voidTotalErosionFinality.map((f) => [f.regionId, f]));
  const verdictByRegion = new Map(args.existentialAbsoluteNullityVerdict.map((v) => [v.regionId, v]));

  const rows: OP10M_A11_CollapseTotalSingularityNexusRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const zenith = zenithByRegion.get(rid);
    const finality = finalityByRegion.get(rid);
    const verdict = verdictByRegion.get(rid);

    const zenithDrag = zenith ? op10mA11Clamp(zenith.zenithScore * 0.56) : 17;
    const finalityDrag = finality ? op10mA11Clamp(finality.finalityScore * 0.52) : 15;
    const verdictDrag = verdict ? op10mA11Clamp(verdict.verdictScore * 0.49) : 14;

    const nexusScore = op10mA11Clamp(zenithDrag + finalityDrag + verdictDrag * 0.59);
    weighted += nexusScore;

    const anchors: string[] = [];
    if (zenith && (zenith.band === 'total' || zenith.band === 'zenith')) {
      anchors.push('zenith nexus');
    }
    if (finality && (finality.band === 'final' || finality.band === 'total_finality')) {
      anchors.push('erosion nexus');
    }
    if (verdict && (verdict.band === 'absolute' || verdict.band === 'total_verdict')) {
      anchors.push('nullity nexus');
    }
    if (!anchors.length) anchors.push('nexus latent');

    rows.push({
      regionId: rid,
      nexusScore: op10mA11Round(nexusScore),
      band: nexusBand(nexusScore),
      anchors: anchors.slice(0, 3),
      narrative: `${rid} collapse total singularity nexus ${nexusBand(nexusScore)} (${op10mA11Round(nexusScore)}); ${anchors.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.nexusScore - a.nexusScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityNexus(
  rows: OP10M_A11_CollapseTotalSingularityNexusRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'nexus').map((r) => r.regionId);
}

export function op10mA11CollapseTotalSingularityNexusEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 51;
  return currentIndex >= 45 && currentIndex > priorIndex + 6;
}
