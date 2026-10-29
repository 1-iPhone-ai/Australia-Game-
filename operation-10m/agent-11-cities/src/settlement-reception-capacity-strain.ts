import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_AbsorptionStressRow,
  OP10M_A11_ReceptionStrainBand,
  OP10M_A11_ReceptionStrainRow,
  OP10M_A11_RelocationBurdenRow,
  OP10M_A11_RegionId,
  OP10M_A11_ServiceEquityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function strainBand(score: number): OP10M_A11_ReceptionStrainBand {
  if (score < 23) return 'absorptive';
  if (score < 41) return 'tight';
  if (score < 59) return 'strained';
  return 'saturated';
}

export function op10mA11ComputeSettlementReceptionCapacityStrain(args: {
  relocationBurden: OP10M_A11_RelocationBurdenRow[];
  absorptionStress: OP10M_A11_AbsorptionStressRow[];
  serviceEquity: OP10M_A11_ServiceEquityRow[];
}): { rows: OP10M_A11_ReceptionStrainRow[]; nationalIndex: number } {
  const relocationByRegion = new Map(args.relocationBurden.map((r) => [r.regionId, r]));
  const absorptionByRegion = new Map(args.absorptionStress.map((a) => [a.regionId, a]));
  const equityByRegion = new Map(args.serviceEquity.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ReceptionStrainRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const relocation = relocationByRegion.get(rid);
    const absorption = absorptionByRegion.get(rid);
    const equity = equityByRegion.get(rid);

    const inflowLoad = relocation ? op10mA11Clamp(relocation.burdenScore * 0.52) : 15;
    const capacityDrag = absorption ? op10mA11Clamp(absorption.stressScore * 0.4) : 12;
    const serviceDrag = equity
      ? op10mA11Clamp((100 - equity.equityScore) * 0.28 + (equity.band === 'critical_gap' ? 10 : 0))
      : 8;

    const strainScore = op10mA11Clamp(inflowLoad + capacityDrag + serviceDrag);
    weighted += strainScore;

    const factors: string[] = [];
    if (relocation && (relocation.band === 'severe' || relocation.band === 'overwhelming')) {
      factors.push('relocation inflow');
    }
    if (absorption && (absorption.band === 'strained' || absorption.band === 'breached')) {
      factors.push('absorption ceiling');
    }
    if (equity && (equity.band === 'uneven' || equity.band === 'critical_gap')) factors.push('service equity gap');
    if (!factors.length) factors.push('routine reception headroom');

    rows.push({
      regionId: rid,
      strainScore: op10mA11Round(strainScore),
      band: strainBand(strainScore),
      factors: factors.slice(0, 3),
      narrative: `${rid} reception capacity ${strainBand(strainScore)} (${op10mA11Round(strainScore)}); ${factors.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.strainScore - a.strainScore), nationalIndex };
}

export function op10mA11RegionsWithReceptionCapacityStrain(
  rows: OP10M_A11_ReceptionStrainRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'strained' || r.band === 'saturated').map((r) => r.regionId);
}

export function op10mA11ReceptionStrainEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 49;
  return currentIndex >= 43 && currentIndex > priorIndex + 5;
}
