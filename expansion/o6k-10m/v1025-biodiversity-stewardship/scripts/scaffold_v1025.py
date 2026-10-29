#!/usr/bin/env python3
"""Transform v1024 digital governance copy into v1025 biodiversity stewardship + regenerate TS."""
from __future__ import annotations

import pathlib
import re
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]

REPLACEMENTS = [
    ("v1024-digital-governance", "v1025-biodiversity-stewardship"),
    ("V1024_DGOV", "V1025_BIO"),
    ("V1024Dgov", "V1025Bio"),
    ("v1024Dgov", "v1025Bio"),
    ("v1024_dgov", "v1025_bio"),
    ("digital_governance", "biodiversity_stewardship"),
    ("digital-governance", "biodiversity-stewardship"),
    ("v1024_digital_governance", "v1025_biodiversity_stewardship"),
    ("10.24.digital_governance.1", "10.25.biodiversity_stewardship.1"),
    ("SECTION 20BT", "SECTION 20BU"),
    ("O6K-54", "O6K-56"),
    ("V10.24 DIGITAL GOVERNANCE", "V10.25 BIODIVERSITY STEWARDSHIP"),
    ("Digital governance", "Biodiversity stewardship"),
    ("digital governance", "biodiversity stewardship"),
    ("aiFidelity20be", "climateAdaptation20br"),
    ("AiFidelity20be", "ClimateAdaptation20br"),
    ("ai-fidelity-20be", "climate-adaptation-20br"),
    ("AI fidelity", "Climate adaptation"),
    ("ai fidelity", "climate adaptation"),
    ("20BE", "20BR"),
    ("modelGovernancePressure", "heatStressPressure"),
    ("alignmentDriftTurns", "resilienceDriftTurns"),
    ("aiFidelityDelta", "climateAdaptationDelta"),
    ("AiFidelityOverrides", "ClimateAdaptationOverrides"),
    ("policy-scenarios", "recovery-scenarios"),
    ("policy-registry", "recovery-registry"),
    ("policy_snapshots", "recovery_snapshots"),
    ("policySnapshots", "recoverySnapshots"),
    ("POLICY_SCENARIO", "RECOVERY_SCENARIO"),
    ("Policy scenario", "Recovery scenario"),
    ("policy scenario", "recovery scenario"),
    ("activePolicyScenarioIds", "activeRecoveryScenarioIds"),
    ("activePlatformNodeIds", "activeProtectedAreaIds"),
    ("policyBatch", "recoveryBatch"),
    ("evaluatePolicyBatch", "evaluateRecoveryBatch"),
    ("listActivePolicyScenarioIds", "listActiveRecoveryScenarioIds"),
    ("ALL_POLICY_SCENARIO", "ALL_RECOVERY_SCENARIO"),
    ("runPolicyScenarioRegressionSweep", "runRecoveryScenarioRegressionSweep"),
    ("POLICY_SCENARIO_COUNT", "RECOVERY_SCENARIO_COUNT"),
    ("meanComplianceStress", "meanEcosystemStress"),
    ("meanGovernanceScore", "meanStewardshipScore"),
    ("aggregateComplianceStressIndex", "aggregateEcosystemStressIndex"),
    ("aggregateGovernanceScore", "aggregateStewardshipScore"),
    ("aggregateComplianceStress", "aggregateEcosystemStress"),
    ("aggregateGovernance", "aggregateStewardship"),
    ("complianceStressIndex", "ecosystemStressIndex"),
    ("governanceScore", "stewardshipScore"),
    ("governanceBandFromScore", "stewardshipBandFromScore"),
    ("data-sovereignty-stacks", "conservation-offset-stacks"),
    ("data-sovereignty-stack", "conservation-offset-stack"),
    ("data-sovereignty-bundle", "conservation-offset-bundle"),
    ("dataSovereignty", "conservationOffset"),
    ("DataSovereignty", "ConservationOffset"),
    ("data_sovereignty", "conservation_offset"),
    ("DATA_SOVEREIGNTY", "CONSERVATION_OFFSET"),
    ("Data sovereignty", "Conservation offset"),
    ("data sovereignty", "conservation offset"),
    ("platform-regulation-nodes", "protected-area-nodes"),
    ("platform-regulation-node", "protected-area-node"),
    ("regional_platform_regulation", "regional_protected_area"),
    ("platform_regulation", "protected_area"),
    ("platform_node", "protected_area"),
    ("PLATFORM_NODE", "PROTECTED_AREA"),
    ("Platform regulation", "Protected area"),
    ("platform regulation", "protected area"),
    ("governanceChannel", "stewardshipChannel"),
    ("GovernanceChannel", "StewardshipChannel"),
    ("governancePolicyFocus", "stewardshipPolicyFocus"),
    ("governanceAiHarmonyScore", "stewardshipClimateHarmonyScore"),
    ("dataSovereigntyDelayTurns", "conservationOffsetDelayTurns"),
    ("V1024DgovPolicyBand", "V1025BioRecoveryBand"),
    ("V1024DgovComplianceBand", "V1025BioHabitatBand"),
    ("governanceBand", "stewardshipBand"),
    ("GovernanceBand", "StewardshipBand"),
    ("PolicySnapshot", "RecoverySnapshot"),
    ("DATA_SOVEREIGNTY_SHARD_COUNT", "CONSERVATION_OFFSET_SHARD_COUNT"),
    ("PLATFORM_NODE_COUNT", "PROTECTED_AREA_COUNT"),
    ("digitalGovernanceScore", "biodiversityStewardshipScore"),
    ("residency/liability/audit", "species/habitat/offset"),
    ("residency/liability data sovereignty", "species/habitat conservation offset"),
    ("digital policy", "biodiversity recovery"),
    ("auditHeadroom", "habitatHeadroom"),
    ("platformRiskStress", "invasiveRiskStress"),
    ("compute governance load", "grid habitat load"),
    ("digital service delivery staffing", "park ranger & field staffing"),
    (
        "COMPLIANCE STRESS, PLATFORM REGULATION & DATA SOVEREIGNTY",
        "ECOSYSTEM STRESS, PROTECTED AREAS & CONSERVATION OFFSETS",
    ),
    (
        "policy scenarios, data-sovereignty graph, platform-regulation nodes, governance scoring",
        "recovery scenarios, conservation-offset graph, protected-area nodes, stewardship scoring",
    ),
    (
        "Policy scenario matrix, data-sovereignty graph, platform-regulation nodes",
        "Recovery scenario matrix, conservation-offset graph, protected-area nodes",
    ),
    ("runV1024DgovTurn", "runV1025BioTurn"),
    ("buildV1024DgovTurnInputFromGameState", "buildV1025BioTurnInputFromGameState"),
    ("buildV1024DgovTurnInputFromGameStateStub", "buildV1025BioTurnInputFromGameStateStub"),
    ("sanitizeV1024DgovPersisted", "sanitizeV1025BioPersisted"),
    ("createEmptyV1024DgovPersisted", "createEmptyV1025BioPersisted"),
    ("V1024DgovPersisted", "V1025BioPersisted"),
    ("V1024DgovTurnInput", "V1025BioTurnInput"),
    ("runV1024DgovSelfTests", "runV1025BioSelfTests"),
    ("readV1024DgovAiFidelity20beBridge", "readV1025BioClimateAdaptation20brBridge"),
    ("computeV1024DgovAiFidelity20beBridge", "computeV1025BioClimateAdaptation20brBridge"),
    (
        "applyV1024DgovAiFidelity20beAiFidelityOverrides",
        "applyV1025BioClimateAdaptation20brClimateAdaptationOverrides",
    ),
    ("V1024DgovAiFidelity20beSlice", "V1025BioClimateAdaptation20brSlice"),
    ("gameState.v1024DigitalGovernance", "gameState.v1025BiodiversityStewardship"),
    ("v1024DigitalGovernance", "v1025BiodiversityStewardship"),
    ("adapter-ai-fidelity-20be.ts", "adapter-climate-adaptation-20br.ts"),
    ("run-v1024-dgov-self-tests.ts", "run-v1025-bio-self-tests.ts"),
    ("scaffold_v1024.py", "scaffold_v1025.py"),
    ("platform-node", "protected-area"),
    ("sovereignty-", "offset-"),
]


def transform_file(path: pathlib.Path) -> None:
    if path.suffix not in {".ts", ".md", ".py"}:
        return
    if path.name in {"scaffold_v1024.py", "scaffold_v1025.py"}:
        return
    text = path.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    path.write_text(text, encoding="utf-8")


def rename_paths() -> None:
    renames = [
        (
            ROOT / "engine" / "digital-governance-orchestrator.ts",
            ROOT / "engine" / "biodiversity-stewardship-orchestrator.ts",
        ),
        (
            ROOT / "engine" / "digital-governance-utils.ts",
            ROOT / "engine" / "biodiversity-stewardship-utils.ts",
        ),
        (
            ROOT / "self-tests" / "run-v1024-dgov-self-tests.ts",
            ROOT / "self-tests" / "run-v1025-bio-self-tests.ts",
        ),
        (
            ROOT / "adapters" / "adapter-ai-fidelity-20be.ts",
            ROOT / "adapters" / "adapter-climate-adaptation-20br.ts",
        ),
    ]
    if (ROOT / "conservation-offset-stacks").exists() is False and (ROOT / "data-sovereignty-stacks").exists():
        (ROOT / "conservation-offset-stacks").mkdir(exist_ok=True)
        for p in (ROOT / "data-sovereignty-stacks").glob("*.ts"):
            dest = ROOT / "conservation-offset-stacks" / p.name.replace("sovereignty-", "offset-")
            p.rename(dest)
        shutil.rmtree(ROOT / "data-sovereignty-stacks", ignore_errors=True)
    if (ROOT / "protected-area-nodes").exists() is False and (ROOT / "platform-regulation-nodes").exists():
        (ROOT / "protected-area-nodes").mkdir(exist_ok=True)
        for p in (ROOT / "platform-regulation-nodes").glob("*.ts"):
            dest = ROOT / "protected-area-nodes" / p.name.replace("platform-node", "protected-area")
            p.rename(dest)
        shutil.rmtree(ROOT / "platform-regulation-nodes", ignore_errors=True)
    (ROOT / "conservation-offset-stacks").mkdir(exist_ok=True)
    (ROOT / "protected-area-nodes").mkdir(exist_ok=True)
    gen_policy = ROOT / "generated" / "policy-scenarios"
    if gen_policy.exists():
        (ROOT / "generated" / "recovery-scenarios").mkdir(exist_ok=True)
        for p in gen_policy.glob("*.ts"):
            p.rename(ROOT / "generated" / "recovery-scenarios" / p.name)
        shutil.rmtree(gen_policy, ignore_errors=True)
    for src, dst in renames:
        if src.exists():
            dst.parent.mkdir(parents=True, exist_ok=True)
            if dst.exists():
                dst.unlink()
            src.rename(dst)


def patch_types_core() -> None:
    path = ROOT / "types" / "core.ts"
    text = path.read_text(encoding="utf-8")
    text = text.replace(
        "export type V1025BioRecoveryBand = 'robust' | 'stable' | 'strained' | 'fragile' | 'critical';",
        "export type V1025BioRecoveryBand = 'thriving' | 'stable' | 'strained' | 'declining' | 'critical';",
    )
    text = re.sub(
        r"export type V1025BioStewardshipChannel =[\s\S]*?;\n\nexport type V1025BioStewardshipChannelLegacy =",
        """export type V1025BioStewardshipChannel =
  | 'species_recovery'
  | 'habitat_connectivity'
  | 'offset_integrity'
  | 'invasive_pressure'
  | 'fire_regime'
  | 'marine_protected'
  | 'urban_green'
  | 'indigenous_care'
  | 'regional'
  | 'remote';

export type V1025BioStewardshipChannelLegacy =""",
        text,
        count=1,
    )
    text = text.replace(
        "/** AI fidelity / model governance slice (SECTION 20BE). */",
        "/** Climate adaptation / resilience slice (SECTION 20BR — V1023 bridge). */",
    )
    path.write_text(text, encoding="utf-8")


def patch_run_self_tests() -> None:
    path = ROOT / "run-self-tests.ts"
    path.write_text(
        """#!/usr/bin/env node
import { runV1025BioSelfTests } from './self-tests/run-v1025-bio-self-tests.ts';

const r = runV1025BioSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
""",
        encoding="utf-8",
    )


def patch_integration_upstream() -> None:
    path = ROOT / "INTEGRATION.md"
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    text = text.replace(
        "AI fidelity — model governance pressure, alignment drift",
        "Climate adaptation (V1023) — heat stress pressure, resilience drift",
    )
    text = text.replace(
        "`gs.v1014AiFidelity` / commercialization readiness + model governance slices",
        "`gs.v1023ClimateAdaptation` / hazard resilience + drought-buffer slices",
    )
    text = text.replace(
        "Apply **20BE** AI fidelity overrides via `applyV1025BioClimateAdaptation20brClimateAdaptationOverrides` when AI fidelity tick runs",
        "Apply **20BR** climate adaptation overrides via `applyV1025BioClimateAdaptation20brClimateAdaptationOverrides` when climate adaptation tick runs",
    )
    text = text.replace(
        "`adapter-climate-adaptation-20br.ts`",
        "`adapter-climate-adaptation-20br.ts` (V1023 / SECTION 20BR)",
    )
    text = text.replace(
        "national policy scenarios, data-sovereignty graph, platform-regulation nodes, governance scoring",
        "national recovery scenarios, conservation-offset graph, protected-area nodes, stewardship scoring",
    )
    path.write_text(text, encoding="utf-8")


def write_generate_py() -> None:
    src_gen = ROOT / "scripts" / "generate.py"
    if not src_gen.exists():
        raise SystemExit(f"missing {src_gen}")
    text = src_gen.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    text = text.replace(
        'CHANNELS = ["data_residency", "platform_liability", "algo_audit", "cross_border_flow", "child_safety", "open_banking", "critical_infra", "genai_disclosure", "regional", "remote"]',
        'CHANNELS = ["species_recovery", "habitat_connectivity", "offset_integrity", "invasive_pressure", "fire_regime", "marine_protected", "urban_green", "indigenous_care", "regional", "remote"]',
    )
    text = text.replace("POLICY_BANDS", "RECOVERY_BANDS")
    text = text.replace("POLICY_SCENARIO_COUNT", "RECOVERY_SCENARIO_COUNT")
    text = text.replace("!== 'contested'", "!== 'declining'")
    text = text.replace("offset-{mod}.ts", "offset-{mod}.ts")
    text = text.replace(
        "export * from './conservation-offset-stacks/buffer-",
        "export * from './conservation-offset-stacks/offset-",
    )
    text = text.replace('SCEN_DIR = GEN / "policy-scenarios"', 'SCEN_DIR = GEN / "recovery-scenarios"')
    text = text.replace("Generated policy scenarios=", "Generated recovery scenarios=")
    text = text.replace("data sovereignty stacks=", "conservation offset stacks=")
    text = text.replace("platform regulation nodes=", "protected area nodes=")
    text = text.replace(
        "residency/liability/audit governance matrix",
        "species/habitat/offset stewardship matrix",
    )
    text = text.replace("protected-area-{mod}.ts", "protected-area-{mod}.ts")
    (ROOT / "scripts" / "generate.py").write_text(text, encoding="utf-8")


def main() -> None:
    rename_paths()
    write_generate_py()
    for p in ROOT.rglob("*"):
        if p.is_file():
            transform_file(p)
    patch_types_core()
    patch_integration_upstream()
    patch_run_self_tests()
    subprocess.check_call([sys.executable, str(ROOT / "scripts" / "generate.py")], cwd=str(ROOT))


if __name__ == "__main__":
    main()
