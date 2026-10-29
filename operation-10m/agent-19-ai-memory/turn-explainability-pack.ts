import { buildAiMemoryHorizonSnapshot } from './horizon.ts';
import { compareHorizonSnapshots } from './decision-trace.ts';
import { rankInfluenceSlicesByMagnitude } from './explainability.ts';
import { buildMemoryEventTimeline, summarizeMemoryEventTimeline } from './memory-event-timeline.ts';
import { summarizeTurnMemoryInfluence } from './turn-influence-summary.ts';
import { buildCounterfactualMemoryReport } from './counterfactual-explainability.ts';
import type { AiActorMemory, AiMemoryHorizonSnapshot, MemoryInfluenceDecisionLike } from './types.ts';

export interface TurnExplainabilityPack {
  turn: number;
  horizonBefore: AiMemoryHorizonSnapshot;
  horizonAfter: AiMemoryHorizonSnapshot;
  horizonDiffLines: string[];
  influenceSummary: ReturnType<typeof summarizeTurnMemoryInfluence>;
  topSlices: ReturnType<typeof rankInfluenceSlicesByMagnitude>;
  counterfactual: ReturnType<typeof buildCounterfactualMemoryReport>;
  timelineLines: string[];
  narrativeLines: string[];
}

export function buildTurnExplainabilityPack(params: {
  turn: number;
  memoryBefore: AiActorMemory | null | undefined;
  memoryAfter: AiActorMemory | null | undefined;
  decisionsBefore: MemoryInfluenceDecisionLike[];
  decisionsAfter: MemoryInfluenceDecisionLike[];
  persistentMemoryEnabled?: boolean;
}): TurnExplainabilityPack {
  const horizonBefore = buildAiMemoryHorizonSnapshot(params.memoryBefore, {
    persistentMemoryEnabled: params.persistentMemoryEnabled,
  });
  const horizonAfter = buildAiMemoryHorizonSnapshot(params.memoryAfter, {
    persistentMemoryEnabled: params.persistentMemoryEnabled,
  });
  const horizonDiffLines = compareHorizonSnapshots(horizonBefore, horizonAfter);
  const influenceSummary = summarizeTurnMemoryInfluence(params.decisionsBefore, params.decisionsAfter);
  const counterfactual = buildCounterfactualMemoryReport(params.decisionsBefore, params.decisionsAfter);
  const allSlices = params.decisionsAfter.flatMap(d => d.memoryInfluenceSlices || []);
  const topSlices = rankInfluenceSlicesByMagnitude(allSlices, 4);
  const timelineLines = summarizeMemoryEventTimeline(buildMemoryEventTimeline(params.memoryAfter));
  const narrativeLines = [
    `Turn ${params.turn} memory explainability pack.`,
    ...horizonDiffLines,
    ...influenceSummary.narrativeLines,
    ...counterfactual.narrativeLines.slice(0, 2),
    ...timelineLines.slice(0, 3),
  ];
  if (topSlices.length) {
    narrativeLines.push('Strongest influence slices this turn:');
    topSlices.forEach(s => narrativeLines.push(`• [${s.horizon}] ${s.delta >= 0 ? '+' : ''}${s.delta.toFixed(2)} — ${s.reason}`));
  }
  return {
    turn: params.turn,
    horizonBefore,
    horizonAfter,
    horizonDiffLines,
    influenceSummary,
    topSlices,
    counterfactual,
    timelineLines,
    narrativeLines,
  };
}
