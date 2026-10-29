import type {
  NationalWireInReadinessBrief,
  PublicServiceCapacitySnapshot,
  ScheduleReadinessMonitor,
  TurnBoundaryActivationMonitor,
} from './types.ts';

export function buildTurnBoundaryActivationMonitor(args: {
  turn: number;
  wireInBrief: NationalWireInReadinessBrief;
  scheduleReadiness: ScheduleReadinessMonitor;
  capacity: PublicServiceCapacitySnapshot;
}): TurnBoundaryActivationMonitor {
  const reasons: string[] = [];
  let shouldActivateTurnBoundary =
    args.wireInBrief.shouldWireNationalTurn &&
    !args.scheduleReadiness.shouldExpediteSchedule &&
    args.capacity.deliveryCapacityIndex >= 40;

  if (!args.wireInBrief.shouldWireNationalTurn) {
    reasons.push('Wire-in readiness not set');
    shouldActivateTurnBoundary = false;
  }
  if (args.scheduleReadiness.shouldExpediteSchedule) {
    reasons.push('Gated schedule requires expedite');
    shouldActivateTurnBoundary = false;
  }
  if (args.capacity.bindingConstraint === 'workforce') {
    reasons.push('Workforce binding blocks turn boundary activation');
    shouldActivateTurnBoundary = false;
  }
  if (args.scheduleReadiness.dueThisTurn === 0 && !args.wireInBrief.shouldWireNationalTurn) {
    reasons.push('No commits due at boundary');
  }

  const summary = shouldActivateTurnBoundary
    ? `Turn boundary activation: ready (${args.scheduleReadiness.dueThisTurn} commits due)`
    : reasons.length > 0
      ? `Turn boundary activation blocked — ${reasons[0]}`
      : 'Turn boundary activation pending';

  return {
    turn: args.turn,
    shouldActivateTurnBoundary,
    dueCommitCount: args.scheduleReadiness.dueThisTurn,
    deliveryCapacityIndex: args.capacity.deliveryCapacityIndex,
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
