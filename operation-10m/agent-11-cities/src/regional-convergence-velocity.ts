import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_ConvergenceBand,
  OP10M_A11_ConvergenceVelocityRow,
  OP10M_A11_RegionId,
  OP10M_A11_RegionInequalityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function convergenceBand(velocity: number, spread: number): OP10M_A11_ConvergenceBand {
  if (spread < 18) return 'balanced';
  if (velocity >= 4) return 'catching_up';
  if (velocity <= -3) return 'diverging';
  return 'stalled';
}

export function op10mA11StandingSpread(regions: Record<OP10M_A11_RegionId, OP10M_A11_RegionInequalityRow>): number {
  const standings = OP10M_A11_CORE_REGIONS.map((rid) => regions[rid].relativeStanding);
  return op10mA11Round(Math.max(...standings) - Math.min(...standings));
}

export function op10mA11ComputeRegionalConvergence(args: {
  regions: Record<OP10M_A11_RegionId, OP10M_A11_RegionInequalityRow>;
  priorStandingSpread: number | null;
}): OP10M_A11_ConvergenceVelocityRow {
  const spread = op10mA11StandingSpread(args.regions);
  const prior = args.priorStandingSpread ?? spread;
  const velocity = op10mA11Round(prior - spread);

  const lagging = OP10M_A11_CORE_REGIONS.filter((rid) => args.regions[rid].lagging);
  const leading = OP10M_A11_CORE_REGIONS.filter((rid) => args.regions[rid].leading);
  const band = convergenceBand(velocity, spread);

  return {
    standingSpread: spread,
    velocity,
    band,
    laggingCount: lagging.length,
    leadingCount: leading.length,
    narrative: `Regional standing spread ${spread} (${band}); velocity ${velocity} vs prior ${prior}.`,
  };
}

export function op10mA11ConvergenceStalled(row: OP10M_A11_ConvergenceVelocityRow): boolean {
  return row.band === 'stalled' || row.band === 'diverging';
}

export function op10mA11LaggingRegionsNotClosing(
  regions: Record<OP10M_A11_RegionId, OP10M_A11_RegionInequalityRow>,
  row: OP10M_A11_ConvergenceVelocityRow,
): OP10M_A11_RegionId[] {
  if (row.band === 'catching_up' || row.band === 'balanced') return [];
  return OP10M_A11_CORE_REGIONS.filter((rid) => regions[rid].lagging && regions[rid].relativeStanding < 42);
}
