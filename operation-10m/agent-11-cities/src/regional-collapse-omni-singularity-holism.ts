import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityHolismBand,
  OP10M_A11_CollapseOmniSingularityHolismRow,
  OP10M_A11_CollapseOmniSingularitySymbiosisRow,
  OP10M_A11_ExistentialAbsoluteNullityDeterminismRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalErosionPulverizationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function holismBand(score: number): OP10M_A11_CollapseOmniSingularityHolismBand {
  if (score < 27) return 'latent';
  if (score < 43) return 'aligning';
  if (score < 60) return 'total';
  return 'holism';
}

export function op10mA11ComputeRegionalCollapseOmniSingularityHolism(args: {
  collapseOmniSingularitySymbiosis: OP10M_A11_CollapseOmniSingularitySymbiosisRow[];
  voidTotalErosionPulverization: OP10M_A11_VoidTotalErosionPulverizationRow[];
  existentialAbsoluteNullityDeterminism: OP10M_A11_ExistentialAbsoluteNullityDeterminismRow[];
}): { rows: OP10M_A11_CollapseOmniSingularityHolismRow[]; nationalIndex: number } {
  const symbiosisByRegion = new Map(args.collapseOmniSingularitySymbiosis.map((s) => [s.regionId, s]));
  const pulverizationByRegion = new Map(args.voidTotalErosionPulverization.map((p) => [p.regionId, p]));
  const determinismByRegion = new Map(args.existentialAbsoluteNullityDeterminism.map((d) => [d.regionId, d]));

  const rows: OP10M_A11_CollapseOmniSingularityHolismRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const symbiosis = symbiosisByRegion.get(rid);
    const pulverization = pulverizationByRegion.get(rid);
    const determinism = determinismByRegion.get(rid);

    const symbiosisDrag = symbiosis ? op10mA11Clamp(symbiosis.symbiosisScore * 0.5) : 19;
    const pulverizationDrag = pulverization ? op10mA11Clamp(pulverization.pulverizationScore * 0.46) : 17;
    const determinismDrag = determinism ? op10mA11Clamp(determinism.determinismScore * 0.43) : 16;

    const holismScore = op10mA11Clamp(symbiosisDrag + pulverizationDrag + determinismDrag * 0.54);
    weighted += holismScore;

    const marks: string[] = [];
    if (symbiosis && (symbiosis.band === 'total' || symbiosis.band === 'symbiosis')) {
      marks.push('symbiosis holism');
    }
    if (pulverization && (pulverization.band === 'total' || pulverization.band === 'complete_pulverization')) {
      marks.push('pulverization holism');
    }
    if (determinism && (determinism.band === 'absolute' || determinism.band === 'total_determinism')) {
      marks.push('determinism holism');
    }
    if (!marks.length) marks.push('holism latent');

    rows.push({
      regionId: rid,
      holismScore: op10mA11Round(holismScore),
      band: holismBand(holismScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} collapse omni singularity holism ${holismBand(holismScore)} (${op10mA11Round(holismScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.holismScore - a.holismScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityHolism(
  rows: OP10M_A11_CollapseOmniSingularityHolismRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'holism').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularityHolismEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 59;
  return currentIndex >= 53 && currentIndex > priorIndex + 6;
}
