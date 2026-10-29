import {
  buildMatchExplainabilityReleaseBundle,
  matchExplainabilityReleaseReady,
} from './match-explainability-release-bundle.ts';
import {
  auditMatchExplainabilityLaunchGate,
  matchExplainabilityLaunchAllowed,
} from './match-explainability-launch-gate.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface ReleaseLaunchBridgeReport {
  aligned: boolean;
  releaseReady: boolean;
  launchAllowed: boolean;
  narrativeLines: string[];
}

/** Release-ready sessions should allow launch when export emits; reports divergence. */
export function auditReleaseLaunchBridge(
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
): ReleaseLaunchBridgeReport {
  const release = buildMatchExplainabilityReleaseBundle(packs, params);
  const launch = auditMatchExplainabilityLaunchGate(packs, params);
  const releaseReady = matchExplainabilityReleaseReady(release);
  const launchAllowed = matchExplainabilityLaunchAllowed(launch);
  const aligned = !releaseReady || launchAllowed;
  const narrativeLines = [
    `Release/launch bridge: ${aligned ? 'ALIGNED' : 'GAP'} (release ${releaseReady ? 'ready' : 'held'}, launch ${launchAllowed ? 'GO' : 'NO-GO'}).`,
    ...release.narrativeLines.slice(0, 1),
    ...launch.narrativeLines.slice(0, 1),
  ];
  return { aligned, releaseReady, launchAllowed, narrativeLines };
}

export function releaseLaunchBridgeAligned(report: ReleaseLaunchBridgeReport): boolean {
  return report.aligned;
}
