import type { ExplainabilityIntegrityReport } from './memory-explainability-integrity.ts';
import type { TurnPackCompositeAuditReport } from './turn-pack-composite-audit.ts';

export type ExplainabilityConfidenceBand = 'high' | 'medium' | 'low';

export interface ExplainabilityConfidenceReport {
  band: ExplainabilityConfidenceBand;
  score: number;
  narrativeLines: string[];
}

/** Derives player-facing confidence from integrity + composite turn audits. */
export function computeExplainabilityConfidence(params: {
  integrity: ExplainabilityIntegrityReport;
  composite?: TurnPackCompositeAuditReport | null;
}): ExplainabilityConfidenceReport {
  let score = 100;
  if (!params.integrity.boundsOk) score -= 35;
  if (!params.integrity.retentionOk) score -= 15;
  if (!params.integrity.stalenessOk) score -= 10;
  params.integrity.findings.filter(f => f.severity === 'warn').forEach(() => {
    score -= 3;
  });
  if (params.composite) {
    if (!params.composite.sliceOk) score -= 20;
    if (!params.composite.giRedactionOk) score -= 25;
    if (!params.composite.driftOk) score -= 8;
  }
  score = Math.max(0, Math.min(100, score));
  let band: ExplainabilityConfidenceBand = 'high';
  if (score < 55) band = 'low';
  else if (score < 80) band = 'medium';
  const narrativeLines = [
    `Explainability confidence: ${band} (${score}/100) — integrity bounds ${params.integrity.boundsOk ? 'ok' : 'fail'}.`,
  ];
  if (params.composite && !params.composite.sliceOk) {
    narrativeLines.push('Slice attribution issues reduce confidence.');
  }
  return { band, score, narrativeLines };
}

export function explainabilityConfidenceAtLeast(
  report: ExplainabilityConfidenceReport,
  minBand: ExplainabilityConfidenceBand,
): boolean {
  const order: ExplainabilityConfidenceBand[] = ['low', 'medium', 'high'];
  return order.indexOf(report.band) >= order.indexOf(minBand);
}
