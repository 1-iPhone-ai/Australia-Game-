import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityAmalgamationRow,
  OP10M_A11_CollapseOmniSingularitySymbiosisBand,
  OP10M_A11_CollapseOmniSingularitySymbiosisRow,
  OP10M_A11_ExistentialAbsoluteNullityInevitabilityRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalErosionAtomizationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function symbiosisBand(score: number): OP10M_A11_CollapseOmniSingularitySymbiosisBand {
  if (score < 26) return 'latent';
  if (score < 42) return 'aligning';
  if (score < 59) return 'total';
  return 'symbiosis';
}

export function op10mA11ComputeRegionalCollapseOmniSingularitySymbiosis(args: {
  collapseOmniSingularityAmalgamation: OP10M_A11_CollapseOmniSingularityAmalgamationRow[];
  voidTotalErosionAtomization: OP10M_A11_VoidTotalErosionAtomizationRow[];
  existentialAbsoluteNullityInevitability: OP10M_A11_ExistentialAbsoluteNullityInevitabilityRow[];
}): { rows: OP10M_A11_CollapseOmniSingularitySymbiosisRow[]; nationalIndex: number } {
  const amalgamationByRegion = new Map(args.collapseOmniSingularityAmalgamation.map((a) => [a.regionId, a]));
  const atomizationByRegion = new Map(args.voidTotalErosionAtomization.map((a) => [a.regionId, a]));
  const inevitabilityByRegion = new Map(args.existentialAbsoluteNullityInevitability.map((i) => [i.regionId, i]));

  const rows: OP10M_A11_CollapseOmniSingularitySymbiosisRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const amalgamation = amalgamationByRegion.get(rid);
    const atomization = atomizationByRegion.get(rid);
    const inevitability = inevitabilityByRegion.get(rid);

    const amalgamationDrag = amalgamation ? op10mA11Clamp(amalgamation.amalgamationScore * 0.51) : 19;
    const atomizationDrag = atomization ? op10mA11Clamp(atomization.atomizationScore * 0.47) : 17;
    const inevitabilityDrag = inevitability ? op10mA11Clamp(inevitability.inevitabilityScore * 0.44) : 16;

    const symbiosisScore = op10mA11Clamp(amalgamationDrag + atomizationDrag + inevitabilityDrag * 0.55);
    weighted += symbiosisScore;

    const marks: string[] = [];
    if (amalgamation && (amalgamation.band === 'total' || amalgamation.band === 'amalgamation')) {
      marks.push('amalgamation symbiose');
    }
    if (atomization && (atomization.band === 'total' || atomization.band === 'complete_atomization')) {
      marks.push('atomization symbiose');
    }
    if (inevitability && (inevitability.band === 'absolute' || inevitability.band === 'total_inevitability')) {
      marks.push('inevitability symbiose');
    }
    if (!marks.length) marks.push('symbiosis latent');

    rows.push({
      regionId: rid,
      symbiosisScore: op10mA11Round(symbiosisScore),
      band: symbiosisBand(symbiosisScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} collapse omni singularity symbiosis ${symbiosisBand(symbiosisScore)} (${op10mA11Round(symbiosisScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.symbiosisScore - a.symbiosisScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularitySymbiosis(
  rows: OP10M_A11_CollapseOmniSingularitySymbiosisRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'symbiosis').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularitySymbiosisEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 58;
  return currentIndex >= 52 && currentIndex > priorIndex + 6;
}
