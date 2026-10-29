import { BASELINE_VERSION_MATRIX } from "../save-compatibility/constants.js";

/** Normative save migration graph — §7 of save-compatibility-spec (Project store). */
export const SAVE_MIGRATION_GRAPH = [
  {
    id: "legacy_v71_expansion",
    entry: "Legacy / 7.0 expansion saves",
    migrator: "migrateSaveToV71Expansion",
    targetLabel: "7.1.0-expansion",
    reducerAction: "MIGRATE_SAVE_DATA",
  },
  {
    id: "game_version_gate",
    entry: "metadata.gameVersion < GAME_VERSION",
    migrator: "v95MigrateSaveForLoad",
    innerMigrator: "migrateV69ToV70SaveData",
    targetLabel: BASELINE_VERSION_MATRIX.GAME_VERSION,
    pipelineStage: "migrate_for_load",
  },
] as const;

/** Replay schema chain is independent of save validation (§10). */
export const REPLAY_MIGRATION_CHAIN = [
  { from: 1, to: 2, fn: "migrateReplaySchema1To2" },
  { from: 2, to: 3, fn: "migrateReplaySchema2To3" },
  { from: 3, to: 4, fn: "migrateReplaySchema3To4" },
] as const;

export const REQUIRED_BASELINE_MIGRATION_EXPORTS = [
  "migrateSaveToV71Expansion",
  "migrateV69ToV70SaveData",
  "v95MigrateSaveForLoad",
  "prepareSaveLoadTransaction",
  "migrateReplayFileWithReport",
] as const;

export const SAVE_MIGRATION_BASELINE_FILE = "(V9.4) australia-game-with-ai.tsx";
