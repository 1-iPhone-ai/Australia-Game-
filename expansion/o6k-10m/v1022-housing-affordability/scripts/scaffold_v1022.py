#!/usr/bin/env python3
"""Transform v1021 intermodal freight copy into v1022 housing affordability + regenerate TS."""
from __future__ import annotations

import pathlib
import re
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
V1021_GEN = ROOT.parent / "v1021-intermodal-freight" / "scripts" / "generate.py"

REPLACEMENTS = [
    ("v1021-intermodal-freight", "v1022-housing-affordability"),
    ("V1021_IMFD", "V1022_HAFF"),
    ("V1021Imfd", "V1022Haff"),
    ("v1021Imfd", "v1022Haff"),
    ("v1021_imfd", "v1022_haff"),
    ("intermodal_freight", "housing_affordability"),
    ("intermodal-freight", "housing-affordability"),
    ("v1021_intermodal_freight", "v1022_housing_affordability"),
    ("10.21.intermodal_freight.1", "10.22.housing_affordability.1"),
    ("SECTION 20BO", "SECTION 20BQ"),
    ("O6K-45", "O6K-49"),
    ("V10.21 INTERMODAL FREIGHT", "V10.22 HOUSING AFFORDABILITY"),
    ("Intermodal freight", "Housing affordability"),
    ("intermodal freight", "housing affordability"),
    ("maritime20bn", "publicServices20az"),
    ("iclog20bk", "fiscalFederalism20bj"),
    ("Maritime20bn", "PublicServices20az"),
    ("Iclog20bk", "FiscalFederalism20bj"),
    ("20BN", "20AZ"),
    ("20BK", "20BJ"),
    ("maritime-20bn", "public-services-20az"),
    ("iclog-20bk", "fiscal-20bj"),
    ("v1021IntermodalFreight", "v1022HousingAffordability"),
    ("handoff-stack-bundle", "supply-pipeline-bundle"),
    ("handoff-stacks", "supply-pipeline-stacks"),
    ("handoff-stack", "supply-pipeline-stack"),
    ("handoffStack", "supplyPipeline"),
    ("HandoffStack", "SupplyPipeline"),
    ("handoff_stack", "supply_pipeline"),
    ("HANDOFF_STACK", "SUPPLY_PIPELINE"),
    ("Handoff stack", "Supply pipeline"),
    ("handoff stack", "supply pipeline"),
    ("dwell-hubs", "zoning-friction-nodes"),
    ("dwell-hub", "zoning-friction-node"),
    ("dwell_hub", "zoning_node"),
    ("Dwell hub", "Zoning friction node"),
    ("dwell hub", "zoning friction node"),
    ("DWELL_HUB", "ZONING_NODE"),
    ("corridor-scenarios", "stress-scenarios"),
    ("corridor-registry", "stress-registry"),
    ("corridor_snapshots", "stress_snapshots"),
    ("corridorSnapshots", "stressSnapshots"),
    ("CORRIDOR_SCENARIO", "STRESS_SCENARIO"),
    ("corridor_", "stress_"),
    ("Corridor scenario", "Stress scenario"),
    ("corridor scenario", "stress scenario"),
    ("activeCorridorScenarioIds", "activeStressScenarioIds"),
    ("activeDwellHubNodeIds", "activeZoningNodeIds"),
    ("corridorBatch", "stressBatch"),
    ("evaluateCorridorBatch", "evaluateStressBatch"),
    ("listActiveCorridorScenarioIds", "listActiveStressScenarioIds"),
    ("ALL_CORRIDOR_SCENARIO", "ALL_STRESS_SCENARIO"),
    ("runCorridorScenarioRegressionSweep", "runStressScenarioRegressionSweep"),
    ("meanDwellPenalty", "meanRentStress"),
    ("meanCapacity", "meanAffordability"),
    ("aggregateDwellPenaltyIndex", "aggregateRentStressIndex"),
    ("aggregateCapacityScore", "aggregateAffordabilityScore"),
    ("aggregateDwellPenalty", "aggregateRentStress"),
    ("aggregateCapacity", "aggregateAffordability"),
    ("dwellPenaltyIndex", "rentStressIndex"),
    ("corridorCapacityScore", "affordabilityScore"),
    ("handoffFromScore", "tenureBandFromScore"),
    ("handoffBand", "tenureBand"),
    ("handoffDelayTurns", "supplyPipelineDelayTurns"),
    ("DwellBand", "StressBand"),
    ("dwellBand", "stressBand"),
    ("CorridorSnapshot", "StressSnapshot"),
    ("HandoffStackEdge", "SupplyPipelineEdge"),
    ("freightMode", "housingTenure"),
    ("FreightMode", "HousingTenure"),
    ("primaryMode", "primaryTenure"),
    ("fromMode", "fromTenure"),
    ("toMode", "toTenure"),
    ("hubId", "nodeId"),
    ("intermodalResilienceScore", "housingFiscalHarmonyScore"),
    ("corridorPolicyFocus", "housingPolicyFocus"),
    ("freightHeadroom", "constructionHeadroom"),
    ("regional_dwell_hub", "regional_zoning_friction"),
    ("regionalHandoff", "regionalSupplyPipeline"),
    ("handoffStackGraph", "supplyPipelineGraph"),
    ("handoffStackGraphRevision", "supplyPipelineGraphRevision"),
    ("handoffStackPressure", "supplyPipelinePressure"),
    ("handoffStackIndex", "supplyPipelineIndex"),
    ("handoffDelta", "serviceQueueDelta"),
    ("handoffReadiness", "serviceDeliveryReadiness"),
    ("berthUtilizationScore", "clinicCapacityScore"),
    ("craneAutomationCoverage", "digitalServiceCoverage"),
    ("iclogBackpressure", "transferBackpressure"),
    ("corridorLoadFactor", "grantStackLoad"),
    ("dwellBacklogTurns", "zoningBacklogTurns"),
    ("labTransferDelta", "fiscalTransferDelta"),
    ("mergeHandoffStackEdges", "mergeSupplyPipelineEdges"),
    ("GENERATED_HANDOFF_STACK", "GENERATED_SUPPLY_PIPELINE"),
    ("handoffStackGraphHash", "supplyPipelineGraphHash"),
    ("HandoffOverrides", "ServiceOverrides"),
    ("LabTransferOverrides", "ZoningOverrides"),
    ("ComplianceBand", "TenureBand"),
    ("V1022HaffTenureBand", "V1022HaffTenureBand"),
    ("portThroughputReadiness", "serviceQueueRelief"),
    ("maritimeDelta", "publicServicesDelta"),
    ("intermodal corridor", "housing stress"),
    ("intermodal", "housing supply"),
    ("rail/port/air", "rent/mortgage/social"),
    ("rail/port/air handoff", "rent/mortgage supply pipeline"),
    ("CORRIDOR_SCENARIO_COUNT", "STRESS_SCENARIO_COUNT"),
    ("HANDOFF_STACK_SHARD_COUNT", "SUPPLY_PIPELINE_SHARD_COUNT"),
    ("DWELL_HUB_NODE_COUNT", "ZONING_NODE_COUNT"),
]


def transform_file(path: pathlib.Path) -> None:
    if path.suffix not in {".ts", ".md", ".py"}:
        return
    if path.name in {"scaffold_v1021.py", "scaffold_v1022.py"}:
        return
    text = path.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    path.write_text(text, encoding="utf-8")


def rename_paths() -> None:
    renames = [
        (ROOT / "engine" / "intermodal-freight-orchestrator.ts", ROOT / "engine" / "housing-affordability-orchestrator.ts"),
        (ROOT / "engine" / "intermodal-freight-utils.ts", ROOT / "engine" / "housing-affordability-utils.ts"),
        (ROOT / "self-tests" / "run-v1021-imfd-self-tests.ts", ROOT / "self-tests" / "run-v1022-haff-self-tests.ts"),
        (ROOT / "handoff-stacks" / "graph-utils.ts", ROOT / "supply-pipeline-stacks" / "graph-utils.ts"),
        (ROOT / "adapters" / "adapter-maritime-20bn.ts", ROOT / "adapters" / "adapter-public-services-20az.ts"),
        (ROOT / "adapters" / "adapter-iclog-20bk.ts", ROOT / "adapters" / "adapter-fiscal-20bj.ts"),
    ]
    (ROOT / "supply-pipeline-stacks").mkdir(exist_ok=True)
    if (ROOT / "handoff-stacks").exists():
        shutil.rmtree(ROOT / "handoff-stacks", ignore_errors=True)
    if (ROOT / "dwell-hubs").exists():
        (ROOT / "zoning-friction-nodes").mkdir(exist_ok=True)
        for p in (ROOT / "dwell-hubs").glob("*.ts"):
            dest = ROOT / "zoning-friction-nodes" / p.name.replace("dwell-hub", "zoning-node")
            p.rename(dest)
        shutil.rmtree(ROOT / "dwell-hubs", ignore_errors=True)
    (ROOT / "zoning-friction-nodes").mkdir(exist_ok=True)
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
        "export type V1022HaffTenureBand = 'fluid' | 'stable' | 'strained' | 'constrained' | 'critical';",
        "export type V1022HaffTenureBand = 'secure' | 'stable' | 'strained' | 'stressed' | 'critical';",
    )
    text = re.sub(
        r"export type V1022HaffStressBand = 'minimal'.*?;",
        "export type V1022HaffStressBand = 'minimal' | 'moderate' | 'elevated' | 'critical' | 'recovering';",
        text,
        flags=re.S,
    )
    text = text.replace(
        "/** AI fidelity / handoff slice (SECTION 20AZ). */",
        "/** Public services v2 slice (SECTION 20AZ). */",
    )
    text = text.replace(
        "/** Fiscal federalism dwell-hub slice (SECTION 20BJ). */",
        "/** Fiscal federalism zoning slice (SECTION 20BJ). */",
    )
    text = text.replace(
        "export type V1022HaffHousingTenure =",
        """export type V1022HaffHousingTenure =
  | 'rent'
  | 'mortgage'
  | 'social'
  | 'build_to_rent'
  | 'student'
  | 'senior'
  | 'regional'
  | 'remote'
  | 'investor'
  | 'co_living';

export type V1022HaffHousingTenureLegacy =""",
    )
    path.write_text(text, encoding="utf-8")


def patch_run_self_tests() -> None:
    path = ROOT / "run-self-tests.ts"
    path.write_text(
        """#!/usr/bin/env node
import { runV1022HaffSelfTests } from './self-tests/run-v1022-haff-self-tests.ts';

const r = runV1022HaffSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
""",
        encoding="utf-8",
    )


def patch_persistence_keys() -> None:
    path = ROOT / "persistence" / "keys.ts"
    text = path.read_text(encoding="utf-8")
    text = text.replace("stress_snapshots", "stress_snapshots")
    text = text.replace("supply_pipeline_graph", "supply_pipeline_graph")
    text = text.replace("regional_zoning_friction", "regional_zoning_friction")
    path.write_text(text, encoding="utf-8")


def write_generate_py() -> None:
    if not V1021_GEN.exists():
        raise SystemExit(f"missing {V1021_GEN}")
    text = V1021_GEN.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    text = text.replace(
        'MODES = ["rail", "road", "port", "air", "intermodal", "bulk", "container", "refrigerated", "express", "regional"]',
        'TENURES = ["rent", "mortgage", "social", "build_to_rent", "student", "senior", "regional", "remote", "investor", "co_living"]',
    )
    text = text.replace("DWELL_BANDS", "STRESS_BANDS")
    text = text.replace("CORRIDOR_SCENARIO_COUNT", "STRESS_SCENARIO_COUNT")
    text = text.replace("HANDOFF_STACK_SHARD_COUNT", "SUPPLY_PIPELINE_SHARD_COUNT")
    text = text.replace("DWELL_HUB_NODE_COUNT", "ZONING_NODE_COUNT")
    text = text.replace("MODES", "TENURES")
    text = text.replace("mode = MODES", "tenure = TENURES")
    text = text.replace("from_m = MODES", "from_t = TENURES")
    text = text.replace("to_m = MODES", "to_t = TENURES")
    text = text.replace("from_m", "from_t")
    text = text.replace("to_m", "to_t")
    text = text.replace("'{mode}'", "'{tenure}'")
    text = text.replace("anchorMode", "anchorTenure")
    text = text.replace("primaryTenure: '{tenure}'", "primaryTenure: '{tenure}'")
    text = text.replace("zoning_node_{i % ZONING_NODE_COUNT:02d}", "zoning_node_{i % ZONING_NODE_COUNT:02d}")
    text = text.replace("f\"zoning_node_{i % ZONING_NODE_COUNT:02d}\"", "f\"zoning_node_{i % ZONING_NODE_COUNT:02d}\"")
    text = text.replace("!== 'fragile'", "!== 'stressed'")
    text = text.replace("handoff-{mod}.ts", "pipeline-{mod}.ts")
    text = text.replace("export * from './supply-pipeline-stacks/handoff-", "export * from './supply-pipeline-stacks/pipeline-")
    text = text.replace("path = HANDOFF_DIR / f\"handoff-{mod}.ts\"", "path = HANDOFF_DIR / f\"pipeline-{mod}.ts\"")
    text = text.replace("zoning-friction-node-{mod}.ts", "zoning-node-{mod}.ts")
    text = text.replace("dwell-hub-{mod}.ts", "zoning-node-{mod}.ts")
    text = text.replace("HUB_DIR / f\"zoning-node-{mod}.ts\"", "HUB_DIR / f\"zoning-node-{mod}.ts\"")
    text = text.replace(
        "Generated corridors=",
        "Generated stress scenarios=",
    )
    text = text.replace("handoffs=", "supply pipelines=")
    text = text.replace("hubs=", "zoning nodes=")
    (ROOT / "scripts" / "generate.py").write_text(text, encoding="utf-8")


def main() -> None:
    rename_paths()
    write_generate_py()
    for p in ROOT.rglob("*"):
        if p.is_file():
            transform_file(p)
    patch_types_core()
    patch_persistence_keys()
    patch_run_self_tests()
    subprocess.check_call([sys.executable, str(ROOT / "scripts" / "generate.py")], cwd=str(ROOT))


if __name__ == "__main__":
    main()
