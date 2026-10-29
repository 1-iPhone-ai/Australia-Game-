/** Canonical monolith path — Agent 111 is the sole integrator of this file. */
export const AI_MEMORY_BASELINE_FILE = "(V9.4) australia-game-with-ai.tsx";

/**
 * Normative caps and storage keys for Section 1B match + persistent AI memory.
 * Contract tests assert the baseline file still matches these values.
 */
export const AI_MEMORY_BASELINE_CONSTANTS = {
  AI_MEMORY_EVENT_CAP: 60,
  COMM_MESSAGE_CAP: 40,
  PERSISTENT_MEMORY_STORAGE_KEY: "australia-game.persistent-ai-memory.v1",
  PERSISTENCE_POLICY_STORAGE_KEY:
    "australia-game.persistent-ai-memory-policy.v1",
  HUMAN_PROFILE_ID: "human_player",
  PERSISTENT_STORE_VERSION: 1,
  PRIOR_CONFIDENCE_CAP: 0.5,
  NEGOTIATION_SHIFT_BOUNDS: { min: -0.2, max: 0.2 },
  INFLUENCE_STRENGTH_BOUNDS: { min: 0, max: 2 },
} as const;

/** Exported self-test entrypoints that must remain in the baseline (regression harness). */
export const AI_MEMORY_SELF_TEST_EXPORTS = [
  "runAiMemoryPhase1SelfTests",
  "runAiMemoryPhase2SelfTests",
  "runAiMemoryPhase3SelfTests",
  "runAiMemoryPhase4SelfTests",
  "runAiMemoryPhase5SelfTests",
  "runAiMemoryPhase6SelfTests",
  "runAiMemoryPhase61SelfTests",
] as const;

/** Core public API surface for match + persistent memory (integration contract). */
export const AI_MEMORY_REQUIRED_EXPORTS = [
  "AI_MEMORY_EVENT_CAP",
  "resolveAiMemoryActorId",
  "isAiActor",
  "createFreshAiMemories",
  "clearAllAiMemories",
  "ensureAiMemoriesForActors",
  "migrateAiMemoriesFromSave",
  "applyCommittedActionToAiMemories",
  "applyTurnDecayToAiMemories",
  "recordTeamInstructionMemory",
  "applyAiMemoryInfluence",
  "computeNegotiationThresholdShift",
  "getFilteredAiMemoryInspectionView",
  "loadPersistencePolicy",
  "isPersistenceConsentActive",
  "applyPersistencePolicyToSettings",
  "confirmEnableAndVerifyPersistentMemory",
  "disablePersistentMemory",
  "deletePersistentAiMemory",
  "shouldApplyPersistentPriors",
  "shouldCommitPersistentMemory",
  "profileToPriorSeed",
  "applyPriorsToFreshMemories",
  "extractMatchSummary",
  "consolidateProfile",
  "commitMatchToStore",
  "exportPersistentMemoryBackup",
  "importPersistentMemoryBackup",
  ...AI_MEMORY_SELF_TEST_EXPORTS,
] as const;

/** Save-game field written through migrateAiMemoriesFromSave on load. */
export const AI_MEMORY_SAVE_FIELDS = [
  "aiMemoriesByActor",
  "gameState.aiMemoriesByActor",
] as const;
