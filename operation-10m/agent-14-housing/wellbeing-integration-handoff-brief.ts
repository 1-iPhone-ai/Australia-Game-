import type {
  GatedCommitSchedule,
  HandoffTrajectorySnapshot,
  PortfolioHandoffBrief,
  WellbeingIntegrationHandoffBrief,
} from './types.ts';

export function composeWellbeingIntegrationHandoffBrief(args: {
  turn: number;
  portfolioHandoff: PortfolioHandoffBrief;
  handoffTrajectory?: HandoffTrajectorySnapshot;
  gatedCommitSchedule: GatedCommitSchedule;
}): WellbeingIntegrationHandoffBrief {
  const shouldPublishIntegration =
    args.portfolioHandoff.shouldSignalHandoff &&
    args.handoffTrajectory?.band === 'ready' &&
    !args.gatedCommitSchedule.shouldDeferAll;

  const headlines: string[] = [];
  if (shouldPublishIntegration) {
    headlines.push('Integration handoff: publish Agent 14 slice to national turn boundary');
  } else {
    headlines.push('Integration handoff pending — complete gated commit schedule first');
  }
  if (args.gatedCommitSchedule.items.length > 0) {
    headlines.push(`${args.gatedCommitSchedule.items.length} gated commits scheduled`);
  }
  if (args.handoffTrajectory?.trajectory === 'improving') {
    headlines.push('Handoff readiness trajectory improving');
  }

  const summary = `publish=${shouldPublishIntegration} scheduled=${args.gatedCommitSchedule.items.length} defer=${args.gatedCommitSchedule.deferUntilTurn}`;

  return {
    turn: args.turn,
    shouldPublishIntegration,
    scheduledCommitCount: args.gatedCommitSchedule.items.length,
    deferUntilTurn: args.gatedCommitSchedule.deferUntilTurn,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
