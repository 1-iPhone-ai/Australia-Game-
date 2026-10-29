import type {
  AccountabilityBand,
  AccountabilityTrajectorySnapshot,
  Agent14WellbeingAccountabilityScorecard,
  ResilienceTrajectorySnapshot,
  WellbeingGovernanceBand,
  WellbeingGovernancePanel,
  WellbeingResilienceBand,
  WellbeingResilienceSnapshot,
} from './types.ts';

function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function governanceBandFromSignals(args: {
  accountabilityBand: AccountabilityBand;
  resilienceBand: WellbeingResilienceBand;
  accountabilityTrajectory?: AccountabilityTrajectorySnapshot;
  resilienceTrajectory?: ResilienceTrajectorySnapshot;
}): WellbeingGovernanceBand {
  const accFail = args.accountabilityBand === 'failing' || args.accountabilityBand === 'at_risk';
  const resFragile = args.resilienceBand === 'fragile' || args.resilienceBand === 'critical';
  const bothSlipping =
    args.accountabilityTrajectory?.trajectory === 'deteriorating' &&
    args.resilienceTrajectory?.trajectory === 'deteriorating';

  if (accFail && resFragile) return 'crisis';
  if (accFail || resFragile || bothSlipping) return 'misaligned';
  if (
    args.accountabilityTrajectory?.trajectory === 'deteriorating' ||
    args.resilienceTrajectory?.trajectory === 'deteriorating'
  ) {
    return 'watch';
  }
  return 'aligned';
}

export function composeWellbeingGovernancePanel(args: {
  turn: number;
  accountabilityScorecard?: Agent14WellbeingAccountabilityScorecard;
  wellbeingResilience?: WellbeingResilienceSnapshot;
  accountabilityTrajectory?: AccountabilityTrajectorySnapshot;
  resilienceTrajectory?: ResilienceTrajectorySnapshot;
}): WellbeingGovernancePanel {
  const accountabilityBand = args.accountabilityScorecard?.band ?? 'adequate';
  const resilienceBand = args.wellbeingResilience?.band ?? 'steady';
  const governanceScore = clamp(
    (args.accountabilityScorecard?.overallScore ?? 55) * 0.52 +
      (args.wellbeingResilience?.resilienceIndex ?? 55) * 0.48
  );
  const band = governanceBandFromSignals({
    accountabilityBand,
    resilienceBand,
    accountabilityTrajectory: args.accountabilityTrajectory,
    resilienceTrajectory: args.resilienceTrajectory,
  });

  const headlines: string[] = [];
  if (band === 'crisis') headlines.push('Governance crisis — accountability and resilience both stressed');
  else if (band === 'misaligned') headlines.push('Governance misaligned — rebalance portfolio and capacity');
  else if (band === 'watch') headlines.push('Governance watch — one trajectory slipping');
  else headlines.push('Governance aligned across accountability and resilience');

  if (args.resilienceTrajectory?.trajectory === 'improving') {
    headlines.push('Resilience trajectory improving');
  }

  const summary = `${band} governance (${governanceScore}) — accountability ${accountabilityBand}, resilience ${resilienceBand}`;

  return {
    turn: args.turn,
    accountabilityBand,
    resilienceBand,
    governanceScore,
    band,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
