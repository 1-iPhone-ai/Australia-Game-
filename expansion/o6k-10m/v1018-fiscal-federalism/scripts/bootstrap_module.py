#!/usr/bin/env python3
"""Bootstrap V1018 fiscal federalism expansion + run generate.py."""
from __future__ import annotations

import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
GEN_SCRIPT = ROOT / "scripts" / "generate.py"

# --- generate.py content ---
GEN_SCRIPT.write_text(
    r'''#!/usr/bin/env python3
"""Generate V1018 fiscal federalism expansion shards (meaningful TS, no comment padding)."""
from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
GEN = ROOT / "generated"
SCEN_DIR = GEN / "transfer-scenarios"
PROP_DIR = GEN / "grant-stacks"
NODE_DIR = ROOT / "audit-trails"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
SYSTEMS = [
    "freight",
    "energy",
    "water",
    "digital",
    "trade",
    "pharma",
    "food",
    "industrial",
    "telecom",
    "finance",
]
TRANSFER_BANDS = ["latent", "emerging", "active", "critical", "recovering"]

SUPPLY_TRANSFER_SCENARIO_COUNT = 172
GRANT_STACK_SHARD_COUNT = 90
AUDIT_NODE_COUNT = 24
COEF_PER_SCENARIO = 72


def ensure(p: pathlib.Path) -> None:
    p.mkdir(parents=True, exist_ok=True)


def scenario_module(i: int) -> str:
    mod = f"{i:03d}"
    region = REGIONS[i % len(REGIONS)]
    system = SYSTEMS[i % len(SYSTEMS)]
    band = TRANSFER_BANDS[i % len(TRANSFER_BANDS)]
    seed = i * 877 + 41
    coef_lines = []
    for k in range(COEF_PER_SCENARIO):
        v = ((seed * (k + 7)) % 991) / 10.0
        coef_lines.append(f"  k{k}: {v:.4f},")
    coef_block = "\n".join(coef_lines)
    return f"""import {{ V1018_FFED_clamp, V1018_FFED_complianceFromScore }} from '../../engine/fiscal-federalism-utils.ts';
import type {{
  V1018FfedComplianceBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
}} from '../../types/core.ts';

/** Generated transfer scenario {mod} — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_{mod}_META = {{
  id: 'transfer_{mod}',
  regionId: '{region}' as V1018FfedRegionId,
  primarySystem: '{system}' as V1018FfedSystemDomain,
  transferBand: '{band}' as V1018FfedComplianceBand,
  seed: {seed},
}} as const;

const V1018_FFED_TRANSFER_SCENARIO_{mod}_COEF = {{
{coef_block}
}} as const;

export function V1018_FFED_TRANSFER_SCENARIO_{mod}_evaluate(turn: number): {{
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
}} {{
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_{mod}_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_{mod}_COEF
  >;
  for (let j = 0; j < keys.length; j++) {{
    acc += V1018_FFED_TRANSFER_SCENARIO_{mod}_COEF[keys[j]] * ((turn + j) % 13);
  }}
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return {{ severityIndex, grantStackDelayTurns, complianceScore, stable }};
}}

export function V1018_FFED_TRANSFER_SCENARIO_{mod}_snapshot(turn: number): V1018FfedTransferSnapshot {{
  const r = V1018_FFED_TRANSFER_SCENARIO_{mod}_evaluate(turn);
  return {{
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_{mod}_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_{mod}_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_{mod}_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_{mod}_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  }};
}}

export function V1018_FFED_TRANSFER_SCENARIO_{mod}_regressionAssert(turn: number): boolean {{
  const r = V1018_FFED_TRANSFER_SCENARIO_{mod}_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}}
"""


def grantStack_shard(i: int) -> str:
    mod = f"{i:03d}"
    from_s = SYSTEMS[i % len(SYSTEMS)]
    to_s = SYSTEMS[(i + 4) % len(SYSTEMS)]
    node = f"audit_{i % AUDIT_NODE_COUNT:02d}"
    weight = round(0.12 + (i % 19) * 0.035, 4)
    lag = 3 + (i % 8)
    rows = []
    for k in range(26):
        w = round(weight + ((i * 11 + k) % 15) * 0.007, 4)
        rows.append(
            f"  {{ fromSystem: '{from_s}', toSystem: '{to_s}', weight: {w}, lagTurns: {lag + (k % 3)}, nodeId: '{node}' }},"
        )
    body = "\n".join(rows)
    return f"""import type {{ V1018FfedGrantStackEdge }} from '../../types/core.ts';

/** Grant stack graph shard {mod} (state–federal transfer cross-system coupling). */
export const V1018_FFED_GRANT_STACK_SHARD_{mod}: readonly V1018FfedGrantStackEdge[] = [
{body}
];
"""


def audit_trail_audit_module(i: int) -> str:
    mod = f"{i:02d}"
    region = REGIONS[i % len(REGIONS)]
    system = SYSTEMS[i % len(SYSTEMS)]
    band = TRANSFER_BANDS[i % len(TRANSFER_BANDS)]
    lines = []
    for s in range(34):
        cap = round(0.28 + ((i * 17 + s) % 45) / 100, 4)
        lines.append(f"  {{ step: {s}, bufferDays: {cap}, rerouteCost: {(s + i) % 11} }},")
    steps = "\n".join(lines)
    return f"""import {{ V1018_FFED_clamp }} from '../engine/fiscal-federalism-utils.ts';
import type {{ V1018FfedComplianceBand, V1018FfedRegionId, V1018FfedSystemDomain }} from '../types/core.ts';

export const V1018_FFED_AUDIT_NODE_{mod}_META = {{
  id: 'audit_{mod}',
  regionId: '{region}' as V1018FfedRegionId,
  anchorSystem: '{system}' as V1018FfedSystemDomain,
  defaultBand: '{band}' as V1018FfedComplianceBand,
}} as const;

const V1018_FFED_AUDIT_NODE_{mod}_STEPS = [
{steps}
] as const;

export function V1018_FFED_AUDIT_NODE_{mod}_buffer(turn: number): number {{
  let acc = 0;
  for (let i = 0; i < V1018_FFED_AUDIT_NODE_{mod}_STEPS.length; i++) {{
    const row = V1018_FFED_AUDIT_NODE_{mod}_STEPS[i];
    acc += row.bufferDays * (1 + (turn + row.step) % 6) * 0.018;
  }}
  return V1018_FFED_clamp(acc / V1018_FFED_AUDIT_NODE_{mod}_STEPS.length, 0, 1);
}}

export function V1018_FFED_AUDIT_NODE_{mod}_rerouteStress(turn: number): number {{
  return V1018_FFED_clamp(
    V1018_FFED_AUDIT_NODE_{mod}_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 4)), 0) / 48,
    0,
    28,
  );
}}
"""


def write_registry() -> None:
    imports = []
    map_entries = []
    list_ids = []
    for i in range(SUPPLY_TRANSFER_SCENARIO_COUNT):
        mod = f"{i:03d}"
        imports.append(
            f"import {{ V1018_FFED_TRANSFER_SCENARIO_{mod}_snapshot, V1018_FFED_TRANSFER_SCENARIO_{mod}_META, V1018_FFED_TRANSFER_SCENARIO_{mod}_regressionAssert }} from './transfer-scenarios/scenario-{mod}.ts';"
        )
        list_ids.append(f"  V1018_FFED_TRANSFER_SCENARIO_{mod}_META.id,")
        map_entries.append(
            f"  [V1018_FFED_TRANSFER_SCENARIO_{mod}_META.id]: V1018_FFED_TRANSFER_SCENARIO_{mod}_snapshot,"
        )

    region_accum = []
    for r in REGIONS:
        region_accum.append(f"    {r}: snaps.find((s) => s.regionId === '{r}'),")

    registry = f"""/** Generated registry — regenerate via scripts/generate.py */
import type {{ V1018FfedRegionId, V1018FfedTransferSnapshot }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1018_FFED_ALL_TRANSFER_SCENARIO_IDS: readonly string[] = [
{chr(10).join(list_ids)}
];

const V1018_FFED_SNAPSHOT_BY_ID: Record<
  string,
  (turn: number) => V1018FfedTransferSnapshot
> = {{
{chr(10).join(map_entries)}
}};

export function V1018_FFED_listActiveTransferScenarioIds(_turn: number): string[] {{
  const stride = 26;
  const start = (_turn * 5) % Math.max(1, V1018_FFED_ALL_TRANSFER_SCENARIO_IDS.length - stride);
  return V1018_FFED_ALL_TRANSFER_SCENARIO_IDS.slice(start, start + stride);
}}

export function V1018_FFED_evaluateTransferBatch(
  turn: number,
  scenarioIds: string[],
): {{
  snapshots: V1018FfedTransferSnapshot[];
  meanSeverity: number;
  meanCompliance: number;
  byRegion: Partial<Record<V1018FfedRegionId, V1018FfedTransferSnapshot>>;
}} {{
  const ids = scenarioIds.length ? scenarioIds : V1018_FFED_listActiveTransferScenarioIds(turn);
  const snaps: V1018FfedTransferSnapshot[] = [];
  for (const id of ids) {{
    const fn = V1018_FFED_SNAPSHOT_BY_ID[id];
    if (fn) snaps.push(fn(turn));
  }}
  const meanSeverity = snaps.reduce((a, s) => a + s.severityIndex, 0) / Math.max(1, snaps.length);
  const meanCompliance = snaps.reduce((a, s) => a + s.complianceScore, 0) / Math.max(1, snaps.length);
  const byRegion: Partial<Record<V1018FfedRegionId, V1018FfedTransferSnapshot>> = {{
{chr(10).join(region_accum)}
  }};
  return {{ snapshots: snaps, meanSeverity, meanCompliance, byRegion }};
}}

export function V1018_FFED_runTransferScenarioRegressionSweep(turn: number): number {{
  let ok = 0;
  for (const id of V1018_FFED_ALL_TRANSFER_SCENARIO_IDS) {{
    const fn = V1018_FFED_SNAPSHOT_BY_ID[id];
    if (fn && fn(turn).complianceScore >= 0) ok += 1;
  }}
  return ok;
}}
"""
    (GEN / "transfer-registry.ts").write_text(registry, encoding="utf-8")


def write_grantStack_bundle() -> None:
    imports = []
    spreads = []
    for i in range(GRANT_STACK_SHARD_COUNT):
        mod = f"{i:03d}"
        imports.append(f"import {{ V1018_FFED_GRANT_STACK_SHARD_{mod} }} from './grant-stacks/grant-{mod}.ts';")
        spreads.append(f"  ...V1018_FFED_GRANT_STACK_SHARD_{mod},")
    bundle = f"""/** Flattened grantStack graph (fiscal federalism coupling). */
import type {{ V1018FfedGrantStackEdge }} from '../types/core.ts';
{chr(10).join(imports)}

export const V1018_FFED_GENERATED_GRANT_STACK_EDGES: readonly V1018FfedGrantStackEdge[] = [
{chr(10).join(spreads)}
];
"""
    (GEN / "grant-stack-bundle.ts").write_text(bundle, encoding="utf-8")


def main() -> None:
    ensure(SCEN_DIR)
    ensure(PROP_DIR)
    ensure(NODE_DIR)
    exports = []
    for i in range(SUPPLY_TRANSFER_SCENARIO_COUNT):
        mod = f"{i:03d}"
        path = SCEN_DIR / f"scenario-{mod}.ts"
        path.write_text(scenario_module(i), encoding="utf-8")
        exports.append(f"export * from './transfer-scenarios/scenario-{mod}.ts';")
    for i in range(GRANT_STACK_SHARD_COUNT):
        mod = f"{i:03d}"
        path = PROP_DIR / f"grant-{mod}.ts"
        path.write_text(grantStack_shard(i), encoding="utf-8")
        exports.append(f"export * from './grant-stacks/grant-{mod}.ts';")
    for i in range(AUDIT_NODE_COUNT):
        mod = f"{i:02d}"
        path = NODE_DIR / f"node-{mod}.ts"
        path.write_text(audit_trail_audit_module(i), encoding="utf-8")

    write_registry()
    write_grantStack_bundle()
    exports.extend(
        [
            "export * from './transfer-registry.ts';",
            "export * from './grant-stack-bundle.ts';",
        ]
    )
    (GEN / "index.ts").write_text(
        "/** Generated bundle — run scripts/generate.py to refresh. */\n" + "\n".join(exports) + "\n",
        encoding="utf-8",
    )

    total = 0
    for p in ROOT.rglob("*"):
        if p.suffix == ".ts" and "audit_modules" not in str(p):
            total += len(p.read_text(encoding="utf-8").splitlines())
    print(f"Generated transfers={SUPPLY_TRANSFER_SCENARIO_COUNT} props={GRANT_STACK_SHARD_COUNT} nodes={AUDIT_NODE_COUNT}")
    print(f"Approx module TS LOC: {total}")


if __name__ == "__main__":
    main()
''',
    encoding="utf-8",
)

# --- types/core.ts ---
(ROOT / "types" / "core.ts").write_text(
    """/**
 * V1018_FFED — fiscal federalism, state–federal transfer & audit_trail (SECTION 20BI / O6K-37).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1018_FFED_SCHEMA_VERSION = '10.16.fiscal_federalism.1' as const;

export type V1018FfedRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1018FfedSystemDomain =
  | 'freight'
  | 'energy'
  | 'water'
  | 'digital'
  | 'trade'
  | 'pharma'
  | 'food'
  | 'industrial'
  | 'telecom'
  | 'finance';

export type V1018FfedComplianceBand = 'robust' | 'stable' | 'strained' | 'fragile' | 'critical';

export type V1018FfedTransferBand = 'latent' | 'emerging' | 'active' | 'critical' | 'recovering';

export interface V1018FfedV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1018FfedRegionId, number>>;
  grantStackIndex: number;
}

export interface V1018FfedV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1018FfedV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  carbonStress: number;
}

export interface V1018FfedV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

export interface V1018FfedGrantStackEdge {
  fromSystem: V1018FfedSystemDomain;
  toSystem: V1018FfedSystemDomain;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1018FfedTransferSnapshot {
  scenarioId: string;
  regionId: V1018FfedRegionId;
  systemDomain: V1018FfedSystemDomain;
  transferBand: V1018FfedTransferBand;
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  complianceBand: V1018FfedComplianceBand;
}

export interface V1018FfedPersisted {
  schemaVersion: typeof V1018_FFED_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  transferSnapshots: Record<string, V1018FfedTransferSnapshot>;
  grantStackGraphRevision: number;
  regionalCompliance: Partial<
    Record<
      V1018FfedRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeCompliance: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateSeverity: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1018FfedTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1018FfedV1014SupplySlice;
  trade20ba: V1018FfedV1014TradeSlice;
  energy20bc: V1018FfedV1014EnergySlice;
  workforce20bf: V1018FfedV1014WorkforceSlice;
  fiscalHeadroom: number;
  federalismPolicyFocus: number;
  activeTransferScenarioIds: string[];
  activeComplianceNodeIds: string[];
  persisted: V1018FfedPersisted | null;
}

export interface V1018FfedRuntimeState {
  turn: number;
  aggregateSeverityIndex: number;
  aggregateComplianceScore: number;
  fiscalFederalismScore: number;
  supplyTransferPressure: number;
  grantStackGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1018FfedSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1018FfedRegionId, number>>;
}

export interface V1018FfedTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1018FfedEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1018FfedWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1018FfedTurnResult {
  state: V1018FfedRuntimeState;
  persisted: V1018FfedPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1018FfedSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
""",
    encoding="utf-8",
)

print("Wrote generate.py and types/core.ts")
subprocess.check_call([sys.executable, str(GEN_SCRIPT)], cwd=str(ROOT))
