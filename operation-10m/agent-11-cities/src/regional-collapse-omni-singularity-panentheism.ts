import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityPantheismRow,
  OP10M_A11_CollapseOmniSingularityPanentheismBand,
  OP10M_A11_CollapseOmniSingularityPanentheismRow,
  OP10M_A11_ExistentialAbsoluteNullityCanonizationRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalErosionExhaustionRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function panentheismBand(score: number): OP10M_A11_CollapseOmniSingularityPanentheismBand {
  if (score < 33) return 'latent';
  if (score < 49) return 'aligning';
  if (score < 66) return 'total';
  return 'panentheism';
}

export function op10mA11ComputeRegionalCollapseOmniSingularityPanentheism(args: {
  collapseOmniSingularityPantheism: OP10M_A11_CollapseOmniSingularityPantheismRow[];
  voidTotalErosionExhaustion: OP10M_A11_VoidTotalErosionExhaustionRow[];
  existentialAbsoluteNullityCanonization: OP10M_A11_ExistentialAbsoluteNullityCanonizationRow[];
}): { rows: OP10M_A11_CollapseOmniSingularityPanentheismRow[]; nationalIndex: number } {
  const pantheismByRegion = new Map(args.collapseOmniSingularityPantheism.map((p) => [p.regionId, p]));
  const exhaustionByRegion = new Map(args.voidTotalErosionExhaustion.map((e) => [e.regionId, e]));
  const canonizationByRegion = new Map(args.existentialAbsoluteNullityCanonization.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_CollapseOmniSingularityPanentheismRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const pantheism = pantheismByRegion.get(rid);
    const exhaustion = exhaustionByRegion.get(rid);
    const canonization = canonizationByRegion.get(rid);

    const pantheismDrag = pantheism ? op10mA11Clamp(pantheism.pantheismScore * 0.54) : 24;
    const exhaustionDrag = exhaustion ? op10mA11Clamp(exhaustion.exhaustionScore * 0.52) : 22;
    const canonizationDrag = canonization ? op10mA11Clamp(canonization.canonizationScore * 0.47) : 21;

    const panentheismScore = op10mA11Clamp(pantheismDrag + exhaustionDrag + canonizationDrag * 0.58);
    weighted += panentheismScore;

    const marks: string[] = [];
    if (pantheism && (pantheism.band === 'total' || pantheism.band === 'pantheism')) {
      marks.push('pantheism panentheism');
    }
    if (exhaustion && (exhaustion.band === 'total' || exhaustion.band === 'complete_exhaustion')) {
      marks.push('exhaustion panentheism');
    }
    if (canonization && (canonization.band === 'absolute' || canonization.band === 'total_canonization')) {
      marks.push('canonization panentheism');
    }
    if (!marks.length) marks.push('panentheism latent');

    rows.push({
      regionId: rid,
      panentheismScore: op10mA11Round(panentheismScore),
      band: panentheismBand(panentheismScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} collapse omni singularity panentheism ${panentheismBand(panentheismScore)} (${op10mA11Round(panentheismScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.panentheismScore - a.panentheismScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityPanentheism(
  rows: OP10M_A11_CollapseOmniSingularityPanentheismRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'panentheism').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularityPanentheismEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 65;
  return currentIndex >= 59 && currentIndex > priorIndex + 6;
}
