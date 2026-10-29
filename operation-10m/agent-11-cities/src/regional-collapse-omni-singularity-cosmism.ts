import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityCosmismBand,
  OP10M_A11_CollapseOmniSingularityCosmismRow,
  OP10M_A11_CollapseOmniSingularityUniversalismRow,
  OP10M_A11_ExistentialAbsoluteNullitySealingRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalErosionAblationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function cosmismBand(score: number): OP10M_A11_CollapseOmniSingularityCosmismBand {
  if (score < 31) return 'latent';
  if (score < 47) return 'aligning';
  if (score < 64) return 'total';
  return 'cosmism';
}

export function op10mA11ComputeRegionalCollapseOmniSingularityCosmism(args: {
  collapseOmniSingularityUniversalism: OP10M_A11_CollapseOmniSingularityUniversalismRow[];
  voidTotalErosionAblation: OP10M_A11_VoidTotalErosionAblationRow[];
  existentialAbsoluteNullitySealing: OP10M_A11_ExistentialAbsoluteNullitySealingRow[];
}): { rows: OP10M_A11_CollapseOmniSingularityCosmismRow[]; nationalIndex: number } {
  const universalismByRegion = new Map(args.collapseOmniSingularityUniversalism.map((u) => [u.regionId, u]));
  const ablationByRegion = new Map(args.voidTotalErosionAblation.map((a) => [a.regionId, a]));
  const sealingByRegion = new Map(args.existentialAbsoluteNullitySealing.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_CollapseOmniSingularityCosmismRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const universalism = universalismByRegion.get(rid);
    const ablation = ablationByRegion.get(rid);
    const sealing = sealingByRegion.get(rid);

    const universalismDrag = universalism ? op10mA11Clamp(universalism.universalismScore * 0.54) : 23;
    const ablationDrag = ablation ? op10mA11Clamp(ablation.ablationScore * 0.5) : 21;
    const sealingDrag = sealing ? op10mA11Clamp(sealing.sealingScore * 0.47) : 20;

    const cosmismScore = op10mA11Clamp(universalismDrag + ablationDrag + sealingDrag * 0.58);
    weighted += cosmismScore;

    const marks: string[] = [];
    if (universalism && (universalism.band === 'total' || universalism.band === 'universalism')) {
      marks.push('universalism cosmism');
    }
    if (ablation && (ablation.band === 'total' || ablation.band === 'complete_ablation')) {
      marks.push('ablation cosmism');
    }
    if (sealing && (sealing.band === 'absolute' || sealing.band === 'total_sealing')) {
      marks.push('sealing cosmism');
    }
    if (!marks.length) marks.push('cosmism latent');

    rows.push({
      regionId: rid,
      cosmismScore: op10mA11Round(cosmismScore),
      band: cosmismBand(cosmismScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} collapse omni singularity cosmism ${cosmismBand(cosmismScore)} (${op10mA11Round(cosmismScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.cosmismScore - a.cosmismScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityCosmism(
  rows: OP10M_A11_CollapseOmniSingularityCosmismRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'cosmism').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularityCosmismEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 63;
  return currentIndex >= 57 && currentIndex > priorIndex + 6;
}
