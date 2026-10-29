import { reviewProgramPerformance, PROGRAM_PERFORMANCE_TARGETS } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 11,
    revenueCapacity: partial.revenueCapacity ?? 62,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 4,
    debtLevel: partial.debtLevel ?? 16,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 9,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runProgramPerformanceSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const review = reviewProgramPerformance(11, snap({}));
  record('PP01', 'Scores for all tracked programs', review.scores.length === PROGRAM_PERFORMANCE_TARGETS.length, `n=${review.scores.length}`);
  record('PP02', 'Composite scores bounded 0-100', review.scores.every(s => s.compositeScore >= 0 && s.compositeScore <= 100), 'ok');

  const critical = reviewProgramPerformance(11, snap({ pressure: 'critical', fiscalHeadroom: -8 }));
  record('PP03', 'Critical pressure increases at-risk count', critical.programsAtRisk >= review.programsAtRisk, `crit=${critical.programsAtRisk}, base=${review.programsAtRisk}`);

  record('PP04', 'Failing programs negative feedback', review.scores.every(s => s.band !== 'failing' || s.fiscalFeedbackPoints < 0), 'ok');

  record('PP05', 'Rebalance text when aggregate drag', critical.rebalanceRecommendations.length >= 1, `recs=${critical.rebalanceRecommendations.length}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
