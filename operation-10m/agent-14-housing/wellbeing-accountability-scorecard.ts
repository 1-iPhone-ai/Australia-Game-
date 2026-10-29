import type {
  Agent14WellbeingAccountabilityScorecard,
  Agent14WellbeingWarningBundle,
  CrossPillarCouplingSnapshot,
  CouplingTrajectorySnapshot,
  DelayedSpendingPersisted,
  NationalHousingWellbeingSnapshot,
  PublicServiceCapacitySnapshot,
  RegionalWellbeingMemorySnapshot,
} from './types.ts';

function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function scoreBand(score: number): Agent14WellbeingAccountabilityScorecard['band'] {
  if (score >= 78) return 'strong';
  if (score >= 58) return 'adequate';
  if (score >= 38) return 'at_risk';
  return 'failing';
}

function pillarPortfolioBalance(
  spending: DelayedSpendingPersisted
): { score: number; note: string } {
  const counts = { housing: 0, healthcare: 0, education: 0 };
  for (const c of spending.active) counts[c.pillar] += 1;
  const total = counts.housing + counts.healthcare + counts.education;
  if (total === 0) return { score: 55, note: 'No active commitments — portfolio idle' };
  const ideal = total / 3;
  const variance =
    (Math.abs(counts.housing - ideal) +
      Math.abs(counts.healthcare - ideal) +
      Math.abs(counts.education - ideal)) /
    Math.max(1, total);
  const score = clamp(72 - variance * 28);
  return {
    score,
    note: `Portfolio mix H${counts.housing}/He${counts.healthcare}/E${counts.education}`,
  };
}

export function composeWellbeingAccountabilityScorecard(args: {
  turn: number;
  capacity: PublicServiceCapacitySnapshot;
  housing: NationalHousingWellbeingSnapshot;
  warnings: Agent14WellbeingWarningBundle;
  coupling: CrossPillarCouplingSnapshot;
  couplingTrajectory?: CouplingTrajectorySnapshot;
  memory?: RegionalWellbeingMemorySnapshot;
  spendingPersisted: DelayedSpendingPersisted;
}): Agent14WellbeingAccountabilityScorecard {
  const evidence: string[] = [];
  let deliveryScore = clamp(args.capacity.deliveryCapacityIndex);
  if (args.capacity.bindingConstraint !== 'none') {
    deliveryScore -= 8;
    evidence.push(`Delivery bound by ${args.capacity.bindingConstraint}`);
  }

  let equityScore = clamp(100 - args.housing.regionalEquityGap * 1.4);
  if (args.housing.affordabilityStress === 'severe') equityScore -= 12;
  else if (args.housing.affordabilityStress === 'elevated') equityScore -= 6;

  const criticalWarnings = args.warnings.warnings.filter((w) => w.severity === 'critical').length;
  const elevatedWarnings = args.warnings.warnings.filter((w) => w.severity === 'elevated').length;
  let warningScore = clamp(88 - criticalWarnings * 14 - elevatedWarnings * 6);
  if (criticalWarnings > 0) {
    evidence.push(`${criticalWarnings} critical wellbeing warning(s)`);
  }

  let couplingScore = clamp(args.coupling.nationalCouplingIndex);
  if (args.couplingTrajectory?.trajectory === 'deteriorating') couplingScore -= 10;
  if (args.couplingTrajectory?.trajectory === 'improving') couplingScore += 4;

  const portfolio = pillarPortfolioBalance(args.spendingPersisted);
  evidence.push(portfolio.note);

  let memoryScore = 60;
  if (args.memory) {
    const rows = Object.values(args.memory.regions);
    const deteriorating = rows.filter((r) => r.affordabilityTrend === 'deteriorating').length;
    const improving = rows.filter((r) => r.affordabilityTrend === 'improving').length;
    memoryScore = clamp(62 + improving * 3 - deteriorating * 5);
    if (deteriorating >= 3) evidence.push(`${deteriorating} regions with deteriorating affordability EMA`);
  }

  const overallScore = clamp(
    deliveryScore * 0.22 +
      equityScore * 0.24 +
      warningScore * 0.18 +
      couplingScore * 0.2 +
      portfolio.score * 0.08 +
      memoryScore * 0.08
  );

  return {
    turn: args.turn,
    overallScore,
    band: scoreBand(overallScore),
    dimensions: {
      delivery: deliveryScore,
      equity: equityScore,
      warnings: warningScore,
      coupling: couplingScore,
      portfolioBalance: portfolio.score,
      memoryTrend: memoryScore,
    },
    evidence,
  };
}
