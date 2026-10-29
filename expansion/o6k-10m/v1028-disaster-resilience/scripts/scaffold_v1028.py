#!/usr/bin/env python3
"""Transform v1027 water security copy into v1028 disaster resilience + regenerate TS."""
from __future__ import annotations

import pathlib
import re
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]

REPLACEMENTS = [
    ("v1027-water-security", "v1028-disaster-resilience"),
    ("V1027_WSEC", "V1028_DRES"),
    ("V1027Wsec", "V1028Dres"),
    ("v1027Wsec", "v1028Dres"),
    ("v1027_wsec", "v1028_dres"),
    ("water_security", "disaster_resilience"),
    ("water-security", "disaster-resilience"),
    ("v1027_water_security", "v1028_disaster_resilience"),
    ("10.27.water_security.1", "10.28.disaster_resilience.1"),
    ("SECTION 20BW", "SECTION 20BX"),
    ("O6K-61", "O6K-62"),
    ("V10.27 WATER SECURITY", "V10.28 DISASTER RESILIENCE"),
    ("Water security", "Disaster resilience"),
    ("water security", "disaster resilience"),
    ("Water Security", "Disaster Resilience"),
    ("basin-scenarios", "hazard-scenarios"),
    ("basin-registry", "hazard-registry"),
    ("basin_snapshots", "hazard_snapshots"),
    ("basinSnapshots", "hazardSnapshots"),
    ("BASIN_SCENARIO", "HAZARD_SCENARIO"),
    ("Basin scenario", "Hazard scenario"),
    ("basin scenario", "hazard scenario"),
    ("activeBasinScenarioIds", "activeHazardScenarioIds"),
    ("activeDistributionNetworkIds", "activeEmergencyResponseIds"),
    ("basinBatch", "hazardBatch"),
    ("evaluateBasinBatch", "evaluateHazardBatch"),
    ("listActiveBasinScenarioIds", "listActiveHazardScenarioIds"),
    ("ALL_BASIN_SCENARIO", "ALL_HAZARD_SCENARIO"),
    ("runBasinScenarioRegressionSweep", "runHazardScenarioRegressionSweep"),
    ("BASIN_SCENARIO_COUNT", "HAZARD_SCENARIO_COUNT"),
    ("meanWaterStress", "meanDisasterRisk"),
    ("meanWaterSecurityScore", "meanResilienceScore"),
    ("aggregateWaterStressIndex", "aggregateDisasterRiskIndex"),
    ("aggregateWaterSecurityScore", "aggregateResilienceScore"),
    ("aggregateWaterStress", "aggregateDisasterRisk"),
    ("aggregateWaterSecurity", "aggregateResilience"),
    ("waterStressIndex", "disasterRiskIndex"),
    ("waterSecurityScore", "resilienceScore"),
    ("waterSecurityBandFromScore", "resilienceBandFromScore"),
    ("aquifer-reserve-stacks", "evacuation-capacity-stacks"),
    ("aquifer-reserve-stack", "evacuation-capacity-stack"),
    ("aquifer-reserve-bundle", "evacuation-capacity-bundle"),
    ("aquiferReserve", "evacuationCapacity"),
    ("AquiferReserve", "EvacuationCapacity"),
    ("aquifer_reserve", "evacuation_capacity"),
    ("AQUIFER_RESERVE", "EVACUATION_CAPACITY"),
    ("Aquifer reserve", "Evacuation capacity"),
    ("aquifer reserve", "evacuation capacity"),
    ("distribution-network-nodes", "emergency-response-nodes"),
    ("distribution-network-node", "emergency-response-node"),
    ("regional_distribution_network", "regional_emergency_response"),
    ("distribution_network", "emergency_response"),
    ("DISTRIBUTION_NETWORK", "EMERGENCY_RESPONSE"),
    ("Distribution network", "Emergency response"),
    ("distribution network", "emergency response"),
    ("waterSecurityChannel", "disasterResilienceChannel"),
    ("WaterSecurityChannel", "DisasterResilienceChannel"),
    ("waterPolicyFocus", "emergencyPolicyFocus"),
    ("waterClimateHarmonyScore", "disasterClimateHarmonyScore"),
    ("aquiferReserveDelayTurns", "evacuationCapacityDelayTurns"),
    ("V1027WsecBasinBand", "V1028DresHazardBand"),
    ("V1027WsecFlowBand", "V1028DresResponseBand"),
    ("waterSecurityBand", "resilienceBand"),
    ("WaterSecurityBand", "ResilienceBand"),
    ("BasinSnapshot", "HazardSnapshot"),
    ("AQUIFER_RESERVE_SHARD_COUNT", "EVACUATION_CAPACITY_SHARD_COUNT"),
    ("DISTRIBUTION_NETWORK_COUNT", "EMERGENCY_RESPONSE_COUNT"),
    ("nationalWaterSecurityScore", "nationalResilienceScore"),
    ("surface/ground/aquifer", "flood/bushfire/cyclone"),
    ("surface/ground aquifer reserve", "flood/bushfire evacuation capacity"),
    ("regional water security", "regional disaster resilience"),
    ("storageHeadroom", "shelterHeadroom"),
    ("droughtRiskStress", "cascadeRiskStress"),
    ("hydrology & operations staffing", "emergency & logistics staffing"),
    (
        "WATER STRESS, DISTRIBUTION NETWORKS & AQUIFER RESERVES",
        "DISASTER RISK, EMERGENCY RESPONSE NODES & EVACUATION CAPACITY",
    ),
    (
        "basin scenarios, aquifer-reserve graph, distribution-network nodes, water security scoring",
        "hazard scenarios, evacuation-capacity graph, emergency-response nodes, disaster resilience scoring",
    ),
    (
        "Basin scenario matrix, aquifer-reserve graph, distribution-network nodes",
        "Hazard scenario matrix, evacuation-capacity graph, emergency-response nodes",
    ),
    ("runV1027WsecTurn", "runV1028DresTurn"),
    ("buildV1027WsecTurnInputFromGameState", "buildV1028DresTurnInputFromGameState"),
    ("buildV1027WsecTurnInputFromGameStateStub", "buildV1028DresTurnInputFromGameStateStub"),
    ("sanitizeV1027WsecPersisted", "sanitizeV1028DresPersisted"),
    ("createEmptyV1027WsecPersisted", "createEmptyV1028DresPersisted"),
    ("V1027WsecPersisted", "V1028DresPersisted"),
    ("V1027WsecTurnInput", "V1028DresTurnInput"),
    ("runV1027WsecSelfTests", "runV1028DresSelfTests"),
    ("readV1027WsecClimateAdaptation20brBridge", "readV1028DresClimateAdaptation20brBridge"),
    ("computeV1027WsecClimateAdaptation20brBridge", "computeV1028DresClimateAdaptation20brBridge"),
    (
        "applyV1027WsecClimateAdaptation20brClimateAdaptationOverrides",
        "applyV1028DresClimateAdaptation20brClimateAdaptationOverrides",
    ),
    ("V1027WsecClimateAdaptation20brSlice", "V1028DresClimateAdaptation20brSlice"),
    ("gameState.v1027WaterSecurity", "gameState.v1028DisasterResilience"),
    ("v1027WaterSecurity", "v1028DisasterResilience"),
    ("run-v1027-wsec-self-tests.ts", "run-v1028-dres-self-tests.ts"),
    ("scaffold_v1027.py", "scaffold_v1028.py"),
    ("distribution-network", "emergency-response"),
    ("V1027_WSEC_BASIN", "V1028_DRES_HAZARD"),
    ("V1027WsecBasin", "V1028DresHazard"),
    ("V1027WsecWaterSecurity", "V1028DresDisasterResilience"),
    ("waterSecurityBandRank", "resilienceBandRank"),
    ("mergeAquiferReserveEdges", "mergeEvacuationCapacityEdges"),
    ("aquiferReserveGraphHash", "evacuationCapacityGraphHash"),
    ("GENERATED_AQUIFER_RESERVE", "GENERATED_EVACUATION_CAPACITY"),
    ("regionalAquiferReserve", "regionalEvacuationCapacity"),
    ("aquiferReserveGraphRevision", "evacuationCapacityGraphRevision"),
    ("aquiferReservePressure", "evacuationCapacityPressure"),
    ("aquiferReserveIndex", "evacuationCapacityIndex"),
    ("grid pumping load", "grid emergency load"),
    ("national basin scenarios", "national hazard scenarios"),
    (
        "national basin scenarios, aquifer-reserve graph",
        "national hazard scenarios, evacuation-capacity graph",
    ),
    ("readV1027WsecDigitalGovernance20btBridge", "readV1028DresDigitalGovernance20btBridge"),
    ("computeV1027WsecDigitalGovernance20btBridge", "computeV1028DresDigitalGovernance20btBridge"),
    (
        "applyV1027WsecDigitalGovernance20btDigitalGovernanceOverrides",
        "applyV1028DresDigitalGovernance20btDigitalGovernanceOverrides",
    ),
    ("V1027WsecDigitalGovernance20btSlice", "V1028DresDigitalGovernance20btSlice"),
    ("buildV1027WsecBriefing", "buildV1028DresBriefing"),
    ("v1027WsecInputHash", "v1028DresInputHash"),
    ("V1027WsecTurnResult", "V1028DresTurnResult"),
    ("V1027WsecRegionId", "V1028DresRegionId"),
    ("V1027WsecSupplyBridge", "V1028DresSupplyBridge"),
    ("readV1027WsecSupply20bbBridge", "readV1028DresSupply20bbBridge"),
    ("readV1027WsecTrade20baBridge", "readV1028DresTrade20baBridge"),
    ("readV1027WsecEnergy20bcBridge", "readV1028DresEnergy20bcBridge"),
    ("readV1027WsecWorkforce20bfBridge", "readV1028DresWorkforce20bfBridge"),
    ("readV1027WsecPublicServices20azBridge", "readV1028DresPublicServices20azBridge"),
    ("computeV1027WsecSupply20bbBridge", "computeV1028DresSupply20bbBridge"),
    ("computeV1027WsecTrade20baBridge", "computeV1028DresTrade20baBridge"),
    ("computeV1027WsecEnergy20bcBridge", "computeV1028DresEnergy20bcBridge"),
    ("computeV1027WsecWorkforce20bfBridge", "computeV1028DresWorkforce20bfBridge"),
    ("applyV1027WsecSupply20bbBottleneckOverrides", "applyV1028DresSupply20bbBottleneckOverrides"),
    ("applyV1027WsecPublicServices20azServiceOverrides", "applyV1028DresPublicServices20azServiceOverrides"),
    ("V1027WsecV1014SupplySlice", "V1028DresV1014SupplySlice"),
    ("V1027WsecV1014TradeSlice", "V1028DresV1014TradeSlice"),
    ("V1027WsecV1014EnergySlice", "V1028DresV1014EnergySlice"),
    ("V1027WsecV1014WorkforceSlice", "V1028DresV1014WorkforceSlice"),
    ("V1027WsecPublicServices20azSlice", "V1028DresPublicServices20azSlice"),
    ("V1027_WSEC_clamp", "V1028_DRES_clamp"),
    ("V1027_WSEC_hash", "V1028_DRES_hash"),
    ("V1027_WSEC_mixSeed", "V1028_DRES_mixSeed"),
    ("V1027_WSEC_weightedMean", "V1028_DRES_weightedMean"),
    ("id: 'basin_", "id: 'hazard_"),
    ("basin_", "hazard_"),
    ("readV1027WsecBiodiversityStewardship20buBridge", "readV1028DresRegionalHealthSystems20bvBridge"),
    (
        "computeV1027WsecBiodiversityStewardship20buBridge",
        "computeV1028DresRegionalHealthSystems20bvBridge",
    ),
    (
        "applyV1027WsecBiodiversityStewardship20buOverrides",
        "applyV1028DresRegionalHealthSystems20bvOverrides",
    ),
    ("V1027WsecBiodiversityStewardship20buSlice", "V1028DresRegionalHealthSystems20bvSlice"),
    ("biodiversityStewardship20bu", "regionalHealthSystems20bv"),
    ("biodiversityStewardshipDelta", "regionalHealthDelta"),
    ("catchmentIntegrityPressure", "hospitalSurgePressure"),
    ("offsetDriftTurns", "bedCapacityDriftTurns"),
    ("adapter-biodiversity-stewardship-20bu", "adapter-regional-health-systems-20bv"),
    ("20BU biodiversity", "20BV regional health"),
    ("v1027_wsec_20bu_bio", "v1028_dres_20bv_health"),
    ("Biodiversity stewardship", "Regional health systems"),
    ("biodiversity stewardship", "regional health systems"),
    ("20BU", "20BV"),
    ("20BU", "20BV"),
]


def transform_file(path: pathlib.Path) -> None:
    if path.suffix not in {".ts", ".md", ".py"}:
        return
    if path.name in {"scaffold_v1027.py", "scaffold_v1028.py"}:
        return
    text = path.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    path.write_text(text, encoding="utf-8")


def rename_paths() -> None:
    renames = [
        (ROOT / "engine" / "water-security-orchestrator.ts", ROOT / "engine" / "disaster-resilience-orchestrator.ts"),
        (ROOT / "engine" / "water-security-utils.ts", ROOT / "engine" / "disaster-resilience-utils.ts"),
        (ROOT / "self-tests" / "run-v1027-wsec-self-tests.ts", ROOT / "self-tests" / "run-v1028-dres-self-tests.ts"),
        (ROOT / "aquifer-reserve-stacks", ROOT / "evacuation-capacity-stacks"),
        (ROOT / "distribution-network-nodes", ROOT / "emergency-response-nodes"),
    ]
    gen_old = ROOT / "generated" / "basin-scenarios"
    if gen_old.exists():
        (ROOT / "generated" / "hazard-scenarios").mkdir(exist_ok=True)
        for p in gen_old.glob("*.ts"):
            p.rename(ROOT / "generated" / "hazard-scenarios" / p.name)
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
        "export type V1028DresDisasterResilienceBand = 'secure' | 'stable' | 'stressed' | 'depleted' | 'critical';",
        "export type V1028DresDisasterResilienceBand = 'robust' | 'stable' | 'elevated' | 'critical' | 'recovering';",
    )
    text = re.sub(
        r"export type V1028DresDisasterResilienceChannel =[\s\S]*?;\n\nexport type V1028DresDisasterResilienceChannelLegacy =",
        """export type V1028DresDisasterResilienceChannel =
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

export type V1028DresDisasterResilienceChannelLegacy =""",
        text,
        count=1,
    )
    bw_slice = """
/** Water security slice (SECTION 20BW — upstream supply stress bridge). */
export interface V1028DresWaterSecurity20bwSlice {
  turn: number;
  supplyStressPressure: number;
  grantStackLoad: number;
  basinDriftTurns: number;
}
"""
    as_slice = """
/** Crisis spine slice (SECTION 20AS — national crisis coordination bridge). */
export interface V1028DresCrisisSpine20asSlice {
  turn: number;
  activeCrisisLoad: number;
  coordinationLagTurns: number;
  escalationPressure: number;
}
"""
    if "V1028DresWaterSecurity20bwSlice" not in text:
        text = text.replace(
            "/** Digital governance emergency-response slice (SECTION 20BT — V1024 bridge). */",
            bw_slice + as_slice + "\n/** Digital governance emergency-response slice (SECTION 20BT — V1024 bridge). */",
        )
    if "waterSecurity20bw:" not in text:
        text = text.replace(
            "  regionalHealthSystems20bv: V1028DresRegionalHealthSystems20bvSlice;\n",
            "  regionalHealthSystems20bv: V1028DresRegionalHealthSystems20bvSlice;\n"
            "  waterSecurity20bw: V1028DresWaterSecurity20bwSlice;\n"
            "  crisisSpine20as: V1028DresCrisisSpine20asSlice;\n",
        )
    if "waterSecurityDelta?" not in text:
        text = text.replace(
            "  regionalHealthDelta?: number;\n",
            "  regionalHealthDelta?: number;\n  waterSecurityDelta?: number;\n  crisisSpineDelta?: number;\n",
        )
    path.write_text(text, encoding="utf-8")


def patch_crosswire_hub() -> None:
    path = ROOT / "adapters" / "adapter-crosswire-hub.ts"
    text = path.read_text(encoding="utf-8")
    if "readV1028DresWaterSecurity20bwBridge" not in text:
        insert = """
export function readV1028DresWaterSecurity20bwBridge(
  slice: import('../types/core').V1028DresWaterSecurity20bwSlice,
  disasterRiskIndex: number,
) {
  const waterSecurityDelta = V1028_DRES_clamp(
    slice.supplyStressPressure * 0.07 + slice.basinDriftTurns * 0.04 + disasterRiskIndex * 0.06,
    -8,
    16,
  );
  return { bottleneckDelta: waterSecurityDelta, stockDaysDelta: {}, waterSecurityDelta };
}

export function readV1028DresCrisisSpine20asBridge(
  slice: import('../types/core').V1028DresCrisisSpine20asSlice,
  disasterRiskIndex: number,
) {
  const crisisSpineDelta = V1028_DRES_clamp(
    slice.activeCrisisLoad * 0.08 + slice.coordinationLagTurns * 0.05 + slice.escalationPressure * 0.06 + disasterRiskIndex * 0.04,
    -6,
    18,
  );
  return { bottleneckDelta: crisisSpineDelta, stockDaysDelta: {}, crisisSpineDelta };
}
"""
        text = text.replace("export function buildV1028DresBriefing(", insert + "\nexport function buildV1028DresBriefing(")
    if "readV1028DresRegionalHealthSystems20bvBridge" in text and "hospitalSurgePressure" not in text:
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
import type { V1028DresTurnInput, V1028DresSupplyBridge } from '../types/core';
import { readV1028DresWaterSecurity20bwBridge } from './adapter-crosswire-hub';
import { V1028_DRES_clamp } from '../engine/disaster-resilience-utils';

export function computeV1028DresWaterSecurity20bwBridge(
  input: V1028DresTurnInput,
  disasterRiskIndex: number,
): V1028DresSupplyBridge {
  return readV1028DresWaterSecurity20bwBridge(input.waterSecurity20bw, disasterRiskIndex);
}

export function applyV1028DresWaterSecurity20bwOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1028DresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1028_DRES_clamp(
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
    path = ROOT / "adapters" / "adapter-crisis-spine-20as.ts"
    path.write_text(
        """/**
 * Cross-wire: SECTION 20AS crisis spine — national coordination under compound hazards.
 */
import type { V1028DresTurnInput, V1028DresSupplyBridge } from '../types/core';
import { readV1028DresCrisisSpine20asBridge } from './adapter-crosswire-hub';
import { V1028_DRES_clamp } from '../engine/disaster-resilience-utils';

export function computeV1028DresCrisisSpine20asBridge(
  input: V1028DresTurnInput,
  disasterRiskIndex: number,
): V1028DresSupplyBridge {
  return readV1028DresCrisisSpine20asBridge(input.crisisSpine20as, disasterRiskIndex);
}

export function applyV1028DresCrisisSpine20asOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1028DresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1028_DRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.crisisSpineDelta ?? bridge.bottleneckDelta),
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
    path = ROOT / "engine" / "disaster-resilience-orchestrator.ts"
    text = path.read_text(encoding="utf-8")
    if "computeV1028DresWaterSecurity20bwBridge" not in text:
        text = text.replace(
            "import { computeV1028DresRegionalHealthSystems20bvBridge } from '../adapters/adapter-regional-health-systems-20bv';",
            "import { computeV1028DresRegionalHealthSystems20bvBridge } from '../adapters/adapter-regional-health-systems-20bv';\n"
            "import { computeV1028DresWaterSecurity20bwBridge } from '../adapters/adapter-water-security-20bw';\n"
            "import { computeV1028DresCrisisSpine20asBridge } from '../adapters/adapter-crisis-spine-20as';",
        )
    stub_block = "regionalHealthSystems20bv: { turn, hospitalSurgePressure: 32, grantStackLoad: 0.22, bedCapacityDriftTurns: 14 },"
    if "waterSecurity20bw:" not in text and stub_block in text:
        text = text.replace(
            stub_block,
            stub_block
            + "\n    waterSecurity20bw: { turn, supplyStressPressure: 36, grantStackLoad: 0.2, basinDriftTurns: 12 },"
            + "\n    crisisSpine20as: { turn, activeCrisisLoad: 0.35, coordinationLagTurns: 8, escalationPressure: 22 },",
        )
    path.write_text(text, encoding="utf-8")


def patch_self_tests() -> None:
    path = ROOT / "self-tests" / "run-v1028-dres-self-tests.ts"
    text = path.read_text(encoding="utf-8")
    text = text.replace("V1027_WSEC_LAB_SUITE_ID", "V1028_DRES_LAB_SUITE_ID")
    if "adapter-water-security-20bw" not in text:
        text = text.replace(
            "import { computeV1028DresRegionalHealthSystems20bvBridge, applyV1028DresRegionalHealthSystems20bvOverrides } from '../adapters/adapter-regional-health-systems-20bv';",
            "import { computeV1028DresRegionalHealthSystems20bvBridge, applyV1028DresRegionalHealthSystems20bvOverrides } from '../adapters/adapter-regional-health-systems-20bv';\n"
            "import { computeV1028DresWaterSecurity20bwBridge, applyV1028DresWaterSecurity20bwOverrides } from '../adapters/adapter-water-security-20bw';\n"
            "import { computeV1028DresCrisisSpine20asBridge, applyV1028DresCrisisSpine20asOverrides } from '../adapters/adapter-crisis-spine-20as';",
        )
    if "waterSecurity20bw:" not in text:
        text = text.replace(
            "    regionalHealthSystems20bv: {\n      turn: 1,\n      hospitalSurgePressure: 34,\n      grantStackLoad: 0.25,\n      bedCapacityDriftTurns: 16,\n    },",
            "    regionalHealthSystems20bv: {\n      turn: 1,\n      hospitalSurgePressure: 34,\n      grantStackLoad: 0.25,\n      bedCapacityDriftTurns: 16,\n    },\n"
            "    waterSecurity20bw: {\n      turn: 1,\n      supplyStressPressure: 38,\n      grantStackLoad: 0.21,\n      basinDriftTurns: 14,\n    },\n"
            "    crisisSpine20as: {\n      turn: 1,\n      activeCrisisLoad: 0.42,\n      coordinationLagTurns: 11,\n      escalationPressure: 26,\n    },",
        )
    if "v1028_dres_20bw_wsec" not in text:
        block = """
  {
    const b = computeV1028DresWaterSecurity20bwBridge(baseInput(), 0.31);
    const next = applyV1028DresWaterSecurity20bwOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1028_dres_20bw_wsec',
      '20BW water security adapter',
      (next.bottleneckPressure ?? 0) > 40,
    );
  }
  {
    const b = computeV1028DresCrisisSpine20asBridge(baseInput(), 0.29);
    const next = applyV1028DresCrisisSpine20asOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1028_dres_20as_crisis',
      '20AS crisis spine adapter',
      (next.bottleneckPressure ?? 0) > 40,
    );
  }
"""
        text = text.replace(
            "  check(\n    results,\n    'v1028_dres_20bv_health',",
            block + "\n  check(\n    results,\n    'v1028_dres_20bv_health',",
        )
    path.write_text(text, encoding="utf-8")


def patch_run_self_tests() -> None:
    path = ROOT / "run-self-tests.ts"
    path.write_text(
        """#!/usr/bin/env node
import { runV1028DresSelfTests } from './self-tests/run-v1028-dres-self-tests.ts';

const r = runV1028DresSelfTests();
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
        "**Branch:** `cursor/o6k-10m-v1028-disaster-resilience`  ",
        text,
        count=1,
    )
    text = text.replace("O6K-61", "O6K-62")
    text = text.replace("V1027_WSEC", "V1028_DRES")
    text = text.replace("**`SECTION 20BW`**", "**`SECTION 20BX`**")
    text = text.replace(
        "V10.27 WATER SECURITY — WATER STRESS, DISTRIBUTION NETWORKS & AQUIFER RESERVES (O6K-61)",
        "V10.28 DISASTER RESILIENCE — DISASTER RISK, EMERGENCY RESPONSE NODES & EVACUATION CAPACITY (O6K-62)",
    )
    upstream = """| Section | Role |
|---------|------|
| **20AZ** | Public services v2 — shelter capacity, digital alerting (`adapter-public-services-20az.ts`) |
| **20AS** | Crisis spine — national coordination, escalation lag (`adapter-crisis-spine-20as.ts`) |
| **20BR** | Climate adaptation (V1023) — hazard pressure, resilience drift (`adapter-climate-adaptation-20br.ts`) |
| **20BV** | Regional health systems (V1026) — hospital surge, bed drift (`adapter-regional-health-systems-20bv.ts`) |
| **20BW** | Water security (V1027) — supply stress under compound events (`adapter-water-security-20bw.ts`) |
| **20BX** (this shard) | Hazard scenario matrix, evacuation-capacity graph, emergency-response nodes |
"""
    text = re.sub(
        r"\| Section \| Role \|[\s\S]*?\*\*20B[WXYZ]\*\* \(this shard\)[^\n]*\n",
        upstream,
        text,
        count=1,
    )
    text = text.replace("runV1027WsecTurn", "runV1028DresTurn")
    text = text.replace("V1027WsecTurnInput", "V1028DresTurnInput")
    text = text.replace("buildV1027WsecTurnInputFromGameState", "buildV1028DresTurnInputFromGameState")
    text = text.replace("buildV1027WsecTurnInputFromGameStateStub", "buildV1028DresTurnInputFromGameStateStub")
    text = text.replace("save.meta.v1027.water_security", "save.meta.v1028.disaster_resilience")
    text = text.replace("V1027WsecPersisted", "V1028DresPersisted")
    text = text.replace("sanitizeV1027WsecPersisted", "sanitizeV1028DresPersisted")
    text = text.replace("createEmptyV1027WsecPersisted", "createEmptyV1028DresPersisted")
    text = text.replace("V1027_WSEC_SCHEMA_VERSION", "V1028_DRES_SCHEMA_VERSION")
    text = text.replace("V1027_WSEC_PERSISTENCE_PATHS", "V1028_DRES_PERSISTENCE_PATHS")
    text = text.replace("gameState.v1027WaterSecurity", "gameState.v1028DisasterResilience")
    text = text.replace("**v1027_water_security**", "**v1028_disaster_resilience**")
    text = text.replace(
        "expansion/o6k-10m/v1027-water-security/run-self-tests.ts",
        "expansion/o6k-10m/v1028-disaster-resilience/run-self-tests.ts",
    )
    text = text.replace(
        "python3 expansion/o6k-10m/v1027-water-security/scripts/generate.py",
        "python3 expansion/o6k-10m/v1028-disaster-resilience/scripts/generate.py",
    )
    text = text.replace(
        "172 basin scenarios × 72 coef rows, 90 aquifer-reserve shards, 24 distribution-network nodes.",
        "172 hazard scenarios × 72 coef rows, 90 evacuation-capacity shards, 24 emergency-response nodes.",
    )
    text = text.replace("water-security-orchestrator.ts", "disaster-resilience-orchestrator.ts")
    text = text.replace("water-security-utils.ts", "disaster-resilience-utils.ts")
    text = text.replace("basin-scenarios/", "hazard-scenarios/")
    text = text.replace("aquifer-reserve-stacks/", "evacuation-capacity-stacks/")
    text = text.replace("basin-registry.ts", "hazard-registry.ts")
    text = text.replace("distribution-network-nodes/", "emergency-response-nodes/")
    text = text.replace("aquifer-reserve-stacks/graph-utils.ts", "evacuation-capacity-stacks/graph-utils.ts")
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
    text = text.replace('SCEN_DIR = GEN / "basin-scenarios"', 'SCEN_DIR = GEN / "hazard-scenarios"')
    text = text.replace('BUFFER_DIR = GEN / "aquifer-reserve-stacks"', 'BUFFER_DIR = GEN / "evacuation-capacity-stacks"')
    text = text.replace('FLOOD_DIR = ROOT / "distribution-network-nodes"', 'FLOOD_DIR = ROOT / "emergency-response-nodes"')
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
