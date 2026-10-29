import { EffectTraceEntry, TurnPhase } from './types.js';

/** Stable OP10M stage ids for Agent 25 / cross-system XS-01 visibility. */
export const OP10M_AGENT02_PIPELINE_STAGE_IDS = [
  'ag02:phase.start',
  'ag02:phase.main',
  'ag02:phase.end',
  'ag02:effects.obligations',
  'ag02:effects.events',
  'ag02:effects.construction',
  'ag02:clock.roll',
  'ag02:advance.blocked',
] as const;

export type Op10mAgent02PipelineStageId = (typeof OP10M_AGENT02_PIPELINE_STAGE_IDS)[number];

export interface Agent02PipelineStageHit {
  stageId: Op10mAgent02PipelineStageId;
  turnIndex: number;
  dayIndex: number;
  sequence: number;
}

const PHASE_STAGE: Record<TurnPhase, Op10mAgent02PipelineStageId> = {
  start: 'ag02:phase.start',
  main: 'ag02:phase.main',
  end: 'ag02:phase.end',
};

function pushHit(
  hits: Agent02PipelineStageHit[],
  stageId: Op10mAgent02PipelineStageId,
  entry: EffectTraceEntry,
): void {
  hits.push({
    stageId,
    turnIndex: entry.turnIndex,
    dayIndex: entry.dayIndex,
    sequence: entry.sequence,
  });
}

export function derivePipelineStageHits(
  trace: EffectTraceEntry[],
  throughSequence?: number,
): Agent02PipelineStageHit[] {
  const hits: Agent02PipelineStageHit[] = [];
  for (const entry of trace) {
    if (throughSequence !== undefined && entry.sequence > throughSequence) break;
    switch (entry.kind) {
      case 'phase_enter':
        pushHit(hits, PHASE_STAGE[entry.phase], entry);
        break;
      case 'obligation_fired':
        pushHit(hits, 'ag02:effects.obligations', entry);
        break;
      case 'event_dispatched':
        pushHit(hits, 'ag02:effects.events', entry);
        break;
      case 'construction_labor':
      case 'construction_completed':
        pushHit(hits, 'ag02:effects.construction', entry);
        break;
      case 'advance_blocked':
        pushHit(hits, 'ag02:advance.blocked', entry);
        break;
      default:
        break;
    }
  }
  return hits;
}

export interface Agent02PipelineTurnSummary {
  turnIndex: number;
  stageIds: Op10mAgent02PipelineStageId[];
  blocked: boolean;
  rolled: boolean;
}

export function summarizePipelineByTurn(
  trace: EffectTraceEntry[],
  activeTurnIndex?: number,
): Agent02PipelineTurnSummary[] {
  const byTurn = new Map<number, Agent02PipelineTurnSummary>();

  for (const entry of trace) {
    if (entry.kind === 'phase_enter') {
      const row = byTurn.get(entry.turnIndex) ?? {
        turnIndex: entry.turnIndex,
        stageIds: [],
        blocked: false,
        rolled: false,
      };
      const stage = PHASE_STAGE[entry.phase];
      if (!row.stageIds.includes(stage)) row.stageIds.push(stage);
      byTurn.set(entry.turnIndex, row);
    }
    if (entry.kind === 'advance_blocked') {
      const row = byTurn.get(entry.turnIndex) ?? {
        turnIndex: entry.turnIndex,
        stageIds: [],
        blocked: false,
        rolled: false,
      };
      row.blocked = true;
      if (!row.stageIds.includes('ag02:advance.blocked')) row.stageIds.push('ag02:advance.blocked');
      byTurn.set(entry.turnIndex, row);
    }
  }

  const turns = [...byTurn.keys()].sort((a, b) => a - b);
  for (const turn of turns) {
    const row = byTurn.get(turn)!;
    if (row.blocked) continue;
    const hasEnd = row.stageIds.includes('ag02:phase.end');
    const rolledByClock =
      activeTurnIndex !== undefined && activeTurnIndex > row.turnIndex && hasEnd;
    const next = turns[turns.indexOf(turn) + 1];
    row.rolled = rolledByClock || (hasEnd && next !== undefined && next === turn + 1);
    if (row.rolled && !row.stageIds.includes('ag02:clock.roll')) {
      row.stageIds.push('ag02:clock.roll');
    }
  }

  return [...byTurn.values()].sort((a, b) => a.turnIndex - b.turnIndex);
}

const REQUIRED_PHASE_STAGES: Op10mAgent02PipelineStageId[] = [
  'ag02:phase.start',
  'ag02:phase.main',
  'ag02:phase.end',
];

export function incompletePipelineTurns(trace: EffectTraceEntry[], activeTurnIndex?: number): number[] {
  const summaries = summarizePipelineByTurn(trace, activeTurnIndex);
  const incomplete: number[] = [];
  for (const row of summaries) {
    if (row.blocked) continue;
    const missingPhase = REQUIRED_PHASE_STAGES.some((s) => !row.stageIds.includes(s));
    if (missingPhase || !row.rolled) incomplete.push(row.turnIndex);
  }
  return incomplete;
}

export function listRegisteredPipelineStageIds(): Op10mAgent02PipelineStageId[] {
  return [...OP10M_AGENT02_PIPELINE_STAGE_IDS];
}
