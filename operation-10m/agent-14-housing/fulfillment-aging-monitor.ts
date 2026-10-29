import type {
  FulfillmentAgingMonitor,
  ReliefFulfillmentPersisted,
  ReliefFulfillmentSnapshot,
} from './types.ts';

export function buildFulfillmentAgingMonitor(args: {
  turn: number;
  reliefFulfillment: ReliefFulfillmentSnapshot;
  persisted: ReliefFulfillmentPersisted;
}): FulfillmentAgingMonitor {
  const overdueActions = args.persisted.openActions.filter((a) => a.targetTurn < args.turn);
  const ages = args.persisted.openActions.map((a) => Math.max(0, args.turn - a.targetTurn));
  const averageAgeTurns =
    ages.length === 0 ? 0 : Math.round((ages.reduce((s, v) => s + v, 0) / ages.length) * 10) / 10;
  const maxAgeTurns = ages.length === 0 ? 0 : Math.max(...ages);
  const shouldExpediteAging =
    overdueActions.length >= 2 || maxAgeTurns >= 2 || args.reliefFulfillment.openCount >= 6;

  const summary =
    args.reliefFulfillment.openCount === 0
      ? 'Fulfillment aging: no open backlog'
      : `Fulfillment aging: ${overdueActions.length} overdue, avg age ${averageAgeTurns} turns`;

  return {
    turn: args.turn,
    openCount: args.reliefFulfillment.openCount,
    overdueCount: overdueActions.length,
    averageAgeTurns,
    maxAgeTurns,
    shouldExpediteAging,
    summary,
  };
}
