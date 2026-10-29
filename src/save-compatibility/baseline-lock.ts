import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { BASELINE_VERSION_MATRIX, SAVE_COMPAT_BASELINE_FILE } from "./constants.js";

export type ParsedVersionConstants = Record<keyof typeof BASELINE_VERSION_MATRIX, string>;

/**
 * Extract VERSION_CONSTANTS from the monolith TSX without executing it.
 */
export function parseVersionConstantsFromBaseline(
  repoRoot: string,
  baselineFile = SAVE_COMPAT_BASELINE_FILE,
): ParsedVersionConstants {
  const path = resolve(repoRoot, baselineFile);
  const text = readFileSync(path, "utf8");
  const blockMatch = text.match(
    /export const VERSION_CONSTANTS = \{([\s\S]*?)\} as const;/,
  );
  if (!blockMatch) {
    throw new Error(`VERSION_CONSTANTS block not found in ${baselineFile}`);
  }
  const block = blockMatch[1];
  const pairs: Partial<ParsedVersionConstants> = {};
  const re = /(\w+):\s*"([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block)) !== null) {
    const key = m[1] as keyof typeof BASELINE_VERSION_MATRIX;
    if (key in BASELINE_VERSION_MATRIX) {
      pairs[key] = m[2];
    }
  }
  const replayIntMatch = text.match(/const REPLAY_SCHEMA_VERSION = (\d+);/);
  if (replayIntMatch) {
    pairs.REPLAY_SCHEMA_INT = replayIntMatch[1];
  }
  return pairs as ParsedVersionConstants;
}

export function diffVersionMatrixAgainstBaseline(
  repoRoot: string,
): { ok: true } | { ok: false; mismatches: string[] } {
  let parsed: ParsedVersionConstants;
  try {
    parsed = parseVersionConstantsFromBaseline(repoRoot);
  } catch (e) {
    return {
      ok: false,
      mismatches: [e instanceof Error ? e.message : String(e)],
    };
  }
  const mismatches: string[] = [];
  for (const [key, expected] of Object.entries(BASELINE_VERSION_MATRIX)) {
    const actual = parsed[key as keyof ParsedVersionConstants];
    const expectedStr = String(expected);
    if (actual !== expectedStr) {
      mismatches.push(`${key}: expected ${expectedStr}, baseline file has ${actual ?? "missing"}`);
    }
  }
  return mismatches.length === 0 ? { ok: true } : { ok: false, mismatches };
}
