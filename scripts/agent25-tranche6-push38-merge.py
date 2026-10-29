#!/usr/bin/env python3
"""Agent 25 tranche 6 push #38 — insert push38 mega9 (SECTION 20CJ) + runtime wiring."""
from __future__ import annotations

import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
V94 = ROOT / "(V9.4) australia-game-with-ai.tsx"
GEN = ROOT / "scripts" / "tranche6-push38-generated.tsx"
ANCHOR = "// SECTION 21B:"
MARKER = "export function runV1022T6Mega9DepthTurn"
NET_TARGET = 150_000
NET_FLOOR = 130_000


def main() -> None:
    subprocess.run([sys.executable, str(ROOT / "scripts" / "generate-tranche6-push38-mega.py")], check=True)
    text = V94.read_text(encoding="utf-8")
    before = len(text.splitlines())
    helpers = """
function V1022_T6MEGA9_readPersistedFromGameState(gs: any): V1022T6Mega9Persisted | null {
  const raw = (gs?.save?.meta?.v1022 as any)?.t6_mega9_depth;
  return raw ? sanitizeV1022T6Mega9DepthPersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1022_T6MEGA9_applyToGameState(gs: any, out: V1022T6Mega9TurnResult): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1022 = { ...(meta.v1022 || {}) };
  v1022.t6_mega9_depth = out.persisted;
  meta.v1022 = v1022;
  save.meta = meta;
  return { ...gs, save, v1022T6Mega9Depth: out.state };
}
"""
    block = GEN.read_text(encoding="utf-8") + helpers

    if MARKER in text:
        print("skip insert (T6 mega9 depth already present)")
    else:
        idx = text.index(ANCHOR)
        banner = (
            "\n// ============================================================================\n"
            "// Agent 25 tranche 6 push #38 — V1022 T6 mega9 wave-10 lattice (generated)\n"
            "// ============================================================================\n"
        )
        text = text[:idx] + banner + block + "\n" + text[idx:]
        print("inserted tranche6 push38 generated block")

    lab = """  { id: 'v1022_t6_mega9_depth', label: 'V10.22 T6 mega9 wave-10 lattice (20CJ / 20BA–20CI)', tier: 'full', section: 'System Regression', severity: 'MAJOR', run: () => runV1022T6Mega9DepthSelfTestsForLab() },
"""
    if "{ id: 'v1022_t6_mega9_depth'" not in text:
        anchor_lab = (
            "  { id: 'v1036_information_integrity_resilience', label: 'V10.36 Information integrity resilience (20CI attestation & mesh buffers)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1036IiresSelfTestsForLab() },"
        )
        if anchor_lab in text:
            text = text.replace(anchor_lab, anchor_lab + "\n" + lab.strip(), 1)
            print("registered LAB v1022_t6_mega9_depth")
        else:
            text = text.replace("  { id: 'v1014_fiscal',", lab + "  { id: 'v1014_fiscal',", 1)
            print("registered LAB v1022_t6_mega9_depth (fallback)")

    mig_anchor = "  if (migrated.gameState && typeof sanitizeV1036IiresPersisted === 'function') {"
    mig_patch = (
        "  if (migrated.gameState && typeof sanitizeV1022T6Mega9DepthPersisted === 'function') {\n"
        "    const m9Raw = (migrated.gameState as any)?.save?.meta?.v1022?.t6_mega9_depth;\n"
        "    if (m9Raw) {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1022 = { ...(meta.v1022 || {}) };\n"
        "      v1022.t6_mega9_depth = sanitizeV1022T6Mega9DepthPersisted(m9Raw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1022 = v1022;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1022.t6_mega9_depth = sanitizeV1022T6Mega9DepthPersisted" not in text and mig_anchor in text:
        text = text.replace(mig_anchor, mig_patch + mig_anchor, 1)
        print("wired §6 v1022.t6_mega9_depth migration")

    if "t6Mega9DepthEnabled" not in text and "t6Mega8DepthEnabled: true," in text:
        text = text.replace(
            "t6Mega8DepthEnabled: true,",
            "t6Mega8DepthEnabled: true,\n  t6Mega9DepthEnabled: true,",
            1,
        )
        print("registered settings t6Mega9DepthEnabled")

    iires_tail = """      if (typeof runV1036IiresTurn === 'function') {
        try {
          const iiresIn = buildV1036IiresTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          iiresIn.persisted = V1036_IIRES_readPersistedFromGameState(mergedGameState);
          const iiresOut = runV1036IiresTurn(iiresIn);
          mergedGameState = V1036_IIRES_applyToGameState(mergedGameState, iiresOut);
        } catch (_) { /* isolated */ }
      }"""
    day_hook = """
      if (typeof runV1022T6Mega9DepthTurn === 'function') {
        try {
          const m9In = buildV1022T6Mega9DepthTurnInputFromGameState(
            mergedGameState,
            passCtx.turnCounter,
            settings?.t6Mega9DepthEnabled !== false,
          );
          m9In.persisted = V1022_T6MEGA9_readPersistedFromGameState(mergedGameState);
          const m9Out = runV1022T6Mega9DepthTurn(m9In);
          mergedGameState = V1022_T6MEGA9_applyToGameState(mergedGameState, m9Out);
        } catch (_) { /* isolated */ }
      }
"""
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)
    in_day = day_slice[1][:95000] if len(day_slice) > 1 else ""
    if "runV1022T6Mega9DepthTurn(m9In)" not in in_day and iires_tail in text:
        text = text.replace(iires_tail, iires_tail + day_hook, 1)
        print("wired T6 mega9 day hook after information integrity resilience")

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
