import { assessFiscalRulesFramework } from '../fiscal-rules/compute';
import { buildPortfolioOutturnReport } from '../portfolio-outturn/compute';
import { buildSpendingOffsetsReport } from '../spending-offsets/compute';
import { buildEfficiencyDividendRegisterReport } from '../efficiency-dividend-register/compute';
import { buildPortfolioReprioritisationLedgerReport } from './compute';
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

export function runPortfolioReprioritisationLedgerSelfTests(): {
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
  const offsets = buildSpendingOffsetsReport(9, v);
  const outturn = buildPortfolioOutturnReport(9, v);
  const rules = assessFiscalRulesFramework({
    turn: 9,
    v1012: v,
    envelopeContingencyPoints: 2,
    forwardSpendingGrowth: 2
  });
  const efficiency = buildEfficiencyDividendRegisterReport(9, v, offsets, rules);
  const healthy = buildPortfolioReprioritisationLedgerReport(9, v, offsets, outturn, efficiency);

  record('PRL01', 'Ledger produces lines', healthy.lines.length >= 1, 'ok');
  record(
    'PRL02',
    'Within portfolio envelope',
    healthy.withinPortfolioEnvelope,
    `realized=${healthy.aggregateRealizedPoints}`
  );
  record(
    'PRL03',
    'Aligned with efficiency dividend',
    healthy.alignedWithEfficiencyDividend,
    `planned=${healthy.aggregatePlannedPoints}`
  );

  const strained = buildPortfolioReprioritisationLedgerReport(
    9,
    snap({ pressure: 'strained', fiscalHeadroom: -2 }),
    offsets,
    outturn,
    efficiency
  );
  record('PRL04', 'Strained still produces ledger', strained.lines.length >= 1, 'ok');

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
