#!/usr/bin/env python3
"""Agent 25 tranche 6 push #14 — insert push14 mega (SECTION 20BL) + runtime wiring."""
from __future__ import annotations

import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
V94 = ROOT / "(V9.4) australia-game-with-ai.tsx"
GEN = ROOT / "scripts" / "tranche6-push14-generated.tsx"
ANCHOR = "// SECTION 21B:"
MARKER = "export function runV1018T6Mega3DepthTurn"
NET_TARGET = 100_000
NET_FLOOR = 85_000


def main() -> None:
    subprocess.run([sys.executable, str(ROOT / "scripts" / "generate-tranche6-push14-mega.py")], check=True)
    text = V94.read_text(encoding="utf-8")
    before = len(text.splitlines())
    helpers = """
function V1018_T6MEGA3_readPersistedFromGameState(gs: any): V1018T6Mega3Persisted | null {
  const raw = (gs?.save?.meta?.v1018 as any)?.t6_mega3_depth;
  return raw ? sanitizeV1018T6Mega3DepthPersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1018_T6MEGA3_applyToGameState(gs: any, out: V1018T6Mega3TurnResult): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1018 = { ...(meta.v1018 || {}) };
  v1018.t6_mega3_depth = out.persisted;
  meta.v1018 = v1018;
  save.meta = meta;
  return { ...gs, save, v1018T6Mega3Depth: out.state };
}
"""
    block = GEN.read_text(encoding="utf-8") + helpers

    if MARKER in text:
        print("skip insert (T6 mega3 depth already present)")
    else:
        idx = text.index(ANCHOR)
        banner = (
            "\n// ============================================================================\n"
            "// Agent 25 tranche 6 push #14 — V1018 T6 mega3 wave-4 lattice (generated)\n"
            "// ============================================================================\n"
        )
        text = text[:idx] + banner + block + "\n" + text[idx:]
        print("inserted tranche6 push14 generated block")

    lab = """  { id: 'v1018_t6_mega3_depth', label: 'V10.18 T6 mega3 wave-4 lattice (20BL / 20BA–20BK)', tier: 'full', section: 'System Regression', severity: 'MAJOR', run: () => runV1018T6Mega3DepthSelfTestsForLab() },
"""
    if "{ id: 'v1018_t6_mega3_depth'" not in text:
        anchor_lab = "  { id: 'v1017_intercity_logistics',"
        if anchor_lab in text:
            text = text.replace(anchor_lab, lab + anchor_lab, 1)
        else:
            text = text.replace("  { id: 'v1014_fiscal',", lab + "  { id: 'v1014_fiscal',", 1)
        print("registered LAB v1018_t6_mega3_depth")

    mig_anchor = "  if (migrated.gameState && typeof sanitizeV1017IclogPersisted === 'function') {"
    mig_patch = (
        "  if (migrated.gameState && typeof sanitizeV1018T6Mega3DepthPersisted === 'function') {\n"
        "    const m3Raw = (migrated.gameState as any)?.save?.meta?.v1018?.t6_mega3_depth;\n"
        "    if (m3Raw) {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1018 = { ...(meta.v1018 || {}) };\n"
        "      v1018.t6_mega3_depth = sanitizeV1018T6Mega3DepthPersisted(m3Raw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1018 = v1018;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1018.t6_mega3_depth = sanitizeV1018T6Mega3DepthPersisted" not in text and mig_anchor in text:
        text = text.replace(mig_anchor, mig_patch + mig_anchor, 1)
        print("wired §6 v1018.t6_mega3_depth migration")

    if "t6Mega3DepthEnabled" not in text:
        if "t6Mega2DepthEnabled: true," in text:
            text = text.replace(
                "t6Mega2DepthEnabled: true,",
                "t6Mega2DepthEnabled: true,\n  t6Mega3DepthEnabled: true,",
                1,
            )
        elif "t6MegaDepthEnabled: true," in text:
            text = text.replace(
                "t6MegaDepthEnabled: true,",
                "t6MegaDepthEnabled: true,\n  t6Mega3DepthEnabled: true,",
                1,
            )

    iclog_tail = """      if (typeof runV1017IclogTurn === 'function') {
        try {
          const iclogIn = buildV1017IclogTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          iclogIn.persisted = V1017_ICLOG_readPersistedFromGameState(mergedGameState);
          const iclogOut = runV1017IclogTurn(iclogIn);
          mergedGameState = V1017_ICLOG_applyToGameState(mergedGameState, iclogOut);
        } catch (_) { /* isolated */ }
      }"""
    day_hook = """
      if (typeof runV1018T6Mega3DepthTurn === 'function') {
        try {
          const m3In = buildV1018T6Mega3DepthTurnInputFromGameState(
            mergedGameState,
            passCtx.turnCounter,
            settings?.t6Mega3DepthEnabled !== false,
          );
          m3In.persisted = V1018_T6MEGA3_readPersistedFromGameState(mergedGameState);
          const m3Out = runV1018T6Mega3DepthTurn(m3In);
          mergedGameState = V1018_T6MEGA3_applyToGameState(mergedGameState, m3Out);
        } catch (_) { /* isolated */ }
      }
"""
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)
    in_day = day_slice[1][:32000] if len(day_slice) > 1 else ""
    if "runV1018T6Mega3DepthTurn(m3In)" not in in_day and iclog_tail in text:
        text = text.replace(iclog_tail, iclog_tail + day_hook, 1)
        print("wired T6 mega3 day hook after intercity logistics")

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
