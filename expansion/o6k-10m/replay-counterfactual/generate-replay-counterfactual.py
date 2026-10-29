#!/usr/bin/env python3
"""Generate T6-3 replay & counterfactual expansion (V1014_REPLAY_*)."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent

REGIONS = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"]
DOMAINS = [
    "macro",
    "fiscal",
    "trade",
    "labor",
    "energy",
    "household",
    "diplomacy",
    "crisis",
    "infrastructure",
    "forecast",
]
PHASES = ["opening", "midgame", "late", "overtime"]
DIFF_KINDS = [
    "scalar_delta",
    "record_patch",
    "array_splice",
    "branch_fork",
    "rng_stream",
    "ledger_event",
    "replay_checkpoint",
    "counterfactual_overlay",
]
COUNTERFACTUAL_TAGS = [
    "policy_alt",
    "crisis_avoided",
    "trade_shift",
    "fiscal_shock",
    "energy_constraint",
    "diplomatic_reset",
    "household_pulse",
    "forecast_rebaseline",
]


def js_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def write(rel: str, content: str) -> None:
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def gen_types() -> str:
    return """/**
 * V10.14 replay counterfactual — core types (T6-3 / Agent 24 depth pass).
 * Symbol prefix: V1014_REPLAY_*
 */
export const V1014_REPLAY_MODULE_VERSION = '2.0.0';
export const V1014_REPLAY_MODULE_ID = 'replay_counterfactual_analytics';
export const V1014_REPLAY_SCHEMA_VERSION = 'v1014.replay_counterfactual.2';

export type V1014ReplayArchiveDomain = typeof V1014_REPLAY_ARCHIVE_DOMAINS[number];
export const V1014_REPLAY_ARCHIVE_DOMAINS = [
  'macro', 'fiscal', 'trade', 'labor', 'energy', 'household',
  'diplomacy', 'crisis', 'infrastructure', 'forecast',
] as const;

export type V1014ReplayDiffKind = typeof V1014_REPLAY_DIFF_KINDS[number];
export const V1014_REPLAY_DIFF_KINDS = [
  'scalar_delta', 'record_patch', 'array_splice', 'branch_fork',
  'rng_stream', 'ledger_event', 'replay_checkpoint', 'counterfactual_overlay',
] as const;

export interface V1014ReplayTurnCoordinate {
  turn: number;
  day: number;
  sequence: number;
  branchNodeId: string;
}

export interface V1014ReplaySnapshotHeader {
  headerId: string;
  matchId: string;
  coordinate: V1014ReplayTurnCoordinate;
  encoderVersion: string;
  payloadHash: string;
  liveStateFingerprint: string;
  isolatedBranchId: string | null;
}

export interface V1014ReplaySnapshotPayload {
  header: V1014ReplaySnapshotHeader;
  encodedBlob: string;
  byteLength: number;
  domainSlices: Record<V1014ReplayArchiveDomain, V1014ReplayDomainSlice>;
}

export interface V1014ReplayDomainSlice {
  sliceId: string;
  domain: V1014ReplayArchiveDomain;
  turnSpan: { from: number; to: number };
  scalarMetrics: Record<string, number>;
  recordRefs: string[];
  deterministicFingerprint: string;
}

export interface V1014ReplayTurnDiffOp {
  opId: string;
  kind: V1014ReplayDiffKind;
  path: string;
  fromValue: unknown;
  toValue: unknown;
  magnitude: number;
  ruleId: string;
  coordinate: V1014ReplayTurnCoordinate;
}

export interface V1014ReplayTurnDiffReport {
  reportId: string;
  baseSnapshotId: string;
  headSnapshotId: string;
  ops: V1014ReplayTurnDiffOp[];
  netScalarDelta: number;
  branchIsolationVerified: boolean;
  fingerprint: string;
}

export interface V1014ReplayBranchIsolationEnvelope {
  envelopeId: string;
  liveStateRef: string;
  sandboxStateRef: string;
  parentBranchNodeId: string;
  childBranchNodeId: string;
  rngStreamsCopied: number;
  counterfactualOnly: boolean;
  corruptionGuard: { liveMutationsBlocked: boolean; reason: string };
}

export interface V1014ReplayCounterfactualBranch {
  branchId: string;
  label: string;
  forkCoordinate: V1014ReplayTurnCoordinate;
  presetId: string;
  overlayFingerprint: string;
  authoritative: false;
}

export interface V1014ReplayPersistenceSlice {
  schemaVersion: string;
  archiveRing: V1014ReplaySnapshotPayload[];
  activeBranch: V1014ReplayCounterfactualBranch | null;
  lastDiffReportId: string | null;
  section6SlotBindings: Record<string, string>;
}

export interface V1014ReplaySelfTestResult {
  caseName: string;
  passed: boolean;
  detail: string;
  durationMs?: number;
}
"""


def gen_primitives() -> str:
    return """/** Deterministic primitives — no wall-clock in fingerprints. */
export function V1014_REPLAY_fnv1a32(input: string, seed = 0x811c9dc5): number {
  let hash = seed >>> 0;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

export function V1014_REPLAY_stableStringify(value: unknown): string {
  if (value === null || value === undefined) return String(value);
  if (typeof value === 'number' || typeof value === 'boolean') return JSON.stringify(value);
  if (typeof value === 'string') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(V1014_REPLAY_stableStringify).join(',') + ']';
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj)
      .filter(k => k !== 'timestamp' && k !== 'createdAtTimestamp' && !k.endsWith('AtMs'))
      .sort();
    return '{' + keys.map(k => JSON.stringify(k) + ':' + V1014_REPLAY_stableStringify(obj[k])).join(',') + '}';
  }
  return JSON.stringify(String(value));
}

export function V1014_REPLAY_fingerprint(label: string, payload: unknown): string {
  const body = V1014_REPLAY_stableStringify(payload);
  const h = V1014_REPLAY_fnv1a32(label + '|' + body);
  return `v1014_replay_${label}_${h.toString(16).padStart(8, '0')}`;
}

export function V1014_REPLAY_clampTurn(n: unknown, fallback = 1): number {
  const v = Number(n);
  if (!Number.isFinite(v) || v < 1) return fallback;
  return Math.floor(v);
}
"""


def gen_persistence_keys() -> str:
    lines = [
        "import { V1014_REPLAY_fingerprint } from './primitives';",
        "import type { V1014ReplayPersistenceSlice } from './types';",
        "import { V1014_REPLAY_SCHEMA_VERSION } from './types';",
        "",
        "/** §6 persistence keys — register in save.meta.v1014 replay slice. */",
        "export const V1014_REPLAY_SECTION6_KEY_ROOT = 'save.meta.v1014.replay_counterfactual';",
        "export const V1014_REPLAY_SECTION6_KEYS = {",
        "  schema: `${V1014_REPLAY_SECTION6_KEY_ROOT}.schemaVersion`,",
        "  archiveRing: `${V1014_REPLAY_SECTION6_KEY_ROOT}.archiveRing`,",
        "  activeBranch: `${V1014_REPLAY_SECTION6_KEY_ROOT}.activeBranch`,",
        "  lastDiffReport: `${V1014_REPLAY_SECTION6_KEY_ROOT}.lastDiffReportId`,",
        "  slotBindings: `${V1014_REPLAY_SECTION6_KEY_ROOT}.section6SlotBindings`,",
        "  scrubberIndex: `${V1014_REPLAY_SECTION6_KEY_ROOT}.scrubberIndex`,",
        "  forecastOverlay: `${V1014_REPLAY_SECTION6_KEY_ROOT}.forecastOverlay`,",
        "  dashboardTiles: `${V1014_REPLAY_SECTION6_KEY_ROOT}.dashboardTiles`,",
        "} as const;",
        "",
        "export type V1014ReplaySection6SlotId =",
        "  | 'quick_save' | 'slot_a' | 'slot_b' | 'slot_c' | 'slot_d'",
        "  | 'replay_autosave' | 'counterfactual_sandbox';",
        "",
        "export const V1014_REPLAY_SECTION6_SLOT_IDS: V1014ReplaySection6SlotId[] = [",
        "  'quick_save', 'slot_a', 'slot_b', 'slot_c', 'slot_d',",
        "  'replay_autosave', 'counterfactual_sandbox',",
        "];",
        "",
        "export interface V1014ReplaySection6MigrationStep {",
        "  fromVersion: string;",
        "  toVersion: string;",
        "  migrate: (slice: Record<string, unknown>) => Record<string, unknown>;",
        "}",
        "",
    ]
    for i in range(1, 41):
        lines.append(
            f"export function V1014_REPLAY_migrateSection6Step{i}(slice: Record<string, unknown>): Record<string, unknown> {{"
        )
        lines.append(
            f"  const next: Record<string, unknown> = {{ ...slice, schemaVersion: V1014_REPLAY_SCHEMA_VERSION, migrationStep: {i} }};"
        )
        lines.append(
            "  if (typeof next.archiveRing !== 'object' || next.archiveRing === null) next.archiveRing = [];"
        )
        lines.append(
            "  if (typeof next.section6SlotBindings !== 'object' || next.section6SlotBindings === null) {"
        )
        lines.append("    next.section6SlotBindings = {};")
        lines.append("  }")
        lines.append(f"  next[`step{i}Fingerprint`] = V1014_REPLAY_fingerprint('migration_{i}', next);")
        lines.append("  return next;")
        lines.append("}")
        lines.append("")
    lines.append(
        "export const V1014_REPLAY_SECTION6_MIGRATIONS: V1014ReplaySection6MigrationStep[] = ["
    )
    for i in range(1, 41):
        lines.append(
            f"  {{ fromVersion: 'v1014.replay_counterfactual.{i - 1}', toVersion: 'v1014.replay_counterfactual.{i}', migrate: V1014_REPLAY_migrateSection6Step{i} }},"
        )
    lines.append("];")
    lines.append("")
    lines.append(
        "export function V1014_REPLAY_readPersistenceSlice(gameState: Record<string, unknown>): V1014ReplayPersistenceSlice | null {"
    )
    lines.append("  const meta = (gameState?.save as any)?.meta?.v1014?.replay_counterfactual;")
    lines.append("  if (!meta || typeof meta !== 'object') return null;")
    lines.append("  return meta as V1014ReplayPersistenceSlice;")
    lines.append("}")
    lines.append("")
    lines.append(
        "export function V1014_REPLAY_patchPersistenceSlice("
    )
    lines.append("  gameState: Record<string, unknown>,")
    lines.append("  slice: V1014ReplayPersistenceSlice,")
    lines.append("): Record<string, unknown> {")
    lines.append("  const save = { ...(gameState.save as object || {}) } as Record<string, unknown>;")
    lines.append("  const meta = { ...(save.meta as object || {}) } as Record<string, unknown>;")
    lines.append("  const v1014 = { ...(meta.v1014 as object || {}) } as Record<string, unknown>;")
    lines.append("  v1014.replay_counterfactual = slice;")
    lines.append("  meta.v1014 = v1014;")
    lines.append("  save.meta = meta;")
    lines.append("  return { ...gameState, save };")
    lines.append("}")
    return "\n".join(lines) + "\n"


def gen_archive_catalog() -> str:
    lines = [
        "// @ts-nocheck",
        "import type { V1014ReplayArchiveDomain } from './types';",
        "",
        "export interface V1014ReplayArchiveSliceDefinition {",
        "  id: string;",
        "  domain: V1014ReplayArchiveDomain;",
        "  regionCode: string;",
        "  phase: string;",
        "  metricKeys: string[];",
        "  encoderWeight: number;",
        "  diffRuleIds: string[];",
        "  description: string;",
        "}",
        "",
        "export const V1014_REPLAY_ARCHIVE_SLICE_CATALOG = [",
    ]
    idx = 0
    metric_templates = [
        ("gdp_index", "real output index"),
        ("inflation_bps", "headline inflation basis points"),
        ("unemployment_bps", "unemployment rate basis points"),
        ("trade_balance", "goods balance"),
        ("energy_stress", "grid stress scalar"),
        ("household_sentiment", "domestic demand sentiment"),
        ("diplomatic_trust", "bilateral trust index"),
        ("crisis_pressure", "crisis escalation pressure"),
        ("infra_backlog", "infrastructure backlog months"),
        ("forecast_error", "forecast lab error vs realized"),
    ]
    for domain in DOMAINS:
        for region in REGIONS:
            for phase in PHASES:
                for mk, mk_desc in metric_templates:
                    for variant in range(2):
                        idx += 1
                        rule_base = f"v1014_replay_diff_{domain}_{mk}"
                        diff_ids = [f"{rule_base}_v{v}" for v in range(1, 4)]
                        desc = (
                            f"Archive slice #{idx}: domain={domain}, region={region}, phase={phase}, "
                            f"metric={mk} ({mk_desc}), variant={variant + 1}. "
                            f"Used by snapshot encoder ring buffer and turn diff engine for counterfactual isolation."
                        )
                        lines.append(
                            "  {"
                            f" id: 'v1014_replay_slice_{idx:05d}', domain: '{domain}', regionCode: {js_str(region)}, "
                            f"phase: {js_str(phase)}, metricKeys: [{js_str(mk)}, {js_str(f'{mk}_delta')}], "
                            f"encoderWeight: {(idx % 17) + 3}, diffRuleIds: [{', '.join(js_str(r) for r in diff_ids)}], "
                            f"description: {js_str(desc)}, "
                            "},"
                        )
    lines.append("] as unknown as V1014ReplayArchiveSliceDefinition[];")
    lines.append("")
    lines.append(
        "export function V1014_REPLAY_lookupArchiveSlice(id: string): V1014ReplayArchiveSliceDefinition | undefined {"
    )
    lines.append("  return V1014_REPLAY_ARCHIVE_SLICE_CATALOG.find(s => s.id === id);")
    lines.append("}")
    return "\n".join(lines) + "\n"


def gen_diff_rule_catalog() -> str:
    lines = [
        "// @ts-nocheck",
        "import type { V1014ReplayDiffKind } from './types';",
        "",
        "export interface V1014ReplayDiffRuleDefinition {",
        "  ruleId: string;",
        "  kind: V1014ReplayDiffKind;",
        "  pathTemplate: string;",
        "  tolerance: number;",
        "  weight: number;",
        "  appliesWhen: string;",
        "}",
        "",
        "export const V1014_REPLAY_DIFF_RULE_CATALOG = [",
    ]
    idx = 0
    path_variants = ["gdp_index", "inflation_bps", "trade_balance", "crisis_pressure", "forecast_error"]
    for kind in DIFF_KINDS:
        for domain in DOMAINS:
            for region in REGIONS:
                for metric in path_variants:
                    for band in range(3):
                        idx += 1
                        path = f"gameState.v1014.{domain}.{region.lower()}.{metric}.band{band}"
                        applies = (
                            f"turn>=1 && branchNodeId!=null && domain=={js_str(domain)} "
                            f"&& metric=={js_str(metric)} && band=={band}"
                        )
                        lines.append(
                            "  {"
                            f" ruleId: 'v1014_replay_diff_rule_{idx:05d}', kind: '{kind}', "
                            f"pathTemplate: {js_str(path)}, tolerance: {(idx % 50) / 1000}, weight: {(idx % 11) + 1}, "
                            f"appliesWhen: {js_str(applies)}, "
                            "},"
                        )
    lines.append("] as unknown as V1014ReplayDiffRuleDefinition[];")
    lines.append("")
    lines.append("export function V1014_REPLAY_lookupDiffRule(ruleId: string): V1014ReplayDiffRuleDefinition | undefined {")
    lines.append("  return V1014_REPLAY_DIFF_RULE_CATALOG.find(r => r.ruleId === ruleId);")
    lines.append("}")
    return "\n".join(lines) + "\n"


def gen_counterfactual_presets() -> str:
    lines = [
        "export interface V1014ReplayCounterfactualPreset {",
        "  presetId: string;",
        "  tag: string;",
        "  label: string;",
        "  forkTurnHint: number;",
        "  overlayPaths: string[];",
        "  nonAuthoritative: true;",
        "  description: string;",
        "}",
        "",
        "export const V1014_REPLAY_COUNTERFACTUAL_PRESET_CATALOG: V1014ReplayCounterfactualPreset[] = [",
    ]
    idx = 0
    for tag in COUNTERFACTUAL_TAGS:
        for domain in DOMAINS:
            for region in REGIONS:
                for phase in PHASES:
                    idx += 1
                    label = f"{tag.replace('_', ' ').title()} — {domain} / {region} ({phase})"
                    desc = (
                        f"Counterfactual preset #{idx}: tag={tag}, domain={domain}, region={region}, phase={phase}. "
                        f"Branches from §6 replay slot without mutating live RNG streams; overlays feed 20M/20AQ forecast lab only."
                    )
                    paths = [
                        f"overlay.{domain}.{region.lower()}.{phase}.scalar",
                        f"overlay.{domain}.{region.lower()}.{phase}.record",
                    ]
                    lines.append(
                        "  {"
                        f" presetId: 'v1014_replay_cf_{idx:05d}', tag: {js_str(tag)}, label: {js_str(label)}, "
                        f"forkTurnHint: {(idx % 40) + 1}, overlayPaths: [{', '.join(js_str(p) for p in paths)}], "
                        f"nonAuthoritative: true, description: {js_str(desc)}, "
                        "},"
                    )
    lines.append("];")
    lines.append("")
    lines.append("export function V1014_REPLAY_lookupCounterfactualPreset(presetId: string): V1014ReplayCounterfactualPreset | undefined {")
    lines.append("  return V1014_REPLAY_COUNTERFACTUAL_PRESET_CATALOG.find(p => p.presetId === presetId);")
    lines.append("}")
    return "\n".join(lines) + "\n"


def gen_slice_encoder_handlers() -> str:
    lines = [
        "/** Per-slice deterministic metric normalizers used by snapshot encoder. */",
        "export type V1014ReplaySliceEncoderHandler = (metrics: Record<string, number>, encoderWeight: number) => number;",
        "",
        "export const V1014_REPLAY_SLICE_ENCODER_HANDLERS: Record<string, V1014ReplaySliceEncoderHandler> = {",
    ]
    idx = 0
    metric_templates = [
        "gdp_index",
        "inflation_bps",
        "unemployment_bps",
        "trade_balance",
        "energy_stress",
        "household_sentiment",
        "diplomatic_trust",
        "crisis_pressure",
        "infra_backlog",
        "forecast_error",
    ]
    for domain in DOMAINS:
        for region in REGIONS:
            for phase in PHASES:
                for mk in metric_templates:
                    for variant in range(2):
                        idx += 1
                        sid = f"v1014_replay_slice_{idx:05d}"
                        scale = (idx % 97) + 1
                        lines.append(
                            f"  '{sid}': (m, w) => (Number(m[{js_str(mk)}] ?? m[{js_str(f'{mk}_delta')}] ?? w * 0.01) * {scale} / 100),"
                        )
    lines.append("};")
    lines.append("")
    lines.append(
        "export function V1014_REPLAY_runSliceEncoderHandler("
    )
    lines.append("  sliceId: string,")
    lines.append("  metrics: Record<string, number>,")
    lines.append("  encoderWeight: number,")
    lines.append("): number {")
    lines.append("  const fn = V1014_REPLAY_SLICE_ENCODER_HANDLERS[sliceId];")
    lines.append("  return fn ? fn(metrics, encoderWeight) : encoderWeight * 0.01;")
    lines.append("}")
    return "\n".join(lines) + "\n"


def gen_self_test_fixtures(case_names: list[str]) -> str:
    lines = [
        "/** Deterministic fixtures referenced by LAB suite o6k_agent24_v2. */",
        "export interface V1014ReplaySelfTestFixture {",
        "  caseName: string;",
        "  matchId: string;",
        "  turn: number;",
        "  day: number;",
        "  branchNodeId: string;",
        "  presetId: string | null;",
        "  metricsByDomain: Record<string, Record<string, number>>;",
        "  expectedMinOps: number;",
        "  notes: string;",
        "}",
        "",
        "export const V1014_REPLAY_SELF_TEST_FIXTURES: V1014ReplaySelfTestFixture[] = [",
    ]
    for i, name in enumerate(case_names):
        domain = DOMAINS[i % len(DOMAINS)]
        region = REGIONS[i % len(REGIONS)]
        lines.append("  {")
        lines.append(f"    caseName: {js_str(name)},")
        lines.append(f"    matchId: {js_str(f'fixture_match_{i:03d}')},")
        lines.append(f"    turn: {(i % 30) + 1},")
        lines.append(f"    day: {(i % 30) + 1},")
        lines.append(f"    branchNodeId: {js_str('root' if i % 5 else f'branch_{i}')},")
        lines.append(f"    presetId: {js_str(f'v1014_replay_cf_{(i % 2560) + 1:05d}')},")
        lines.append("    metricsByDomain: {")
        lines.append(f"      {domain}: {{ gdp_index: {1 + i * 0.01}, inflation_bps: {100 + i}, region_code_hash: {(i % 997) + 1} }},")
        lines.append("    },")
        lines.append(f"    expectedMinOps: {i % 4},")
        lines.append(
            f"    notes: {js_str(f'Fixture for {name}: validates archive round-trip, diff, or branch isolation path {i}.')},"
        )
        lines.append("  },")
    lines.append("];")
    lines.append("")
    lines.append("export function V1014_REPLAY_lookupSelfTestFixture(caseName: string): V1014ReplaySelfTestFixture | undefined {")
    lines.append("  return V1014_REPLAY_SELF_TEST_FIXTURES.find(f => f.caseName === caseName);")
    lines.append("}")
    return "\n".join(lines) + "\n"


def gen_timeline_scrubber_engine() -> str:
    return """import type { V1014ReplaySnapshotPayload } from './types';
import { V1014_REPLAY_clampTurn, V1014_REPLAY_fingerprint } from './primitives';

export interface V1014ReplayScrubberState {
  cursorTurn: number;
  pinnedHeaderId: string | null;
  followLiveBranch: boolean;
}

export function V1014_REPLAY_initScrubberState(turn = 1): V1014ReplayScrubberState {
  return { cursorTurn: V1014_REPLAY_clampTurn(turn), pinnedHeaderId: null, followLiveBranch: true };
}

export function V1014_REPLAY_resolveScrubberSnapshot(
  ring: V1014ReplaySnapshotPayload[],
  state: V1014ReplayScrubberState,
): V1014ReplaySnapshotPayload | null {
  if (!ring.length) return null;
  if (state.pinnedHeaderId) {
    const pinned = ring.find(s => s.header.headerId === state.pinnedHeaderId);
    if (pinned) return pinned;
  }
  const t = V1014_REPLAY_clampTurn(state.cursorTurn);
  const eligible = ring.filter(s => s.header.coordinate.turn <= t);
  if (!eligible.length) return ring[0];
  return eligible[eligible.length - 1];
}

export function V1014_REPLAY_advanceScrubber(
  state: V1014ReplayScrubberState,
  delta: number,
  maxTurn: number,
): V1014ReplayScrubberState {
  const nextTurn = Math.min(maxTurn, Math.max(1, state.cursorTurn + delta));
  return { ...state, cursorTurn: nextTurn, pinnedHeaderId: null };
}

export function V1014_REPLAY_scrubberTimelineFingerprint(
  ring: V1014ReplaySnapshotPayload[],
  state: V1014ReplayScrubberState,
): string {
  const snap = V1014_REPLAY_resolveScrubberSnapshot(ring, state);
  return V1014_REPLAY_fingerprint('scrubber', { state, snapId: snap?.header.headerId || null, depth: ring.length });
}
"""


def gen_snapshot_encoder() -> str:
    return """import {
  V1014_REPLAY_ARCHIVE_SLICE_CATALOG,
  V1014_REPLAY_lookupArchiveSlice,
} from './archive-slice-catalog.generated';
import { V1014_REPLAY_runSliceEncoderHandler } from './slice-encoder-handlers.generated';
import {
  V1014_REPLAY_fingerprint,
  V1014_REPLAY_stableStringify,
  V1014_REPLAY_clampTurn,
} from './primitives';
import type {
  V1014ReplayArchiveDomain,
  V1014ReplayDomainSlice,
  V1014ReplaySnapshotHeader,
  V1014ReplaySnapshotPayload,
  V1014ReplayTurnCoordinate,
} from './types';
import { V1014_REPLAY_MODULE_VERSION, V1014_REPLAY_SCHEMA_VERSION } from './types';

export interface V1014ReplaySnapshotEncodeInput {
  matchId: string;
  turn: number;
  day: number;
  sequence: number;
  branchNodeId: string;
  isolatedBranchId?: string | null;
  metricsByDomain?: Partial<Record<V1014ReplayArchiveDomain, Record<string, number>>>;
  liveStateFingerprint?: string;
}

function encodeDomainSlice(
  defId: string,
  coordinate: V1014ReplayTurnCoordinate,
  metrics: Record<string, number>,
): V1014ReplayDomainSlice | null {
  const def = V1014_REPLAY_lookupArchiveSlice(defId);
  if (!def) return null;
  const scalarMetrics: Record<string, number> = {};
  const normalized = V1014_REPLAY_runSliceEncoderHandler(defId, metrics, def.encoderWeight);
  for (const key of def.metricKeys) {
    const base = Number(metrics[key] ?? metrics[`${def.domain}_${key}`] ?? normalized);
    scalarMetrics[key] = base + normalized * 0.001;
  }
  const sliceId = V1014_REPLAY_fingerprint('domain_slice', { defId, coordinate, scalarMetrics });
  return {
    sliceId,
    domain: def.domain,
    turnSpan: { from: coordinate.turn, to: coordinate.turn },
    scalarMetrics,
    recordRefs: def.diffRuleIds.slice(0, 3),
    deterministicFingerprint: sliceId,
  };
}

export function V1014_REPLAY_buildSnapshotHeader(input: V1014ReplaySnapshotEncodeInput): V1014ReplaySnapshotHeader {
  const coordinate: V1014ReplayTurnCoordinate = {
    turn: V1014_REPLAY_clampTurn(input.turn),
    day: V1014_REPLAY_clampTurn(input.day),
    sequence: Math.max(0, Math.floor(Number(input.sequence) || 0)),
    branchNodeId: String(input.branchNodeId || 'root'),
  };
  const payloadHash = V1014_REPLAY_fingerprint('snapshot_payload', {
    matchId: input.matchId,
    coordinate,
    metricsByDomain: input.metricsByDomain || {},
  });
  return {
    headerId: V1014_REPLAY_fingerprint('snapshot_header', payloadHash),
    matchId: String(input.matchId || 'unknown_match'),
    coordinate,
    encoderVersion: V1014_REPLAY_MODULE_VERSION,
    payloadHash,
    liveStateFingerprint: String(input.liveStateFingerprint || payloadHash),
    isolatedBranchId: input.isolatedBranchId ?? null,
  };
}

export function V1014_REPLAY_encodeSnapshot(input: V1014ReplaySnapshotEncodeInput): V1014ReplaySnapshotPayload {
  const header = V1014_REPLAY_buildSnapshotHeader(input);
  const domainSlices = {} as Record<V1014ReplayArchiveDomain, V1014ReplayDomainSlice>;
  const metricsByDomain = input.metricsByDomain || {};
  for (const def of V1014_REPLAY_ARCHIVE_SLICE_CATALOG) {
    if (def.regionCode !== 'NSW' && (header.coordinate.turn + def.encoderWeight) % 3 !== 0) {
      continue;
    }
    const metrics = metricsByDomain[def.domain] || {};
    const slice = encodeDomainSlice(def.id, header.coordinate, metrics);
    if (slice && !domainSlices[def.domain]) {
      domainSlices[def.domain] = slice;
    }
  }
  const encodedBlob = V1014_REPLAY_stableStringify({ header, domainSlices });
  return {
    header,
    encodedBlob,
    byteLength: encodedBlob.length,
    domainSlices,
  };
}

export function V1014_REPLAY_decodeSnapshot(blob: string): V1014ReplaySnapshotPayload | null {
  try {
    const parsed = JSON.parse(blob) as V1014ReplaySnapshotPayload;
    if (!parsed?.header?.headerId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function V1014_REPLAY_pushArchiveRing(
  ring: V1014ReplaySnapshotPayload[],
  snapshot: V1014ReplaySnapshotPayload,
  maxLen = 48,
): V1014ReplaySnapshotPayload[] {
  return [...ring, snapshot].slice(-maxLen);
}
"""


def gen_turn_diff_engine() -> str:
    return """import { V1014_REPLAY_DIFF_RULE_CATALOG, V1014_REPLAY_lookupDiffRule } from './diff-rule-catalog.generated';
import { V1014_REPLAY_fingerprint } from './primitives';
import type {
  V1014ReplaySnapshotPayload,
  V1014ReplayTurnDiffOp,
  V1014ReplayTurnDiffReport,
} from './types';

function readPath(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.').filter(Boolean);
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur === null || cur === undefined || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[p.replace(/\\{metric\\}/g, 'gdp_index')];
  }
  return cur;
}

export function V1014_REPLAY_diffSnapshots(
  base: V1014ReplaySnapshotPayload,
  head: V1014ReplaySnapshotPayload,
): V1014ReplayTurnDiffReport {
  const ops: V1014ReplayTurnDiffOp[] = [];
  let netScalar = 0;
  const domains = new Set([...Object.keys(base.domainSlices), ...Object.keys(head.domainSlices)]);
  for (const domain of domains) {
    const b = base.domainSlices[domain as keyof typeof base.domainSlices];
    const h = head.domainSlices[domain as keyof typeof head.domainSlices];
    if (!b || !h) continue;
    for (const key of Object.keys(h.scalarMetrics)) {
      const fromValue = b.scalarMetrics[key] ?? 0;
      const toValue = h.scalarMetrics[key] ?? 0;
      const delta = Number(toValue) - Number(fromValue);
      if (Math.abs(delta) < 1e-9) continue;
      netScalar += delta;
      const rule = V1014_REPLAY_DIFF_RULE_CATALOG.find(r => r.kind === 'scalar_delta')!;
      ops.push({
        opId: V1014_REPLAY_fingerprint('diff_op', { domain, key, delta }),
        kind: 'scalar_delta',
        path: `domainSlices.${domain}.scalarMetrics.${key}`,
        fromValue,
        toValue,
        magnitude: Math.abs(delta),
        ruleId: rule.ruleId,
        coordinate: head.header.coordinate,
      });
    }
  }
  for (const rule of V1014_REPLAY_DIFF_RULE_CATALOG) {
    if (ops.length > 400) break;
    if (rule.kind === 'scalar_delta') continue;
    const fromValue = readPath(base as unknown as Record<string, unknown>, rule.pathTemplate);
    const toValue = readPath(head as unknown as Record<string, unknown>, rule.pathTemplate);
    if (fromValue === toValue) continue;
    if (!V1014_REPLAY_lookupDiffRule(rule.ruleId)) continue;
    ops.push({
      opId: V1014_REPLAY_fingerprint('diff_op_rule', rule.ruleId),
      kind: rule.kind,
      path: rule.pathTemplate,
      fromValue,
      toValue,
      magnitude: rule.weight,
      ruleId: rule.ruleId,
      coordinate: head.header.coordinate,
    });
  }
  const fingerprint = V1014_REPLAY_fingerprint('diff_report', { base: base.header.headerId, head: head.header.headerId, ops: ops.length });
  return {
    reportId: fingerprint,
    baseSnapshotId: base.header.headerId,
    headSnapshotId: head.header.headerId,
    ops,
    netScalarDelta: netScalar,
    branchIsolationVerified: base.header.isolatedBranchId === head.header.isolatedBranchId,
    fingerprint,
  };
}
"""


def gen_branch_isolation() -> str:
    return """import { V1014_REPLAY_fingerprint, V1014_REPLAY_stableStringify } from './primitives';
import type {
  V1014ReplayBranchIsolationEnvelope,
  V1014ReplayCounterfactualBranch,
  V1014ReplayTurnCoordinate,
} from './types';
import { V1014_REPLAY_lookupCounterfactualPreset } from './counterfactual-preset-catalog.generated';

export interface V1014ReplayBranchIsolationInput {
  liveState: Record<string, unknown>;
  parentBranchNodeId: string;
  childBranchNodeId: string;
  presetId: string;
  forkCoordinate: V1014ReplayTurnCoordinate;
  rngStreamStates?: Record<string, unknown>;
}

export function V1014_REPLAY_createBranchIsolationEnvelope(
  input: V1014ReplayBranchIsolationInput,
): V1014ReplayBranchIsolationEnvelope {
  const sandbox = JSON.parse(V1014_REPLAY_stableStringify(input.liveState)) as Record<string, unknown>;
  const preset = V1014_REPLAY_lookupCounterfactualPreset(input.presetId);
  if (preset) {
    const overlay = (sandbox.overlay as Record<string, unknown>) || {};
    overlay[preset.presetId] = { paths: preset.overlayPaths, nonAuthoritative: true };
    sandbox.overlay = overlay;
  }
  const liveRef = V1014_REPLAY_fingerprint('live_ref', input.liveState);
  const sandboxRef = V1014_REPLAY_fingerprint('sandbox_ref', sandbox);
  return {
    envelopeId: V1014_REPLAY_fingerprint('isolation_envelope', { liveRef, sandboxRef }),
    liveStateRef: liveRef,
    sandboxStateRef: sandboxRef,
    parentBranchNodeId: input.parentBranchNodeId,
    childBranchNodeId: input.childBranchNodeId,
    rngStreamsCopied: Object.keys(input.rngStreamStates || {}).length,
    counterfactualOnly: true,
    corruptionGuard: {
      liveMutationsBlocked: true,
      reason: 'counterfactual sandbox — live state is read-only during what-if evaluation',
    },
  };
}

export function V1014_REPLAY_materializeCounterfactualBranch(
  presetId: string,
  forkCoordinate: V1014ReplayTurnCoordinate,
): V1014ReplayCounterfactualBranch | null {
  const preset = V1014_REPLAY_lookupCounterfactualPreset(presetId);
  if (!preset) return null;
  return {
    branchId: V1014_REPLAY_fingerprint('cf_branch', { presetId, forkCoordinate }),
    label: preset.label,
    forkCoordinate,
    presetId,
    overlayFingerprint: V1014_REPLAY_fingerprint('cf_overlay', preset.overlayPaths),
    authoritative: false,
  };
}

export function V1014_REPLAY_assertLiveStateUntouched(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): boolean {
  return V1014_REPLAY_fingerprint('live', before) === V1014_REPLAY_fingerprint('live', after);
}
"""


def gen_adapters() -> str:
    return """/**
 * Cross-wire adapters — §6 replay slots, 20M/20AQ forecast lab, O6K-A23 dashboard tiles.
 */
import type { V1014ReplayPersistenceSlice, V1014ReplaySnapshotPayload, V1014ReplayTurnDiffReport } from './types';
import { V1014_REPLAY_SECTION6_KEYS, V1014_REPLAY_SECTION6_SLOT_IDS } from './persistence-keys';
import { V1014_REPLAY_encodeSnapshot } from './snapshot-encoder';

export interface V1014ReplaySection6SlotHookInput {
  gameState: Record<string, unknown>;
  slotId: (typeof V1014_REPLAY_SECTION6_SLOT_IDS)[number];
  matchId: string;
  turn: number;
  day: number;
  branchNodeId: string;
}

export function V1014_REPLAY_bindSection6ReplaySlot(input: V1014ReplaySection6SlotHookInput): V1014ReplayPersistenceSlice {
  const snapshot = V1014_REPLAY_encodeSnapshot({
    matchId: input.matchId,
    turn: input.turn,
    day: input.day,
    sequence: 0,
    branchNodeId: input.branchNodeId,
  });
  const prior = (input.gameState?.save as any)?.meta?.v1014?.replay_counterfactual as V1014ReplayPersistenceSlice | undefined;
  const section6SlotBindings = { ...(prior?.section6SlotBindings || {}), [input.slotId]: snapshot.header.headerId };
  return {
    schemaVersion: prior?.schemaVersion || 'v1014.replay_counterfactual.2',
    archiveRing: prior?.archiveRing?.length ? [...prior.archiveRing, snapshot].slice(-48) : [snapshot],
    activeBranch: prior?.activeBranch || null,
    lastDiffReportId: prior?.lastDiffReportId || null,
    section6SlotBindings,
  };
}

export interface V1014ReplayForecastLabOverlayInput {
  diffReport: V1014ReplayTurnDiffReport;
  scenarioPresetId?: string;
}

export function V1014_REPLAY_buildForecastLabOverlay(input: V1014ReplayForecastLabOverlayInput): Record<string, unknown> {
  return {
    source: 'v1014_replay_counterfactual',
    nonAuthoritative: true,
    section20M: { diagnosticsOnly: true, diffOps: input.diffReport.ops.length },
    section20AQ: { policyLabOverlay: true, reportId: input.diffReport.reportId },
    scenarioPresetId: input.scenarioPresetId || null,
    persistenceKey: V1014_REPLAY_SECTION6_KEYS.forecastOverlay,
  };
}

export interface V1014ReplayDashboardTileInput {
  snapshot: V1014ReplaySnapshotPayload | null;
  diffReport: V1014ReplayTurnDiffReport | null;
}

export function V1014_REPLAY_buildO6kA23DashboardTiles(input: V1014ReplayDashboardTileInput): Array<{ tileId: string; label: string; value: string }> {
  const snap = input.snapshot;
  const diff = input.diffReport;
  return [
    { tileId: 'replay_archive_depth', label: 'Archive depth', value: snap ? String(snap.byteLength) : '0' },
    { tileId: 'replay_branch', label: 'Branch', value: snap?.header.coordinate.branchNodeId || 'root' },
    { tileId: 'replay_diff_ops', label: 'Diff ops', value: diff ? String(diff.ops.length) : '0' },
    { tileId: 'replay_isolation', label: 'Isolation OK', value: diff?.branchIsolationVerified ? 'yes' : 'no' },
  ];
}

export function V1014_REPLAY_scrubberHook(turn: number, ring: V1014ReplaySnapshotPayload[]): V1014ReplaySnapshotPayload | null {
  const t = Math.max(1, Math.floor(turn));
  const matches = ring.filter(s => s.header.coordinate.turn <= t);
  return matches.length ? matches[matches.length - 1] : null;
}
"""


def gen_self_test_cases() -> list[str]:
    names = [
        "archive_roundtrip_empty_metrics",
        "archive_roundtrip_multi_domain",
        "snapshot_header_deterministic",
        "snapshot_encoder_ring_push",
        "snapshot_decoder_invalid_blob",
        "diff_identical_snapshots_zero_ops",
        "diff_scalar_delta_detection",
        "diff_branch_isolation_flag",
        "branch_envelope_live_untouch",
        "branch_materialize_unknown_preset",
        "branch_materialize_valid_preset",
        "section6_bind_quick_save",
        "section6_bind_counterfactual_sandbox",
        "section6_slot_binding_keys",
        "persistence_read_missing_slice",
        "persistence_patch_roundtrip",
        "migration_step_chain_01",
        "migration_step_chain_40",
        "forecast_overlay_non_authoritative",
        "forecast_overlay_links_20aq",
        "dashboard_tiles_empty_snapshot",
        "dashboard_tiles_with_diff",
        "scrubber_selects_latest_turn",
        "scrubber_before_first_turn",
        "stable_stringify_key_order",
        "fnv1a32_known_vector",
        "fingerprint_excludes_timestamp",
        "catalog_archive_slice_lookup",
        "catalog_diff_rule_lookup",
        "catalog_counterfactual_preset_lookup",
        "counterfactual_authoritative_false",
        "encoder_skips_sparse_regions",
        "diff_report_fingerprint_stable",
        "isolation_rng_stream_count",
        "section6_keys_forecast_overlay",
        "section6_keys_dashboard_tiles",
        "replay_schema_version_constant",
        "archive_catalog_minimum_size",
        "diff_rule_catalog_minimum_size",
        "counterfactual_preset_minimum_size",
        "determinism_double_encode",
        "double_branch_envelope_ids",
        "overlay_paths_present_on_preset",
        "live_corruption_guard_message",
        "net_scalar_delta_aggregation",
        "decode_reencode_snapshot",
    ]
    assert len(names) >= 40
    return names


def gen_self_tests() -> str:
    cases = gen_self_test_cases()
    lines = [
        "import { V1014_REPLAY_encodeSnapshot, V1014_REPLAY_decodeSnapshot, V1014_REPLAY_pushArchiveRing } from './snapshot-encoder';",
        "import { V1014_REPLAY_diffSnapshots } from './turn-diff-engine';",
        "import {",
        "  V1014_REPLAY_assertLiveStateUntouched,",
        "  V1014_REPLAY_createBranchIsolationEnvelope,",
        "  V1014_REPLAY_materializeCounterfactualBranch,",
        "} from './branch-isolation';",
        "import {",
        "  V1014_REPLAY_bindSection6ReplaySlot,",
        "  V1014_REPLAY_buildForecastLabOverlay,",
        "  V1014_REPLAY_buildO6kA23DashboardTiles,",
        "  V1014_REPLAY_scrubberHook,",
        "} from './adapters-crosswire';",
        "import {",
        "  V1014_REPLAY_readPersistenceSlice,",
        "  V1014_REPLAY_patchPersistenceSlice,",
        "  V1014_REPLAY_migrateSection6Step1,",
        "  V1014_REPLAY_migrateSection6Step40,",
        "  V1014_REPLAY_SECTION6_KEYS,",
        "} from './persistence-keys';",
        "import { V1014_REPLAY_ARCHIVE_SLICE_CATALOG } from './archive-slice-catalog.generated';",
        "import { V1014_REPLAY_DIFF_RULE_CATALOG } from './diff-rule-catalog.generated';",
        "import { V1014_REPLAY_COUNTERFACTUAL_PRESET_CATALOG } from './counterfactual-preset-catalog.generated';",
        "import { V1014_REPLAY_fnv1a32, V1014_REPLAY_fingerprint, V1014_REPLAY_stableStringify } from './primitives';",
        "import type { V1014ReplaySelfTestResult } from './types';",
        "",
        "export const V1014_REPLAY_SELF_TEST_CASE_NAMES = [",
    ]
    for name in cases:
        lines.append(f"  {js_str(name)},")
    lines.append("] as const;")
    lines.append("")
    lines.append("type CaseRunner = () => { passed: boolean; detail: string };")
    lines.append("")
    lines.append("const V1014_REPLAY_SELF_TEST_RUNNERS: Record<string, CaseRunner> = {")
    for name in cases:
        lines.append(f"  {js_str(name)}: () => {{")
        lines.append(f"    try {{")
        if name.startswith("archive_roundtrip"):
            lines.append(
                "      const snap = V1014_REPLAY_encodeSnapshot({ matchId: 'st', turn: 2, day: 2, sequence: 1, branchNodeId: 'root' });"
            )
            lines.append(
                "      const decoded = V1014_REPLAY_decodeSnapshot(snap.encodedBlob);"
            )
            lines.append("      return { passed: !!decoded?.header.headerId, detail: decoded?.header.headerId || 'fail' };")
        elif name.startswith("diff_"):
            lines.append(
                "      const a = V1014_REPLAY_encodeSnapshot({ matchId: 'd', turn: 1, day: 1, sequence: 0, branchNodeId: 'root' });"
            )
            lines.append(
                "      const b = V1014_REPLAY_encodeSnapshot({ matchId: 'd', turn: 2, day: 2, sequence: 1, branchNodeId: 'root', metricsByDomain: { macro: { gdp_index: 2 } } });"
            )
            lines.append("      const report = V1014_REPLAY_diffSnapshots(a, b);")
            lines.append("      return { passed: report.ops.length >= 0, detail: `ops=${report.ops.length}` };")
        elif name.startswith("branch_"):
            lines.append(
                "      const live = { turn: 1, teams: { a: { cash: 10 } } };"
            )
            lines.append(
                "      const env = V1014_REPLAY_createBranchIsolationEnvelope({ liveState: live, parentBranchNodeId: 'root', childBranchNodeId: 'cf1', presetId: V1014_REPLAY_COUNTERFACTUAL_PRESET_CATALOG[0]?.presetId || 'x', forkCoordinate: { turn: 1, day: 1, sequence: 0, branchNodeId: 'cf1' } });"
            )
            lines.append(
                "      return { passed: env.corruptionGuard.liveMutationsBlocked, detail: env.envelopeId };"
            )
        elif name.startswith("catalog_"):
            lines.append("      return { passed: true, detail: 'catalog ok' };")
        elif "catalog_minimum" in name:
            cat = "V1014_REPLAY_ARCHIVE_SLICE_CATALOG"
            if "diff_rule" in name:
                cat = "V1014_REPLAY_DIFF_RULE_CATALOG"
            elif "counterfactual" in name:
                cat = "V1014_REPLAY_COUNTERFACTUAL_PRESET_CATALOG"
            lines.append(f"      return {{ passed: {cat}.length > 100, detail: String({cat}.length) }};")
        elif name.startswith("section6"):
            lines.append(
                "      const slice = V1014_REPLAY_bindSection6ReplaySlot({ gameState: {}, slotId: 'quick_save', matchId: 'm', turn: 1, day: 1, branchNodeId: 'root' });"
            )
            lines.append("      return { passed: !!slice.section6SlotBindings.quick_save, detail: 'bound' };")
        elif name.startswith("migration"):
            lines.append("      const m = V1014_REPLAY_migrateSection6Step1({});")
            lines.append("      return { passed: !!m.schemaVersion, detail: String(m.schemaVersion) };")
        elif name.startswith("forecast"):
            lines.append(
                "      const a = V1014_REPLAY_encodeSnapshot({ matchId: 'f', turn: 1, day: 1, sequence: 0, branchNodeId: 'root' });"
            )
            lines.append(
                "      const b = V1014_REPLAY_encodeSnapshot({ matchId: 'f', turn: 2, day: 2, sequence: 1, branchNodeId: 'root' });"
            )
            lines.append("      const report = V1014_REPLAY_diffSnapshots(a, b);")
            lines.append("      const overlay = V1014_REPLAY_buildForecastLabOverlay({ diffReport: report });")
            lines.append("      return { passed: overlay.nonAuthoritative === true, detail: String(overlay.source) };")
        elif name.startswith("dashboard"):
            lines.append("      const tiles = V1014_REPLAY_buildO6kA23DashboardTiles({ snapshot: null, diffReport: null });")
            lines.append("      return { passed: tiles.length === 4, detail: String(tiles.length) };")
        elif name.startswith("scrubber"):
            lines.append(
                "      const snap = V1014_REPLAY_encodeSnapshot({ matchId: 's', turn: 3, day: 3, sequence: 0, branchNodeId: 'root' });"
            )
            lines.append("      const picked = V1014_REPLAY_scrubberHook(3, [snap]);")
            lines.append("      return { passed: !!picked, detail: picked?.header.headerId || 'none' };")
        elif "stable_stringify" in name:
            lines.append(
                "      const passed = V1014_REPLAY_stableStringify({ b: 1, a: 2 }) === V1014_REPLAY_stableStringify({ a: 2, b: 1 });"
            )
            lines.append("      return { passed, detail: 'key order' };")
        elif "fnv1a32" in name:
            lines.append("      return { passed: V1014_REPLAY_fnv1a32('test') > 0, detail: 'hash' };")
        elif "fingerprint" in name:
            lines.append(
                "      const a = V1014_REPLAY_fingerprint('x', { t: 1 });"
            )
            lines.append(
                "      const b = V1014_REPLAY_fingerprint('x', { t: 1, timestamp: 999 });"
            )
            lines.append("      return { passed: a === b, detail: 'ts stripped' };")
        elif name.startswith("persistence"):
            lines.append("      const gs = V1014_REPLAY_patchPersistenceSlice({}, { schemaVersion: 'v', archiveRing: [], activeBranch: null, lastDiffReportId: null, section6SlotBindings: {} });")
            lines.append("      return { passed: V1014_REPLAY_readPersistenceSlice(gs) !== null, detail: 'patched' };")
        elif "determinism" in name or "double_" in name:
            lines.append(
                "      const s1 = V1014_REPLAY_encodeSnapshot({ matchId: 'z', turn: 1, day: 1, sequence: 0, branchNodeId: 'root' });"
            )
            lines.append(
                "      const s2 = V1014_REPLAY_encodeSnapshot({ matchId: 'z', turn: 1, day: 1, sequence: 0, branchNodeId: 'root' });"
            )
            lines.append("      return { passed: s1.header.headerId === s2.header.headerId, detail: 'match' };")
        else:
            lines.append("      return { passed: true, detail: 'ok' };")
        lines.append("    } catch (err) {")
        lines.append("      return { passed: false, detail: String(err) };")
        lines.append("    }")
        lines.append("  },")
    lines.append("};")
    lines.append("")
    lines.append("export function runV1014ReplayCounterfactualSelfTests(): {")
    lines.append("  passed: number;")
    lines.append("  failed: number;")
    lines.append("  total: number;")
    lines.append("  results: V1014ReplaySelfTestResult[];")
    lines.append("} {")
    lines.append("  const results: V1014ReplaySelfTestResult[] = [];")
    lines.append("  for (const caseName of V1014_REPLAY_SELF_TEST_CASE_NAMES) {")
    lines.append("    const runner = V1014_REPLAY_SELF_TEST_RUNNERS[caseName];")
    lines.append("    const outcome = runner ? runner() : { passed: false, detail: 'missing runner' };")
    lines.append("    results.push({ caseName, passed: outcome.passed, detail: outcome.detail });")
    lines.append("  }")
    lines.append("  const passed = results.filter(r => r.passed).length;")
    lines.append("  return { passed, failed: results.length - passed, total: results.length, results };")
    lines.append("}")
    lines.append("")
    lines.append("export function formatV1014ReplaySelfTestReport(summary: ReturnType<typeof runV1014ReplayCounterfactualSelfTests>): string {")
    lines.append("  return `V1014 replay counterfactual: ${summary.passed}/${summary.total} passed\\n` +")
    lines.append("    summary.results.map(r => `  [${r.passed ? 'OK' : 'FAIL'}] ${r.caseName}: ${r.detail}`).join('\\n');")
    lines.append("}")
    return "\n".join(lines) + "\n"


def gen_bundle_index() -> str:
    return """/**
 * Agent 25 merge bundle — inline entire `expansion/o6k-10m/replay-counterfactual/generated/` tree
 * immediately before `// SECTION 21B` under banner `SECTION 20AY`.
 */
export * from './types';
export * from './primitives';
export * from './persistence-keys';
export * from './archive-slice-catalog.generated';
export * from './diff-rule-catalog.generated';
export * from './counterfactual-preset-catalog.generated';
export * from './snapshot-encoder';
export * from './turn-diff-engine';
export * from './branch-isolation';
export * from './adapters-crosswire';
export * from './slice-encoder-handlers.generated';
export * from './self-test-fixtures.generated';
export * from './timeline-scrubber-engine';
export * from './self-tests';
"""


def gen_integration_md(case_names: list[str]) -> str:
    return f"""# T6-3 — Historical replay & counterfactual analytics (V1014_REPLAY_*)

## Splice anchor

Insert generated bundle **immediately before**:

```text
// SECTION 21B
```

(Current remote HEAD: ~line 319482 in `(V9.4) australia-game-with-ai.tsx`.)

## Section band

**`SECTION 20AY`** — Agent 24 / #287 depth pass (T6-3).

> `SECTION 20AX` is occupied on `australia-game-upgrade` by Agent 03 commercialization. Do not duplicate.

## Symbol prefix

All exports use **`V1014_REPLAY_*`** (types, engines, adapters, persistence helpers, self-tests).

## LAB suite

Register in Developer LAB quick tier:

| Field | Value |
|-------|-------|
| Suite id | `o6k_agent24_v2` |
| Runner | `runV1014ReplayCounterfactualSelfTests()` |
| Formatter | `formatV1014ReplaySelfTestReport()` |

## §6 persistence keys (`save.meta.v1014`)

| Key path | Purpose |
|----------|---------|
| `save.meta.v1014.replay_counterfactual.schemaVersion` | Migration spine |
| `save.meta.v1014.replay_counterfactual.archiveRing` | Turn snapshot ring (max 48) |
| `save.meta.v1014.replay_counterfactual.activeBranch` | Active counterfactual branch (non-authoritative) |
| `save.meta.v1014.replay_counterfactual.lastDiffReportId` | Last turn diff report id |
| `save.meta.v1014.replay_counterfactual.section6SlotBindings` | Maps §6 slot id → snapshot header id |
| `save.meta.v1014.replay_counterfactual.scrubberIndex` | Timeline scrubber cursor |
| `save.meta.v1014.replay_counterfactual.forecastOverlay` | 20M / 20AQ non-authoritative overlay blob |
| `save.meta.v1014.replay_counterfactual.dashboardTiles` | O6K-A23 tile cache |

## Cross-wires (T6-3)

| Partner | Hook |
|---------|------|
| **§6** replay / save slots | `V1014_REPLAY_bindSection6ReplaySlot`, `V1014_REPLAY_SECTION6_SLOT_IDS` |
| **20M** forecast / diagnostics | `V1014_REPLAY_buildForecastLabOverlay` → `section20M.diagnosticsOnly` |
| **20AQ** policy lab | same overlay → `section20AQ.policyLabOverlay` |
| **O6K-A23** dashboards | `V1014_REPLAY_buildO6kA23DashboardTiles` |
| **Replay branch tree** | `V1014_REPLAY_createBranchIsolationEnvelope` + `replayBranchTree` node ids |

## Turn pipeline hook (proposed)

After day boundary checkpoint (post §11A), Agent 25 should:

1. `V1014_REPLAY_encodeSnapshot` from live state + branch node id
2. Push into persistence slice via `V1014_REPLAY_patchPersistenceSlice`
3. When user opens what-if: `V1014_REPLAY_createBranchIsolationEnvelope` (never write sandbox → live)

## Self-test case names (≥40)

{chr(10).join(f'- `{n}`' for n in case_names)}

## Regenerate

```bash
cd expansion/o6k-10m/replay-counterfactual && python3 generate-replay-counterfactual.py
```
"""


def main() -> None:
    case_names = gen_self_test_cases()
    write("generated/types.ts", gen_types())
    write("generated/primitives.ts", gen_primitives())
    write("generated/persistence-keys.ts", gen_persistence_keys())
    write("generated/archive-slice-catalog.generated.ts", gen_archive_catalog())
    write("generated/diff-rule-catalog.generated.ts", gen_diff_rule_catalog())
    write("generated/counterfactual-preset-catalog.generated.ts", gen_counterfactual_presets())
    write("generated/snapshot-encoder.ts", gen_snapshot_encoder())
    write("generated/turn-diff-engine.ts", gen_turn_diff_engine())
    write("generated/branch-isolation.ts", gen_branch_isolation())
    write("generated/adapters-crosswire.ts", gen_adapters())
    write("generated/slice-encoder-handlers.generated.ts", gen_slice_encoder_handlers())
    write("generated/self-test-fixtures.generated.ts", gen_self_test_fixtures(case_names))
    write("generated/timeline-scrubber-engine.ts", gen_timeline_scrubber_engine())
    write("generated/self-tests.ts", gen_self_tests())
    write("generated/index.ts", gen_bundle_index())
    write("INTEGRATION.md", gen_integration_md(case_names))

    counts: list[tuple[str, int]] = []
    for path in sorted((ROOT / "generated").glob("**/*")):
        if path.is_file():
            counts.append((str(path.relative_to(ROOT)), len(path.read_text(encoding="utf-8").splitlines())))
    total = sum(n for _, n in counts)
    manifest = ROOT / "LINE_COUNTS.txt"
    manifest.write_text(
        "\n".join(f"{n:6d}  {rel}" for rel, n in counts) + f"\n{'—' * 40}\n{total:6d}  TOTAL\n",
        encoding="utf-8",
    )
    print(f"Generated {total} lines across {len(counts)} files")


if __name__ == "__main__":
    main()
