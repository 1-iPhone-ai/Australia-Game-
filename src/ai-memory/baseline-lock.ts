import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  AI_MEMORY_BASELINE_CONSTANTS,
  AI_MEMORY_BASELINE_FILE,
  AI_MEMORY_REQUIRED_EXPORTS,
  AI_MEMORY_SELF_TEST_EXPORTS,
} from "./constants.js";

export type ParsedMemoryConstants = Record<
  keyof typeof AI_MEMORY_BASELINE_CONSTANTS,
  string | number
>;

function parseNumericOrStringLiteral(raw: string): string | number {
  const t = raw.trim();
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  const str = t.match(/^'([^']*)'$|^"([^"]*)"$/);
  if (str) return str[1] ?? str[2] ?? t;
  return t;
}

/**
 * Extract normative constants from Section 1B without executing the monolith.
 */
export function parseMemoryConstantsFromBaseline(
  repoRoot: string,
  baselineFile = AI_MEMORY_BASELINE_FILE,
): ParsedMemoryConstants {
  const path = resolve(repoRoot, baselineFile);
  const text = readFileSync(path, "utf8");

  const pairs: Partial<ParsedMemoryConstants> = {};

  const capMatch = text.match(
    /export const AI_MEMORY_EVENT_CAP = (\d+);/,
  );
  if (capMatch) pairs.AI_MEMORY_EVENT_CAP = Number(capMatch[1]);

  const commCap = text.match(/const COMM_MESSAGE_CAP = (\d+);/);
  if (commCap) pairs.COMM_MESSAGE_CAP = Number(commCap[1]);

  const storageKey = text.match(
    /export const PERSISTENT_MEMORY_STORAGE_KEY = '([^']+)';/,
  );
  if (storageKey) pairs.PERSISTENT_MEMORY_STORAGE_KEY = storageKey[1];

  const policyKey = text.match(
    /export const PERSISTENCE_POLICY_STORAGE_KEY = '([^']+)';/,
  );
  if (policyKey) pairs.PERSISTENCE_POLICY_STORAGE_KEY = policyKey[1];

  const humanId = text.match(/export const HUMAN_PROFILE_ID = '([^']+)';/);
  if (humanId) pairs.HUMAN_PROFILE_ID = humanId[1];

  const storeVer = text.match(
    /function emptyPersistentStore\(\): PersistentStore \{ return \{ version: (\d+),/,
  );
  if (storeVer) pairs.PERSISTENT_STORE_VERSION = Number(storeVer[1]);

  const priorCap = text.match(
    /function profileToPriorSeed[\s\S]*?const cap = \(c: number\) => Math\.min\(([\d.]+), c\);/,
  );
  if (priorCap) pairs.PRIOR_CONFIDENCE_CAP = Number(priorCap[1]);

  const negMin = text.match(
    /computeNegotiationThresholdShift[\s\S]*?return \{ shift: Math\.max\((-?[\d.]+), Math\.min\(([\d.]+),/,
  );
  if (negMin) {
    pairs.NEGOTIATION_SHIFT_BOUNDS = `{min:${negMin[1]},max:${negMin[2]}}`;
  }

  const infl = text.match(
    /applyAiMemoryInfluence[\s\S]*?const strength = Math\.max\((\d+), Math\.min\((\d+),/,
  );
  if (infl) {
    pairs.INFLUENCE_STRENGTH_BOUNDS = `{min:${infl[1]},max:${infl[2]}}`;
  }

  return pairs as ParsedMemoryConstants;
}

export function diffMemoryConstantsAgainstBaseline(
  repoRoot: string,
): { ok: true } | { ok: false; mismatches: string[] } {
  let parsed: ParsedMemoryConstants;
  try {
    parsed = parseMemoryConstantsFromBaseline(repoRoot);
  } catch (e) {
    return {
      ok: false,
      mismatches: [e instanceof Error ? e.message : String(e)],
    };
  }
  const mismatches: string[] = [];
  for (const [key, expected] of Object.entries(AI_MEMORY_BASELINE_CONSTANTS)) {
    const actual = parsed[key as keyof ParsedMemoryConstants];
    const expectedStr =
      typeof expected === "object" && expected !== null
        ? JSON.stringify(expected).replace(/"/g, "")
        : String(expected);
    const actualStr =
      typeof actual === "object" && actual !== null
        ? String(actual)
        : String(actual ?? "missing");
    if (key === "NEGOTIATION_SHIFT_BOUNDS" || key === "INFLUENCE_STRENGTH_BOUNDS") {
      const expObj = expected as { min: number; max: number };
      const actMatch = actualStr.match(/min:([^,]+),max:([^}]+)/);
      if (!actMatch) {
        mismatches.push(`${key}: could not parse baseline bounds`);
        continue;
      }
      if (
        Number(actMatch[1]) !== expObj.min ||
        Number(actMatch[2]) !== expObj.max
      ) {
        mismatches.push(
          `${key}: expected min=${expObj.min} max=${expObj.max}, baseline has min=${actMatch[1]} max=${actMatch[2]}`,
        );
      }
      continue;
    }
    if (String(actual) !== String(expected)) {
      mismatches.push(
        `${key}: expected ${expectedStr}, baseline file has ${actualStr}`,
      );
    }
  }
  return mismatches.length === 0 ? { ok: true } : { ok: false, mismatches };
}

export function assertRequiredExportsInBaseline(
  repoRoot: string,
  baselineFile = AI_MEMORY_BASELINE_FILE,
): { ok: true } | { ok: false; missing: string[] } {
  const path = resolve(repoRoot, baselineFile);
  const text = readFileSync(path, "utf8");
  const missing = AI_MEMORY_REQUIRED_EXPORTS.filter((name) => {
    const fnRe = new RegExp(`export function ${name}(<|\\()`);
    if (fnRe.test(text)) return false;
    if (text.includes(`export const ${name}`)) return false;
    return true;
  });
  return missing.length === 0 ? { ok: true } : { ok: false, missing };
}

export function assertSelfTestExportsInBaseline(
  repoRoot: string,
  baselineFile = AI_MEMORY_BASELINE_FILE,
): { ok: true } | { ok: false; missing: string[] } {
  const path = resolve(repoRoot, baselineFile);
  const text = readFileSync(path, "utf8");
  const missing = AI_MEMORY_SELF_TEST_EXPORTS.filter(
    (name) => !new RegExp(`export function ${name}\\(`).test(text),
  );
  return missing.length === 0 ? { ok: true } : { ok: false, missing };
}
