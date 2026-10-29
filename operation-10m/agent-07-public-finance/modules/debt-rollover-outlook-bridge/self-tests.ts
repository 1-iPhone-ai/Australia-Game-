import { buildCashManagementReport } from '../cash-management/compute';
import { buildDebtFiscalCouplingRegisterReport } from '../debt-fiscal-coupling-register/compute';
import { buildDebtPortfolioGovernanceReport } from '../debt-portfolio-governance/compute';
import { buildDebtRolloverCoverageBridgeReport } from '../debt-rollover-coverage-bridge/compute';
import { buildDebtServiceCoverageReport } from '../debt-service-coverage/compute';
import { computeDebtOutcomeTrajectory } from '../fiscal-outcomes/debt-outcomes';
import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';
import { buildNationalRevenueLedger } from '../revenue-ledger/compute';
import { buildExpenditureGrowthBenchmarkReport } from '../expenditure-growth-benchmark/compute';
import { buildFiscalBufferCoherenceReport } from '../fiscal-buffer-coherence/compute';
import { buildForwardEstimatesIntegrityReport } from '../forward-estimates-integrity/compute';
import { assessFiscalRulesFramework } from '../fiscal-rules/compute';
import { buildContingencyDrawdownRegisterReport } from '../contingency-drawdown/compute';
import { buildMultiYearExpenditureFramework } from '../multi-year-framework/compute';
import { buildMediumTermFiscalOutlook } from '../medium-term-outlook/compute';
import { buildRevenueForwardReconciliationReport } from '../revenue-forward-reconciliation/compute';
import { scheduleRecurringCommitments } from '../recurring-commitments/compute';
import { buildStatutoryBalancesReport } from '../statutory-balances/compute';
import { buildSupplementaryEstimatesReport } from '../supplementary-estimates/compute';
import { buildSovereignCreditOutlookReport } from '../sovereign-credit-outlook/compute';
import { buildFiscalStressScenariosReport } from '../fiscal-stress-scenarios/compute';
import { defaultMaturityLadder, resolveDebtRollover } from '../debt-rollover/compute';
import { executeIssuanceCalendar } from '../sovereign-issuance/compute';
import { buildSovereignIssuanceCouplingBridgeReport } from '../sovereign-issuance-coupling-bridge/compute';
import { buildDebtRolloverOutlookBridgeReport } from './compute';
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

export function runDebtRolloverOutlookBridgeSelfTests(): {
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
  const persisted = createInitialFiscalOutcomesPersisted(9);
  const { state } = computeFiscalOutcomesLayer({ turn: 9, v1012: v }, persisted);
  const ledger = buildNationalRevenueLedger({ turn: 9, v1012: v, taxInstruments: state.taxInstruments });
  const debtRollover = resolveDebtRollover({
    turn: 9,
    v1012: v,
    tranches: defaultMaturityLadder(9),
    computeTrajectory: computeDebtOutcomeTrajectory
  });
  const myefo = buildMultiYearExpenditureFramework(v, 3);
  const recurring = scheduleRecurringCommitments(9, v, state.budget);
  const outlook = buildMediumTermFiscalOutlook(v, 3);
  const supplementary = buildSupplementaryEstimatesReport(9, v);
  const forwardIntegrity = buildForwardEstimatesIntegrityReport(9, v, myefo, supplementary, outlook);
  const growth = buildExpenditureGrowthBenchmarkReport(9, v, myefo, recurring, forwardIntegrity);
  const revenueForward = buildRevenueForwardReconciliationReport(9, v, ledger, myefo, growth);
  const statutory = buildStatutoryBalancesReport(9, v);
  const cash = buildCashManagementReport(9, v);
  const contingencyFlex = state.budget.lines.find(l => l.category === 'contingency')?.flexPoints ?? 0;
  const fiscalRules = assessFiscalRulesFramework({
    turn: 9,
    v1012: v,
    envelopeContingencyPoints: contingencyFlex,
    forwardSpendingGrowth: 2
  });
  const contingency = buildContingencyDrawdownRegisterReport(9, v, contingencyFlex, fiscalRules);
  const fiscalBuffer = buildFiscalBufferCoherenceReport(9, v, statutory, cash, contingency, revenueForward);
  const debtGov = buildDebtPortfolioGovernanceReport(9, v, { liquidityStress: debtRollover.liquidityStress });
  const fiscalStress = buildFiscalStressScenariosReport(9, v);
  const sovereignCredit = buildSovereignCreditOutlookReport(9, v, debtGov, {
    stressWorstDelta: fiscalStress.worstHeadroomDelta
  });
  const debtService = buildDebtServiceCoverageReport(9, v, ledger, cash);
  const debtCoupling = buildDebtFiscalCouplingRegisterReport(9, v, debtService, sovereignCredit, fiscalBuffer);
  const issuance = executeIssuanceCalendar(9, v);
  const issuanceCoupling = buildSovereignIssuanceCouplingBridgeReport(9, v, issuance, debtCoupling, debtService);
  const rolloverCoverage = buildDebtRolloverCoverageBridgeReport(9, v, debtRollover, debtService, issuanceCoupling);
  const healthy = buildDebtRolloverOutlookBridgeReport(9, v, rolloverCoverage, debtService, outlook);

  record('DROB-T01', 'Three debt rollover outlook checks', healthy.checks.length === 3, 'ok');
  record(
    'DROB-T02',
    'Within debt rollover outlook band',
    healthy.withinDebtRolloverOutlookBand,
    `gap=${healthy.bridgeGapPoints}`
  );
  record(
    'DROB-T03',
    'Aligned with rollover coverage',
    healthy.alignedWithRolloverCoverage,
    healthy.narrative
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
