import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  V95_EXISTING_SUITES,
  runReliabilityUpgradeSelfTests,
  runReplayStudioSelfTests,
  v95WithIsolatedGlobals,
} from "../../(V9.4) australia-game-with-ai.tsx";

const repoRoot = resolve(import.meta.dirname, "../..");
const gameSource = readFileSync(
  resolve(repoRoot, "(V9.4) australia-game-with-ai.tsx"),
  "utf8",
);

describe("V9.4 unit harness registry", () => {
  it("lists quick-tier suites with unique ids", () => {
    const ids = V95_EXISTING_SUITES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    const quick = V95_EXISTING_SUITES.filter((s) => s.tier === "quick");
    expect(quick.length).toBeGreaterThan(10);
    for (const s of quick) {
      expect(s.label.length).toBeGreaterThan(0);
      expect(typeof s.run).toBe("function");
    }
  });

  it("includes critical quick suites used in CI smoke", () => {
    const ids = new Set(V95_EXISTING_SUITES.map((s) => s.id));
    for (const required of ["reliability", "replay", "memory", "v94"]) {
      expect(ids.has(required)).toBe(true);
    }
  });

  it("exports reliability self-tests in Section 21B", () => {
    expect(gameSource).toContain("export function runReliabilityUpgradeSelfTests");
  });
});

describe("V9.4 isolated smoke (pure exports)", () => {
  it("runReliabilityUpgradeSelfTests passes", () => {
    const results = v95WithIsolatedGlobals(() => runReliabilityUpgradeSelfTests());
    const failed = results.filter((r) => !r.passed);
    expect(failed, failed.map((f) => `${f.id}: ${f.detail}`).join("; ")).toEqual([]);
  });

  it("runReplayStudioSelfTests passes", () => {
    const raw = v95WithIsolatedGlobals(() => runReplayStudioSelfTests());
    expect(raw.success).toBe(true);
    const failed = (raw.results || []).filter((r) => !r.passed);
    expect(failed).toEqual([]);
  });
});
