import { allocateIntergovernmentalGrants } from '../intergovernmental-grants/compute';
import { buildGrantClawbackForwardCoherenceReport } from '../grant-clawback-forward-coherence/compute';
import { buildGrantClawbackScheduleReport } from '../grant-clawback-schedule/compute';
import { buildGrantClawbackOutlookBridgeReport } from '../grant-clawback-outlook-bridge/compute';
import { buildGrantForwardAlignmentReport } from '../grant-forward-alignment/compute';
import { buildReconciliationCouplingOutlookBridgeReport } from '../reconciliation-coupling-outlook-bridge/compute';
import { buildReconciliationResilienceBridgeReport } from '../reconciliation-resilience-bridge/compute';
import { buildContingentLiabilityForwardBridgeReport } from '../contingent-liability-forward-bridge/compute';
import { buildDebtFiscalCouplingRegisterReport } from '../debt-fiscal-coupling-register/compute';
import { buildDebtPortfolioGovernanceReport } from '../debt-portfolio-governance/compute';
import { buildDebtServiceCoverageReport } from '../debt-service-coverage/compute';
import { buildDebtServiceForwardCoherenceReport } from '../debt-service-forward-coherence/compute';
import { buildDebtFiscalCouplingOutlookBridgeReport } from '../debt-fiscal-coupling-outlook-bridge/compute';
import { buildExpenditureGrowthBenchmarkReport } from '../expenditure-growth-benchmark/compute';
import { buildFiscalBufferCoherenceReport } from '../fiscal-buffer-coherence/compute';
import { buildFiscalRiskRegister } from '../fiscal-risk-register/compute';
import { buildFiscalRiskStressCoherenceReport } from '../fiscal-risk-stress-coherence/compute';
import { buildFiscalStressResilienceBridgeReport } from '../fiscal-stress-resilience-bridge/compute';
import { buildFiscalStressScenariosReport } from '../fiscal-stress-scenarios/compute';
import { buildForwardEstimatesIntegrityReport } from '../forward-estimates-integrity/compute';
import { assessContingentLiabilities } from '../contingent-liabilities/compute';
import { assessFiscalResilience } from '../fiscal-resilience/compute';
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
import { summarizeInfrastructureFinancing } from '../infrastructure-financing/compute';
import { runFiscalReconciliation } from '../reconciliation/reconcile';
import { buildReconciliationOutlookBridgeReport } from '../reconciliation-outlook-bridge/compute';
import { buildFiscalBufferOutlookCoherenceReport } from '../fiscal-buffer-outlook-coherence/compute';
import { buildFiscalRiskOutlookCoherenceReport } from '../fiscal-risk-outlook-coherence/compute';
import { buildGrantReconciliationOutlookBridgeReport } from '../grant-reconciliation-outlook-bridge/compute';
import { buildFiscalBufferReconciliationOutlookBridgeReport } from './compute';
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

export function runFiscalBufferReconciliationOutlookBridgeSelfTests(): {
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
  const grants = allocateIntergovernmentalGrants(9, v);
  const clawback = buildGrantClawbackScheduleReport(9, v, grants);
  const infra = summarizeInfrastructureFinancing(
    9,
    [
      {
        projectId: 'grob_infra',
        title: 'Grant reconciliation probe',
        regionIds: ['national'],
        capitalPoints: 10,
        maintenancePointsPerTurn: 1,
        strategicWeight: 0.5,
        preferredVehicle: 'sovereign_bond_series'
      }
    ],
    v,
    state.budget
  );
  const reconciliation = runFiscalReconciliation({
    turn: 9,
    v1012: v,
    envelope: state.budget,
    revenueLedger: ledger,
    infraSummary: infra,
    actorCashProbe: 0
  });
  const resilience = assessFiscalResilience(9, v, ['commodity_drop', 'rate_shock']);
  const myefo = buildMultiYearExpenditureFramework(v, 3);
  const recurring = scheduleRecurringCommitments(9, v, state.budget);
  const outlook = buildMediumTermFiscalOutlook(v, 3);
  const supplementary = buildSupplementaryEstimatesReport(9, v);
  const forwardIntegrity = buildForwardEstimatesIntegrityReport(9, v, myefo, supplementary, outlook);
  const growth = buildExpenditureGrowthBenchmarkReport(9, v, myefo, recurring, forwardIntegrity);
  const revenueForward = buildRevenueForwardReconciliationReport(9, v, ledger, myefo, growth);
  const grantForward = buildGrantForwardAlignmentReport(9, v, grants, myefo, forwardIntegrity, growth);
  const clawbackForward = buildGrantClawbackForwardCoherenceReport(9, v, clawback, grantForward, grants);
  const grantClawbackOutlook = buildGrantClawbackOutlookBridgeReport(9, v, clawback, clawbackForward, outlook);
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
  const contingentBridge = buildContingentLiabilityForwardBridgeReport(
    9,
    v,
    contingent,
    forwardIntegrity,
    stressBridge
  );
  const riskRegister = buildFiscalRiskRegister(9, v);
  const riskStress = buildFiscalRiskStressCoherenceReport(9, v, riskRegister, fiscalStress, contingentBridge);
  const resilienceBridge = buildReconciliationResilienceBridgeReport(
    9,
    v,
    reconciliation,
    resilience,
    riskStress
  );
  const reconciliationOutlook = buildReconciliationOutlookBridgeReport(
    9,
    v,
    resilienceBridge,
    forwardIntegrity,
    outlook
  );
  const couplingRegister = buildDebtFiscalCouplingRegisterReport(9, v, debtService, sovereignCredit, fiscalBuffer);
  const debtServiceForward = buildDebtServiceForwardCoherenceReport(9, v, debtService, revenueForward, outlook);
  const couplingOutlook = buildDebtFiscalCouplingOutlookBridgeReport(
    9,
    v,
    couplingRegister,
    debtServiceForward,
    outlook
  );
  const reconciliationCoupling = buildReconciliationCouplingOutlookBridgeReport(
    9,
    v,
    reconciliationOutlook,
    couplingOutlook,
    outlook
  );
  const grantReconciliation = buildGrantReconciliationOutlookBridgeReport(
    9,
    v,
    grantClawbackOutlook,
    reconciliationCoupling,
    outlook
  );
  const riskOutlook = buildFiscalRiskOutlookCoherenceReport(9, v, riskRegister, outlook, fiscalStress);
  const bufferOutlook = buildFiscalBufferOutlookCoherenceReport(9, v, fiscalBuffer, riskOutlook, outlook);
  const healthy = buildFiscalBufferReconciliationOutlookBridgeReport(
    9,
    v,
    grantReconciliation,
    bufferOutlook,
    outlook
  );

  record('FBROB-T01', 'Three fiscal buffer reconciliation outlook checks', healthy.checks.length === 3, 'ok');
  record(
    'FBROB-T02',
    'Within fiscal buffer reconciliation outlook band',
    healthy.withinFiscalBufferReconciliationOutlookBand,
    `gap=${healthy.bridgeGapPoints}`
  );
  record(
    'FBROB-T03',
    'Aligned with grant reconciliation bridge',
    healthy.alignedWithGrantReconciliationBridge,
    healthy.narrative
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
