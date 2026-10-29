import type { GTELDiplomacyState, GTELPersisted, TradeComplianceRecord } from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';
import { gtelRecentViolations } from './diplomacy-linkage.ts';
import { countOpenTradeDisputes } from './trade-disputes.ts';

export const TRADE_COMPLIANCE_RULES = [
  { id: 'rule_honor_agreements', label: 'Honor ratified trade agreements', weight: 0.25 },
  { id: 'rule_avoid_embargo_breach', label: 'Avoid embargo and breach events', weight: 0.3 },
  { id: 'rule_dispute_engagement', label: 'Engage dispute mediation in good faith', weight: 0.2 },
  { id: 'rule_transparent_tariffs', label: 'Keep tariff/sanction changes documented', weight: 0.25 },
] as const;

export function createEmptyTradeComplianceRecord(turn = 1): TradeComplianceRecord {
  return {
    score: 0.72,
    band: 'adequate',
    lastReviewTurn: turn,
    violationsWindow: 0,
    openDisputes: 0,
    findings: ['Baseline compliance posture.'],
  };
}

export function sanitizeTradeComplianceRecord(raw: unknown, turn = 1): TradeComplianceRecord {
  const base = createEmptyTradeComplianceRecord(turn);
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;
  const score = gtelClamp(gtelNum(r.score, base.score), 0.1, 0.99);
  const band: TradeComplianceRecord['band'] =
    score >= 0.8 ? 'strong' : score >= 0.6 ? 'adequate' : score >= 0.4 ? 'weak' : 'critical';
  return {
    score: Math.round(score * 1000) / 1000,
    band,
    lastReviewTurn: Math.max(1, Math.floor(gtelNum(r.lastReviewTurn, turn))),
    violationsWindow: Math.max(0, Math.floor(gtelNum(r.violationsWindow, 0))),
    openDisputes: Math.max(0, Math.floor(gtelNum(r.openDisputes, 0))),
    findings: (Array.isArray(r.findings) ? r.findings : base.findings).map(String).slice(0, 8),
  };
}

export function advanceTradeComplianceRecord(
  persisted: GTELPersisted,
  diplomacy: GTELDiplomacyState | null,
  turn: number,
): GTELPersisted {
  const prev = sanitizeTradeComplianceRecord(persisted.tradeCompliance, turn);
  const violations = gtelRecentViolations(diplomacy, turn);
  const openDisputes = countOpenTradeDisputes(persisted);
  const ratified = persisted.agreements.filter(a => a.status === 'ratified').length;
  let score = prev.score;
  const findings: string[] = [];
  if (violations === 0) {
    score += 0.015;
    findings.push('No diplomatic violations in the review window.');
  } else {
    score -= 0.035 * violations;
    findings.push(`${violations} violation signal(s) recorded.`);
  }
  if (openDisputes === 0) {
    score += 0.01;
  } else {
    score -= 0.02 * openDisputes;
    findings.push(`${openDisputes} open trade dispute(s) require engagement.`);
  }
  if (ratified >= 2) {
    score += 0.02;
    findings.push('Multiple ratified agreements support compliance.');
  }
  const comprehensive = Object.values(persisted.partnerSanctions || {}).filter(s => s?.tier === 'comprehensive').length;
  if (comprehensive > 0) {
    score -= 0.04 * comprehensive;
    findings.push('Comprehensive partner sanctions weigh on compliance score.');
  }
  score = gtelClamp(score, 0.12, 0.98);
  const band: TradeComplianceRecord['band'] =
    score >= 0.8 ? 'strong' : score >= 0.6 ? 'adequate' : score >= 0.4 ? 'weak' : 'critical';
  return {
    ...persisted,
    tradeCompliance: {
      score: Math.round(score * 1000) / 1000,
      band,
      lastReviewTurn: turn,
      violationsWindow: violations,
      openDisputes,
      findings: findings.slice(0, 6),
    },
  };
}

/** Weak compliance accelerates external market friction. */
export function deriveCompliancePartnerPenalty(record: TradeComplianceRecord | null | undefined): number {
  if (!record) return 0;
  if (record.band === 'critical') return -0.035;
  if (record.band === 'weak') return -0.018;
  return 0;
}

export function complianceReviewNotes(record: TradeComplianceRecord | null | undefined): string[] {
  if (!record) return [];
  return [`Compliance ${record.band} (${Math.round(record.score * 100)}%).`, ...record.findings.slice(0, 2)];
}
