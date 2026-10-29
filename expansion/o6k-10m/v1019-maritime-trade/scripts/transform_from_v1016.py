#!/usr/bin/env python3
"""Transform copied v1016 skeleton into v1017 maritime trade module."""
from __future__ import annotations

import pathlib
import re
import shutil

ROOT = pathlib.Path(__file__).resolve().parents[1]

RENAME_DIRS = [
    ("maritime-ports", "maritime-ports"),
    ("lane-graph", "lane-graph"),
]

FILE_RENAMES = [
    ("engine/maritime-trade-orchestrator.ts", "engine/maritime-trade-orchestrator.ts"),
    ("engine/maritime-trade-utils.ts", "engine/maritime-trade-utils.ts"),
    ("self-tests/run-v1019-mtrd-self-tests.ts", "self-tests/run-v1019-mtrd-self-tests.ts"),
    ("adapters/adapter-v1014-cities-20ak.ts", "adapters/adapter-v1014-cities-20ak.ts"),
    ("adapters/adapter-v1016-resilience-20bg.ts", "adapters/adapter-v1016-resilience-20bg.ts"),
    ("lane-graph/graph-utils.ts", "lane-graph/graph-utils.ts"),
]

TEXT_REPLACEMENTS = [
    ("v1019_maritime_trade", "v1019_maritime_trade"),
    ("v1017.maritime_trade", "v1017.maritime_trade"),
    ("V1017_ICLOG", "V1017_ICLOG"),
    ("V1019Mtrd", "V1019Mtrd"),
    ("v1019Mtrd", "v1019Mtrd"),
    ("intercity-logistics", "intercity-logistics"),
    ("maritime_trade", "maritime_trade"),
    ("Maritime trade", "Maritime trade"),
    ("maritime trade", "maritime trade"),
    ("shipping lane", "shipping lane"),
    ("Shipping lane", "Shipping lane"),
    ("shipping_lane", "shipping_lane"),
    ("freight-route", "freight-route"),
    ("ROUTE", "ROUTE"),
    ("Route", "Route"),
    ("route", "route"),
    ("HUB", "HUB"),
    ("Hub", "Hub"),
    ("hub", "hub"),
    ("CORRIDOR", "CORRIDOR"),
    ("Corridor", "Corridor"),
    ("corridor", "corridor"),
    ("O6K-41", "O6K-41"),
    ("V10.19", "V10.19"),
    ("10.17.", "10.17."),
    ("SECTION 20BM", "SECTION 20BM"),
    ("20BM", "20BM"),
    ("20BG", "20BM"),
    ("20AK", "20AK"),
    ("cities20ak", "cities20ak"),
    ("resilience20bg", "resilience20bg"),
    ("V1019MtrdV1014EnergySlice", "V1019MtrdV1014CitiesSlice"),
    ("V1019MtrdV1014WorkforceSlice", "V1019MtrdV1016ResilienceSlice"),
    ("cities intercity", "cities intercity"),
    ("national resilience", "maritime trade"),
    ("adapter-v1014-cities-20ak", "adapter-v1014-cities-20ak"),
    ("adapter-v1016-resilience-20bg", "adapter-v1016-resilience-20bg"),
    ("run-v1019-mtrd-self-tests", "run-v1019-mtrd-self-tests"),
    ("runV1019MtrdSelfTests", "runV1019MtrdSelfTests"),
    ("runV1019MtrdTurn", "runV1019MtrdTurn"),
    ("buildV1019Mtrd", "buildV1019Mtrd"),
    ("createEmptyV1019MtrdPersisted", "createEmptyV1019MtrdPersisted"),
    ("sanitizeV1019MtrdPersisted", "sanitizeV1019MtrdPersisted"),
    ("computeV1019MtrdEnergy20bcBridge", "computeV1019MtrdCities20akBridge"),
    ("computeV1019MtrdWorkforce20bfBridge", "computeV1019MtrdResilience20bgBridge"),
    ("applyV1019MtrdEnergy20bcGridOverrides", "applyV1019MtrdCities20akLinkOverrides"),
    ("applyV1019MtrdWorkforce20bfReadinessOverrides", "applyV1019MtrdResilience20bgHubOverrides"),
    ("readV1019MtrdEnergy20bcBridge", "readV1019MtrdCities20akBridge"),
    ("readV1019MtrdWorkforce20bfBridge", "readV1019MtrdResilience20bgBridge"),
    ("V1019_MTRD_PORT_NODE", "V1019_MTRD_PORT_NODE"),
    ("maritime-ports/node", "maritime-ports/hub"),
    ("hub-", "hub-"),
    ("hub_", "hub_"),
    ("lane-", "lane-"),
    ("corr-", "corr-"),
    ("mtrd_", "mtrd_"),
    ("cg_", "cg_"),
]


def apply_text(s: str) -> str:
    for old, new in TEXT_REPLACEMENTS:
        s = s.replace(old, new)
    return s


def main() -> None:
    for old, new in RENAME_DIRS:
        src = ROOT / old
        dst = ROOT / new
        if src.exists() and not dst.exists():
            shutil.move(str(src), str(dst))
        elif src.exists() and dst.exists():
            shutil.rmtree(dst)
            shutil.move(str(src), str(dst))

    for old, new in FILE_RENAMES:
        src = ROOT / old
        dst = ROOT / new
        if src.exists():
            dst.parent.mkdir(parents=True, exist_ok=True)
            if dst.exists():
                dst.unlink()
            shutil.move(str(src), str(dst))

    # Remove stale dirs
    for stale in ["maritime-ports", "lane-graph"]:
        p = ROOT / stale
        if p.exists() and not any(p.iterdir()):
            p.rmdir()

    for path in ROOT.rglob("*"):
        if path.is_dir() or "hub_modules" in str(path):
            continue
        if path.suffix in {".ts", ".md", ".py"} and "generated" not in str(path):
            text = path.read_text(encoding="utf-8")
            path.write_text(apply_text(text), encoding="utf-8")

    # Fix INTEGRATION band note
    integ = ROOT / "INTEGRATION.md"
    t = integ.read_text(encoding="utf-8")
    if "20BJ" not in t:
        t = t.replace(
            "Use the next free band:",
            "Use the next free band (canonical merge may assign **20BJ** if **20BM** is taken):",
        )
        integ.write_text(t, encoding="utf-8")

    run_self = ROOT / "run-self-tests.ts"
    run_self.write_text(
        """#!/usr/bin/env node
import { runV1019MtrdSelfTests } from './self-tests/run-v1019-mtrd-self-tests.ts';

const r = runV1019MtrdSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
""",
        encoding="utf-8",
    )

    print("Transform complete")


if __name__ == "__main__":
    main()
