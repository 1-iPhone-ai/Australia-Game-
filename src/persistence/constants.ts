/** Canonical monolith path for static analysis (no runtime import). */
export const PERSISTENCE_BASELINE_FILE = "(V9.4) australia-game-with-ai.tsx";

/**
 * V10+ blobs that `validateSaveDataCore` must sanitize on load (gameState keys).
 * Source: sanitizedGameState block ~L134398 in baseline.
 */
export const V10_PERSISTED_GAME_STATE_KEYS = [
  "nationalSystems",
  "industries",
  "infrastructureNetworks",
  "megaprojects",
  "nationalDevelopment",
  "innovation",
  "systemicRisk",
  "nationalPriorities",
  "economicGeography",
  "workforceHumanCapital",
  "stateCapacity",
  "publicFinance",
  "householdEconomy",
] as const;

/** Top-level save keys written by runtime `buildSaveData` that must round-trip (V9.5 F01). */
export const SAVE_ROUND_TRIP_TOP_LEVEL_KEYS = [
  "rngRegistryState",
  "deterministicCounters",
] as const;

/**
 * Locked numeric caps referenced by roadmap P2 (Agent 84) and G4 save/replay gate.
 * Values must match `export const …_LIMITS` in the baseline file.
 */
export const PERSISTENCE_LIMITS_LOCK = {
  NATIONAL_LIMITS: {
    history: 30,
    cooldowns: 60,
    flows: 80,
  },
  V1013_LIMITS: {
    maxHistory: 24,
    history: 24,
    maxTransitions: 16,
    transitions: 16,
    maxVulnerabilities: 12,
    vulnerabilities: 12,
  },
} as const;

export type LimitsLockName = keyof typeof PERSISTENCE_LIMITS_LOCK;
