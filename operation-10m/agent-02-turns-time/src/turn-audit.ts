import { TurnClock, TurnTimeSnapshot } from './types.js';
import { armedFollowUpCount } from './delayed-consequences.js';

export interface TurnTimeAuditReport {
  turnIndex: number;
  dayIndex: number;
  effectSequence: number;
  pendingObligations: number;
  firedObligations: number;
  queuedEvents: number;
  dispatchedEvents: number;
  activeConstruction: number;
  completedConstruction: number;
  armedFollowUps: number;
  paused: boolean;
  blockedAdvanceCount: number;
}

export function buildTurnTimeAuditReport(snapshot: TurnTimeSnapshot): TurnTimeAuditReport {
  const { clock, obligations, projects, events, pause, followUpRules } = snapshot;
  return {
    turnIndex: clock.turnIndex,
    dayIndex: clock.dayIndex,
    effectSequence: clock.effectSequence,
    pendingObligations: obligations.filter((o) => o.status === 'pending').length,
    firedObligations: obligations.filter((o) => o.status === 'fired').length,
    queuedEvents: events.filter((e) => e.status === 'queued').length,
    dispatchedEvents: events.filter((e) => e.status === 'dispatched').length,
    activeConstruction: projects.filter((p) => p.status === 'under_construction').length,
    completedConstruction: projects.filter((p) => p.status === 'completed').length,
    armedFollowUps: armedFollowUpCount(followUpRules),
    paused: pause.paused,
    blockedAdvanceCount: pause.blockedAdvanceCount,
  };
}

function stableSnapshotPayload(snapshot: TurnTimeSnapshot): string {
  const normalized = {
    clock: {
      turnIndex: snapshot.clock.turnIndex,
      dayIndex: snapshot.clock.dayIndex,
      effectSequence: snapshot.clock.effectSequence,
      phase: snapshot.clock.phase,
      epochIso: snapshot.clock.epochIso,
      phaseTokens: snapshot.clock.phaseTokens,
    },
    obligations: [...snapshot.obligations].sort((a, b) => a.id.localeCompare(b.id)),
    events: [...snapshot.events].sort((a, b) => a.id.localeCompare(b.id)),
    projects: [...snapshot.projects].sort((a, b) => a.id.localeCompare(b.id)),
    followUpRules: [...snapshot.followUpRules].sort((a, b) => a.id.localeCompare(b.id)),
    pause: snapshot.pause,
  };
  return JSON.stringify(normalized);
}

/** Browser-safe deterministic fingerprint (FNV-1a 64-bit). */
export function fnv1a64Hex(input: string): string {
  let hash = 0xcbf29ce484222325n;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= BigInt(input.charCodeAt(i));
    hash = (hash * 0x100000001b3n) & 0xffffffffffffffffn;
  }
  return hash.toString(16).padStart(16, '0');
}

export function snapshotDigest(snapshot: TurnTimeSnapshot): string {
  return fnv1a64Hex(stableSnapshotPayload(snapshot));
}

export function clockAtLeast(clock: TurnClock, turnIndex: number, dayIndex?: number): boolean {
  if (clock.turnIndex < turnIndex) return false;
  if (dayIndex !== undefined && clock.dayIndex < dayIndex) return false;
  return true;
}
