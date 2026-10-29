import { buildIntegrityRecoveryHints } from './integrity-recovery-hints.ts';
import { auditExplainabilityIntegrity } from './memory-explainability-integrity.ts';
import { buildCompositeRecoveryHints } from './composite-recovery-bridge.ts';
import { auditTraceCompositeBridge } from './trace-composite-bridge.ts';
import type { MatchExplainabilityGateReport } from './match-explainability-gate.ts';
import type { AiActorMemory, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';

export const AGENT19_MATCH_RECOVERY_HINT_CAP = 8;

/** Player hints when match explainability gate is closed — merges integrity, GI, and last-turn composite/trace failures. */
export function buildMatchGateRecoveryHints(
  gate: MatchExplainabilityGateReport,
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    lastPack?: TurnExplainabilityPack | null;
    lastDecisions?: { before: MemoryInfluenceDecisionLike[]; after: MemoryInfluenceDecisionLike[] };
  },
): string[] {
  const hints: string[] = [];
  if (gate.gateOpen) {
    hints.push('Match explainability gate is open — session rollup and GI claims may ship at full detail.');
    return hints.slice(0, AGENT19_MATCH_RECOVERY_HINT_CAP);
  }
  if (!gate.giWithinCap) {
    hints.push('Reduce or dedupe Ask-the-Game claims to stay within the session GI cap.');
  }
  hints.push(...buildIntegrityRecoveryHints(auditExplainabilityIntegrity(params.memory, params.currentTurn)));
  if (params.lastPack && params.lastDecisions) {
    const bridge = auditTraceCompositeBridge(params.lastPack, {
      decisionsBefore: params.lastDecisions.before,
      decisionsAfter: params.lastDecisions.after,
    });
    if (!bridge.combinedOk) {
      hints.push(...buildCompositeRecoveryHints(bridge.composite));
    }
  }
  if (!hints.length) {
    hints.push('Review session confidence band — composite audits may be failing on recent turns.');
  }
  return [...new Set(hints)].slice(0, AGENT19_MATCH_RECOVERY_HINT_CAP);
}

export function matchGateRecoveryNeeded(gate: MatchExplainabilityGateReport): boolean {
  return !gate.gateOpen;
}
