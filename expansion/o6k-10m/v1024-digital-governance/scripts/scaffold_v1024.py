#!/usr/bin/env python3
"""Transform v1023 climate adaptation copy into v1024 digital governance + regenerate TS."""
from __future__ import annotations

import pathlib
import re
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]

REPLACEMENTS = [
    ("v1023-climate-adaptation", "v1024-digital-governance"),
    ("V1023_CLAD", "V1024_DGOV"),
    ("V1023Clad", "V1024Dgov"),
    ("v1023Clad", "v1024Dgov"),
    ("v1023_clad", "v1024_dgov"),
    ("climate_adaptation", "digital_governance"),
    ("climate-adaptation", "digital-governance"),
    ("v1023_climate_adaptation", "v1024_digital_governance"),
    ("10.23.climate_adaptation.1", "10.24.digital_governance.1"),
    ("SECTION 20BR", "SECTION 20BT"),
    ("O6K-51", "O6K-54"),
    ("V10.23 CLIMATE ADAPTATION", "V10.24 DIGITAL GOVERNANCE"),
    ("Climate adaptation", "Digital governance"),
    ("climate adaptation", "digital governance"),
    ("scenarioPacks20bd", "aiFidelity20be"),
    ("ScenarioPacks20bd", "AiFidelity20be"),
    ("scenarios-20bd", "ai-fidelity-20be"),
    ("Scenario packs", "AI fidelity"),
    ("scenario packs", "AI fidelity"),
    ("20BD", "20BE"),
    ("packCohesionPressure", "modelGovernancePressure"),
    ("objectiveDriftTurns", "alignmentDriftTurns"),
    ("scenarioPackDelta", "aiFidelityDelta"),
    ("ScenarioPackOverrides", "AiFidelityOverrides"),
    ("hazard-scenarios", "policy-scenarios"),
    ("hazard-registry", "policy-registry"),
    ("hazard_snapshots", "policy_snapshots"),
    ("hazardSnapshots", "policySnapshots"),
    ("HAZARD_SCENARIO", "POLICY_SCENARIO"),
    ("Hazard scenario", "Policy scenario"),
    ("hazard scenario", "policy scenario"),
    ("activeHazardScenarioIds", "activePolicyScenarioIds"),
    ("activeFloodNodeIds", "activePlatformNodeIds"),
    ("hazardBatch", "policyBatch"),
    ("evaluateHazardBatch", "evaluatePolicyBatch"),
    ("listActiveHazardScenarioIds", "listActivePolicyScenarioIds"),
    ("ALL_HAZARD_SCENARIO", "ALL_POLICY_SCENARIO"),
    ("runHazardScenarioRegressionSweep", "runPolicyScenarioRegressionSweep"),
    ("HAZARD_SCENARIO_COUNT", "POLICY_SCENARIO_COUNT"),
    ("meanHeatStress", "meanComplianceStress"),
    ("meanResilience", "meanGovernanceScore"),
    ("aggregateHeatStressIndex", "aggregateComplianceStressIndex"),
    ("aggregateResilienceScore", "aggregateGovernanceScore"),
    ("aggregateHeatStress", "aggregateComplianceStress"),
    ("aggregateResilience", "aggregateGovernance"),
    ("heatStressIndex", "complianceStressIndex"),
    ("resilienceScore", "governanceScore"),
    ("hazardBandFromScore", "governanceBandFromScore"),
    ("drought-buffer-stacks", "data-sovereignty-stacks"),
    ("drought-buffer-stack", "data-sovereignty-stack"),
    ("drought-buffer-bundle", "data-sovereignty-bundle"),
    ("droughtBuffer", "dataSovereignty"),
    ("DroughtBuffer", "DataSovereignty"),
    ("drought_buffer", "data_sovereignty"),
    ("DROUGHT_BUFFER", "DATA_SOVEREIGNTY"),
    ("Drought buffer", "Data sovereignty"),
    ("drought buffer", "data sovereignty"),
    ("flood-defend-nodes", "platform-regulation-nodes"),
    ("flood-defend-node", "platform-regulation-node"),
    ("regional_flood_defend", "regional_platform_regulation"),
    ("flood_defend", "platform_regulation"),
    ("flood_node", "platform_node"),
    ("FLOOD_NODE", "PLATFORM_NODE"),
    ("Flood defend", "Platform regulation"),
    ("flood defend", "platform regulation"),
    ("adaptationChannel", "governanceChannel"),
    ("AdaptationChannel", "GovernanceChannel"),
    ("adaptationPolicyFocus", "governancePolicyFocus"),
    ("climateEnergyHarmonyScore", "governanceAiHarmonyScore"),
    ("droughtBufferDelayTurns", "dataSovereigntyDelayTurns"),
    ("V1023CladHazardBand", "V1024DgovPolicyBand"),
    ("V1023CladHazardSeverityBand", "V1024DgovComplianceBand"),
    ("hazardBand", "governanceBand"),
    ("HazardBand", "GovernanceBand"),
    ("HazardSnapshot", "PolicySnapshot"),
    ("DROUGHT_BUFFER_SHARD_COUNT", "DATA_SOVEREIGNTY_SHARD_COUNT"),
    ("FLOOD_NODE_COUNT", "PLATFORM_NODE_COUNT"),
    ("climateResilienceScore", "digitalGovernanceScore"),
    ("heat/flood/drought", "residency/liability/audit"),
    ("heat/flood drought buffer", "residency/liability data sovereignty"),
    ("climate hazard", "digital policy"),
    ("coolingHeadroom", "auditHeadroom"),
    ("carbonStress", "platformRiskStress"),
    ("cooling load", "compute governance load"),
    ("emergency services staffing", "digital service delivery staffing"),
    ("HEAT STRESS, FLOOD DEFEND & DROUGHT BUFFERS", "COMPLIANCE STRESS, PLATFORM REGULATION & DATA SOVEREIGNTY"),
    ("hazard scenarios, drought-buffer graph, flood-defend nodes, resilience scoring", "policy scenarios, data-sovereignty graph, platform-regulation nodes, governance scoring"),
    ("Hazard scenario matrix, drought-buffer graph, flood-defend nodes", "Policy scenario matrix, data-sovereignty graph, platform-regulation nodes"),
    ("runV1023CladTurn", "runV1024DgovTurn"),
    ("buildV1023CladTurnInputFromGameState", "buildV1024DgovTurnInputFromGameState"),
    ("buildV1023CladTurnInputFromGameStateStub", "buildV1024DgovTurnInputFromGameStateStub"),
    ("sanitizeV1023CladPersisted", "sanitizeV1024DgovPersisted"),
    ("createEmptyV1023CladPersisted", "createEmptyV1024DgovPersisted"),
    ("V1023CladPersisted", "V1024DgovPersisted"),
    ("V1023CladTurnInput", "V1024DgovTurnInput"),
    ("runV1023CladSelfTests", "runV1024DgovSelfTests"),
    ("readV1023CladScenarioPacks20bdBridge", "readV1024DgovAiFidelity20beBridge"),
    ("computeV1023CladScenarioPacks20bdBridge", "computeV1024DgovAiFidelity20beBridge"),
    ("applyV1023CladScenarioPacks20bdScenarioPackOverrides", "applyV1024DgovAiFidelity20beAiFidelityOverrides"),
    ("V1023CladScenarioPacks20bdSlice", "V1024DgovAiFidelity20beSlice"),
    ("gameState.v1023ClimateAdaptation", "gameState.v1024DigitalGovernance"),
    ("v1023ClimateAdaptation", "v1024DigitalGovernance"),
    ("adapter-scenarios-20bd.ts", "adapter-ai-fidelity-20be.ts"),
    ("run-v1023-clad-self-tests.ts", "run-v1024-dgov-self-tests.ts"),
    ("scaffold_v1023.py", "scaffold_v1024.py"),
]


def transform_file(path: pathlib.Path) -> None:
    if path.suffix not in {".ts", ".md", ".py"}:
        return
    if path.name in {"scaffold_v1023.py", "scaffold_v1024.py"}:
        return
    text = path.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    path.write_text(text, encoding="utf-8")


def rename_paths() -> None:
    renames = [
        (ROOT / "engine" / "climate-adaptation-orchestrator.ts", ROOT / "engine" / "digital-governance-orchestrator.ts"),
        (ROOT / "engine" / "climate-adaptation-utils.ts", ROOT / "engine" / "digital-governance-utils.ts"),
        (ROOT / "self-tests" / "run-v1023-clad-self-tests.ts", ROOT / "self-tests" / "run-v1024-dgov-self-tests.ts"),
        (ROOT / "adapters" / "adapter-scenarios-20bd.ts", ROOT / "adapters" / "adapter-ai-fidelity-20be.ts"),
    ]
    if (ROOT / "data-sovereignty-stacks").exists() is False and (ROOT / "drought-buffer-stacks").exists():
        (ROOT / "data-sovereignty-stacks").mkdir(exist_ok=True)
        for p in (ROOT / "drought-buffer-stacks").glob("*.ts"):
            dest = ROOT / "data-sovereignty-stacks" / p.name.replace("buffer-", "sovereignty-")
            p.rename(dest)
        shutil.rmtree(ROOT / "drought-buffer-stacks", ignore_errors=True)
    if (ROOT / "platform-regulation-nodes").exists() is False and (ROOT / "flood-defend-nodes").exists():
        (ROOT / "platform-regulation-nodes").mkdir(exist_ok=True)
        for p in (ROOT / "flood-defend-nodes").glob("*.ts"):
            dest = ROOT / "platform-regulation-nodes" / p.name.replace("flood-node", "platform-node")
            p.rename(dest)
        shutil.rmtree(ROOT / "flood-defend-nodes", ignore_errors=True)
    (ROOT / "data-sovereignty-stacks").mkdir(exist_ok=True)
    (ROOT / "platform-regulation-nodes").mkdir(exist_ok=True)
    gen_hazard = ROOT / "generated" / "hazard-scenarios"
    if gen_hazard.exists():
        (ROOT / "generated" / "policy-scenarios").mkdir(exist_ok=True)
        for p in gen_hazard.glob("*.ts"):
            p.rename(ROOT / "generated" / "policy-scenarios" / p.name)
        shutil.rmtree(gen_hazard, ignore_errors=True)
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
        "export type V1024DgovPolicyBand = 'robust' | 'stable' | 'strained' | 'fragile' | 'critical';",
        "export type V1024DgovPolicyBand = 'trusted' | 'stable' | 'strained' | 'contested' | 'critical';",
    )
    text = re.sub(
        r"export type V1024DgovGovernanceChannel =[\s\S]*?;\n\nexport type V1024DgovGovernanceChannelLegacy =",
        """export type V1024DgovGovernanceChannel =
  | 'data_residency'
  | 'platform_liability'
  | 'algo_audit'
  | 'cross_border_flow'
  | 'child_safety'
  | 'open_banking'
  | 'critical_infra'
  | 'genai_disclosure'
  | 'regional'
  | 'remote';

export type V1024DgovGovernanceChannelLegacy =""",
        text,
        count=1,
    )
    text = text.replace(
        "/** Scenario packs v2 slice (SECTION 20BE). */",
        "/** AI fidelity / model governance slice (SECTION 20BE). */",
    )
    path.write_text(text, encoding="utf-8")


def patch_run_self_tests() -> None:
    path = ROOT / "run-self-tests.ts"
    path.write_text(
        """#!/usr/bin/env node
import { runV1024DgovSelfTests } from './self-tests/run-v1024-dgov-self-tests.ts';

const r = runV1024DgovSelfTests();
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
    text = re.sub(
        r"\| \*\*20BC\*\*[\s\S]*?\| `adapter-v1014-energy-20bc\.ts` \|\n",
        "",
        text,
        count=1,
    )
    text = text.replace(
        "Scenario packs v2 — pack cohesion, objective drift",
        "AI fidelity — model governance pressure, alignment drift",
    )
    text = text.replace(
        "`gs.v1014ScenarioV2` pack cohesion + objective drift",
        "`gs.v1014AiFidelity` / commercialization readiness + model governance slices",
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
        'CHANNELS = ["heat_urban", "flood_coastal", "drought_inland", "fire_interface", "cyclone_north", "heat_rural", "water_stress", "coastal_erosion", "regional", "remote"]',
        'CHANNELS = ["data_residency", "platform_liability", "algo_audit", "cross_border_flow", "child_safety", "open_banking", "critical_infra", "genai_disclosure", "regional", "remote"]',
    )
    text = text.replace("HAZARD_BANDS", "POLICY_BANDS")
    text = text.replace("HAZARD_SCENARIO_COUNT", "POLICY_SCENARIO_COUNT")
    text = text.replace("DATA_SOVEREIGNTY_SHARD_COUNT", "DATA_SOVEREIGNTY_SHARD_COUNT")
    text = text.replace("PLATFORM_NODE_COUNT", "PLATFORM_NODE_COUNT")
    text = text.replace("!== 'severe'", "!== 'contested'")
    text = text.replace("buffer-{mod}.ts", "sovereignty-{mod}.ts")
    text = text.replace("export * from './data-sovereignty-stacks/buffer-", "export * from './data-sovereignty-stacks/sovereignty-")
    text = text.replace('path = BUFFER_DIR / f"buffer-{mod}.ts"', 'path = BUFFER_DIR / f"sovereignty-{mod}.ts"')
    text = text.replace('SCEN_DIR = GEN / "hazard-scenarios"', 'SCEN_DIR = GEN / "policy-scenarios"')
    text = text.replace("Generated hazard scenarios=", "Generated policy scenarios=")
    text = text.replace("drought buffers=", "data sovereignty stacks=")
    text = text.replace("flood defend nodes=", "platform regulation nodes=")
    text = text.replace("heat/flood/drought adaptation matrix", "residency/liability/audit governance matrix")
    text = text.replace("flood-node-{mod}.ts", "platform-node-{mod}.ts")
    text = text.replace("platform_node_{i % PLATFORM_NODE_COUNT:02d}", "platform_node_{i % PLATFORM_NODE_COUNT:02d}")
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
