import type {
  AiMemoryHorizonSnapshot,
  AiMemoryInfluenceSlice,
  MemoryInfluenceAuditFinding,
  MemoryInfluenceDecisionLike,
} from './types.ts';

export interface HorizonSliceAlignmentReport {
  alignmentOk: boolean;
  findings: MemoryInfluenceAuditFinding[];
  narrativeLines: string[];
}

/** Flags slices that cite horizons inactive in the current snapshot. */
export function auditHorizonSliceAlignment(
  snapshot: AiMemoryHorizonSnapshot,
  decisions: MemoryInfluenceDecisionLike[],
): HorizonSliceAlignmentReport {
  const slices: AiMemoryInfluenceSlice[] = decisions.flatMap(d => d.memoryInfluenceSlices || []);
  const findings: MemoryInfluenceAuditFinding[] = [];
  slices.forEach(s => {
    if (s.horizon === 'long_term_prior' && !snapshot.longTermPriorActive) {
      findings.push({
        code: 'horizon_slice_inactive',
        severity: 'fail',
        message: `long_term_prior slice (${s.delta}) but prior horizon inactive in snapshot.`,
      });
    }
    if (s.horizon === 'long_term_prior' && snapshot.longTermPriorBeliefCount === 0) {
      findings.push({
        code: 'horizon_slice_empty_prior',
        severity: 'warn',
        message: 'long_term_prior slice with zero prior beliefs in snapshot.',
      });
    }
  });
  const alignmentOk = !findings.some(f => f.severity === 'fail');
  const narrativeLines = [
    alignmentOk
      ? `Horizon slice alignment ok (${slices.length} slice(s) checked).`
      : `Horizon slice alignment FAIL — ${findings.filter(f => f.severity === 'fail').length} inactive horizon cite(s).`,
  ];
  return { alignmentOk, findings, narrativeLines };
}

export function horizonSliceAlignmentOk(report: HorizonSliceAlignmentReport): boolean {
  return report.alignmentOk;
}
