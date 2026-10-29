import { commitmentFromProgramStub } from './scenario-sweep.ts';
import { canAcceptSpendingCommitment } from './public-service-capacity.ts';
import type {
  EquityRebalancingAdvice,
  ProgramSequencingRecommendation,
  PublicServiceCapacitySnapshot,
  WellbeingInterventionPriorityItem,
  WellbeingInterventionPriorityQueue,
} from './types.ts';

function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

export function buildWellbeingInterventionPriorityQueue(args: {
  turn: number;
  capacity: PublicServiceCapacitySnapshot;
  recommendations: ProgramSequencingRecommendation[];
  equityRebalancing: EquityRebalancingAdvice;
  limit?: number;
}): WellbeingInterventionPriorityQueue {
  const limit = args.limit ?? 6;
  const byProgram = new Map<string, WellbeingInterventionPriorityItem>();

  for (const region of args.equityRebalancing.laggingRegions) {
    for (const programId of region.suggestedProgramIds) {
      const commitment = commitmentFromProgramStub(programId, args.turn, byProgram.size + 1);
      const fitsCapacity = commitment
        ? canAcceptSpendingCommitment(args.capacity, commitment).allowed
        : false;
      const priorityScore = clamp(region.urgencyScore + (fitsCapacity ? 6 : 0));
      const existing = byProgram.get(programId);
      if (!existing || priorityScore > existing.priorityScore) {
        byProgram.set(programId, {
          rank: 0,
          programId,
          regionId: region.regionId,
          pillar: region.weakestPillar,
          priorityScore,
          source: 'equity',
          fitsCapacity,
          rationale: region.rationale,
        });
      }
    }
  }

  for (const rec of args.recommendations) {
    const commitment = commitmentFromProgramStub(rec.programId, args.turn, byProgram.size + 1);
    const fitsCapacity =
      rec.fitsCapacity ||
      (commitment ? canAcceptSpendingCommitment(args.capacity, commitment).allowed : false);
    const priorityScore = clamp(48 - rec.rank * 4 + (fitsCapacity ? 8 : 0));
    const existing = byProgram.get(rec.programId);
    if (!existing || priorityScore > existing.priorityScore) {
      byProgram.set(rec.programId, {
        rank: 0,
        programId: rec.programId,
        regionId: rec.regionId,
        pillar: rec.pillar,
        priorityScore,
        source: 'sequencing',
        fitsCapacity,
        rationale: rec.rationale,
      });
    }
  }

  if (args.capacity.bindingConstraint !== 'none' && args.capacity.slotsFree <= 1) {
    const relief = args.recommendations.find((r) => r.fitsCapacity);
    if (relief) {
      const existing = byProgram.get(relief.programId);
      const boosted = clamp((existing?.priorityScore ?? 40) + 12);
      byProgram.set(relief.programId, {
        rank: 0,
        programId: relief.programId,
        regionId: relief.regionId,
        pillar: relief.pillar,
        priorityScore: boosted,
        source: 'capacity_relief',
        fitsCapacity: true,
        rationale: `Capacity relief while ${args.capacity.bindingConstraint} binds`,
      });
    }
  }

  const items = [...byProgram.values()]
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, limit)
    .map((item, i) => ({ ...item, rank: i + 1 }));

  const shouldExpedite =
    args.equityRebalancing.shouldEscalate ||
    items.some((i) => i.priorityScore >= 32 && i.fitsCapacity) ||
    (args.capacity.bindingConstraint !== 'none' && items.some((i) => i.source === 'capacity_relief'));

  const summary =
    items.length === 0
      ? 'No ranked interventions — monitor capacity and equity'
      : `Queue ${items.slice(0, 3).map((i) => i.programId).join(', ')}${shouldExpedite ? ' (expedite)' : ''}`;

  return {
    turn: args.turn,
    shouldExpedite,
    items,
    summary,
  };
}
