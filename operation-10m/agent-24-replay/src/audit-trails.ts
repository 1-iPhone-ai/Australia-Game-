import { o6kAgent24Fingerprint, o6kAgent24StableStringify } from './fingerprint.ts';

export type Agent24AuditTrailAction =
  | 'replay_checkpoint'
  | 'branch_created'
  | 'branch_switched'
  | 'timeline_merged'
  | 'session_saved'
  | 'session_resumed'
  | 'determinism_verified'
  | 'scenario_evaluated';

export interface Agent24AuditTrailEntry {
  entryId: string;
  sequence: number;
  turn: number;
  day: number;
  action: Agent24AuditTrailAction;
  actorId: string;
  summary: string;
  relatedTimelineId: string | null;
  relatedSessionId: string | null;
  fingerprint: string;
}

export interface Agent24AuditTrailBuildInput {
  matchId: string;
  turn: number;
  day: number;
  entries: Array<{
    action: Agent24AuditTrailAction;
    actorId?: string;
    summary: string;
    relatedTimelineId?: string | null;
    relatedSessionId?: string | null;
    turn?: number;
    day?: number;
  }>;
}

export interface Agent24AuditTrail {
  trailId: string;
  matchId: string;
  entryCount: number;
  entries: Agent24AuditTrailEntry[];
  actionCounts: Record<Agent24AuditTrailAction, number>;
  deterministicFingerprint: string;
}

const ZERO_COUNTS = (): Record<Agent24AuditTrailAction, number> => ({
  replay_checkpoint: 0,
  branch_created: 0,
  branch_switched: 0,
  timeline_merged: 0,
  session_saved: 0,
  session_resumed: 0,
  determinism_verified: 0,
  scenario_evaluated: 0,
});

export function buildAgent24AuditTrail(input: Agent24AuditTrailBuildInput): Agent24AuditTrail {
  const entries: Agent24AuditTrailEntry[] = [];
  const actionCounts = ZERO_COUNTS();
  let seq = 0;

  const sortedRaw = [...input.entries].sort(
    (a, b) => (a.turn ?? input.turn) - (b.turn ?? input.turn) || a.summary.localeCompare(b.summary),
  );

  for (const raw of sortedRaw) {
    seq++;
    const turn = raw.turn ?? input.turn;
    const day = raw.day ?? input.day;
    const action = raw.action;
    actionCounts[action] += 1;
    const body = {
      seq,
      action,
      summary: raw.summary.slice(0, 200),
      timeline: raw.relatedTimelineId ?? null,
      session: raw.relatedSessionId ?? null,
    };
    entries.push({
      entryId: o6kAgent24Fingerprint('audit_entry', { matchId: input.matchId, ...body }),
      sequence: seq,
      turn,
      day,
      action,
      actorId: raw.actorId || 'system',
      summary: raw.summary.slice(0, 200),
      relatedTimelineId: raw.relatedTimelineId ?? null,
      relatedSessionId: raw.relatedSessionId ?? null,
      fingerprint: o6kAgent24Fingerprint('audit_evt', body),
    });
  }

  const fpPayload = {
    entries: entries.map(e => e.fingerprint),
    actionCounts,
  };

  return {
    trailId: o6kAgent24Fingerprint('audit_trail', { matchId: input.matchId, count: entries.length }),
    matchId: input.matchId,
    entryCount: entries.length,
    entries,
    actionCounts,
    deterministicFingerprint: o6kAgent24Fingerprint('audit_trail_body', o6kAgent24StableStringify(fpPayload)),
  };
}

export function mergeAgent24AuditTrails(a: Agent24AuditTrail, b: Agent24AuditTrail): Agent24AuditTrail {
  if (a.matchId !== b.matchId) {
    throw new Error('Cannot merge audit trails for different matches');
  }
  const combined = [...a.entries, ...b.entries].sort((x, y) => x.sequence - y.sequence || x.entryId.localeCompare(y.entryId));
  return buildAgent24AuditTrail({
    matchId: a.matchId,
    turn: Math.max(a.entries.at(-1)?.turn ?? 0, b.entries.at(-1)?.turn ?? 0),
    day: Math.max(a.entries.at(-1)?.day ?? 0, b.entries.at(-1)?.day ?? 0),
    entries: combined.map(e => ({
      action: e.action,
      actorId: e.actorId,
      summary: e.summary,
      relatedTimelineId: e.relatedTimelineId,
      relatedSessionId: e.relatedSessionId,
      turn: e.turn,
      day: e.day,
    })),
  });
}
