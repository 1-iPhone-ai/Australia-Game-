import { assessFiscalRulesFramework } from '../fiscal-rules/compute';
import { buildEfficiencyDividendRegisterReport } from '../efficiency-dividend-register/compute';
import { buildPortfolioOutturnReport } from '../portfolio-outturn/compute';
import { buildSpendingOffsetsReport } from '../spending-offsets/compute';
import { buildPortfolioReprioritisationLedgerReport } from '../portfolio-reprioritisation-ledger/compute';
import { buildPortfolioOutturnReprioritisationBridgeReport } from './compute';
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

export function runPortfolioOutturnReprioritisationBridgeSelfTests(): {
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
  const repriorLedger = buildPortfolioReprioritisationLedgerReport(9, v, offsets, outturn, efficiency);
  const healthy = buildPortfolioOutturnReprioritisationBridgeReport(9, v, outturn, repriorLedger);

  record('PORB-T01', 'Three outturn reprior checks', healthy.checks.length === 3, 'ok');
  record(
    'PORB-T02',
    'Within outturn reprior band',
    healthy.withinOutturnRepriorBand,
    `gap=${healthy.bridgeGapPoints}`
  );
  record(
    'PORB-T03',
    'Aligned with reprior ledger',
    healthy.alignedWithRepriorLedger,
    healthy.narrative
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
