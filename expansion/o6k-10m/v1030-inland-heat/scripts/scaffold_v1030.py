#!/usr/bin/env python3
"""Transform v1029 coastal resilience copy into v1030 inland heat + regenerate TS."""
from __future__ import annotations

import pathlib
import re
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]

REPLACEMENTS = [
    ("v1029-coastal-resilience", "v1030-inland-heat"),
    ("V1029_CRES", "V1030_IHEAT"),
    ("V1029Cres", "V1030Iheat"),
    ("v1029Cres", "v1030Iheat"),
    ("v1029_cres", "v1030_iheat"),
    ("coastal_resilience", "inland_heat"),
    ("coastal-resilience", "inland-heat"),
    ("v1029_coastal_resilience", "v1030_inland_heat"),
    ("10.29.coastal_resilience.1", "10.30.inland_heat.1"),
    ("SECTION 20BY", "SECTION 20BZ"),
    ("O6K-64", "O6K-66"),
    ("V10.29 COASTAL RESILIENCE", "V10.30 INLAND HEAT / ARID ADAPTATION"),
    ("Coastal resilience", "Inland heat adaptation"),
    ("coastal resilience", "inland heat adaptation"),
    ("Coastal Resilience", "Inland Heat Adaptation"),
    ("surge-scenarios", "heatwave-scenarios"),
    ("surge-registry", "heatwave-registry"),
    ("surge_snapshots", "heatwave_snapshots"),
    ("surgeSnapshots", "heatwaveSnapshots"),
    ("SURGE_SCENARIO", "HEATWAVE_SCENARIO"),
    ("Surge scenario", "Heatwave scenario"),
    ("surge scenario", "heatwave scenario"),
    ("activeSurgeScenarioIds", "activeHeatwaveScenarioIds"),
    ("activeLittoralZoneIds", "activeInlandZoneIds"),
    ("surgeBatch", "heatwaveBatch"),
    ("evaluateSurgeBatch", "evaluateHeatwaveBatch"),
    ("listActiveSurgeScenarioIds", "listActiveHeatwaveScenarioIds"),
    ("ALL_SURGE_SCENARIO", "ALL_HEATWAVE_SCENARIO"),
    ("runSurgeScenarioRegressionSweep", "runHeatwaveScenarioRegressionSweep"),
    ("SURGE_SCENARIO_COUNT", "HEATWAVE_SCENARIO_COUNT"),
    ("meanSeaLevelExposure", "meanInlandHeatExposure"),
    ("meanAdaptationScore", "meanAridAdaptationScore"),
    ("aggregateSeaLevelExposureIndex", "aggregateInlandHeatExposureIndex"),
    ("aggregateAdaptationScore", "aggregateAridAdaptationScore"),
    ("aggregateSeaLevelExposure", "aggregateInlandHeatExposure"),
    ("aggregateAdaptation", "aggregateAridAdaptation"),
    ("seaLevelExposureIndex", "inlandHeatExposureIndex"),
    ("adaptationScore", "aridAdaptationScore"),
    ("adaptationBandFromScore", "aridAdaptationBandFromScore"),
    ("adaptation-buffer-stacks", "arid-buffer-stacks"),
    ("adaptation-buffer-stack", "arid-buffer-stack"),
    ("adaptation-buffer-bundle", "arid-buffer-bundle"),
    ("adaptationBuffer", "aridBuffer"),
    ("AdaptationBuffer", "AridBuffer"),
    ("adaptation_buffer", "arid_buffer"),
    ("ADAPTATION_BUFFER", "ARID_BUFFER"),
    ("Adaptation buffer", "Arid buffer"),
    ("adaptation buffer", "arid buffer"),
    ("littoral-zone-nodes", "inland-zone-nodes"),
    ("littoral-zone-node", "inland-zone-node"),
    ("regional_littoral_zone", "regional_inland_zone"),
    ("littoral_zone", "inland_zone"),
    ("LITTORAL_ZONE", "INLAND_ZONE"),
    ("Littoral zone", "Inland zone"),
    ("littoral zone", "inland zone"),
    ("littoral-zone", "inland-zone"),
    ("coastalAdaptationChannel", "inlandHeatChannel"),
    ("CoastalAdaptationChannel", "InlandHeatChannel"),
    ("coastalPolicyFocus", "inlandHeatPolicyFocus"),
    ("coastalClimateHarmonyScore", "inlandAridHarmonyScore"),
    ("adaptationBufferDelayTurns", "aridBufferDelayTurns"),
    ("V1029CresHazardBand", "V1030IheatHazardBand"),
    ("V1029CresResponseBand", "V1030IheatResponseBand"),
    ("adaptationBand", "aridAdaptationBand"),
    ("AdaptationBand", "AridAdaptationBand"),
    ("SurgeSnapshot", "HeatwaveSnapshot"),
    ("INLAND_ZONE_COUNT", "INLAND_ZONE_COUNT"),
    ("nationalAdaptationScore", "nationalAridAdaptationScore"),
    ("storm_surge/king_tide/erosion", "extreme_heat/drought/dust"),
    ("flood/bushfire adaptation buffer", "cooling/arid adaptation buffer"),
    ("regional coastal resilience", "regional inland heat adaptation"),
    ("bermHeadroom", "shadeHeadroom"),
    ("inundationRiskStress", "heatStressRisk"),
    ("coastal engineering & planning staffing", "inland heat & arid zone staffing"),
    (
        "SEA-LEVEL EXPOSURE, LITTORAL ZONE NODES & ADAPTATION BUFFERS",
        "INLAND HEAT EXPOSURE, INLAND ZONE NODES & ARID BUFFERS",
    ),
    (
        "surge scenarios, evacuation-capacity graph, littoral-zone nodes, coastal resilience scoring",
        "heatwave scenarios, arid-buffer graph, inland-zone nodes, inland heat scoring",
    ),
    (
        "Surge scenario matrix, evacuation-capacity graph, littoral-zone nodes",
        "Heatwave scenario matrix, arid-buffer graph, inland-zone nodes",
    ),
    ("runV1029CresTurn", "runV1030IheatTurn"),
    ("buildV1029CresTurnInputFromGameState", "buildV1030IheatTurnInputFromGameState"),
    ("buildV1029CresTurnInputFromGameStateStub", "buildV1030IheatTurnInputFromGameStateStub"),
    ("sanitizeV1029CresPersisted", "sanitizeV1030IheatPersisted"),
    ("createEmptyV1029CresPersisted", "createEmptyV1030IheatPersisted"),
    ("V1029CresPersisted", "V1030IheatPersisted"),
    ("V1029CresTurnInput", "V1030IheatTurnInput"),
    ("runV1029CresSelfTests", "runV1030IheatSelfTests"),
    ("readV1029CresClimateAdaptation20brBridge", "readV1030IheatClimateAdaptation20brBridge"),
    ("computeV1029CresClimateAdaptation20brBridge", "computeV1030IheatClimateAdaptation20brBridge"),
    (
        "applyV1029CresClimateAdaptation20brClimateAdaptationOverrides",
        "applyV1030IheatClimateAdaptation20brClimateAdaptationOverrides",
    ),
    ("V1029CresClimateAdaptation20brSlice", "V1030IheatClimateAdaptation20brSlice"),
    ("gameState.v1029CoastalResilience", "gameState.v1030InlandHeat"),
    ("v1029CoastalResilience", "v1030InlandHeat"),
    ("run-v1029-cres-self-tests.ts", "run-v1030-iheat-self-tests.ts"),
    ("scaffold_v1029.py", "scaffold_v1030.py"),
    ("V1029_CRES_HAZARD", "V1030_IHEAT_HAZARD"),
    ("V1029CresHazard", "V1030IheatHazard"),
    ("V1029CresDisasterResilience", "V1030IheatDisasterResilience"),
    ("aridAdaptationBandRank", "aridAdaptationBandRank"),
    ("mergeAdaptationBufferEdges", "mergeAridBufferEdges"),
    ("adaptationBufferGraphHash", "aridBufferGraphHash"),
    ("GENERATED_ADAPTATION_BUFFER", "GENERATED_ARID_BUFFER"),
    ("regionalAdaptationBuffer", "regionalAridBuffer"),
    ("adaptationBufferGraphRevision", "aridBufferGraphRevision"),
    ("adaptationBufferPressure", "aridBufferPressure"),
    ("adaptationBufferIndex", "aridBufferIndex"),
    ("grid coastal pump load", "grid cooling load"),
    ("national surge scenarios", "national heatwave scenarios"),
    (
        "national surge scenarios, evacuation-capacity graph",
        "national heatwave scenarios, arid-buffer graph",
    ),
    ("readV1029CresDigitalGovernance20btBridge", "readV1030IheatDigitalGovernance20btBridge"),
    ("computeV1029CresDigitalGovernance20btBridge", "computeV1030IheatDigitalGovernance20btBridge"),
    (
        "applyV1029CresDigitalGovernance20btDigitalGovernanceOverrides",
        "applyV1030IheatDigitalGovernance20btDigitalGovernanceOverrides",
    ),
    ("V1029CresDigitalGovernance20btSlice", "V1030IheatDigitalGovernance20btSlice"),
    ("buildV1029CresBriefing", "buildV1030IheatBriefing"),
    ("v1029CresInputHash", "v1030IheatInputHash"),
    ("V1029CresTurnResult", "V1030IheatTurnResult"),
    ("V1029CresRegionId", "V1030IheatRegionId"),
    ("V1029CresSupplyBridge", "V1030IheatSupplyBridge"),
    ("readV1029CresSupply20bbBridge", "readV1030IheatSupply20bbBridge"),
    ("readV1029CresTrade20baBridge", "readV1030IheatTrade20baBridge"),
    ("readV1029CresEnergy20bcBridge", "readV1030IheatEnergy20bcBridge"),
    ("readV1029CresWorkforce20bfBridge", "readV1030IheatWorkforce20bfBridge"),
    ("readV1029CresPublicServices20azBridge", "readV1030IheatPublicServices20azBridge"),
    ("computeV1029CresSupply20bbBridge", "computeV1030IheatSupply20bbBridge"),
    ("computeV1029CresTrade20baBridge", "computeV1030IheatTrade20baBridge"),
    ("computeV1029CresEnergy20bcBridge", "computeV1030IheatEnergy20bcBridge"),
    ("computeV1029CresWorkforce20bfBridge", "computeV1030IheatWorkforce20bfBridge"),
    ("applyV1029CresSupply20bbBottleneckOverrides", "applyV1030IheatSupply20bbBottleneckOverrides"),
    ("applyV1029CresPublicServices20azServiceOverrides", "applyV1030IheatPublicServices20azServiceOverrides"),
    ("V1029CresV1014SupplySlice", "V1030IheatV1014SupplySlice"),
    ("V1029CresV1014TradeSlice", "V1030IheatV1014TradeSlice"),
    ("V1029CresV1014EnergySlice", "V1030IheatV1014EnergySlice"),
    ("V1029CresV1014WorkforceSlice", "V1030IheatV1014WorkforceSlice"),
    ("V1029CresPublicServices20azSlice", "V1030IheatPublicServices20azSlice"),
    ("V1029_CRES_clamp", "V1030_IHEAT_clamp"),
    ("V1029_CRES_hash", "V1030_IHEAT_hash"),
    ("V1029_CRES_mixSeed", "V1030_IHEAT_mixSeed"),
    ("V1029_CRES_weightedMean", "V1030_IHEAT_weightedMean"),
    ("id: 'surge_", "id: 'heatwave_"),
    ("surge_", "heatwave_"),
    ("readV1029CresRegionalHealthSystems20bvBridge", "readV1030IheatRegionalHealthSystems20bvBridge"),
    (
        "computeV1029CresRegionalHealthSystems20bvBridge",
        "computeV1030IheatRegionalHealthSystems20bvBridge",
    ),
    (
        "applyV1029CresRegionalHealthSystems20bvOverrides",
        "applyV1030IheatRegionalHealthSystems20bvOverrides",
    ),
    ("V1029CresRegionalHealthSystems20bvSlice", "V1030IheatRegionalHealthSystems20bvSlice"),
    ("regionalHealthSystems20bv", "regionalHealthSystems20bv"),
    ("regionalHealthDelta", "regionalHealthDelta"),
    ("hospitalSurgePressure", "hospitalSurgePressure"),
    ("bedCapacityDriftTurns", "bedCapacityDriftTurns"),
    ("adapter-regional-health-systems-20bv", "adapter-regional-health-systems-20bv"),
    ("20BV regional health", "20BV regional health"),
    ("v1029_cres_20bv_health", "v1030_iheat_20bv_health"),
    ("Regional health systems", "Regional health systems"),
    ("regional health systems", "regional health systems"),
    ("readV1029CresWaterSecurity20bwBridge", "readV1030IheatCoastalResilience20byBridge"),
    ("computeV1029CresWaterSecurity20bwBridge", "computeV1030IheatCoastalResilience20byBridge"),
    ("applyV1029CresWaterSecurity20bwOverrides", "applyV1030IheatCoastalResilience20byOverrides"),
    ("V1029CresWaterSecurity20bwSlice", "V1030IheatCoastalResilience20bySlice"),
    ("waterSecurity20bw", "coastalResilience20by"),
    ("waterSecurityDelta", "coastalResilienceDelta"),
    ("supplyStressPressure", "seaLevelExposurePressure"),
    ("basinDriftTurns", "surgeDriftTurns"),
    ("adapter-water-security-20bw", "adapter-coastal-resilience-20by"),
    ("20BW water security", "20BY coastal resilience"),
    ("v1029_cres_20bw_wsec", "v1030_iheat_20by_cres"),
    ("Water security", "Coastal resilience"),
    ("water security", "coastal resilience"),
    ("readV1029CresDisasterResilience20bxBridge", "readV1030IheatDisasterResilience20bxBridge"),
    ("computeV1029CresDisasterResilience20bxBridge", "computeV1030IheatDisasterResilience20bxBridge"),
    ("applyV1029CresDisasterResilience20bxOverrides", "applyV1030IheatDisasterResilience20bxOverrides"),
    ("V1029CresDisasterResilience20bxSlice", "V1030IheatDisasterResilience20bxSlice"),
    ("disasterResilience20bx", "disasterResilience20bx"),
    ("disasterResilienceDelta", "disasterResilienceDelta"),
    ("v1029_cres_20as_crisis", "v1030_iheat_20bx_dres"),
    ("20AS crisis spine", "20BX disaster resilience"),
]


def transform_file(path: pathlib.Path) -> None:
    if path.suffix not in {".ts", ".md", ".py"}:
        return
    if path.name in {"scaffold_v1029.py", "scaffold_v1030.py"}:
        return
    text = path.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    path.write_text(text, encoding="utf-8")


def rename_paths() -> None:
    renames = [
        (ROOT / "engine" / "coastal-resilience-orchestrator.ts", ROOT / "engine" / "inland-heat-orchestrator.ts"),
        (ROOT / "engine" / "coastal-resilience-utils.ts", ROOT / "engine" / "inland-heat-utils.ts"),
        (ROOT / "self-tests" / "run-v1029-cres-self-tests.ts", ROOT / "self-tests" / "run-v1030-iheat-self-tests.ts"),
        (ROOT / "adaptation-buffer-stacks", ROOT / "arid-buffer-stacks"),
        (ROOT / "littoral-zone-nodes", ROOT / "inland-zone-nodes"),
    ]
    gen_old = ROOT / "generated" / "surge-scenarios"
    if gen_old.exists():
        (ROOT / "generated" / "heatwave-scenarios").mkdir(exist_ok=True)
        for p in gen_old.glob("*.ts"):
            p.rename(ROOT / "generated" / "heatwave-scenarios" / p.name)
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
    text = text.replace(
        "export type V1030IheatDisasterAridAdaptationBand = 'secure' | 'stable' | 'stressed' | 'depleted' | 'critical';",
        "export type V1030IheatDisasterAridAdaptationBand = 'secure' | 'stable' | 'stressed' | 'depleted' | 'critical';",
    )
    if "V1030IheatDisasterAridAdaptationBand" not in text:
        text = text.replace(
            "export type V1030IheatDisasterResilienceBand = 'robust' | 'stable' | 'elevated' | 'critical' | 'recovering';",
            "export type V1030IheatAridAdaptationBand = 'secure' | 'stable' | 'stressed' | 'depleted' | 'critical';",
        )
    text = re.sub(
        r"export type V1030IheatInlandHeatChannel =[\s\S]*?;\n\nexport type V1030IheatInlandHeatChannelLegacy =",
        """export type V1030IheatInlandHeatChannel =
  | 'extreme_heat'
  | 'drought'
  | 'dust_storm'
  | 'bushfire'
  | 'grid_overload'
  | 'water_stress'
  | 'cooling_center'
  | 'remote_clinic'
  | 'regional'
  | 'remote';

export type V1030IheatInlandHeatChannelLegacy =""",
        text,
        count=1,
    )
    path.write_text(text, encoding="utf-8")


def patch_crosswire_hub() -> None:
    path = ROOT / "adapters" / "adapter-crosswire-hub.ts"
    text = path.read_text(encoding="utf-8")
    text = text.replace("seaLevelExposureIndex", "inlandHeatExposureIndex")
    if "readV1030IheatCoastalResilience20byBridge" in text:
        text = re.sub(
            r"export function readV1030IheatCoastalResilience20byBridge\([\s\S]*?return \{ bottleneckDelta: waterSecurityDelta[^}]+\};",
            """export function readV1030IheatCoastalResilience20byBridge(
  slice: import('../types/core').V1030IheatCoastalResilience20bySlice,
  inlandHeatExposureIndex: number,
) {
  const coastalResilienceDelta = V1030_IHEAT_clamp(
    slice.seaLevelExposurePressure * 0.07 + slice.surgeDriftTurns * 0.04 + inlandHeatExposureIndex * 0.06,
    -8,
    16,
  );
  return { bottleneckDelta: coastalResilienceDelta, stockDaysDelta: {}, coastalResilienceDelta };
}""",
            text,
            count=1,
        )
    path.write_text(text, encoding="utf-8")


def write_by_adapter() -> None:
    path = ROOT / "adapters" / "adapter-coastal-resilience-20by.ts"
    path.write_text(
        """/**
 * Cross-wire: V1029 coastal resilience depth (SECTION 20BY — sea-level / surge bridge).
 */
import type { V1030IheatTurnInput, V1030IheatSupplyBridge } from '../types/core';
import { readV1030IheatCoastalResilience20byBridge } from './adapter-crosswire-hub';
import { V1030_IHEAT_clamp } from '../engine/inland-heat-utils';

export function computeV1030IheatCoastalResilience20byBridge(
  input: V1030IheatTurnInput,
  inlandHeatExposureIndex: number,
): V1030IheatSupplyBridge {
  return readV1030IheatCoastalResilience20byBridge(input.coastalResilience20by, inlandHeatExposureIndex);
}

export function applyV1030IheatCoastalResilience20byOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1030IheatSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1030_IHEAT_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.coastalResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
""",
        encoding="utf-8",
    )


def patch_orchestrator() -> None:
    path = ROOT / "engine" / "inland-heat-orchestrator.ts"
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    text = text.replace(
        "computeV1030IheatWaterSecurity20bwBridge",
        "computeV1030IheatCoastalResilience20byBridge",
    )
    text = text.replace(
        "adapter-water-security-20bw",
        "adapter-coastal-resilience-20by",
    )
    if "computeV1030IheatCoastalResilience20byBridge" not in text:
        text = text.replace(
            "import { computeV1030IheatRegionalHealthSystems20bvBridge } from '../adapters/adapter-regional-health-systems-20bv';",
            "import { computeV1030IheatRegionalHealthSystems20bvBridge } from '../adapters/adapter-regional-health-systems-20bv';\n"
            "import { computeV1030IheatCoastalResilience20byBridge } from '../adapters/adapter-coastal-resilience-20by';\n"
            "import { computeV1030IheatDisasterResilience20bxBridge } from '../adapters/adapter-disaster-resilience-20bx';",
        )
    stub_block = "regionalHealthSystems20bv: { turn, hospitalSurgePressure: 32, grantStackLoad: 0.22, bedCapacityDriftTurns: 14 },"
    if "coastalResilience20by:" not in text and stub_block in text:
        text = text.replace(
            stub_block,
            stub_block
            + "\n    coastalResilience20by: { turn, seaLevelExposurePressure: 36, grantStackLoad: 0.2, surgeDriftTurns: 12 },"
            + "\n    disasterResilience20bx: { turn, activeCrisisLoad: 0.35, coordinationLagTurns: 8, escalationPressure: 22 },",
        )
    path.write_text(text, encoding="utf-8")


def patch_self_tests() -> None:
    path = ROOT / "self-tests" / "run-v1030-iheat-self-tests.ts"
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    text = text.replace("adapter-water-security-20bw", "adapter-coastal-resilience-20by")
    text = text.replace("computeV1030IheatWaterSecurity20bwBridge", "computeV1030IheatCoastalResilience20byBridge")
    text = text.replace("applyV1030IheatWaterSecurity20bwOverrides", "applyV1030IheatCoastalResilience20byOverrides")
    text = text.replace("waterSecurity20bw:", "coastalResilience20by:")
    text = text.replace("supplyStressPressure:", "seaLevelExposurePressure:")
    text = text.replace("basinDriftTurns:", "surgeDriftTurns:")
    text = text.replace("v1030_iheat_20bw_wsec", "v1030_iheat_20by_cres")
    text = text.replace("20BW water security adapter", "20BY coastal resilience adapter")
    path.write_text(text, encoding="utf-8")


def patch_run_self_tests() -> None:
    path = ROOT / "run-self-tests.ts"
    path.write_text(
        """#!/usr/bin/env node
import { runV1030IheatSelfTests } from './self-tests/run-v1030-iheat-self-tests.ts';

const r = runV1030IheatSelfTests();
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
        "**Branch:** `cursor/o6k-10m-v1030-inland-heat`  ",
        text,
        count=1,
    )
    upstream = """| Section | Role |
|---------|------|
| **20AZ** | Public services v2 — cooling centers, digital alerting (`adapter-public-services-20az.ts`) |
| **20BR** | Climate adaptation (V1023) — heat pressure, resilience drift (`adapter-climate-adaptation-20br.ts`) |
| **20BV** | Regional health systems (V1026) — hospital surge, bed drift (`adapter-regional-health-systems-20bv.ts`) |
| **20BW** | Water security (V1027) — supply stress under arid stress (`adapter-water-security-20bw.ts`) |
| **20BX** | Disaster resilience (V1028) — compound hazards, evacuation lag (`adapter-disaster-resilience-20bx.ts`) |
| **20BY** | Coastal resilience (V1029) — surge / sea-level handoff (`adapter-coastal-resilience-20by.ts`) |
| **20BZ** (this shard) | Heatwave scenario matrix, arid-buffer graph, inland-zone nodes |
"""
    text = re.sub(
        r"\| Section \| Role \|[\s\S]*?\*\*20B[YWXZ]\*\* \(this shard\)[^\n]*\n",
        upstream,
        text,
        count=1,
    )
    text = text.replace(
        "172 surge scenarios × 72 coef rows, 90 evacuation-capacity shards, 24 littoral-zone nodes.",
        "172 heatwave scenarios × 72 coef rows, 90 arid-buffer shards, 24 inland-zone nodes.",
    )
    text = text.replace(
        "| `adapters/` | 20AZ / 20AS / 20BR / 20BV / 20BW / 20BC bridges |",
        "| `adapters/` | 20AZ / 20BR / 20BV / 20BW / 20BX / 20BY / 20BC bridges |",
    )
    path.write_text(text, encoding="utf-8")


def write_generate_py() -> None:
    src_gen = ROOT / "scripts" / "generate.py"
    text = src_gen.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    text = text.replace(
        'CHANNELS = ["bushfire", "flood", "cyclone", "heatwave", "pandemic", "infrastructure_failure", "cyber_incident", "evacuation", "regional", "remote"]',
        'CHANNELS = ["extreme_heat", "drought", "dust_storm", "bushfire", "grid_overload", "water_stress", "cooling_center", "remote_clinic", "regional", "remote"]',
    )
    text = text.replace('SCEN_DIR = GEN / "heatwave-scenarios"', 'SCEN_DIR = GEN / "heatwave-scenarios"')
    text = text.replace('BUFFER_DIR = GEN / "arid-buffer-stacks"', 'BUFFER_DIR = GEN / "arid-buffer-stacks"')
    text = text.replace('FLOOD_DIR = ROOT / "inland-zone-nodes"', 'FLOOD_DIR = ROOT / "inland-zone-nodes"')
    src_gen.write_text(text, encoding="utf-8")


def main() -> None:
    rename_paths()
    write_generate_py()
    for p in ROOT.rglob("*"):
        if p.is_file():
            transform_file(p)
    patch_types_core()
    patch_crosswire_hub()
    write_by_adapter()
    patch_self_tests()
    patch_integration()
    patch_run_self_tests()
    patch_orchestrator()
    subprocess.check_call([sys.executable, str(ROOT / "scripts" / "generate.py")], cwd=str(ROOT))


if __name__ == "__main__":
    main()
