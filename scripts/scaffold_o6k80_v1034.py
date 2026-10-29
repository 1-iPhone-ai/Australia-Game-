#!/usr/bin/env python3
"""Scaffold O6K-80 v1034 critical infrastructure resilience from v1033 supply-chain template."""
from __future__ import annotations

import pathlib
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = ROOT / "expansion/o6k-10m/v1033-supply-chain-resilience"
DST = ROOT / "expansion/o6k-10m/v1034-critical-infrastructure-resilience"

REPLACEMENTS = [
    ("v1033-supply-chain-resilience", "v1034-critical-infrastructure-resilience"),
    ("V1033_SCRES", "V1034_CIRES"),
    ("V1033Scres", "V1034Cires"),
    ("v1033Scres", "v1034Cires"),
    ("v1033_scres", "v1034_cires"),
    ("supply_chain_resilience", "critical_infrastructure_resilience"),
    ("supply-chain-resilience", "critical-infrastructure-resilience"),
    ("v1033_supply_chain_resilience", "v1034_critical_infrastructure_resilience"),
    ("save.meta.v1033.supply_chain_resilience", "save.meta.v1034.critical_infrastructure_resilience"),
    ("10.33.supply_chain_resilience.1", "10.34.critical_infrastructure_resilience.1"),
    ("O6K-79", "O6K-80"),
    ("V10.33 SUPPLY CHAIN / LOGISTICS NETWORK RESILIENCE", "V10.34 CRITICAL INFRASTRUCTURE / CYBER-PHYSICAL NETWORK RESILIENCE"),
    ("Supply chain / logistics network resilience", "Critical infrastructure / cyber-physical network resilience"),
    ("Supply chain network resilience", "Critical infrastructure network resilience"),
    ("supply chain network resilience", "critical infrastructure network resilience"),
    ("disruption-scenarios", "compromise-scenarios"),
    ("disruption-registry", "compromise-registry"),
    ("disruption_snapshots", "compromise_snapshots"),
    ("disruptionSnapshots", "compromiseSnapshots"),
    ("DISRUPTION_SCENARIO", "COMPROMISE_SCENARIO"),
    ("Disruption scenario", "Compromise incident scenario"),
    ("disruption scenario", "compromise incident scenario"),
    ("activeDisruptionScenarioIds", "activeCompromiseScenarioIds"),
    ("activeHubZoneIds", "activeFacilityZoneIds"),
    ("disruptionBatch", "compromiseBatch"),
    ("evaluateDisruptionBatch", "evaluateCompromiseBatch"),
    ("listActiveDisruptionScenarioIds", "listActiveCompromiseScenarioIds"),
    ("ALL_DISRUPTION_SCENARIO", "ALL_COMPROMISE_SCENARIO"),
    ("runDisruptionScenarioRegressionSweep", "runCompromiseScenarioRegressionSweep"),
    ("DISRUPTION_SCENARIO_COUNT", "COMPROMISE_SCENARIO_COUNT"),
    ("meanLogisticsStressExposure", "meanCyberPhysicalStressExposure"),
    ("aggregateLogisticsStressExposureIndex", "aggregateCyberPhysicalStressExposureIndex"),
    ("aggregateLogisticsStressExposure", "aggregateCyberPhysicalStressExposure"),
    ("aggregateSupplyChainResilienceScore", "aggregateCriticalInfrastructureResilienceScore"),
    ("aggregateSupplyChainResilience", "aggregateCriticalInfrastructureResilience"),
    ("logisticsStressExposureIndex", "cyberPhysicalStressExposureIndex"),
    ("supplyChainResilienceBandFromScore", "criticalInfrastructureResilienceBandFromScore"),
    ("supplyChainResilienceScore", "criticalInfrastructureResilienceScore"),
    ("supplyChainResilienceBand", "criticalInfrastructureResilienceBand"),
    ("SupplyChainResilienceBand", "CriticalInfrastructureResilienceBand"),
    ("corridor-buffer-stacks", "segment-buffer-stacks"),
    ("corridor-buffer-bundle", "segment-buffer-bundle"),
    ("corridorBuffer", "segmentBuffer"),
    ("CorridorBuffer", "SegmentBuffer"),
    ("corridor_buffer", "segment_buffer"),
    ("CORRIDOR_BUFFER", "SEGMENT_BUFFER"),
    ("Corridor buffer", "Segment buffer"),
    ("corridor buffer", "segment buffer"),
    ("hub-zone-nodes", "facility-zone-nodes"),
    ("hub-zone-node", "facility-zone-node"),
    ("regional_hub_zone", "regional_facility_zone"),
    ("hub_zone", "facility_zone"),
    ("HUB_ZONE", "FACILITY_ZONE"),
    ("Hub zone", "Facility zone"),
    ("hub zone", "facility zone"),
    ("hub-zone", "facility-zone"),
    ("SupplyChainResilienceChannel", "CriticalInfrastructureResilienceChannel"),
    ("supplyChainResilienceChannel", "criticalInfrastructureResilienceChannel"),
    ("supplyChainResiliencePolicyFocus", "criticalInfrastructureResiliencePolicyFocus"),
    ("logisticsNetworkHarmonyScore", "cyberPhysicalNetworkHarmonyScore"),
    ("corridorBufferDelayTurns", "segmentBufferDelayTurns"),
    ("corridorBufferGraphHash", "segmentBufferGraphHash"),
    ("corridorBufferPressure", "segmentBufferPressure"),
    ("corridorBufferGraphRevision", "segmentBufferGraphRevision"),
    ("regionalCorridorBuffer", "regionalSegmentBuffer"),
    ("corridorBufferIndex", "segmentBufferIndex"),
    ("DisruptionSnapshot", "CompromiseSnapshot"),
    ("nationalSupplyChainResilienceScore", "nationalCriticalInfrastructureResilienceScore"),
    ("runV1033ScresTurn", "runV1034CiresTurn"),
    ("buildV1033ScresTurnInputFromGameState", "buildV1034CiresTurnInputFromGameState"),
    ("buildV1033ScresTurnInputFromGameStateStub", "buildV1034CiresTurnInputFromGameStateStub"),
    ("sanitizeV1033ScresPersisted", "sanitizeV1034CiresPersisted"),
    ("createEmptyV1033ScresPersisted", "createEmptyV1034CiresPersisted"),
    ("run-v1033-scres-self-tests.ts", "run-v1034-cires-self-tests.ts"),
    ("v1033SupplyChainResilience", "v1034CriticalInfrastructureResilience"),
    ("mergeCorridorBufferEdges", "mergeSegmentBufferEdges"),
    ("GENERATED_CORRIDOR_BUFFER", "GENERATED_SEGMENT_BUFFER"),
    ("LOGISTICS STRESS EXPOSURE, HUB ZONE NODES & CORRIDOR BUFFERS", "CYBER-PHYSICAL STRESS EXPOSURE, FACILITY ZONE NODES & SEGMENT BUFFERS"),
    ("runV1033ScresSelfTests", "runV1034CiresSelfTests"),
    ("runV1033ScresSelfTestsForLab", "runV1034CiresSelfTestsForLab"),
    ("v1033ScresInputHash", "v1034CiresInputHash"),
    ("V1033_SCRES_LAB_SUITE_ID", "V1034_CIRES_LAB_SUITE_ID"),
    ("V1033_SCRES_SCHEMA_VERSION", "V1034_CIRES_SCHEMA_VERSION"),
    ("V1033_SCRES_PERSISTENCE_PATHS", "V1034_CIRES_PERSISTENCE_PATHS"),
    ("id: 'disruption_", "id: 'compromise_"),
    ("disruption_000", "compromise_000"),
    ("disruption_001", "compromise_001"),
    ("disruption_002", "compromise_002"),
    ("SECTION 20CD", "SECTION 20CE"),
    ("**20CD** (this shard)", "**20CE** (this shard)"),
    ("adapter-supply-chain-resilience-20cd", "adapter-critical-infrastructure-resilience-20ce"),
    ("telecomResilience20cb", "supplyChainResilience20cd"),
    ("Telecom resilience", "Supply chain resilience"),
    ("telecom resilience", "supply chain resilience"),
    ("adapter-telecom-resilience-20cb.ts", "adapter-supply-chain-resilience-20cd.ts"),
    ("computeV1033ScresTelecomResilience20cbBridge", "computeV1034CiresSupplyChainResilience20cdBridge"),
    ("applyV1033ScresTelecomResilience20cbOverrides", "applyV1034CiresSupplyChainResilience20cdOverrides"),
    ("readV1033ScresTelecomResilience20cbBridge", "readV1034CiresSupplyChainResilience20cdBridge"),
    ("V1033ScresTelecomResilience20cbSlice", "V1034CiresSupplyChainResilience20cdSlice"),
    ("telecomResilienceDelta", "supplyChainResilienceDelta"),
    ("v1033_scres", "v1034_cires"),
]


def transform_tree() -> None:
    if DST.exists():
        shutil.rmtree(DST)
    shutil.copytree(SRC, DST, ignore=shutil.ignore_patterns("__pycache__", "scaffold_*.py"))
    for junk in (
        "generated/outage-registry.ts",
        "generated/grid-buffer-bundle.ts",
        "generated/outage-scenarios",
        "generated/backbone-buffer-bundle.ts",
        "generated/backbone-buffer-stacks",
        "generated/grid-buffer-stacks",
        "generated/failover-scenarios",
        "generated/corridor-buffer-stacks",
        "generated/disruption-scenarios",
    ):
        p = DST / junk
        if p.is_file():
            p.unlink()
        elif p.is_dir():
            shutil.rmtree(p, ignore_errors=True)

    renames = [
        (DST / "engine" / "supply-chain-resilience-orchestrator.ts", DST / "engine" / "critical-infrastructure-resilience-orchestrator.ts"),
        (DST / "engine" / "supply-chain-resilience-utils.ts", DST / "engine" / "critical-infrastructure-resilience-utils.ts"),
        (DST / "self-tests" / "run-v1033-scres-self-tests.ts", DST / "self-tests" / "run-v1034-cires-self-tests.ts"),
        (DST / "corridor-buffer-stacks", DST / "segment-buffer-stacks"),
        (DST / "hub-zone-nodes", DST / "facility-zone-nodes"),
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

    for old_name, new_name in [
        ("hub-zone-", "facility-zone-"),
        ("disruption-registry", "compromise-registry"),
        ("corridor-buffer", "segment-buffer"),
    ]:
        for p in list(DST.rglob(f"*{old_name}*")):
            if p.is_file() and old_name in p.name:
                p.rename(p.with_name(p.name.replace(old_name, new_name)))


def main() -> None:
    transform_tree()
    gen = DST / "scripts" / "generate.py"
    if gen.is_file():
        text = gen.read_text(encoding="utf-8")
        text = text.replace("V1033_SCRES", "V1034_CIRES")
        text = text.replace("V1033Scres", "V1034Cires")
        text = text.replace("disruption-scenarios", "compromise-scenarios")
        text = text.replace("DISRUPTION_SCENARIO", "COMPROMISE_SCENARIO")
        text = text.replace("disruption-registry", "compromise-registry")
        text = text.replace("corridor-buffer-stacks", "segment-buffer-stacks")
        text = text.replace("hub-zone-nodes", "facility-zone-nodes")
        text = text.replace("disruption_", "compromise_")
        text = text.replace("corridor_buffer", "segment_buffer")
        text = text.replace("CORRIDOR_BUFFER", "SEGMENT_BUFFER")
        text = text.replace("hub_zone", "facility_zone")
        text = text.replace("supplyChainResilience", "criticalInfrastructureResilience")
        text = text.replace("logisticsStressExposure", "cyberPhysicalStressExposure")
        text = text.replace("corridorBuffer", "segmentBuffer")
        gen.write_text(text, encoding="utf-8")
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
