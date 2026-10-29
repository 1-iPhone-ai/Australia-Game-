#!/usr/bin/env python3
"""Agent 25 — Tranche 6 O6K inline merges (push #2 trade, #3 replay, #4 public services)."""
from __future__ import annotations

import argparse
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from agent25_o6k_inline_lib import (  # noqa: E402
    ANCHOR,
    V94,
    bundle_local_files,
    insert_before,
    paths_from_index,
    public_services_paths,
    trade_sanctions_paths,
)

TRADE_MARKER = "export function runV1014TradeDepthTurn"
REPLAY_MARKER = "export function runV1014ReplayCounterfactualSelfTests"
PUBSVC_MARKER = "export function V1014_PUBSVC_computePublicServicesCrosswalk"

TRADE_SECTION = (
    "// ============================================================================\n"
    "// SECTION 20BA: V10.14 TRADE DEPTH — TARIFFS, SANCTIONS & CAPITAL CONTROLS (T6-6)\n"
    "// ============================================================================\n"
)

REPLAY_SECTION = (
    "// ============================================================================\n"
    "// SECTION 20AY: V10.14 REPLAY & COUNTERFACTUAL ANALYTICS (T6-3 / Agent 24 depth)\n"
    "// ============================================================================\n"
)

PUBSVC_SECTION = (
    "// ============================================================================\n"
    "// SECTION 20AZ: V10.14 PUBLIC SERVICES CROSSWALK v2 (T6-5)\n"
    "// ============================================================================\n"
)

TRADE_HELPERS = """
export function buildV1014TradeDepthTurnInputFromGameState(gs: any, turn: number): V1014TradeDepthTurnInput {
  const persisted = sanitizeV1014TradeDepthPersisted(gs?.v1014TradeDepth, turn);
  return {
    turn,
    seed: Number(gs?.rngSeed ?? turn * 9973) % 2147483647,
    gtelAccessBand: (gs?.globalTradeEconomy?.accessBand as V1014TradeDepthAccessBand) || 'normal',
    diplomacyTrust: Number(gs?.diplomacyState?.aggregateTrust ?? gs?.diplomacy?.trustIndex ?? 50),
    tradeDeficitIndex: Number(gs?.globalTradeEconomy?.tradeDeficitIndex ?? 45),
    fiscalPressureBand: (gs?.publicFinance?.pressureBand as V1014TradeDepthFiscalBand) || 'healthy',
    householdSentiment: Number(gs?.householdEconomy?.sentimentIndex ?? 50),
    investmentClimateScore: Number(gs?.strategicCapital?.climateScore ?? 55),
    counterpartySanctionsActive: Boolean(gs?.diplomacyState?.sanctionsActive),
    bilateralPairIds: Object.keys(persisted.bilateralSnapshots || {}),
    activeSanctionPackages: persisted.activePackages || [],
    capitalRegimeIds: Object.keys(persisted.capitalRegimes || {}),
    persisted,
  };
}
"""

PUBSVC_HELPERS = """
export function buildV1014PubsSvcCrosswalkInputsFromGameState(gs: any, turn: number): Partial<V1014PubsSvcCrosswalkInputs> {
  const ps = gs?.publicServices;
  const wf = gs?.workforceHumanCapital ?? gs?.workforce;
  const hh = gs?.householdEconomy;
  return {
    turn,
    ap20: {
      turn,
      nationalOutcomeIndex: Number(ps?.nationalOutcomeIndex ?? 55),
      regionalOutcome: ps?.regionalOutcome ?? {},
    },
    ac20: {
      turn,
      nationalReadiness: Number(wf?.nationalReadiness ?? 58),
      specialistGap: Number(wf?.specialistGap ?? 28),
      regionalSkillSupply: wf?.regionalSkillSupply ?? {},
    },
    aj20: {
      turn,
      migrationFlowBand: (gs?.laborDemographics?.migrationFlowBand as any) || 'balanced',
      regionalAttractiveness: gs?.laborDemographics?.regionalAttractiveness ?? {},
      wagePressureIndex: Number(gs?.laborDemographics?.wagePressureIndex ?? 48),
    },
    af20: {
      turn,
      affordabilityStress: Number(hh?.affordabilityStress ?? 42),
      regionalLivingStandard: hh?.regionalLivingStandard ?? {},
      domesticDemandPull: Number(hh?.domesticDemandPull ?? 50),
    },
    fiscalHeadroom: Number(gs?.publicFinance?.headroomIndex ?? 55),
    policyFocus: ps?.policyFocus ?? { housing: 50, healthcare: 52, education: 54 },
  };
}

function V1014_PUBSVC_readSection6Slice(gs: any): V1014PubsSvcSection6Persisted | null {
  const raw = gs?.save?.meta?.v1014?.public_services_v2;
  return raw ? V1014_PUBSVC_migrateSection6Persisted(raw) : null;
}

function V1014_PUBSVC_patchSection6Slice(gs: any, persisted: V1014PubsSvcSection6Persisted): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1014 = { ...(meta.v1014 || {}) };
  v1014.public_services_v2 = persisted;
  meta.v1014 = v1014;
  save.meta = meta;
  return { ...gs, save };
}
"""

TRADE_DAY_HOOK = """
      if (typeof runV1014TradeDepthTurn === 'function') {
        try {
          const tdIn = buildV1014TradeDepthTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          const tdOut = runV1014TradeDepthTurn(tdIn);
          mergedGameState = { ...mergedGameState, v1014TradeDepth: tdOut.persisted };
        } catch (_) { /* isolated */ }
      }
"""

REPLAY_DAY_HOOK = """
      if (typeof V1014_REPLAY_encodeSnapshot === 'function' && typeof V1014_REPLAY_patchPersistenceSlice === 'function') {
        try {
          const branchId = String(mergedGameState?.replayBranchTree?.activeNodeId ?? 'root');
          const prevSlice = V1014_REPLAY_readPersistenceSlice(mergedGameState) ?? {
            schemaVersion: V1014_REPLAY_SCHEMA_VERSION,
            archiveRing: [],
            activeBranch: null,
            lastDiffReportId: null,
            section6SlotBindings: {},
            scrubberIndex: 0,
            forecastOverlay: null,
            dashboardTiles: [],
          };
          const snap = V1014_REPLAY_encodeSnapshot({
            matchId: String(mergedGameState?.matchId ?? mergedGameState?.id ?? 'live'),
            turn: passCtx.turnCounter,
            day: passCtx.newDay,
            sequence: passIndex,
            branchNodeId: branchId,
          });
          const nextSlice = {
            ...prevSlice,
            schemaVersion: V1014_REPLAY_SCHEMA_VERSION,
            archiveRing: V1014_REPLAY_pushArchiveRing(prevSlice.archiveRing ?? [], snap, 48),
          };
          mergedGameState = V1014_REPLAY_patchPersistenceSlice(mergedGameState, nextSlice);
        } catch (_) { /* isolated */ }
      }
"""

PUBSVC_DAY_HOOK = """
      if (typeof V1014_PUBSVC_computePublicServicesCrosswalk === 'function') {
        try {
          const inputs = buildV1014PubsSvcCrosswalkInputsFromGameState(mergedGameState, passCtx.turnCounter);
          const prev6 = V1014_PUBSVC_readSection6Slice(mergedGameState);
          const cross = V1014_PUBSVC_computePublicServicesCrosswalk(inputs, prev6);
          mergedGameState = V1014_PUBSVC_patchSection6Slice(mergedGameState, cross.persisted);
          mergedGameState = { ...mergedGameState, v1014PublicServicesCrosswalk: cross.snapshot };
        } catch (_) { /* isolated */ }
      }
"""


def wire_pubsvc_day_hook(text: str) -> str:
    marker = "V1014_PUBSVC_patchSection6Slice(mergedGameState, cross.persisted)"
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)[1][:15000]
    if marker in day_slice:
        print("skip pubsvc day hook (present)")
        return text
    trade_tail = """      if (typeof runV1014TradeDepthTurn === 'function') {
        try {
          const tdIn = buildV1014TradeDepthTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          const tdOut = runV1014TradeDepthTurn(tdIn);
          mergedGameState = { ...mergedGameState, v1014TradeDepth: tdOut.persisted };
        } catch (_) { /* isolated */ }
      }"""
    if trade_tail not in text:
        raise SystemExit("trade day hook anchor missing for pubsvc hook")
    return text.replace(trade_tail, trade_tail + PUBSVC_DAY_HOOK, 1)


def wire_day_hooks(text: str, extra_hook: str, hook_id: str) -> str:
    anchor = "        v1014SupplyChain: supplyOut?.persisted ?? mergedGameState?.v1014SupplyChain,\n      };"
    runtime_marker = extra_hook.strip().split("\n", 1)[0].strip()
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)[1][:12000]
    if runtime_marker in day_slice:
        print(f"skip day hook {hook_id}")
        return text
    if anchor not in text:
        raise SystemExit("orchestrator supply anchor missing for day hook")
    return text.replace(anchor, anchor + extra_hook, 1)


def wire_trade_migration(text: str) -> str:
    needle = "  if (migrated.gameState) migrated.gameState.v1014SupplyChain = sanitizeV1014SupplyChainPersisted(migrated.gameState.v1014SupplyChain);"
    patch = needle + "\n  if (migrated.gameState) migrated.gameState.v1014TradeDepth = sanitizeV1014TradeDepthPersisted(migrated.gameState.v1014TradeDepth, Number(migrated.gameState.turnCounter || 0));"
    if "sanitizeV1014TradeDepthPersisted" in text and "v1014TradeDepth" in text.split("migrateSavePayload")[1][:8000] if "migrateSavePayload" in text else False:
        return text
    if "migrated.gameState.v1014TradeDepth" in text:
        print("skip trade §6 migration")
        return text
    if needle not in text:
        raise SystemExit("§6 supply anchor missing")
    return text.replace(needle, patch, 1)


def wire_replay_migration(text: str) -> str:
    anchor = "  if (migrated.gameState) migrated.gameState.v1014TradeDepth = sanitizeV1014TradeDepthPersisted"
    patch = (
        "  if (migrated.gameState && typeof V1014_REPLAY_readPersistenceSlice === 'function') {\n"
        "    const replaySlice = V1014_REPLAY_readPersistenceSlice(migrated.gameState);\n"
        "    if (replaySlice) migrated.gameState = V1014_REPLAY_patchPersistenceSlice(migrated.gameState, replaySlice);\n"
        "  }\n"
    )
    if "V1014_REPLAY_readPersistenceSlice(migrated.gameState)" in text:
        print("skip replay §6 migration")
        return text
    if anchor not in text:
        raise SystemExit("trade §6 anchor missing for replay migration insert")
    return text.replace(anchor, patch + anchor, 1)


def wire_pubsvc_migration(text: str) -> str:
    anchor = "  if (migrated.gameState && typeof V1014_REPLAY_readPersistenceSlice === 'function') {"
    patch = (
        "  if (migrated.gameState) {\n"
        "    const pubsRaw = (migrated.gameState as any)?.save?.meta?.v1014?.public_services_v2;\n"
        "    if (pubsRaw && typeof V1014_PUBSVC_migrateSection6Persisted === 'function') {\n"
        "      migrated.gameState = V1014_PUBSVC_patchSection6Slice(\n"
        "        migrated.gameState,\n"
        "        V1014_PUBSVC_migrateSection6Persisted(pubsRaw),\n"
        "      );\n"
        "    }\n"
        "  }\n"
    )
    if "V1014_PUBSVC_patchSection6Slice" in text and "public_services_v2" in text:
        if "pubsRaw" in text:
            print("skip pubsvc §6 migration")
            return text
    if anchor not in text:
        raise SystemExit("replay §6 anchor missing for pubsvc migration")
    return text.replace(anchor, patch + anchor, 1)


def wire_lab(text: str, lab_line: str, lab_id: str) -> str:
    token = f"{{ id: '{lab_id}'"
    if token in text:
        print(f"skip LAB {lab_id}")
        return text
    return text.replace("  { id: 'v1014_fiscal',", lab_line + "  { id: 'v1014_fiscal',", 1)


def push_trade(text: str) -> str:
    block = TRADE_SECTION + bundle_local_files(trade_sanctions_paths()) + TRADE_HELPERS
    text = insert_before(text, block, TRADE_MARKER, "T6 push #2 trade-sanctions (PR #306)")
    text = wire_day_hooks(text, TRADE_DAY_HOOK, "runV1014TradeDepthTurn(tdIn)")
    text = wire_trade_migration(text)
    lab = """  { id: 'v1014_trade_depth', label: 'V10.14 Trade depth (T6-6 tariffs/sanctions/capital)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1014TradeDepthSelfTestsForLab() },
"""
    text = wire_lab(text, lab, "v1014_trade_depth")
    return text


def push_replay(text: str) -> str:
    replay_paths = paths_from_index("expansion/o6k-10m/replay-counterfactual/generated/index.ts")
    block = REPLAY_SECTION + bundle_local_files(replay_paths)
    text = insert_before(text, block, REPLAY_MARKER, "T6 push #3 replay-counterfactual (PR #307)")
    text = wire_day_hooks(text, REPLAY_DAY_HOOK, "V1014_REPLAY_encodeSnapshot")
    text = wire_replay_migration(text)
    lab = """  { id: 'o6k_agent24_v2', label: 'Agent 24 replay counterfactual v2 (T6-3)', tier: 'quick', section: 'Replay Integrity', severity: 'MAJOR', run: () => { const r = runV1014ReplayCounterfactualSelfTests(); return r.results.map(x => ({ id: x.id, name: x.name, passed: x.passed, detail: x.detail || (x.passed ? 'ok' : 'fail') })); } },
"""
    text = wire_lab(text, lab, "o6k_agent24_v2")
    return text


def push_pubsvc(text: str) -> str:
    block = PUBSVC_SECTION + bundle_local_files(public_services_paths()) + PUBSVC_HELPERS
    text = insert_before(text, block, PUBSVC_MARKER, "T6 push #4 public-services (PR #310)")
    text = wire_pubsvc_day_hook(text)
    text = wire_pubsvc_migration(text)
    lab = """  { id: 'v1014_public_services_v2', label: 'V10.14 Public services crosswalk v2 (20AZ)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1014PublicServicesV2SelfTests().results.map((r) => ({ id: r.id, name: r.name, passed: r.passed, detail: r.detail })) },
"""
    text = wire_lab(text, lab, "v1014_public_services_v2")
    return text


def write_loc_report() -> None:
    out = ROOT / "expansion/o6k-10m/trade-sanctions"
    store = pathlib.Path("/cursor/stores/self/internal/trade-sanctions-t6-6-loc-per-file.txt")
    lines: list[str] = []
    for p in sorted(out.rglob("*")):
        if p.is_file() and p.suffix in {".ts", ".md"}:
            n = len(p.read_text(encoding="utf-8").splitlines())
            lines.append(f"{n:6d} {p}")
    store.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {store}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("push", type=int, choices=[2, 3, 4])
    args = ap.parse_args()
    text = V94.read_text(encoding="utf-8")
    before = len(text.splitlines())
    if args.push == 2:
        text = push_trade(text)
        write_loc_report()
    elif args.push == 3:
        text = push_replay(text)
    elif args.push == 4:
        text = push_pubsvc(text)
    V94.write_text(text, encoding="utf-8")
    after = len(text.splitlines())
    print(f"lines {before} -> {after} (+{after - before})")


if __name__ == "__main__":
    main()
