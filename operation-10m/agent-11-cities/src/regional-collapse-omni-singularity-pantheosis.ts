import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityPanidealismRow,
  OP10M_A11_CollapseOmniSingularityPantheosisBand,
  OP10M_A11_CollapseOmniSingularityPantheosisRow,
  OP10M_A11_ExistentialAbsoluteNullityBeatificationRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalErosionDissipationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function pantheosisBand(score: number): OP10M_A11_CollapseOmniSingularityPantheosisBand {
  if (score < 33) return 'latent';
  if (score < 49) return 'aligning';
  if (score < 66) return 'total';
  return 'pantheosis';
}

export function op10mA11ComputeRegionalCollapseOmniSingularityPantheosis(args: {
  collapseOmniSingularityPanidealism: OP10M_A11_CollapseOmniSingularityPanidealismRow[];
  voidTotalErosionDissipation: OP10M_A11_VoidTotalErosionDissipationRow[];
  existentialAbsoluteNullityBeatification: OP10M_A11_ExistentialAbsoluteNullityBeatificationRow[];
}): { rows: OP10M_A11_CollapseOmniSingularityPantheosisRow[]; nationalIndex: number } {
  const panidealismByRegion = new Map(args.collapseOmniSingularityPanidealism.map((p) => [p.regionId, p]));
  const dissipationByRegion = new Map(args.voidTotalErosionDissipation.map((e) => [e.regionId, e]));
  const beatificationByRegion = new Map(args.existentialAbsoluteNullityBeatification.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_CollapseOmniSingularityPantheosisRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const panidealism = panidealismByRegion.get(rid);
    const dissipation = dissipationByRegion.get(rid);
    const beatification = beatificationByRegion.get(rid);

    const panidealismDrag = panidealism ? op10mA11Clamp(panidealism.panidealismScore * 0.54) : 24;
    const dissipationDrag = dissipation ? op10mA11Clamp(dissipation.dissipationScore * 0.52) : 22;
    const beatificationDrag = beatification ? op10mA11Clamp(beatification.beatificationScore * 0.47) : 21;

    const pantheosisScore = op10mA11Clamp(panidealismDrag + dissipationDrag + beatificationDrag * 0.58);
    weighted += pantheosisScore;

    const marks: string[] = [];
    if (panidealism && (panidealism.band === 'total' || panidealism.band === 'panidealism')) {
      marks.push('panidealism pantheosis');
    }
    if (dissipation && (dissipation.band === 'total' || dissipation.band === 'complete_dissipation')) {
      marks.push('dissipation pantheosis');
    }
    if (beatification && (beatification.band === 'absolute' || beatification.band === 'total_beatification')) {
      marks.push('beatification pantheosis');
    }
    if (!marks.length) marks.push('pantheosis latent');

    rows.push({
      regionId: rid,
      pantheosisScore: op10mA11Round(pantheosisScore),
      band: pantheosisBand(pantheosisScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} collapse omni singularity pantheosis ${pantheosisBand(pantheosisScore)} (${op10mA11Round(pantheosisScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.pantheosisScore - a.pantheosisScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityPantheosis(
  rows: OP10M_A11_CollapseOmniSingularityPantheosisRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'pantheosis').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularityPantheosisEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 65;
  return currentIndex >= 59 && currentIndex > priorIndex + 6;
}
