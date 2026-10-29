import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseAbsoluteSingularityApexRow,
  OP10M_A11_ExistentialAbsoluteNullityVerdictBand,
  OP10M_A11_ExistentialAbsoluteNullityVerdictRow,
  OP10M_A11_ExistentialFinalNullityClosureRow,
  OP10M_A11_ExistentialUltimateNullitySealRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function verdictBand(score: number): OP10M_A11_ExistentialAbsoluteNullityVerdictBand {
  if (score < 19) return 'trace';
  if (score < 35) return 'judging';
  if (score < 52) return 'absolute';
  return 'total_verdict';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullityVerdict(args: {
  existentialFinalNullityClosure: OP10M_A11_ExistentialFinalNullityClosureRow[];
  collapseAbsoluteSingularityApex: OP10M_A11_CollapseAbsoluteSingularityApexRow[];
  existentialUltimateNullitySeal: OP10M_A11_ExistentialUltimateNullitySealRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullityVerdictRow[]; nationalIndex: number } {
  const closureByRegion = new Map(args.existentialFinalNullityClosure.map((c) => [c.regionId, c]));
  const apexByRegion = new Map(args.collapseAbsoluteSingularityApex.map((a) => [a.regionId, a]));
  const sealByRegion = new Map(args.existentialUltimateNullitySeal.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullityVerdictRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const closure = closureByRegion.get(rid);
    const apex = apexByRegion.get(rid);
    const seal = sealByRegion.get(rid);

    const closureDrag = closure ? op10mA11Clamp(closure.closureScore * 0.52) : 15;
    const apexDrag = apex ? op10mA11Clamp(apex.apexScore * 0.48) : 13;
    const sealDrag = seal ? op10mA11Clamp(seal.sealScore * 0.49) : 12;

    const verdictScore = op10mA11Clamp(closureDrag + apexDrag + sealDrag * 0.59);
    weighted += verdictScore;

    const marks: string[] = [];
    if (closure && (closure.band === 'final' || closure.band === 'total_closure')) {
      marks.push('closure verdict');
    }
    if (apex && (apex.band === 'total' || apex.band === 'apex')) {
      marks.push('apex verdict');
    }
    if (seal && (seal.band === 'ultimate' || seal.band === 'total_seal')) {
      marks.push('seal verdict');
    }
    if (!marks.length) marks.push('verdict trace');

    rows.push({
      regionId: rid,
      verdictScore: op10mA11Round(verdictScore),
      band: verdictBand(verdictScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity verdict ${verdictBand(verdictScore)} (${op10mA11Round(verdictScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.verdictScore - a.verdictScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullityVerdict(
  rows: OP10M_A11_ExistentialAbsoluteNullityVerdictRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_verdict').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullityVerdictEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 52;
  return currentIndex >= 46 && currentIndex > priorIndex + 6;
}
