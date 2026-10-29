#!/usr/bin/env python3
"""Agent 25 tranche 6 push #17 — insert push17 mega4 (SECTION 20BO) + runtime wiring."""
from __future__ import annotations

import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
V94 = ROOT / "(V9.4) australia-game-with-ai.tsx"
GEN = ROOT / "scripts" / "tranche6-push17-generated.tsx"
ANCHOR = "// SECTION 21B:"
MARKER = "export function runV1019T6Mega4DepthTurn"
NET_TARGET = 125_000
NET_FLOOR = 110_000


def main() -> None:
    subprocess.run([sys.executable, str(ROOT / "scripts" / "generate-tranche6-push17-mega.py")], check=True)
    text = V94.read_text(encoding="utf-8")
    before = len(text.splitlines())
    helpers = """
function V1019_T6MEGA4_readPersistedFromGameState(gs: any): V1019T6Mega4Persisted | null {
  const raw = (gs?.save?.meta?.v1019 as any)?.t6_mega4_depth;
  return raw ? sanitizeV1019T6Mega4DepthPersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1019_T6MEGA4_applyToGameState(gs: any, out: V1019T6Mega4TurnResult): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1019 = { ...(meta.v1019 || {}) };
  v1019.t6_mega4_depth = out.persisted;
  meta.v1019 = v1019;
  save.meta = meta;
  return { ...gs, save, v1019T6Mega4Depth: out.state };
}
"""
    block = GEN.read_text(encoding="utf-8") + helpers

    if MARKER in text:
        print("skip insert (T6 mega4 depth already present)")
    else:
        idx = text.index(ANCHOR)
        banner = (
            "\n// ============================================================================\n"
            "// Agent 25 tranche 6 push #17 — V1019 T6 mega4 wave-5 lattice (generated)\n"
            "// ============================================================================\n"
        )
        text = text[:idx] + banner + block + "\n" + text[idx:]
        print("inserted tranche6 push17 generated block")

    lab = """  { id: 'v1019_t6_mega4_depth', label: 'V10.19 T6 mega4 wave-5 lattice (20BO / 20BA–20BN)', tier: 'full', section: 'System Regression', severity: 'MAJOR', run: () => runV1019T6Mega4DepthSelfTestsForLab() },
"""
    if "{ id: 'v1019_t6_mega4_depth'" not in text:
        anchor_lab = "  { id: 'v1019_maritime_trade',"
        if anchor_lab in text:
            text = text.replace(anchor_lab, lab + anchor_lab, 1)
        else:
            text = text.replace("  { id: 'v1014_fiscal',", lab + "  { id: 'v1014_fiscal',", 1)
        print("registered LAB v1019_t6_mega4_depth")

    mig_anchor = "  if (migrated.gameState && typeof sanitizeV1019MtrdPersisted === 'function') {"
    mig_patch = (
        "  if (migrated.gameState && typeof sanitizeV1019T6Mega4DepthPersisted === 'function') {\n"
        "    const m4Raw = (migrated.gameState as any)?.save?.meta?.v1019?.t6_mega4_depth;\n"
        "    if (m4Raw) {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1019 = { ...(meta.v1019 || {}) };\n"
        "      v1019.t6_mega4_depth = sanitizeV1019T6Mega4DepthPersisted(m4Raw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1019 = v1019;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1019.t6_mega4_depth = sanitizeV1019T6Mega4DepthPersisted" not in text and mig_anchor in text:
        text = text.replace(mig_anchor, mig_patch + mig_anchor, 1)
        print("wired §6 v1019.t6_mega4_depth migration")

    if "t6Mega4DepthEnabled" not in text:
        if "t6Mega3DepthEnabled: true," in text:
            text = text.replace(
                "t6Mega3DepthEnabled: true,",
                "t6Mega3DepthEnabled: true,\n  t6Mega4DepthEnabled: true,",
                1,
            )
        elif "t6Mega2DepthEnabled: true," in text:
            text = text.replace(
                "t6Mega2DepthEnabled: true,",
                "t6Mega2DepthEnabled: true,\n  t6Mega4DepthEnabled: true,",
                1,
            )

    mtrd_tail = """      if (typeof runV1019MtrdTurn === 'function') {
        try {
          const mtrdIn = buildV1019MtrdTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          mtrdIn.persisted = V1019_MTRD_readPersistedFromGameState(mergedGameState);
          const mtrdOut = runV1019MtrdTurn(mtrdIn);
          mergedGameState = V1019_MTRD_applyToGameState(mergedGameState, mtrdOut);
        } catch (_) { /* isolated */ }
      }"""
    day_hook = """
      if (typeof runV1019T6Mega4DepthTurn === 'function') {
        try {
          const m4In = buildV1019T6Mega4DepthTurnInputFromGameState(
            mergedGameState,
            passCtx.turnCounter,
            settings?.t6Mega4DepthEnabled !== false,
          );
          m4In.persisted = V1019_T6MEGA4_readPersistedFromGameState(mergedGameState);
          const m4Out = runV1019T6Mega4DepthTurn(m4In);
          mergedGameState = V1019_T6MEGA4_applyToGameState(mergedGameState, m4Out);
        } catch (_) { /* isolated */ }
      }
"""
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)
    in_day = day_slice[1][:36000] if len(day_slice) > 1 else ""
    if "runV1019T6Mega4DepthTurn(m4In)" not in in_day and mtrd_tail in text:
        text = text.replace(mtrd_tail, mtrd_tail + day_hook, 1)
        print("wired T6 mega4 day hook after maritime trade")

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
