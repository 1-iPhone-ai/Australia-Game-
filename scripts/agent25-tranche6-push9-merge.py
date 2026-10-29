#!/usr/bin/env python3
"""Agent 25 tranche 6 push #9 — insert push9 mega (SECTION 20BG) + runtime wiring."""
from __future__ import annotations

import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
V94 = ROOT / "(V9.4) australia-game-with-ai.tsx"
GEN = ROOT / "scripts" / "tranche6-push9-generated.tsx"
ANCHOR = "// SECTION 21B:"
MARKER = "export function runV1014T6MegaDepthTurn"


def main() -> None:
    subprocess.run([sys.executable, str(ROOT / "scripts" / "generate-tranche6-push9-mega.py")], check=True)
    text = V94.read_text(encoding="utf-8")
    before = len(text.splitlines())
    block = GEN.read_text(encoding="utf-8")
    helpers = """
function V1014_T6MEGA_readPersistedFromGameState(gs: any): V1014T6MegaPersisted | null {
  const raw = (gs?.save?.meta?.v1014 as any)?.t6_mega_depth;
  return raw ? sanitizeV1014T6MegaDepthPersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1014_T6MEGA_applyToGameState(gs: any, out: V1014T6MegaTurnResult): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1014 = { ...(meta.v1014 || {}) };
  v1014.t6_mega_depth = out.persisted;
  meta.v1014 = v1014;
  save.meta = meta;
  return { ...gs, save, v1014T6MegaDepth: out.state };
}
"""
    block = block + helpers

    if MARKER in text:
        print("skip insert (T6 mega depth already present)")
    else:
        idx = text.index(ANCHOR)
        banner = (
            "\n// ============================================================================\n"
            "// Agent 25 tranche 6 push #9 — V1014 T6 cross-domain mega depth (generated)\n"
            "// ============================================================================\n"
        )
        text = text[:idx] + banner + block + "\n" + text[idx:]
        print("inserted tranche6 push9 generated block")

    lab = """  { id: 'v1014_t6_mega_depth', label: 'V10.14 T6 cross-domain mega depth (20BG coherence mesh)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1014T6MegaDepthSelfTestsForLab() },
"""
    if "{ id: 'v1014_t6_mega_depth'" not in text:
        if "  { id: 'v1014_workforce_v2'," in text:
            text = text.replace("  { id: 'v1014_workforce_v2',", lab + "  { id: 'v1014_workforce_v2',", 1)
        else:
            text = text.replace("  { id: 'v1014_fiscal',", lab + "  { id: 'v1014_fiscal',", 1)
        print("registered LAB v1014_t6_mega_depth")

    mig_anchor = "  if (migrated.gameState) {\n    const wfRaw = (migrated.gameState as any)?.save?.meta?.v1014?.workforce_v2;"
    mig_patch = (
        "  if (migrated.gameState) {\n"
        "    const megaRaw = (migrated.gameState as any)?.save?.meta?.v1014?.t6_mega_depth;\n"
        "    if (megaRaw && typeof sanitizeV1014T6MegaDepthPersisted === 'function') {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1014 = { ...(meta.v1014 || {}) };\n"
        "      v1014.t6_mega_depth = sanitizeV1014T6MegaDepthPersisted(megaRaw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1014 = v1014;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1014.t6_mega_depth = sanitizeV1014T6MegaDepthPersisted" not in text and mig_anchor in text:
        text = text.replace(mig_anchor, mig_patch + mig_anchor, 1)
        print("wired §6 t6_mega_depth migration")

    if "t6MegaDepthEnabled" not in text:
        text = text.replace(
            "  v1015OrchestratorEnabled: true,",
            "  v1015OrchestratorEnabled: true,\n  t6MegaDepthEnabled: true,",
            1,
        )

    wf_tail = """      if (typeof runV1014WorkforceMigrationTurn === 'function') {
        try {
          const wfIn = buildV1014WorkforceMigrationTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          wfIn.persisted = V1014_WORKFORCE_readPersistedFromGameState(mergedGameState);
          const wfOut = runV1014WorkforceMigrationTurn(wfIn);
          mergedGameState = V1014_WORKFORCE_applyToGameState(mergedGameState, wfOut);
        } catch (_) { /* isolated */ }
      }"""
    day_hook = """
      if (typeof runV1014T6MegaDepthTurn === 'function') {
        try {
          const megaIn = buildV1014T6MegaDepthTurnInputFromGameState(
            mergedGameState,
            passCtx.turnCounter,
            settings?.t6MegaDepthEnabled !== false,
          );
          megaIn.persisted = V1014_T6MEGA_readPersistedFromGameState(mergedGameState);
          const megaOut = runV1014T6MegaDepthTurn(megaIn);
          mergedGameState = V1014_T6MEGA_applyToGameState(mergedGameState, megaOut);
        } catch (_) { /* isolated */ }
      }
"""
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)
    in_day = day_slice[1][:24000] if len(day_slice) > 1 else ""
    if "runV1014T6MegaDepthTurn(megaIn)" not in in_day and wf_tail in text:
        text = text.replace(wf_tail, wf_tail + day_hook, 1)
        print("wired T6 mega day hook after workforce")

    V94.write_text(text, encoding="utf-8")
    after = len(text.splitlines())
    print(f"lines {before} -> {after} (+{after - before})")


if __name__ == "__main__":
    main()
