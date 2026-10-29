import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_ClimateDisplacementRow,
  OP10M_A11_GovernanceFrictionRow,
  OP10M_A11_HousingSpilloverRow,
  OP10M_A11_RelocationBurdenBand,
  OP10M_A11_RelocationBurdenRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function relocationBand(score: number): OP10M_A11_RelocationBurdenBand {
  if (score < 24) return 'manageable';
  if (score < 42) return 'elevated';
  if (score < 60) return 'severe';
  return 'overwhelming';
}

export function op10mA11ComputeSettlementRelocationBurden(args: {
  climateDisplacement: OP10M_A11_ClimateDisplacementRow[];
  governanceFriction: OP10M_A11_GovernanceFrictionRow[];
  housingSpillover: OP10M_A11_HousingSpilloverRow[];
}): { rows: OP10M_A11_RelocationBurdenRow[]; nationalIndex: number } {
  const climateByRegion = new Map(args.climateDisplacement.map((c) => [c.regionId, c]));
  const governanceByRegion = new Map(args.governanceFriction.map((g) => [g.regionId, g]));
  const housingByRegion = new Map(args.housingSpillover.map((h) => [h.regionId, h]));

  const rows: OP10M_A11_RelocationBurdenRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const climate = climateByRegion.get(rid);
    const governance = governanceByRegion.get(rid);
    const housing = housingByRegion.get(rid);

    const displacementLoad = climate ? op10mA11Clamp(climate.displacementScore * 0.55) : 16;
    const coordinationDrag = governance ? op10mA11Clamp(governance.frictionScore * 0.32) : 12;
    const receptionStress = housing ? op10mA11Clamp(housing.spilloverScore * 0.28) : 10;

    const burdenScore = op10mA11Clamp(displacementLoad + coordinationDrag + receptionStress);
    weighted += burdenScore;

    const factors: string[] = [];
    if (climate && (climate.band === 'acute' || climate.band === 'critical')) factors.push('climate displacement');
    if (governance && (governance.band === 'fragmented' || governance.band === 'breakdown')) {
      factors.push('governance coordination gap');
    }
    if (housing && (housing.band === 'cascade' || housing.band === 'systemic')) factors.push('host market saturation');
    if (!factors.length) factors.push('routine relocation capacity');

    rows.push({
      regionId: rid,
      burdenScore: op10mA11Round(burdenScore),
      band: relocationBand(burdenScore),
      factors: factors.slice(0, 3),
      narrative: `${rid} relocation burden ${relocationBand(burdenScore)} (${op10mA11Round(burdenScore)}); ${factors.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.burdenScore - a.burdenScore), nationalIndex };
}

export function op10mA11RegionsWithOverwhelmingRelocationBurden(
  rows: OP10M_A11_RelocationBurdenRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'severe' || r.band === 'overwhelming').map((r) => r.regionId);
}

export function op10mA11RelocationBurdenEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 50;
  return currentIndex >= 44 && currentIndex > priorIndex + 6;
}
