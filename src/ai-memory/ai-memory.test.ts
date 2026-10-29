import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertRequiredExportsInBaseline,
  assertSelfTestExportsInBaseline,
  diffMemoryConstantsAgainstBaseline,
} from "./baseline-lock.js";
import { AI_MEMORY_INVARIANTS } from "./invariants.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

describe("AI memory baseline lock", () => {
  it("matches normative constants in the V9.4 monolith", () => {
    const diff = diffMemoryConstantsAgainstBaseline(repoRoot);
    expect(diff).toEqual({ ok: true });
  });

  it("exports the integration API surface", () => {
    const api = assertRequiredExportsInBaseline(repoRoot);
    expect(api).toEqual({ ok: true });
  });

  it("exports built-in self-test harnesses", () => {
    const tests = assertSelfTestExportsInBaseline(repoRoot);
    expect(tests).toEqual({ ok: true });
  });
});

describe("AI memory invariants (documented contract)", () => {
  it("lists non-negotiable rules for fleet workers", () => {
    expect(AI_MEMORY_INVARIANTS.influenceNeverVetoes).toBe(true);
    expect(AI_MEMORY_INVARIANTS.persistenceRequiresConsent).toBe(true);
    expect(AI_MEMORY_INVARIANTS.priorConfidenceCap).toBe(0.5);
  });
});

describe("AI memory built-in self tests (monolith Section 1B)", () => {
  it("runs phase 1–3 match memory tests", async () => {
    const mod = await import("../../(V9.4) australia-game-with-ai.tsx");
    for (const name of [
      "runAiMemoryPhase1SelfTests",
      "runAiMemoryPhase2SelfTests",
      "runAiMemoryPhase3SelfTests",
    ] as const) {
      const run = mod[name] as () => {
        results: Array<{ id: string; passed: boolean; detail?: string }>;
      };
      const { results } = run();
      const failed = results.filter((r) => !r.passed);
      expect(failed, `${name}: ${JSON.stringify(failed)}`).toHaveLength(0);
    }
  });

  it("runs phase 4–6 persistent memory tests", async () => {
    const mod = await import("../../(V9.4) australia-game-with-ai.tsx");
    for (const name of [
      "runAiMemoryPhase4SelfTests",
      "runAiMemoryPhase6SelfTests",
      "runAiMemoryPhase61SelfTests",
    ] as const) {
      const run = mod[name] as () => {
        results: Array<{ id: string; passed: boolean; detail?: string }>;
      };
      const { results } = run();
      const failed = results.filter((r) => !r.passed);
      expect(failed, `${name}: ${JSON.stringify(failed)}`).toHaveLength(0);
    }
  });

  it("runs phase 5 communication/plan memory-adjacent tests", async () => {
    const mod = await import("../../(V9.4) australia-game-with-ai.tsx");
    const { results } = mod.runAiMemoryPhase5SelfTests();
    const failed = results.filter((r) => !r.passed);
    expect(failed, JSON.stringify(failed)).toHaveLength(0);
  });
});
