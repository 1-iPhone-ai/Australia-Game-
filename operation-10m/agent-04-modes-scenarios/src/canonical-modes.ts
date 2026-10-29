import type { GameModeSelection } from './types.js';

/** Canonical `GameModeSelection` values — must stay in sync with V9.4. */
export const CANONICAL_GAME_MODE_SELECTIONS: readonly GameModeSelection[] = [
  'single',
  'ai',
  'grand_tour',
  'team_human_ai_vs_ai_ai',
  'team_ai_vs_ai',
  'scenario',
] as const;

export function isCanonicalGameModeSelection(value: unknown): value is GameModeSelection {
  return typeof value === 'string' && (CANONICAL_GAME_MODE_SELECTIONS as readonly string[]).includes(value);
}

/** Solo modes that drive a single human vs rival loop (matches `isSoloRivalModeSelection`). */
export const SOLO_RIVAL_MODES: readonly GameModeSelection[] = ['ai', 'grand_tour', 'scenario'] as const;

export function isSoloRivalMode(value: unknown): boolean {
  return typeof value === 'string' && (SOLO_RIVAL_MODES as readonly string[]).includes(value);
}

export function assertCanonicalModesPreserved(candidate: readonly string[]): string[] {
  const missing = CANONICAL_GAME_MODE_SELECTIONS.filter(m => !candidate.includes(m));
  return missing.map(m => `Missing canonical mode: ${m}`);
}
