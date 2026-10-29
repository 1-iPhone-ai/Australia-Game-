#!/usr/bin/env python3
"""Scaffold O6K-88 v1037 public records provenance / chain-of-custody from v1036 iires template."""
from __future__ import annotations

import pathlib
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = ROOT / "expansion/o6k-10m/v1036-information-integrity-resilience"
DST = ROOT / "expansion/o6k-10m/v1037-provenance-chain-resilience"

REPLACEMENTS = [
    ("v1036-information-integrity-resilience", "v1037-provenance-chain-resilience"),
    ("V1036_IIRES", "V1037_PCRS"),
    ("V1036Iires", "V1037Pcres"),
    ("v1036Iires", "v1037Pcres"),
    ("v1036_iires", "v1037_pcres"),
    ("information_integrity_resilience", "provenance_chain_resilience"),
    ("information-integrity-resilience", "provenance-chain-resilience"),
    ("v1036_information_integrity_resilience", "v1037_provenance_chain_resilience"),
    ("v1036_provenance_chain_resilience", "v1037_provenance_chain_resilience"),
    ("save.meta.v1036.information_integrity_resilience", "save.meta.v1037.provenance_chain_resilience"),
    ("10.36.information_integrity_resilience.1", "10.37.provenance_chain_resilience.1"),
    ("O6K-86", "O6K-88"),
    (
        "V10.36 INFORMATION INTEGRITY / NATIONAL ATTESTATION MESH RESILIENCE",
        "V10.37 PUBLIC RECORDS PROVENANCE / CHAIN-OF-CUSTODY RESILIENCE",
    ),
    (
        "Information integrity / national attestation mesh resilience",
        "Public records provenance / chain-of-custody resilience",
    ),
    ("Information integrity network resilience", "Provenance chain network resilience"),
    ("information integrity network resilience", "provenance chain network resilience"),
    ("attestation-scenarios", "custody-scenarios"),
    ("attestation-registry", "custody-registry"),
    ("attestation_snapshots", "custody_snapshots"),
    ("attestationSnapshots", "custodySnapshots"),
    ("ATTESTATION_SCENARIO", "CUSTODY_SCENARIO"),
    ("Attestation integrity scenario", "Chain-of-custody incident scenario"),
    ("attestation integrity scenario", "chain-of-custody incident scenario"),
    ("activeAttestationScenarioIds", "activeCustodyScenarioIds"),
    ("attestationBatch", "custodyBatch"),
    ("evaluateAttestationBatch", "evaluateCustodyBatch"),
    ("listActiveAttestationScenarioIds", "listActiveCustodyScenarioIds"),
    ("ALL_ATTESTATION_SCENARIO", "ALL_CUSTODY_SCENARIO"),
    ("runAttestationScenarioRegressionSweep", "runCustodyScenarioRegressionSweep"),
    ("ATTESTATION_SCENARIO_COUNT", "CUSTODY_SCENARIO_COUNT"),
    ("meanAttestationMeshStressExposure", "meanCustodyChainStressExposure"),
    ("aggregateAttestationMeshStressExposureIndex", "aggregateCustodyChainStressExposureIndex"),
    ("aggregateAttestationMeshStressExposure", "aggregateCustodyChainStressExposure"),
    ("aggregateInformationIntegrityResilienceScore", "aggregateProvenanceChainResilienceScore"),
    ("aggregateInformationIntegrityResilience", "aggregateProvenanceChainResilience"),
    ("attestationMeshStressExposureIndex", "custodyChainStressExposureIndex"),
    ("informationIntegrityResilienceBandFromScore", "provenanceChainResilienceBandFromScore"),
    ("informationIntegrityResilienceScore", "provenanceChainResilienceScore"),
    ("informationIntegrityResilienceBand", "provenanceChainResilienceBand"),
    ("InformationIntegrityResilienceBand", "ProvenanceChainResilienceBand"),
    ("InformationIntegrityResilienceChannel", "ProvenanceChainResilienceChannel"),
    ("informationIntegrityResilienceChannel", "provenanceChainResilienceChannel"),
    ("informationIntegrityResiliencePolicyFocus", "provenanceChainResiliencePolicyFocus"),
    ("attestationMeshNetworkHarmonyScore", "custodyChainNetworkHarmonyScore"),
    ("AttestationSnapshot", "CustodySnapshot"),
    ("nationalInformationIntegrityResilienceScore", "nationalProvenanceChainResilienceScore"),
    ("runV1036IiresTurn", "runV1037PcresTurn"),
    ("buildV1036IiresTurnInputFromGameState", "buildV1037PcresTurnInputFromGameState"),
    ("buildV1036IiresTurnInputFromGameStateStub", "buildV1037PcresTurnInputFromGameStateStub"),
    ("sanitizeV1036IiresPersisted", "sanitizeV1037PcresPersisted"),
    ("createEmptyV1036IiresPersisted", "createEmptyV1037PcresPersisted"),
    ("run-v1036-iires-self-tests.ts", "run-v1037-pcres-self-tests.ts"),
    ("v1036InformationIntegrityResilience", "v1037ProvenanceChainResilience"),
    ("runV1036IiresSelfTests", "runV1037PcresSelfTests"),
    ("runV1036IiresSelfTestsForLab", "runV1037PcresSelfTestsForLab"),
    ("v1036IiresInputHash", "v1037PcresInputHash"),
    ("V1036_IIRES_LAB_SUITE_ID", "V1037_PCRS_LAB_SUITE_ID"),
    ("V1036_IIRES_SCHEMA_VERSION", "V1037_PCRS_SCHEMA_VERSION"),
    ("V1036_IIRES_PERSISTENCE_PATHS", "V1037_PCRS_PERSISTENCE_PATHS"),
    ("id: 'attestation_", "id: 'custody_"),
    ("attestation_000", "custody_000"),
    ("attestation_001", "custody_001"),
    ("attestation_002", "custody_002"),
    ("SECTION 20CI", "SECTION 20CK"),
    ("**20CI** (this shard)", "**20CK** (this shard)"),
    ("adapter-information-integrity-resilience-20ci", "adapter-provenance-chain-resilience-20ck"),
    ("sovereignCyberResilience20cg", "informationIntegrityResilience20ci"),
    ("Sovereign cyber resilience", "Information integrity resilience"),
    ("sovereign cyber resilience", "information integrity resilience"),
    ("adapter-cyber-resilience-20cg.ts", "adapter-information-integrity-resilience-20ci.ts"),
    (
        "computeV1036IiresSovereignCyberResilience20cgBridge",
        "computeV1037PcresInformationIntegrityResilience20ciBridge",
    ),
    (
        "applyV1036IiresSovereignCyberResilience20cgOverrides",
        "applyV1037PcresInformationIntegrityResilience20ciOverrides",
    ),
    (
        "readV1036IiresSovereignCyberResilience20cgBridge",
        "readV1037PcresInformationIntegrityResilience20ciBridge",
    ),
    (
        "V1036IiresSovereignCyberResilience20cgSlice",
        "V1037PcresInformationIntegrityResilience20ciSlice",
    ),
    ("sovereignCyberResilienceDelta", "informationIntegrityResilienceDelta"),
    (
        "ATTESTATION MESH STRESS EXPOSURE, FACILITY ZONE NODES & SEGMENT BUFFERS",
        "CUSTODY CHAIN STRESS EXPOSURE, FACILITY ZONE NODES & SEGMENT BUFFERS",
    ),
    ("Generated attestation integrity scenarios=", "Generated chain-of-custody scenarios="),
    ("attestation-mesh-stacks", "custody-chain-mesh-stacks"),
    ("attestation-mesh-bundle", "custody-chain-mesh-bundle"),
    ("attestationMesh", "custodyChainMesh"),
    ("AttestationMesh", "CustodyChainMesh"),
    ("attestation_mesh", "custody_chain_mesh"),
    ("ATTESTATION_MESH", "CUSTODY_CHAIN_MESH"),
]


def transform_tree() -> None:
    if DST.exists():
        shutil.rmtree(DST)
    shutil.copytree(SRC, DST, ignore=shutil.ignore_patterns("__pycache__", "scaffold_*.py"))
    renames = [
        (
            DST / "engine" / "information-integrity-resilience-orchestrator.ts",
            DST / "engine" / "provenance-chain-resilience-orchestrator.ts",
        ),
        (
            DST / "engine" / "information-integrity-resilience-utils.ts",
            DST / "engine" / "provenance-chain-resilience-utils.ts",
        ),
        (
            DST / "self-tests" / "run-v1036-iires-self-tests.ts",
            DST / "self-tests" / "run-v1037-pcres-self-tests.ts",
        ),
        (DST / "attestation-mesh-stacks", DST / "custody-chain-mesh-stacks"),
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
        ("attestation-registry", "custody-registry"),
        ("attestation-mesh", "custody-chain-mesh"),
    ]:
        for p in list(DST.rglob(f"*{old_name}*")):
            if p.is_file() and old_name in p.name:
                p.rename(p.with_name(p.name.replace(old_name, new_name)))


def main() -> None:
    transform_tree()
    gen = DST / "scripts" / "generate.py"
    if gen.is_file():
        text = gen.read_text(encoding="utf-8")
        text = text.replace("V1036_IIRES", "V1037_PCRS")
        text = text.replace("V1036Iires", "V1037Pcres")
        text = text.replace("attestation-scenarios", "custody-scenarios")
        text = text.replace("ATTESTATION_SCENARIO", "CUSTODY_SCENARIO")
        text = text.replace("attestation-registry", "custody-registry")
        text = text.replace("attestation_", "custody_")
        text = text.replace("informationIntegrityResilience", "provenanceChainResilience")
        text = text.replace("attestationMeshStressExposure", "custodyChainStressExposure")
        text = text.replace("attestationMesh", "custodyChainMesh")
        text = text.replace("attestation-mesh", "custody-chain-mesh")
        gen.write_text(text, encoding="utf-8")
        subprocess.run([sys.executable, str(gen)], check=True, cwd=str(DST))
    for stale in (
        "attestation-mesh-stacks",
        "attestation-scenarios",
        "intrusion-scenarios",
        "segment-buffer-stacks",
    ):
        stale_dir = DST / "generated" / stale
        if stale_dir.is_dir():
            shutil.rmtree(stale_dir)
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
