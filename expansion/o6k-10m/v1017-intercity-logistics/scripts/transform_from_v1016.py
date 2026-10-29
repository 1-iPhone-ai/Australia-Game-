#!/usr/bin/env python3
"""Transform copied v1016 skeleton into v1017 intercity logistics module."""
from __future__ import annotations

import pathlib
import re
import shutil

ROOT = pathlib.Path(__file__).resolve().parents[1]

RENAME_DIRS = [
    ("logistics-hubs", "logistics-hubs"),
    ("corridor-graph", "corridor-graph"),
]

FILE_RENAMES = [
    ("engine/intercity-logistics-orchestrator.ts", "engine/intercity-logistics-orchestrator.ts"),
    ("engine/intercity-logistics-utils.ts", "engine/intercity-logistics-utils.ts"),
    ("self-tests/run-v1017-iclog-self-tests.ts", "self-tests/run-v1017-iclog-self-tests.ts"),
    ("adapters/adapter-v1014-cities-20ak.ts", "adapters/adapter-v1014-cities-20ak.ts"),
    ("adapters/adapter-v1016-resilience-20bg.ts", "adapters/adapter-v1016-resilience-20bg.ts"),
    ("corridor-graph/graph-utils.ts", "corridor-graph/graph-utils.ts"),
]

TEXT_REPLACEMENTS = [
    ("v1017_intercity_logistics", "v1017_intercity_logistics"),
    ("v1017.intercity_logistics", "v1017.intercity_logistics"),
    ("V1017_ICLOG", "V1017_ICLOG"),
    ("V1017Iclog", "V1017Iclog"),
    ("v1017Iclog", "v1017Iclog"),
    ("intercity-logistics", "intercity-logistics"),
    ("intercity_logistics", "intercity_logistics"),
    ("Intercity logistics", "Intercity logistics"),
    ("intercity logistics", "intercity logistics"),
    ("freight route", "freight route"),
    ("Freight route", "Freight route"),
    ("freight_route", "freight_route"),
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
    ("O6K-36", "O6K-36"),
    ("V10.17", "V10.17"),
    ("10.17.", "10.17."),
    ("SECTION 20BI", "SECTION 20BI"),
    ("20BI", "20BI"),
    ("20BG", "20BI"),
    ("20AK", "20AK"),
    ("cities20ak", "cities20ak"),
    ("resilience20bg", "resilience20bg"),
    ("V1017IclogV1014EnergySlice", "V1017IclogV1014CitiesSlice"),
    ("V1017IclogV1014WorkforceSlice", "V1017IclogV1016ResilienceSlice"),
    ("cities intercity", "cities intercity"),
    ("national resilience", "intercity logistics"),
    ("adapter-v1014-cities-20ak", "adapter-v1014-cities-20ak"),
    ("adapter-v1016-resilience-20bg", "adapter-v1016-resilience-20bg"),
    ("run-v1017-iclog-self-tests", "run-v1017-iclog-self-tests"),
    ("runV1017IclogSelfTests", "runV1017IclogSelfTests"),
    ("runV1017IclogTurn", "runV1017IclogTurn"),
    ("buildV1017Iclog", "buildV1017Iclog"),
    ("createEmptyV1017IclogPersisted", "createEmptyV1017IclogPersisted"),
    ("sanitizeV1017IclogPersisted", "sanitizeV1017IclogPersisted"),
    ("computeV1017IclogEnergy20bcBridge", "computeV1017IclogCities20akBridge"),
    ("computeV1017IclogWorkforce20bfBridge", "computeV1017IclogResilience20bgBridge"),
    ("applyV1017IclogEnergy20bcGridOverrides", "applyV1017IclogCities20akLinkOverrides"),
    ("applyV1017IclogWorkforce20bfReadinessOverrides", "applyV1017IclogResilience20bgHubOverrides"),
    ("readV1017IclogEnergy20bcBridge", "readV1017IclogCities20akBridge"),
    ("readV1017IclogWorkforce20bfBridge", "readV1017IclogResilience20bgBridge"),
    ("V1017_ICLOG_HUB_NODE", "V1017_ICLOG_HUB_NODE"),
    ("logistics-hubs/node", "logistics-hubs/hub"),
    ("hub-", "hub-"),
    ("hub_", "hub_"),
    ("route-", "route-"),
    ("corr-", "corr-"),
    ("iclog_", "iclog_"),
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
    for stale in ["logistics-hubs", "corridor-graph"]:
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
            "Use the next free band (canonical merge may assign **20BJ** if **20BI** is taken):",
        )
        integ.write_text(t, encoding="utf-8")

    run_self = ROOT / "run-self-tests.ts"
    run_self.write_text(
        """#!/usr/bin/env node
import { runV1017IclogSelfTests } from './self-tests/run-v1017-iclog-self-tests.ts';

const r = runV1017IclogSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
""",
        encoding="utf-8",
    )

    print("Transform complete")


if __name__ == "__main__":
    main()
