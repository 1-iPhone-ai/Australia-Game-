import { RegisterObligationInput, ScheduleEventInput, TurnClock, FollowUpRule, FollowUpTrigger } from './types.js';
import { registerObligation } from './scheduled-obligations.js';
import { enqueueScheduledEvent } from './event-scheduling-queue.js';
import type { ScheduledEvent, ScheduledObligation } from './types.js';

export type { FollowUpRule, FollowUpTrigger, FollowUpSpawnKind } from './types.js';

export interface RegisterFollowUpInput {
  id: string;
  triggerRefId: string;
  trigger: FollowUpTrigger;
  dueTurnOffset: number;
  spawnKind: FollowUpRule['spawnKind'];
  spawnId: string;
  spawnKindLabel: string;
  priority?: number;
  duePhase?: FollowUpRule['duePhase'];
}

export function registerFollowUpRule(rules: FollowUpRule[], input: RegisterFollowUpInput): FollowUpRule[] {
  if (rules.some((r) => r.id === input.id)) {
    throw new Error(`registerFollowUpRule: duplicate id ${input.id}`);
  }
  const offset = Math.floor(input.dueTurnOffset);
  if (!Number.isFinite(offset) || offset < 0) {
    throw new Error(`registerFollowUpRule: invalid dueTurnOffset for ${input.id}`);
  }
  const rule: FollowUpRule = {
    id: input.id,
    triggerRefId: input.triggerRefId,
    trigger: input.trigger,
    dueTurnOffset: offset,
    spawnKind: input.spawnKind,
    spawnId: input.spawnId,
    spawnKindLabel: input.spawnKindLabel,
    priority: input.priority,
    duePhase: input.duePhase,
    status: 'armed',
  };
  return [...rules, rule];
}

export interface ApplyFollowUpResult {
  rules: FollowUpRule[];
  obligations: ScheduledObligation[];
  events: ScheduledEvent[];
  scheduledIds: string[];
}

export function applyFollowUpsForTrigger(
  rules: FollowUpRule[],
  obligations: ScheduledObligation[],
  events: ScheduledEvent[],
  clock: TurnClock,
  trigger: FollowUpTrigger,
  triggerRefId: string,
): ApplyFollowUpResult {
  const scheduledIds: string[] = [];
  let nextRules = rules;
  let nextObligations = obligations;
  let nextEvents = events;

  for (const rule of rules) {
    if (rule.status !== 'armed') continue;
    if (rule.trigger !== trigger || rule.triggerRefId !== triggerRefId) continue;

    const dueTurn = clock.turnIndex + rule.dueTurnOffset;
    if (rule.spawnKind === 'obligation') {
      if (nextObligations.some((o) => o.id === rule.spawnId) || nextEvents.some((e) => e.id === rule.spawnId)) {
        continue;
      }
      const input: RegisterObligationInput = {
        id: rule.spawnId,
        dueTurn,
        priority: rule.priority,
        kind: rule.spawnKindLabel,
      };
      nextObligations = registerObligation(nextObligations, input);
      scheduledIds.push(rule.spawnId);
    } else {
      if (nextEvents.some((e) => e.id === rule.spawnId) || nextObligations.some((o) => o.id === rule.spawnId)) {
        continue;
      }
      const input: ScheduleEventInput = {
        id: rule.spawnId,
        dueTurn,
        duePhase: rule.duePhase,
        priority: rule.priority,
        kind: rule.spawnKindLabel,
      };
      nextEvents = enqueueScheduledEvent(nextEvents, clock, input);
      scheduledIds.push(rule.spawnId);
    }

    nextRules = nextRules.map((r) => (r.id === rule.id ? { ...r, status: 'consumed' } : r));
  }

  return { rules: nextRules, obligations: nextObligations, events: nextEvents, scheduledIds };
}

export function armedFollowUpCount(rules: FollowUpRule[]): number {
  return rules.filter((r) => r.status === 'armed').length;
}
