import { auditTraceCompositeBridge, traceCompositeBridgeOk } from './trace-composite-bridge.ts';
import type { MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';

export interface SessionTraceCompositeRollup {
  turnCount: number;
  passCount: number;
  failCount: number;
  allPassed: boolean;
  narrativeLines: string[];
}

/** Counts per-turn trace+composite bridge outcomes across a session. */
export function buildSessionTraceCompositeRollup(
  packs: TurnExplainabilityPack[],
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>,
): SessionTraceCompositeRollup {
  let passCount = 0;
  let failCount = 0;
  packs.forEach((pack, i) => {
    const d = decisionsByTurn[i];
    if (!d) return;
    const report = auditTraceCompositeBridge(pack, {
      decisionsBefore: d.before,
      decisionsAfter: d.after,
    });
    if (traceCompositeBridgeOk(report)) passCount += 1;
    else failCount += 1;
  });
  const allPassed = failCount === 0 && passCount === packs.length && packs.length > 0;
  const narrativeLines = [
    `Session trace+composite rollup: ${passCount}/${packs.length} turn(s) passed (${failCount} fail).`,
  ];
  return {
    turnCount: packs.length,
    passCount,
    failCount,
    allPassed,
    narrativeLines,
  };
}

export function sessionTraceCompositeAllPassed(rollup: SessionTraceCompositeRollup): boolean {
  return rollup.allPassed;
}
