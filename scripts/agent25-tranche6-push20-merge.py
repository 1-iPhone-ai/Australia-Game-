#!/usr/bin/env python3
"""Agent 25 tranche 6 push #20 — insert push20 mega5 (SECTION 20BS) + runtime wiring."""
from __future__ import annotations

import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
V94 = ROOT / "(V9.4) australia-game-with-ai.tsx"
GEN = ROOT / "scripts" / "tranche6-push20-generated.tsx"
ANCHOR = "// SECTION 21B:"
MARKER = "export function runV1020T6Mega5DepthTurn"
NET_TARGET = 150_000
NET_FLOOR = 130_000


def main() -> None:
    subprocess.run([sys.executable, str(ROOT / "scripts" / "generate-tranche6-push20-mega.py")], check=True)
    text = V94.read_text(encoding="utf-8")
    before = len(text.splitlines())
    helpers = """
function V1020_T6MEGA5_readPersistedFromGameState(gs: any): V1020T6Mega5Persisted | null {
  const raw = (gs?.save?.meta?.v1020 as any)?.t6_mega5_depth;
  return raw ? sanitizeV1020T6Mega5DepthPersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1020_T6MEGA5_applyToGameState(gs: any, out: V1020T6Mega5TurnResult): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1020 = { ...(meta.v1020 || {}) };
  v1020.t6_mega5_depth = out.persisted;
  meta.v1020 = v1020;
  save.meta = meta;
  return { ...gs, save, v1020T6Mega5Depth: out.state };
}
"""
    block = GEN.read_text(encoding="utf-8") + helpers

    if MARKER in text:
        print("skip insert (T6 mega5 depth already present)")
    else:
        idx = text.index(ANCHOR)
        banner = (
            "\n// ============================================================================\n"
            "// Agent 25 tranche 6 push #20 — V1020 T6 mega5 wave-6 lattice (generated)\n"
            "// ============================================================================\n"
        )
        text = text[:idx] + banner + block + "\n" + text[idx:]
        print("inserted tranche6 push20 generated block")

    lab = """  { id: 'v1020_t6_mega5_depth', label: 'V10.20 T6 mega5 wave-6 lattice (20BS / 20BA–20BQ)', tier: 'full', section: 'System Regression', severity: 'MAJOR', run: () => runV1020T6Mega5DepthSelfTestsForLab() },
"""
    if "{ id: 'v1020_t6_mega5_depth'" not in text:
        for anchor_lab in (
            "  { id: 'v1022_housing_affordability',",
            "{ id: 'v1022_housing_affordability',",
            "  { id: 'v1021_intermodal_freight',",
        ):
            if anchor_lab in text:
                text = text.replace(anchor_lab, lab + anchor_lab, 1)
                print("registered LAB v1020_t6_mega5_depth")
                break
        else:
            text = text.replace("  { id: 'v1014_fiscal',", lab + "  { id: 'v1014_fiscal',", 1)
            print("registered LAB v1020_t6_mega5_depth (fallback)")

    mig_anchor = "  if (migrated.gameState && typeof sanitizeV1022HaffPersisted === 'function') {"
    mig_patch = (
        "  if (migrated.gameState && typeof sanitizeV1020T6Mega5DepthPersisted === 'function') {\n"
        "    const m5Raw = (migrated.gameState as any)?.save?.meta?.v1020?.t6_mega5_depth;\n"
        "    if (m5Raw) {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1020 = { ...(meta.v1020 || {}) };\n"
        "      v1020.t6_mega5_depth = sanitizeV1020T6Mega5DepthPersisted(m5Raw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1020 = v1020;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1020.t6_mega5_depth = sanitizeV1020T6Mega5DepthPersisted" not in text and mig_anchor in text:
        text = text.replace(mig_anchor, mig_patch + mig_anchor, 1)
        print("wired §6 v1020.t6_mega5_depth migration")

    if "t6Mega5DepthEnabled" not in text:
        if "t6Mega4DepthEnabled: true," in text:
            text = text.replace(
                "t6Mega4DepthEnabled: true,",
                "t6Mega4DepthEnabled: true,\n  t6Mega5DepthEnabled: true,",
                1,
            )
        elif "t6Mega3DepthEnabled: true," in text:
            text = text.replace(
                "t6Mega3DepthEnabled: true,",
                "t6Mega3DepthEnabled: true,\n  t6Mega5DepthEnabled: true,",
                1,
            )

    haff_tail = """      if (typeof runV1022HaffTurn === 'function') {
        try {
          const haffIn = buildV1022HaffTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          haffIn.persisted = V1022_HAFF_readPersistedFromGameState(mergedGameState);
          const haffOut = runV1022HaffTurn(haffIn);
          mergedGameState = V1022_HAFF_applyToGameState(mergedGameState, haffOut);
        } catch (_) { /* isolated */ }
      }"""
    day_hook = """
      if (typeof runV1020T6Mega5DepthTurn === 'function') {
        try {
          const m5In = buildV1020T6Mega5DepthTurnInputFromGameState(
            mergedGameState,
            passCtx.turnCounter,
            settings?.t6Mega5DepthEnabled !== false,
          );
          m5In.persisted = V1020_T6MEGA5_readPersistedFromGameState(mergedGameState);
          const m5Out = runV1020T6Mega5DepthTurn(m5In);
          mergedGameState = V1020_T6MEGA5_applyToGameState(mergedGameState, m5Out);
        } catch (_) { /* isolated */ }
      }
"""
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)
    in_day = day_slice[1][:42000] if len(day_slice) > 1 else ""
    if "runV1020T6Mega5DepthTurn(m5In)" not in in_day and haff_tail in text:
        text = text.replace(haff_tail, haff_tail + day_hook, 1)
        print("wired T6 mega5 day hook after housing affordability")

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
