import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_AmenityCostRow,
  OP10M_A11_CommuteWedgeRow,
  OP10M_A11_MigrationPressureRow,
  OP10M_A11_MobilityTrapBand,
  OP10M_A11_MobilityTrapRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function trapBand(score: number): OP10M_A11_MobilityTrapBand {
  if (score < 23) return 'mobile';
  if (score < 41) return 'constrained';
  if (score < 59) return 'trapped';
  return 'immobilized';
}

export function op10mA11ComputeInterregionalMobilityAffordabilityTrap(args: {
  commuteWedge: OP10M_A11_CommuteWedgeRow[];
  migrationPressure: OP10M_A11_MigrationPressureRow[];
  amenityCost: OP10M_A11_AmenityCostRow[];
}): { rows: OP10M_A11_MobilityTrapRow[]; nationalIndex: number } {
  const wedgeByRegion = new Map(args.commuteWedge.map((c) => [c.regionId, c]));
  const migrationByRegion = new Map(args.migrationPressure.map((m) => [m.regionId, m]));
  const amenityByRegion = new Map(args.amenityCost.map((a) => [a.regionId, a]));

  const rows: OP10M_A11_MobilityTrapRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const wedge = wedgeByRegion.get(rid);
    const migration = migrationByRegion.get(rid);
    const amenity = amenityByRegion.get(rid);

    const commuteDrag = wedge ? op10mA11Clamp(wedge.wedgeScore * 0.5) : 15;
    const flowDrag = migration ? op10mA11Clamp(migration.netPressure * 0.42) : 12;
    const costDrag = amenity ? op10mA11Clamp(amenity.amenityScore * 0.38) : 11;

    const trapScore = op10mA11Clamp(commuteDrag + flowDrag + costDrag * 0.6);
    weighted += trapScore;

    const binds: string[] = [];
    if (wedge && (wedge.band === 'severe' || wedge.band === 'unsustainable')) binds.push('commute wedge');
    if (migration && (migration.band === 'high' || migration.band === 'surge')) binds.push('migration pressure');
    if (amenity && (amenity.band === 'strained' || amenity.band === 'crisis')) binds.push('amenity lock-in');
    if (!binds.length) binds.push('open mobility');

    rows.push({
      regionId: rid,
      trapScore: op10mA11Round(trapScore),
      band: trapBand(trapScore),
      binds: binds.slice(0, 3),
      narrative: `${rid} mobility affordability ${trapBand(trapScore)} (${op10mA11Round(trapScore)}); ${binds.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.trapScore - a.trapScore), nationalIndex };
}

export function op10mA11RegionsWithMobilityTrap(rows: OP10M_A11_MobilityTrapRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'trapped' || r.band === 'immobilized').map((r) => r.regionId);
}

export function op10mA11MobilityTrapEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 49;
  return currentIndex >= 43 && currentIndex > priorIndex + 6;
}
