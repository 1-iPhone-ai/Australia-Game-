import { buildSovereignCreditOutlookReport } from './compute';
import { buildDebtPortfolioGovernanceReport } from '../debt-portfolio-governance/compute';
import { buildFiscalStressScenariosReport } from '../fiscal-stress-scenarios/compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 13,
    revenueCapacity: partial.revenueCapacity ?? 70,
    fiscalHeadroom: partial.fiscalHeadroom ?? 5,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 7,
    debtLevel: partial.debtLevel ?? 28,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 8,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runSovereignCreditOutlookSelfTests(): {
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
  const gov = buildDebtPortfolioGovernanceReport(13, v);
  const stress = buildFiscalStressScenariosReport(13, v);
  const healthy = buildSovereignCreditOutlookReport(13, v, gov, { stressWorstDelta: stress.worstHeadroomDelta });

  record('SCO01', 'Healthy within outlook band', healthy.withinOutlookBand, healthy.narrative);
  record('SCO02', 'Stable or watch band under healthy', healthy.ratingBand === 'stable' || healthy.ratingBand === 'negative_watch', healthy.ratingBand);
  record('SCO03', 'Coherent with debt governance', healthy.coherentWithDebtGovernance, 'ok');

  const levered = buildSovereignCreditOutlookReport(
    13,
    snap({ debtLevel: 72, debtServiceLoad: 20, fiscalHeadroom: -6 }),
    buildDebtPortfolioGovernanceReport(13, snap({ debtLevel: 72, debtServiceLoad: 20 }), { liquidityStress: true }),
    { stressWorstDelta: -9 }
  );
  record(
    'SCO04',
    'Levered snapshot raises implied spread',
    levered.impliedSpreadBps > healthy.impliedSpreadBps,
    `${levered.impliedSpreadBps} vs ${healthy.impliedSpreadBps}`
  );

  const noDebt = buildSovereignCreditOutlookReport(13, snap({ debtEnabled: false }), gov, {});
  record('SCO05', 'Debt disabled passes outlook guard', noDebt.withinOutlookBand, 'ok');

  record('SCO06', 'Implied spread positive', healthy.impliedSpreadBps > 0, `spread=${healthy.impliedSpreadBps}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
