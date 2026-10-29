import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CompoundShockSaturationBand,
  OP10M_A11_CompoundShockSaturationRow,
  OP10M_A11_MigrationStabilityRow,
  OP10M_A11_RegionId,
  OP10M_A11_ResilienceFrontierRow,
  OP10M_A11_SystemicFragilityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function saturationBand(score: number): OP10M_A11_CompoundShockSaturationBand {
  if (score < 25) return 'buffered';
  if (score < 43) return 'loading';
  if (score < 60) return 'saturated';
  return 'overwhelmed';
}

export function op10mA11ComputeSettlementCompoundShockSaturation(args: {
  resilienceFrontier: OP10M_A11_ResilienceFrontierRow[];
  systemicFragility: OP10M_A11_SystemicFragilityRow[];
  migrationStabilityErosion: OP10M_A11_MigrationStabilityRow[];
}): { rows: OP10M_A11_CompoundShockSaturationRow[]; nationalIndex: number } {
  const frontierByRegion = new Map(args.resilienceFrontier.map((r) => [r.regionId, r]));
  const systemicByRegion = new Map(args.systemicFragility.map((s) => [s.regionId, s]));
  const migrationByRegion = new Map(args.migrationStabilityErosion.map((m) => [m.regionId, m]));

  const rows: OP10M_A11_CompoundShockSaturationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const frontier = frontierByRegion.get(rid);
    const systemic = systemicByRegion.get(rid);
    const migration = migrationByRegion.get(rid);

    const frontierDrag = frontier ? op10mA11Clamp(frontier.pressureScore * 0.46) : 14;
    const systemicDrag = systemic ? op10mA11Clamp(systemic.fragilityScore * 0.4) : 12;
    const migrationDrag = migration ? op10mA11Clamp(migration.erosionScore * 0.34) : 10;

    const saturationScore = op10mA11Clamp(frontierDrag + systemicDrag + migrationDrag * 0.52);
    weighted += saturationScore;

    const shocks: string[] = [];
    if (frontier && (frontier.band === 'at_limit' || frontier.band === 'breached')) shocks.push('frontier breach');
    if (systemic && (systemic.band === 'systemic' || systemic.band === 'cascade_risk')) {
      shocks.push('compound fragility');
    }
    if (migration && (migration.band === 'unstable' || migration.band === 'chaotic')) {
      shocks.push('migration churn');
    }
    if (!shocks.length) shocks.push('shock absorption');

    rows.push({
      regionId: rid,
      saturationScore: op10mA11Round(saturationScore),
      band: saturationBand(saturationScore),
      shocks: shocks.slice(0, 3),
      narrative: `${rid} compound shock saturation ${saturationBand(saturationScore)} (${op10mA11Round(saturationScore)}); ${shocks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.saturationScore - a.saturationScore), nationalIndex };
}

export function op10mA11RegionsWithOverwhelmingCompoundShocks(
  rows: OP10M_A11_CompoundShockSaturationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'saturated' || r.band === 'overwhelmed').map((r) => r.regionId);
}

export function op10mA11CompoundShockSaturationEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 50;
  return currentIndex >= 44 && currentIndex > priorIndex + 6;
}
