#!/usr/bin/env python3
"""Agent 25 tranche 6 push #34 — insert push34 mega7 (SECTION 20CF) + runtime wiring."""
from __future__ import annotations

import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
V94 = ROOT / "(V9.4) australia-game-with-ai.tsx"
GEN = ROOT / "scripts" / "tranche6-push34-generated.tsx"
ANCHOR = "// SECTION 21B:"
MARKER = "export function runV1022T6Mega7DepthTurn"
NET_TARGET = 150_000
NET_FLOOR = 130_000


def main() -> None:
    subprocess.run([sys.executable, str(ROOT / "scripts" / "generate-tranche6-push34-mega.py")], check=True)
    text = V94.read_text(encoding="utf-8")
    before = len(text.splitlines())
    helpers = """
function V1022_T6MEGA7_readPersistedFromGameState(gs: any): V1022T6Mega7Persisted | null {
  const raw = (gs?.save?.meta?.v1022 as any)?.t6_mega7_depth;
  return raw ? sanitizeV1022T6Mega7DepthPersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1022_T6MEGA7_applyToGameState(gs: any, out: V1022T6Mega7TurnResult): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1022 = { ...(meta.v1022 || {}) };
  v1022.t6_mega7_depth = out.persisted;
  meta.v1022 = v1022;
  save.meta = meta;
  return { ...gs, save, v1022T6Mega7Depth: out.state };
}
"""
    block = GEN.read_text(encoding="utf-8") + helpers

    if MARKER in text:
        print("skip insert (T6 mega7 depth already present)")
    else:
        idx = text.index(ANCHOR)
        banner = (
            "\n// ============================================================================\n"
            "// Agent 25 tranche 6 push #34 — V1022 T6 mega7 wave-8 lattice (generated)\n"
            "// ============================================================================\n"
        )
        text = text[:idx] + banner + block + "\n" + text[idx:]
        print("inserted tranche6 push34 generated block")

    lab = """  { id: 'v1022_t6_mega7_depth', label: 'V10.22 T6 mega7 wave-8 lattice (20CF / 20BA–20CE)', tier: 'full', section: 'System Regression', severity: 'MAJOR', run: () => runV1022T6Mega7DepthSelfTestsForLab() },
"""
    if "{ id: 'v1022_t6_mega7_depth'" not in text:
        anchor_lab = (
            "  { id: 'v1034_critical_infrastructure_resilience', label: 'V10.34 Critical infrastructure resilience (20CE compromise & segment buffers)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1034CiresSelfTestsForLab() },"
        )
        if anchor_lab in text:
            text = text.replace(anchor_lab, anchor_lab + "\n" + lab.strip(), 1)
            print("registered LAB v1022_t6_mega7_depth")
        else:
            text = text.replace("  { id: 'v1014_fiscal',", lab + "  { id: 'v1014_fiscal',", 1)
            print("registered LAB v1022_t6_mega7_depth (fallback)")

    mig_anchor = "  if (migrated.gameState && typeof sanitizeV1034CiresPersisted === 'function') {"
    mig_patch = (
        "  if (migrated.gameState && typeof sanitizeV1022T6Mega7DepthPersisted === 'function') {\n"
        "    const m7Raw = (migrated.gameState as any)?.save?.meta?.v1022?.t6_mega7_depth;\n"
        "    if (m7Raw) {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1022 = { ...(meta.v1022 || {}) };\n"
        "      v1022.t6_mega7_depth = sanitizeV1022T6Mega7DepthPersisted(m7Raw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1022 = v1022;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1022.t6_mega7_depth = sanitizeV1022T6Mega7DepthPersisted" not in text and mig_anchor in text:
        text = text.replace(mig_anchor, mig_patch + mig_anchor, 1)
        print("wired §6 v1022.t6_mega7_depth migration")

    if "t6Mega7DepthEnabled" not in text:
        if "v1034CiresEnabled: true," in text:
            text = text.replace(
                "v1034CiresEnabled: true,",
                "v1034CiresEnabled: true,\n  t6Mega7DepthEnabled: true,",
                1,
            )
        elif "t6Mega6DepthEnabled: true," in text:
            text = text.replace(
                "t6Mega6DepthEnabled: true,",
                "t6Mega6DepthEnabled: true,\n  t6Mega7DepthEnabled: true,",
                1,
            )

    cires_tail = """      if (typeof runV1034CiresTurn === 'function') {
        try {
          const ciresIn = buildV1034CiresTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          ciresIn.persisted = V1034_CIRES_readPersistedFromGameState(mergedGameState);
          const ciresOut = runV1034CiresTurn(ciresIn);
          mergedGameState = V1034_CIRES_applyToGameState(mergedGameState, ciresOut);
        } catch (_) { /* isolated */ }
      }"""
    day_hook = """
      if (typeof runV1022T6Mega7DepthTurn === 'function') {
        try {
          const m7In = buildV1022T6Mega7DepthTurnInputFromGameState(
            mergedGameState,
            passCtx.turnCounter,
            settings?.t6Mega7DepthEnabled !== false,
          );
          m7In.persisted = V1022_T6MEGA7_readPersistedFromGameState(mergedGameState);
          const m7Out = runV1022T6Mega7DepthTurn(m7In);
          mergedGameState = V1022_T6MEGA7_applyToGameState(mergedGameState, m7Out);
        } catch (_) { /* isolated */ }
      }
"""
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)
    in_day = day_slice[1][:80000] if len(day_slice) > 1 else ""
    if "runV1022T6Mega7DepthTurn(m7In)" not in in_day and cires_tail in text:
        text = text.replace(cires_tail, cires_tail + day_hook, 1)
        print("wired T6 mega7 day hook after critical infrastructure resilience")

    V94.write_text(text, encoding="utf-8")
    after = len(text.splitlines())
    delta = after - before
    print(f"lines {before} -> {after} (+{delta})")
    if delta < NET_TARGET:
        print(f"WARNING: net delta {delta} below {NET_TARGET} target")
    if delta < NET_FLOOR:
        print(f"CRITICAL: net delta {delta} below {NET_FLOOR} floor")


if __name__ == "__main__":
    main()
