import {
  buildSessionReleaseExportBundle,
  type SessionReleaseExportBundle,
} from './session-release-export-bundle.ts';
import {
  auditMatchExplainabilityLaunchGate,
  matchExplainabilityLaunchAllowed,
} from './match-explainability-launch-gate.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface SessionOperationsExportBundle extends SessionReleaseExportBundle {
  launchAllowed: boolean;
  operationsSchema: string;
}

/** Session release export plus launch metadata for replay/ops pipelines. */
export function buildSessionOperationsExportBundle(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    currentTurn: number;
    relationship?: Partial<AiRelationship> | null;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): SessionOperationsExportBundle {
  const base = buildSessionReleaseExportBundle(packs, params);
  const launch = auditMatchExplainabilityLaunchGate(packs, params);
  const launchAllowed = matchExplainabilityLaunchAllowed(launch);
  return {
    ...base,
    launchAllowed,
    operationsSchema: 'agent19.operations.v1',
    narrativeLines: [
      ...base.narrativeLines,
      `Operations export: launch ${launchAllowed ? 'GO' : 'NO-GO'}.`,
    ],
  };
}

export function sessionOperationsExportReady(bundle: SessionOperationsExportBundle): boolean {
  return bundle.releaseReady && bundle.launchAllowed && bundle.exports.length > 0;
}
