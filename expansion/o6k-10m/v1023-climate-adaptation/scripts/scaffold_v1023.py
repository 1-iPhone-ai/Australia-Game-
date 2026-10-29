#!/usr/bin/env python3
"""Transform v1022 housing affordability copy into v1023 climate adaptation + regenerate TS."""
from __future__ import annotations

import pathlib
import re
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
V1022_GEN = ROOT.parent / "v1022-housing-affordability" / "scripts" / "generate.py"

REPLACEMENTS = [
    ("v1022-housing-affordability", "v1023-climate-adaptation"),
    ("V1022_HAFF", "V1023_CLAD"),
    ("V1022Haff", "V1023Clad"),
    ("v1022Haff", "v1023Clad"),
    ("v1022_haff", "v1023_clad"),
    ("housing_affordability", "climate_adaptation"),
    ("housing-affordability", "climate-adaptation"),
    ("v1022_housing_affordability", "v1023_climate_adaptation"),
    ("10.22.housing_affordability.1", "10.23.climate_adaptation.1"),
    ("SECTION 20BQ", "SECTION 20BR"),
    ("O6K-49", "O6K-51"),
    ("V10.22 HOUSING AFFORDABILITY", "V10.23 CLIMATE ADAPTATION"),
    ("Housing affordability", "Climate adaptation"),
    ("housing affordability", "climate adaptation"),
    ("fiscalFederalism20bj", "scenarioPacks20bd"),
    ("FiscalFederalism20bj", "ScenarioPacks20bd"),
    ("fiscal-20bj", "scenarios-20bd"),
    ("Fiscal federalism", "Scenario packs"),
    ("fiscal federalism", "scenario packs"),
    ("20BJ", "20BD"),
    ("transferBackpressure", "packCohesionPressure"),
    ("zoningBacklogTurns", "objectiveDriftTurns"),
    ("fiscalTransferDelta", "scenarioPackDelta"),
    ("LabTransferOverrides", "ScenarioPackOverrides"),
    ("ZoningOverrides", "ScenarioPackOverrides"),
    ("stress-scenarios", "hazard-scenarios"),
    ("stress-registry", "hazard-registry"),
    ("stress_snapshots", "hazard_snapshots"),
    ("stressSnapshots", "hazardSnapshots"),
    ("STRESS_SCENARIO", "HAZARD_SCENARIO"),
    ("Stress scenario", "Hazard scenario"),
    ("stress scenario", "hazard scenario"),
    ("activeStressScenarioIds", "activeHazardScenarioIds"),
    ("activeZoningNodeIds", "activeFloodNodeIds"),
    ("stressBatch", "hazardBatch"),
    ("evaluateStressBatch", "evaluateHazardBatch"),
    ("listActiveStressScenarioIds", "listActiveHazardScenarioIds"),
    ("ALL_STRESS_SCENARIO", "ALL_HAZARD_SCENARIO"),
    ("runStressScenarioRegressionSweep", "runHazardScenarioRegressionSweep"),
    ("STRESS_SCENARIO_COUNT", "HAZARD_SCENARIO_COUNT"),
    ("meanRentStress", "meanHeatStress"),
    ("meanAffordability", "meanResilience"),
    ("aggregateRentStressIndex", "aggregateHeatStressIndex"),
    ("aggregateAffordabilityScore", "aggregateResilienceScore"),
    ("aggregateRentStress", "aggregateHeatStress"),
    ("aggregateAffordability", "aggregateResilience"),
    ("rentStressIndex", "heatStressIndex"),
    ("affordabilityScore", "resilienceScore"),
    ("tenureBandFromScore", "hazardBandFromScore"),
    ("V1023CladTenureBand", "V1023CladHazardBand"),
    ("supply-pipeline-stacks", "drought-buffer-stacks"),
    ("supply-pipeline-stack", "drought-buffer-stack"),
    ("supply-pipeline-bundle", "drought-buffer-bundle"),
    ("supplyPipeline", "droughtBuffer"),
    ("SupplyPipeline", "DroughtBuffer"),
    ("supply_pipeline", "drought_buffer"),
    ("SUPPLY_PIPELINE", "DROUGHT_BUFFER"),
    ("Supply pipeline", "Drought buffer"),
    ("supply pipeline", "drought buffer"),
    ("zoning-friction-nodes", "flood-defend-nodes"),
    ("zoning-friction-node", "flood-defend-node"),
    ("regional_zoning_friction", "regional_flood_defend"),
    ("zoning_friction", "flood_defend"),
    ("zoning_node", "flood_node"),
    ("ZONING_NODE", "FLOOD_NODE"),
    ("Zoning friction", "Flood defend"),
    ("zoning friction", "flood defend"),
    ("housingTenure", "adaptationChannel"),
    ("HousingTenure", "AdaptationChannel"),
    ("primaryTenure", "primaryChannel"),
    ("fromTenure", "fromChannel"),
    ("toTenure", "toChannel"),
    ("constructionHeadroom", "coolingHeadroom"),
    ("housingPolicyFocus", "adaptationPolicyFocus"),
    ("housingFiscalHarmonyScore", "climateEnergyHarmonyScore"),
    ("supplyPipelineDelayTurns", "droughtBufferDelayTurns"),
    ("V1023CladStressBand", "V1023CladHazardBand"),
    ("stressBand", "hazardBand"),
    ("StressBand", "HazardBand"),
    ("StressSnapshot", "HazardSnapshot"),
    ("SUPPLY_PIPELINE_SHARD_COUNT", "DROUGHT_BUFFER_SHARD_COUNT"),
    ("ZONING_NODE_COUNT", "FLOOD_NODE_COUNT"),
    ("intermodalResilienceScore", "climateResilienceScore"),
    ("rent/mortgage/social", "heat/flood/drought"),
    ("rent/mortgage supply pipeline", "heat/flood drought buffer"),
    ("housing stress", "climate hazard"),
    ("housing supply", "climate adaptation"),
    ("tenureBand", "hazardBand"),
    ("TenureBand", "HazardBand"),
]


def transform_file(path: pathlib.Path) -> None:
    if path.suffix not in {".ts", ".md", ".py"}:
        return
    if path.name in {"scaffold_v1022.py", "scaffold_v1023.py"}:
        return
    text = path.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    path.write_text(text, encoding="utf-8")


def rename_paths() -> None:
    renames = [
        (ROOT / "engine" / "housing-affordability-orchestrator.ts", ROOT / "engine" / "climate-adaptation-orchestrator.ts"),
        (ROOT / "engine" / "housing-affordability-utils.ts", ROOT / "engine" / "climate-adaptation-utils.ts"),
        (ROOT / "self-tests" / "run-v1022-haff-self-tests.ts", ROOT / "self-tests" / "run-v1023-clad-self-tests.ts"),
        (ROOT / "adapters" / "adapter-fiscal-20bj.ts", ROOT / "adapters" / "adapter-scenarios-20bd.ts"),
    ]
    if (ROOT / "supply-pipeline-stacks").exists():
        (ROOT / "drought-buffer-stacks").mkdir(exist_ok=True)
        for p in (ROOT / "supply-pipeline-stacks").glob("*.ts"):
            dest = ROOT / "drought-buffer-stacks" / p.name.replace("pipeline-", "buffer-")
            p.rename(dest)
        shutil.rmtree(ROOT / "supply-pipeline-stacks", ignore_errors=True)
    if (ROOT / "zoning-friction-nodes").exists():
        (ROOT / "flood-defend-nodes").mkdir(exist_ok=True)
        for p in (ROOT / "zoning-friction-nodes").glob("*.ts"):
            dest = ROOT / "flood-defend-nodes" / p.name.replace("zoning-node", "flood-node")
            p.rename(dest)
        shutil.rmtree(ROOT / "zoning-friction-nodes", ignore_errors=True)
    (ROOT / "drought-buffer-stacks").mkdir(exist_ok=True)
    (ROOT / "flood-defend-nodes").mkdir(exist_ok=True)
    gen_stress = ROOT / "generated" / "stress-scenarios"
    if gen_stress.exists():
        (ROOT / "generated" / "hazard-scenarios").mkdir(exist_ok=True)
        for p in gen_stress.glob("*.ts"):
            p.rename(ROOT / "generated" / "hazard-scenarios" / p.name)
        shutil.rmtree(gen_stress, ignore_errors=True)
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
        "export type V1023CladHazardBand = 'secure' | 'stable' | 'strained' | 'stressed' | 'critical';",
        "export type V1023CladHazardBand = 'minimal' | 'moderate' | 'elevated' | 'severe' | 'critical';",
    )
    text = re.sub(
        r"export type V1023CladHazardBand = 'minimal'.*?;",
        "export type V1023CladHazardSeverityBand = 'minimal' | 'moderate' | 'elevated' | 'critical' | 'recovering';",
        text,
        count=1,
        flags=re.S,
    )
    text = text.replace(
        "/** Fiscal federalism flood_node slice (SECTION 20BD). */",
        "/** Scenario packs v2 slice (SECTION 20BD). */",
    )
    text = text.replace(
        "export type V1023CladAdaptationChannel =",
        """export type V1023CladAdaptationChannel =
  | 'heat_urban'
  | 'flood_coastal'
  | 'drought_inland'
  | 'fire_interface'
  | 'cyclone_north'
  | 'heat_rural'
  | 'water_stress'
  | 'coastal_erosion'
  | 'regional'
  | 'remote';

export type V1023CladAdaptationChannelLegacy =""",
    )
    path.write_text(text, encoding="utf-8")


def patch_run_self_tests() -> None:
    path = ROOT / "run-self-tests.ts"
    path.write_text(
        """#!/usr/bin/env node
import { runV1023CladSelfTests } from './self-tests/run-v1023-clad-self-tests.ts';

const r = runV1023CladSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
""",
        encoding="utf-8",
    )


def patch_persistence_keys() -> None:
    path = ROOT / "persistence" / "keys.ts"
    text = path.read_text(encoding="utf-8")
    text = text.replace("hazard_snapshots", "hazard_snapshots")
    text = text.replace("drought_buffer_graph", "drought_buffer_graph")
    text = text.replace("regional_flood_defend", "regional_flood_defend")
    path.write_text(text, encoding="utf-8")


def write_generate_py() -> None:
    if not V1022_GEN.exists():
        raise SystemExit(f"missing {V1022_GEN}")
    text = V1022_GEN.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    text = text.replace(
        'TENURES = ["rent", "mortgage", "social", "build_to_rent", "student", "senior", "regional", "remote", "investor", "co_living"]',
        'CHANNELS = ["heat_urban", "flood_coastal", "drought_inland", "fire_interface", "cyclone_north", "heat_rural", "water_stress", "coastal_erosion", "regional", "remote"]',
    )
    text = text.replace("STRESS_BANDS", "HAZARD_BANDS")
    text = text.replace("STRESS_SCENARIO_COUNT", "HAZARD_SCENARIO_COUNT")
    text = text.replace("SUPPLY_PIPELINE_SHARD_COUNT", "DROUGHT_BUFFER_SHARD_COUNT")
    text = text.replace("ZONING_NODE_COUNT", "FLOOD_NODE_COUNT")
    text = text.replace("TENURES", "CHANNELS")
    text = text.replace("tenure = TENURES", "channel = CHANNELS")
    text = text.replace("from_t = TENURES", "from_c = CHANNELS")
    text = text.replace("to_t = TENURES", "to_c = CHANNELS")
    text = text.replace("from_t", "from_c")
    text = text.replace("to_t", "to_c")
    text = text.replace("'{tenure}'", "'{channel}'")
    text = text.replace("anchorTenure", "anchorChannel")
    text = text.replace("primaryChannel: '{channel}'", "primaryChannel: '{channel}'")
    text = text.replace("flood_node_{i % FLOOD_NODE_COUNT:02d}", "flood_node_{i % FLOOD_NODE_COUNT:02d}")
    text = text.replace("!== 'stressed'", "!== 'severe'")
    text = text.replace("pipeline-{mod}.ts", "buffer-{mod}.ts")
    text = text.replace("export * from './drought-buffer-stacks/pipeline-", "export * from './drought-buffer-stacks/buffer-")
    text = text.replace('path = HANDOFF_DIR / f"pipeline-{mod}.ts"', 'path = HANDOFF_DIR / f"buffer-{mod}.ts"')
    text = text.replace("flood-node-{mod}.ts", "flood-node-{mod}.ts")
    text = text.replace('SCEN_DIR = GEN / "stress-scenarios"', 'SCEN_DIR = GEN / "hazard-scenarios"')
    text = text.replace("Generated stress scenarios=", "Generated hazard scenarios=")
    text = text.replace("supply pipelines=", "drought buffers=")
    text = text.replace("zoning nodes=", "flood defend nodes=")
    text = text.replace("rent/mortgage/social handoff", "heat/flood/drought adaptation matrix")
    text = text.replace("HANDOFF_DIR", "BUFFER_DIR")
    text = text.replace("HUB_DIR", "FLOOD_DIR")
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
