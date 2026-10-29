#!/usr/bin/env python3
"""Agent 25 tranche 6 push #1 — insert generated mega modules + runtime wiring."""
from __future__ import annotations

import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
V94 = ROOT / "(V9.4) australia-game-with-ai.tsx"
GEN = ROOT / "scripts" / "tranche6-generated.tsx"
ANCHOR = "// SECTION 21B:"


def main() -> None:
    text = V94.read_text(encoding="utf-8")
    before = len(text.splitlines())
    block = GEN.read_text(encoding="utf-8")
    if "V1015_ORCH_SCHEMA_VERSION" in text:
        print("skip insert (orchestrator already present)")
    else:
        idx = text.index(ANCHOR)
        banner = (
            "\n// ============================================================================\n"
            "// Agent 25 tranche 6 push #1 — V1015 orchestrator + V10.1 supply depth (generated)\n"
            "// ============================================================================\n"
        )
        text = text[:idx] + banner + block + "\n" + text[idx:]
        print("inserted tranche6 generated block")

    lab = """  { id: 'v1015_orchestrator', label: 'V1015 national tick orchestrator', tier: 'full', section: 'System Regression', severity: 'MAJOR', run: () => { const r = runV1015OrchestratorSelfTests(); return r.results.map(x => ({ id: x.id, name: x.name, passed: x.passed, detail: x.detail || (x.passed ? 'ok' : 'fail') })); } },
  { id: 'v1014_supply_chain', label: 'V10.1 supply chain depth', tier: 'full', section: 'System Regression', severity: 'MAJOR', run: () => { const r = runV1014SupplyChainSelfTests(); return r.results.map(x => ({ id: x.id, name: x.name, passed: x.passed, detail: x.detail || (x.passed ? 'ok' : 'fail') })); } },
"""
    if "v1015_orchestrator" not in text:
        text = text.replace("  { id: 'v1014_fiscal',", lab + "  { id: 'v1014_fiscal',", 1)

    if "publicFinanceOutcomesEnabled" not in text:
        text = text.replace(
            "  innovationEnabled: true,",
            "  innovationEnabled: true,\n  publicFinanceOutcomesEnabled: false,\n  v1015OrchestratorEnabled: true,",
            1,
        )

    hook = """
  // V1015 national orchestrator (post–§11A stages)
  state = (() => {
    try {
      const orch = runV1015OrchestratorNationalTick({
        turn: passCtx.turnCounter,
        day: passCtx.newDay,
        settings: settings || {},
        gameState: state,
      }, sanitizeV1015OrchestratorPersisted(state?.v1015Orchestrator));
      return { ...state, v1015Orchestrator: orch.persisted, v1014SupplyChain: state?.v1014SupplyChain };
    } catch (_) { return state; }
  })();
"""
    marker = "  agentState = agent02RecordStage(agentState, 'DIAGNOSTICS_COMMIT', ctx, passIndex, AGENT_02_PIPELINE_STAGE_ORDER.length, ['commit']);"
    if "runV1015OrchestratorNationalTick" not in text and marker in text:
        text = text.replace(marker, hook + "\n" + marker, 1)
        print("wired V1015 orchestrator into Agent02 day boundary")

    plan_hook = """
  // Agent 05 conditional content merge (Operation 600K)
  if (typeof mergeAgent05IntoContentPlan === 'function') {
    const merged = mergeAgent05IntoContentPlan(plan, ctx, (ctx as any).agent05Events, st, null);
    plan = merged.plan;
    (st as any).agent05Events = merged.agentState;
  }
"""
    plan_ret = "  plan.evaluation.ms = nowMs() - t0;\n  return plan;"
    if "mergeAgent05IntoContentPlan(plan, ctx" not in text and plan_ret in text:
        text = text.replace(plan_ret, plan_hook + "\n  " + plan_ret, 1)
        print("wired Agent05 into planContentDay")

    V94.write_text(text, encoding="utf-8")
    after = len(text.splitlines())
    print(f"lines {before} -> {after} (+{after - before})")


if __name__ == "__main__":
    main()
