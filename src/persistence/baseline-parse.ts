import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  PERSISTENCE_BASELINE_FILE,
  PERSISTENCE_LIMITS_LOCK,
  SAVE_ROUND_TRIP_TOP_LEVEL_KEYS,
  V10_PERSISTED_GAME_STATE_KEYS,
  type LimitsLockName,
} from "./constants.js";

export function readBaselineSource(repoRoot: string, file = PERSISTENCE_BASELINE_FILE): string {
  return readFileSync(resolve(repoRoot, file), "utf8");
}

/** Parse `export const NAME = { a: 1, b: 2 } as const` numeric entries. */
export function parseExportedLimitsObject(
  source: string,
  exportName: string,
): Record<string, number> {
  const blockRe = new RegExp(
    `export const ${exportName}\\s*=\\s*\\{([\\s\\S]*?)\\}\\s*as const`,
  );
  const match = source.match(blockRe);
  if (!match) {
    throw new Error(`${exportName} block not found in baseline`);
  }
  const body = match[1];
  const out: Record<string, number> = {};
  const pairRe = /(\w+)\s*:\s*(-?\d+(?:\.\d+)?)/g;
  let m: RegExpExecArray | null;
  while ((m = pairRe.exec(body)) !== null) {
    out[m[1]] = Number(m[2]);
  }
  return out;
}

export function diffLimitsAgainstLock(
  repoRoot: string,
): { ok: true } | { ok: false; mismatches: string[] } {
  let source: string;
  try {
    source = readBaselineSource(repoRoot);
  } catch (e) {
    return {
      ok: false,
      mismatches: [e instanceof Error ? e.message : String(e)],
    };
  }
  const mismatches: string[] = [];
  for (const exportName of Object.keys(PERSISTENCE_LIMITS_LOCK) as LimitsLockName[]) {
    let parsed: Record<string, number>;
    try {
      parsed = parseExportedLimitsObject(source, exportName);
    } catch (e) {
      mismatches.push(e instanceof Error ? e.message : String(e));
      continue;
    }
    const expected = PERSISTENCE_LIMITS_LOCK[exportName];
    for (const [key, value] of Object.entries(expected)) {
      if (parsed[key] !== value) {
        mismatches.push(
          `${exportName}.${key}: expected ${value}, baseline has ${parsed[key] ?? "missing"}`,
        );
      }
    }
  }
  return mismatches.length === 0 ? { ok: true } : { ok: false, mismatches };
}

/** Ensure sanitizer source references the canonical limits constant (not magic numbers). */
export function assertSanitizerUsesLimitsConstant(
  source: string,
  sanitizerName: string,
  limitsExport: LimitsLockName,
  sliceField: string,
): boolean {
  const fnStart = source.indexOf(`export function ${sanitizerName}`);
  if (fnStart < 0) return false;
  const fnEnd = source.indexOf("\nexport function ", fnStart + 1);
  const body = fnEnd > fnStart ? source.slice(fnStart, fnEnd) : source.slice(fnStart, fnStart + 8000);
  return body.includes(`.slice(-${limitsExport}.${sliceField})`);
}

export function assertV10KeysInValidateSaveCore(source: string): string[] {
  const marker = "const sanitizedGameState: GameStateSnapshot = {";
  const idx = source.indexOf(marker);
  if (idx < 0) return ["sanitizedGameState block not found"];
  const slice = source.slice(idx, idx + 12000);
  const missing: string[] = [];
  for (const key of V10_PERSISTED_GAME_STATE_KEYS) {
    if (!slice.includes(`${key}:`)) {
      missing.push(key);
    }
  }
  return missing;
}

export function assertBuildSaveDataRoundTripFields(source: string): string[] {
  const idx = source.indexOf("const buildSaveData = useCallback");
  if (idx < 0) return ["runtime buildSaveData useCallback not found"];
  const slice = source.slice(idx, idx + 6000);
  const missing: string[] = [];
  for (const key of SAVE_ROUND_TRIP_TOP_LEVEL_KEYS) {
    if (!slice.includes(`${key}:`)) {
      missing.push(key);
    }
  }
  return missing;
}
