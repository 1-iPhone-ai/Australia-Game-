import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  BASELINE_VERSION_MATRIX,
  SAVE_LOAD_PIPELINE_STAGES,
  SAVE_REQUIRED_TOP_LEVEL_KEYS,
  requiresSaveSchemaBump,
} from "./constants.js";
import {
  assertV94FeelScope,
  decideChangeClass,
} from "./change-class.js";
import { diffVersionMatrixAgainstBaseline } from "./baseline-lock.js";
import {
  assertPipelineStageOrder,
  precheckSaveLoad,
  resolveSourceGameVersion,
  resolveSourceSchema,
  structuralSaveGuard,
} from "./pipeline.js";
import {
  compareSemVer,
  isFutureGameVersion,
  needsGameVersionMigration,
} from "./semver.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

describe("semver", () => {
  it("orders V9.x game versions", () => {
    expect(compareSemVer("9.0.0", "9.5.0")).toBeLessThan(0);
    expect(compareSemVer("9.5.0", "9.5.0")).toBe(0);
    expect(compareSemVer("10.0.0", "9.5.0")).toBeGreaterThan(0);
  });

  it("strips leading v", () => {
    expect(compareSemVer("v9.4.0", "9.4.0")).toBe(0);
  });

  it("detects future and migration-needed versions", () => {
    expect(isFutureGameVersion("9.6.0", BASELINE_VERSION_MATRIX.GAME_VERSION)).toBe(true);
    expect(isFutureGameVersion("9.5.0", BASELINE_VERSION_MATRIX.GAME_VERSION)).toBe(false);
    expect(needsGameVersionMigration("9.0.0", BASELINE_VERSION_MATRIX.GAME_VERSION)).toBe(true);
    expect(needsGameVersionMigration("unknown", BASELINE_VERSION_MATRIX.GAME_VERSION)).toBe(false);
  });
});

describe("save load pipeline contract", () => {
  it("fixes stage order", () => {
    expect(assertPipelineStageOrder(SAVE_LOAD_PIPELINE_STAGES)).toBe(true);
    expect(assertPipelineStageOrder(["parse", "structural_guard"])).toBe(false);
  });

  it("validates minimal fixture structure", () => {
    const fixturePath = resolve(
      dirname(fileURLToPath(import.meta.url)),
      "fixtures/minimal-v71-save.json",
    );
    const raw = JSON.parse(readFileSync(fixturePath, "utf8")) as Record<string, unknown>;
    expect(structuralSaveGuard(raw)).toEqual({ ok: true });
    expect(resolveSourceGameVersion(raw)).toBe("9.0.0");
    expect(resolveSourceSchema(raw)).toBe("7.1");
    const pre = precheckSaveLoad(raw);
    expect(pre.targetSaveSchema).toBe("7.1");
    expect(pre.futureVersionWarning).toBe(false);
    expect(needsGameVersionMigration(pre.sourceGameVersion, pre.targetGameVersion)).toBe(true);
  });

  it("requires all top-level keys", () => {
    for (const key of SAVE_REQUIRED_TOP_LEVEL_KEYS) {
      const partial: Record<string, unknown> = {
        metadata: { timestamp: 1, gameVersion: "9.5.0" },
        player: {},
        aiPlayer: {},
        gameState: {},
        gameSettings: {},
        notifications: [],
      };
      delete partial[key];
      expect(structuralSaveGuard(partial).ok).toBe(false);
    }
  });
});

describe("change classification", () => {
  it("only P6 requires schema bump", () => {
    expect(requiresSaveSchemaBump("P6_breaking_structure")).toBe(true);
    expect(requiresSaveSchemaBump("P2_additive_default")).toBe(false);
  });

  it("V9.4 feel is presentation-only", () => {
    expect(assertV94FeelScope("P0_presentation")).toBe(true);
    expect(assertV94FeelScope("P1_additive_optional")).toBe(false);
  });

  it("documents integration notes for P6", () => {
    const d = decideChangeClass("P6_breaking_structure");
    expect(d.saveSchemaBumpRequired).toBe(true);
    expect(d.integrationNotes.some((n) => n.includes("SAVE_SCHEMA_VERSION"))).toBe(true);
  });
});

describe("baseline version lock", () => {
  it("matches VERSION_CONSTANTS in canonical TSX", () => {
    const result = diffVersionMatrixAgainstBaseline(repoRoot);
    expect(result).toEqual({ ok: true });
  });
});
