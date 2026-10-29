import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { FiscalRiskEntry, FiscalRiskRegisterReport } from './types';
import { FISCAL_RISK_REGISTER_SCHEMA } from './types';

export const BASE_FISCAL_RISKS: Omit<FiscalRiskEntry, 'id'>[] = [
  {
    category: 'revenue_volatility',
    label: 'Commodity-linked revenue volatility',
    likelihood: 0.22,
    impactPoints: 12,
    mitigationReady: true,
    warnOnly: true
  },
  {
    category: 'debt_rollover',
    label: 'Refinancing cluster concentration',
    likelihood: 0.18,
    impactPoints: 16,
    mitigationReady: false,
    warnOnly: true
  },
  {
    category: 'demand_pressure',
    label: 'Health and social demand overshoot',
    likelihood: 0.28,
    impactPoints: 10,
    mitigationReady: true,
    warnOnly: true
  },
  {
    category: 'commodity_exposure',
    label: 'Resource rent cyclicality',
    likelihood: 0.15,
    impactPoints: 14,
    mitigationReady: false,
    warnOnly: true
  },
  {
    category: 'policy_reversal',
    label: 'Tax instrument rollback risk',
    likelihood: 0.12,
    impactPoints: 8,
    mitigationReady: true,
    warnOnly: true
  },
  {
    category: 'intergovernmental_clawback',
    label: 'Grant clawback after performance miss',
    likelihood: 0.1,
    impactPoints: 6,
    mitigationReady: true,
    warnOnly: false
  }
];

export function catalogFiscalRisks(turn: number): FiscalRiskEntry[] {
  return BASE_FISCAL_RISKS.map((row, idx) => ({
    id: `fr_${turn}_${idx}_${row.category}`,
    ...row
  }));
}

function stressLikelihoodScale(v1012: V1012FiscalSnapshot): number {
  if (v1012.pressure === 'critical') return 1.35;
  if (v1012.pressure === 'strained') return 1.18;
  if (v1012.pressure === 'tight') return 1.06;
  return 1;
}

export function buildFiscalRiskRegister(
  turn: number,
  v1012: V1012FiscalSnapshot,
  entries: FiscalRiskEntry[] = catalogFiscalRisks(turn)
): FiscalRiskRegisterReport {
  const scale = stressLikelihoodScale(v1012);
  const debtAdj = v1012.debtServiceLoad > 14 ? 1.12 : 1;
  const headroomAdj = v1012.fiscalHeadroom < 0 ? 1.15 : 1;

  const scored = entries.map(e => ({
    ...e,
    score: e.likelihood * scale * debtAdj * headroomAdj * e.impactPoints
  }));

  const aggregateHeat = Math.round(scored.reduce((s, e) => s + e.score, 0) * 10) / 10;
  const highImpactCount = scored.filter(e => e.impactPoints >= 12).length;
  const unmitigatedCount = scored.filter(e => !e.mitigationReady).length;

  const appetiteCeiling = 28 + Math.max(0, v1012.fiscalHeadroom * 0.8);
  const withinRiskAppetite = aggregateHeat <= appetiteCeiling;

  let tier: FiscalRiskRegisterReport['tier'] = 'low';
  if (aggregateHeat > appetiteCeiling * 1.25 || v1012.pressure === 'critical') tier = 'severe';
  else if (
    aggregateHeat > appetiteCeiling * 0.85 ||
    unmitigatedCount >= 3 ||
    (v1012.pressure === 'strained' && aggregateHeat >= 16)
  ) {
    tier = 'elevated';
  }

  const warnings: string[] = [];
  if (!withinRiskAppetite) {
    warnings.push(`Aggregate heat ${aggregateHeat} exceeds appetite ${appetiteCeiling.toFixed(1)}.`);
  }
  if (unmitigatedCount >= 2 && v1012.fiscalHeadroom < 2) {
    warnings.push('Multiple unmitigated risks with limited fiscal headroom.');
  }

  const narrative = withinRiskAppetite
    ? `Fiscal risk register: heat ${aggregateHeat} within appetite (${tier} tier).`
    : `Fiscal risk register elevated (${tier}): ${unmitigatedCount} unmitigated, ${highImpactCount} high-impact entries.`;

  return {
    schemaVersion: FISCAL_RISK_REGISTER_SCHEMA,
    turn,
    entries,
    aggregateHeat,
    highImpactCount,
    unmitigatedCount,
    withinRiskAppetite,
    tier,
    narrative,
    warnings
  };
}
