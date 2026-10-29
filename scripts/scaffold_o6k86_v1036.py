#!/usr/bin/env python3
"""Scaffold O6K-86 v1036 information integrity resilience from v1035 cyber template."""
from __future__ import annotations

import pathlib
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = ROOT / "expansion/o6k-10m/v1035-cyber-resilience"
DST = ROOT / "expansion/o6k-10m/v1036-information-integrity-resilience"

REPLACEMENTS = [
    ("v1035-cyber-resilience", "v1036-information-integrity-resilience"),
    ("V1035_CYRES", "V1036_IIRES"),
    ("V1035Cyres", "V1036Iires"),
    ("v1035Cyres", "v1036Iires"),
    ("v1035_cyres", "v1036_iires"),
    ("cyber_resilience", "information_integrity_resilience"),
    ("cyber-resilience", "information-integrity-resilience"),
    ("v1035_cyber_resilience", "v1036_information_integrity_resilience"),
    ("save.meta.v1035.cyber_resilience", "save.meta.v1036.information_integrity_resilience"),
    ("10.35.cyber_resilience.1", "10.36.information_integrity_resilience.1"),
    ("O6K-84", "O6K-86"),
    (
        "V10.35 SOVEREIGN CYBER / NATIONAL DIGITAL OPERATIONS RESILIENCE",
        "V10.36 INFORMATION INTEGRITY / NATIONAL ATTESTATION MESH RESILIENCE",
    ),
    (
        "Sovereign cyber / national digital operations resilience",
        "Information integrity / national attestation mesh resilience",
    ),
    ("Sovereign cyber network resilience", "Information integrity network resilience"),
    ("sovereign cyber network resilience", "information integrity network resilience"),
    ("intrusion-scenarios", "attestation-scenarios"),
    ("intrusion-registry", "attestation-registry"),
    ("intrusion_snapshots", "attestation_snapshots"),
    ("intrusionSnapshots", "attestationSnapshots"),
    ("INTRUSION_SCENARIO", "ATTESTATION_SCENARIO"),
    ("Intrusion incident scenario", "Attestation integrity scenario"),
    ("intrusion incident scenario", "attestation integrity scenario"),
    ("activeIntrusionScenarioIds", "activeAttestationScenarioIds"),
    ("intrusionBatch", "attestationBatch"),
    ("evaluateIntrusionBatch", "evaluateAttestationBatch"),
    ("listActiveIntrusionScenarioIds", "listActiveAttestationScenarioIds"),
    ("ALL_INTRUSION_SCENARIO", "ALL_ATTESTATION_SCENARIO"),
    ("runIntrusionScenarioRegressionSweep", "runAttestationScenarioRegressionSweep"),
    ("INTRUSION_SCENARIO_COUNT", "ATTESTATION_SCENARIO_COUNT"),
    ("meanSovereignDigitalStressExposure", "meanAttestationMeshStressExposure"),
    ("aggregateSovereignDigitalStressExposureIndex", "aggregateAttestationMeshStressExposureIndex"),
    ("aggregateSovereignDigitalStressExposure", "aggregateAttestationMeshStressExposure"),
    ("aggregateCyberResilienceScore", "aggregateInformationIntegrityResilienceScore"),
    ("aggregateCyberResilience", "aggregateInformationIntegrityResilience"),
    ("sovereignDigitalStressExposureIndex", "attestationMeshStressExposureIndex"),
    ("cyberResilienceBandFromScore", "informationIntegrityResilienceBandFromScore"),
    ("cyberResilienceScore", "informationIntegrityResilienceScore"),
    ("cyberResilienceBand", "informationIntegrityResilienceBand"),
    ("CyberResilienceBand", "InformationIntegrityResilienceBand"),
    ("CyberResilienceChannel", "InformationIntegrityResilienceChannel"),
    ("cyberResilienceChannel", "informationIntegrityResilienceChannel"),
    ("cyberResiliencePolicyFocus", "informationIntegrityResiliencePolicyFocus"),
    ("sovereignDigitalNetworkHarmonyScore", "attestationMeshNetworkHarmonyScore"),
    ("IntrusionSnapshot", "AttestationSnapshot"),
    ("nationalCyberResilienceScore", "nationalInformationIntegrityResilienceScore"),
    ("runV1035CyresTurn", "runV1036IiresTurn"),
    ("buildV1035CyresTurnInputFromGameState", "buildV1036IiresTurnInputFromGameState"),
    ("buildV1035CyresTurnInputFromGameStateStub", "buildV1036IiresTurnInputFromGameStateStub"),
    ("sanitizeV1035CyresPersisted", "sanitizeV1036IiresPersisted"),
    ("createEmptyV1035CyresPersisted", "createEmptyV1036IiresPersisted"),
    ("run-v1035-cyres-self-tests.ts", "run-v1036-iires-self-tests.ts"),
    ("v1035CyberResilience", "v1036InformationIntegrityResilience"),
    ("runV1035CyresSelfTests", "runV1036IiresSelfTests"),
    ("runV1035CyresSelfTestsForLab", "runV1036IiresSelfTestsForLab"),
    ("v1035CyresInputHash", "v1036IiresInputHash"),
    ("V1035_CYRES_LAB_SUITE_ID", "V1036_IIRES_LAB_SUITE_ID"),
    ("V1035_CYRES_SCHEMA_VERSION", "V1036_IIRES_SCHEMA_VERSION"),
    ("V1035_CYRES_PERSISTENCE_PATHS", "V1036_IIRES_PERSISTENCE_PATHS"),
    ("id: 'intrusion_", "id: 'attestation_"),
    ("intrusion_000", "attestation_000"),
    ("intrusion_001", "attestation_001"),
    ("intrusion_002", "attestation_002"),
    ("SECTION 20CG", "SECTION 20CI"),
    ("**20CG** (this shard)", "**20CI** (this shard)"),
    ("adapter-cyber-resilience-20cg", "adapter-information-integrity-resilience-20ci"),
    ("criticalInfrastructureResilience20ce", "sovereignCyberResilience20cg"),
    ("Critical infrastructure resilience", "Sovereign cyber resilience"),
    ("critical infrastructure resilience", "sovereign cyber resilience"),
    ("adapter-critical-infrastructure-resilience-20ce.ts", "adapter-cyber-resilience-20cg.ts"),
    (
        "computeV1035CyresCriticalInfrastructureResilience20ceBridge",
        "computeV1036IiresSovereignCyberResilience20cgBridge",
    ),
    (
        "applyV1035CyresCriticalInfrastructureResilience20ceOverrides",
        "applyV1036IiresSovereignCyberResilience20cgOverrides",
    ),
    (
        "readV1035CyresCriticalInfrastructureResilience20ceBridge",
        "readV1036IiresSovereignCyberResilience20cgBridge",
    ),
    (
        "V1035CyresCriticalInfrastructureResilience20ceSlice",
        "V1036IiresSovereignCyberResilience20cgSlice",
    ),
    ("criticalInfrastructureResilienceDelta", "sovereignCyberResilienceDelta"),
    (
        "SOVEREIGN DIGITAL STRESS EXPOSURE, FACILITY ZONE NODES & SEGMENT BUFFERS",
        "ATTESTATION MESH STRESS EXPOSURE, FACILITY ZONE NODES & SEGMENT BUFFERS",
    ),
    ("Generated intrusion incident scenarios=", "Generated attestation integrity scenarios="),
    ("segment-buffer-stacks", "attestation-mesh-stacks"),
    ("segment-buffer-bundle", "attestation-mesh-bundle"),
    ("segmentBuffer", "attestationMesh"),
    ("SegmentBuffer", "AttestationMesh"),
    ("segment_buffer", "attestation_mesh"),
    ("SEGMENT_BUFFER", "ATTESTATION_MESH"),
]


def transform_tree() -> None:
    if DST.exists():
        shutil.rmtree(DST)
    shutil.copytree(SRC, DST, ignore=shutil.ignore_patterns("__pycache__", "scaffold_*.py"))
    renames = [
        (DST / "engine" / "cyber-resilience-orchestrator.ts", DST / "engine" / "information-integrity-resilience-orchestrator.ts"),
        (DST / "engine" / "cyber-resilience-utils.ts", DST / "engine" / "information-integrity-resilience-utils.ts"),
        (DST / "self-tests" / "run-v1035-cyres-self-tests.ts", DST / "self-tests" / "run-v1036-iires-self-tests.ts"),
        (DST / "segment-buffer-stacks", DST / "attestation-mesh-stacks"),
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
        ("intrusion-registry", "attestation-registry"),
        ("segment-buffer", "attestation-mesh"),
    ]:
        for p in list(DST.rglob(f"*{old_name}*")):
            if p.is_file() and old_name in p.name:
                p.rename(p.with_name(p.name.replace(old_name, new_name)))


def main() -> None:
    transform_tree()
    gen = DST / "scripts" / "generate.py"
    if gen.is_file():
        text = gen.read_text(encoding="utf-8")
        text = text.replace("V1035_CYRES", "V1036_IIRES")
        text = text.replace("V1035Cyres", "V1036Iires")
        text = text.replace("intrusion-scenarios", "attestation-scenarios")
        text = text.replace("INTRUSION_SCENARIO", "ATTESTATION_SCENARIO")
        text = text.replace("intrusion-registry", "attestation-registry")
        text = text.replace("intrusion_", "attestation_")
        text = text.replace("cyberResilience", "informationIntegrityResilience")
        text = text.replace("sovereignDigitalStressExposure", "attestationMeshStressExposure")
        text = text.replace("segmentBuffer", "attestationMesh")
        text = text.replace("segment-buffer", "attestation-mesh")
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
