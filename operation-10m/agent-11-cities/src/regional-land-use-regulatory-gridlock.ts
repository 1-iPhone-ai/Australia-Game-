import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_GovernanceFrictionRow,
  OP10M_A11_HousingSpilloverRow,
  OP10M_A11_LandUseGridlockBand,
  OP10M_A11_LandUseGridlockRow,
  OP10M_A11_PeriUrbanPressureRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function gridlockBand(score: number): OP10M_A11_LandUseGridlockBand {
  if (score < 22) return 'fluid';
  if (score < 40) return 'slowing';
  if (score < 58) return 'gridlocked';
  return 'paralyzed';
}

export function op10mA11ComputeRegionalLandUseRegulatoryGridlock(args: {
  governanceFriction: OP10M_A11_GovernanceFrictionRow[];
  periUrbanPressure: OP10M_A11_PeriUrbanPressureRow[];
  housingSpillover: OP10M_A11_HousingSpilloverRow[];
}): { rows: OP10M_A11_LandUseGridlockRow[]; nationalIndex: number } {
  const governanceByRegion = new Map(args.governanceFriction.map((g) => [g.regionId, g]));
  const periByRegion = new Map(args.periUrbanPressure.map((p) => [p.regionId, p]));
  const housingByRegion = new Map(args.housingSpillover.map((h) => [h.regionId, h]));

  const rows: OP10M_A11_LandUseGridlockRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const governance = governanceByRegion.get(rid);
    const peri = periByRegion.get(rid);
    const housing = housingByRegion.get(rid);

    const coordinationDrag = governance ? op10mA11Clamp(governance.frictionScore * 0.46) : 14;
    const sprawlDrag = peri ? op10mA11Clamp(peri.pressureScore * 0.36) : 11;
    const spillDrag = housing ? op10mA11Clamp(housing.spilloverScore * 0.34) : 10;

    const gridlockScore = op10mA11Clamp(coordinationDrag + sprawlDrag + spillDrag * 0.58);
    weighted += gridlockScore;

    const blockers: string[] = [];
    if (governance && (governance.band === 'fragmented' || governance.band === 'breakdown')) {
      blockers.push('multi-tier deadlock');
    }
    if (peri && (peri.band === 'sprawl_risk' || peri.band === 'unchecked')) blockers.push('peri-urban overrun');
    if (housing && (housing.band === 'cascade' || housing.band === 'systemic')) blockers.push('housing spillover');
    if (!blockers.length) blockers.push('routine approvals flow');

    rows.push({
      regionId: rid,
      gridlockScore: op10mA11Round(gridlockScore),
      band: gridlockBand(gridlockScore),
      blockers: blockers.slice(0, 3),
      narrative: `${rid} land-use regulatory ${gridlockBand(gridlockScore)} (${op10mA11Round(gridlockScore)}); ${blockers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.gridlockScore - a.gridlockScore), nationalIndex };
}

export function op10mA11RegionsWithLandUseGridlock(rows: OP10M_A11_LandUseGridlockRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'gridlocked' || r.band === 'paralyzed').map((r) => r.regionId);
}

export function op10mA11LandUseGridlockEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 47;
  return currentIndex >= 41 && currentIndex > priorIndex + 5;
}
