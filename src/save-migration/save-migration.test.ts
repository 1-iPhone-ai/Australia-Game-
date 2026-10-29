import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { BASELINE_VERSION_MATRIX } from "../save-compatibility/constants.js";
import { needsGameVersionMigration } from "../save-compatibility/semver.js";
import {
  assertBaselineMigrationExports,
  assertMigrationGraphDocumented,
  assertReducerUsesV71Expansion,
  assertReplayChainWired,
  parseMatchScopedSettingKeys,
} from "./baseline-migration-lock.js";
import {
  REPLAY_MIGRATION_CHAIN,
  SAVE_MIGRATION_GRAPH,
} from "./constants.js";
import {
  assertSettingsCarryIdempotent,
  filterCarriedGameSettings,
  profilePreferenceNotInjected,
  shouldRunGameVersionMigration,
} from "./migration-gate.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const fixtureDir = dirname(fileURLToPath(import.meta.url));

function loadFixture(name: string): Record<string, unknown> {
  return JSON.parse(
    readFileSync(resolve(fixtureDir, "fixtures", name), "utf8"),
  ) as Record<string, unknown>;
}

describe("save migration graph", () => {
  it("lists v71 expansion before game-version gate", () => {
    expect(SAVE_MIGRATION_GRAPH[0].migrator).toBe("migrateSaveToV71Expansion");
    expect(SAVE_MIGRATION_GRAPH[1].migrator).toBe("v95MigrateSaveForLoad");
    expect(SAVE_MIGRATION_GRAPH[1].pipelineStage).toBe("migrate_for_load");
  });

  it("keeps replay chain separate through schema 4", () => {
    expect(REPLAY_MIGRATION_CHAIN.at(-1)?.to).toBe(
      BASELINE_VERSION_MATRIX.REPLAY_SCHEMA_INT,
    );
  });
});

describe("baseline migration lock", () => {
  it("exports required migrators in canonical TSX", () => {
    expect(assertBaselineMigrationExports(repoRoot)).toEqual({ ok: true });
  });

  it("wires MIGRATE_SAVE_DATA to v71 expansion", () => {
    expect(assertReducerUsesV71Expansion(repoRoot)).toEqual({ ok: true });
  });

  it("documents inner and outer migrators", () => {
    expect(assertMigrationGraphDocumented(repoRoot)).toEqual({ ok: true });
  });

  it("wires replay schema chain functions", () => {
    expect(assertReplayChainWired(repoRoot)).toEqual({ ok: true });
  });

  it("parses match-scoped setting keys from baseline", () => {
    const keys = parseMatchScopedSettingKeys(repoRoot);
    expect(keys.length).toBeGreaterThan(5);
    expect(keys).toContain("nationalSystemsEnabled");
  });
});

describe("game-version migration gate (pure contract)", () => {
  it("flags legacy fixture for migration", () => {
    const legacy = loadFixture("legacy-7.0-gameversion.json");
    const meta = legacy.metadata as { gameVersion: string };
    expect(
      needsGameVersionMigration(
        meta.gameVersion,
        BASELINE_VERSION_MATRIX.GAME_VERSION,
      ),
    ).toBe(true);
    expect(
      shouldRunGameVersionMigration(
        meta.gameVersion,
        BASELINE_VERSION_MATRIX.GAME_VERSION,
      ),
    ).toBe(true);
  });

  it("does not migrate current gameVersion", () => {
    expect(
      shouldRunGameVersionMigration(
        BASELINE_VERSION_MATRIX.GAME_VERSION,
        BASELINE_VERSION_MATRIX.GAME_VERSION,
      ),
    ).toBe(false);
  });

  it("carries only source keys plus match-scoped defaults", () => {
    const keys = parseMatchScopedSettingKeys(repoRoot);
    const legacy = loadFixture("legacy-7.0-gameversion.json");
    const sourceSettings = legacy.gameSettings as Record<string, unknown>;
    const migratedSettings = {
      ...sourceSettings,
      careerProgressionEnabled: false,
      theme: "dark",
      nationalSystemsEnabled: true,
    };
    const filtered = filterCarriedGameSettings(
      migratedSettings,
      sourceSettings,
      keys,
    );
    expect(filtered.randomnessMode).toBe("deterministic");
    expect(filtered.reduceMotion).toBe(true);
    expect(filtered.nationalSystemsEnabled).toBe(true);
    expect(filtered.theme).toBeUndefined();
    expect(
      profilePreferenceNotInjected(filtered, "theme", sourceSettings),
    ).toBe(true);
  });

  it("is idempotent on settings carry", () => {
    const keys = parseMatchScopedSettingKeys(repoRoot);
    const legacy = loadFixture("legacy-7.0-gameversion.json");
    const sourceSettings = legacy.gameSettings as Record<string, unknown>;
    const migratedSettings = {
      ...sourceSettings,
      nationalSystemsEnabled: true,
      newUiFlag: true,
    };
    expect(
      assertSettingsCarryIdempotent(migratedSettings, sourceSettings, keys),
    ).toBe(true);
  });
});

describe("fixture tiers", () => {
  it("shares save schema 7.1 on v9.0 minimal tier", () => {
    const minimalPath = resolve(
      repoRoot,
      "src/save-compatibility/fixtures/minimal-v71-save.json",
    );
    const raw = JSON.parse(readFileSync(minimalPath, "utf8")) as {
      metadata: { gameVersion: string; schemaVersion: string };
    };
    expect(raw.metadata.schemaVersion).toBe("7.1");
    expect(
      needsGameVersionMigration(
        raw.metadata.gameVersion,
        BASELINE_VERSION_MATRIX.GAME_VERSION,
      ),
    ).toBe(true);
  });
});
