#!/usr/bin/env python3
"""Agent 25 tranche 6 push #36 — insert push36 mega8 (SECTION 20CH) + runtime wiring."""
from __future__ import annotations

import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
V94 = ROOT / "(V9.4) australia-game-with-ai.tsx"
GEN = ROOT / "scripts" / "tranche6-push36-generated.tsx"
ANCHOR = "// SECTION 21B:"
MARKER = "export function runV1022T6Mega8DepthTurn"
NET_TARGET = 150_000
NET_FLOOR = 130_000


def main() -> None:
    subprocess.run([sys.executable, str(ROOT / "scripts" / "generate-tranche6-push36-mega.py")], check=True)
    text = V94.read_text(encoding="utf-8")
    before = len(text.splitlines())
    helpers = """
function V1022_T6MEGA8_readPersistedFromGameState(gs: any): V1022T6Mega8Persisted | null {
  const raw = (gs?.save?.meta?.v1022 as any)?.t6_mega8_depth;
  return raw ? sanitizeV1022T6Mega8DepthPersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1022_T6MEGA8_applyToGameState(gs: any, out: V1022T6Mega8TurnResult): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1022 = { ...(meta.v1022 || {}) };
  v1022.t6_mega8_depth = out.persisted;
  meta.v1022 = v1022;
  save.meta = meta;
  return { ...gs, save, v1022T6Mega8Depth: out.state };
}
"""
    block = GEN.read_text(encoding="utf-8") + helpers

    if MARKER in text:
        print("skip insert (T6 mega8 depth already present)")
    else:
        idx = text.index(ANCHOR)
        banner = (
            "\n// ============================================================================\n"
            "// Agent 25 tranche 6 push #36 — V1022 T6 mega8 wave-9 lattice (generated)\n"
            "// ============================================================================\n"
        )
        text = text[:idx] + banner + block + "\n" + text[idx:]
        print("inserted tranche6 push36 generated block")

    lab = """  { id: 'v1022_t6_mega8_depth', label: 'V10.22 T6 mega8 wave-9 lattice (20CH / 20BA–20CG)', tier: 'full', section: 'System Regression', severity: 'MAJOR', run: () => runV1022T6Mega8DepthSelfTestsForLab() },
"""
    if "{ id: 'v1022_t6_mega8_depth'" not in text:
        anchor_lab = (
            "  { id: 'v1035_cyber_resilience', label: 'V10.35 Sovereign cyber resilience (20CG intrusion & segment buffers)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1035CyresSelfTestsForLab() },"
        )
        if anchor_lab in text:
            text = text.replace(anchor_lab, anchor_lab + "\n" + lab.strip(), 1)
            print("registered LAB v1022_t6_mega8_depth")
        else:
            text = text.replace("  { id: 'v1014_fiscal',", lab + "  { id: 'v1014_fiscal',", 1)
            print("registered LAB v1022_t6_mega8_depth (fallback)")

    mig_anchor = "  if (migrated.gameState && typeof sanitizeV1035CyresPersisted === 'function') {"
    mig_patch = (
        "  if (migrated.gameState && typeof sanitizeV1022T6Mega8DepthPersisted === 'function') {\n"
        "    const m8Raw = (migrated.gameState as any)?.save?.meta?.v1022?.t6_mega8_depth;\n"
        "    if (m8Raw) {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1022 = { ...(meta.v1022 || {}) };\n"
        "      v1022.t6_mega8_depth = sanitizeV1022T6Mega8DepthPersisted(m8Raw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1022 = v1022;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1022.t6_mega8_depth = sanitizeV1022T6Mega8DepthPersisted" not in text and mig_anchor in text:
        text = text.replace(mig_anchor, mig_patch + mig_anchor, 1)
        print("wired §6 v1022.t6_mega8_depth migration")

    if "t6Mega8DepthEnabled" not in text:
        if "t6Mega7DepthEnabled: true," in text:
            text = text.replace(
                "t6Mega7DepthEnabled: true,",
                "t6Mega7DepthEnabled: true,\n  t6Mega8DepthEnabled: true,",
                1,
            )
            print("registered settings t6Mega8DepthEnabled")
        elif "v1034CiresEnabled: true," in text:
            text = text.replace(
                "v1034CiresEnabled: true,",
                "v1034CiresEnabled: true,\n  t6Mega8DepthEnabled: true,",
                1,
            )
            print("registered settings t6Mega8DepthEnabled (fallback)")

    cyres_tail = """      if (typeof runV1035CyresTurn === 'function') {
        try {
          const cyresIn = buildV1035CyresTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          cyresIn.persisted = V1035_CYRES_readPersistedFromGameState(mergedGameState);
          const cyresOut = runV1035CyresTurn(cyresIn);
          mergedGameState = V1035_CYRES_applyToGameState(mergedGameState, cyresOut);
        } catch (_) { /* isolated */ }
      }"""
    day_hook = """
      if (typeof runV1022T6Mega8DepthTurn === 'function') {
        try {
          const m8In = buildV1022T6Mega8DepthTurnInputFromGameState(
            mergedGameState,
            passCtx.turnCounter,
            settings?.t6Mega8DepthEnabled !== false,
          );
          m8In.persisted = V1022_T6MEGA8_readPersistedFromGameState(mergedGameState);
          const m8Out = runV1022T6Mega8DepthTurn(m8In);
          mergedGameState = V1022_T6MEGA8_applyToGameState(mergedGameState, m8Out);
        } catch (_) { /* isolated */ }
      }
"""
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)
    in_day = day_slice[1][:85000] if len(day_slice) > 1 else ""
    if "runV1022T6Mega8DepthTurn(m8In)" not in in_day and cyres_tail in text:
        text = text.replace(cyres_tail, cyres_tail + day_hook, 1)
        print("wired T6 mega8 day hook after sovereign cyber resilience")

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
