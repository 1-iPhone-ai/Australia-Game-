#!/usr/bin/env python3
"""Agent 25 tranche 6 push #31 — insert push31 mega6 (SECTION 20CC) + runtime wiring."""
from __future__ import annotations

import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
V94 = ROOT / "(V9.4) australia-game-with-ai.tsx"
GEN = ROOT / "scripts" / "tranche6-push31-generated.tsx"
ANCHOR = "// SECTION 21B:"
MARKER = "export function runV1021T6Mega6DepthTurn"
NET_TARGET = 150_000
NET_FLOOR = 130_000


def main() -> None:
    subprocess.run([sys.executable, str(ROOT / "scripts" / "generate-tranche6-push31-mega.py")], check=True)
    text = V94.read_text(encoding="utf-8")
    before = len(text.splitlines())
    helpers = """
function V1021_T6MEGA6_readPersistedFromGameState(gs: any): V1021T6Mega6Persisted | null {
  const raw = (gs?.save?.meta?.v1020 as any)?.t6_mega6_depth;
  return raw ? sanitizeV1021T6Mega6DepthPersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1021_T6MEGA6_applyToGameState(gs: any, out: V1021T6Mega6TurnResult): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1020 = { ...(meta.v1020 || {}) };
  v1020.t6_mega6_depth = out.persisted;
  meta.v1020 = v1020;
  save.meta = meta;
  return { ...gs, save, v1021T6Mega6Depth: out.state };
}
"""
    block = GEN.read_text(encoding="utf-8") + helpers

    if MARKER in text:
        print("skip insert (T6 mega6 depth already present)")
    else:
        idx = text.index(ANCHOR)
        banner = (
            "\n// ============================================================================\n"
            "// Agent 25 tranche 6 push #31 — V1021 T6 mega6 wave-7 lattice (generated)\n"
            "// ============================================================================\n"
        )
        text = text[:idx] + banner + block + "\n" + text[idx:]
        print("inserted tranche6 push31 generated block")

    lab = """  { id: 'v1021_t6_mega6_depth', label: 'V10.21 T6 mega6 wave-7 lattice (20CC / 20BA–20CB)', tier: 'full', section: 'System Regression', severity: 'MAJOR', run: () => runV1021T6Mega6DepthSelfTestsForLab() },
"""
    if "{ id: 'v1021_t6_mega6_depth'" not in text:
        for anchor_lab in (
            "  { id: 'v1032_telecom_resilience', label: 'V10.32 Telecom resilience (20CB failover & backbone buffers)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1032TresSelfTestsForLab() },",
            "{ id: 'v1032_telecom_resilience',",
        ):
            if anchor_lab in text:
                text = text.replace(anchor_lab, anchor_lab + "\n" + lab.strip(), 1)
                print("registered LAB v1021_t6_mega6_depth")
                break
        else:
            text = text.replace("  { id: 'v1014_fiscal',", lab + "  { id: 'v1014_fiscal',", 1)
            print("registered LAB v1021_t6_mega6_depth (fallback)")

    mig_anchor = "  if (migrated.gameState && typeof sanitizeV1032TresPersisted === 'function') {"
    mig_patch = (
        "  if (migrated.gameState && typeof sanitizeV1021T6Mega6DepthPersisted === 'function') {\n"
        "    const m6Raw = (migrated.gameState as any)?.save?.meta?.v1020?.t6_mega6_depth;\n"
        "    if (m6Raw) {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1020 = { ...(meta.v1020 || {}) };\n"
        "      v1020.t6_mega6_depth = sanitizeV1021T6Mega6DepthPersisted(m6Raw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1020 = v1020;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1020.t6_mega6_depth = sanitizeV1021T6Mega6DepthPersisted" not in text and mig_anchor in text:
        text = text.replace(mig_anchor, mig_patch + mig_anchor, 1)
        print("wired §6 v1020.t6_mega6_depth migration")

    if "t6Mega6DepthEnabled" not in text:
        if "t6Mega5DepthEnabled: true," in text:
            text = text.replace(
                "t6Mega5DepthEnabled: true,",
                "t6Mega5DepthEnabled: true,\n  t6Mega6DepthEnabled: true,",
                1,
            )
        elif "t6Mega4DepthEnabled: true," in text:
            text = text.replace(
                "t6Mega4DepthEnabled: true,",
                "t6Mega4DepthEnabled: true,\n  t6Mega6DepthEnabled: true,",
                1,
            )
        elif "t6Mega3DepthEnabled: true," in text:
            text = text.replace(
                "t6Mega3DepthEnabled: true,",
                "t6Mega3DepthEnabled: true,\n  t6Mega6DepthEnabled: true,",
                1,
            )

    tres_tail = """      if (typeof runV1032TresTurn === 'function') {
        try {
          const tresIn = buildV1032TresTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          tresIn.persisted = V1032_TRES_readPersistedFromGameState(mergedGameState);
          const tresOut = runV1032TresTurn(tresIn);
          mergedGameState = V1032_TRES_applyToGameState(mergedGameState, tresOut);
        } catch (_) { /* isolated */ }
      }"""
    day_hook = """
      if (typeof runV1021T6Mega6DepthTurn === 'function') {
        try {
          const m6In = buildV1021T6Mega6DepthTurnInputFromGameState(
            mergedGameState,
            passCtx.turnCounter,
            settings?.t6Mega6DepthEnabled !== false,
          );
          m6In.persisted = V1021_T6MEGA6_readPersistedFromGameState(mergedGameState);
          const m6Out = runV1021T6Mega6DepthTurn(m6In);
          mergedGameState = V1021_T6MEGA6_applyToGameState(mergedGameState, m6Out);
        } catch (_) { /* isolated */ }
      }
"""
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)
    in_day = day_slice[1][:72000] if len(day_slice) > 1 else ""
    if "runV1021T6Mega6DepthTurn(m6In)" not in in_day and tres_tail in text:
        text = text.replace(tres_tail, tres_tail + day_hook, 1)
        print("wired T6 mega6 day hook after telecom resilience")

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
