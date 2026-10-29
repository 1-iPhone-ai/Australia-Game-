import type { ExplainabilityIntegrityReport } from './memory-explainability-integrity.ts';

export const AGENT19_RECOVERY_HINT_CAP = 6;

/** Player-facing hints when integrity audits fail — keeps explainability honest without vetoing play. */
export function buildIntegrityRecoveryHints(report: ExplainabilityIntegrityReport): string[] {
  const hints: string[] = [];
  if (!report.boundsOk) {
    hints.push('Trim committed events or opponent beliefs to documented caps before showing detailed explainability.');
  }
  if (!report.retentionOk) {
    hints.push('Resolve duplicate stableKey events — retention flags may confuse timeline narratives.');
  }
  if (!report.stalenessOk) {
    hints.push('Refresh relationship snapshots or disclose staleness in Ask-the-Game claims.');
  }
  report.findings
    .filter(f => f.severity === 'fail')
    .slice(0, 3)
    .forEach(f => hints.push(`Address ${f.code}: ${f.message}`));
  if (!hints.length) {
    hints.push('Integrity checks passed — turn packs and GI claims can use full detail.');
  }
  return hints.slice(0, AGENT19_RECOVERY_HINT_CAP);
}
