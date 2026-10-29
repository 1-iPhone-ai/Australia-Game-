import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CohesionIntegrityRow,
  OP10M_A11_MigrationPressureRow,
  OP10M_A11_MigrationStabilityBand,
  OP10M_A11_MigrationStabilityRow,
  OP10M_A11_MobilityTrapRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function stabilityBand(score: number): OP10M_A11_MigrationStabilityBand {
  if (score < 23) return 'stable';
  if (score < 41) return 'volatile';
  if (score < 59) return 'unstable';
  return 'chaotic';
}

export function op10mA11ComputeInterregionalMigrationStabilityErosion(args: {
  migrationPressure: OP10M_A11_MigrationPressureRow[];
  mobilityTrap: OP10M_A11_MobilityTrapRow[];
  cohesionIntegrity: OP10M_A11_CohesionIntegrityRow[];
}): { rows: OP10M_A11_MigrationStabilityRow[]; nationalIndex: number } {
  const migrationByRegion = new Map(args.migrationPressure.map((m) => [m.regionId, m]));
  const trapByRegion = new Map(args.mobilityTrap.map((t) => [t.regionId, t]));
  const integrityByRegion = new Map(args.cohesionIntegrity.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_MigrationStabilityRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const migration = migrationByRegion.get(rid);
    const trap = trapByRegion.get(rid);
    const integrity = integrityByRegion.get(rid);

    const flowDrag = migration ? op10mA11Clamp(migration.netPressure * 0.46) : 14;
    const trapDrag = trap ? op10mA11Clamp(trap.trapScore * 0.4) : 12;
    const cohesionDrag = integrity ? op10mA11Clamp(integrity.pressureScore * 0.32) : 10;

    const erosionScore = op10mA11Clamp(flowDrag + trapDrag + cohesionDrag * 0.55);
    weighted += erosionScore;

    const signals: string[] = [];
    if (migration && (migration.band === 'high' || migration.band === 'surge')) signals.push('migration surge');
    if (trap && (trap.band === 'trapped' || trap.band === 'immobilized')) signals.push('mobility trap');
    if (integrity && (integrity.band === 'fractured' || integrity.band === 'disintegrating')) {
      signals.push('cohesion fracture');
    }
    if (!signals.length) signals.push('migration stability holding');

    rows.push({
      regionId: rid,
      erosionScore: op10mA11Round(erosionScore),
      band: stabilityBand(erosionScore),
      signals: signals.slice(0, 3),
      narrative: `${rid} migration stability ${stabilityBand(erosionScore)} (${op10mA11Round(erosionScore)}); ${signals.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.erosionScore - a.erosionScore), nationalIndex };
}

export function op10mA11RegionsWithMigrationChaos(rows: OP10M_A11_MigrationStabilityRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'unstable' || r.band === 'chaotic').map((r) => r.regionId);
}

export function op10mA11MigrationStabilityErosionEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 48;
  return currentIndex >= 42 && currentIndex > priorIndex + 6;
}
