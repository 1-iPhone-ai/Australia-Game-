import type { TurnPackCompositeAuditReport } from './turn-pack-composite-audit.ts';

export const AGENT19_COMPOSITE_RECOVERY_HINT_CAP = 5;

/** Maps composite turn-pack audit failures to player-facing recovery hints. */
export function buildCompositeRecoveryHints(report: TurnPackCompositeAuditReport): string[] {
  const hints: string[] = [];
  if (!report.sliceOk) {
    hints.push('Reconcile memoryInfluence with slice deltas before publishing turn explainability.');
  }
  if (!report.giRedactionOk) {
    hints.push('Align Ask-the-Game claims with redacted inspection view for this turn.');
  }
  if (!report.driftOk) {
    hints.push('Review influence spike vs prior turn — disclose drift in session rollup.');
  }
  report.findings
    .filter(f => f.severity === 'fail')
    .slice(0, 2)
    .forEach(f => hints.push(`Fix ${f.code}: ${f.message}`));
  if (!hints.length) {
    hints.push('Composite audit passed — turn pack ready for session rollup.');
  }
  return hints.slice(0, AGENT19_COMPOSITE_RECOVERY_HINT_CAP);
}

export function compositeRecoveryNeeded(report: TurnPackCompositeAuditReport): boolean {
  return !report.sliceOk || !report.giRedactionOk || !report.driftOk;
}
