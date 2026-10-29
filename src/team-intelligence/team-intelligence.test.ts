import { describe, expect, it } from "vitest";
import {
  runTeamIntelligence2SelfTests,
  runTeamOsScenarioSelfTests,
} from "../../(V9.4) australia-game-with-ai.tsx";
import { assertTeamIntelligenceBaselineStructure, readTeamIntelligenceBaselineSource } from "./baseline-lock.js";
import { TEAM_INTELLIGENCE_PUBLIC_EXPORTS } from "./constants.js";

describe("Team Intelligence baseline lock", () => {
  it("keeps Section 20D exports and settings keys in the canonical file", () => {
    const source = readTeamIntelligenceBaselineSource();
    const issues = assertTeamIntelligenceBaselineStructure(source);
    expect(issues, issues.join("; ")).toEqual([]);
  });

  it("documents every public export in the contract list", () => {
    expect(TEAM_INTELLIGENCE_PUBLIC_EXPORTS.length).toBeGreaterThanOrEqual(8);
  });
});

describe("Team Intelligence 2.0 deterministic suites", () => {
  it("passes runTeamIntelligence2SelfTests", () => {
    const failed = runTeamIntelligence2SelfTests().filter((r) => !r.passed);
    expect(failed.map((f) => `${f.id}: ${f.detail}`)).toEqual([]);
  });

  it("passes runTeamOsScenarioSelfTests", () => {
    const failed = runTeamOsScenarioSelfTests().filter((r) => !r.passed);
    expect(failed.map((f) => `${f.id}: ${f.detail}`)).toEqual([]);
  });
});
