import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CohesionIntegrityBand,
  OP10M_A11_CohesionIntegrityRow,
  OP10M_A11_FiscalCapacityStrainRow,
  OP10M_A11_NetworkErosionRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function integrityBand(score: number): OP10M_A11_CohesionIntegrityBand {
  if (score < 22) return 'cohesive';
  if (score < 40) return 'fraying';
  if (score < 58) return 'fractured';
  return 'disintegrating';
}

export function op10mA11ComputeRegionalCohesionIntegrityPressure(args: {
  regionalCohesionIndex: number;
  networkResilienceErosion: OP10M_A11_NetworkErosionRow[];
  fiscalCapacityStrain: OP10M_A11_FiscalCapacityStrainRow[];
}): { rows: OP10M_A11_CohesionIntegrityRow[]; nationalIndex: number } {
  const erosionByRegion = new Map(args.networkResilienceErosion.map((n) => [n.regionId, n]));
  const fiscalByRegion = new Map(args.fiscalCapacityStrain.map((f) => [f.regionId, f]));
  const nationalCohesionDrag = op10mA11Clamp((100 - args.regionalCohesionIndex) * 0.22);

  const rows: OP10M_A11_CohesionIntegrityRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const erosion = erosionByRegion.get(rid);
    const fiscal = fiscalByRegion.get(rid);

    const networkDrag = erosion ? op10mA11Clamp(erosion.erosionScore * 0.44) : 13;
    const fiscalDrag = fiscal ? op10mA11Clamp(fiscal.strainScore * 0.38) : 11;

    const pressureScore = op10mA11Clamp(networkDrag + fiscalDrag + nationalCohesionDrag);
    weighted += pressureScore;

    const strains: string[] = [];
    if (erosion && (erosion.band === 'eroding' || erosion.band === 'fracturing')) strains.push('network erosion');
    if (fiscal && (fiscal.band === 'fragile' || fiscal.band === 'exhausted')) strains.push('fiscal strain');
    if (args.regionalCohesionIndex < 42) strains.push('national cohesion slip');
    if (!strains.length) strains.push('integrity holding');

    rows.push({
      regionId: rid,
      pressureScore: op10mA11Round(pressureScore),
      band: integrityBand(pressureScore),
      strains: strains.slice(0, 3),
      narrative: `${rid} cohesion integrity ${integrityBand(pressureScore)} (${op10mA11Round(pressureScore)}); ${strains.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.pressureScore - a.pressureScore), nationalIndex };
}

export function op10mA11RegionsWithCohesionIntegrityFracture(
  rows: OP10M_A11_CohesionIntegrityRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'fractured' || r.band === 'disintegrating').map((r) => r.regionId);
}

export function op10mA11CohesionIntegrityEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 46;
  return currentIndex >= 40 && currentIndex > priorIndex + 5;
}
