import { buildMatchGateRecoveryHints } from './match-gate-recovery-bridge.ts';
import { buildCompositeRecoveryHints } from './composite-recovery-bridge.ts';
import { auditTraceCompositeBridge } from './trace-composite-bridge.ts';
import { auditMatchExplainabilityGate } from './match-explainability-gate.ts';
import type { AiActorMemory, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_RECOVERY_PLAYBOOK_CAP = 10;

export interface MatchRecoveryPlaybook {
  stepCount: number;
  steps: string[];
  narrativeLines: string[];
}

/** Ordered, deduped recovery steps for a closed match explainability path. */
export function buildMatchRecoveryPlaybook(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): MatchRecoveryPlaybook {
  const gate = auditMatchExplainabilityGate(packs, params);
  const lastIdx = Math.max(0, packs.length - 1);
  const lastPack = packs[lastIdx];
  const lastDecisions = params.decisionsByTurn[lastIdx];
  const steps = buildMatchGateRecoveryHints(gate, {
    memory: params.memory,
    currentTurn: params.currentTurn,
    lastPack,
    lastDecisions: lastDecisions
      ? { before: lastDecisions.before, after: lastDecisions.after }
      : undefined,
  });
  if (lastPack && lastDecisions) {
    const bridge = auditTraceCompositeBridge(lastPack, {
      decisionsBefore: lastDecisions.before,
      decisionsAfter: lastDecisions.after,
    });
    if (!bridge.combinedOk) {
      steps.push(...buildCompositeRecoveryHints(bridge.composite));
    }
  }
  const unique = [...new Set(steps)].slice(0, AGENT19_RECOVERY_PLAYBOOK_CAP);
  const narrativeLines = [
    `Match recovery playbook: ${unique.length} step(s) for ${packs.length} turn pack(s).`,
    ...unique.slice(0, 3).map((s, i) => `${i + 1}. ${s}`),
  ];
  return { stepCount: unique.length, steps: unique, narrativeLines };
}

export function matchRecoveryPlaybookWithinCap(playbook: MatchRecoveryPlaybook): boolean {
  return playbook.stepCount <= AGENT19_RECOVERY_PLAYBOOK_CAP;
}
