import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24AuditTrail } from './audit-trails.ts';
import type { Agent24TimelineRegistry } from './timeline-registry.ts';
import type { Agent24CheckpointCoverageReport } from './checkpoint-coverage.ts';

export interface Agent24RewindTarget {
  turn: number;
  source: 'checkpoint' | 'branch_fork' | 'session_boundary' | 'audit_anchor';
  label: string;
  safe: boolean;
  fingerprint: string;
}

export interface Agent24RewindSafetyReport {
  reportId: string;
  matchId: string;
  currentTurn: number;
  targets: Agent24RewindTarget[];
  safeTargetCount: number;
  recommendedTurn: number | null;
  deterministicFingerprint: string;
}

export interface Agent24RewindSafetyInput {
  matchId: string;
  currentTurn: number;
  registry: Agent24TimelineRegistry;
  auditTrail: Agent24AuditTrail;
  checkpointCoverage: Agent24CheckpointCoverageReport;
}

function isAuditSafeTurn(trail: Agent24AuditTrail, turn: number): boolean {
  const after = trail.entries.filter(e => e.turn > turn);
  const blocked = after.some(e => e.action === 'timeline_merged' || e.action === 'branch_switched');
  return !blocked;
}

export function buildAgent24RewindSafetyReport(input: Agent24RewindSafetyInput): Agent24RewindSafetyReport {
  const targets: Agent24RewindTarget[] = [];

  for (const turn of input.checkpointCoverage.checkpointTurns) {
    if (turn >= input.currentTurn) continue;
    const safe = isAuditSafeTurn(input.auditTrail, turn);
    targets.push({
      turn,
      source: 'checkpoint',
      label: `Checkpoint @ turn ${turn}`,
      safe,
      fingerprint: o6kAgent24Fingerprint('rewind_checkpoint', { turn, safe }),
    });
  }

  for (const entry of input.registry.entries) {
    const forkTurn = entry.branchTurn;
    if (forkTurn == null || forkTurn >= input.currentTurn) continue;
    const safe = isAuditSafeTurn(input.auditTrail, forkTurn);
    targets.push({
      turn: forkTurn,
      source: 'branch_fork',
      label: `Branch fork ${entry.label}`,
      safe,
      fingerprint: o6kAgent24Fingerprint('rewind_branch', { timeline: entry.timelineId, forkTurn, safe }),
    });
  }

  for (const entry of input.auditTrail.entries) {
    if (entry.action !== 'session_saved' && entry.action !== 'replay_checkpoint') continue;
    if (entry.turn >= input.currentTurn) continue;
    const safe = isAuditSafeTurn(input.auditTrail, entry.turn);
    targets.push({
      turn: entry.turn,
      source: entry.action === 'session_saved' ? 'session_boundary' : 'audit_anchor',
      label: entry.summary.slice(0, 80),
      safe,
      fingerprint: o6kAgent24Fingerprint('rewind_audit', { seq: entry.sequence, turn: entry.turn, safe }),
    });
  }

  const dedup = new Map<number, Agent24RewindTarget>();
  for (const t of targets.sort((a, b) => a.turn - b.turn || a.source.localeCompare(b.source))) {
    const existing = dedup.get(t.turn);
    if (!existing || (t.safe && !existing.safe)) dedup.set(t.turn, t);
  }
  const merged = [...dedup.values()].sort((a, b) => a.turn - b.turn || a.fingerprint.localeCompare(b.fingerprint));
  const safeTargets = merged.filter(t => t.safe);
  const recommendedTurn = safeTargets.length > 0 ? safeTargets[safeTargets.length - 1].turn : null;

  return {
    reportId: o6kAgent24Fingerprint('rewind_safety', { matchId: input.matchId, turn: input.currentTurn }),
    matchId: input.matchId,
    currentTurn: input.currentTurn,
    targets: merged,
    safeTargetCount: safeTargets.length,
    recommendedTurn,
    deterministicFingerprint: o6kAgent24Fingerprint('rewind_safety_body', merged.map(t => t.fingerprint)),
  };
}
