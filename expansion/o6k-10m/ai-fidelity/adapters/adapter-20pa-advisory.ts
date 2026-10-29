/**
 * Cross-wire: SECTION 20PA Guardian / Co-Pilot advisory escalation.
 */
import type { V1014AiFidelityPaReadSlice, V1014AiFidelityTurnInput, V1014AiFidelityAdvisoryTier } from '../types/core';
import { clampAiFidelity } from '../engine/ai-fidelity-utils';

function tierFromSeverity(severity: number): V1014AiFidelityAdvisoryTier {
  if (severity >= 0.82) return 'escalate';
  if (severity >= 0.62) return 'alert';
  if (severity >= 0.38) return 'advise';
  return 'monitor';
}

export function readV1014AiFidelity20PaSlice(input: V1014AiFidelityTurnInput): V1014AiFidelityPaReadSlice {
  const severity = clampAiFidelity(input.advisoryMonitorSeverity, 0, 1);
  return {
    advisoryTier: tierFromSeverity(severity),
    escalationDebt: clampAiFidelity(severity * 12, 0, 24),
    copilotCandidatesStripped: severity > 0.5 ? Math.round(severity * 4) : 0,
  };
}

export function applyV1014AiFidelity20PaAdvisoryBridge(
  input: V1014AiFidelityTurnInput,
  pavScore: number,
): { advisoryPressure: number; escalationIds: string[] } {
  const slice = readV1014AiFidelity20PaSlice(input);
  const advisoryPressure = clampAiFidelity(
    input.advisoryMonitorSeverity * 0.55 + (1 - pavScore) * 0.25 + slice.escalationDebt * 0.015,
    0,
    1,
  );
  const escalationIds =
    slice.advisoryTier === 'escalate' || slice.advisoryTier === 'alert'
      ? [`20pa_escalation_turn_${input.turn}`]
      : [];
  return { advisoryPressure, escalationIds };
}

export function v1014AiFidelity20PaCopilotStripHint(stripped: number): string {
  return stripped > 0 ? `copilot:stripped=${stripped}` : 'copilot:clean';
}
