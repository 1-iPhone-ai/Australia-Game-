import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseAbsoluteSingularityCulminationBand,
  OP10M_A11_CollapseAbsoluteSingularityCulminationRow,
  OP10M_A11_CollapseTotalSingularityNexusRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidAbsoluteErosionTerminationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function culminationBand(score: number): OP10M_A11_CollapseAbsoluteSingularityCulminationBand {
  if (score < 20) return 'latent';
  if (score < 36) return 'forming';
  if (score < 53) return 'total';
  return 'culmination';
}

export function op10mA11ComputeRegionalCollapseAbsoluteSingularityCulmination(args: {
  collapseTotalSingularityNexus: OP10M_A11_CollapseTotalSingularityNexusRow[];
  voidAbsoluteErosionTermination: OP10M_A11_VoidAbsoluteErosionTerminationRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_CollapseAbsoluteSingularityCulminationRow[]; nationalIndex: number } {
  const nexusByRegion = new Map(args.collapseTotalSingularityNexus.map((n) => [n.regionId, n]));
  const terminationByRegion = new Map(args.voidAbsoluteErosionTermination.map((t) => [t.regionId, t]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_CollapseAbsoluteSingularityCulminationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const nexus = nexusByRegion.get(rid);
    const termination = terminationByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const nexusDrag = nexus ? op10mA11Clamp(nexus.nexusScore * 0.57) : 18;
    const terminationDrag = termination ? op10mA11Clamp(termination.terminationScore * 0.53) : 16;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.5) : 15;

    const culminationScore = op10mA11Clamp(nexusDrag + terminationDrag + sentenceDrag * 0.61);
    weighted += culminationScore;

    const anchors: string[] = [];
    if (nexus && (nexus.band === 'total' || nexus.band === 'nexus')) {
      anchors.push('nexus culmination');
    }
    if (termination && (termination.band === 'absolute' || termination.band === 'total_termination')) {
      anchors.push('erosion culmination');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      anchors.push('nullity culmination');
    }
    if (!anchors.length) anchors.push('culmination latent');

    rows.push({
      regionId: rid,
      culminationScore: op10mA11Round(culminationScore),
      band: culminationBand(culminationScore),
      anchors: anchors.slice(0, 3),
      narrative: `${rid} collapse absolute singularity culmination ${culminationBand(culminationScore)} (${op10mA11Round(culminationScore)}); ${anchors.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.culminationScore - a.culminationScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityCulmination(
  rows: OP10M_A11_CollapseAbsoluteSingularityCulminationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'culmination').map((r) => r.regionId);
}

export function op10mA11CollapseAbsoluteSingularityCulminationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 52;
  return currentIndex >= 46 && currentIndex > priorIndex + 6;
}
