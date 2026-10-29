import type {
  CapacityBindingConstraint,
  CapacityReliefSchedule,
  CapacityReliefScheduleItem,
  PublicServiceCapacitySnapshot,
  WellbeingInterventionPriorityQueue,
} from './types.ts';

export function buildCapacityReliefSchedule(args: {
  turn: number;
  capacity: PublicServiceCapacitySnapshot;
  interventionQueue: WellbeingInterventionPriorityQueue;
  limit?: number;
}): CapacityReliefSchedule {
  const limit = args.limit ?? 4;
  const binding = args.capacity.bindingConstraint;
  const items: CapacityReliefScheduleItem[] = [];

  let offset = 1;
  for (const item of args.interventionQueue.items) {
    if (!item.fitsCapacity && binding !== 'none') {
      items.push({
        turn: args.turn,
        regionId: item.regionId,
        pillar: item.pillar,
        programId: item.programId,
        reliefTurnOffset: offset,
        bindingConstraint: binding,
        rationale: `Defer until ${binding} eases — ${item.rationale}`,
      });
      offset += 1;
    } else if (item.source === 'capacity_relief') {
      items.push({
        turn: args.turn,
        regionId: item.regionId,
        pillar: item.pillar,
        programId: item.programId,
        reliefTurnOffset: 0,
        bindingConstraint: binding,
        rationale: item.rationale,
      });
    }
    if (items.length >= limit) break;
  }

  const shouldDeferNewCommits =
    binding === 'fiscal_absorption' ||
    binding === 'workforce' ||
    (binding === 'program_slots' && args.capacity.slotsFree <= 0);

  const summary =
    items.length === 0
      ? shouldDeferNewCommits
        ? `Capacity relief: defer new commits (${binding})`
        : 'Capacity relief schedule clear'
      : `Relief window for ${items.map((i) => i.programId).join(', ')}`;

  return {
    turn: args.turn,
    bindingConstraint: binding,
    shouldDeferNewCommits,
    items: items.slice(0, limit),
    summary,
  };
}
