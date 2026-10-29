import { compareSemVer } from "../save-compatibility/semver.js";

/**
 * Pure contract mirror of v95MigrateSaveForLoad gating and settings carry rules.
 * Does not execute the monolith — used for idempotency and profile-key tests.
 */
export function shouldRunGameVersionMigration(
  sourceGameVersion: string | undefined | null,
  targetGameVersion: string,
): boolean {
  const sourceVersion = String(sourceGameVersion || "0.0.0");
  return compareSemVer(sourceVersion, targetGameVersion) < 0;
}

export function filterCarriedGameSettings(
  migratedSettings: Record<string, unknown>,
  sourceSettings: Record<string, unknown> | undefined,
  matchScopedKeys: readonly string[],
): Record<string, unknown> {
  const carried = new Set([
    ...Object.keys(sourceSettings || {}),
    ...matchScopedKeys,
  ]);
  const settings: Record<string, unknown> = {};
  Object.entries(migratedSettings).forEach(([key, value]) => {
    if (carried.has(key)) settings[key] = value;
  });
  return settings;
}

/** Idempotency: second pass must not add keys beyond the first pass. */
export function assertSettingsCarryIdempotent(
  migratedSettings: Record<string, unknown>,
  sourceSettings: Record<string, unknown> | undefined,
  matchScopedKeys: readonly string[],
): boolean {
  const once = filterCarriedGameSettings(
    migratedSettings,
    sourceSettings,
    matchScopedKeys,
  );
  const twice = filterCarriedGameSettings(once, sourceSettings, matchScopedKeys);
  return JSON.stringify(once) === JSON.stringify(twice);
}

export function profilePreferenceNotInjected(
  filtered: Record<string, unknown>,
  profileOnlyKey: string,
  sourceSettings: Record<string, unknown> | undefined,
): boolean {
  if (sourceSettings && profileOnlyKey in sourceSettings) return true;
  return !(profileOnlyKey in filtered);
}
