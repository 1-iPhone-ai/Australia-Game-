import type {
  CommitGatingAdvice,
  GatedCommitSchedule,
  GatedCommitScheduleItem,
  PortfolioResumptionPlan,
  ProgramSequencingRecommendation,
} from './types.ts';

export function buildGatedCommitSchedule(args: {
  turn: number;
  commitGating: CommitGatingAdvice;
  resumptionPlan: PortfolioResumptionPlan;
  recommendations?: ProgramSequencingRecommendation[];
  limit?: number;
}): GatedCommitSchedule {
  const limit = args.limit ?? 5;
  const items: GatedCommitScheduleItem[] = [];

  if (!args.commitGating.shouldBlockAllCommits && args.commitGating.allowedNewCommits > 0) {
    for (const action of args.resumptionPlan.actions) {
      items.push({
        programId: action.programId,
        regionId: action.regionId,
        pillar: action.pillar,
        targetTurn: args.turn,
        source: 'resumption',
        rationale: action.rationale,
      });
      if (items.length >= args.commitGating.allowedNewCommits) break;
    }
  }

  if (items.length < limit && !args.commitGating.shouldBlockAllCommits) {
    for (const rec of args.recommendations ?? []) {
      if (!rec.fitsCapacity) continue;
      if (items.some((i) => i.programId === rec.programId)) continue;
      items.push({
        programId: rec.programId,
        regionId: rec.regionId,
        pillar: rec.pillar,
        targetTurn: args.turn + 1,
        source: 'sequencing',
        rationale: rec.rationale,
      });
      if (items.length >= limit) break;
    }
  }

  const deferUntilTurn = args.commitGating.shouldBlockAllCommits
    ? args.resumptionPlan.recommendedResumeTurn
    : args.turn;

  const summary =
    items.length === 0
      ? args.commitGating.shouldBlockAllCommits
        ? `Gated commits deferred until turn ${deferUntilTurn}`
        : 'Gated commit schedule empty'
      : `Gated schedule: ${items.length} commits (${items.filter((i) => i.source === 'resumption').length} resumption)`;

  return {
    turn: args.turn,
    deferUntilTurn,
    shouldDeferAll: args.commitGating.shouldBlockAllCommits,
    items: items.slice(0, limit),
    summary,
  };
}
