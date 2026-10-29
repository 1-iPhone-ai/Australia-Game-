import type {
  BudgetEnvelopeCategory,
  BudgetEnvelopeLine,
  NationalBudgetEnvelope,
  V1012FiscalSnapshot
} from './types';

const CATEGORY_LABELS: Record<BudgetEnvelopeCategory, string> = {
  core_services: 'Core Services & Administration',
  infrastructure_capital: 'Infrastructure Capital',
  maintenance_backlog: 'Maintenance & Network Upkeep',
  research_innovation: 'Research & Innovation',
  regional_development: 'Regional Development',
  resilience_recovery: 'Resilience & Recovery',
  debt_service_reserve: 'Debt Service & Reserves',
  contingency: 'Contingency & Flex'
};

/** Default share weights (sum ≈ 1) — tuned for balanced starting envelope. */
const DEFAULT_SHARES: Record<BudgetEnvelopeCategory, number> = {
  core_services: 0.22,
  infrastructure_capital: 0.18,
  maintenance_backlog: 0.14,
  research_innovation: 0.08,
  regional_development: 0.1,
  resilience_recovery: 0.08,
  debt_service_reserve: 0.12,
  contingency: 0.08
};

export function buildBudgetEnvelope(
  v1012: V1012FiscalSnapshot,
  overrides: Partial<Record<BudgetEnvelopeCategory, number>> = {}
): NationalBudgetEnvelope {
  const totalCapacityPoints = Math.max(
    5,
    Math.round(v1012.revenueCapacity + Math.max(0, v1012.fiscalHeadroom * 0.35))
  );
  const fiscalYearLabel = `FY${v1012.turn}-${v1012.turn + 1}`;

  const lines: BudgetEnvelopeLine[] = (Object.keys(DEFAULT_SHARES) as BudgetEnvelopeCategory[]).map(
    cat => {
      const share = DEFAULT_SHARES[cat];
      const override = overrides[cat];
      const allocatedPoints =
        override !== undefined
          ? Math.round(override)
          : Math.round(totalCapacityPoints * share);
      const pressureBoost =
        v1012.pressure === 'critical' ? 1.15 : v1012.pressure === 'strained' ? 1.08 : 1;
      const committedPoints = Math.round(
        allocatedPoints *
          (cat === 'maintenance_backlog'
            ? 0.55 + v1012.maintenanceLoad / 40
            : cat === 'debt_service_reserve'
            ? 0.4 + v1012.debtServiceLoad / 25
            : 0.35) *
          pressureBoost
      );
      const flexPoints = Math.max(0, allocatedPoints - committedPoints);
      let band: BudgetEnvelopeLine['band'] = 'balanced';
      if (committedPoints > allocatedPoints * 1.12) band = 'critical_over';
      else if (committedPoints > allocatedPoints * 1.02) band = 'over';
      else if (committedPoints < allocatedPoints * 0.55) band = 'under';

      return {
        category: cat,
        allocatedPoints,
        committedPoints,
        flexPoints,
        band,
        linkedCommitmentIds: [],
        explanation: `${CATEGORY_LABELS[cat]}: ${allocatedPoints} pts allocated, ${committedPoints} pts committed (${band}).`
      };
    }
  );

  const allocatedPoints = lines.reduce((s, l) => s + l.allocatedPoints, 0);
  const unallocatedFlex = Math.max(0, totalCapacityPoints - allocatedPoints);
  const overLines = lines.filter(l => l.band === 'over' || l.band === 'critical_over');
  const rebalanceNeeded = overLines.length > 0 || v1012.fiscalHeadroom < 0;
  const rebalanceSummary = rebalanceNeeded
    ? `Rebalance recommended: ${overLines.map(l => CATEGORY_LABELS[l.category]).join(', ')} exceed envelope${
        v1012.fiscalHeadroom < 0 ? '; headroom negative' : ''
      }.`
    : null;

  return {
    fiscalYearLabel,
    totalCapacityPoints,
    allocatedPoints,
    unallocatedFlex,
    lines,
    rebalanceNeeded,
    rebalanceSummary
  };
}

export { CATEGORY_LABELS as BUDGET_ENVELOPE_CATEGORY_LABELS };
