import { buildDebtPortfolioGovernanceReport } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 10,
    revenueCapacity: partial.revenueCapacity ?? 72,
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

export function runDebtPortfolioGovernanceSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildDebtPortfolioGovernanceReport(10, snap({}));
  record('DPG01', 'Five debt portfolio tranches', healthy.tranches.length === 5, 'ok');
  record('DPG02', 'Healthy within governance targets', healthy.withinGovernanceTargets, healthy.narrative);
  record(
    'DPG03',
    'Weighted duration within band',
    healthy.weightedAverageDurationYears >= 4 && healthy.weightedAverageDurationYears <= 10,
    `wad=${healthy.weightedAverageDurationYears}`
  );

  const stressed = buildDebtPortfolioGovernanceReport(10, snap({ debtServiceLoad: 18, debtLevel: 55 }), {
    liquidityStress: true
  });
  record(
    'DPG04',
    'Liquidity stress keeps rollover alignment or critical override path',
    stressed.rolloverStressAligned || stressed.withinGovernanceTargets,
    `aligned=${stressed.rolloverStressAligned}`
  );

  const noDebt = buildDebtPortfolioGovernanceReport(10, snap({ debtEnabled: false, debtLevel: 0 }));
  record('DPG05', 'Debt disabled still produces tranche ledger', noDebt.tranches.length === 5, 'ok');

  record(
    'DPG06',
    'Max tranche share bounded under healthy',
    healthy.maxTrancheShare <= 0.45,
    `max=${healthy.maxTrancheShare}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
