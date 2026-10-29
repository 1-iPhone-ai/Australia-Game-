/**
 * Cross-wire: SECTION 20BD progressive UI unlock matrix v2.
 */
import type { V1014AiFidelityUiGateInput, V1014AiFidelityTurnInput } from '../types/core';
import { clampAiFidelity } from '../engine/ai-fidelity-utils';

const V1014_AI_FIDELITY_UI_SURFACES = [
  'team_coordination3_dashboard',
  'acc17_operations_tab',
  'guardian_advisory_panel',
  'ai_explainability_inspector',
  'flagship_command_palette',
] as const;

export function buildV1014AiFidelityUiGateInput(input: V1014AiFidelityTurnInput): V1014AiFidelityUiGateInput {
  return {
    turn: input.turn,
    nationalDevelopmentIndex: input.nationalDevelopmentIndex,
    featureFlagEnabled: input.featureFlagsEnabled,
    surfaceId: 'team_coordination3_dashboard',
  };
}

export function evaluateV1014AiFidelityUiUnlocks(input: V1014AiFidelityTurnInput): Record<string, boolean> {
  const gate = buildV1014AiFidelityUiGateInput(input);
  const dev = clampAiFidelity(gate.nationalDevelopmentIndex, 0, 1);
  const out: Record<string, boolean> = {};
  for (let i = 0; i < V1014_AI_FIDELITY_UI_SURFACES.length; i++) {
    const surface = V1014_AI_FIDELITY_UI_SURFACES[i];
    const threshold = 0.12 + i * 0.14;
    out[surface] = gate.featureFlagEnabled && dev >= threshold;
  }
  return out;
}

export function countV1014AiFidelityUiSurfacesUnlocked(flags: Record<string, boolean>): number {
  return Object.values(flags).filter(Boolean).length;
}
