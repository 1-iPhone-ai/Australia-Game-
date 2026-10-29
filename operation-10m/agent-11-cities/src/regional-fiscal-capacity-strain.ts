import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_FiscalCapacityStrainBand,
  OP10M_A11_FiscalCapacityStrainRow,
  OP10M_A11_FiscalUrbanCouplingRow,
  OP10M_A11_GovernanceFrictionRow,
  OP10M_A11_RegionId,
  OP10M_A11_ReliefOverheadRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function strainBand(score: number): OP10M_A11_FiscalCapacityStrainBand {
  if (score < 22) return 'sound';
  if (score < 40) return 'stretched';
  if (score < 58) return 'fragile';
  return 'exhausted';
}

export function op10mA11ComputeRegionalFiscalCapacityStrain(args: {
  fiscalUrbanCoupling: OP10M_A11_FiscalUrbanCouplingRow[];
  reliefOverhead: OP10M_A11_ReliefOverheadRow[];
  governanceFriction: OP10M_A11_GovernanceFrictionRow[];
}): { rows: OP10M_A11_FiscalCapacityStrainRow[]; nationalIndex: number } {
  const fiscalByRegion = new Map(args.fiscalUrbanCoupling.map((f) => [f.regionId, f]));
  const reliefByRegion = new Map(args.reliefOverhead.map((r) => [r.regionId, r]));
  const governanceByRegion = new Map(args.governanceFriction.map((g) => [g.regionId, g]));

  const rows: OP10M_A11_FiscalCapacityStrainRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const fiscal = fiscalByRegion.get(rid);
    const relief = reliefByRegion.get(rid);
    const governance = governanceByRegion.get(rid);

    const mismatchDrag = fiscal
      ? op10mA11Clamp((100 - fiscal.couplingScore) * 0.44 + (fiscal.band === 'misaligned' ? 10 : 0))
      : 14;
    const reliefDrag = relief ? op10mA11Clamp(relief.overheadScore * 0.38) : 11;
    const governanceDrag = governance ? op10mA11Clamp(governance.frictionScore * 0.32) : 10;

    const strainScore = op10mA11Clamp(mismatchDrag + reliefDrag + governanceDrag * 0.55);
    weighted += strainScore;

    const pressures: string[] = [];
    if (fiscal && (fiscal.band === 'strained' || fiscal.band === 'misaligned')) pressures.push('fiscal mismatch');
    if (relief && (relief.band === 'overloaded' || relief.band === 'paralytic')) pressures.push('relief spend');
    if (governance && (governance.band === 'fragmented' || governance.band === 'breakdown')) {
      pressures.push('coordination cost');
    }
    if (!pressures.length) pressures.push('fiscal headroom intact');

    rows.push({
      regionId: rid,
      strainScore: op10mA11Round(strainScore),
      band: strainBand(strainScore),
      pressures: pressures.slice(0, 3),
      narrative: `${rid} fiscal capacity ${strainBand(strainScore)} (${op10mA11Round(strainScore)}); ${pressures.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.strainScore - a.strainScore), nationalIndex };
}

export function op10mA11RegionsWithFiscalCapacityFragility(
  rows: OP10M_A11_FiscalCapacityStrainRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'fragile' || r.band === 'exhausted').map((r) => r.regionId);
}

export function op10mA11FiscalCapacityStrainEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 47;
  return currentIndex >= 41 && currentIndex > priorIndex + 5;
}
