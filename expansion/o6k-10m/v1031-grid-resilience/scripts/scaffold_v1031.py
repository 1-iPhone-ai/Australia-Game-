#!/usr/bin/env python3
"""Transform v1030 inland heat copy into v1031 grid resilience + regenerate TS."""
from __future__ import annotations

import pathlib
import re
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]

REPLACEMENTS = [
    ("v1030-inland-heat", "v1031-grid-resilience"),
    ("V1030_IHEAT", "V1031_GRES"),
    ("V1030Iheat", "V1031Gres"),
    ("v1030Iheat", "v1031Gres"),
    ("v1030_iheat", "v1031_gres"),
    ("inland_heat", "grid_resilience"),
    ("inland-heat", "grid-resilience"),
    ("v1030_inland_heat", "v1031_grid_resilience"),
    ("save.meta.v1030.grid_resilience", "save.meta.v1031.grid_resilience"),
    ("v1030_grid_resilience", "v1031_grid_resilience"),
    ("10.30.inland_heat.1", "10.31.grid_resilience.1"),
    ("O6K-66", "O6K-67"),
    ("V10.30 INLAND HEAT / ARID ADAPTATION", "V10.31 GRID / ENERGY NETWORK RESILIENCE"),
    ("Inland heat adaptation", "Grid network resilience"),
    ("inland heat adaptation", "grid network resilience"),
    ("Inland Heat Adaptation", "Grid Network Resilience"),
    ("heatwave-scenarios", "outage-scenarios"),
    ("heatwave-registry", "outage-registry"),
    ("heatwave_snapshots", "outage_snapshots"),
    ("heatwaveSnapshots", "outageSnapshots"),
    ("HEATWAVE_SCENARIO", "OUTAGE_SCENARIO"),
    ("Heatwave scenario", "Outage scenario"),
    ("heatwave scenario", "outage scenario"),
    ("activeHeatwaveScenarioIds", "activeOutageScenarioIds"),
    ("activeInlandZoneIds", "activeSubstationZoneIds"),
    ("heatwaveBatch", "outageBatch"),
    ("evaluateHeatwaveBatch", "evaluateOutageBatch"),
    ("listActiveHeatwaveScenarioIds", "listActiveOutageScenarioIds"),
    ("ALL_HEATWAVE_SCENARIO", "ALL_OUTAGE_SCENARIO"),
    ("runHeatwaveScenarioRegressionSweep", "runOutageScenarioRegressionSweep"),
    ("HEATWAVE_SCENARIO_COUNT", "OUTAGE_SCENARIO_COUNT"),
    ("meanInlandHeatExposure", "meanGridStressExposure"),
    ("meanAridAdaptationScore", "meanGridResilienceScore"),
    ("aggregateInlandHeatExposureIndex", "aggregateGridStressExposureIndex"),
    ("aggregateInlandHeatExposure", "aggregateGridStressExposure"),
    ("aggregateAridAdaptationScore", "aggregateGridResilienceScore"),
    ("aggregateAridAdaptation", "aggregateGridResilience"),
    ("inlandHeatExposureIndex", "gridStressExposureIndex"),
    ("aridAdaptationBandFromScore", "gridResilienceBandFromScore"),
    ("aridAdaptationScore", "gridResilienceScore"),
    ("aridAdaptationBand", "gridResilienceBand"),
    ("AridAdaptationBand", "GridResilienceBand"),
    ("arid-buffer-stacks", "grid-buffer-stacks"),
    ("arid-buffer-bundle", "grid-buffer-bundle"),
    ("aridBuffer", "gridBuffer"),
    ("AridBuffer", "GridBuffer"),
    ("arid_buffer", "grid_buffer"),
    ("ARID_BUFFER", "GRID_BUFFER"),
    ("Arid buffer", "Grid buffer"),
    ("arid buffer", "grid buffer"),
    ("inland-zone-nodes", "substation-zone-nodes"),
    ("inland-zone-node", "substation-zone-node"),
    ("regional_inland_zone", "regional_substation_zone"),
    ("inland_zone", "substation_zone"),
    ("INLAND_ZONE", "SUBSTATION_ZONE"),
    ("Inland zone", "Substation zone"),
    ("inland zone", "substation zone"),
    ("inland-zone", "substation-zone"),
    ("inlandHeatChannel", "gridResilienceChannel"),
    ("InlandHeatChannel", "GridResilienceChannel"),
    ("inlandHeatPolicyFocus", "gridResiliencePolicyFocus"),
    ("inlandAridHarmonyScore", "gridNetworkHarmonyScore"),
    ("aridBufferDelayTurns", "gridBufferDelayTurns"),
    ("aridBufferGraphHash", "gridBufferGraphHash"),
    ("aridBufferPressure", "gridBufferPressure"),
    ("aridBufferGraphRevision", "gridBufferGraphRevision"),
    ("regionalAridBuffer", "regionalGridBuffer"),
    ("aridBufferIndex", "gridBufferIndex"),
    ("HeatwaveSnapshot", "OutageSnapshot"),
    ("nationalAridAdaptationScore", "nationalGridResilienceScore"),
    ("shadeHeadroom", "reserveHeadroom"),
    ("heatStressRisk", "outageCascadeRisk"),
    ("INLAND HEAT EXPOSURE, INLAND ZONE NODES & ARID BUFFERS", "GRID STRESS EXPOSURE, SUBSTATION ZONE NODES & GRID BUFFERS"),
    (
        "heatwave scenarios, arid-buffer graph, inland-zone nodes, inland heat scoring",
        "outage scenarios, grid-buffer graph, substation-zone nodes, grid resilience scoring",
    ),
    (
        "Heatwave scenario matrix, arid-buffer graph, inland-zone nodes",
        "Outage scenario matrix, grid-buffer graph, substation-zone nodes",
    ),
    ("runV1030IheatTurn", "runV1031GresTurn"),
    ("buildV1030IheatTurnInputFromGameState", "buildV1031GresTurnInputFromGameState"),
    ("buildV1030IheatTurnInputFromGameStateStub", "buildV1031GresTurnInputFromGameStateStub"),
    ("sanitizeV1030IheatPersisted", "sanitizeV1031GresPersisted"),
    ("createEmptyV1030IheatPersisted", "createEmptyV1031GresPersisted"),
    ("runV1030IheatSelfTests", "runV1031GresSelfTests"),
    ("run-v1030-iheat-self-tests.ts", "run-v1031-gres-self-tests.ts"),
    ("scaffold_v1030.py", "scaffold_v1031.py"),
    ("id: 'heatwave_", "id: 'outage_"),
    ("heatwave_", "outage_"),
    ("gameState.v1030InlandHeat", "gameState.v1031GridResilience"),
    ("v1030InlandHeat", "v1031GridResilience"),
    ("mergeAridBufferEdges", "mergeGridBufferEdges"),
    ("GENERATED_ARID_BUFFER", "GENERATED_GRID_BUFFER"),
    ("grid cooling load", "grid restoration load"),
    ("national heatwave scenarios", "national outage scenarios"),
    (
        "national heatwave scenarios, arid-buffer graph",
        "national outage scenarios, grid-buffer graph",
    ),
    ("readV1030IheatCoastalResilience20byBridge", "readV1031GresInlandHeat20bzBridge"),
    ("computeV1030IheatCoastalResilience20byBridge", "computeV1031GresInlandHeat20bzBridge"),
    ("applyV1030IheatCoastalResilience20byOverrides", "applyV1031GresInlandHeat20bzOverrides"),
    ("V1030IheatCoastalResilience20bySlice", "V1031GresInlandHeat20bzSlice"),
    ("coastalResilience20by", "inlandHeat20bz"),
    ("coastalResilienceDelta", "inlandHeatDelta"),
    ("adapter-coastal-resilience-20by", "adapter-inland-heat-20bz"),
    ("20BY coastal resilience", "20BZ inland heat"),
    ("v1030_iheat_20by_cres", "v1031_gres_20bz_iheat"),
    ("Coastal resilience", "Inland heat"),
    ("coastal resilience", "inland heat"),
    ("seaLevelExposurePressure", "inlandHeatExposurePressure"),
    ("surgeDriftTurns", "heatwaveDriftTurns"),
    ("readV1030IheatClimateAdaptation20brBridge", "readV1031GresClimateAdaptation20brBridge"),
    ("computeV1030IheatClimateAdaptation20brBridge", "computeV1031GresClimateAdaptation20brBridge"),
    (
        "applyV1030IheatClimateAdaptation20brClimateAdaptationOverrides",
        "applyV1031GresClimateAdaptation20brClimateAdaptationOverrides",
    ),
    ("V1030IheatClimateAdaptation20brSlice", "V1031GresClimateAdaptation20brSlice"),
    ("readV1030IheatDigitalGovernance20btBridge", "readV1031GresDigitalGovernance20btBridge"),
    ("computeV1030IheatDigitalGovernance20btBridge", "computeV1031GresDigitalGovernance20btBridge"),
    (
        "applyV1030IheatDigitalGovernance20btDigitalGovernanceOverrides",
        "applyV1031GresDigitalGovernance20btDigitalGovernanceOverrides",
    ),
    ("V1030IheatDigitalGovernance20btSlice", "V1031GresDigitalGovernance20btSlice"),
    ("buildV1030IheatBriefing", "buildV1031GresBriefing"),
    ("v1030IheatInputHash", "v1031GresInputHash"),
    ("V1030IheatTurnResult", "V1031GresTurnResult"),
    ("V1030IheatRegionId", "V1031GresRegionId"),
    ("V1030IheatSupplyBridge", "V1031GresSupplyBridge"),
    ("readV1030IheatSupply20bbBridge", "readV1031GresSupply20bbBridge"),
    ("readV1030IheatTrade20baBridge", "readV1031GresTrade20baBridge"),
    ("readV1030IheatEnergy20bcBridge", "readV1031GresEnergy20bcBridge"),
    ("readV1030IheatWorkforce20bfBridge", "readV1031GresWorkforce20bfBridge"),
    ("readV1030IheatPublicServices20azBridge", "readV1031GresPublicServices20azBridge"),
    ("computeV1030IheatSupply20bbBridge", "computeV1031GresSupply20bbBridge"),
    ("computeV1030IheatTrade20baBridge", "computeV1031GresTrade20baBridge"),
    ("computeV1030IheatEnergy20bcBridge", "computeV1031GresEnergy20bcBridge"),
    ("computeV1030IheatWorkforce20bfBridge", "computeV1031GresWorkforce20bfBridge"),
    ("applyV1030IheatSupply20bbBottleneckOverrides", "applyV1031GresSupply20bbBottleneckOverrides"),
    ("applyV1030IheatPublicServices20azServiceOverrides", "applyV1031GresPublicServices20azServiceOverrides"),
    ("V1030IheatV1014SupplySlice", "V1031GresV1014SupplySlice"),
    ("V1030IheatV1014TradeSlice", "V1031GresV1014TradeSlice"),
    ("V1030IheatV1014EnergySlice", "V1031GresV1014EnergySlice"),
    ("V1030IheatV1014WorkforceSlice", "V1031GresV1014WorkforceSlice"),
    ("V1030IheatPublicServices20azSlice", "V1031GresPublicServices20azSlice"),
    ("V1030_IHEAT_clamp", "V1031_GRES_clamp"),
    ("V1030_IHEAT_hash", "V1031_GRES_hash"),
    ("V1030_IHEAT_mixSeed", "V1031_GRES_mixSeed"),
    ("V1030_IHEAT_weightedMean", "V1031_GRES_weightedMean"),
    ("readV1030IheatRegionalHealthSystems20bvBridge", "readV1031GresRegionalHealthSystems20bvBridge"),
    (
        "computeV1030IheatRegionalHealthSystems20bvBridge",
        "computeV1031GresRegionalHealthSystems20bvBridge",
    ),
    (
        "applyV1030IheatRegionalHealthSystems20bvOverrides",
        "applyV1031GresRegionalHealthSystems20bvOverrides",
    ),
    ("V1030IheatBiodiversityStewardship20buSlice", "V1031GresBiodiversityStewardship20buSlice"),
    ("readV1030IheatWaterSecurity20bwBridge", "readV1031GresWaterSecurity20bwBridge"),
    ("computeV1030IheatWaterSecurity20bwBridge", "computeV1031GresWaterSecurity20bwBridge"),
    ("applyV1030IheatWaterSecurity20bwOverrides", "applyV1031GresWaterSecurity20bwOverrides"),
    ("V1030IheatWaterSecurity20bwSlice", "V1031GresWaterSecurity20bwSlice"),
    ("readV1030IheatDisasterResilience20bxBridge", "readV1031GresDisasterResilience20bxBridge"),
    ("computeV1030IheatDisasterResilience20bxBridge", "computeV1031GresDisasterResilience20bxBridge"),
    ("applyV1030IheatDisasterResilience20bxOverrides", "applyV1031GresDisasterResilience20bxOverrides"),
    ("V1030IheatDisasterResilience20bxSlice", "V1031GresDisasterResilience20bxSlice"),
    ("v1030_iheat_20bx_dres", "v1031_gres_20bx_dres"),
    ("V1030IheatTurnInput", "V1031GresTurnInput"),
    ("V1030IheatPersisted", "V1031GresPersisted"),
    ("V1030IheatRuntimeState", "V1031GresRuntimeState"),
    ("V1030IheatSelfTestResult", "V1031GresSelfTestResult"),
    ("V1030IheatTradeBridge", "V1031GresTradeBridge"),
    ("V1030IheatEnergyBridge", "V1031GresEnergyBridge"),
    ("V1030IheatWorkforceBridge", "V1031GresWorkforceBridge"),
    ("V1030IheatAridBufferEdge", "V1031GresGridBufferEdge"),
    ("V1030_IHEAT_LAB_SUITE_ID", "V1031_GRES_LAB_SUITE_ID"),
    ("V1030_IHEAT_PERSISTENCE_PATHS", "V1031_GRES_PERSISTENCE_PATHS"),
    ("V1030_IHEAT_SCHEMA_VERSION", "V1031_GRES_SCHEMA_VERSION"),
    ("V1030_IHEAT_INLAND_ZONE_", "V1031_GRES_SUBSTATION_ZONE_"),
    ("ARID_BUFFER_SHARD_COUNT", "GRID_BUFFER_SHARD_COUNT"),
    ("INLAND_ZONE_COUNT", "SUBSTATION_ZONE_COUNT"),
]


def transform_file(path: pathlib.Path) -> None:
    if path.suffix not in {".ts", ".md", ".py"}:
        return
    if path.name in {"scaffold_v1030.py", "scaffold_v1031.py"}:
        return
    text = path.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    text = text.replace("SECTION 20BZ", "SECTION 20CA")
    text = text.replace("**20BZ** (this shard)", "**20CA** (this shard)")
    text = text.replace("Inland heat adaptation v1", "Grid / energy network resilience v1")
    path.write_text(text, encoding="utf-8")


def rename_paths() -> None:
    renames = [
        (ROOT / "engine" / "inland-heat-orchestrator.ts", ROOT / "engine" / "grid-resilience-orchestrator.ts"),
        (ROOT / "engine" / "inland-heat-utils.ts", ROOT / "engine" / "grid-resilience-utils.ts"),
        (ROOT / "self-tests" / "run-v1030-iheat-self-tests.ts", ROOT / "self-tests" / "run-v1031-gres-self-tests.ts"),
        (ROOT / "arid-buffer-stacks", ROOT / "grid-buffer-stacks"),
        (ROOT / "inland-zone-nodes", ROOT / "substation-zone-nodes"),
    ]
    gen_old = ROOT / "generated" / "heatwave-scenarios"
    if gen_old.exists():
        (ROOT / "generated" / "outage-scenarios").mkdir(exist_ok=True)
        for p in gen_old.glob("*.ts"):
            p.rename(ROOT / "generated" / "outage-scenarios" / p.name)
        shutil.rmtree(gen_old, ignore_errors=True)
    for src, dst in renames:
        if src.exists():
            dst.parent.mkdir(parents=True, exist_ok=True)
            if dst.exists() and src.is_dir():
                shutil.rmtree(dst, ignore_errors=True)
            if src.is_dir():
                shutil.move(str(src), str(dst))
            else:
                if dst.exists():
                    dst.unlink()
                src.rename(dst)


def patch_types_core() -> None:
    path = ROOT / "types" / "core.ts"
    text = path.read_text(encoding="utf-8")
    text = re.sub(
        r"export type V1031GresGridResilienceChannel =[\s\S]*?;\n\nexport type V1031GresGridResilienceChannelLegacy =",
        """export type V1031GresGridResilienceChannel =
  | 'transmission'
  | 'distribution'
  | 'renewable_curtailment'
  | 'fossil_ramp'
  | 'storage_dispatch'
  | 'demand_response'
  | 'microgrid'
  | 'remote_feeder'
  | 'regional'
  | 'remote';

export type V1031GresGridResilienceChannelLegacy =""",
        text,
        count=1,
    )
    if "inlandHeatDelta" not in text:
        text = text.replace(
            "disasterResilienceDelta?: number;",
            "disasterResilienceDelta?: number;\n  inlandHeatDelta?: number;",
        )
    path.write_text(text, encoding="utf-8")


def patch_crosswire_hub() -> None:
    path = ROOT / "adapters" / "adapter-crosswire-hub.ts"
    text = path.read_text(encoding="utf-8")
    if "readV1031GresInlandHeat20bzBridge" in text:
        text = re.sub(
            r"export function readV1031GresInlandHeat20bzBridge\([\s\S]*?return \{ bottleneckDelta: inlandHeatDelta[^}]+\};",
            """export function readV1031GresInlandHeat20bzBridge(
  slice: import('../types/core').V1031GresInlandHeat20bzSlice,
  gridStressExposureIndex: number,
) {
  const inlandHeatDelta = V1031_GRES_clamp(
    slice.inlandHeatExposurePressure * 0.07 + slice.heatwaveDriftTurns * 0.04 + gridStressExposureIndex * 0.06,
    -8,
    16,
  );
  return { bottleneckDelta: inlandHeatDelta, stockDaysDelta: {}, inlandHeatDelta };
}""",
            text,
            count=1,
        )
    path.write_text(text, encoding="utf-8")


def write_bz_adapter() -> None:
    path = ROOT / "adapters" / "adapter-inland-heat-20bz.ts"
    path.write_text(
        """/**
 * Cross-wire: V1030 inland heat depth (SECTION 20BZ — heatwave / arid-buffer bridge).
 */
import type { V1031GresTurnInput, V1031GresSupplyBridge } from '../types/core';
import { readV1031GresInlandHeat20bzBridge } from './adapter-crosswire-hub';
import { V1031_GRES_clamp } from '../engine/grid-resilience-utils';

export function computeV1031GresInlandHeat20bzBridge(
  input: V1031GresTurnInput,
  gridStressExposureIndex: number,
): V1031GresSupplyBridge {
  return readV1031GresInlandHeat20bzBridge(input.inlandHeat20bz, gridStressExposureIndex);
}

export function applyV1031GresInlandHeat20bzOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1031GresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1031_GRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.inlandHeatDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
""",
        encoding="utf-8",
    )


def patch_orchestrator() -> None:
    path = ROOT / "engine" / "grid-resilience-orchestrator.ts"
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    text = text.replace(
        "computeV1031GresWaterSecurity20bwBridge",
        "computeV1031GresInlandHeat20bzBridge",
    )
    text = text.replace("adapter-water-security-20bw", "adapter-inland-heat-20bz")
    if "computeV1031GresInlandHeat20bzBridge" not in text:
        text = text.replace(
            "import { computeV1031GresRegionalHealthSystems20bvBridge } from '../adapters/adapter-regional-health-systems-20bv';",
            "import { computeV1031GresRegionalHealthSystems20bvBridge } from '../adapters/adapter-regional-health-systems-20bv';\n"
            "import { computeV1031GresInlandHeat20bzBridge } from '../adapters/adapter-inland-heat-20bz';\n"
            "import { computeV1031GresDisasterResilience20bxBridge } from '../adapters/adapter-disaster-resilience-20bx';",
        )
    stub_block = "regionalHealthSystems20bv: { turn, hospitalSurgePressure: 32, grantStackLoad: 0.22, bedCapacityDriftTurns: 14 },"
    if "inlandHeat20bz:" not in text and stub_block in text:
        text = text.replace(
            stub_block,
            stub_block
            + "\n    inlandHeat20bz: { turn, inlandHeatExposurePressure: 36, grantStackLoad: 0.2, heatwaveDriftTurns: 12 },"
            + "\n    disasterResilience20bx: { turn, activeCrisisLoad: 0.35, coordinationLagTurns: 8, escalationPressure: 22 },",
        )
    path.write_text(text, encoding="utf-8")


def patch_self_tests() -> None:
    path = ROOT / "self-tests" / "run-v1031-gres-self-tests.ts"
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    text = text.replace("adapter-water-security-20bw", "adapter-inland-heat-20bz")
    text = text.replace("computeV1031GresWaterSecurity20bwBridge", "computeV1031GresInlandHeat20bzBridge")
    text = text.replace("applyV1031GresWaterSecurity20bwOverrides", "applyV1031GresInlandHeat20bzOverrides")
    text = text.replace("waterSecurity20bw:", "inlandHeat20bz:")
    text = text.replace("supplyStressPressure:", "inlandHeatExposurePressure:")
    text = text.replace("basinDriftTurns:", "heatwaveDriftTurns:")
    text = text.replace("v1031_gres_20bw_wsec", "v1031_gres_20bz_iheat")
    text = text.replace("20BW water security adapter", "20BZ inland heat adapter")
    path.write_text(text, encoding="utf-8")


def patch_run_self_tests() -> None:
    path = ROOT / "run-self-tests.ts"
    path.write_text(
        """#!/usr/bin/env node
import { runV1031GresSelfTests } from './self-tests/run-v1031-gres-self-tests.ts';

const r = runV1031GresSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
""",
        encoding="utf-8",
    )


def patch_integration() -> None:
    path = ROOT / "INTEGRATION.md"
    text = path.read_text(encoding="utf-8")
    text = re.sub(
        r"\*\*Branch:\*\*.*",
        "**Branch:** `cursor/o6k-10m-v1031-grid-resilience`  ",
        text,
        count=1,
    )
    upstream = """| Section | Role |
|---------|------|
| **20AZ** | Public services v2 — cooling centers, digital alerting (`adapter-public-services-20az.ts`) |
| **20BR** | Climate adaptation (V1023) — heat pressure, resilience drift (`adapter-climate-adaptation-20br.ts`) |
| **20BV** | Regional health systems (V1026) — hospital surge, bed drift (`adapter-regional-health-systems-20bv.ts`) |
| **20BW** | Water security (V1027) — supply stress under grid stress (`adapter-water-security-20bw.ts`) |
| **20BX** | Disaster resilience (V1028) — compound hazards, evacuation lag (`adapter-disaster-resilience-20bx.ts`) |
| **20BY** | Coastal resilience (V1029) — surge / sea-level handoff (`adapter-coastal-resilience-20by.ts`) |
| **20BZ** | Inland heat (V1030) — heatwave / arid-buffer handoff (`adapter-inland-heat-20bz.ts`) |
| **20CA** (this shard) | Outage scenario matrix, grid-buffer graph, substation-zone nodes |
"""
    text = re.sub(
        r"\| Section \| Role \|[\s\S]*?\*\*20C[A-Z]\*\* \(this shard\)[^\n]*\n",
        upstream,
        text,
        count=1,
    )
    text = text.replace(
        "172 heatwave scenarios × 72 coef rows, 90 arid-buffer shards, 24 inland-zone nodes.",
        "172 outage scenarios × 72 coef rows, 90 grid-buffer shards, 24 substation-zone nodes.",
    )
    text = text.replace(
        "python3 expansion/o6k-10m/v1030-inland-heat/scripts/generate.py",
        "python3 expansion/o6k-10m/v1031-grid-resilience/scripts/generate.py",
    )
    text = text.replace(
        "npx tsx expansion/o6k-10m/v1030-inland-heat/run-self-tests.ts",
        "npx tsx expansion/o6k-10m/v1031-grid-resilience/run-self-tests.ts",
    )
    text = text.replace(
        "| `adapters/` | 20AZ / 20BR / 20BV / 20BW / 20BX / 20BY / 20BC bridges |",
        "| `adapters/` | 20AZ / 20BR / 20BV / 20BW / 20BX / 20BY / 20BZ / 20BC bridges |",
    )
    path.write_text(text, encoding="utf-8")


def write_generate_py() -> None:
    src_gen = ROOT / "scripts" / "generate.py"
    text = src_gen.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    text = text.replace("SECTION 20BZ", "SECTION 20CA")
    text = text.replace(
        'CHANNELS = ["emergency_care", "primary_access", "inland_zone", "telehealth", "rural_clinic", "specialist_referral", "aged_care", "mental_health", "regional", "remote"]',
        'CHANNELS = ["transmission", "distribution", "renewable_curtailment", "fossil_ramp", "storage_dispatch", "demand_response", "microgrid", "remote_feeder", "regional", "remote"]',
    )
    src_gen.write_text(text, encoding="utf-8")


def main() -> None:
    rename_paths()
    write_generate_py()
    for p in ROOT.rglob("*"):
        if p.is_file():
            transform_file(p)
    patch_types_core()
    patch_crosswire_hub()
    write_bz_adapter()
    patch_self_tests()
    patch_integration()
    patch_run_self_tests()
    patch_orchestrator()
    subprocess.check_call([sys.executable, str(ROOT / "scripts" / "generate.py")], cwd=str(ROOT))


if __name__ == "__main__":
    main()
