import { buildDebtPortfolioGovernanceReport } from '../debt-portfolio-governance/compute';
import { buildFiscalStressScenariosReport } from '../fiscal-stress-scenarios/compute';
import { buildMediumTermFiscalOutlook } from '../medium-term-outlook/compute';
import { buildSovereignCreditOutlookReport } from '../sovereign-credit-outlook/compute';
import { buildSovereignCreditOutlookCoherenceReport } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 9,
    revenueCapacity: partial.revenueCapacity ?? 68,
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

export function runSovereignCreditOutlookCoherenceSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v = snap({});
  const debtGov = buildDebtPortfolioGovernanceReport(9, v);
  const fiscalStress = buildFiscalStressScenariosReport(9, v);
  const sovereignCredit = buildSovereignCreditOutlookReport(9, v, debtGov, {
    stressWorstDelta: fiscalStress.worstHeadroomDelta
  });
  const outlook = buildMediumTermFiscalOutlook(v, 3);
  const healthy = buildSovereignCreditOutlookCoherenceReport(9, v, sovereignCredit, outlook, debtGov);

  record('SCOC-T01', 'Three sovereign credit outlook checks', healthy.checks.length === 3, 'ok');
  record(
    'SCOC-T02',
    'Within sovereign credit outlook band',
    healthy.withinSovereignCreditOutlookBand,
    `gap=${healthy.aggregateCoherenceGapPoints}`
  );
  record(
    'SCOC-T03',
    'Aligned with debt governance',
    healthy.alignedWithDebtGovernance,
    healthy.narrative
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
