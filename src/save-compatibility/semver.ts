/**
 * SemVer comparison aligned with baseline compareSemVer.
 */
export function compareSemVer(
  v1: string | undefined | null,
  v2: string | undefined | null,
): number {
  const clean = (v: string | undefined | null) => (v || "0").replace(/^v/i, "").trim();
  const parts1 = clean(v1)
    .split(".")
    .map((n) => parseInt(n, 10) || 0);
  const parts2 = clean(v2)
    .split(".")
    .map((n) => parseInt(n, 10) || 0);
  const maxLen = Math.max(parts1.length, parts2.length, 3);
  for (let i = 0; i < maxLen; i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    if (num1 < num2) return -1;
    if (num1 > num2) return 1;
  }
  return 0;
}

export function isFutureGameVersion(
  sourceGameVersion: string | undefined | null,
  targetGameVersion: string,
): boolean {
  if (!sourceGameVersion || sourceGameVersion === "unknown") return false;
  return compareSemVer(sourceGameVersion, targetGameVersion) > 0;
}

export function needsGameVersionMigration(
  sourceGameVersion: string | undefined | null,
  targetGameVersion: string,
): boolean {
  if (!sourceGameVersion || sourceGameVersion === "unknown") return false;
  return compareSemVer(sourceGameVersion, targetGameVersion) < 0;
}
