import {
  buildExplainabilityDebugExport,
  explainabilityDebugExportWithinCap,
} from './explainability-debug-export.ts';
import { auditMatchExplainabilityGate, matchExplainabilityGateOpen } from './match-explainability-gate.ts';
import type { AiActorMemory, MemoryInfluenceDecisionLike } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';
import type { ExplainabilityConfidenceBand } from './explainability-confidence-band.ts';

export interface ExplainabilityExportGateReport {
  exportAllowed: boolean;
  gateOpen: boolean;
  exportPayload: Record<string, unknown> | null;
  narrativeLines: string[];
}

/** Debug export is allowed only when match explainability gate is open for the session slice. */
export function auditExplainabilityExportGate(
  packs: TurnExplainabilityPack[],
  params: {
    memory: AiActorMemory | null | undefined;
    decisionsByTurn: Array<{
      before: MemoryInfluenceDecisionLike[];
      after: MemoryInfluenceDecisionLike[];
    }>;
    exportTurnIndex?: number;
    minConfidenceBand?: ExplainabilityConfidenceBand;
    memoryInfluenceEnabled?: boolean;
  },
): ExplainabilityExportGateReport {
  const gate = auditMatchExplainabilityGate(packs, params);
  const gateOpen = matchExplainabilityGateOpen(gate);
  const idx = params.exportTurnIndex ?? Math.max(0, packs.length - 1);
  const pack = packs[idx];
  let exportPayload: Record<string, unknown> | null = null;
  if (gateOpen && pack) {
    exportPayload = buildExplainabilityDebugExport(pack);
  }
  const exportAllowed =
    gateOpen && exportPayload !== null && explainabilityDebugExportWithinCap(exportPayload);
  const narrativeLines = [
    `Explainability export gate: ${exportAllowed ? 'ALLOWED' : 'BLOCKED'} (match gate ${gateOpen ? 'open' : 'closed'}).`,
    ...gate.narrativeLines.slice(0, 1),
  ];
  return { exportAllowed, gateOpen, exportPayload, narrativeLines };
}

export function explainabilityExportAllowed(report: ExplainabilityExportGateReport): boolean {
  return report.exportAllowed;
}
