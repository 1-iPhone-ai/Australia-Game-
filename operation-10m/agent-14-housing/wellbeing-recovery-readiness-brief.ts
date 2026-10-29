import type {
  PortfolioStabilizationBrief,
  ReliefFulfillmentSnapshot,
  StabilizationTrajectorySnapshot,
  WellbeingRecoveryReadinessBand,
  WellbeingRecoveryReadinessBrief,
} from './types.ts';

function resolveReadiness(
  portfolio: PortfolioStabilizationBrief,
  fulfillment: ReliefFulfillmentSnapshot,
  stabilization?: StabilizationTrajectorySnapshot
): WellbeingRecoveryReadinessBand {
  if (
    portfolio.stabilizationPath === 'blocked' ||
    portfolio.shouldPausePortfolioGrowth ||
    fulfillment.openCount >= 4
  ) {
    return 'not_ready';
  }
  if (
    portfolio.stabilizationPath === 'clear' &&
    fulfillment.openCount === 0 &&
    (stabilization?.band === 'recovering' || stabilization?.trajectory === 'improving')
  ) {
    return 'ready';
  }
  if (fulfillment.fulfilledThisTurn > 0 || portfolio.stabilizationPath === 'watch') {
    return 'partial';
  }
  return portfolio.stabilizationPath === 'clear' ? 'ready' : 'partial';
}

export function composeWellbeingRecoveryReadinessBrief(args: {
  turn: number;
  portfolioBrief: PortfolioStabilizationBrief;
  reliefFulfillment: ReliefFulfillmentSnapshot;
  stabilizationTrajectory?: StabilizationTrajectorySnapshot;
}): WellbeingRecoveryReadinessBrief {
  const readinessBand = resolveReadiness(
    args.portfolioBrief,
    args.reliefFulfillment,
    args.stabilizationTrajectory
  );
  const shouldResumePortfolioGrowth =
    readinessBand === 'ready' &&
    !args.portfolioBrief.shouldPausePortfolioGrowth &&
    args.reliefFulfillment.shouldClearBacklog;

  const headlines: string[] = [];
  if (readinessBand === 'ready') {
    headlines.push('Recovery readiness: resume sequenced portfolio growth');
  } else if (readinessBand === 'partial') {
    headlines.push('Recovery readiness partial — finish relief fulfillment first');
  } else {
    headlines.push('Recovery readiness blocked — hold portfolio expansion');
  }
  if (args.reliefFulfillment.fulfilledThisTurn > 0) {
    headlines.push(`${args.reliefFulfillment.fulfilledThisTurn} relief actions fulfilled this turn`);
  }
  if (args.stabilizationTrajectory?.trajectory === 'improving') {
    headlines.push('Stabilization stress trajectory improving');
  }

  const summary = `${readinessBand} readiness / open=${args.reliefFulfillment.openCount} resume=${shouldResumePortfolioGrowth}`;

  return {
    turn: args.turn,
    readinessBand,
    shouldResumePortfolioGrowth,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
