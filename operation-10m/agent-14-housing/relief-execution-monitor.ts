import type {
  CapacityReliefSchedule,
  CoordinationTrajectorySnapshot,
  ReliefDispatchPlan,
  ReliefExecutionMonitor,
} from './types.ts';

export function buildReliefExecutionMonitor(args: {
  turn: number;
  reliefDispatchPlan: ReliefDispatchPlan;
  reliefSchedule: CapacityReliefSchedule;
  coordinationTrajectory?: CoordinationTrajectorySnapshot;
}): ReliefExecutionMonitor {
  const immediateDue = args.reliefDispatchPlan.actions.filter(
    (a) => a.priority === 'immediate' && a.targetTurn <= args.turn
  ).length;
  const deferredCount = args.reliefDispatchPlan.actions.filter((a) => a.priority === 'deferred').length;
  const holdCount = args.reliefDispatchPlan.actions.filter((a) => a.priority === 'hold').length;
  const scheduleItems = Math.max(1, args.reliefSchedule.items.length);
  const backlogPressure =
    Math.round(
      ((args.reliefDispatchPlan.actions.length + holdCount * 0.5) / scheduleItems) * 100
    ) / 100;

  const coordinationEscalation = args.coordinationTrajectory?.band === 'escalation';
  const shouldEscalateExecution =
    immediateDue >= 2 ||
    args.reliefDispatchPlan.shouldHoldCommits ||
    coordinationEscalation ||
    (backlogPressure >= 1.25 && deferredCount >= 2);

  let summary: string;
  if (args.reliefDispatchPlan.actions.length === 0) {
    summary = shouldEscalateExecution
      ? 'Relief execution: hold commits — monitor capacity binding'
      : 'Relief execution queue clear';
  } else {
    summary = `Relief execution: ${immediateDue} immediate, ${deferredCount} deferred (pressure ${backlogPressure})`;
  }

  return {
    turn: args.turn,
    immediateDue,
    deferredCount,
    holdCount,
    backlogPressure,
    shouldEscalateExecution,
    summary,
  };
}
