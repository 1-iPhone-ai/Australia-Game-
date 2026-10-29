#!/usr/bin/env python3
"""Agent 25 tranche 6 push #11 — insert push11 mega (SECTION 20BI) + runtime wiring."""
from __future__ import annotations

import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
V94 = ROOT / "(V9.4) australia-game-with-ai.tsx"
GEN = ROOT / "scripts" / "tranche6-push11-generated.tsx"
ANCHOR = "// SECTION 21B:"
MARKER = "export function runV1017T6Mega2DepthTurn"


def main() -> None:
    subprocess.run([sys.executable, str(ROOT / "scripts" / "generate-tranche6-push11-mega.py")], check=True)
    text = V94.read_text(encoding="utf-8")
    before = len(text.splitlines())
    helpers = """
function V1017_T6MEGA2_readPersistedFromGameState(gs: any): V1017T6Mega2Persisted | null {
  const raw = (gs?.save?.meta?.v1017 as any)?.t6_mega2_depth;
  return raw ? sanitizeV1017T6Mega2DepthPersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1017_T6MEGA2_applyToGameState(gs: any, out: V1017T6Mega2TurnResult): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1017 = { ...(meta.v1017 || {}) };
  v1017.t6_mega2_depth = out.persisted;
  meta.v1017 = v1017;
  save.meta = meta;
  return { ...gs, save, v1017T6Mega2Depth: out.state };
}
"""
    block = GEN.read_text(encoding="utf-8") + helpers

    if MARKER in text:
        print("skip insert (T6 mega2 depth already present)")
    else:
        idx = text.index(ANCHOR)
        banner = (
            "\n// ============================================================================\n"
            "// Agent 25 tranche 6 push #11 — V1017 T6 mega2 full-stack lattice (generated)\n"
            "// ============================================================================\n"
        )
        text = text[:idx] + banner + block + "\n" + text[idx:]
        print("inserted tranche6 push11 generated block")

    lab = """  { id: 'v1017_t6_mega2_depth', label: 'V10.17 T6 mega2 full-stack lattice (20BI / 20BA–20BH)', tier: 'full', section: 'System Regression', severity: 'MAJOR', run: () => runV1017T6Mega2DepthSelfTestsForLab() },
"""
    if "{ id: 'v1017_t6_mega2_depth'" not in text:
        anchor_lab = "  { id: 'v1016_national_resilience',"
        if anchor_lab in text:
            text = text.replace(anchor_lab, lab + anchor_lab, 1)
        else:
            text = text.replace("  { id: 'v1014_fiscal',", lab + "  { id: 'v1014_fiscal',", 1)
        print("registered LAB v1017_t6_mega2_depth")

    mig_anchor = "  if (migrated.gameState && typeof sanitizeV1016NresPersisted === 'function') {"
    mig_patch = (
        "  if (migrated.gameState && typeof sanitizeV1017T6Mega2DepthPersisted === 'function') {\n"
        "    const m2Raw = (migrated.gameState as any)?.save?.meta?.v1017?.t6_mega2_depth;\n"
        "    if (m2Raw) {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1017 = { ...(meta.v1017 || {}) };\n"
        "      v1017.t6_mega2_depth = sanitizeV1017T6Mega2DepthPersisted(m2Raw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1017 = v1017;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1017.t6_mega2_depth = sanitizeV1017T6Mega2DepthPersisted" not in text and mig_anchor in text:
        text = text.replace(mig_anchor, mig_patch + mig_anchor, 1)
        print("wired §6 v1017.t6_mega2_depth migration")

    if "t6Mega2DepthEnabled" not in text:
        if "t6MegaDepthEnabled: true," in text:
            text = text.replace(
                "t6MegaDepthEnabled: true,",
                "t6MegaDepthEnabled: true,\n  t6Mega2DepthEnabled: true,",
                1,
            )
        elif "v1015OrchestratorEnabled: true," in text:
            text = text.replace(
                "v1015OrchestratorEnabled: true,",
                "v1015OrchestratorEnabled: true,\n  t6Mega2DepthEnabled: true,",
                1,
            )

    nres_tail = """      if (typeof runV1016NresTurn === 'function') {
        try {
          const nresIn = buildV1016NresTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          nresIn.persisted = V1016_NRES_readPersistedFromGameState(mergedGameState);
          const nresOut = runV1016NresTurn(nresIn);
          mergedGameState = V1016_NRES_applyToGameState(mergedGameState, nresOut);
        } catch (_) { /* isolated */ }
      }"""
    day_hook = """
      if (typeof runV1017T6Mega2DepthTurn === 'function') {
        try {
          const m2In = buildV1017T6Mega2DepthTurnInputFromGameState(
            mergedGameState,
            passCtx.turnCounter,
            settings?.t6Mega2DepthEnabled !== false,
          );
          m2In.persisted = V1017_T6MEGA2_readPersistedFromGameState(mergedGameState);
          const m2Out = runV1017T6Mega2DepthTurn(m2In);
          mergedGameState = V1017_T6MEGA2_applyToGameState(mergedGameState, m2Out);
        } catch (_) { /* isolated */ }
      }
"""
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)
    in_day = day_slice[1][:28000] if len(day_slice) > 1 else ""
    if "runV1017T6Mega2DepthTurn(m2In)" not in in_day and nres_tail in text:
        text = text.replace(nres_tail, nres_tail + day_hook, 1)
        print("wired T6 mega2 day hook after national resilience")

    V94.write_text(text, encoding="utf-8")
    after = len(text.splitlines())
    delta = after - before
    print(f"lines {before} -> {after} (+{delta})")
    if delta < 75000:
        print(f"WARNING: net delta {delta} below 75000 target")


if __name__ == "__main__":
    main()
