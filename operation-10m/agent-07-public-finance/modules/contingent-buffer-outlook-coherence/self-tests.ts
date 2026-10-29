import { assessContingentLiabilities } from '../contingent-liabilities/compute';
import { buildContingentLiabilityForwardBridgeReport } from '../contingent-liability-forward-bridge/compute';
import { buildContingentLiabilityOutlookCoherenceReport } from '../contingent-liability-outlook-coherence/compute';
import { buildDebtFiscalCouplingRegisterReport } from '../debt-fiscal-coupling-register/compute';
import { buildDebtPortfolioGovernanceReport } from '../debt-portfolio-governance/compute';
import { buildDebtServiceCoverageReport } from '../debt-service-coverage/compute';
import { buildExpenditureGrowthBenchmarkReport } from '../expenditure-growth-benchmark/compute';
import { buildFiscalBufferCoherenceReport } from '../fiscal-buffer-coherence/compute';
import { buildFiscalBufferOutlookCoherenceReport } from '../fiscal-buffer-outlook-coherence/compute';
import { buildFiscalRiskRegister } from '../fiscal-risk-register/compute';
import { buildFiscalRiskOutlookCoherenceReport } from '../fiscal-risk-outlook-coherence/compute';
import { buildFiscalStressResilienceBridgeReport } from '../fiscal-stress-resilience-bridge/compute';
import { buildFiscalStressScenariosReport } from '../fiscal-stress-scenarios/compute';
import { buildForwardEstimatesIntegrityReport } from '../forward-estimates-integrity/compute';
import { assessFiscalRulesFramework } from '../fiscal-rules/compute';
import { buildContingencyDrawdownRegisterReport } from '../contingency-drawdown/compute';
import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';
import { buildMultiYearExpenditureFramework } from '../multi-year-framework/compute';
import { buildMediumTermFiscalOutlook } from '../medium-term-outlook/compute';
import { buildNationalRevenueLedger } from '../revenue-ledger/compute';
import { buildRevenueForwardReconciliationReport } from '../revenue-forward-reconciliation/compute';
import { scheduleRecurringCommitments } from '../recurring-commitments/compute';
import { buildStatutoryBalancesReport } from '../statutory-balances/compute';
import { buildSupplementaryEstimatesReport } from '../supplementary-estimates/compute';
import { buildSovereignCreditOutlookReport } from '../sovereign-credit-outlook/compute';
import { buildCashManagementReport } from '../cash-management/compute';
import { buildContingentBufferOutlookCoherenceReport } from './compute';
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

export function runContingentBufferOutlookCoherenceSelfTests(): {
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
  const debtGov = buildDebtPortfolioGovernanceReport(9, v);
  const fiscalStress = buildFiscalStressScenariosReport(9, v);
  const sovereignCredit = buildSovereignCreditOutlookReport(9, v, debtGov, {
    stressWorstDelta: fiscalStress.worstHeadroomDelta
  });
  const debtService = buildDebtServiceCoverageReport(9, v, ledger, cash);
  const debtCoupling = buildDebtFiscalCouplingRegisterReport(9, v, debtService, sovereignCredit, fiscalBuffer);
  const stressBridge = buildFiscalStressResilienceBridgeReport(9, v, fiscalStress, debtCoupling, fiscalBuffer);
  const contingent = assessContingentLiabilities(9, v);
  const contingentForward = buildContingentLiabilityForwardBridgeReport(
    9,
    v,
    contingent,
    forwardIntegrity,
    stressBridge
  );
  const contingentOutlook = buildContingentLiabilityOutlookCoherenceReport(
    9,
    v,
    contingent,
    contingentForward,
    outlook
  );
  const riskRegister = buildFiscalRiskRegister(9, v);
  const riskOutlook = buildFiscalRiskOutlookCoherenceReport(9, v, riskRegister, outlook, fiscalStress);
  const bufferOutlook = buildFiscalBufferOutlookCoherenceReport(9, v, fiscalBuffer, riskOutlook, outlook);
  const healthy = buildContingentBufferOutlookCoherenceReport(
    9,
    v,
    contingentOutlook,
    bufferOutlook,
    outlook
  );

  record('CBOC-T01', 'Three contingent buffer outlook checks', healthy.checks.length === 3, 'ok');
  record(
    'CBOC-T02',
    'Within contingent buffer outlook band',
    healthy.withinContingentBufferOutlookBand,
    `gap=${healthy.aggregateCoherenceGapPoints}`
  );
  record(
    'CBOC-T03',
    'Aligned with buffer outlook',
    healthy.alignedWithBufferOutlook,
    healthy.narrative
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
