/** Path to the canonical monolith relative to repo root. */
export const BASELINE_GAME_FILE = '(V9.4) australia-game-with-ai.tsx';

/** GL / causal-history section anchors and ownership comments. */
export const REQUIRED_MARKERS = [
  'GL1: Game Activity Ledger — a genuinely separate, optional, disabled-by-default',
  'PHASE 4: CAUSAL-CHAIN EXPLORER ENGINE TRAVERSAL HELPERS',
  'genuinely separate from Decision Transparency and the AI Operations Auditor',
  "causal: '🔗 Causal Explorer'",
  'export function runStrategicWorldReactionSelfTests',
  'export function createGameActivityLedgerEvent',
  'export function pruneLedgerEvents',
  'export interface WorldReactionHistoryEntry',
  'export interface GameActivityLedgerEvent',
  'causal_depth_inconsistency',
];

/** Settings keys for causal / history recording (replayDiag tab). */
export const REQUIRED_SETTINGS_KEYS = [
  'gameActivityLedgerEnabled',
  'gameActivityLedgerIncludeInSaveFile',
  'gameActivityLedgerMaxEvents',
  'gameActivityLedgerRetentionPolicy',
  'gameActivityLedgerRecordingPaused',
  'decisionTransparencyEnabled',
  'whatIfTimelinesEnabled',
];

/** V95 regression suite id for World Reaction causal engine. */
export const SWR_SUITE_ANCHOR = "{ id: 'swr', label: 'World Reaction'";

/** Representative SWR causal self-test ids (subset lock). */
export const SWR_CAUSAL_TEST_IDS = [
  "check('swr_cycle'",
  "check('swr_causal_explanation'",
  "check('swr_replay'",
  "check('swr_debrief'",
];
