import { buildCostRecoveryStatement } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 13,
    revenueCapacity: partial.revenueCapacity ?? 65,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 8,
    debtLevel: partial.debtLevel ?? 26,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 3,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runCostRecoveryPricingSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildCostRecoveryStatement(13, snap({}));
  record('CR01', 'Five user-charge lines', healthy.lines.length === 5, 'ok');
  record('CR02', 'Weighted ratio in valid range', healthy.weightedRecoveryRatio > 0 && healthy.weightedRecoveryRatio <= 1, `w=${healthy.weightedRecoveryRatio}`);
  record('CR03', 'Healthy meets portfolio target', healthy.withinPortfolioTarget, healthy.narrative);

  const revenueFocus = buildCostRecoveryStatement(13, snap({ revenuePolicy: 'revenue_focused', fiscalHeadroom: 10 }));
  record('CR04', 'Revenue-focused policy lifts recovery', revenueFocus.weightedRecoveryRatio >= healthy.weightedRecoveryRatio, `${revenueFocus.weightedRecoveryRatio} vs ${healthy.weightedRecoveryRatio}`);

  const critical = buildCostRecoveryStatement(13, snap({ pressure: 'critical', fiscalHeadroom: -15 }));
  record('CR05', 'Critical pressure overrides portfolio target', critical.withinPortfolioTarget, 'ok');

  record('CR06', 'Aggregate recovered <= full cost', healthy.aggregateRecovered <= healthy.aggregateFullCost, `${healthy.aggregateRecovered}/${healthy.aggregateFullCost}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
