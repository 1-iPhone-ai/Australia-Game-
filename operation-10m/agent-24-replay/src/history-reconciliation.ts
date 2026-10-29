import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24AuditTrail } from './audit-trails.ts';
import type { Agent24MultiSessionContinuity } from './multi-session.ts';
import type { Agent24ReplayAttestation } from './replay-attestation.ts';

export interface Agent24SessionReconciliationIssue {
  sessionId: string;
  kind: 'missing_save' | 'missing_resume' | 'turn_overlap' | 'attestation_mismatch';
  detail: string;
  fingerprint: string;
}

export interface Agent24HistoryReconciliationReport {
  reportId: string;
  matchId: string;
  sessionCount: number;
  issueCount: number;
  issues: Agent24SessionReconciliationIssue[];
  reconciled: boolean;
  reconciliationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24HistoryReconciliationInput {
  matchId: string;
  multiSession: Agent24MultiSessionContinuity;
  auditTrail: Agent24AuditTrail;
  attestation: Agent24ReplayAttestation;
}

export function buildAgent24HistoryReconciliationReport(
  input: Agent24HistoryReconciliationInput,
): Agent24HistoryReconciliationReport {
  const issues: Agent24SessionReconciliationIssue[] = [];
  const savesBySession = new Map<string, number>();
  const resumesBySession = new Map<string, number>();

  for (const entry of input.auditTrail.entries) {
    const sid = entry.relatedSessionId;
    if (!sid) continue;
    if (entry.action === 'session_saved') savesBySession.set(sid, (savesBySession.get(sid) || 0) + 1);
    if (entry.action === 'session_resumed') resumesBySession.set(sid, (resumesBySession.get(sid) || 0) + 1);
  }

  for (const session of input.multiSession.sessions) {
    const saves = savesBySession.get(session.sessionId) || 0;
    const resumes = resumesBySession.get(session.sessionId) || 0;
    if (
      input.multiSession.sessionCount > 1 &&
      saves === 0 &&
      session.endedAtTurn > session.startedAtTurn
    ) {
      issues.push({
        sessionId: session.sessionId,
        kind: 'missing_save',
        detail: `Session ${session.sessionId} ended without session_saved audit`,
        fingerprint: o6kAgent24Fingerprint('recon_missing_save', { sessionId: session.sessionId }),
      });
    }
    if (resumes === 0 && input.multiSession.sessionCount > 1 && session.sessionId !== input.multiSession.sessions[0]?.sessionId) {
      issues.push({
        sessionId: session.sessionId,
        kind: 'missing_resume',
        detail: `Follow-on session ${session.sessionId} lacks session_resumed audit`,
        fingerprint: o6kAgent24Fingerprint('recon_missing_resume', { sessionId: session.sessionId }),
      });
    }
  }

  if (!input.multiSession.resumeSafe) {
    issues.push({
      sessionId: '_overlap',
      kind: 'turn_overlap',
      detail: 'Multi-session continuity flagged overlapping turn ranges',
      fingerprint: o6kAgent24Fingerprint('recon_overlap', { resumeSafe: false }),
    });
  }

  if (input.attestation.status === 'failed') {
    issues.push({
      sessionId: '_attest',
      kind: 'attestation_mismatch',
      detail: 'Replay attestation failed while sessions present',
      fingerprint: o6kAgent24Fingerprint('recon_attest_failed', { status: input.attestation.status }),
    });
  }

  issues.sort((a, b) => a.sessionId.localeCompare(b.sessionId) || a.kind.localeCompare(b.kind));
  const issueCount = issues.length;
  let reconciliationScore = 100;
  reconciliationScore -= issueCount * 12;
  reconciliationScore = Math.max(0, Math.min(100, reconciliationScore));
  const reconciled = issueCount === 0 && input.multiSession.resumeSafe && input.attestation.status !== 'failed';

  return {
    reportId: o6kAgent24Fingerprint('history_reconciliation', { matchId: input.matchId, sessions: input.multiSession.sessionCount }),
    matchId: input.matchId,
    sessionCount: input.multiSession.sessionCount,
    issueCount,
    issues,
    reconciled,
    reconciliationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('history_reconciliation_body', {
      issues: issues.map(i => i.fingerprint),
      reconciled,
      reconciliationScore,
    }),
  };
}
