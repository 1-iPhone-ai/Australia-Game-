#!/usr/bin/env python3
"""Agent 25 tranche 6 push #40 — insert push40 mega10 (SECTION 20CL) + runtime wiring."""
from __future__ import annotations

import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
V94 = ROOT / "(V9.4) australia-game-with-ai.tsx"
GEN = ROOT / "scripts" / "tranche6-push40-generated.tsx"
ANCHOR = "// SECTION 21B:"
MARKER = "export function runV1022T6Mega10DepthTurn"
NET_TARGET = 150_000
NET_FLOOR = 130_000


def main() -> None:
    subprocess.run([sys.executable, str(ROOT / "scripts" / "generate-tranche6-push40-mega.py")], check=True)
    text = V94.read_text(encoding="utf-8")
    before = len(text.splitlines())
    helpers = """
function V1022_T6MEGA10_readPersistedFromGameState(gs: any): V1022T6Mega10Persisted | null {
  const raw = (gs?.save?.meta?.v1022 as any)?.t6_mega10_depth;
  return raw ? sanitizeV1022T6Mega10DepthPersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1022_T6MEGA10_applyToGameState(gs: any, out: V1022T6Mega10TurnResult): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1022 = { ...(meta.v1022 || {}) };
  v1022.t6_mega10_depth = out.persisted;
  meta.v1022 = v1022;
  save.meta = meta;
  return { ...gs, save, v1022T6Mega10Depth: out.state };
}
"""
    block = GEN.read_text(encoding="utf-8") + helpers

    if MARKER in text:
        print("skip insert (T6 mega10 depth already present)")
    else:
        idx = text.index(ANCHOR)
        banner = (
            "\n// ============================================================================\n"
            "// Agent 25 tranche 6 push #40 — V1022 T6 mega10 wave-11 lattice (generated)\n"
            "// ============================================================================\n"
        )
        text = text[:idx] + banner + block + "\n" + text[idx:]
        print("inserted tranche6 push40 generated block")

    lab = """  { id: 'v1022_t6_mega10_depth', label: 'V10.22 T6 mega10 wave-11 lattice (20CL / 20BA–20CK)', tier: 'full', section: 'System Regression', severity: 'MAJOR', run: () => runV1022T6Mega10DepthSelfTestsForLab() },
"""
    if "{ id: 'v1022_t6_mega10_depth'" not in text:
        anchor_lab = (
            "  { id: 'v1037_provenance_chain_resilience', label: 'V10.37 Public records provenance chain (20CK custody & mesh buffers)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1037PcresSelfTestsForLab() },"
        )
        if anchor_lab in text:
            text = text.replace(anchor_lab, anchor_lab + "\n" + lab.strip(), 1)
            print("registered LAB v1022_t6_mega10_depth")
        else:
            text = text.replace("  { id: 'v1014_fiscal',", lab + "  { id: 'v1014_fiscal',", 1)
            print("registered LAB v1022_t6_mega10_depth (fallback)")

    mig_anchor = "  if (migrated.gameState && typeof sanitizeV1037PcresPersisted === 'function') {"
    mig_patch = (
        "  if (migrated.gameState && typeof sanitizeV1022T6Mega10DepthPersisted === 'function') {\n"
        "    const m10Raw = (migrated.gameState as any)?.save?.meta?.v1022?.t6_mega10_depth;\n"
        "    if (m10Raw) {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1022 = { ...(meta.v1022 || {}) };\n"
        "      v1022.t6_mega10_depth = sanitizeV1022T6Mega10DepthPersisted(m10Raw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1022 = v1022;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1022.t6_mega10_depth = sanitizeV1022T6Mega10DepthPersisted" not in text and mig_anchor in text:
        text = text.replace(mig_anchor, mig_patch + mig_anchor, 1)
        print("wired §6 v1022.t6_mega10_depth migration")

    if "t6Mega10DepthEnabled" not in text and "t6Mega9DepthEnabled: true," in text:
        text = text.replace(
            "t6Mega9DepthEnabled: true,",
            "t6Mega9DepthEnabled: true,\n  t6Mega10DepthEnabled: true,",
            1,
        )
        print("registered settings t6Mega10DepthEnabled")
    elif "t6Mega10DepthEnabled" not in text and "v1037PcresEnabled: true," in text:
        text = text.replace(
            "v1037PcresEnabled: true,",
            "v1037PcresEnabled: true,\n  t6Mega10DepthEnabled: true,",
            1,
        )
        print("registered settings t6Mega10DepthEnabled (fallback)")

    pcres_tail = """      if (typeof runV1037PcresTurn === 'function') {
        try {
          const pcresIn = buildV1037PcresTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          pcresIn.persisted = V1037_PCRS_readPersistedFromGameState(mergedGameState);
          const pcresOut = runV1037PcresTurn(pcresIn);
          mergedGameState = V1037_PCRS_applyToGameState(mergedGameState, pcresOut);
        } catch (_) { /* isolated */ }
      }"""
    day_hook = """
      if (typeof runV1022T6Mega10DepthTurn === 'function') {
        try {
          const m10In = buildV1022T6Mega10DepthTurnInputFromGameState(
            mergedGameState,
            passCtx.turnCounter,
            settings?.t6Mega10DepthEnabled !== false,
          );
          m10In.persisted = V1022_T6MEGA10_readPersistedFromGameState(mergedGameState);
          const m10Out = runV1022T6Mega10DepthTurn(m10In);
          mergedGameState = V1022_T6MEGA10_applyToGameState(mergedGameState, m10Out);
        } catch (_) { /* isolated */ }
      }
"""
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)
    in_day = day_slice[1][:95000] if len(day_slice) > 1 else ""
    if "runV1022T6Mega10DepthTurn(m10In)" not in in_day and pcres_tail in text:
        text = text.replace(pcres_tail, pcres_tail + day_hook, 1)
        print("wired T6 mega10 day hook after provenance chain resilience")

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
