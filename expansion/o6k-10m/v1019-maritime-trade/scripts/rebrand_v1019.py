#!/usr/bin/env python3
"""Rebrand copied v1017 tree to V1019 maritime trade (O6K-41)."""
from __future__ import annotations

import pathlib
import shutil

ROOT = pathlib.Path(__file__).resolve().parents[1]

REPLACEMENTS: list[tuple[str, str]] = [
    ("v1017-intercity-logistics", "v1019-maritime-trade"),
    ("V1017_ICLOG_ROUTE_SCENARIO", "V1019_MTRD_LANE_SCENARIO"),
    ("V1017_ICLOG_CORRIDOR_SHARD", "V1019_MTRD_LANE_GRAPH_SHARD"),
    ("V1017_ICLOG_GENERATED_CORRIDOR_EDGES", "V1019_MTRD_GENERATED_LANE_GRAPH_EDGES"),
    ("V1017_ICLOG_corridorGraphHash", "V1019_MTRD_laneGraphHash"),
    ("V1017_ICLOG_corridorPressure", "V1019_MTRD_lanePressure"),
    ("V1017_ICLOG_mergeCorridorEdges", "V1019_MTRD_mergeLaneGraphEdges"),
    ("V1017_ICLOG_ALL_ROUTE_SCENARIO_IDS", "V1019_MTRD_ALL_LANE_SCENARIO_IDS"),
    ("V1019_MTRD_ALL_LANE_SCENARIO_IDS", "V1019_MTRD_ALL_LANE_SCENARIO_IDS"),
    ("V1017_ICLOG_evaluateSupplyRouteBatch", "V1019_MTRD_evaluateShippingLaneBatch"),
    ("V1017_ICLOG_listActiveRouteScenarioIds", "V1019_MTRD_listActiveLaneScenarioIds"),
    ("V1017_ICLOG_runRouteScenarioRegressionSweep", "V1019_MTRD_runLaneScenarioRegressionSweep"),
    ("freight-route-registry", "shipping-lane-registry"),
    ("freight-route-scenarios", "shipping-lane-scenarios"),
    ("corridor-graph-bundle", "lane-graph-bundle"),
    ("corridor-graph/corr", "lane-graph/lane"),
    ("corridor-graph", "lane-graph"),
    ("V1017_ICLOG_HUB_NODE", "V1019_MTRD_PORT_NODE"),
    ("logistics-hubs", "maritime-ports"),
    ("hub-nodes", "maritime-ports"),
    ("V1017_ICLOG_hubFromScore", "V1019_MTRD_portFromScore"),
    ("V1017_ICLOG_routeBandRank", "V1019_MTRD_laneBandRank"),
    ("V1017_ICLOG_", "V1019_MTRD_"),
    ("V1017Iclog", "V1019Mtrd"),
    ("v1017Iclog", "v1019Mtrd"),
    ("v1017_intercity_logistics", "v1019_maritime_trade"),
    ("intercity-logistics-orchestrator", "maritime-trade-orchestrator"),
    ("intercity-logistics-utils", "maritime-trade-utils"),
    ("run-v1017-iclog-self-tests", "run-v1019-mtrd-self-tests"),
    ("10.17.intercity_logistics", "10.19.maritime_trade"),
    ("save.meta.v1017.intercity_logistics", "save.meta.v1019.maritime_trade"),
    ("intercity_logistics", "maritime_trade"),
    ("intercity logistics", "maritime trade"),
    ("Intercity logistics", "Maritime trade"),
    ("freight route", "shipping lane"),
    ("Freight route", "Shipping lane"),
    ("freight_route", "shipping_lane"),
    ("route_", "lane_"),
    ("route-", "lane-"),
    ("SupplyRoute", "ShippingLane"),
    ("supplyRoute", "shippingLane"),
    ("O6K-36", "O6K-41"),
    ("V10.17", "V10.19"),
    ("SECTION 20BI", "SECTION 20BM"),
    ("20BI", "20BM"),
    ("iclog_", "mtrd_"),
    ("Iclog", "Mtrd"),
    ("hubPolicyFocus", "portPolicyFocus"),
    ("activeHubNodeIds", "activePortNodeIds"),
    ("activeRouteScenarioIds", "activeLaneScenarioIds"),
    ("aggregateHubScore", "aggregatePortScore"),
    ("nationalResilienceScore", "nationalMaritimeScore"),
    ("regionalHub", "regionalPort"),
    ("compositeHub", "compositePort"),
    ("hubScore", "portScore"),
    ("hubBand", "portBand"),
    ("HubBand", "PortBand"),
    ("hub node", "port node"),
    ("Hub node", "Port node"),
]


def transform_text(text: str) -> str:
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    return text


def main() -> None:
    hubs = ROOT / "logistics-hubs"
    ports = ROOT / "maritime-ports"
    if hubs.is_dir() and not ports.is_dir():
        hubs.rename(ports)

    cg = ROOT / "corridor-graph"
    if cg.is_dir():
        lg = ROOT / "lane-graph"
        if lg.is_dir():
            shutil.rmtree(lg)
        cg.rename(lg)
        for p in lg.glob("corr-*.ts"):
            p.rename(p.with_name(p.name.replace("corr-", "lane-")))

    for path in list(ROOT.rglob("*")):
        if path.is_dir() or "rebrand_v1019" in str(path):
            continue
        if path.suffix not in {".ts", ".md", ".py"}:
            continue
        raw = path.read_text(encoding="utf-8")
        new = transform_text(raw)
        if new != raw:
            path.write_text(new, encoding="utf-8")

    renames = [
        (ROOT / "engine" / "intercity-logistics-orchestrator.ts", ROOT / "engine" / "maritime-trade-orchestrator.ts"),
        (ROOT / "engine" / "intercity-logistics-utils.ts", ROOT / "engine" / "maritime-trade-utils.ts"),
        (ROOT / "self-tests" / "run-v1017-iclog-self-tests.ts", ROOT / "self-tests" / "run-v1019-mtrd-self-tests.ts"),
    ]
    for src, dst in renames:
        if src.is_file():
            dst.parent.mkdir(parents=True, exist_ok=True)
            if dst.is_file():
                dst.unlink()
            src.rename(dst)

    for dead in [
        ROOT / "adapters" / "adapter-v1014-cities-20ak.ts",
        ROOT / "adapters" / "adapter-v1016-resilience-20bg.ts",
        ROOT / "adapters" / "adapter-v1014-supply-20bb.ts",
    ]:
        if dead.is_file():
            dead.unlink()

    print("Rebrand complete:", ROOT)


if __name__ == "__main__":
    main()
