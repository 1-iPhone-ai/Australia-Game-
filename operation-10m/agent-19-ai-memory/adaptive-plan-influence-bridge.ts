import { explainAdaptivePlan } from './adaptive-plan-explainability.ts';
import type { AiActorMemory } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';

export const AGENT19_DIRECTIVE_BRIDGE_MAG_THRESHOLD = 5;

/** Links team_directive influence slices to adaptive counter-plan narratives for the same turn. */
export function buildAdaptivePlanInfluenceBridge(
  memory: AiActorMemory | null | undefined,
  pack: TurnExplainabilityPack,
): string[] {
  const directiveMag = Math.abs(pack.influenceSummary.byHorizon.team_directive?.totalDelta ?? 0);
  const lines = explainAdaptivePlan(memory);
  if (directiveMag >= AGENT19_DIRECTIVE_BRIDGE_MAG_THRESHOLD && memory?.adaptivePlan) {
    lines.push(
      `Team-directive slices contributed ${directiveMag.toFixed(2)} |Δ| this turn — cross-check adaptive plan (${memory.adaptivePlan.status}).`,
    );
  } else if (directiveMag >= AGENT19_DIRECTIVE_BRIDGE_MAG_THRESHOLD) {
    lines.push(
      `Team-directive influence ${directiveMag.toFixed(2)} |Δ| without an adaptive plan — cite team directives only.`,
    );
  }
  return lines;
}

export function adaptivePlanInfluenceAligned(
  memory: AiActorMemory | null | undefined,
  pack: TurnExplainabilityPack,
): boolean {
  const directiveMag = Math.abs(pack.influenceSummary.byHorizon.team_directive?.totalDelta ?? 0);
  if (directiveMag < AGENT19_DIRECTIVE_BRIDGE_MAG_THRESHOLD) return true;
  if (!memory?.adaptivePlan) return true;
  return memory.adaptivePlan.status !== 'abandoned' || directiveMag < 15;
}
