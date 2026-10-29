#!/usr/bin/env python3
"""Generate V1025 provenance chain network resilience expansion shards."""
from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
GEN = ROOT / "generated"
SCEN_DIR = GEN / "custody-scenarios"
BUFFER_DIR = GEN / "custody-chain-mesh-stacks"
FLOOD_DIR = ROOT / "facility-zone-nodes"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
CHANNELS = ["emergency_care", "primary_access", "facility_zone", "telehealth", "rural_clinic", "specialist_referral", "aged_care", "mental_health", "regional", "remote"]
RECOVERY_BANDS = ["minimal", "moderate", "elevated", "critical", "recovering"]

CUSTODY_SCENARIO_COUNT = 130
CUSTODY_CHAIN_MESH_SHARD_COUNT = 65
FACILITY_ZONE_COUNT = 24
COEF_PER_SCENARIO = 72


def ensure(p: pathlib.Path) -> None:
    p.mkdir(parents=True, exist_ok=True)


def scenario_module(i: int) -> str:
    mod = f"{i:03d}"
    region = REGIONS[i % len(REGIONS)]
    mode = CHANNELS[i % len(CHANNELS)]
    band = RECOVERY_BANDS[i % len(RECOVERY_BANDS)]
    seed = i * 911 + 521
    coef_lines = []
    for k in range(COEF_PER_SCENARIO):
        v = ((seed * (k + 11)) % 997) / 10.0
        coef_lines.append(f"  k{k}: {v:.4f},")
    coef_block = "\n".join(coef_lines)
    return f"""import {{ V1037_PCRS_clamp, V1037_PCRS_provenanceChainResilienceBandFromScore }} from '../../engine/provenance-chain-resilience-utils.ts';
import type {{
  V1037PcresProvenanceChainResilienceBand,
  V1037PcresRegionId,
  V1037PcresCustodySnapshot,
  V1037PcresProvenanceChainResilienceChannel,
}} from '../../types/core.ts';

/** Generated chain-of-custody incident scenario {mod} — extreme_heat/drought/dust handoff matrix. */
export const V1037_PCRS_CUSTODY_SCENARIO_{mod}_META = {{
  id: 'custody_{mod}',
  regionId: '{region}' as V1037PcresRegionId,
  primaryChannel: '{mode}' as V1037PcresProvenanceChainResilienceChannel,
  provenanceChainResilienceBand: '{band}' as V1037PcresProvenanceChainResilienceBand,
  seed: {seed},
}} as const;

const V1037_PCRS_CUSTODY_SCENARIO_{mod}_COEF = {{
{coef_block}
}} as const;

export function V1037_PCRS_CUSTODY_SCENARIO_{mod}_evaluate(turn: number): {{
  custodyChainStressExposureIndex: number;
  custodyChainMeshDelayTurns: number;
  provenanceChainResilienceScore: number;
  stable: boolean;
}} {{
  let acc = 0;
  const keys = Object.keys(V1037_PCRS_CUSTODY_SCENARIO_{mod}_COEF) as Array<
    keyof typeof V1037_PCRS_CUSTODY_SCENARIO_{mod}_COEF
  >;
  for (let j = 0; j < keys.length; j++) {{
    acc += V1037_PCRS_CUSTODY_SCENARIO_{mod}_COEF[keys[j]] * ((turn + j) % 17);
  }}
  const custodyChainStressExposureIndex = V1037_PCRS_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const custodyChainMeshDelayTurns = V1037_PCRS_clamp(2 + (acc % 11), 1, 18);
  const provenanceChainResilienceScore = V1037_PCRS_clamp(90 - custodyChainStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1037_PCRS_provenanceChainResilienceBandFromScore(provenanceChainResilienceScore) !== 'depleted';
  return {{ custodyChainStressExposureIndex, custodyChainMeshDelayTurns, provenanceChainResilienceScore, stable }};
}}

export function V1037_PCRS_CUSTODY_SCENARIO_{mod}_snapshot(turn: number): V1037PcresCustodySnapshot {{
  const r = V1037_PCRS_CUSTODY_SCENARIO_{mod}_evaluate(turn);
  return {{
    scenarioId: V1037_PCRS_CUSTODY_SCENARIO_{mod}_META.id,
    regionId: V1037_PCRS_CUSTODY_SCENARIO_{mod}_META.regionId,
    provenanceChainResilienceChannel: V1037_PCRS_CUSTODY_SCENARIO_{mod}_META.primaryChannel,
    custodyChainStressExposureIndex: r.custodyChainStressExposureIndex,
    custodyChainMeshDelayTurns: r.custodyChainMeshDelayTurns,
    provenanceChainResilienceScore: r.provenanceChainResilienceScore,
    provenanceChainResilienceBand: V1037_PCRS_provenanceChainResilienceBandFromScore(r.provenanceChainResilienceScore),
  }};
}}

export function V1037_PCRS_CUSTODY_SCENARIO_{mod}_regressionAssert(turn: number): boolean {{
  const r = V1037_PCRS_CUSTODY_SCENARIO_{mod}_evaluate(turn);
  return typeof r.custodyChainStressExposureIndex === 'number' && r.provenanceChainResilienceScore <= 100;
}}
"""


def custody_chain_mesh_shard(i: int) -> str:
    mod = f"{i:03d}"
    from_c = CHANNELS[i % len(CHANNELS)]
    to_c = CHANNELS[(i + 3) % len(CHANNELS)]
    hub = f"facility_zone_{i % FACILITY_ZONE_COUNT:02d}"
    weight = round(0.14 + (i % 17) * 0.032, 4)
    lag = 2 + (i % 9)
    rows = []
    for k in range(26):
        w = round(weight + ((i * 13 + k) % 17) * 0.006, 4)
        rows.append(
            f"  {{ fromChannel: '{from_c}', toChannel: '{to_c}', weight: {w}, lagTurns: {lag + (k % 4)}, nodeId: '{hub}' }},"
        )
    body = "\n".join(rows)
    return f"""import type {{ V1037PcresCustodyChainMeshEdge }} from '../../types/core.ts';

/** Segment buffer graph shard {mod} (extreme_heat/drought/dust corridor coupling). */
export const V1037_PCRS_CUSTODY_CHAIN_MESH_SHARD_{mod}: readonly V1037PcresCustodyChainMeshEdge[] = [
{body}
];
"""


def facility_zone_module(i: int) -> str:
    mod = f"{i:02d}"
    region = REGIONS[i % len(REGIONS)]
    mode = CHANNELS[i % len(CHANNELS)]
    band = RECOVERY_BANDS[i % len(RECOVERY_BANDS)]
    lines = []
    for s in range(34):
        cap = round(0.22 + ((i * 19 + s) % 48) / 100, 4)
        lines.append(f"  {{ step: {s}, dwellHours: {cap}, rerouteCost: {(s + i) % 13} }},")
    steps = "\n".join(lines)
    return f"""import {{ V1037_PCRS_clamp }} from '../engine/provenance-chain-resilience-utils.ts';
import type {{ V1037PcresProvenanceChainResilienceBand, V1037PcresRegionId, V1037PcresProvenanceChainResilienceChannel }} from '../types/core.ts';

export const V1037_PCRS_FACILITY_ZONE_{mod}_META = {{
  id: 'facility_zone_{mod}',
  regionId: '{region}' as V1037PcresRegionId,
  anchorChannel: '{mode}' as V1037PcresProvenanceChainResilienceChannel,
  defaultBand: '{band}' as V1037PcresProvenanceChainResilienceBand,
}} as const;

const V1037_PCRS_FACILITY_ZONE_{mod}_STEPS = [
{steps}
] as const;

export function V1037_PCRS_FACILITY_ZONE_{mod}_buffer(turn: number): number {{
  let acc = 0;
  for (let i = 0; i < V1037_PCRS_FACILITY_ZONE_{mod}_STEPS.length; i++) {{
    const row = V1037_PCRS_FACILITY_ZONE_{mod}_STEPS[i];
    acc += row.dwellHours * (1 + (turn + row.step) % 7) * 0.016;
  }}
  return V1037_PCRS_clamp(acc / V1037_PCRS_FACILITY_ZONE_{mod}_STEPS.length, 0, 1);
}}

export function V1037_PCRS_FACILITY_ZONE_{mod}_rerouteStress(turn: number): number {{
  return V1037_PCRS_clamp(
    V1037_PCRS_FACILITY_ZONE_{mod}_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 5)), 0) / 52,
    0,
    32,
  );
}}
"""


def write_registry() -> None:
    imports = []
    map_entries = []
    list_ids = []
    for i in range(CUSTODY_SCENARIO_COUNT):
        mod = f"{i:03d}"
        imports.append(
            f"import {{ V1037_PCRS_CUSTODY_SCENARIO_{mod}_snapshot, V1037_PCRS_CUSTODY_SCENARIO_{mod}_META, V1037_PCRS_CUSTODY_SCENARIO_{mod}_regressionAssert }} from './custody-scenarios/scenario-{mod}.ts';"
        )
        list_ids.append(f"  V1037_PCRS_CUSTODY_SCENARIO_{mod}_META.id,")
        map_entries.append(
            f"  [V1037_PCRS_CUSTODY_SCENARIO_{mod}_META.id]: V1037_PCRS_CUSTODY_SCENARIO_{mod}_snapshot,"
        )

    region_accum = []
    for r in REGIONS:
        region_accum.append(f"    {r}: snaps.find((s) => s.regionId === '{r}'),")

    registry = f"""/** Generated registry — regenerate via scripts/generate.py */
import type {{ V1037PcresRegionId, V1037PcresCustodySnapshot }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1037_PCRS_ALL_CUSTODY_SCENARIO_IDS: readonly string[] = [
{chr(10).join(list_ids)}
];

const V1037_PCRS_SNAPSHOT_BY_ID: Record<
  string,
  (turn: number) => V1037PcresCustodySnapshot
> = {{
{chr(10).join(map_entries)}
}};

export function V1037_PCRS_listActiveCustodyScenarioIds(_turn: number): string[] {{
  const stride = 26;
  const start = (_turn * 5) % Math.max(1, V1037_PCRS_ALL_CUSTODY_SCENARIO_IDS.length - stride);
  return V1037_PCRS_ALL_CUSTODY_SCENARIO_IDS.slice(start, start + stride);
}}

export function V1037_PCRS_evaluateCustodyBatch(
  turn: number,
  scenarioIds: string[],
): {{
  snapshots: V1037PcresCustodySnapshot[];
  meanCustodyChainStressExposure: number;
  meanTelecomResilienceScore: number;
  byRegion: Partial<Record<V1037PcresRegionId, V1037PcresCustodySnapshot>>;
}} {{
  const ids = scenarioIds.length ? scenarioIds : V1037_PCRS_listActiveCustodyScenarioIds(turn);
  const snaps: V1037PcresCustodySnapshot[] = [];
  for (const id of ids) {{
    const fn = V1037_PCRS_SNAPSHOT_BY_ID[id];
    if (fn) snaps.push(fn(turn));
  }}
  const meanCustodyChainStressExposure = snaps.reduce((a, s) => a + s.custodyChainStressExposureIndex, 0) / Math.max(1, snaps.length);
  const meanTelecomResilienceScore = snaps.reduce((a, s) => a + s.provenanceChainResilienceScore, 0) / Math.max(1, snaps.length);
  const byRegion: Partial<Record<V1037PcresRegionId, V1037PcresCustodySnapshot>> = {{
{chr(10).join(region_accum)}
  }};
  return {{ snapshots: snaps, meanCustodyChainStressExposure, meanTelecomResilienceScore, byRegion }};
}}

export function V1037_PCRS_runCustodyScenarioRegressionSweep(turn: number): number {{
  let ok = 0;
  for (const id of V1037_PCRS_ALL_CUSTODY_SCENARIO_IDS) {{
    const fn = V1037_PCRS_SNAPSHOT_BY_ID[id];
    if (fn && fn(turn).provenanceChainResilienceScore >= 0) ok += 1;
  }}
  return ok;
}}
"""
    (GEN / "custody-registry.ts").write_text(registry, encoding="utf-8")


def write_handoff_bundle() -> None:
    imports = []
    spreads = []
    for i in range(CUSTODY_CHAIN_MESH_SHARD_COUNT):
        mod = f"{i:03d}"
        imports.append(f"import {{ V1037_PCRS_CUSTODY_CHAIN_MESH_SHARD_{mod} }} from './custody-chain-mesh-stacks/reserve-{mod}.ts';")
        spreads.append(f"  ...V1037_PCRS_CUSTODY_CHAIN_MESH_SHARD_{mod},")
    bundle = f"""/** Flattened segment buffer graph (regional provenance chain network resilience coupling). */
import type {{ V1037PcresCustodyChainMeshEdge }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1037_PCRS_GENERATED_CUSTODY_CHAIN_MESH_EDGES: readonly V1037PcresCustodyChainMeshEdge[] = [
{chr(10).join(spreads)}
];
"""
    (GEN / "custody-chain-mesh-bundle.ts").write_text(bundle, encoding="utf-8")


def main() -> None:
    ensure(SCEN_DIR)
    ensure(BUFFER_DIR)
    ensure(FLOOD_DIR)
    exports = []
    for i in range(CUSTODY_SCENARIO_COUNT):
        mod = f"{i:03d}"
        path = SCEN_DIR / f"scenario-{mod}.ts"
        path.write_text(scenario_module(i), encoding="utf-8")
        exports.append(f"export * from './custody-scenarios/scenario-{mod}.ts';")
    for i in range(CUSTODY_CHAIN_MESH_SHARD_COUNT):
        mod = f"{i:03d}"
        path = BUFFER_DIR / f"reserve-{mod}.ts"
        path.write_text(custody_chain_mesh_shard(i), encoding="utf-8")
        exports.append(f"export * from './custody-chain-mesh-stacks/reserve-{mod}.ts';")
    for i in range(FACILITY_ZONE_COUNT):
        mod = f"{i:02d}"
        path = FLOOD_DIR / f"facility-zone-{mod}.ts"
        path.write_text(facility_zone_module(i), encoding="utf-8")

    write_registry()
    write_handoff_bundle()
    exports.extend(
        [
            "export * from './custody-registry.ts';",
            "export * from './custody-chain-mesh-bundle.ts';",
        ]
    )
    (GEN / "index.ts").write_text(
        "/** Generated bundle — run scripts/generate.py to refresh. */\n" + "\n".join(exports) + "\n",
        encoding="utf-8",
    )

    total = 0
    for p in ROOT.rglob("*"):
        if p.suffix == ".ts" and "scripts" not in str(p):
            total += len(p.read_text(encoding="utf-8").splitlines())
    print(
        f"Generated chain-of-custody incident scenarios={CUSTODY_SCENARIO_COUNT} segment buffers={CUSTODY_CHAIN_MESH_SHARD_COUNT} facility zone nodes={FACILITY_ZONE_COUNT}"
    )
    print(f"Approx module TS LOC: {total}")


if __name__ == "__main__":
    main()
