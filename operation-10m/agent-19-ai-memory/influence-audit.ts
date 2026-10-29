import type { MemoryInfluenceAuditFinding, MemoryInfluenceDecisionLike } from './types.ts';

/** Per-decision cap documented in V9.4 influence (directives + learning + prior nudges). */
export const AGENT19_MAX_SINGLE_DECISION_INFLUENCE = 55;

const round2 = (n: number) => Math.round(n * 100) / 100;

export function auditMemoryInfluenceDecisionPair<T extends MemoryInfluenceDecisionLike>(
  before: T,
  after: T,
): MemoryInfluenceAuditFinding[] {
  const findings: MemoryInfluenceAuditFinding[] = [];
  const base = before.score ?? 0;
  const next = after.score ?? 0;
  const influence = after.memoryInfluence;
  if (influence === undefined || influence === 0) {
    if (next !== base) {
      findings.push({
        code: 'score_changed_without_trace',
        severity: 'warn',
        message: `Score changed (${base} → ${next}) without memoryInfluence trace.`,
      });
    }
    return findings;
  }
  const expected = round2(base + influence);
  if (Math.abs(expected - next) > 0.02) {
    findings.push({
      code: 'score_influence_mismatch',
      severity: 'fail',
      message: `score ${next} != base ${base} + influence ${influence} (expected ${expected}).`,
    });
  }
  if (Math.abs(influence) > AGENT19_MAX_SINGLE_DECISION_INFLUENCE) {
    findings.push({
      code: 'influence_cap_exceeded',
      severity: 'fail',
      message: `memoryInfluence ${influence} exceeds cap ${AGENT19_MAX_SINGLE_DECISION_INFLUENCE}.`,
    });
  }
  const slices = after.memoryInfluenceSlices || [];
  const sliceSum = round2(slices.reduce((s, x) => s + x.delta, 0));
  if (slices.length && Math.abs(sliceSum - influence) > 0.05) {
    findings.push({
      code: 'slice_sum_mismatch',
      severity: 'warn',
      message: `Slice sum ${sliceSum} differs from memoryInfluence ${influence}.`,
    });
  }
  const reasons = after.memoryReasons || [];
  if (reasons.length && reasons.length !== Math.min(slices.length, 5)) {
    findings.push({
      code: 'reason_count_drift',
      severity: 'info',
      message: `${reasons.length} memoryReasons vs ${slices.length} slices (canonical caps at 5 reasons).`,
    });
  }
  slices.forEach((s, i) => {
    if (!s.reason?.trim()) {
      findings.push({ code: 'empty_slice_reason', severity: 'fail', message: `Slice ${i} missing reason.` });
    }
  });
  return findings;
}

export function auditMemoryInfluenceDecisions<T extends MemoryInfluenceDecisionLike>(
  before: T[],
  after: T[],
): MemoryInfluenceAuditFinding[] {
  const findings: MemoryInfluenceAuditFinding[] = [];
  if (before.length !== after.length) {
    findings.push({
      code: 'option_count_changed',
      severity: 'fail',
      message: `Decision count changed (${before.length} → ${after.length}); memory must not remove options.`,
    });
    return findings;
  }
  before.forEach((b, i) => {
    auditMemoryInfluenceDecisionPair(b, after[i]).forEach(f => findings.push(f));
  });
  return findings;
}

export function auditFindingsOk(findings: MemoryInfluenceAuditFinding[]): boolean {
  return !findings.some(f => f.severity === 'fail');
}
