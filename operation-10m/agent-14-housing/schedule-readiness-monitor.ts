import type { GatedCommitSchedule, ScheduleReadinessMonitor } from './types.ts';

export function buildScheduleReadinessMonitor(args: {
  turn: number;
  gatedCommitSchedule: GatedCommitSchedule;
}): ScheduleReadinessMonitor {
  const dueThisTurn = args.gatedCommitSchedule.items.filter((i) => i.targetTurn <= args.turn).length;
  const futureItems = args.gatedCommitSchedule.items.filter((i) => i.targetTurn > args.turn).length;
  const overdue = args.gatedCommitSchedule.shouldDeferAll && args.turn >= args.gatedCommitSchedule.deferUntilTurn
    ? args.gatedCommitSchedule.items.length
    : 0;
  const total = Math.max(1, args.gatedCommitSchedule.items.length);
  const readinessRatio = Math.round((dueThisTurn / total) * 100) / 100;

  const shouldExpediteSchedule =
    args.gatedCommitSchedule.shouldDeferAll ||
    (dueThisTurn === 0 && futureItems >= 3) ||
    overdue > 0;

  const summary = args.gatedCommitSchedule.shouldDeferAll
    ? `Schedule readiness: deferred until turn ${args.gatedCommitSchedule.deferUntilTurn}`
    : dueThisTurn > 0
      ? `Schedule readiness: ${dueThisTurn} commits due this turn`
      : 'Schedule readiness: no commits due';

  return {
    turn: args.turn,
    dueThisTurn,
    futureItems,
    overdueCount: overdue,
    readinessRatio,
    shouldExpediteSchedule,
    summary,
  };
}
