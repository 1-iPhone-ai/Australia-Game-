import type {
  Agent14WellbeingAccountabilityScorecard,
  Agent14WellbeingWarningBundle,
  CouplingTrajectorySnapshot,
  CrossPillarCouplingSnapshot,
  NationalHousingWellbeingSnapshot,
  PublicServiceCapacitySnapshot,
  WellbeingResilienceBand,
  WellbeingResilienceSnapshot,
} from './types.ts';

function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function bandFromIndex(index: number): WellbeingResilienceBand {
  if (index >= 72) return 'robust';
  if (index >= 55) return 'steady';
  if (index >= 38) return 'fragile';
  return 'critical';
}

export function computeWellbeingResilienceIndex(args: {
  turn: number;
  capacity: PublicServiceCapacitySnapshot;
  housing: NationalHousingWellbeingSnapshot;
  warnings: Agent14WellbeingWarningBundle;
  coupling: CrossPillarCouplingSnapshot;
  couplingTrajectory?: CouplingTrajectorySnapshot;
  accountabilityScorecard?: Agent14WellbeingAccountabilityScorecard;
}): WellbeingResilienceSnapshot {
  const drivers: string[] = [];
  let stressLoad = 0;

  stressLoad += Math.max(0, 100 - args.capacity.deliveryCapacityIndex) * 0.35;
  if (args.capacity.bindingConstraint !== 'none') {
    stressLoad += 8;
    drivers.push(`Delivery bound by ${args.capacity.bindingConstraint}`);
  }

  if (args.housing.affordabilityStress === 'severe') stressLoad += 18;
  else if (args.housing.affordabilityStress === 'elevated') stressLoad += 10;
  stressLoad += args.housing.regionalEquityGap * 0.45;

  const critical = args.warnings.warnings.filter((w) => w.severity === 'critical').length;
  const elevated = args.warnings.warnings.filter((w) => w.severity === 'elevated').length;
  stressLoad += critical * 12 + elevated * 5;
  if (critical > 0) drivers.push(`${critical} critical wellbeing warning(s)`);

  stressLoad += Math.max(0, 68 - args.coupling.nationalCouplingIndex) * 0.4;
  if (args.coupling.band === 'critical' || args.coupling.band === 'strained') {
    drivers.push(`Coupling ${args.coupling.band}`);
  }
  if (args.couplingTrajectory?.trajectory === 'deteriorating') {
    stressLoad += 10;
    drivers.push('Coupling trajectory deteriorating');
  }

  if (args.accountabilityScorecard?.band === 'failing') stressLoad += 14;
  else if (args.accountabilityScorecard?.band === 'at_risk') stressLoad += 8;

  stressLoad = clamp(stressLoad);
  const resilienceIndex = clamp(100 - stressLoad * 0.92);
  const band = bandFromIndex(resilienceIndex);
  if (band === 'critical' || band === 'fragile') {
    drivers.push(`Resilience ${band} (${resilienceIndex})`);
  }

  return {
    turn: args.turn,
    resilienceIndex,
    band,
    stressLoad,
    drivers: drivers.slice(0, 5),
  };
}
