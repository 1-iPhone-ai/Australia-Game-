/** Operation 111 · Agent 46 — Team Intelligence integration contract (static anchors). */
export const TEAM_INTELLIGENCE_BASELINE_FILE = "(V9.4) australia-game-with-ai.tsx";

/** Section 20D header in the monolith (Team Operating System). */
export const TEAM_OS_SECTION_MARKER =
  "SECTION 20D: TEAM INTELLIGENCE 2.0 — TEAM OPERATING SYSTEM";

/** Exported entry points Agent 111 and feature workers must preserve. */
export const TEAM_INTELLIGENCE_PUBLIC_EXPORTS = [
  "evaluateTeamOperatingSystem",
  "buildTeamOSView",
  "sanitizeTeamOperatingSystemState",
  "serializeTeamOperatingSystemState",
  "parseTeamCommandFromFrame",
  "summarizeTeamCommand",
  "teamOsGoalForActor",
  "runTeamIntelligence2SelfTests",
  "runTeamOsScenarioSelfTests",
] as const;

/** Persisted save path (see save-compatibility-spec §3). */
export const TEAM_OS_SAVE_KEYS = [
  "gameState.teamOperatingSystem",
  "teamOperatingSystem",
] as const;

/** Match settings keys wired in Settings Intelligence + Team Mission Board. */
export const TEAM_OS_SETTINGS_KEYS = [
  "teamIntelligenceOsEnabled",
  "teamOsAuthorityLevel",
  "teamOsEnemyEnabled",
  "teamOsFullInspectionEnabled",
] as const;
