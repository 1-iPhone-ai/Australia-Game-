import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityHolismRow,
  OP10M_A11_CollapseOmniSingularityMonismBand,
  OP10M_A11_CollapseOmniSingularityMonismRow,
  OP10M_A11_ExistentialAbsoluteNullityCertitudeRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalErosionGranulationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function monismBand(score: number): OP10M_A11_CollapseOmniSingularityMonismBand {
  if (score < 28) return 'latent';
  if (score < 44) return 'aligning';
  if (score < 61) return 'total';
  return 'monism';
}

export function op10mA11ComputeRegionalCollapseOmniSingularityMonism(args: {
  collapseOmniSingularityHolism: OP10M_A11_CollapseOmniSingularityHolismRow[];
  voidTotalErosionGranulation: OP10M_A11_VoidTotalErosionGranulationRow[];
  existentialAbsoluteNullityCertitude: OP10M_A11_ExistentialAbsoluteNullityCertitudeRow[];
}): { rows: OP10M_A11_CollapseOmniSingularityMonismRow[]; nationalIndex: number } {
  const holismByRegion = new Map(args.collapseOmniSingularityHolism.map((h) => [h.regionId, h]));
  const granulationByRegion = new Map(args.voidTotalErosionGranulation.map((g) => [g.regionId, g]));
  const certitudeByRegion = new Map(args.existentialAbsoluteNullityCertitude.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_CollapseOmniSingularityMonismRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const holism = holismByRegion.get(rid);
    const granulation = granulationByRegion.get(rid);
    const certitude = certitudeByRegion.get(rid);

    const holismDrag = holism ? op10mA11Clamp(holism.holismScore * 0.51) : 20;
    const granulationDrag = granulation ? op10mA11Clamp(granulation.granulationScore * 0.47) : 18;
    const certitudeDrag = certitude ? op10mA11Clamp(certitude.certitudeScore * 0.44) : 17;

    const monismScore = op10mA11Clamp(holismDrag + granulationDrag + certitudeDrag * 0.55);
    weighted += monismScore;

    const marks: string[] = [];
    if (holism && (holism.band === 'total' || holism.band === 'holism')) {
      marks.push('holism monism');
    }
    if (granulation && (granulation.band === 'total' || granulation.band === 'complete_granulation')) {
      marks.push('granulation monism');
    }
    if (certitude && (certitude.band === 'absolute' || certitude.band === 'total_certitude')) {
      marks.push('certitude monism');
    }
    if (!marks.length) marks.push('monism latent');

    rows.push({
      regionId: rid,
      monismScore: op10mA11Round(monismScore),
      band: monismBand(monismScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} collapse omni singularity monism ${monismBand(monismScore)} (${op10mA11Round(monismScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.monismScore - a.monismScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityMonism(
  rows: OP10M_A11_CollapseOmniSingularityMonismRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'monism').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularityMonismEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 60;
  return currentIndex >= 54 && currentIndex > priorIndex + 6;
}
