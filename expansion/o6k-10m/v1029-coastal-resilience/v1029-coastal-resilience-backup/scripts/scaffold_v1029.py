#!/usr/bin/env python3
"""Transform v1027 water security copy into v1028 coastal resilience + regenerate TS."""
from __future__ import annotations

import pathlib
import re
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]

REPLACEMENTS = [
    ("v1027-water-security", "v1029-coastal-resilience"),
    ("V1027_WSEC", "V1029_CRES"),
    ("V1027Wsec", "V1029Cres"),
    ("v1027Wsec", "v1029Cres"),
    ("v1027_wsec", "v1029_cres"),
    ("water_security", "coastal_resilience"),
    ("water-security", "coastal-resilience"),
    ("v1027_water_security", "v1029_coastal_resilience"),
    ("10.27.water_security.1", "10.28.coastal_resilience.1"),
    ("SECTION 20BW", "SECTION 20BY"),
    ("O6K-61", "O6K-64"),
    ("V10.27 WATER SECURITY", "V10.29 COASTAL RESILIENCE"),
    ("Water security", "Coastal resilience"),
    ("water security", "coastal resilience"),
    ("Water Security", "Coastal Resilience"),
    ("basin-scenarios", "surge-scenarios"),
    ("basin-registry", "surge-registry"),
    ("basin_snapshots", "surge_snapshots"),
    ("basinSnapshots", "surgeSnapshots"),
    ("BASIN_SCENARIO", "SURGE_SCENARIO"),
    ("Basin scenario", "Surge scenario"),
    ("basin scenario", "surge scenario"),
    ("activeBasinScenarioIds", "activeSurgeScenarioIds"),
    ("activeDistributionNetworkIds", "activeLittoralZoneIds"),
    ("basinBatch", "surgeBatch"),
    ("evaluateBasinBatch", "evaluateSurgeBatch"),
    ("listActiveBasinScenarioIds", "listActiveSurgeScenarioIds"),
    ("ALL_BASIN_SCENARIO", "ALL_SURGE_SCENARIO"),
    ("runBasinScenarioRegressionSweep", "runSurgeScenarioRegressionSweep"),
    ("BASIN_SCENARIO_COUNT", "SURGE_SCENARIO_COUNT"),
    ("meanWaterStress", "meanSeaLevelExposure"),
    ("meanWaterSecurityScore", "meanAdaptationScore"),
    ("aggregateWaterStressIndex", "aggregateSeaLevelExposureIndex"),
    ("aggregateWaterSecurityScore", "aggregateAdaptationScore"),
    ("aggregateWaterStress", "aggregateSeaLevelExposure"),
    ("aggregateWaterSecurity", "aggregateAdaptation"),
    ("waterStressIndex", "seaLevelExposureIndex"),
    ("waterSecurityScore", "adaptationScore"),
    ("waterSecurityBandFromScore", "adaptationBandFromScore"),
    ("aquifer-reserve-stacks", "adaptation-buffer-stacks"),
    ("aquifer-reserve-stack", "adaptation-buffer-stack"),
    ("aquifer-reserve-bundle", "adaptation-buffer-bundle"),
    ("aquiferReserve", "adaptationBuffer"),
    ("AquiferReserve", "AdaptationBuffer"),
    ("aquifer_reserve", "adaptation_buffer"),
    ("AQUIFER_RESERVE", "ADAPTATION_BUFFER"),
    ("Aquifer reserve", "Adaptation buffer"),
    ("aquifer reserve", "adaptation buffer"),
    ("distribution-network-nodes", "littoral-zone-nodes"),
    ("distribution-network-node", "littoral-zone-node"),
    ("regional_distribution_network", "regional_littoral_zone"),
    ("distribution_network", "littoral_zone"),
    ("DISTRIBUTION_NETWORK", "LITTORAL_ZONE"),
    ("Distribution network", "Littoral zone"),
    ("distribution network", "littoral zone"),
    ("waterSecurityChannel", "coastalAdaptationChannel"),
    ("WaterSecurityChannel", "CoastalAdaptationChannel"),
    ("waterPolicyFocus", "coastalPolicyFocus"),
    ("waterClimateHarmonyScore", "coastalClimateHarmonyScore"),
    ("aquiferReserveDelayTurns", "adaptationBufferDelayTurns"),
    ("V1027WsecBasinBand", "V1029CresHazardBand"),
    ("V1027WsecFlowBand", "V1029CresResponseBand"),
    ("waterSecurityBand", "adaptationBand"),
    ("WaterSecurityBand", "AdaptationBand"),
    ("BasinSnapshot", "SurgeSnapshot"),
    ("AQUIFER_RESERVE_SHARD_COUNT", "ADAPTATION_BUFFER_SHARD_COUNT"),
    ("DISTRIBUTION_NETWORK_COUNT", "LITTORAL_ZONE_COUNT"),
    ("nationalWaterSecurityScore", "nationalAdaptationScore"),
    ("surface/ground/aquifer", "storm_surge/king_tide/erosion"),
    ("surface/ground aquifer reserve", "flood/bushfire adaptation buffer"),
    ("regional water security", "regional coastal resilience"),
    ("storageHeadroom", "bermHeadroom"),
    ("droughtRiskStress", "inundationRiskStress"),
    ("hydrology & operations staffing", "coastal engineering & planning staffing"),
    (
        "WATER STRESS, DISTRIBUTION NETWORKS & AQUIFER RESERVES",
        "SEA-LEVEL EXPOSURE, LITTORAL ZONE NODES & ADAPTATION BUFFERS",
    ),
    (
        "basin scenarios, aquifer-reserve graph, distribution-network nodes, water security scoring",
        "surge scenarios, evacuation-capacity graph, littoral-zone nodes, coastal resilience scoring",
    ),
    (
        "Basin scenario matrix, aquifer-reserve graph, distribution-network nodes",
        "Surge scenario matrix, evacuation-capacity graph, littoral-zone nodes",
    ),
    ("runV1027WsecTurn", "runV1029CresTurn"),
    ("buildV1027WsecTurnInputFromGameState", "buildV1029CresTurnInputFromGameState"),
    ("buildV1027WsecTurnInputFromGameStateStub", "buildV1029CresTurnInputFromGameStateStub"),
    ("sanitizeV1027WsecPersisted", "sanitizeV1029CresPersisted"),
    ("createEmptyV1027WsecPersisted", "createEmptyV1029CresPersisted"),
    ("V1027WsecPersisted", "V1029CresPersisted"),
    ("V1027WsecTurnInput", "V1029CresTurnInput"),
    ("runV1027WsecSelfTests", "runV1029CresSelfTests"),
    ("readV1027WsecClimateAdaptation20brBridge", "readV1029CresClimateAdaptation20brBridge"),
    ("computeV1027WsecClimateAdaptation20brBridge", "computeV1029CresClimateAdaptation20brBridge"),
    (
        "applyV1027WsecClimateAdaptation20brClimateAdaptationOverrides",
        "applyV1029CresClimateAdaptation20brClimateAdaptationOverrides",
    ),
    ("V1027WsecClimateAdaptation20brSlice", "V1029CresClimateAdaptation20brSlice"),
    ("gameState.v1027WaterSecurity", "gameState.v1029CoastalResilience"),
    ("v1027WaterSecurity", "v1029CoastalResilience"),
    ("run-v1027-wsec-self-tests.ts", "run-v1029-cres-self-tests.ts"),
    ("scaffold_v1027.py", "scaffold_v1029.py"),
    ("distribution-network", "littoral-zone"),
    ("V1027_WSEC_BASIN", "V1029_CRES_HAZARD"),
    ("V1027WsecBasin", "V1029CresHazard"),
    ("V1027WsecWaterSecurity", "V1029CresDisasterResilience"),
    ("waterSecurityBandRank", "adaptationBandRank"),
    ("mergeAquiferReserveEdges", "mergeAdaptationBufferEdges"),
    ("aquiferReserveGraphHash", "adaptationBufferGraphHash"),
    ("GENERATED_AQUIFER_RESERVE", "GENERATED_ADAPTATION_BUFFER"),
    ("regionalAquiferReserve", "regionalAdaptationBuffer"),
    ("aquiferReserveGraphRevision", "adaptationBufferGraphRevision"),
    ("aquiferReservePressure", "adaptationBufferPressure"),
    ("aquiferReserveIndex", "adaptationBufferIndex"),
    ("grid pumping load", "grid coastal pump load"),
    ("national basin scenarios", "national surge scenarios"),
    (
        "national basin scenarios, aquifer-reserve graph",
        "national surge scenarios, evacuation-capacity graph",
    ),
    ("readV1027WsecDigitalGovernance20btBridge", "readV1029CresDigitalGovernance20btBridge"),
    ("computeV1027WsecDigitalGovernance20btBridge", "computeV1029CresDigitalGovernance20btBridge"),
    (
        "applyV1027WsecDigitalGovernance20btDigitalGovernanceOverrides",
        "applyV1029CresDigitalGovernance20btDigitalGovernanceOverrides",
    ),
    ("V1027WsecDigitalGovernance20btSlice", "V1029CresDigitalGovernance20btSlice"),
    ("buildV1027WsecBriefing", "buildV1029CresBriefing"),
    ("v1027WsecInputHash", "v1029CresInputHash"),
    ("V1027WsecTurnResult", "V1029CresTurnResult"),
    ("V1027WsecRegionId", "V1029CresRegionId"),
    ("V1027WsecSupplyBridge", "V1029CresSupplyBridge"),
    ("readV1027WsecSupply20bbBridge", "readV1029CresSupply20bbBridge"),
    ("readV1027WsecTrade20baBridge", "readV1029CresTrade20baBridge"),
    ("readV1027WsecEnergy20bcBridge", "readV1029CresEnergy20bcBridge"),
    ("readV1027WsecWorkforce20bfBridge", "readV1029CresWorkforce20bfBridge"),
    ("readV1027WsecPublicServices20azBridge", "readV1029CresPublicServices20azBridge"),
    ("computeV1027WsecSupply20bbBridge", "computeV1029CresSupply20bbBridge"),
    ("computeV1027WsecTrade20baBridge", "computeV1029CresTrade20baBridge"),
    ("computeV1027WsecEnergy20bcBridge", "computeV1029CresEnergy20bcBridge"),
    ("computeV1027WsecWorkforce20bfBridge", "computeV1029CresWorkforce20bfBridge"),
    ("applyV1027WsecSupply20bbBottleneckOverrides", "applyV1029CresSupply20bbBottleneckOverrides"),
    ("applyV1027WsecPublicServices20azServiceOverrides", "applyV1029CresPublicServices20azServiceOverrides"),
    ("V1027WsecV1014SupplySlice", "V1029CresV1014SupplySlice"),
    ("V1027WsecV1014TradeSlice", "V1029CresV1014TradeSlice"),
    ("V1027WsecV1014EnergySlice", "V1029CresV1014EnergySlice"),
    ("V1027WsecV1014WorkforceSlice", "V1029CresV1014WorkforceSlice"),
    ("V1027WsecPublicServices20azSlice", "V1029CresPublicServices20azSlice"),
    ("V1027_WSEC_clamp", "V1029_CRES_clamp"),
    ("V1027_WSEC_hash", "V1029_CRES_hash"),
    ("V1027_WSEC_mixSeed", "V1029_CRES_mixSeed"),
    ("V1027_WSEC_weightedMean", "V1029_CRES_weightedMean"),
    ("id: 'basin_", "id: 'surge_"),
    ("basin_", "hazard_"),
    ("readV1027WsecBiodiversityStewardship20buBridge", "readV1029CresRegionalHealthSystems20bvBridge"),
    (
        "computeV1027WsecBiodiversityStewardship20buBridge",
        "computeV1029CresRegionalHealthSystems20bvBridge",
    ),
    (
        "applyV1027WsecBiodiversityStewardship20buOverrides",
        "applyV1029CresRegionalHealthSystems20bvOverrides",
    ),
    ("V1027WsecBiodiversityStewardship20buSlice", "V1029CresRegionalHealthSystems20bvSlice"),
    ("biodiversityStewardship20bu", "regionalHealthSystems20bv"),
    ("biodiversityStewardshipDelta", "regionalHealthDelta"),
    ("catchmentIntegrityPressure", "hospitalSurgePressure"),
    ("offsetDriftTurns", "bedCapacityDriftTurns"),
    ("adapter-biodiversity-stewardship-20bu", "adapter-regional-health-systems-20bv"),
    ("20BU biodiversity", "20BV regional health"),
    ("v1027_wsec_20bu_bio", "v1029_cres_20bv_health"),
    ("Biodiversity stewardship", "Regional health systems"),
    ("biodiversity stewardship", "regional health systems"),
    ("20BU", "20BV"),
    ("20BU", "20BV"),
]


def transform_file(path: pathlib.Path) -> None:
    if path.suffix not in {".ts", ".md", ".py"}:
        return
    if path.name in {"scaffold_v1027.py", "scaffold_v1029.py"}:
        return
    text = path.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    path.write_text(text, encoding="utf-8")


def rename_paths() -> None:
    renames = [
        (ROOT / "engine" / "water-security-orchestrator.ts", ROOT / "engine" / "coastal-resilience-orchestrator.ts"),
        (ROOT / "engine" / "water-security-utils.ts", ROOT / "engine" / "coastal-resilience-utils.ts"),
        (ROOT / "self-tests" / "run-v1027-wsec-self-tests.ts", ROOT / "self-tests" / "run-v1029-cres-self-tests.ts"),
        (ROOT / "aquifer-reserve-stacks", ROOT / "adaptation-buffer-stacks"),
        (ROOT / "distribution-network-nodes", ROOT / "littoral-zone-nodes"),
    ]
    gen_old = ROOT / "generated" / "basin-scenarios"
    if gen_old.exists():
        (ROOT / "generated" / "surge-scenarios").mkdir(exist_ok=True)
        for p in gen_old.glob("*.ts"):
            p.rename(ROOT / "generated" / "surge-scenarios" / p.name)
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
        "export type V1029CresDisasterAdaptationBand = 'secure' | 'stable' | 'stressed' | 'depleted' | 'critical';",
        "export type V1029CresDisasterAdaptationBand = 'robust' | 'stable' | 'elevated' | 'critical' | 'recovering';",
    )
    text = re.sub(
        r"export type V1029CresCoastalAdaptationChannel =[\s\S]*?;\n\nexport type V1029CresCoastalAdaptationChannelLegacy =",
        """export type V1029CresCoastalAdaptationChannel =
  | 'bushfire'
  | 'flood'
  | 'cyclone'
  | 'heatwave'
  | 'pandemic'
  | 'infrastructure_failure'
  | 'cyber_incident'
  | 'evacuation'
  | 'regional'
  | 'remote';

export type V1029CresCoastalAdaptationChannelLegacy =""",
        text,
        count=1,
    )
    bw_slice = """
/** Water security slice (SECTION 20BW — upstream supply stress bridge). */
export interface V1029CresWaterSecurity20bwSlice {
  turn: number;
  supplyStressPressure: number;
  grantStackLoad: number;
  basinDriftTurns: number;
}
"""
    as_slice = """
/** Crisis spine slice (SECTION 20AS — national crisis coordination bridge). */
export interface V1029CresDisasterResilience20bxSlice {
  turn: number;
  activeCrisisLoad: number;
  coordinationLagTurns: number;
  escalationPressure: number;
}
"""
    if "V1029CresWaterSecurity20bwSlice" not in text:
        text = text.replace(
            "/** Digital governance littoral-zone slice (SECTION 20BT — V1024 bridge). */",
            bw_slice + as_slice + "\n/** Digital governance littoral-zone slice (SECTION 20BT — V1024 bridge). */",
        )
    if "waterSecurity20bw:" not in text:
        text = text.replace(
            "  regionalHealthSystems20bv: V1029CresRegionalHealthSystems20bvSlice;\n",
            "  regionalHealthSystems20bv: V1029CresRegionalHealthSystems20bvSlice;\n"
            "  waterSecurity20bw: V1029CresWaterSecurity20bwSlice;\n"
            "  disasterResilience20bx: V1029CresDisasterResilience20bxSlice;\n",
        )
    if "waterSecurityDelta?" not in text:
        text = text.replace(
            "  regionalHealthDelta?: number;\n",
            "  regionalHealthDelta?: number;\n  waterSecurityDelta?: number;\n  disasterResilienceDelta?: number;\n",
        )
    path.write_text(text, encoding="utf-8")


def patch_crosswire_hub() -> None:
    path = ROOT / "adapters" / "adapter-crosswire-hub.ts"
    text = path.read_text(encoding="utf-8")
    if "readV1029CresWaterSecurity20bwBridge" not in text:
        insert = """
export function readV1029CresWaterSecurity20bwBridge(
  slice: import('../types/core').V1029CresWaterSecurity20bwSlice,
  seaLevelExposureIndex: number,
) {
  const waterSecurityDelta = V1029_CRES_clamp(
    slice.supplyStressPressure * 0.07 + slice.basinDriftTurns * 0.04 + seaLevelExposureIndex * 0.06,
    -8,
    16,
  );
  return { bottleneckDelta: waterSecurityDelta, stockDaysDelta: {}, waterSecurityDelta };
}

export function readV1029CresDisasterResilience20bxBridge(
  slice: import('../types/core').V1029CresDisasterResilience20bxSlice,
  seaLevelExposureIndex: number,
) {
  const disasterResilienceDelta = V1029_CRES_clamp(
    slice.activeCrisisLoad * 0.08 + slice.coordinationLagTurns * 0.05 + slice.escalationPressure * 0.06 + seaLevelExposureIndex * 0.04,
    -6,
    18,
  );
  return { bottleneckDelta: disasterResilienceDelta, stockDaysDelta: {}, disasterResilienceDelta };
}
"""
        text = text.replace("export function buildV1029CresBriefing(", insert + "\nexport function buildV1029CresBriefing(")
    if "readV1029CresRegionalHealthSystems20bvBridge" in text and "hospitalSurgePressure" not in text:
        text = text.replace(
            "slice.catchmentIntegrityPressure",
            "slice.hospitalSurgePressure",
        )
        text = text.replace("slice.offsetDriftTurns", "slice.bedCapacityDriftTurns")
        text = text.replace("biodiversityStewardshipDelta", "regionalHealthDelta")
    path.write_text(text, encoding="utf-8")


def write_bw_adapter() -> None:
    path = ROOT / "adapters" / "adapter-water-security-20bw.ts"
    path.write_text(
        """/**
 * Cross-wire: V1027 water security basin depth (SECTION 20BW — supply stress bridge).
 */
import type { V1029CresTurnInput, V1029CresSupplyBridge } from '../types/core';
import { readV1029CresWaterSecurity20bwBridge } from './adapter-crosswire-hub';
import { V1029_CRES_clamp } from '../engine/coastal-resilience-utils';

export function computeV1029CresWaterSecurity20bwBridge(
  input: V1029CresTurnInput,
  seaLevelExposureIndex: number,
): V1029CresSupplyBridge {
  return readV1029CresWaterSecurity20bwBridge(input.waterSecurity20bw, seaLevelExposureIndex);
}

export function applyV1029CresWaterSecurity20bwOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1029CresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1029_CRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.waterSecurityDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
""",
        encoding="utf-8",
    )


def write_as_adapter() -> None:
    path = ROOT / "adapters" / "adapter-disaster-resilience-20bx.ts"
    path.write_text(
        """/**
 * Cross-wire: SECTION 20AS crisis spine — national coordination under compound hazards.
 */
import type { V1029CresTurnInput, V1029CresSupplyBridge } from '../types/core';
import { readV1029CresDisasterResilience20bxBridge } from './adapter-crosswire-hub';
import { V1029_CRES_clamp } from '../engine/coastal-resilience-utils';

export function computeV1029CresDisasterResilience20bxBridge(
  input: V1029CresTurnInput,
  seaLevelExposureIndex: number,
): V1029CresSupplyBridge {
  return readV1029CresDisasterResilience20bxBridge(input.disasterResilience20bx, seaLevelExposureIndex);
}

export function applyV1029CresDisasterResilience20bxOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1029CresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1029_CRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.disasterResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
""",
        encoding="utf-8",
    )


def write_bv_adapter() -> None:
    path = ROOT / "adapters" / "adapter-regional-health-systems-20bv.ts"
    if path.exists():
        text = path.read_text(encoding="utf-8")
        text = text.replace("catchmentIntegrityPressure", "hospitalSurgePressure")
        text = text.replace("offsetDriftTurns", "bedCapacityDriftTurns")
        text = text.replace("biodiversityStewardshipDelta", "regionalHealthDelta")
        path.write_text(text, encoding="utf-8")


def patch_orchestrator() -> None:
    path = ROOT / "engine" / "coastal-resilience-orchestrator.ts"
    text = path.read_text(encoding="utf-8")
    if "computeV1029CresWaterSecurity20bwBridge" not in text:
        text = text.replace(
            "import { computeV1029CresRegionalHealthSystems20bvBridge } from '../adapters/adapter-regional-health-systems-20bv';",
            "import { computeV1029CresRegionalHealthSystems20bvBridge } from '../adapters/adapter-regional-health-systems-20bv';\n"
            "import { computeV1029CresWaterSecurity20bwBridge } from '../adapters/adapter-water-security-20bw';\n"
            "import { computeV1029CresDisasterResilience20bxBridge } from '../adapters/adapter-disaster-resilience-20bx';",
        )
    stub_block = "regionalHealthSystems20bv: { turn, hospitalSurgePressure: 32, grantStackLoad: 0.22, bedCapacityDriftTurns: 14 },"
    if "waterSecurity20bw:" not in text and stub_block in text:
        text = text.replace(
            stub_block,
            stub_block
            + "\n    waterSecurity20bw: { turn, supplyStressPressure: 36, grantStackLoad: 0.2, basinDriftTurns: 12 },"
            + "\n    disasterResilience20bx: { turn, activeCrisisLoad: 0.35, coordinationLagTurns: 8, escalationPressure: 22 },",
        )
    path.write_text(text, encoding="utf-8")


def patch_self_tests() -> None:
    path = ROOT / "self-tests" / "run-v1029-cres-self-tests.ts"
    text = path.read_text(encoding="utf-8")
    text = text.replace("V1027_WSEC_LAB_SUITE_ID", "V1029_CRES_LAB_SUITE_ID")
    if "adapter-water-security-20bw" not in text:
        text = text.replace(
            "import { computeV1029CresRegionalHealthSystems20bvBridge, applyV1029CresRegionalHealthSystems20bvOverrides } from '../adapters/adapter-regional-health-systems-20bv';",
            "import { computeV1029CresRegionalHealthSystems20bvBridge, applyV1029CresRegionalHealthSystems20bvOverrides } from '../adapters/adapter-regional-health-systems-20bv';\n"
            "import { computeV1029CresWaterSecurity20bwBridge, applyV1029CresWaterSecurity20bwOverrides } from '../adapters/adapter-water-security-20bw';\n"
            "import { computeV1029CresDisasterResilience20bxBridge, applyV1029CresDisasterResilience20bxOverrides } from '../adapters/adapter-disaster-resilience-20bx';",
        )
    if "waterSecurity20bw:" not in text:
        text = text.replace(
            "    regionalHealthSystems20bv: {\n      turn: 1,\n      hospitalSurgePressure: 34,\n      grantStackLoad: 0.25,\n      bedCapacityDriftTurns: 16,\n    },",
            "    regionalHealthSystems20bv: {\n      turn: 1,\n      hospitalSurgePressure: 34,\n      grantStackLoad: 0.25,\n      bedCapacityDriftTurns: 16,\n    },\n"
            "    waterSecurity20bw: {\n      turn: 1,\n      supplyStressPressure: 38,\n      grantStackLoad: 0.21,\n      basinDriftTurns: 14,\n    },\n"
            "    disasterResilience20bx: {\n      turn: 1,\n      activeCrisisLoad: 0.42,\n      coordinationLagTurns: 11,\n      escalationPressure: 26,\n    },",
        )
    if "v1029_cres_20bw_wsec" not in text:
        block = """
  {
    const b = computeV1029CresWaterSecurity20bwBridge(baseInput(), 0.31);
    const next = applyV1029CresWaterSecurity20bwOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1029_cres_20bw_wsec',
      '20BW water security adapter',
      (next.bottleneckPressure ?? 0) > 40,
    );
  }
  {
    const b = computeV1029CresDisasterResilience20bxBridge(baseInput(), 0.29);
    const next = applyV1029CresDisasterResilience20bxOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1029_cres_20as_crisis',
      '20AS crisis spine adapter',
      (next.bottleneckPressure ?? 0) > 40,
    );
  }
"""
        text = text.replace(
            "  check(\n    results,\n    'v1029_cres_20bv_health',",
            block + "\n  check(\n    results,\n    'v1029_cres_20bv_health',",
        )
    path.write_text(text, encoding="utf-8")


def patch_run_self_tests() -> None:
    path = ROOT / "run-self-tests.ts"
    path.write_text(
        """#!/usr/bin/env node
import { runV1029CresSelfTests } from './self-tests/run-v1029-cres-self-tests.ts';

const r = runV1029CresSelfTests();
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
        "**Branch:** `cursor/o6k-10m-v1029-coastal-resilience`  ",
        text,
        count=1,
    )
    text = text.replace("O6K-61", "O6K-64")
    text = text.replace("V1027_WSEC", "V1029_CRES")
    text = text.replace("**`SECTION 20BW`**", "**`SECTION 20BY`**")
    text = text.replace(
        "V10.27 WATER SECURITY — WATER STRESS, DISTRIBUTION NETWORKS & AQUIFER RESERVES (O6K-61)",
        "V10.29 COASTAL RESILIENCE — SEA-LEVEL EXPOSURE, LITTORAL ZONE NODES & ADAPTATION BUFFERS (O6K-64)",
    )
    upstream = """| Section | Role |
|---------|------|
| **20AZ** | Public services v2 — shelter capacity, digital alerting (`adapter-public-services-20az.ts`) |
| **20AS** | Crisis spine — national coordination, escalation lag (`adapter-disaster-resilience-20bx.ts`) |
| **20BR** | Climate adaptation (V1023) — hazard pressure, resilience drift (`adapter-climate-adaptation-20br.ts`) |
| **20BV** | Regional health systems (V1026) — hospital surge, bed drift (`adapter-regional-health-systems-20bv.ts`) |
| **20BW** | Water security (V1027) — supply stress under compound events (`adapter-water-security-20bw.ts`) |
| **20BX** (this shard) | Surge scenario matrix, evacuation-capacity graph, littoral-zone nodes |
"""
    text = re.sub(
        r"\| Section \| Role \|[\s\S]*?\*\*20B[WXYZ]\*\* \(this shard\)[^\n]*\n",
        upstream,
        text,
        count=1,
    )
    text = text.replace("runV1027WsecTurn", "runV1029CresTurn")
    text = text.replace("V1027WsecTurnInput", "V1029CresTurnInput")
    text = text.replace("buildV1027WsecTurnInputFromGameState", "buildV1029CresTurnInputFromGameState")
    text = text.replace("buildV1027WsecTurnInputFromGameStateStub", "buildV1029CresTurnInputFromGameStateStub")
    text = text.replace("save.meta.v1027.water_security", "save.meta.v1029.coastal_resilience")
    text = text.replace("V1027WsecPersisted", "V1029CresPersisted")
    text = text.replace("sanitizeV1027WsecPersisted", "sanitizeV1029CresPersisted")
    text = text.replace("createEmptyV1027WsecPersisted", "createEmptyV1029CresPersisted")
    text = text.replace("V1027_WSEC_SCHEMA_VERSION", "V1029_CRES_SCHEMA_VERSION")
    text = text.replace("V1027_WSEC_PERSISTENCE_PATHS", "V1029_CRES_PERSISTENCE_PATHS")
    text = text.replace("gameState.v1027WaterSecurity", "gameState.v1029CoastalResilience")
    text = text.replace("**v1027_water_security**", "**v1029_coastal_resilience**")
    text = text.replace(
        "expansion/o6k-10m/v1027-water-security/run-self-tests.ts",
        "expansion/o6k-10m/v1029-coastal-resilience/run-self-tests.ts",
    )
    text = text.replace(
        "python3 expansion/o6k-10m/v1027-water-security/scripts/generate.py",
        "python3 expansion/o6k-10m/v1029-coastal-resilience/scripts/generate.py",
    )
    text = text.replace(
        "172 basin scenarios × 72 coef rows, 90 aquifer-reserve shards, 24 distribution-network nodes.",
        "172 surge scenarios × 72 coef rows, 90 evacuation-capacity shards, 24 littoral-zone nodes.",
    )
    text = text.replace("water-security-orchestrator.ts", "coastal-resilience-orchestrator.ts")
    text = text.replace("water-security-utils.ts", "coastal-resilience-utils.ts")
    text = text.replace("basin-scenarios/", "surge-scenarios/")
    text = text.replace("aquifer-reserve-stacks/", "adaptation-buffer-stacks/")
    text = text.replace("basin-registry.ts", "surge-registry.ts")
    text = text.replace("distribution-network-nodes/", "littoral-zone-nodes/")
    text = text.replace("aquifer-reserve-stacks/graph-utils.ts", "adaptation-buffer-stacks/graph-utils.ts")
    text = text.replace(
        "| `adapters/` | 20AZ / 20BR / 20BT / 20BU / 20BC bridges |",
        "| `adapters/` | 20AZ / 20AS / 20BR / 20BV / 20BW / 20BC bridges |",
    )
    path.write_text(text, encoding="utf-8")


def write_generate_py() -> None:
    src_gen = ROOT / "scripts" / "generate.py"
    text = src_gen.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    text = text.replace(
        'CHANNELS = ["surface_water", "groundwater", "desalination", "irrigation", "urban_supply", "basin_allocation", "flood_mitigation", "environmental_flow", "regional", "remote"]',
        'CHANNELS = ["bushfire", "flood", "cyclone", "heatwave", "pandemic", "infrastructure_failure", "cyber_incident", "evacuation", "regional", "remote"]',
    )
    text = text.replace('SCEN_DIR = GEN / "basin-scenarios"', 'SCEN_DIR = GEN / "surge-scenarios"')
    text = text.replace('BUFFER_DIR = GEN / "aquifer-reserve-stacks"', 'BUFFER_DIR = GEN / "adaptation-buffer-stacks"')
    text = text.replace('FLOOD_DIR = ROOT / "distribution-network-nodes"', 'FLOOD_DIR = ROOT / "littoral-zone-nodes"')
    src_gen.write_text(text, encoding="utf-8")


def main() -> None:
    rename_paths()
    write_generate_py()
    for p in ROOT.rglob("*"):
        if p.is_file():
            transform_file(p)
    patch_types_core()
    patch_crosswire_hub()
    write_bv_adapter()
    write_bw_adapter()
    write_as_adapter()
    patch_self_tests()
    patch_integration()
    patch_run_self_tests()
    patch_orchestrator()
    subprocess.check_call([sys.executable, str(ROOT / "scripts" / "generate.py")], cwd=str(ROOT))


if __name__ == "__main__":
    main()
