#!/usr/bin/env python3
"""Agent 25 tranche 6 — inline V1015 orchestrator + V1014 supply chain generated shards."""
from __future__ import annotations

import argparse
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
V94 = ROOT / "(V9.4) australia-game-with-ai.tsx"
ANCHOR = "// SECTION 21B:"
GEN_DIR = ROOT / "expansion" / "tranche6-generated"
ORCH = GEN_DIR / "section-20av-orchestrator.ts"
SUPPLY = GEN_DIR / "section-20av-supply-chain.ts"

DAY_BOUNDARY_HOOK_ANCHOR = "    if (nextState.crisisChainState !== gameState.crisisChainState) {"
MIGRATE_PERSIST_ANCHOR = (
    "  if (migrated.gameState) migrated.gameState.publicServices = migrated.gameState.publicServices "
    "? sanitizePublicServicesPersisted(migrated.gameState.publicServices) : null;"
)
LAB_INSERT_ANCHOR = "  { id: 'v1014_fiscal',"


def insert_before(text: str, needle: str, block: str, label: str) -> str:
    marker = block.strip()[:120]
    if marker in text:
        print(f"skip {label} (already present)")
        return text
    idx = text.index(needle)
    banner = (
        f"\n// ============================================================================\n"
        f"// Agent 25 tranche 6 — {label}\n"
        f"// ============================================================================\n"
    )
    return text[:idx] + banner + block + "\n" + text[idx:]


def wire_day_boundary_hooks(text: str) -> str:
    hook_marker = "executeV1015OrchDayBoundaryPipeline(nextState, gameSettings, orchCtx)"
    if hook_marker in text:
        print("skip §11A day hooks (present)")
        return text
    if DAY_BOUNDARY_HOOK_ANCHOR not in text:
        raise SystemExit("advanceDay day-boundary anchor not found for §11A wiring")
    hook = """
    if (gameSettings?.nationalTickOrchestratorEnabled !== false) {
      const orchCtx: V1015OrchDayBoundaryContext = {
        prevDay,
        newDay,
        turnCounter: (gameState.turnCounter || 0) + 1,
        season: newSeason,
      };
      nextState = executeV1015OrchDayBoundaryPipeline(nextState, gameSettings, orchCtx);
    }
    if (gameSettings?.supplyChainDepthEnabled !== false) {
      const supplyCtx: V1014SupplyDayBoundaryContext = {
        prevDay,
        newDay,
        turnCounter: (gameState.turnCounter || 0) + 1,
      };
      nextState = executeV1014SupplyDayBoundaryPipeline(nextState, gameSettings, supplyCtx);
    }

"""
    return text.replace(DAY_BOUNDARY_HOOK_ANCHOR, hook + DAY_BOUNDARY_HOOK_ANCHOR, 1)


def wire_section6_persistence(text: str) -> str:
    marker = "sanitizeV1015OrchPersisted(migrated.gameState.v1015NationalOrchestrator)"
    if marker in text:
        print("skip §6 persistence (present)")
        return text
    if MIGRATE_PERSIST_ANCHOR not in text:
        raise SystemExit("migrateSaveToV71Expansion persistence anchor not found")
    patch = (
        "  if (migrated.gameState) migrated.gameState.v1015NationalOrchestrator = "
        "sanitizeV1015OrchPersisted(migrated.gameState.v1015NationalOrchestrator) "
        "|| createInitialV1015OrchPersisted(Number(migrated.gameState.turnCounter || 0), Number(migrated.gameState.day || 1));\n"
        "  if (migrated.gameState) migrated.gameState.v1014SupplyChain = "
        "sanitizeV1014SupplyPersisted(migrated.gameState.v1014SupplyChain) "
        "|| createInitialV1014SupplyPersisted(Number(migrated.gameState.turnCounter || 0), Number(migrated.gameState.day || 1));\n"
    )
    return text.replace(MIGRATE_PERSIST_ANCHOR, MIGRATE_PERSIST_ANCHOR + "\n" + patch, 1)


def wire_lab_entries(text: str) -> str:
    if "v1015_orchestrator" in text:
        print("skip LAB entries (present)")
        return text
    if LAB_INSERT_ANCHOR not in text:
        raise SystemExit("LAB suite anchor not found")
    lab = (
        "  { id: 'v1015_orchestrator', label: 'V10.15 National tick orchestrator', tier: 'quick', "
        "section: 'System Regression', severity: 'MAJOR', run: () => runV1015OrchSelfTests() },\n"
        "  { id: 'v1014_supply_chain', label: 'V10.14 Supply chain BOM & bottlenecks', tier: 'quick', "
        "section: 'System Regression', severity: 'MAJOR', run: () => runV1014SupplyChainSelfTests() },\n"
    )
    return text.replace(LAB_INSERT_ANCHOR, lab + LAB_INSERT_ANCHOR, 1)


def load_shard(path: pathlib.Path) -> str:
    if not path.is_file():
        raise SystemExit(f"Missing generated shard: {path} — run scripts/generate-o6k-tranche6-blocks.py first")
    return path.read_text(encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Merge tranche 6 generated shards into canonical TSX")
    parser.add_argument(
        "--target",
        type=pathlib.Path,
        default=V94,
        help="TSX file to patch (default: canonical V9.4). Use a copy for dry verification.",
    )
    args = parser.parse_args()
    target: pathlib.Path = args.target.resolve()

    text = target.read_text(encoding="utf-8")
    before = len(text.splitlines())

    orch = load_shard(ORCH)
    supply = load_shard(SUPPLY)

    # Supply after orchestrator in file order (both splice before 21B; second insert sits closer to anchor).
    text = insert_before(text, ANCHOR, orch, "V1015 national orchestrator (20AV)")
    text = insert_before(text, ANCHOR, supply, "V1014 supply chain BOM (20AV cont.)")

    text = wire_day_boundary_hooks(text)
    text = wire_section6_persistence(text)
    text = wire_lab_entries(text)

    target.write_text(text, encoding="utf-8")
    after = len(text.splitlines())
    delta = after - before
    print(f"target: {target}")
    print(f"lines {before} -> {after} (+{delta})")
    if delta < 20000:
        print(f"WARNING: line delta {delta} < 20000 — check generated shards")


if __name__ == "__main__":
    main()
