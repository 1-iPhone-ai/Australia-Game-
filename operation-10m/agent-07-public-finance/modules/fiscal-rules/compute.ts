import type { FiscalRuleDefinition, FiscalRulesFrameworkReport, FiscalRulesInputs } from './types';
import { FISCAL_RULES_SCHEMA } from './types';

export const FISCAL_RULES_CATALOG: FiscalRuleDefinition[] = [
  {
    id: 'structural_balance_floor',
    label: 'Structural balance floor',
    description: 'Fiscal headroom should not remain deeply negative for sustained periods.',
    warnOnly: true,
    threshold: -6
  },
  {
    id: 'spending_growth_anchor',
    label: 'Spending growth anchor',
    description: 'Forward spending growth should not exceed revenue capacity growth plus 1pt.',
    warnOnly: true,
    threshold: 2.5
  },
  {
    id: 'debt_service_ceiling',
    label: 'Debt service ceiling',
    description: 'Soft guard on normalized debt service load.',
    warnOnly: true,
    threshold: 18
  },
  {
    id: 'contingency_reserve_min',
    label: 'Contingency reserve minimum',
    description: 'Contingency envelope should retain minimum flex for shocks.',
    warnOnly: true,
    threshold: 3
  },
  {
    id: 'tax_to_capacity_cap',
    label: 'Tax-to-capacity cap',
    description: 'Effective revenue pressure should not imply capacity above 92 without review.',
    warnOnly: true,
    threshold: 92
  }
];

export function assessFiscalRulesFramework(inputs: FiscalRulesInputs): FiscalRulesFrameworkReport {
  const { v1012, envelopeContingencyPoints, forwardSpendingGrowth } = inputs;
  const assessments = FISCAL_RULES_CATALOG.map(rule => {
    let observed = 0;
    let compliant = true;
    let detail = '';

    switch (rule.id) {
      case 'structural_balance_floor':
        observed = v1012.fiscalHeadroom;
        compliant = observed >= rule.threshold;
        detail = `Headroom ${observed} vs floor ${rule.threshold}.`;
        break;
      case 'spending_growth_anchor':
        observed = forwardSpendingGrowth;
        compliant = observed <= rule.threshold;
        detail = `Forward spending growth ${observed} vs anchor ${rule.threshold}.`;
        break;
      case 'debt_service_ceiling':
        observed = v1012.debtServiceLoad;
        compliant = !v1012.debtEnabled || observed <= rule.threshold;
        detail = `Debt service ${observed} vs ceiling ${rule.threshold}.`;
        break;
      case 'contingency_reserve_min':
        observed = envelopeContingencyPoints;
        compliant = observed >= rule.threshold;
        detail = `Contingency flex ${observed} vs minimum ${rule.threshold}.`;
        break;
      case 'tax_to_capacity_cap':
        observed = v1012.revenueCapacity;
        compliant = observed <= rule.threshold || v1012.revenuePolicy === 'revenue_focused';
        detail = `Revenue capacity ${observed} vs cap ${rule.threshold}.`;
        break;
    }

    const severity: FiscalRulesFrameworkReport['assessments'][0]['severity'] = compliant
      ? 'info'
      : rule.id === 'debt_service_ceiling' || rule.id === 'structural_balance_floor'
      ? 'major'
      : 'caution';

    return {
      ruleId: rule.id,
      label: rule.label,
      compliant,
      severity,
      observed,
      threshold: rule.threshold,
      detail
    };
  });

  const breachCount = assessments.filter(a => !a.compliant).length;
  const allCompliant = breachCount === 0;
  const narrative = allCompliant
    ? 'Fiscal rules framework: all soft guards satisfied (warn-only).'
    : `${breachCount} rule(s) flagged — sequencing and transparency recommended, not automatic blocking.`;

  return {
    schemaVersion: FISCAL_RULES_SCHEMA,
    turn: inputs.turn,
    assessments,
    allCompliant,
    breachCount,
    narrative
  };
}
