#!/usr/bin/env python3
"""Scaffold O6K-79 v1033 supply chain resilience from v1032 telecom template."""
from __future__ import annotations

import pathlib
import re
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = ROOT / "expansion/o6k-10m/v1032-telecom-resilience"
DST = ROOT / "expansion/o6k-10m/v1033-supply-chain-resilience"

REPLACEMENTS = [
    ("v1032-telecom-resilience", "v1033-supply-chain-resilience"),
    ("V1032_TRES", "V1033_SCRES"),
    ("V1032Tres", "V1033Scres"),
    ("v1032Tres", "v1033Scres"),
    ("v1032_tres", "v1033_scres"),
    ("telecom_resilience", "supply_chain_resilience"),
    ("telecom-resilience", "supply-chain-resilience"),
    ("v1032_telecom_resilience", "v1033_supply_chain_resilience"),
    ("v1032_supply_chain_resilience", "v1033_supply_chain_resilience"),
    ("failover_000", "disruption_000"),
    ("failover_001", "disruption_001"),
    ("failover_002", "disruption_002"),
    ("save.meta.v1032.telecom_resilience", "save.meta.v1033.supply_chain_resilience"),
    ("10.32.telecom_resilience.1", "10.33.supply_chain_resilience.1"),
    ("O6K-68", "O6K-79"),
    ("V10.32 TELECOMMUNICATIONS / DIGITAL NETWORK RESILIENCE", "V10.33 SUPPLY CHAIN / LOGISTICS NETWORK RESILIENCE"),
    ("Telecommunications / digital network resilience", "Supply chain / logistics network resilience"),
    ("Telecom network resilience", "Supply chain network resilience"),
    ("telecom network resilience", "supply chain network resilience"),
    ("failover-scenarios", "disruption-scenarios"),
    ("failover-registry", "disruption-registry"),
    ("failover_snapshots", "disruption_snapshots"),
    ("failoverSnapshots", "disruptionSnapshots"),
    ("FAILOVER_SCENARIO", "DISRUPTION_SCENARIO"),
    ("Failover scenario", "Disruption scenario"),
    ("failover scenario", "disruption scenario"),
    ("activeFailoverScenarioIds", "activeDisruptionScenarioIds"),
    ("activeExchangeZoneIds", "activeHubZoneIds"),
    ("failoverBatch", "disruptionBatch"),
    ("evaluateFailoverBatch", "evaluateDisruptionBatch"),
    ("listActiveFailoverScenarioIds", "listActiveDisruptionScenarioIds"),
    ("ALL_FAILOVER_SCENARIO", "ALL_DISRUPTION_SCENARIO"),
    ("runFailoverScenarioRegressionSweep", "runDisruptionScenarioRegressionSweep"),
    ("FAILOVER_SCENARIO_COUNT", "DISRUPTION_SCENARIO_COUNT"),
    ("meanTelecomStressExposure", "meanLogisticsStressExposure"),
    ("aggregateTelecomStressExposureIndex", "aggregateLogisticsStressExposureIndex"),
    ("aggregateTelecomStressExposure", "aggregateLogisticsStressExposure"),
    ("aggregateTelecomResilienceScore", "aggregateSupplyChainResilienceScore"),
    ("aggregateTelecomResilience", "aggregateSupplyChainResilience"),
    ("telecomStressExposureIndex", "logisticsStressExposureIndex"),
    ("telecomResilienceBandFromScore", "supplyChainResilienceBandFromScore"),
    ("telecomResilienceScore", "supplyChainResilienceScore"),
    ("telecomResilienceBand", "supplyChainResilienceBand"),
    ("TelecomResilienceBand", "SupplyChainResilienceBand"),
    ("backbone-buffer-stacks", "corridor-buffer-stacks"),
    ("backbone-buffer-bundle", "corridor-buffer-bundle"),
    ("backboneBuffer", "corridorBuffer"),
    ("BackboneBuffer", "CorridorBuffer"),
    ("backbone_buffer", "corridor_buffer"),
    ("BACKBONE_BUFFER", "CORRIDOR_BUFFER"),
    ("Backbone buffer", "Corridor buffer"),
    ("backbone buffer", "corridor buffer"),
    ("exchange-zone-nodes", "hub-zone-nodes"),
    ("exchange-zone-node", "hub-zone-node"),
    ("regional_exchange_zone", "regional_hub_zone"),
    ("exchange_zone", "hub_zone"),
    ("EXCHANGE_ZONE", "HUB_ZONE"),
    ("Exchange zone", "Hub zone"),
    ("exchange zone", "hub zone"),
    ("exchange-zone", "hub-zone"),
    ("TelecomResilienceChannel", "SupplyChainResilienceChannel"),
    ("telecomResilienceChannel", "supplyChainResilienceChannel"),
    ("telecomResiliencePolicyFocus", "supplyChainResiliencePolicyFocus"),
    ("telecomNetworkHarmonyScore", "logisticsNetworkHarmonyScore"),
    ("backboneBufferDelayTurns", "corridorBufferDelayTurns"),
    ("backboneBufferGraphHash", "corridorBufferGraphHash"),
    ("backboneBufferPressure", "corridorBufferPressure"),
    ("backboneBufferGraphRevision", "corridorBufferGraphRevision"),
    ("regionalBackboneBuffer", "regionalCorridorBuffer"),
    ("backboneBufferIndex", "corridorBufferIndex"),
    ("FailoverSnapshot", "DisruptionSnapshot"),
    ("nationalTelecomResilienceScore", "nationalSupplyChainResilienceScore"),
    ("runV1032TresTurn", "runV1033ScresTurn"),
    ("buildV1032TresTurnInputFromGameState", "buildV1033ScresTurnInputFromGameState"),
    ("buildV1032TresTurnInputFromGameStateStub", "buildV1033ScresTurnInputFromGameStateStub"),
    ("sanitizeV1032TresPersisted", "sanitizeV1033ScresPersisted"),
    ("createEmptyV1032TresPersisted", "createEmptyV1033ScresPersisted"),
    ("run-v1032-tres-self-tests.ts", "run-v1033-scres-self-tests.ts"),
    ("v1032TelecomResilience", "v1033SupplyChainResilience"),
    ("mergeBackboneBufferEdges", "mergeCorridorBufferEdges"),
    ("GENERATED_BACKBONE_BUFFER", "GENERATED_CORRIDOR_BUFFER"),
    ("TELECOM STRESS EXPOSURE, EXCHANGE ZONE NODES & BACKBONE BUFFERS", "LOGISTICS STRESS EXPOSURE, HUB ZONE NODES & CORRIDOR BUFFERS"),
    ("runV1032TresSelfTests", "runV1033ScresSelfTests"),
    ("runV1032TresSelfTestsForLab", "runV1033ScresSelfTestsForLab"),
    ("v1032TresInputHash", "v1033ScresInputHash"),
    ("V1032_TRES_LAB_SUITE_ID", "V1033_SCRES_LAB_SUITE_ID"),
    ("V1032_TRES_SCHEMA_VERSION", "V1033_SCRES_SCHEMA_VERSION"),
    ("V1032_TRES_PERSISTENCE_PATHS", "V1033_SCRES_PERSISTENCE_PATHS"),
    ("id: 'failover_", "id: 'disruption_"),
    ("SECTION 20CB", "SECTION 20CD"),
    ("**20CB** (this shard)", "**20CD** (this shard)"),
    ("adapter-telecom-resilience-20cb", "adapter-supply-chain-resilience-20cd"),
    ("gridResilience20ca", "telecomResilience20cb"),
    ("Grid resilience", "Telecom resilience"),
    ("grid resilience", "telecom resilience"),
    ("adapter-grid-resilience-20ca.ts", "adapter-telecom-resilience-20cb.ts"),
    ("computeV1032TresGridResilience20caBridge", "computeV1033ScresTelecomResilience20cbBridge"),
    ("applyV1032TresGridResilience20caOverrides", "applyV1033ScresTelecomResilience20cbOverrides"),
    ("readV1032TresGridResilience20caBridge", "readV1033ScresTelecomResilience20cbBridge"),
    ("V1032TresGridResilience20caSlice", "V1033ScresTelecomResilience20cbSlice"),
    ("gridResilienceDelta", "telecomResilienceDelta"),
]


def transform_tree() -> None:
    if DST.exists():
        shutil.rmtree(DST)
    shutil.copytree(
        SRC,
        DST,
        ignore=shutil.ignore_patterns("__pycache__", "scaffold_v1032.py"),
    )
    for junk in (
        "generated/outage-registry.ts",
        "generated/grid-buffer-bundle.ts",
        "generated/outage-scenarios",
        "generated/backbone-buffer-bundle.ts",
    ):
        p = DST / junk
        if p.is_file():
            p.unlink()
        elif p.is_dir():
            shutil.rmtree(p, ignore_errors=True)

    renames = [
        (DST / "engine" / "telecom-resilience-orchestrator.ts", DST / "engine" / "supply-chain-resilience-orchestrator.ts"),
        (DST / "engine" / "telecom-resilience-utils.ts", DST / "engine" / "supply-chain-resilience-utils.ts"),
        (DST / "self-tests" / "run-v1032-tres-self-tests.ts", DST / "self-tests" / "run-v1033-scres-self-tests.ts"),
        (DST / "backbone-buffer-stacks", DST / "corridor-buffer-stacks"),
        (DST / "exchange-zone-nodes", DST / "hub-zone-nodes"),
    ]
    for src, dst in renames:
        if src.exists():
            if dst.exists():
                if dst.is_dir():
                    shutil.rmtree(dst)
                else:
                    dst.unlink()
            src.rename(dst)

    for path in list(DST.rglob("*")):
        if path.is_file() and path.suffix in {".ts", ".md", ".py"}:
            text = path.read_text(encoding="utf-8")
            for old, new in REPLACEMENTS:
                text = text.replace(old, new)
            path.write_text(text, encoding="utf-8")

    for old_name, new_name in [("exchange-zone-", "hub-zone-"), ("failover-registry", "disruption-registry")]:
        for p in list(DST.rglob(f"*{old_name}*")):
            if p.is_file() and old_name in p.name:
                p.rename(p.with_name(p.name.replace(old_name, new_name)))


def main() -> None:
    transform_tree()
    gen = DST / "scripts" / "generate.py"
    if gen.is_file():
        subprocess.run([sys.executable, str(gen)], check=True, cwd=str(DST))
    tests = DST / "run-self-tests.ts"
    if tests.is_file():
        subprocess.run(["npx", "tsx", str(tests)], check=True, cwd=str(ROOT))
    ts_loc = sum(
        len(p.read_text(encoding="utf-8").splitlines())
        for p in DST.rglob("*.ts")
        if "/scripts/" not in str(p)
    )
    print(f"scaffolded {DST} ts_loc={ts_loc}")


if __name__ == "__main__":
    main()
