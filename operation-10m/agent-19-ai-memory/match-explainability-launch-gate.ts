import {
  buildMatchExplainabilityReleaseBundle,
  matchExplainabilityReleaseReady,
} from './match-explainability-release-bundle.ts';
import {
  buildSessionReleaseExportBundle,
  sessionReleaseExportEmitted,
} from './session-release-export-bundle.ts';
import { buildShipmentRecoveryPlaybookBridge } from './shipment-recovery-playbook-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityLaunchGateReport {
  launchAllowed: boolean;
  releaseReady: boolean;
  releaseExportEmitted: boolean;
  recoveryStepCount: number;
  narrativeLines: string[];
}

type LaunchParams = {
  memory: AiActorMemory | null | undefined;
  currentTurn: number;
  relationship?: Partial<AiRelationship> | null;
  decisionsByTurn: Array<{
    before: MemoryInfluenceDecisionLike[];
    after: MemoryInfluenceDecisionLike[];
  }>;
  minConfidenceBand?: ExplainabilityConfidenceBand;
  memoryInfluenceEnabled?: boolean;
};

/** Launch gate: release bundle ready and session release export emitted. */
export function auditMatchExplainabilityLaunchGate(
  packs: TurnExplainabilityPack[],
  params: LaunchParams,
): MatchExplainabilityLaunchGateReport {
  const release = buildMatchExplainabilityReleaseBundle(packs, params);
  const releaseExport = buildSessionReleaseExportBundle(packs, params);
  const recovery = buildShipmentRecoveryPlaybookBridge(packs, params);
  const releaseReady = matchExplainabilityReleaseReady(release);
  const releaseExportEmitted = sessionReleaseExportEmitted(releaseExport);
  const launchAllowed = releaseReady && releaseExportEmitted;
  const narrativeLines = [
    `Match explainability launch: ${launchAllowed ? 'GO' : 'NO-GO'} (release ${releaseReady ? 'ok' : 'fail'}, export ${releaseExportEmitted ? 'ok' : 'fail'}).`,
    ...release.narrativeLines.slice(0, 2),
    ...(launchAllowed ? releaseExport.narrativeLines.slice(0, 1) : recovery.narrativeLines.slice(0, 2)),
  ];
  return {
    launchAllowed,
    releaseReady,
    releaseExportEmitted,
    recoveryStepCount: recovery.stepCount,
    narrativeLines,
  };
}

export function matchExplainabilityLaunchAllowed(report: MatchExplainabilityLaunchGateReport): boolean {
  return report.launchAllowed;
}
