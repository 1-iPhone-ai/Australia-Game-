/**
 * Normative version matrix for the V9.4 evolution line.
 * Must stay in sync with VERSION_CONSTANTS in `(V9.4) australia-game-with-ai.tsx`.
 * @see docs/save-compatibility-spec.md (Project store)
 */
export const SAVE_COMPAT_BASELINE_FILE = "(V9.4) australia-game-with-ai.tsx";

export const BASELINE_VERSION_MATRIX = {
  GAME_VERSION: "9.5.0",
  SCHEMA_VERSION: "7.1",
  SAVE_SCHEMA_VERSION: "7.1",
  SETTINGS_SCHEMA_VERSION: "7.1",
  REPLAY_SCHEMA_VERSION: "4.0",
  REPLAY_SCHEMA_INT: 4,
  RNG_SCHEMA_VERSION: "1.0",
  CHECKPOINT_SCHEMA_VERSION: "1.0",
  LEDGER_SCHEMA_VERSION: "1.0",
  DIAGNOSTIC_SCHEMA_VERSION: "1.0",
  BALANCE_LAB_SCHEMA_VERSION: "1.0",
  ACTION_PIPELINE_SCHEMA_VERSION: "1.0",
} as const;

/** Ordered stages of prepareSaveLoadTransaction — do not reorder without spec update. */
export const SAVE_LOAD_PIPELINE_STAGES = [
  "parse",
  "structural_guard",
  "capture_source_version",
  "numeric_hazard_scan",
  "validate_save_core",
  "health_diff",
  "migrate_for_load",
  "verify_candidate",
  "critical_invariants",
] as const;

export type SaveLoadPipelineStage = (typeof SAVE_LOAD_PIPELINE_STAGES)[number];

export const SAVE_REQUIRED_TOP_LEVEL_KEYS = [
  "metadata",
  "player",
  "aiPlayer",
  "gameState",
  "gameSettings",
  "notifications",
] as const;

/** Fields that must round-trip when present (V9.5 determinism fixes). */
export const SAVE_ROUND_TRIP_OPTIONAL_KEYS = [
  "rngRegistryState",
  "deterministicCounters",
] as const;

export type PersistenceChangeClass =
  | "P0_presentation"
  | "P1_additive_optional"
  | "P2_additive_default"
  | "P3_match_scoped"
  | "P4_profile_scoped"
  | "P5_semantic_repair"
  | "P6_breaking_structure";

export function requiresSaveSchemaBump(changeClass: PersistenceChangeClass): boolean {
  return changeClass === "P6_breaking_structure";
}
