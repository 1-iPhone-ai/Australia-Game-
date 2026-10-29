import {
  buildMatchExplainabilityReleaseBundle,
  matchExplainabilityReleaseReady,
} from './match-explainability-release-bundle.ts';
import { buildSessionExportBundle } from './session-export-bundle.ts';
import { buildSessionGiClaimsRollup } from './session-gi-claims-rollup.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export const AGENT19_SESSION_RELEASE_EXPORT_CAP = 12;

export interface SessionReleaseExportBundle {
  schema: string;
  releaseReady: boolean;
  turnCount: number;
  exports: Record<string, unknown>[];
  giClaimIds: string[];
  narrativeLines: string[];
}

/** JSON-safe session release payload when release bundle is ready. */
export function buildSessionReleaseExportBundle(
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
): SessionReleaseExportBundle {
  const release = buildMatchExplainabilityReleaseBundle(packs, params);
  const exportBundle = buildSessionExportBundle(packs, params);
  const gi = buildSessionGiClaimsRollup(packs, { memoryInfluenceEnabled: params.memoryInfluenceEnabled });
  const releaseReady = matchExplainabilityReleaseReady(release);
  const exports = releaseReady
    ? exportBundle.exports.slice(0, AGENT19_SESSION_RELEASE_EXPORT_CAP)
    : [];
  const narrativeLines = [
    `Session release export: ${releaseReady ? 'EMITTED' : 'EMPTY'} (${exports.length} turn record(s), ${gi.claimCount} GI claim(s)).`,
    ...release.narrativeLines.slice(0, 1),
  ];
  return {
    schema: 'agent19.release.v1',
    releaseReady,
    turnCount: packs.length,
    exports,
    giClaimIds: gi.uniqueIds.slice(0, AGENT19_SESSION_RELEASE_EXPORT_CAP),
    narrativeLines,
  };
}

export function sessionReleaseExportEmitted(bundle: SessionReleaseExportBundle): boolean {
  return bundle.releaseReady && bundle.exports.length > 0;
}
