#!/usr/bin/env python3
"""Generate O6K Agent 24 historical replay analytics expansion module."""
from pathlib import Path

OUT = Path(__file__).parent / "o6k-agent-24-historical-replay-analytics.tsx"

HEADER = r'''/**
 * O6K Agent 24 — Historical Replay Analytics Expansion
 * Domain: timelines, replay branches, milestones, post-match & in-match historical analytics.
 * Determinism: fingerprints and replay verification use stable ordering and exclude wall-clock fields.
 *
 * INTEGRATION (Agent 25): inline this file into `(V9.4) australia-game-with-ai.tsx` at anchor
 * `// O6K_AGENT24_INTEGRATION_ANCHOR` and wire exports listed in internal/agents/agent-24-integration-contract.md
 */
import React, { useCallback, useMemo, useState } from 'react';

export const O6K_AGENT24_MODULE_VERSION = '1.0.0';
export const O6K_AGENT24_MODULE_ID = 'history_replay_analytics';

/** Stable FNV-1a 32-bit — replay-safe fingerprint primitive (no Math.random). */
export function o6kAgent24Fnv1a32(input: string, seed = 0x811c9dc5): number {
  let hash = seed >>> 0;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

export function o6kAgent24StableStringify(value: unknown): string {
  if (value === null || value === undefined) return String(value);
  if (typeof value === 'number' || typeof value === 'boolean') return JSON.stringify(value);
  if (typeof value === 'string') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(o6kAgent24StableStringify).join(',') + ']';
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).filter(k => k !== 'createdAtTimestamp' && k !== 'timestamp' && !k.endsWith('AtMs')).sort();
    return '{' + keys.map(k => JSON.stringify(k) + ':' + o6kAgent24StableStringify(obj[k])).join(',') + '}';
  }
  return JSON.stringify(String(value));
}

export function o6kAgent24Fingerprint(label: string, payload: unknown): string {
  const body = o6kAgent24StableStringify(payload);
  const h = o6kAgent24Fnv1a32(label + '|' + body);
  return `o6k24_${label}_${h.toString(16).padStart(8, '0')}`;
}

export type O6kHistoricalMilestoneCategory =
  | 'economy' | 'territory' | 'governance' | 'infrastructure' | 'expedition'
  | 'diplomacy' | 'crisis' | 'replay' | 'automation' | 'victory';

export interface O6kHistoricalMilestoneDefinition {
  id: string;
  category: O6kHistoricalMilestoneCategory;
  title: string;
  description: string;
  /** Deterministic weight for analytics scoring (integer). */
  weight: number;
  /** Optional ledger event substring matchers (lowercase). */
  ledgerMatchers: string[];
  regionCodes?: string[];
}

export interface O6kHistoricalMilestoneHit {
  definitionId: string;
  turn: number;
  day: number;
  sequence: number;
  category: O6kHistoricalMilestoneCategory;
  title: string;
  weight: number;
  sourceEventId?: string;
  fingerprint: string;
}

export interface O6kHistoricalTimelineSlice {
  sliceId: string;
  timelineId: string;
  fromTurn: number;
  toTurn: number;
  fromSequence: number;
  toSequence: number;
  milestoneHits: O6kHistoricalMilestoneHit[];
  netWorthByTeam: Record<string, number>;
  standingByRegion: Record<string, number>;
  deterministicFingerprint: string;
}

export interface O6kHistoricalAnalyticsSnapshot {
  snapshotId: string;
  matchId: string;
  activeTimelineId: string;
  generatedAtTurn: number;
  generatedAtDay: number;
  milestoneHits: O6kHistoricalMilestoneHit[];
  timelineSlices: O6kHistoricalTimelineSlice[];
  replayBranchNodeIds: string[];
  integrity: {
    deterministicMode: boolean;
    replayEventCount: number;
    checkpointCount: number;
    fingerprint: string;
  };
}

export interface O6kHistoricalAnalyticsBuildInput {
  matchId: string;
  turn: number;
  day: number;
  activeTimelineId?: string;
  replayBranchTree?: {
    activeNodeId: string;
    nodesById: Record<string, { nodeId: string; branchTurn: number; label: string }>;
  } | null;
  gameActivityLedger?: { events?: Array<Record<string, unknown>> } | null;
  replay?: { events?: Array<Record<string, unknown>>; checkpoints?: Record<string, unknown> } | null;
  teamsById?: Record<string, { netWorth?: number; money?: number; id?: string }>;
  regionalStanding?: Record<string, number>;
  deterministicMode?: boolean;
}

'''

FOOTER = r'''
export function buildO6kHistoricalAnalyticsSnapshot(input: O6kHistoricalAnalyticsBuildInput): O6kHistoricalAnalyticsSnapshot {
  const defs = O6K_AGENT24_MILESTONE_CATALOG;
  const ledgerEvents = input.gameActivityLedger?.events || [];
  const replayEvents = input.replay?.events || [];
  const combined = [...ledgerEvents, ...replayEvents];
  const hits: O6kHistoricalMilestoneHit[] = [];
  let seq = 0;
  for (const evt of combined) {
    seq++;
    const text = String(evt?.title || evt?.description || evt?.message || evt?.eventType || '').toLowerCase();
    const turn = Number(evt?.turn || evt?.day || input.turn || 1);
    const day = Number(evt?.day || evt?.turn || input.day || 1);
    for (const def of defs) {
      if (def.ledgerMatchers.some(m => text.includes(m))) {
        const payload = { defId: def.id, turn, day, seq, text: text.slice(0, 120) };
        hits.push({
          definitionId: def.id,
          turn,
          day,
          sequence: seq,
          category: def.category,
          title: def.title,
          weight: def.weight,
          sourceEventId: String(evt?.id || evt?.eventId || ''),
          fingerprint: o6kAgent24Fingerprint('milestone_hit', payload),
        });
        break;
      }
    }
  }
  const netWorthByTeam: Record<string, number> = {};
  if (input.teamsById) {
    for (const [teamId, team] of Object.entries(input.teamsById)) {
      netWorthByTeam[teamId] = Number(team?.netWorth ?? team?.money ?? 0);
    }
  }
  const standingByRegion = { ...(input.regionalStanding || {}) };
  const branchIds = input.replayBranchTree ? Object.keys(input.replayBranchTree.nodesById || {}) : [];
  const slice: O6kHistoricalTimelineSlice = {
    sliceId: o6kAgent24Fingerprint('slice', { turn: input.turn, day: input.day }),
    timelineId: input.activeTimelineId || 'main',
    fromTurn: 1,
    toTurn: input.turn,
    fromSequence: 0,
    toSequence: seq,
    milestoneHits: hits,
    netWorthByTeam,
    standingByRegion,
    deterministicFingerprint: o6kAgent24Fingerprint('timeline_slice', { hits: hits.map(h => h.fingerprint), netWorthByTeam }),
  };
  const integrityPayload = {
    hits: hits.map(h => h.fingerprint),
    branchIds: branchIds.sort(),
    replayEventCount: replayEvents.length,
    checkpointCount: Object.keys(input.replay?.checkpoints || {}).length,
  };
  return {
    snapshotId: o6kAgent24Fingerprint('snapshot', integrityPayload),
    matchId: input.matchId,
    activeTimelineId: input.activeTimelineId || 'main',
    generatedAtTurn: input.turn,
    generatedAtDay: input.day,
    milestoneHits: hits,
    timelineSlices: [slice],
    replayBranchNodeIds: branchIds,
    integrity: {
      deterministicMode: input.deterministicMode !== false,
      replayEventCount: replayEvents.length,
      checkpointCount: Object.keys(input.replay?.checkpoints || {}).length,
      fingerprint: o6kAgent24Fingerprint('integrity', integrityPayload),
    },
  };
}

export interface O6kReplayDeterminismProbeResult {
  probeId: string;
  passed: boolean;
  expectedFingerprint: string;
  actualFingerprint: string;
  detail: string;
}

export function probeO6kReplayDeterminismTwice(build: () => O6kHistoricalAnalyticsBuildInput): O6kReplayDeterminismProbeResult {
  const a = buildO6kHistoricalAnalyticsSnapshot(build());
  const b = buildO6kHistoricalAnalyticsSnapshot(build());
  const passed = a.integrity.fingerprint === b.integrity.fingerprint && a.snapshotId === b.snapshotId;
  return {
    probeId: 'o6k24_double_build',
    passed,
    expectedFingerprint: a.integrity.fingerprint,
    actualFingerprint: b.integrity.fingerprint,
    detail: passed ? 'Twin builds produced identical integrity fingerprints.' : 'Fingerprint drift detected — exclude wall-clock fields from inputs.',
  };
}

export function diffO6kHistoricalSnapshots(a: O6kHistoricalAnalyticsSnapshot, b: O6kHistoricalAnalyticsSnapshot) {
  const milestoneDelta = b.milestoneHits.length - a.milestoneHits.length;
  const sliceDelta = b.timelineSlices.length - a.timelineSlices.length;
  return {
    milestoneDelta,
    sliceDelta,
    integrityChanged: a.integrity.fingerprint !== b.integrity.fingerprint,
    summary: `Milestones ${milestoneDelta >= 0 ? '+' : ''}${milestoneDelta}; slices ${sliceDelta >= 0 ? '+' : ''}${sliceDelta}; integrity ${a.integrity.fingerprint === b.integrity.fingerprint ? 'stable' : 'changed'}.`,
  };
}

export type O6kHistoricalAnalyticsDashboardTab = 'overview' | 'milestones' | 'timelines' | 'replay' | 'integrity';

const O6K_HISTORICAL_TAB_ORDER: O6kHistoricalAnalyticsDashboardTab[] = ['overview', 'milestones', 'timelines', 'replay', 'integrity'];
const O6K_HISTORICAL_TAB_LABELS: Record<O6kHistoricalAnalyticsDashboardTab, string> = {
  overview: 'Overview',
  milestones: 'Milestones',
  timelines: 'Timelines',
  replay: 'Replay Link',
  integrity: 'Integrity',
};

export interface O6kHistoricalAnalyticsDashboardProps {
  snapshot: O6kHistoricalAnalyticsSnapshot | null;
  onClose: () => void;
  themeClass?: string;
}

export function O6kHistoricalAnalyticsDashboard(props: O6kHistoricalAnalyticsDashboardProps) {
  const { snapshot, onClose, themeClass = 'bg-gray-900 text-white' } = props;
  const [tab, setTab] = useState<O6kHistoricalAnalyticsDashboardTab>('overview');
  const topMilestones = useMemo(() => {
    if (!snapshot) return [];
    return [...snapshot.milestoneHits].sort((x, y) => y.weight - x.weight || y.turn - x.turn).slice(0, 12);
  }, [snapshot]);
  const onTab = useCallback((id: O6kHistoricalAnalyticsDashboardTab) => setTab(id), []);
  if (!snapshot) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center p-4 ${themeClass}`}>
        <div className="max-w-lg w-full rounded-lg border border-gray-600 p-6">
          <p className="text-sm opacity-80">No historical analytics snapshot yet. Play turns or load a replay to populate milestones.</p>
          <button type="button" className="mt-4 px-4 py-2 rounded bg-blue-600" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }
  return (
    <div className={`fixed inset-0 flex items-start justify-center p-4 overflow-y-auto ${themeClass}`} onClick={onClose}>
      <div className="max-w-5xl w-full rounded-xl border border-gray-600 bg-black/40 p-4 my-8" onClick={e => e.stopPropagation()}>
        <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Historical Analytics — Match {snapshot.matchId}</h2>
          <button type="button" className="px-3 py-1 rounded bg-gray-700 text-sm" onClick={onClose}>Close</button>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {O6K_HISTORICAL_TAB_ORDER.map(id => (
            <button key={id} type="button" className={`px-3 py-1 rounded text-sm ${tab === id ? 'bg-blue-600' : 'bg-gray-800'}`} onClick={() => onTab(id)}>{O6K_HISTORICAL_TAB_LABELS[id]}</button>
          ))}
        </div>
        {tab === 'overview' && (
          <div className="space-y-2 text-sm">
            <p>Turn {snapshot.generatedAtTurn} · Day {snapshot.generatedAtDay} · Timeline {snapshot.activeTimelineId}</p>
            <p>Milestone hits: {snapshot.milestoneHits.length} · Branches: {snapshot.replayBranchNodeIds.length}</p>
            <p className="font-mono text-xs opacity-75">Integrity: {snapshot.integrity.fingerprint}</p>
          </div>
        )}
        {tab === 'milestones' && (
          <ul className="space-y-2 text-sm max-h-96 overflow-y-auto">
            {topMilestones.map(m => (
              <li key={m.fingerprint} className="border border-gray-700 rounded p-2">
                <div className="font-semibold">{m.title} <span className="opacity-60">({m.category})</span></div>
                <div className="text-xs opacity-75">Turn {m.turn} · weight {m.weight} · {m.fingerprint}</div>
              </li>
            ))}
          </ul>
        )}
        {tab === 'timelines' && (
          <div className="space-y-3 text-sm">
            {snapshot.timelineSlices.map(s => (
              <div key={s.sliceId} className="border border-gray-700 rounded p-3">
                <div className="font-semibold">{s.timelineId} · turns {s.fromTurn}–{s.toTurn}</div>
                <div className="text-xs font-mono opacity-75">{s.deterministicFingerprint}</div>
              </div>
            ))}
          </div>
        )}
        {tab === 'replay' && (
          <div className="text-sm space-y-2">
            <p>Replay events recorded: {snapshot.integrity.replayEventCount}</p>
            <p>Checkpoints: {snapshot.integrity.checkpointCount}</p>
            <p className="opacity-75">Cross-link with Replay Dashboard branches: {snapshot.replayBranchNodeIds.join(', ') || 'main only'}</p>
          </div>
        )}
        {tab === 'integrity' && (
          <div className="text-sm space-y-2">
            <p>Deterministic mode: {snapshot.integrity.deterministicMode ? 'ON' : 'OFF'}</p>
            <p className="font-mono text-xs break-all">{snapshot.integrity.fingerprint}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export interface O6kAgent24SelfTestResult { name: string; passed: boolean; detail: string }

export function runO6kAgent24SelfTests(): O6kAgent24SelfTestResult[] {
  const results: O6kAgent24SelfTestResult[] = [];
  const stableInput: O6kHistoricalAnalyticsBuildInput = {
    matchId: 'selftest_match',
    turn: 5,
    day: 5,
    gameActivityLedger: {
      events: [
        { title: 'Regional contract completed', turn: 3, day: 3 },
        { title: 'Infrastructure milestone reached', turn: 4, day: 4 },
      ],
    },
    replay: { events: [{ eventType: 'replay_checkpoint', turn: 5 }], checkpoints: { '5': {} } },
    teamsById: { team_player: { netWorth: 1000 } },
    regionalStanding: { NSW: 50 },
    deterministicMode: true,
  };
  const snap = buildO6kHistoricalAnalyticsSnapshot(stableInput);
  results.push({
    name: 'catalog_non_empty',
    passed: O6K_AGENT24_MILESTONE_CATALOG.length > 100,
    detail: `catalog size ${O6K_AGENT24_MILESTONE_CATALOG.length}`,
  });
  results.push({
    name: 'milestone_detection',
    passed: snap.milestoneHits.length >= 1,
    detail: `hits ${snap.milestoneHits.length}`,
  });
  const probe = probeO6kReplayDeterminismTwice(() => stableInput);
  results.push({ name: 'determinism_probe', passed: probe.passed, detail: probe.detail });
  results.push({
    name: 'stable_stringify_order',
    passed: o6kAgent24StableStringify({ b: 1, a: 2 }) === o6kAgent24StableStringify({ a: 2, b: 1 }),
    detail: 'object key order independent',
  });
  return results;
}

export function formatO6kAgent24SelfTestReport(results: O6kAgent24SelfTestResult[]): string {
  const passed = results.filter(r => r.passed).length;
  return `O6K Agent24 self-tests: ${passed}/${results.length} passed\n` + results.map(r => `  [${r.passed ? 'OK' : 'FAIL'}] ${r.name}: ${r.detail}`).join('\n');
}

/** Reducer-compatible patch for ExtendedGameState historical analytics cache (Agent 25 wires in reducer). */
export function applyO6kHistoricalAnalyticsCachePatch(state: Record<string, unknown>, input: O6kHistoricalAnalyticsBuildInput): Record<string, unknown> {
  const snapshot = buildO6kHistoricalAnalyticsSnapshot(input);
  return {
    ...state,
    o6kHistoricalAnalytics: {
      latest: snapshot,
      history: Array.isArray((state as any).o6kHistoricalAnalytics?.history)
        ? [...(state as any).o6kHistoricalAnalytics.history, snapshot].slice(-32)
        : [snapshot],
    },
  };
}
'''

REGIONS = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT']
CATEGORIES = ['economy', 'territory', 'governance', 'infrastructure', 'expedition', 'diplomacy', 'crisis', 'replay', 'automation', 'victory']

def gen_catalog():
    lines = ['export const O6K_AGENT24_MILESTONE_CATALOG = [']
    idx = 0
    templates = [
        ('contract completed', 'Regional contract milestone', 8),
        ('market price', 'Commodity market swing', 6),
        ('standing', 'Regional standing shift', 7),
        ('directive', 'Governance directive issued', 9),
        ('infrastructure', 'Infrastructure milestone', 8),
        ('expedition', 'Expedition progress', 7),
        ('trade agreement', 'Diplomatic trade pact', 6),
        ('crisis', 'Crisis escalation', 10),
        ('replay branch', 'Timeline branch fork', 5),
        ('auto mode', 'Automation pipeline step', 4),
        ('win condition', 'Victory threshold', 12),
        ('loan repaid', 'Loan retirement', 7),
        ('sabotage', 'Sabotage incident', 9),
        ('negotiation', 'Negotiation outcome', 6),
        ('relic', 'Relic acquisition', 8),
        ('checkpoint', 'Replay checkpoint', 5),
        ('lead change', 'Competitive lead change', 11),
        ('treasury', 'Treasury movement', 6),
        ('auditor', 'Auditor incident', 8),
        ('override', 'Player override', 7),
    ]
    phases = ['opening', 'midgame', 'endgame', 'overtime']
    for cat in CATEGORIES:
        for region in REGIONS:
            for phase in phases:
                for matcher, title_prefix, base_weight in templates:
                    for variant in range(3):
                        idx += 1
                        mid = f'o6k24_milestone_{idx:05d}'
                        title = f'{title_prefix} ({phase}) — {region} v{variant + 1}'
                        desc = (
                            f'Agent 24 catalog #{idx}: category={cat}, region={region}, phase={phase}, '
                            f'matcher={matcher}. Used for historical analytics and deterministic milestone replay indexing.'
                        )
                        weight = base_weight + (variant % 3)
                        matchers = [matcher, phase, region.lower(), cat]
                        lines.append(
                            f"  {{ id: '{mid}', category: '{cat}', title: {json_str(title)}, description: {json_str(desc)}, weight: {weight}, ledgerMatchers: [{', '.join(json_str(m) for m in matchers)}], regionCodes: [{json_str(region)}] }},"
                        )
    lines.append('] as unknown as O6kHistoricalMilestoneDefinition[];')
    return '\n'.join(lines)

def json_str(s: str) -> str:
    return '"' + s.replace('\\', '\\\\').replace('"', '\\"') + '"'

body = gen_catalog()
OUT.write_text(HEADER + body + '\n' + FOOTER, encoding='utf-8')
print(f'Wrote {OUT} lines={len(OUT.read_text().splitlines())}')
