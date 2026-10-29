import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseAbsoluteSingularityApexRow,
  OP10M_A11_CollapseUltimateSingularityZenithBand,
  OP10M_A11_CollapseUltimateSingularityZenithRow,
  OP10M_A11_ExistentialFinalNullityClosureRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidCompleteErosionTerminalityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function zenithBand(score: number): OP10M_A11_CollapseUltimateSingularityZenithBand {
  if (score < 18) return 'latent';
  if (score < 34) return 'forming';
  if (score < 51) return 'total';
  return 'zenith';
}

export function op10mA11ComputeRegionalCollapseUltimateSingularityZenith(args: {
  collapseAbsoluteSingularityApex: OP10M_A11_CollapseAbsoluteSingularityApexRow[];
  voidCompleteErosionTerminality: OP10M_A11_VoidCompleteErosionTerminalityRow[];
  existentialFinalNullityClosure: OP10M_A11_ExistentialFinalNullityClosureRow[];
}): { rows: OP10M_A11_CollapseUltimateSingularityZenithRow[]; nationalIndex: number } {
  const apexByRegion = new Map(args.collapseAbsoluteSingularityApex.map((a) => [a.regionId, a]));
  const terminalityByRegion = new Map(args.voidCompleteErosionTerminality.map((t) => [t.regionId, t]));
  const closureByRegion = new Map(args.existentialFinalNullityClosure.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_CollapseUltimateSingularityZenithRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const apex = apexByRegion.get(rid);
    const terminality = terminalityByRegion.get(rid);
    const closure = closureByRegion.get(rid);

    const apexDrag = apex ? op10mA11Clamp(apex.apexScore * 0.55) : 16;
    const terminalityDrag = terminality ? op10mA11Clamp(terminality.terminalityScore * 0.51) : 14;
    const closureDrag = closure ? op10mA11Clamp(closure.closureScore * 0.48) : 13;

    const zenithScore = op10mA11Clamp(apexDrag + terminalityDrag + closureDrag * 0.58);
    weighted += zenithScore;

    const anchors: string[] = [];
    if (apex && (apex.band === 'total' || apex.band === 'apex')) {
      anchors.push('apex zenith');
    }
    if (terminality && (terminality.band === 'terminal' || terminality.band === 'total_terminality')) {
      anchors.push('erosion zenith');
    }
    if (closure && (closure.band === 'final' || closure.band === 'total_closure')) {
      anchors.push('nullity zenith');
    }
    if (!anchors.length) anchors.push('zenith latent');

    rows.push({
      regionId: rid,
      zenithScore: op10mA11Round(zenithScore),
      band: zenithBand(zenithScore),
      anchors: anchors.slice(0, 3),
      narrative: `${rid} collapse ultimate singularity zenith ${zenithBand(zenithScore)} (${op10mA11Round(zenithScore)}); ${anchors.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.zenithScore - a.zenithScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityZenith(
  rows: OP10M_A11_CollapseUltimateSingularityZenithRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'zenith').map((r) => r.regionId);
}

export function op10mA11CollapseUltimateSingularityZenithEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 50;
  return currentIndex >= 44 && currentIndex > priorIndex + 6;
}
