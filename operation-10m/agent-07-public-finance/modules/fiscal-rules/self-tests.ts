import { assessFiscalRulesFramework, FISCAL_RULES_CATALOG } from './compute';
import { buildBudgetEnvelope } from '../fiscal-outcomes/budget-envelopes';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 9,
    revenueCapacity: partial.revenueCapacity ?? 64,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 5,
    debtLevel: partial.debtLevel ?? 20,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runFiscalRulesSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const env = buildBudgetEnvelope(snap({}));
  const contingency = env.lines.find(l => l.category === 'contingency')?.flexPoints ?? 0;
  const ok = assessFiscalRulesFramework({
    turn: 9,
    v1012: snap({}),
    envelopeContingencyPoints: contingency,
    forwardSpendingGrowth: 1.8
  });
  record('FRU01', 'Healthy baseline all rules compliant', ok.allCompliant, `breaches=${ok.breachCount}`);
  record('FRU02', 'Five rules in catalog', FISCAL_RULES_CATALOG.length === 5, `n=${FISCAL_RULES_CATALOG.length}`);

  const breach = assessFiscalRulesFramework({
    turn: 9,
    v1012: snap({ fiscalHeadroom: -10, debtServiceLoad: 22 }),
    envelopeContingencyPoints: 1,
    forwardSpendingGrowth: 4
  });
  record('FRU03', 'Stress scenario triggers multiple breaches', breach.breachCount >= 2, `breaches=${breach.breachCount}`);

  const debtOff = assessFiscalRulesFramework({
    turn: 9,
    v1012: snap({ debtEnabled: false, debtServiceLoad: 25 }),
    envelopeContingencyPoints: contingency,
    forwardSpendingGrowth: 1
  });
  const debtRule = debtOff.assessments.find(a => a.ruleId === 'debt_service_ceiling');
  record('FRU04', 'Debt service rule waived when debt disabled', debtRule?.compliant === true, String(debtRule?.compliant));

  record('FRU05', 'Narrative present on breach', breach.narrative.includes('flagged'), 'ok');

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
