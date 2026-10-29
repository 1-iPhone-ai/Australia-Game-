import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertBuildSaveDataRoundTripFields,
  assertSanitizerUsesLimitsConstant,
  assertV10KeysInValidateSaveCore,
  diffLimitsAgainstLock,
  readBaselineSource,
} from "./baseline-parse.js";
import { PERSISTENCE_LIMITS_LOCK } from "./constants.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

describe("persistence limits lock (Agent 84)", () => {
  it("matches NATIONAL_LIMITS and V1013_LIMITS in canonical TSX", () => {
    expect(diffLimitsAgainstLock(repoRoot)).toEqual({ ok: true });
  });

  it("keeps V1013 history alias fields aligned", () => {
    const { maxHistory, history, maxTransitions, transitions } =
      PERSISTENCE_LIMITS_LOCK.V1013_LIMITS;
    expect(maxHistory).toBe(history);
    expect(maxTransitions).toBe(transitions);
  });

  it("sanitizers slice history using exported limit constants", () => {
    const source = readBaselineSource(repoRoot);
    expect(
      assertSanitizerUsesLimitsConstant(
        source,
        "sanitizeNationalSystemsPersisted",
        "NATIONAL_LIMITS",
        "history",
      ),
    ).toBe(true);
    expect(
      assertSanitizerUsesLimitsConstant(
        source,
        "sanitizeHouseholdEconomyPersisted",
        "V1013_LIMITS",
        "maxHistory",
      ),
    ).toBe(true);
  });
});

describe("V10 persisted blob wiring", () => {
  it("validateSaveDataCore sanitizes every V10 gameState key", () => {
    const source = readBaselineSource(repoRoot);
    expect(assertV10KeysInValidateSaveCore(source)).toEqual([]);
  });

  it("runtime buildSaveData writes RNG registry and deterministic counters", () => {
    const source = readBaselineSource(repoRoot);
    expect(assertBuildSaveDataRoundTripFields(source)).toEqual([]);
  });

  it("documents safe load entrypoint in baseline", () => {
    const source = readBaselineSource(repoRoot);
    expect(source.includes("export function prepareSaveLoadTransaction")).toBe(true);
    expect(source.includes("export function v95MigrateSaveForLoad")).toBe(true);
  });
});
