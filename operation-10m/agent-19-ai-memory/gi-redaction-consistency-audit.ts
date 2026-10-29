import { buildTurnPackGiClaims } from './turn-pack-gi-bridge.ts';
import type { AiMemoryInspectionView, MemoryInfluenceAuditFinding } from './types.ts';
import type { TurnExplainabilityPack } from './turn-explainability-pack.ts';

const REDACTED_LEAK_PATTERNS = [/aggressionPreference/i, /expansionPreference/i, /economicPreference/i, /strategic profile/i];

/** Ensures Ask-the-Game claims do not expose rival-only inspection fields when view is redacted. */
export function auditGiRedactionConsistency(params: {
  claims: Array<{ text: string }>;
  inspection: AiMemoryInspectionView | null | undefined;
}): MemoryInfluenceAuditFinding[] {
  if (!params.inspection?.isRedacted) return [];
  const findings: MemoryInfluenceAuditFinding[] = [];
  params.claims.forEach((c, i) => {
    if (REDACTED_LEAK_PATTERNS.some(p => p.test(c.text))) {
      findings.push({
        code: 'gi_redaction_leak',
        severity: 'fail',
        message: `Claim ${i} may expose redacted rival data.`,
      });
    }
  });
  return findings;
}

export function auditTurnPackGiRedaction(
  pack: TurnExplainabilityPack,
  inspection: AiMemoryInspectionView,
): MemoryInfluenceAuditFinding[] {
  const claims = buildTurnPackGiClaims({
    pack,
    horizon: pack.horizonAfter,
    inspection,
  });
  return auditGiRedactionConsistency({ claims, inspection });
}

export function giRedactionConsistencyOk(findings: MemoryInfluenceAuditFinding[]): boolean {
  return !findings.some(f => f.severity === 'fail');
}
