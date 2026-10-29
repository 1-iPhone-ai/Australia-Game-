import {
  auditMatchExplainabilityFinalGate,
  matchExplainabilityFinalGateOpen,
} from './match-explainability-final-gate.ts';
import { buildSessionExportBundle, type SessionExportBundle } from './session-export-bundle.ts';
import { buildSessionGiClaimsRollup, type SessionGiClaimsRollup } from './session-gi-claims-rollup.ts';
import { buildMatchRecoveryPlaybook, type MatchRecoveryPlaybook } from './match-recovery-playbook.ts';
import { buildSessionExplainabilityRollup } from './session-explainability-rollup.ts';
import type { AiActorMemory, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_DELIVERY_NARRATIVE_CAP = 8;

export interface MatchExplainabilityDeliveryBundle {
  shippable: boolean;
  exportBundle: SessionExportBundle | null;
  giRollup: SessionGiClaimsRollup;
  recoveryPlaybook: MatchRecoveryPlaybook | null;
  narrativeLines: string[];
}

type DeliveryParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Player-facing delivery bundle: exports when final gate open, playbook when closed. */
export function buildMatchExplainabilityDeliveryBundle(
  packs: TurnExplainabilityPack[],
  params: DeliveryParams,
): MatchExplainabilityDeliveryBundle {
  const finalGate = auditMatchExplainabilityFinalGate(packs, params);
  const giRollup = buildSessionGiClaimsRollup(packs, {
    memoryInfluenceEnabled: params.memoryInfluenceEnabled,
  });
  const sessionRollup = buildSessionExplainabilityRollup(packs);
  const shippable = matchExplainabilityFinalGateOpen(finalGate);
  let exportBundle: SessionExportBundle | null = null;
  let recoveryPlaybook: MatchRecoveryPlaybook | null = null;
  if (shippable) {
    exportBundle = buildSessionExportBundle(packs, params);
  } else {
    recoveryPlaybook = buildMatchRecoveryPlaybook(packs, params);
  }
  const narrativeLines = [
    `Match explainability delivery: ${shippable ? 'SHIPPABLE' : 'BLOCKED'} (${packs.length} turn pack(s)).`,
    ...sessionRollup.narrativeLines.slice(0, 1),
    ...giRollup.narrativeLines.slice(0, 1),
    ...(shippable && exportBundle ? exportBundle.narrativeLines : recoveryPlaybook?.narrativeLines.slice(0, 1) || []),
  ].slice(0, AGENT19_DELIVERY_NARRATIVE_CAP);
  return { shippable, exportBundle, giRollup, recoveryPlaybook, narrativeLines };
}

export function matchExplainabilityDeliveryShippable(bundle: MatchExplainabilityDeliveryBundle): boolean {
  return bundle.shippable;
}
