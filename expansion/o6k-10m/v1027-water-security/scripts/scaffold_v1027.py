#!/usr/bin/env python3
"""Transform v1026 regional health copy into v1027 water security + regenerate TS."""
from __future__ import annotations

import pathlib
import re
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]

REPLACEMENTS = [
    ("v1026-regional-health-systems", "v1027-water-security"),
    ("V1026_RHS", "V1027_WSEC"),
    ("V1026Rhs", "V1027Wsec"),
    ("v1026Rhs", "v1027Wsec"),
    ("v1026_rhs", "v1027_wsec"),
    ("regional_health_systems", "water_security"),
    ("regional-health-systems", "water-security"),
    ("v1026_regional_health_systems", "v1027_water_security"),
    ("10.26.regional_health_systems.1", "10.27.water_security.1"),
    ("10.25.regional_health_systems.1", "10.27.water_security.1"),
    ("SECTION 20BV", "SECTION 20BW"),
    ("O6K-59", "O6K-61"),
    ("V10.26 REGIONAL HEALTH SYSTEMS", "V10.27 WATER SECURITY"),
    ("Regional health systems", "Water security"),
    ("regional health systems", "water security"),
    ("Regional Health Systems", "Water Security"),
    ("care-scenarios", "basin-scenarios"),
    ("care-registry", "basin-registry"),
    ("care_snapshots", "basin_snapshots"),
    ("careSnapshots", "basinSnapshots"),
    ("CARE_SCENARIO", "BASIN_SCENARIO"),
    ("Care scenario", "Basin scenario"),
    ("care scenario", "basin scenario"),
    ("activeCareScenarioIds", "activeBasinScenarioIds"),
    ("activeHospitalNetworkIds", "activeDistributionNetworkIds"),
    ("careBatch", "basinBatch"),
    ("evaluateCareBatch", "evaluateBasinBatch"),
    ("listActiveCareScenarioIds", "listActiveBasinScenarioIds"),
    ("ALL_CARE_SCENARIO", "ALL_BASIN_SCENARIO"),
    ("runCareScenarioRegressionSweep", "runBasinScenarioRegressionSweep"),
    ("CARE_SCENARIO_COUNT", "BASIN_SCENARIO_COUNT"),
    ("meanCapacityStress", "meanWaterStress"),
    ("meanHealthSystemScore", "meanWaterSecurityScore"),
    ("aggregateCapacityStressIndex", "aggregateWaterStressIndex"),
    ("aggregateHealthSystemScore", "aggregateWaterSecurityScore"),
    ("aggregateCapacityStress", "aggregateWaterStress"),
    ("aggregateHealthSystem", "aggregateWaterSecurity"),
    ("capacityStressIndex", "waterStressIndex"),
    ("healthSystemScore", "waterSecurityScore"),
    ("healthSystemBandFromScore", "waterSecurityBandFromScore"),
    ("primary-care-access-stacks", "aquifer-reserve-stacks"),
    ("primary-care-access-stack", "aquifer-reserve-stack"),
    ("primary-care-access-bundle", "aquifer-reserve-bundle"),
    ("primaryCareAccess", "aquiferReserve"),
    ("PrimaryCareAccess", "AquiferReserve"),
    ("primary_care_access", "aquifer_reserve"),
    ("PRIMARY_CARE_ACCESS", "AQUIFER_RESERVE"),
    ("Primary care access", "Aquifer reserve"),
    ("primary care access", "aquifer reserve"),
    ("hospital-network-nodes", "distribution-network-nodes"),
    ("hospital-network-node", "distribution-network-node"),
    ("regional_hospital_network", "regional_distribution_network"),
    ("hospital_network", "distribution_network"),
    ("HOSPITAL_NETWORK", "DISTRIBUTION_NETWORK"),
    ("Hospital network", "Distribution network"),
    ("hospital network", "distribution network"),
    ("healthSystemChannel", "waterSecurityChannel"),
    ("HealthSystemChannel", "WaterSecurityChannel"),
    ("healthPolicyFocus", "waterPolicyFocus"),
    ("healthClimateHarmonyScore", "waterClimateHarmonyScore"),
    ("primaryCareAccessDelayTurns", "aquiferReserveDelayTurns"),
    ("V1026RhsCareBand", "V1027WsecBasinBand"),
    ("V1026RhsBedBand", "V1027WsecFlowBand"),
    ("healthSystemBand", "waterSecurityBand"),
    ("HealthSystemBand", "WaterSecurityBand"),
    ("CareSnapshot", "BasinSnapshot"),
    ("PRIMARY_CARE_ACCESS_SHARD_COUNT", "AQUIFER_RESERVE_SHARD_COUNT"),
    ("HOSPITAL_NETWORK_COUNT", "DISTRIBUTION_NETWORK_COUNT"),
    ("regionalHealthSystemScore", "nationalWaterSecurityScore"),
    ("clinical/bed/primary-care", "surface/ground/aquifer"),
    ("clinical/bed primary care access", "surface/ground aquifer reserve"),
    ("regional health care", "regional water security"),
    ("bedHeadroom", "storageHeadroom"),
    ("surgeRiskStress", "droughtRiskStress"),
    ("clinical & allied health staffing", "hydrology & operations staffing"),
    (
        "CAPACITY STRESS, HOSPITAL NETWORKS & PRIMARY CARE ACCESS",
        "WATER STRESS, DISTRIBUTION NETWORKS & AQUIFER RESERVES",
    ),
    (
        "care scenarios, primary-care-access graph, hospital-network nodes, health system scoring",
        "basin scenarios, aquifer-reserve graph, distribution-network nodes, water security scoring",
    ),
    (
        "Care scenario matrix, primary-care-access graph, hospital-network nodes",
        "Basin scenario matrix, aquifer-reserve graph, distribution-network nodes",
    ),
    ("runV1026RhsTurn", "runV1027WsecTurn"),
    ("buildV1026RhsTurnInputFromGameState", "buildV1027WsecTurnInputFromGameState"),
    ("buildV1026RhsTurnInputFromGameStateStub", "buildV1027WsecTurnInputFromGameStateStub"),
    ("sanitizeV1026RhsPersisted", "sanitizeV1027WsecPersisted"),
    ("createEmptyV1026RhsPersisted", "createEmptyV1027WsecPersisted"),
    ("V1026RhsPersisted", "V1027WsecPersisted"),
    ("V1026RhsTurnInput", "V1027WsecTurnInput"),
    ("runV1026RhsSelfTests", "runV1027WsecSelfTests"),
    ("readV1026RhsClimateAdaptation20brBridge", "readV1027WsecClimateAdaptation20brBridge"),
    ("computeV1026RhsClimateAdaptation20brBridge", "computeV1027WsecClimateAdaptation20brBridge"),
    (
        "applyV1026RhsClimateAdaptation20brClimateAdaptationOverrides",
        "applyV1027WsecClimateAdaptation20brClimateAdaptationOverrides",
    ),
    ("V1026RhsClimateAdaptation20brSlice", "V1027WsecClimateAdaptation20brSlice"),
    ("gameState.v1026RegionalHealthSystems", "gameState.v1027WaterSecurity"),
    ("v1026RegionalHealthSystems", "v1027WaterSecurity"),
    ("v1026RhsdiversityStewardship", "v1027WaterSecurity"),
    ("run-v1026-rhs-self-tests.ts", "run-v1027-wsec-self-tests.ts"),
    ("scaffold_v1026.py", "scaffold_v1027.py"),
    ("hospital-network", "distribution-network"),
    ("access-", "reserve-"),
    ("V1026_RHS_CARE", "V1027_WSEC_BASIN"),
    ("V1026RhsCare", "V1027WsecBasin"),
    ("V1026RhsHealthSystem", "V1027WsecWaterSecurity"),
    ("healthSystemBandRank", "waterSecurityBandRank"),
    ("mergePrimaryCareAccessEdges", "mergeAquiferReserveEdges"),
    ("primaryCareAccessGraphHash", "aquiferReserveGraphHash"),
    ("GENERATED_PRIMARY_CARE_ACCESS", "GENERATED_AQUIFER_RESERVE"),
    ("regionalPrimaryCareAccess", "regionalAquiferReserve"),
    ("primaryCareAccessGraphRevision", "aquiferReserveGraphRevision"),
    ("primaryCareAccessPressure", "aquiferReservePressure"),
    ("primaryCareAccessIndex", "aquiferReserveIndex"),
    ("grid clinical load", "grid pumping load"),
    ("national care scenarios", "national basin scenarios"),
    (
        "national care scenarios, primary-care-access graph",
        "national basin scenarios, aquifer-reserve graph",
    ),
    ("readV1026RhsDigitalGovernance20btBridge", "readV1027WsecDigitalGovernance20btBridge"),
    ("computeV1026RhsDigitalGovernance20btBridge", "computeV1027WsecDigitalGovernance20btBridge"),
    (
        "applyV1026RhsDigitalGovernance20btDigitalGovernanceOverrides",
        "applyV1027WsecDigitalGovernance20btDigitalGovernanceOverrides",
    ),
    ("V1026RhsDigitalGovernance20btSlice", "V1027WsecDigitalGovernance20btSlice"),
    ("buildV1026RhsBriefing", "buildV1027WsecBriefing"),
    ("v1026RhsInputHash", "v1027WsecInputHash"),
    ("V1026RhsTurnResult", "V1027WsecTurnResult"),
    ("V1026RhsRegionId", "V1027WsecRegionId"),
    ("V1026RhsSupplyBridge", "V1027WsecSupplyBridge"),
    ("readV1026RhsSupply20bbBridge", "readV1027WsecSupply20bbBridge"),
    ("readV1026RhsTrade20baBridge", "readV1027WsecTrade20baBridge"),
    ("readV1026RhsEnergy20bcBridge", "readV1027WsecEnergy20bcBridge"),
    ("readV1026RhsWorkforce20bfBridge", "readV1027WsecWorkforce20bfBridge"),
    ("readV1026RhsPublicServices20azBridge", "readV1027WsecPublicServices20azBridge"),
    ("computeV1026RhsSupply20bbBridge", "computeV1027WsecSupply20bbBridge"),
    ("computeV1026RhsTrade20baBridge", "computeV1027WsecTrade20baBridge"),
    ("computeV1026RhsEnergy20bcBridge", "computeV1027WsecEnergy20bcBridge"),
    ("computeV1026RhsWorkforce20bfBridge", "computeV1027WsecWorkforce20bfBridge"),
    ("applyV1026RhsSupply20bbBottleneckOverrides", "applyV1027WsecSupply20bbBottleneckOverrides"),
    ("applyV1026RhsPublicServices20azServiceOverrides", "applyV1027WsecPublicServices20azServiceOverrides"),
    ("V1026RhsV1014SupplySlice", "V1027WsecV1014SupplySlice"),
    ("V1026RhsV1014TradeSlice", "V1027WsecV1014TradeSlice"),
    ("V1026RhsV1014EnergySlice", "V1027WsecV1014EnergySlice"),
    ("V1026RhsV1014WorkforceSlice", "V1027WsecV1014WorkforceSlice"),
    ("V1026RhsPublicServices20azSlice", "V1027WsecPublicServices20azSlice"),
    ("V1026_RHS_clamp", "V1027_WSEC_clamp"),
    ("V1026_RHS_hash", "V1027_WSEC_hash"),
    ("V1026_RHS_mixSeed", "V1027_WSEC_mixSeed"),
    ("V1026_RHS_weightedMean", "V1027_WSEC_weightedMean"),
    ("'overloaded'", "'depleted'"),
    ("id: 'care_", "id: 'basin_"),
    ("stress_", "basin_"),
]


def transform_file(path: pathlib.Path) -> None:
    if path.suffix not in {".ts", ".md", ".py"}:
        return
    if path.name in {"scaffold_v1026.py", "scaffold_v1027.py"}:
        return
    text = path.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    path.write_text(text, encoding="utf-8")


def rename_paths() -> None:
    renames = [
        (
            ROOT / "engine" / "regional-health-systems-orchestrator.ts",
            ROOT / "engine" / "water-security-orchestrator.ts",
        ),
        (
            ROOT / "engine" / "regional-health-systems-utils.ts",
            ROOT / "engine" / "water-security-utils.ts",
        ),
        (
            ROOT / "self-tests" / "run-v1026-rhs-self-tests.ts",
            ROOT / "self-tests" / "run-v1027-wsec-self-tests.ts",
        ),
        (ROOT / "primary-care-access-stacks", ROOT / "aquifer-reserve-stacks"),
        (ROOT / "hospital-network-nodes", ROOT / "distribution-network-nodes"),
    ]
    gen_old = ROOT / "generated" / "care-scenarios"
    if gen_old.exists():
        (ROOT / "generated" / "basin-scenarios").mkdir(exist_ok=True)
        for p in gen_old.glob("*.ts"):
            p.rename(ROOT / "generated" / "basin-scenarios" / p.name)
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
        "export type V1027WsecWaterSecurityBand = 'robust' | 'stable' | 'strained' | 'depleted' | 'critical';",
        "export type V1027WsecWaterSecurityBand = 'secure' | 'stable' | 'stressed' | 'depleted' | 'critical';",
    )
    text = re.sub(
        r"export type V1027WsecWaterSecurityChannel =[\s\S]*?;\n\nexport type V1027WsecWaterSecurityChannelLegacy =",
        """export type V1027WsecWaterSecurityChannel =
  | 'surface_water'
  | 'groundwater'
  | 'desalination'
  | 'irrigation'
  | 'urban_supply'
  | 'basin_allocation'
  | 'flood_mitigation'
  | 'environmental_flow'
  | 'regional'
  | 'remote';

export type V1027WsecWaterSecurityChannelLegacy =""",
        text,
        count=1,
    )
    bu_slice = """
/** Biodiversity / catchment stewardship slice (SECTION 20BU — upstream basin integrity). */
export interface V1027WsecBiodiversityStewardship20buSlice {
  turn: number;
  catchmentIntegrityPressure: number;
  grantStackLoad: number;
  offsetDriftTurns: number;
}
"""
    if "V1027WsecBiodiversityStewardship20buSlice" not in text:
        text = text.replace(
            "/** Digital governance distribution-network slice (SECTION 20BT — V1024 bridge). */",
            bu_slice + "\n/** Digital governance distribution-network slice (SECTION 20BT — V1024 bridge). */",
        )
    if "biodiversityStewardship20bu:" not in text:
        text = text.replace(
            "  digitalGovernance20bt: V1027WsecDigitalGovernance20btSlice;\n",
            "  digitalGovernance20bt: V1027WsecDigitalGovernance20btSlice;\n"
            "  biodiversityStewardship20bu: V1027WsecBiodiversityStewardship20buSlice;\n",
        )
    if "biodiversityStewardshipDelta?" not in text:
        text = text.replace(
            "  digitalGovernanceDelta?: number;\n",
            "  digitalGovernanceDelta?: number;\n  biodiversityStewardshipDelta?: number;\n",
        )
    path.write_text(text, encoding="utf-8")


def patch_crosswire_hub() -> None:
    path = ROOT / "adapters" / "adapter-crosswire-hub.ts"
    text = path.read_text(encoding="utf-8")
    if "readV1027WsecBiodiversityStewardship20buBridge" in text:
        return
    insert = """
export function readV1027WsecBiodiversityStewardship20buBridge(
  slice: import('../types/core').V1027WsecBiodiversityStewardship20buSlice,
  waterStressIndex: number,
) {
  const biodiversityStewardshipDelta = V1027_WSEC_clamp(
    slice.catchmentIntegrityPressure * 0.06 + slice.offsetDriftTurns * 0.05 + waterStressIndex * 0.05,
    -8,
    16,
  );
  return { bottleneckDelta: biodiversityStewardshipDelta, stockDaysDelta: {}, biodiversityStewardshipDelta };
}
"""
    text = text.replace(
        "export function buildV1027WsecBriefing(",
        insert + "\nexport function buildV1027WsecBriefing(",
    )
    path.write_text(text, encoding="utf-8")


def write_bu_adapter() -> None:
    path = ROOT / "adapters" / "adapter-biodiversity-stewardship-20bu.ts"
    path.write_text(
        """/**
 * Cross-wire: V1025 biodiversity stewardship catchment depth (SECTION 20BU — basin integrity bridge).
 */
import type { V1027WsecTurnInput, V1027WsecSupplyBridge } from '../types/core';
import { readV1027WsecBiodiversityStewardship20buBridge } from './adapter-crosswire-hub';
import { V1027_WSEC_clamp } from '../engine/water-security-utils';

export function computeV1027WsecBiodiversityStewardship20buBridge(
  input: V1027WsecTurnInput,
  waterStressIndex: number,
): V1027WsecSupplyBridge {
  return readV1027WsecBiodiversityStewardship20buBridge(input.biodiversityStewardship20bu, waterStressIndex);
}

export function applyV1027WsecBiodiversityStewardship20buOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1027WsecSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1027_WSEC_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.biodiversityStewardshipDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
""",
        encoding="utf-8",
    )


def patch_orchestrator() -> None:
    path = ROOT / "engine" / "water-security-orchestrator.ts"
    text = path.read_text(encoding="utf-8")
    if "computeV1027WsecBiodiversityStewardship20buBridge" not in text:
        text = text.replace(
            "import { computeV1027WsecDigitalGovernance20btBridge } from '../adapters/adapter-digital-governance-20bt';",
            "import { computeV1027WsecDigitalGovernance20btBridge } from '../adapters/adapter-digital-governance-20bt';\n"
            "import { computeV1027WsecBiodiversityStewardship20buBridge } from '../adapters/adapter-biodiversity-stewardship-20bu';",
        )
    if "biodiversityStewardship20bu:" not in text and "buildV1027WsecTurnInputFromGameStateStub" in text:
        text = text.replace(
            "digitalGovernance20bt: { turn, modelGovernancePressure: 24, grantStackLoad: 0.18, alignmentDriftTurns: 10 },",
            "digitalGovernance20bt: { turn, modelGovernancePressure: 24, grantStackLoad: 0.18, alignmentDriftTurns: 10 },\n"
            "    biodiversityStewardship20bu: { turn, catchmentIntegrityPressure: 32, grantStackLoad: 0.22, offsetDriftTurns: 14 },",
        )
    path.write_text(text, encoding="utf-8")


def patch_self_tests() -> None:
    path = ROOT / "self-tests" / "run-v1027-wsec-self-tests.ts"
    text = path.read_text(encoding="utf-8")
    for old, new in [
        ("capacityStressIndex", "waterStressIndex"),
        ("v1026_rhs", "v1027_wsec"),
        ("V1026", "V1027"),
    ]:
        text = text.replace(old, new)
    if "adapter-biodiversity-stewardship-20bu" not in text:
        text = text.replace(
            "import { computeV1027WsecDigitalGovernance20btBridge, applyV1027WsecDigitalGovernance20btDigitalGovernanceOverrides } from '../adapters/adapter-digital-governance-20bt';",
            "import { computeV1027WsecDigitalGovernance20btBridge, applyV1027WsecDigitalGovernance20btDigitalGovernanceOverrides } from '../adapters/adapter-digital-governance-20bt';\n"
            "import { computeV1027WsecBiodiversityStewardship20buBridge, applyV1027WsecBiodiversityStewardship20buOverrides } from '../adapters/adapter-biodiversity-stewardship-20bu';",
        )
    if "biodiversityStewardship20bu:" not in text:
        text = text.replace(
            "    digitalGovernance20bt: {\n      turn: 1,\n      modelGovernancePressure: 28,\n      grantStackLoad: 0.29,\n      alignmentDriftTurns: 18,\n    },",
            "    digitalGovernance20bt: {\n      turn: 1,\n      modelGovernancePressure: 28,\n      grantStackLoad: 0.29,\n      alignmentDriftTurns: 18,\n    },\n"
            "    biodiversityStewardship20bu: {\n      turn: 1,\n      catchmentIntegrityPressure: 34,\n      grantStackLoad: 0.25,\n      offsetDriftTurns: 16,\n    },",
        )
    if "20BU biodiversity adapter" not in text:
        block = """
  {
    const b = computeV1027WsecBiodiversityStewardship20buBridge(baseInput(), 0.24);
    const next = applyV1027WsecBiodiversityStewardship20buOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1027_wsec_20bu_bio',
      '20BU biodiversity adapter',
      (next.bottleneckPressure ?? 0) > 40,
    );
  }
"""
        text = text.replace(
            "  check(\n    results,\n    'v1027_wsec_20bt_dgov',",
            block + "\n  check(\n    results,\n    'v1027_wsec_20bt_dgov',",
        )
    path.write_text(text, encoding="utf-8")


def patch_run_self_tests() -> None:
    path = ROOT / "run-self-tests.ts"
    path.write_text(
        """#!/usr/bin/env node
import { runV1027WsecSelfTests } from './self-tests/run-v1027-wsec-self-tests.ts';

const r = runV1027WsecSelfTests();
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
        "**Branch:** `cursor/o6k-10m-v1027-water-security`  ",
        text,
        count=1,
    )
    text = text.replace("**`SECTION 20BV`**", "**`SECTION 20BW`**")
    text = text.replace(
        "V10.26 REGIONAL HEALTH SYSTEMS — CAPACITY STRESS, HOSPITAL NETWORKS & PRIMARY CARE ACCESS (O6K-59)",
        "V10.27 WATER SECURITY — WATER STRESS, DISTRIBUTION NETWORKS & AQUIFER RESERVES (O6K-61)",
    )
    text = text.replace("**`V1026_RHS_*`**", "**`V1027_WSEC_*`**")
    text = text.replace(
        "national care scenarios, conservation-offset graph, hospital-network nodes, stewardship scoring",
        "national basin scenarios, aquifer-reserve graph, distribution-network nodes, water security scoring",
    )
    upstream = """| Section | Role |
|---------|------|
| **20AZ** | Public services v2 — utility capacity, digital service coverage (`adapter-public-services-20az.ts`) |
| **20BR** | Climate adaptation (V1023) — drought/heat pressure, resilience drift (`adapter-climate-adaptation-20br.ts`) |
| **20BT** | Digital governance (V1024) — metering/compliance pressure (`adapter-digital-governance-20bt.ts`) |
| **20BC** | Energy depth — grid stability, pumping load (`adapter-v1014-energy-20bc.ts`) |
| **20BU** | Biodiversity stewardship — catchment integrity, offset drift (`adapter-biodiversity-stewardship-20bu.ts`) |
| **20BW** (this shard) | Basin scenario matrix, aquifer-reserve graph, distribution-network nodes |
"""
    text = re.sub(
        r"\| Section \| Role \|[\s\S]*?\*\*20B[UV]\*\* \(this shard\)[^\n]*\n",
        upstream,
        text,
        count=1,
    )
    text = text.replace("runV1026RhsTurn", "runV1027WsecTurn")
    text = text.replace("V1026RhsTurnInput", "V1027WsecTurnInput")
    text = text.replace("buildV1026RhsTurnInputFromGameState", "buildV1027WsecTurnInputFromGameState")
    text = text.replace("buildV1026RhsTurnInputFromGameStateStub", "buildV1027WsecTurnInputFromGameStateStub")
    text = text.replace("save.meta.v1026.regional_health_systems", "save.meta.v1027.water_security")
    text = text.replace("V1026RhsPersisted", "V1027WsecPersisted")
    text = text.replace("sanitizeV1026RhsPersisted", "sanitizeV1027WsecPersisted")
    text = text.replace("createEmptyV1026RhsPersisted", "createEmptyV1027WsecPersisted")
    text = text.replace("V1026_RHS_SCHEMA_VERSION", "V1027_WSEC_SCHEMA_VERSION")
    text = text.replace("V1026_RHS_PERSISTENCE_PATHS", "V1027_WSEC_PERSISTENCE_PATHS")
    text = text.replace("gameState.v1026RegionalHealthSystems", "gameState.v1027WaterSecurity")
    text = text.replace("**v1026_regional_health_systems**", "**v1027_water_security**")
    text = text.replace(
        "expansion/o6k-10m/v1026-regional-health-systems/run-self-tests.ts",
        "expansion/o6k-10m/v1027-water-security/run-self-tests.ts",
    )
    text = text.replace(
        "python3 expansion/o6k-10m/v1026-regional-health-systems/scripts/generate.py",
        "python3 expansion/o6k-10m/v1027-water-security/scripts/generate.py",
    )
    text = text.replace(
        "172 care scenarios × 72 coef rows, 90 conservation-offset shards, 24 hospital-network nodes.",
        "172 basin scenarios × 72 coef rows, 90 aquifer-reserve shards, 24 distribution-network nodes.",
    )
    text = text.replace("regional-health-systems-orchestrator.ts", "water-security-orchestrator.ts")
    text = text.replace("regional-health-systems-utils.ts", "water-security-utils.ts")
    text = text.replace("care-scenarios/", "basin-scenarios/")
    text = text.replace("primary-care-access-stacks/", "aquifer-reserve-stacks/")
    text = text.replace("care-registry.ts", "basin-registry.ts")
    text = text.replace("hospital-network-nodes/", "distribution-network-nodes/")
    text = text.replace("primary-care-access-stacks/graph-utils.ts", "aquifer-reserve-stacks/graph-utils.ts")
    text = text.replace(
        "| `adapters/` | 20AZ / 20BR / 20BT / 20BA / 20BB / 20BC / 20BF bridges |",
        "| `adapters/` | 20AZ / 20BR / 20BT / 20BU / 20BC bridges |",
    )
    path.write_text(text, encoding="utf-8")


def write_generate_py() -> None:
    src_gen = ROOT / "scripts" / "generate.py"
    text = src_gen.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    text = text.replace(
        'CHANNELS = ["emergency_care", "primary_access", "hospital_network", "telehealth", "rural_clinic", "specialist_referral", "aged_care", "mental_health", "regional", "remote"]',
        'CHANNELS = ["surface_water", "groundwater", "desalination", "irrigation", "urban_supply", "basin_allocation", "flood_mitigation", "environmental_flow", "regional", "remote"]',
    )
    text = text.replace('SCEN_DIR = GEN / "care-scenarios"', 'SCEN_DIR = GEN / "basin-scenarios"')
    text = text.replace('BUFFER_DIR = GEN / "primary-care-access-stacks"', 'BUFFER_DIR = GEN / "aquifer-reserve-stacks"')
    text = text.replace('FLOOD_DIR = ROOT / "hospital-network-nodes"', 'FLOOD_DIR = ROOT / "distribution-network-nodes"')
    src_gen.write_text(text, encoding="utf-8")


def main() -> None:
    rename_paths()
    write_generate_py()
    for p in ROOT.rglob("*"):
        if p.is_file():
            transform_file(p)
    patch_types_core()
    patch_crosswire_hub()
    write_bu_adapter()
    patch_self_tests()
    patch_integration()
    patch_run_self_tests()
    patch_orchestrator()
    subprocess.check_call([sys.executable, str(ROOT / "scripts" / "generate.py")], cwd=str(ROOT))


if __name__ == "__main__":
    main()
