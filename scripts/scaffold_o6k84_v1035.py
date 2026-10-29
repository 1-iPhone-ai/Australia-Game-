#!/usr/bin/env python3
"""Scaffold O6K-84 v1035 sovereign cyber resilience from v1034 critical-infrastructure template."""
from __future__ import annotations

import pathlib
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = ROOT / "expansion/o6k-10m/v1034-critical-infrastructure-resilience"
DST = ROOT / "expansion/o6k-10m/v1035-cyber-resilience"

REPLACEMENTS = [
    ("v1034-critical-infrastructure-resilience", "v1035-cyber-resilience"),
    ("V1034_CIRES", "V1035_CYRES"),
    ("V1034Cires", "V1035Cyres"),
    ("v1034Cires", "v1035Cyres"),
    ("v1034_cires", "v1035_cyres"),
    ("critical_infrastructure_resilience", "cyber_resilience"),
    ("critical-infrastructure-resilience", "cyber-resilience"),
    ("v1034_critical_infrastructure_resilience", "v1035_cyber_resilience"),
    ("save.meta.v1034.critical_infrastructure_resilience", "save.meta.v1035.cyber_resilience"),
    ("10.34.critical_infrastructure_resilience.1", "10.35.cyber_resilience.1"),
    ("O6K-80", "O6K-84"),
    (
        "V10.34 CRITICAL INFRASTRUCTURE / CYBER-PHYSICAL NETWORK RESILIENCE",
        "V10.35 SOVEREIGN CYBER / NATIONAL DIGITAL OPERATIONS RESILIENCE",
    ),
    (
        "Critical infrastructure / cyber-physical network resilience",
        "Sovereign cyber / national digital operations resilience",
    ),
    (
        "Critical infrastructure network resilience",
        "Sovereign cyber network resilience",
    ),
    (
        "critical infrastructure network resilience",
        "sovereign cyber network resilience",
    ),
    ("compromise-scenarios", "intrusion-scenarios"),
    ("compromise-registry", "intrusion-registry"),
    ("compromise_snapshots", "intrusion_snapshots"),
    ("compromiseSnapshots", "intrusionSnapshots"),
    ("COMPROMISE_SCENARIO", "INTRUSION_SCENARIO"),
    ("Compromise incident scenario", "Intrusion incident scenario"),
    ("compromise incident scenario", "intrusion incident scenario"),
    ("activeCompromiseScenarioIds", "activeIntrusionScenarioIds"),
    ("compromiseBatch", "intrusionBatch"),
    ("evaluateCompromiseBatch", "evaluateIntrusionBatch"),
    ("listActiveCompromiseScenarioIds", "listActiveIntrusionScenarioIds"),
    ("ALL_COMPROMISE_SCENARIO", "ALL_INTRUSION_SCENARIO"),
    ("runCompromiseScenarioRegressionSweep", "runIntrusionScenarioRegressionSweep"),
    ("COMPROMISE_SCENARIO_COUNT", "INTRUSION_SCENARIO_COUNT"),
    ("meanCyberPhysicalStressExposure", "meanSovereignDigitalStressExposure"),
    ("aggregateCyberPhysicalStressExposureIndex", "aggregateSovereignDigitalStressExposureIndex"),
    ("aggregateCyberPhysicalStressExposure", "aggregateSovereignDigitalStressExposure"),
    ("aggregateCriticalInfrastructureResilienceScore", "aggregateCyberResilienceScore"),
    ("aggregateCriticalInfrastructureResilience", "aggregateCyberResilience"),
    ("cyberPhysicalStressExposureIndex", "sovereignDigitalStressExposureIndex"),
    ("criticalInfrastructureResilienceBandFromScore", "cyberResilienceBandFromScore"),
    ("criticalInfrastructureResilienceScore", "cyberResilienceScore"),
    ("criticalInfrastructureResilienceBand", "cyberResilienceBand"),
    ("CriticalInfrastructureResilienceBand", "CyberResilienceBand"),
    ("CriticalInfrastructureResilienceChannel", "CyberResilienceChannel"),
    ("criticalInfrastructureResilienceChannel", "cyberResilienceChannel"),
    ("criticalInfrastructureResiliencePolicyFocus", "cyberResiliencePolicyFocus"),
    ("cyberPhysicalNetworkHarmonyScore", "sovereignDigitalNetworkHarmonyScore"),
    ("CompromiseSnapshot", "IntrusionSnapshot"),
    ("nationalCriticalInfrastructureResilienceScore", "nationalCyberResilienceScore"),
    ("runV1034CiresTurn", "runV1035CyresTurn"),
    ("buildV1034CiresTurnInputFromGameState", "buildV1035CyresTurnInputFromGameState"),
    ("buildV1034CiresTurnInputFromGameStateStub", "buildV1035CyresTurnInputFromGameStateStub"),
    ("sanitizeV1034CiresPersisted", "sanitizeV1035CyresPersisted"),
    ("createEmptyV1034CiresPersisted", "createEmptyV1035CyresPersisted"),
    ("run-v1034-cires-self-tests.ts", "run-v1035-cyres-self-tests.ts"),
    ("v1034CriticalInfrastructureResilience", "v1035CyberResilience"),
    ("runV1034CiresSelfTests", "runV1035CyresSelfTests"),
    ("runV1034CiresSelfTestsForLab", "runV1035CyresSelfTestsForLab"),
    ("v1034CiresInputHash", "v1035CyresInputHash"),
    ("V1034_CIRES_LAB_SUITE_ID", "V1035_CYRES_LAB_SUITE_ID"),
    ("V1034_CIRES_SCHEMA_VERSION", "V1035_CYRES_SCHEMA_VERSION"),
    ("V1034_CIRES_PERSISTENCE_PATHS", "V1035_CYRES_PERSISTENCE_PATHS"),
    ("id: 'compromise_", "id: 'intrusion_"),
    ("compromise_000", "intrusion_000"),
    ("compromise_001", "intrusion_001"),
    ("compromise_002", "intrusion_002"),
    ("SECTION 20CE", "SECTION 20CG"),
    ("**20CE** (this shard)", "**20CG** (this shard)"),
    ("adapter-critical-infrastructure-resilience-20ce", "adapter-cyber-resilience-20cg"),
    ("supplyChainResilience20cd", "criticalInfrastructureResilience20ce"),
    ("Supply chain resilience", "Critical infrastructure resilience"),
    ("supply chain resilience", "critical infrastructure resilience"),
    ("adapter-supply-chain-resilience-20cd.ts", "adapter-critical-infrastructure-resilience-20ce.ts"),
    ("computeV1034CiresSupplyChainResilience20cdBridge", "computeV1035CyresCriticalInfrastructureResilience20ceBridge"),
    ("applyV1034CiresSupplyChainResilience20cdOverrides", "applyV1035CyresCriticalInfrastructureResilience20ceOverrides"),
    ("readV1034CiresSupplyChainResilience20cdBridge", "readV1035CyresCriticalInfrastructureResilience20ceBridge"),
    ("V1034CiresSupplyChainResilience20cdSlice", "V1035CyresCriticalInfrastructureResilience20ceSlice"),
    ("supplyChainResilienceDelta", "criticalInfrastructureResilienceDelta"),
    (
        "CYBER-PHYSICAL STRESS EXPOSURE, FACILITY ZONE NODES & SEGMENT BUFFERS",
        "SOVEREIGN DIGITAL STRESS EXPOSURE, FACILITY ZONE NODES & SEGMENT BUFFERS",
    ),
    ("Generated compromise incident scenarios=", "Generated intrusion incident scenarios="),
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
        "generated/compromise-scenarios",
    ):
        p = DST / junk
        if p.is_file():
            p.unlink()
        elif p.is_dir():
            shutil.rmtree(p, ignore_errors=True)

    renames = [
        (
            DST / "engine" / "critical-infrastructure-resilience-orchestrator.ts",
            DST / "engine" / "cyber-resilience-orchestrator.ts",
        ),
        (
            DST / "engine" / "critical-infrastructure-resilience-utils.ts",
            DST / "engine" / "cyber-resilience-utils.ts",
        ),
        (
            DST / "self-tests" / "run-v1034-cires-self-tests.ts",
            DST / "self-tests" / "run-v1035-cyres-self-tests.ts",
        ),
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
        ("compromise-registry", "intrusion-registry"),
    ]:
        for p in list(DST.rglob(f"*{old_name}*")):
            if p.is_file() and old_name in p.name:
                p.rename(p.with_name(p.name.replace(old_name, new_name)))


def main() -> None:
    transform_tree()
    gen = DST / "scripts" / "generate.py"
    if gen.is_file():
        text = gen.read_text(encoding="utf-8")
        text = text.replace("V1034_CIRES", "V1035_CYRES")
        text = text.replace("V1034Cires", "V1035Cyres")
        text = text.replace("compromise-scenarios", "intrusion-scenarios")
        text = text.replace("COMPROMISE_SCENARIO", "INTRUSION_SCENARIO")
        text = text.replace("compromise-registry", "intrusion-registry")
        text = text.replace("compromise_", "intrusion_")
        text = text.replace("criticalInfrastructureResilience", "cyberResilience")
        text = text.replace("cyberPhysicalStressExposure", "sovereignDigitalStressExposure")
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
