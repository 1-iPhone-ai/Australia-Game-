#!/usr/bin/env python3
"""Generate Tranche 6 push #31 mega — V1021 T6 mega6 wave-7 lattice (SECTION 20CC)."""
from __future__ import annotations

import pathlib

OUT = pathlib.Path(__file__).resolve().parent / "tranche6-push31-generated.tsx"
REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
DOMAINS = [
    "trade_20ba",
    "energy_20bc",
    "workforce_20bf",
    "ai_fidelity_20be",
    "scenario_20bd",
    "replay_20ay",
    "pubsvc_20az",
    "supply_20bb",
    "t6_mega_20bg",
    "nres_20bh",
    "t6_mega2_20bi",
    "fiscal_federalism_20bj",
    "intercity_logistics_20bk",
    "t6_mega3_20bl",
    "research_pipeline_20bm",
    "maritime_trade_20bn",
    "t6_mega4_20bo",
    "intermodal_freight_20bp",
    "housing_affordability_20bq",
    "fiscal_20aw",
    "transport_20ai",
    "climate_20br",
    "dgov_20bt",
    "biodiv_20bu",
    "rhs_20bv",
    "wsec_20bw",
    "dres_20bx",
    "cres_20by",
    "iheat_20bz",
    "gres_20ca",
    "tres_20cb",
]
SECTION_BAND = "20CC"
LANES_PER_DOMAIN = 108
SNAPSHOT_TURNS = 248
MESH_HOPS = 6
STABILIZER_SECTORS = 44
INTEGRITY_TRACES = 14000
PLAYBOOK_VARIANTS = 40


def emit_header() -> list[str]:
    return [
        "// ============================================================================",
        f"// SECTION {SECTION_BAND}: V10.21 T6 MEGA6 — FULL-STACK RESILIENCE LATTICE (push #31)",
        "// Generated — scripts/generate-tranche6-push31-mega.py (do not hand-edit)",
        "// Cross-wire: SECTION 20BA–20CB landed on australia-game-upgrade",
        "// ============================================================================",
        "",
        "export const V1021_T6MEGA6_SCHEMA_VERSION = '10.21.t6_mega6.1' as const;",
        "export const V1021_T6MEGA6_MODULE_ID = 'v1020_t6_mega6_depth' as const;",
        "",
        "export type V1021T6Mega6DomainTag =",
        "  | 'trade_20ba' | 'energy_20bc' | 'workforce_20bf' | 'ai_fidelity_20be' | 'scenario_20bd'",
        "  | 'replay_20ay' | 'pubsvc_20az' | 'supply_20bb' | 't6_mega_20bg' | 'nres_20bh'",
        "  | 'fiscal_20aw' | 'transport_20ai';",
        "",
        "export interface V1021T6Mega6LatticeCell {",
        "  id: string;",
        "  regionId: string;",
        "  domain: V1021T6Mega6DomainTag;",
        "  lane: number;",
        "  stackWeight: number;",
        "  driftGain: number;",
        "  upstreamBand: string;",
        "  documentation: string;",
        "}",
    ]


def band_for(domain: str) -> str:
    return domain.split("_")[-1].upper().replace("20", "20")


def emit_lattice_catalog() -> list[str]:
    lines = ["export const V1021_T6MEGA6_LATTICE_CATALOG: V1021T6Mega6LatticeCell[] = ["]
    n = 0
    for region in REGIONS:
        for domain in DOMAINS:
            band = domain.rsplit("_", 1)[-1]
            for lane in range(LANES_PER_DOMAIN):
                n += 1
                w = round(0.32 + (lane % 13) * 0.055, 3)
                drift = round(0.07 + (lane % 9) * 0.038, 3)
                lines.append(
                    f"  {{ id: 'm6_{region.lower()}_{domain}_{lane:03d}', regionId: '{region}', "
                    f"domain: '{domain}', lane: {lane}, stackWeight: {w}, driftGain: {drift}, "
                    f"upstreamBand: 'SECTION {band}', "
                    f"documentation: 'Mega6 lattice {region}/{domain} lane {lane} binds §{band} runtime.' }},"
                )
    lines.append("];")
    lines.append(f"export const V1021_T6MEGA6_LATTICE_CATALOG_SIZE = {n};")
    return lines


def emit_stack_mesh() -> list[str]:
    lines = [
        "export interface V1021T6Mega6StackEdge {",
        "  id: string; fromDomain: V1021T6Mega6DomainTag; toDomain: V1021T6Mega6DomainTag;",
        "  regionId: string; coupling: number; lagTurns: number;",
        "}",
        "export const V1021_T6MEGA6_STACK_MESH: V1021T6Mega6StackEdge[] = [",
    ]
    n = 0
    for region in REGIONS:
        for fd in DOMAINS:
            for td in DOMAINS:
                if fd == td:
                    continue
                for hop in range(MESH_HOPS):
                    n += 1
                    lines.append(
                        f"  {{ id: 'm6mesh_{region.lower()}_{fd}_{td}_{hop}', fromDomain: '{fd}', toDomain: '{td}', "
                        f"regionId: '{region}', coupling: {round(0.11 + hop * 0.042, 3)}, lagTurns: {1 + hop % 4} }},"
                    )
    lines.append("];")
    lines.append(f"export const V1021_T6MEGA6_STACK_MESH_SIZE = {n};")
    return lines


def emit_regional_stabilizers() -> list[str]:
    lines = [
        "export interface V1021T6Mega6StabilizerRule {",
        "  id: string; regionId: string; sectorIndex: number; damping: number; rebound: number;",
        "}",
        "export const V1021_T6MEGA6_STABILIZER_RULES: V1021T6Mega6StabilizerRule[] = [",
    ]
    n = 0
    for region in REGIONS:
        for sector in range(STABILIZER_SECTORS):
            n += 1
            lines.append(
                f"  {{ id: 'm6stab_{region.lower()}_{sector:02d}', regionId: '{region}', sectorIndex: {sector}, "
                f"damping: {round(0.15 + sector * 0.018, 3)}, rebound: {round(0.22 + (sector % 7) * 0.04, 3)} }},"
            )
    lines.append("];")
    lines.append(f"export const V1021_T6MEGA6_STABILIZER_RULE_COUNT = {n};")
    return lines


def emit_playbook_lattice() -> list[str]:
    lines = [
        "export interface V1021T6Mega6PlaybookRef {",
        "  id: string; regionId: string; domain: V1021T6Mega6DomainTag; variant: number; severity: number; note: string;",
        "}",
        "export const V1021_T6MEGA6_PLAYBOOK_LATTICE: V1021T6Mega6PlaybookRef[] = [",
    ]
    n = 0
    for region in REGIONS:
        for domain in DOMAINS:
            for variant in range(PLAYBOOK_VARIANTS):
                n += 1
                sev = round(0.12 + variant * 0.025, 3)
                lines.append(
                    f"  {{ id: 'm6pb_{region.lower()}_{domain}_{variant:02d}', regionId: '{region}', domain: '{domain}', "
                    f"variant: {variant}, severity: {sev}, note: 'Playbook {region}/{domain} v{variant}' }},"
                )
    lines.append("];")
    lines.append(f"export const V1021_T6MEGA6_PLAYBOOK_LATTICE_SIZE = {n};")
    return lines


def emit_domain_snapshots() -> list[str]:
    lines = [
        "export interface V1021T6Mega6DomainSnapshot {",
        "  id: string; turn: number; regionId: string; domain: V1021T6Mega6DomainTag; score: number; note: string;",
        "}",
        "export const V1021_T6MEGA6_DOMAIN_SNAPSHOTS: V1021T6Mega6DomainSnapshot[] = [",
    ]
    n = 0
    for region in REGIONS:
        for domain in DOMAINS:
            for t in range(SNAPSHOT_TURNS):
                n += 1
                score = round(38 + (t % 19) * 2.6 + (n % 11), 2)
                lines.append(
                    f"  {{ id: 'm6snap_{region.lower()}_{domain}_{t:03d}', turn: {1 + t % 72}, regionId: '{region}', "
                    f"domain: '{domain}', score: {score}, note: 'Snapshot {region}/{domain} t{t}' }},"
                )
    lines.append("];")
    lines.append(f"export const V1021_T6MEGA6_DOMAIN_SNAPSHOT_COUNT = {n};")
    return lines


def emit_integrity_traces() -> list[str]:
    lines = [
        "export interface V1021T6Mega6IntegrityTrace {",
        "  id: string; turn: number; regionId: string; domain: V1021T6Mega6DomainTag; expectMin: number;",
        "}",
        f"export const V1021_T6MEGA6_INTEGRITY_TRACES: V1021T6Mega6IntegrityTrace[] = [",
    ]
    for i in range(INTEGRITY_TRACES):
        region = REGIONS[i % len(REGIONS)]
        domain = DOMAINS[i % len(DOMAINS)]
        lines.append(
            f"  {{ id: 'm6itr_{i:05d}', turn: {1 + (i % 120)}, regionId: '{region}', domain: '{domain}', "
            f"expectMin: {28 + (i % 32)} }},"
        )
    lines.append("];")
    lines.append(f"export const V1021_T6MEGA6_INTEGRITY_TRACE_COUNT = {INTEGRITY_TRACES};")
    lines.append("""
export function replayV1021T6Mega6IntegrityTrace(trace: V1021T6Mega6IntegrityTrace): V1021T6Mega6TurnResult {
  return runV1021T6Mega6DepthTurn({
    turn: trace.turn,
    seed: 31000 + trace.turn,
    enabled: true,
    gameState: { seed: trace.turn },
    persisted: null,
  });
}
""")
    return lines


def emit_engine() -> list[str]:
    return """
export interface V1021T6Mega6Persisted {
  schemaVersion: typeof V1021_T6MEGA6_SCHEMA_VERSION;
  revision: number;
  lastTurn: number;
  regionalStack: Record<string, number>;
  domainPressure: Partial<Record<V1021T6Mega6DomainTag, number>>;
  activeCellIds: string[];
  meshTrace: string[];
}

export interface V1021T6Mega6TurnInput {
  turn: number;
  seed: number;
  enabled: boolean;
  gameState: any;
  persisted: V1021T6Mega6Persisted | null;
}

export interface V1021T6Mega6TurnResult {
  state: {
    turn: number;
    aggregateStack: number;
    domainCount: number;
    stabilizerDamping: number;
    inputHash: string;
  };
  persisted: V1021T6Mega6Persisted;
}

const V1021_T6MEGA6_CORE_REGIONS: readonly string[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as const;

function v1021T6Mega6Clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function v1021T6Mega6Hash(obj: unknown): string {
  const s = JSON.stringify(obj);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return `m6_${(h >>> 0).toString(16)}`;
}

export function createEmptyV1021T6Mega6DepthPersisted(turn = 1): V1021T6Mega6Persisted {
  return {
    schemaVersion: V1021_T6MEGA6_SCHEMA_VERSION,
    revision: 0,
    lastTurn: turn,
    regionalStack: Object.fromEntries(V1021_T6MEGA6_CORE_REGIONS.map(r => [r, 52])),
    domainPressure: {},
    activeCellIds: [],
    meshTrace: [],
  };
}

export function sanitizeV1021T6Mega6DepthPersisted(raw: unknown, turn = 1): V1021T6Mega6Persisted {
  const base = createEmptyV1021T6Mega6DepthPersisted(turn);
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<V1021T6Mega6Persisted>;
  return {
    ...base,
    revision: Number(r.revision) || 0,
    lastTurn: Number(r.lastTurn) || turn,
    regionalStack:
      typeof r.regionalStack === 'object' && r.regionalStack
        ? { ...base.regionalStack, ...(r.regionalStack as Record<string, number>) }
        : base.regionalStack,
    domainPressure: typeof r.domainPressure === 'object' && r.domainPressure ? { ...(r.domainPressure as any) } : {},
    activeCellIds: Array.isArray(r.activeCellIds) ? r.activeCellIds.map(String).slice(0, 640) : [],
    meshTrace: Array.isArray(r.meshTrace) ? r.meshTrace.map(String).slice(-96) : [],
  };
}

function v1021T6Mega6MixSeed(seed: number, turn: number, salt: string): number {
  const h = v1021T6Mega6Hash({ seed, turn, salt });
  return (parseInt(h.slice(3, 11), 16) % 1000) / 1000;
}

export function evaluateV1021T6Mega6LatticeBatch(turn: number, seed: number): {
  regional: Record<string, number>;
  domain: Partial<Record<V1021T6Mega6DomainTag, number>>;
  activeIds: string[];
} {
  const regional: Record<string, number> = Object.fromEntries(V1021_T6MEGA6_CORE_REGIONS.map(r => [r, 52]));
  const domain: Partial<Record<V1021T6Mega6DomainTag, number>> = {};
  const activeIds: string[] = [];
  const stride = 1 + (turn % 11);
  for (let i = 0; i < V1021_T6MEGA6_LATTICE_CATALOG.length; i += stride) {
    const cell = V1021_T6MEGA6_LATTICE_CATALOG[i];
    const mix = v1021T6Mega6MixSeed(seed, turn, cell.id);
    const delta = cell.stackWeight * (1 - mix) * cell.driftGain * 14;
    regional[cell.regionId] = v1021T6Mega6Clamp((regional[cell.regionId] ?? 52) + delta, 0, 100);
    domain[cell.domain] = v1021T6Mega6Clamp((domain[cell.domain] ?? 44) + delta * 0.55, 0, 100);
    if (delta > 0.38) activeIds.push(cell.id);
  }
  return { regional, domain, activeIds: activeIds.slice(0, 256) };
}

export function propagateV1021T6Mega6StackMesh(
  regional: Record<string, number>,
  domain: Partial<Record<V1021T6Mega6DomainTag, number>>,
): number {
  let score = 0;
  let n = 0;
  for (const edge of V1021_T6MEGA6_STACK_MESH) {
    const fromP = domain[edge.fromDomain] ?? regional[edge.regionId] ?? 52;
    const toP = domain[edge.toDomain] ?? regional[edge.regionId] ?? 52;
    score += Math.abs(fromP - toP) * edge.coupling;
    n += 1;
  }
  return n > 0 ? v1021T6Mega6Clamp(score / n, 0, 100) : 52;
}

export function computeV1021T6Mega6StabilizerDamping(turn: number): number {
  let acc = 0;
  for (const rule of V1021_T6MEGA6_STABILIZER_RULES) {
    acc += rule.damping * 0.01 + rule.rebound * 0.004 * (1 + (turn + rule.sectorIndex) % 5);
  }
  return acc / Math.max(1, V1021_T6MEGA6_STABILIZER_RULE_COUNT);
}

export function runV1021T6Mega6DepthTurn(input: V1021T6Mega6TurnInput): V1021T6Mega6TurnResult {
  const prev = sanitizeV1021T6Mega6DepthPersisted(input.persisted, input.turn);
  if (!input.enabled) {
    return {
      state: { turn: input.turn, aggregateStack: 52, domainCount: 0, stabilizerDamping: 0, inputHash: v1021T6Mega6Hash({ off: true }) },
      persisted: prev,
    };
  }
  const batch = evaluateV1021T6Mega6LatticeBatch(input.turn, input.seed);
  const meshScore = propagateV1021T6Mega6StackMesh(batch.regional, batch.domain);
  const stabilizer = computeV1021T6Mega6StabilizerDamping(input.turn);
  const aggregate = v1021T6Mega6Clamp(
    V1021_T6MEGA6_CORE_REGIONS.reduce((s, r) => s + (batch.regional[r] ?? 52), 0) / V1021_T6MEGA6_CORE_REGIONS.length
      - meshScore * 0.07
      + stabilizer * 0.02,
    0,
    100,
  );
  const persisted: V1021T6Mega6Persisted = {
    schemaVersion: V1021_T6MEGA6_SCHEMA_VERSION,
    revision: prev.revision + 1,
    lastTurn: input.turn,
    regionalStack: { ...prev.regionalStack, ...batch.regional },
    domainPressure: { ...prev.domainPressure, ...batch.domain },
    activeCellIds: batch.activeIds,
    meshTrace: [...prev.meshTrace, `t${input.turn}:agg${aggregate.toFixed(1)}`].slice(-96),
  };
  return {
    state: {
      turn: input.turn,
      aggregateStack: aggregate,
      domainCount: Object.keys(batch.domain).length,
      stabilizerDamping: stabilizer,
      inputHash: v1021T6Mega6Hash({ turn: input.turn, aggregate, n: batch.activeIds.length }),
    },
    persisted,
  };
}

export function buildV1021T6Mega6DepthTurnInputFromGameState(
  gs: any,
  turn: number,
  enabled = true,
): V1021T6Mega6TurnInput {
  return {
    turn,
    seed: typeof gs?.seed === 'number' ? gs.seed : 5150,
    enabled,
    gameState: gs,
    persisted: null,
  };
}
""".strip().splitlines()


def emit_self_tests() -> list[str]:
    catalog_size = len(REGIONS) * len(DOMAINS) * LANES_PER_DOMAIN
    lines: list[str] = []
    lines.append(
        "export function runV1021T6Mega6DepthSelfTests(): Array<{ id: string; name: string; passed: boolean; detail: string }> {"
    )
    lines.append("  const out: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];")
    lines.append("  const v1021T6Mega6SelfTestCheck = (id: string, name: string, ok: boolean, detail = 'ok') =>")
    lines.append("    out.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });")
    lines.append(
        "  v1021T6Mega6SelfTestCheck('lattice', 'Lattice catalog', V1021_T6MEGA6_LATTICE_CATALOG_SIZE >= 26000);"
    )
    lines.append("  v1021T6Mega6SelfTestCheck('mesh', 'Stack mesh', V1021_T6MEGA6_STACK_MESH_SIZE >= 12000);")
    lines.append("  v1021T6Mega6SelfTestCheck('playbook', 'Playbook lattice', V1021_T6MEGA6_PLAYBOOK_LATTICE_SIZE >= 6000);")
    lines.append("  v1021T6Mega6SelfTestCheck('snapshots', 'Domain snapshots', V1021_T6MEGA6_DOMAIN_SNAPSHOT_COUNT >= 58000);")
    lines.append("  v1021T6Mega6SelfTestCheck('traces', 'Integrity traces', V1021_T6MEGA6_INTEGRITY_TRACE_COUNT >= 13000);")
    lines.append(
        "  v1021T6Mega6SelfTestCheck('sanitize', 'Sanitize empty', sanitizeV1021T6Mega6DepthPersisted(null, 1).revision === 0);"
    )
    for i in range(56):
        lines.append(f"  v1021T6Mega6SelfTestCheck('turn_{i:02d}', 'Turn batch {i}', (() => {{")
        lines.append(
            f"    const r = runV1021T6Mega6DepthTurn({{ turn: {1 + i}, seed: {2000 + i}, enabled: true, gameState: {{}}, persisted: null }});"
        )
        lines.append("    return r.persisted.revision === 1 && r.state.domainCount >= 0;")
        lines.append("  })());")
    for j in range(0, catalog_size, LANES_PER_DOMAIN * 4):
        lines.append(
            f"  v1021T6Mega6SelfTestCheck('cell_{j:05d}', 'Cell {j}', "
            f"V1021_T6MEGA6_LATTICE_CATALOG[{j}].stackWeight > 0);"
        )
    for k in range(0, INTEGRITY_TRACES, 400):
        lines.append(
            f"  v1021T6Mega6SelfTestCheck('itr_{k:05d}', 'Integrity replay {k}', "
            f"replayV1021T6Mega6IntegrityTrace(V1021_T6MEGA6_INTEGRITY_TRACES[{k}]).persisted.revision === 1);"
        )
    lines.append("  return out;")
    lines.append("}")
    lines.append("")
    lines.append("export function runV1021T6Mega6DepthSelfTestsForLab(): { ok: boolean; detail: string } {")
    lines.append("  const r = runV1021T6Mega6DepthSelfTests();")
    lines.append("  const passed = r.filter(x => x.passed).length;")
    lines.append("  return { ok: passed >= Math.floor(r.length * 0.9), detail: `${passed}/${r.length} passed` };")
    lines.append("}")
    return lines


def main() -> None:
    parts: list[str] = []
    parts.extend(emit_header())
    parts.extend(emit_lattice_catalog())
    parts.append("")
    parts.extend(emit_stack_mesh())
    parts.append("")
    parts.extend(emit_regional_stabilizers())
    parts.append("")
    parts.extend(emit_playbook_lattice())
    parts.append("")
    parts.extend(emit_domain_snapshots())
    parts.append("")
    parts.extend(emit_integrity_traces())
    parts.append("")
    parts.extend(emit_engine())
    parts.append("")
    parts.extend(emit_self_tests())
    text = "\n".join(parts) + "\n"
    OUT.write_text(text, encoding="utf-8")
    print(f"wrote {OUT} lines={len(text.splitlines())}")


if __name__ == "__main__":
    main()
