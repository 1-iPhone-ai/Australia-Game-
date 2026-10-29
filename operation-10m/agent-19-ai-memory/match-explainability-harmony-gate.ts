import {
  buildMatchExplainabilitySynthesisBundle,
  matchExplainabilitySynthesisReady,
} from './match-explainability-synthesis-bundle.ts';
import {
  buildSessionSynthesisExportBundle,
  sessionSynthesisExportShipped,
} from './session-synthesis-export-bundle.ts';
import { auditHarmonySynthesisBridge, harmonySynthesisBridgeHealthy } from './harmony-synthesis-bridge.ts';
import type { AiActorMemory, AiRelationship, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface MatchExplainabilityHarmonyGateReport {
  harmonyAllowed: boolean;
  synthesisReady: boolean;
  synthesisExportShipped: boolean;
  nexusSynthesisHealthy: boolean;
  narrativeLines: string[];
}

/** Harmony gate: synthesis bundle + synthesis export + nexus/synthesis bridge. */
export function auditMatchExplainabilityHarmonyGate(
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
): MatchExplainabilityHarmonyGateReport {
  const synthesis = buildMatchExplainabilitySynthesisBundle(packs, params);
  const synthesisExport = buildSessionSynthesisExportBundle(packs, params);
  const bridge = auditHarmonySynthesisBridge(packs, params);
  const synthesisReady = matchExplainabilitySynthesisReady(synthesis);
  const synthesisExportShipped = sessionSynthesisExportShipped(synthesisExport);
  const nexusSynthesisHealthy = harmonySynthesisBridgeHealthy(bridge);
  const harmonyAllowed = synthesisReady && synthesisExportShipped && nexusSynthesisHealthy;
  const narrativeLines = [
    `Match explainability harmony: ${harmonyAllowed ? 'ALLOWED' : 'DENIED'} (synthesis ${synthesisReady ? 'ok' : 'fail'}, export ${synthesisExportShipped ? 'ok' : 'fail'}).`,
    ...synthesis.narrativeLines.slice(0, 2),
    ...bridge.narrativeLines,
  ];
  return {
    harmonyAllowed,
    synthesisReady,
    synthesisExportShipped,
    nexusSynthesisHealthy,
    narrativeLines,
  };
}

export function matchExplainabilityHarmonyAllowed(report: MatchExplainabilityHarmonyGateReport): boolean {
  return report.harmonyAllowed;
}
