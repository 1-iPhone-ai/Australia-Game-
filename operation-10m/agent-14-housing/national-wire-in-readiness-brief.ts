import type {
  IntegrationTrajectorySnapshot,
  NationalWireInReadinessBrief,
  ScheduleReadinessMonitor,
  WellbeingIntegrationHandoffBrief,
} from './types.ts';

export function composeNationalWireInReadinessBrief(args: {
  turn: number;
  integrationHandoff: WellbeingIntegrationHandoffBrief;
  scheduleReadiness: ScheduleReadinessMonitor;
  integrationTrajectory?: IntegrationTrajectorySnapshot;
}): NationalWireInReadinessBrief {
  const shouldWireNationalTurn =
    args.integrationHandoff.shouldPublishIntegration &&
    args.integrationTrajectory?.band === 'publish' &&
    !args.scheduleReadiness.shouldExpediteSchedule &&
    args.scheduleReadiness.dueThisTurn > 0;

  const headlines: string[] = [];
  if (shouldWireNationalTurn) {
    headlines.push('National wire-in: attach Agent 14 enriched inputs at turn boundary');
  } else {
    headlines.push('National wire-in deferred — schedule or integration band not ready');
  }
  if (args.scheduleReadiness.dueThisTurn > 0) {
    headlines.push(`${args.scheduleReadiness.dueThisTurn} gated commits due for wire-in`);
  }
  if (args.integrationTrajectory?.trajectory === 'improving') {
    headlines.push('Integration readiness trajectory improving');
  }

  const summary = `wire=${shouldWireNationalTurn} due=${args.scheduleReadiness.dueThisTurn} band=${args.integrationTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldWireNationalTurn,
    dueCommitCount: args.scheduleReadiness.dueThisTurn,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
