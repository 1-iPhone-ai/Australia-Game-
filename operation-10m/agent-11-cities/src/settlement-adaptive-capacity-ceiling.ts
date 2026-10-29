import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_AdaptiveCeilingBand,
  OP10M_A11_AdaptiveCeilingRow,
  OP10M_A11_AdaptationLagRow,
  OP10M_A11_FiscalCapacityStrainRow,
  OP10M_A11_ReceptionStrainRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function ceilingBand(score: number): OP10M_A11_AdaptiveCeilingBand {
  if (score < 24) return 'headroom';
  if (score < 42) return 'tight';
  if (score < 60) return 'capped';
  return 'breached';
}

export function op10mA11ComputeSettlementAdaptiveCapacityCeiling(args: {
  climateAdaptationLag: OP10M_A11_AdaptationLagRow[];
  receptionStrain: OP10M_A11_ReceptionStrainRow[];
  fiscalCapacityStrain: OP10M_A11_FiscalCapacityStrainRow[];
}): { rows: OP10M_A11_AdaptiveCeilingRow[]; nationalIndex: number } {
  const lagByRegion = new Map(args.climateAdaptationLag.map((a) => [a.regionId, a]));
  const receptionByRegion = new Map(args.receptionStrain.map((r) => [r.regionId, r]));
  const fiscalByRegion = new Map(args.fiscalCapacityStrain.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_AdaptiveCeilingRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const lag = lagByRegion.get(rid);
    const reception = receptionByRegion.get(rid);
    const fiscal = fiscalByRegion.get(rid);

    const adaptationDrag = lag ? op10mA11Clamp(lag.lagScore * 0.5) : 15;
    const intakeDrag = reception ? op10mA11Clamp(reception.strainScore * 0.38) : 12;
    const fiscalDrag = fiscal ? op10mA11Clamp(fiscal.strainScore * 0.34) : 10;

    const ceilingScore = op10mA11Clamp(adaptationDrag + intakeDrag + fiscalDrag * 0.52);
    weighted += ceilingScore;

    const limits: string[] = [];
    if (lag && (lag.band === 'stalled' || lag.band === 'critical_lag')) limits.push('adaptation lag');
    if (reception && (reception.band === 'strained' || reception.band === 'saturated')) {
      limits.push('reception ceiling');
    }
    if (fiscal && (fiscal.band === 'fragile' || fiscal.band === 'exhausted')) limits.push('fiscal ceiling');
    if (!limits.length) limits.push('adaptive headroom available');

    rows.push({
      regionId: rid,
      ceilingScore: op10mA11Round(ceilingScore),
      band: ceilingBand(ceilingScore),
      limits: limits.slice(0, 3),
      narrative: `${rid} adaptive capacity ${ceilingBand(ceilingScore)} (${op10mA11Round(ceilingScore)}); ${limits.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.ceilingScore - a.ceilingScore), nationalIndex };
}

export function op10mA11RegionsWithBreachedAdaptiveCeiling(rows: OP10M_A11_AdaptiveCeilingRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'capped' || r.band === 'breached').map((r) => r.regionId);
}

export function op10mA11AdaptiveCeilingEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 50;
  return currentIndex >= 44 && currentIndex > priorIndex + 5;
}
