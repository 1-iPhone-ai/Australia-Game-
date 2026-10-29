#!/usr/bin/env python3
"""Transform v1031 grid resilience copy into v1032 telecom resilience + regenerate TS."""
from __future__ import annotations

import pathlib
import re
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]

REPLACEMENTS = [
    ('v1031-grid-resilience', 'v1032-telecom-resilience'),
    ('V1031_GRES', 'V1032_TRES'),
    ('V1031Gres', 'V1032Tres'),
    ('v1031Gres', 'v1032Tres'),
    ('v1031_gres', 'v1032_tres'),
    ('grid_resilience', 'telecom_resilience'),
    ('grid-resilience', 'telecom-resilience'),
    ('v1031_grid_resilience', 'v1032_telecom_resilience'),
    ('save.meta.v1031.grid_resilience', 'save.meta.v1032.telecom_resilience'),
    ('save.meta.v1031.telecom_resilience', 'save.meta.v1032.telecom_resilience'),
    ('v1031_telecom_resilience', 'v1032_telecom_resilience'),
    ('10.30.grid_resilience.1', '10.32.telecom_resilience.1'),
    ('10.31.grid_resilience.1', '10.32.telecom_resilience.1'),
    ('O6K-67', 'O6K-68'),
    ('O6K-67', 'O6K-68'),
    ('V10.31 GRID / ENERGY NETWORK RESILIENCE', 'V10.32 TELECOMMUNICATIONS / DIGITAL NETWORK RESILIENCE'),
    ('Grid / energy network resilience', 'Telecommunications / digital network resilience'),
    ('Grid network resilience', 'Telecom network resilience'),
    ('grid network resilience', 'telecom network resilience'),
    ('Grid Network Resilience', 'Telecom Network Resilience'),
    ('outage-scenarios', 'failover-scenarios'),
    ('outage-registry', 'failover-registry'),
    ('outage_snapshots', 'failover_snapshots'),
    ('outageSnapshots', 'failoverSnapshots'),
    ('OUTAGE_SCENARIO', 'FAILOVER_SCENARIO'),
    ('Outage scenario', 'Failover scenario'),
    ('outage scenario', 'failover scenario'),
    ('activeOutageScenarioIds', 'activeFailoverScenarioIds'),
    ('activeSubstationZoneIds', 'activeExchangeZoneIds'),
    ('outageBatch', 'failoverBatch'),
    ('evaluateOutageBatch', 'evaluateFailoverBatch'),
    ('listActiveOutageScenarioIds', 'listActiveFailoverScenarioIds'),
    ('ALL_OUTAGE_SCENARIO', 'ALL_FAILOVER_SCENARIO'),
    ('runOutageScenarioRegressionSweep', 'runFailoverScenarioRegressionSweep'),
    ('OUTAGE_SCENARIO_COUNT', 'FAILOVER_SCENARIO_COUNT'),
    ('meanGridStressExposure', 'meanTelecomStressExposure'),
    ('meanGridResilienceScore', 'meanTelecomResilienceScore'),
    ('aggregateGridStressExposureIndex', 'aggregateTelecomStressExposureIndex'),
    ('aggregateGridStressExposure', 'aggregateTelecomStressExposure'),
    ('aggregateGridResilienceScore', 'aggregateTelecomResilienceScore'),
    ('aggregateGridResilience', 'aggregateTelecomResilience'),
    ('gridStressExposureIndex', 'telecomStressExposureIndex'),
    ('gridResilienceBandFromScore', 'telecomResilienceBandFromScore'),
    ('gridResilienceScore', 'telecomResilienceScore'),
    ('gridResilienceBand', 'telecomResilienceBand'),
    ('GridResilienceBand', 'TelecomResilienceBand'),
    ('grid-buffer-stacks', 'backbone-buffer-stacks'),
    ('grid-buffer-bundle', 'backbone-buffer-bundle'),
    ('gridBuffer', 'backboneBuffer'),
    ('GridBuffer', 'BackboneBuffer'),
    ('grid_buffer', 'backbone_buffer'),
    ('GRID_BUFFER', 'BACKBONE_BUFFER'),
    ('Grid buffer', 'Backbone buffer'),
    ('grid buffer', 'backbone buffer'),
    ('substation-zone-nodes', 'exchange-zone-nodes'),
    ('substation-zone-node', 'exchange-zone-node'),
    ('regional_substation_zone', 'regional_exchange_zone'),
    ('substation_zone', 'exchange_zone'),
    ('SUBSTATION_ZONE', 'EXCHANGE_ZONE'),
    ('Substation zone', 'Exchange zone'),
    ('substation zone', 'exchange zone'),
    ('substation-zone', 'exchange-zone'),
    ('GridResilienceChannel', 'TelecomResilienceChannel'),
    ('gridResilienceChannel', 'telecomResilienceChannel'),
    ('gridResiliencePolicyFocus', 'telecomResiliencePolicyFocus'),
    ('gridNetworkHarmonyScore', 'telecomNetworkHarmonyScore'),
    ('gridBufferDelayTurns', 'backboneBufferDelayTurns'),
    ('gridBufferGraphHash', 'backboneBufferGraphHash'),
    ('gridBufferPressure', 'backboneBufferPressure'),
    ('gridBufferGraphRevision', 'backboneBufferGraphRevision'),
    ('regionalGridBuffer', 'regionalBackboneBuffer'),
    ('gridBufferIndex', 'backboneBufferIndex'),
    ('OutageSnapshot', 'FailoverSnapshot'),
    ('nationalGridResilienceScore', 'nationalTelecomResilienceScore'),
    ('outageCascadeRisk', 'routingCascadeRisk'),
    ('GRID STRESS EXPOSURE, SUBSTATION ZONE NODES & GRID BUFFERS', 'TELECOM STRESS EXPOSURE, EXCHANGE ZONE NODES & BACKBONE BUFFERS'),
    ('outage scenarios, grid-buffer graph, substation-zone nodes, grid resilience scoring', 'failover scenarios, backbone-buffer graph, exchange-zone nodes, telecom resilience scoring'),
    ('Outage scenario matrix, grid-buffer graph, substation-zone nodes', 'Failover scenario matrix, backbone-buffer graph, exchange-zone nodes'),
    ('runV1031GresTurn', 'runV1032TresTurn'),
    ('buildV1031GresTurnInputFromGameState', 'buildV1032TresTurnInputFromGameState'),
    ('buildV1031GresTurnInputFromGameStateStub', 'buildV1032TresTurnInputFromGameStateStub'),
    ('sanitizeV1031GresPersisted', 'sanitizeV1032TresPersisted'),
    ('createEmptyV1031GresPersisted', 'createEmptyV1032TresPersisted'),
    ('runV1032TresSelfTests', 'runV1032TresSelfTests'),
    ('run-v1032-tres-self-tests.ts', 'run-v1032-tres-self-tests.ts'),
    ('scaffold_v1031.py', 'scaffold_v1032.py'),
    ("id: 'outage_", "id: 'failover_"),
    ('gameState.v1031GridResilience', 'gameState.v1032TelecomResilience'),
    ('v1031GridResilience', 'v1032TelecomResilience'),
    ('mergeGridBufferEdges', 'mergeBackboneBufferEdges'),
    ('GENERATED_GRID_BUFFER', 'GENERATED_BACKBONE_BUFFER'),
    ('grid restoration load', 'telecom restoration load'),
    ('national outage scenarios', 'national failover scenarios'),
    ('national outage scenarios, grid-buffer graph', 'national failover scenarios, backbone-buffer graph'),
    ('readV1031GresInlandHeat20bzBridge', 'readV1032TresGridResilience20caBridge'),
    ('computeV1032TresGridResilience20caBridge', 'computeV1032TresGridResilience20caBridge'),
    ('applyV1032TresGridResilience20caOverrides', 'applyV1032TresGridResilience20caOverrides'),
    ('V1031GresInlandHeat20bzSlice', 'V1032TresGridResilience20caSlice'),
    ('inlandHeat20bz', 'gridResilience20ca'),
    ('inlandHeatDelta', 'gridResilienceDelta'),
    ('adapter-grid-resilience-20ca', 'adapter-grid-resilience-20ca'),
    ('20BZ inland heat', '20CA grid resilience'),
    ('v1032_tres_20ca_gres', 'v1032_tres_20ca_gres'),
    ('Inland heat', 'Grid resilience'),
    ('inland heat', 'grid resilience'),
    ('inlandHeatExposurePressure', 'gridStressExposurePressure'),
    ('heatwaveDriftTurns', 'outageDriftTurns'),
    ('readV1031GresClimateAdaptation20brBridge', 'readV1032TresClimateAdaptation20brBridge'),
    ('computeV1031GresClimateAdaptation20brBridge', 'computeV1032TresClimateAdaptation20brBridge'),
    ('applyV1031GresClimateAdaptation20brClimateAdaptationOverrides', 'applyV1032TresClimateAdaptation20brClimateAdaptationOverrides'),
    ('V1031GresClimateAdaptation20brSlice', 'V1032TresClimateAdaptation20brSlice'),
    ('readV1031GresDigitalGovernance20btBridge', 'readV1032TresDigitalGovernance20btBridge'),
    ('computeV1031GresDigitalGovernance20btBridge', 'computeV1032TresDigitalGovernance20btBridge'),
    ('applyV1031GresDigitalGovernance20btDigitalGovernanceOverrides', 'applyV1032TresDigitalGovernance20btDigitalGovernanceOverrides'),
    ('V1031GresDigitalGovernance20btSlice', 'V1032TresDigitalGovernance20btSlice'),
    ('buildV1031GresBriefing', 'buildV1032TresBriefing'),
    ('v1031GresInputHash', 'v1032TresInputHash'),
    ('V1031GresTurnResult', 'V1032TresTurnResult'),
    ('V1031GresRegionId', 'V1032TresRegionId'),
    ('V1031GresSupplyBridge', 'V1032TresSupplyBridge'),
    ('readV1031GresSupply20bbBridge', 'readV1032TresSupply20bbBridge'),
    ('readV1031GresTrade20baBridge', 'readV1032TresTrade20baBridge'),
    ('readV1031GresEnergy20bcBridge', 'readV1032TresEnergy20bcBridge'),
    ('readV1031GresWorkforce20bfBridge', 'readV1032TresWorkforce20bfBridge'),
    ('readV1031GresPublicServices20azBridge', 'readV1032TresPublicServices20azBridge'),
    ('computeV1031GresSupply20bbBridge', 'computeV1032TresSupply20bbBridge'),
    ('computeV1031GresTrade20baBridge', 'computeV1032TresTrade20baBridge'),
    ('computeV1031GresEnergy20bcBridge', 'computeV1032TresEnergy20bcBridge'),
    ('computeV1031GresWorkforce20bfBridge', 'computeV1032TresWorkforce20bfBridge'),
    ('applyV1031GresSupply20bbBottleneckOverrides', 'applyV1032TresSupply20bbBottleneckOverrides'),
    ('applyV1031GresPublicServices20azServiceOverrides', 'applyV1032TresPublicServices20azServiceOverrides'),
    ('V1031GresV1014SupplySlice', 'V1032TresV1014SupplySlice'),
    ('V1031GresV1014TradeSlice', 'V1032TresV1014TradeSlice'),
    ('V1031GresV1014EnergySlice', 'V1032TresV1014EnergySlice'),
    ('V1031GresV1014WorkforceSlice', 'V1032TresV1014WorkforceSlice'),
    ('V1031GresPublicServices20azSlice', 'V1032TresPublicServices20azSlice'),
    ('V1031_GRES_clamp', 'V1032_TRES_clamp'),
    ('V1031_GRES_hash', 'V1032_TRES_hash'),
    ('V1031_GRES_mixSeed', 'V1032_TRES_mixSeed'),
    ('V1031_GRES_weightedMean', 'V1032_TRES_weightedMean'),
    ('readV1031GresRegionalHealthSystems20bvBridge', 'readV1032TresRegionalHealthSystems20bvBridge'),
    ('computeV1031GresRegionalHealthSystems20bvBridge', 'computeV1032TresRegionalHealthSystems20bvBridge'),
    ('applyV1031GresRegionalHealthSystems20bvOverrides', 'applyV1032TresRegionalHealthSystems20bvOverrides'),
    ('V1031GresBiodiversityStewardship20buSlice', 'V1032TresBiodiversityStewardship20buSlice'),
    ('readV1031GresWaterSecurity20bwBridge', 'readV1032TresWaterSecurity20bwBridge'),
    ('computeV1031GresWaterSecurity20bwBridge', 'computeV1032TresWaterSecurity20bwBridge'),
    ('applyV1031GresWaterSecurity20bwOverrides', 'applyV1032TresWaterSecurity20bwOverrides'),
    ('V1031GresWaterSecurity20bwSlice', 'V1032TresWaterSecurity20bwSlice'),
    ('readV1031GresDisasterResilience20bxBridge', 'readV1032TresDisasterResilience20bxBridge'),
    ('computeV1031GresDisasterResilience20bxBridge', 'computeV1032TresDisasterResilience20bxBridge'),
    ('applyV1031GresDisasterResilience20bxOverrides', 'applyV1032TresDisasterResilience20bxOverrides'),
    ('V1031GresDisasterResilience20bxSlice', 'V1032TresDisasterResilience20bxSlice'),
    ('v1031_gres_20bx_dres', 'v1032_tres_20bx_dres'),
    ('V1031GresTurnInput', 'V1032TresTurnInput'),
    ('V1031GresPersisted', 'V1032TresPersisted'),
    ('V1031GresRuntimeState', 'V1032TresRuntimeState'),
    ('V1031GresSelfTestResult', 'V1032TresSelfTestResult'),
    ('V1031GresTradeBridge', 'V1032TresTradeBridge'),
    ('V1031GresEnergyBridge', 'V1032TresEnergyBridge'),
    ('V1031GresWorkforceBridge', 'V1032TresWorkforceBridge'),
    ('V1031GresGridBufferEdge', 'V1032TresBackboneBufferEdge'),
    ('V1031_GRES_LAB_SUITE_ID', 'V1032_TRES_LAB_SUITE_ID'),
    ('V1031_GRES_PERSISTENCE_PATHS', 'V1032_TRES_PERSISTENCE_PATHS'),
    ('V1031_GRES_SCHEMA_VERSION', 'V1032_TRES_SCHEMA_VERSION'),
    ('V1031_GRES_SUBSTATION_ZONE_', 'V1032_TRES_EXCHANGE_ZONE_'),
    ('GRID_BUFFER_SHARD_COUNT', 'BACKBONE_BUFFER_SHARD_COUNT'),
    ('SUBSTATION_ZONE_COUNT', 'EXCHANGE_ZONE_COUNT'),
    ('outage_', 'failover_'),
]


def transform_file(path: pathlib.Path) -> None:
    if path.suffix not in {".ts", ".md", ".py"}:
        return
    if path.name in {"scaffold_v1031.py", "scaffold_v1032.py"}:
        return
    text = path.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    text = text.replace("SECTION 20CA / O6K-68", "SECTION 20CB / O6K-68")
    text = text.replace("SECTION 20CA", "SECTION 20CB")
    text = text.replace("**20CA** (this shard)", "**20CB** (this shard)")
    text = text.replace("Grid / energy network resilience v1", "Telecommunications / digital network resilience v1")
    path.write_text(text, encoding="utf-8")


def rename_paths() -> None:
    renames = [
        (ROOT / "engine" / "grid-resilience-orchestrator.ts", ROOT / "engine" / "telecom-resilience-orchestrator.ts"),
        (ROOT / "engine" / "grid-resilience-utils.ts", ROOT / "engine" / "telecom-resilience-utils.ts"),
        (ROOT / "self-tests" / "run-v1031-gres-self-tests.ts", ROOT / "self-tests" / "run-v1032-tres-self-tests.ts"),
        (ROOT / "grid-buffer-stacks", ROOT / "backbone-buffer-stacks"),
        (ROOT / "substation-zone-nodes", ROOT / "exchange-zone-nodes"),
    ]
    gen_old = ROOT / "generated" / "outage-scenarios"
    if gen_old.exists():
        (ROOT / "generated" / "failover-scenarios").mkdir(exist_ok=True)
        for p in gen_old.glob("*.ts"):
            p.rename(ROOT / "generated" / "failover-scenarios" / p.name)
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
        r"export type V1032TresTelecomResilienceChannel =[\s\S]*?;\n\nexport type V1032TresTelecomResilienceChannelLegacy =",
        """export type V1032TresTelecomResilienceChannel =
  | 'fiber_backbone'
  | '5g_ran'
  | 'satellite_backhaul'
  | 'ixp_peering'
  | 'dns_anycast'
  | 'cdn_edge'
  | 'last_mile'
  | 'enterprise_circuit'
  | 'regional'
  | 'remote';

export type V1032TresTelecomResilienceChannelLegacy =""",
        text,
        count=1,
    )
    if "gridResilienceDelta" not in text:
        text = text.replace(
            "disasterResilienceDelta?: number;",
            "disasterResilienceDelta?: number;\n  gridResilienceDelta?: number;",
        )
    path.write_text(text, encoding="utf-8")


def patch_crosswire_hub() -> None:
    path = ROOT / "adapters" / "adapter-crosswire-hub.ts"
    text = path.read_text(encoding="utf-8")
    if "readV1032TresGridResilience20caBridge" in text:
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


def write_ca_adapter() -> None:
    path = ROOT / "adapters" / "adapter-grid-resilience-20ca.ts"
    path.write_text(
        """/**
 * Cross-wire: V1031 grid resilience depth (SECTION 20CA — heatwave / arid-buffer bridge).
 */
import type { V1031GresTurnInput, V1031GresSupplyBridge } from '../types/core';
import { readV1031GresInlandHeat20bzBridge } from './adapter-crosswire-hub';
import { V1031_GRES_clamp } from '../engine/telecom-resilience-utils';

export function computeV1032TresGridResilience20caBridge(
  input: V1031GresTurnInput,
  gridStressExposureIndex: number,
): V1031GresSupplyBridge {
  return readV1032TresGridResilience20caBridge(input.gridResilience20ca, gridStressExposureIndex);
}

export function applyV1032TresGridResilience20caOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1031GresSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1031_GRES_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.gridResilienceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
""",
        encoding="utf-8",
    )


def patch_orchestrator() -> None:
    path = ROOT / "engine" / "telecom-resilience-orchestrator.ts"
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    text = text.replace(
        "computeV1031GresWaterSecurity20bwBridge",
        "computeV1032TresGridResilience20caBridge",
    )
    text = text.replace("adapter-water-security-20bw", "adapter-grid-resilience-20ca")
    if "computeV1032TresGridResilience20caBridge" not in text:
        text = text.replace(
            "import { computeV1031GresRegionalHealthSystems20bvBridge } from '../adapters/adapter-regional-health-systems-20bv';",
            "import { computeV1031GresRegionalHealthSystems20bvBridge } from '../adapters/adapter-regional-health-systems-20bv';\n"
            "import { computeV1032TresGridResilience20caBridge } from '../adapters/adapter-grid-resilience-20ca';\n"
            "import { computeV1031GresDisasterResilience20bxBridge } from '../adapters/adapter-disaster-resilience-20bx';",
        )
    stub_block = "regionalHealthSystems20bv: { turn, hospitalSurgePressure: 32, grantStackLoad: 0.22, bedCapacityDriftTurns: 14 },"
    if "gridResilience20ca:" not in text and stub_block in text:
        text = text.replace(
            stub_block,
            stub_block
            + "\n    gridResilience20ca: { turn, gridStressExposurePressure: 36, grantStackLoad: 0.2, outageDriftTurns: 12 },"
            + "\n    disasterResilience20bx: { turn, activeCrisisLoad: 0.35, coordinationLagTurns: 8, escalationPressure: 22 },",
        )
    path.write_text(text, encoding="utf-8")


def patch_self_tests() -> None:
    path = ROOT / "self-tests" / "run-v1032-tres-self-tests.ts"
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    text = text.replace("adapter-water-security-20bw", "adapter-grid-resilience-20ca")
    text = text.replace("computeV1031GresWaterSecurity20bwBridge", "computeV1032TresGridResilience20caBridge")
    text = text.replace("applyV1031GresWaterSecurity20bwOverrides", "applyV1032TresGridResilience20caOverrides")
    text = text.replace("waterSecurity20bw:", "gridResilience20ca:")
    text = text.replace("supplyStressPressure:", "gridStressExposurePressure:")
    text = text.replace("basinDriftTurns:", "outageDriftTurns:")
    text = text.replace("v1031_gres_20bw_wsec", "v1032_tres_20ca_gres")
    text = text.replace("20BW water security adapter", "20CA grid resilience adapter")
    path.write_text(text, encoding="utf-8")


def patch_run_self_tests() -> None:
    path = ROOT / "run-self-tests.ts"
    path.write_text(
        """#!/usr/bin/env node
import { runV1032TresSelfTests } from './self-tests/run-v1032-tres-self-tests.ts';

const r = runV1032TresSelfTests();
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
        "**Branch:** `cursor/o6k-10m-v1032-telecom-resilience`  ",
        text,
        count=1,
    )
    upstream = """| Section | Role |
|---------|------|
| **20AZ** | Public services v2 — cooling centers, digital alerting (`adapter-public-services-20az.ts`) |
| **20BR** | Climate adaptation (V1023) — heat pressure, resilience drift (`adapter-climate-adaptation-20br.ts`) |
| **20BV** | Regional health systems (V1026) — hospital surge, bed drift (`adapter-regional-health-systems-20bv.ts`) |
| **20BW** | Water security (V1027) — supply stress under telecom stress (`adapter-water-security-20bw.ts`) |
| **20BX** | Disaster resilience (V1028) — compound hazards, evacuation lag (`adapter-disaster-resilience-20bx.ts`) |
| **20BY** | Coastal resilience (V1029) — surge / sea-level handoff (`adapter-coastal-resilience-20by.ts`) |
| **20BZ** | Inland heat (V1030) — heatwave / arid-buffer handoff (`adapter-inland-heat-20bz.ts`) |
| **20CA** | Grid resilience (V1031) — outage / grid-buffer handoff (`adapter-grid-resilience-20ca.ts`) |
| **20CB** (this shard) | Failover scenario matrix, backbone-buffer graph, exchange-zone nodes |
"""
    text = re.sub(
        r"\| Section \| Role \|[\s\S]*?\*\*20C[A-Z]\*\* \(this shard\)[^\n]*\n",
        upstream,
        text,
        count=1,
    )
    text = text.replace(
        "172 heatwave scenarios × 72 coef rows, 90 arid-buffer shards, 24 inland-zone nodes.",
        "172 failover scenarios × 72 coef rows, 90 backbone-buffer shards, 24 exchange-zone nodes.",
    )
    text = text.replace(
        "python3 expansion/o6k-10m/v1030-inland-heat/scripts/generate.py",
        "python3 expansion/o6k-10m/v1032-telecom-resilience/scripts/generate.py",
    )
    text = text.replace(
        "npx tsx expansion/o6k-10m/v1030-inland-heat/run-self-tests.ts",
        "npx tsx expansion/o6k-10m/v1032-telecom-resilience/run-self-tests.ts",
    )
    text = text.replace(
        "| `adapters/` | 20AZ / 20BR / 20BV / 20BW / 20BX / 20BY / 20BC bridges |",
        "| `adapters/` | 20AZ / 20BR / 20BV / 20BW / 20BX / 20BY / 20BZ / 20CA / 20BC bridges |",
    )
    path.write_text(text, encoding="utf-8")


def write_generate_py() -> None:
    src_gen = ROOT / "scripts" / "generate.py"
    text = src_gen.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    text = text.replace("SECTION 20CA / O6K-68", "SECTION 20CB / O6K-68")
    text = text.replace("SECTION 20CA", "SECTION 20CB")
    text = text.replace(
        'CHANNELS = ["emergency_care", "primary_access", "inland_zone", "telehealth", "rural_clinic", "specialist_referral", "aged_care", "mental_health", "regional", "remote"]',
        'CHANNELS = ["fiber_backbone", "5g_ran", "satellite_backhaul", "ixp_peering", "dns_anycast", "cdn_edge", "last_mile", "enterprise_circuit", "regional", "remote"]',
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
    write_ca_adapter()
    patch_self_tests()
    patch_integration()
    patch_run_self_tests()
    patch_orchestrator()
    subprocess.check_call([sys.executable, str(ROOT / "scripts" / "generate.py")], cwd=str(ROOT))


if __name__ == "__main__":
    main()
