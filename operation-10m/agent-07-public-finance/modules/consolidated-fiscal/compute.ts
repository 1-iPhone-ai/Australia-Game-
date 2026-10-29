import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';
import { buildBudgetEnvelope } from '../fiscal-outcomes/budget-envelopes';
import { buildDetailedBudgetPaper } from '../budget-lines/compute';
import { reconcileFederalStateTransfers } from '../federal-state/reconcile';
import { scheduleRecurringCommitments } from '../recurring-commitments/compute';
import { buildNationalRevenueLedger } from '../revenue-ledger/compute';
import { buildTaxExpenditureStatement } from '../tax-expenditure/compute';
import { buildMediumTermFiscalOutlook } from '../medium-term-outlook/compute';
import { buildMultiYearExpenditureFramework } from '../multi-year-framework/compute';
import { assessContingentLiabilities } from '../contingent-liabilities/compute';
import { scoreFiscalTransparencyIndex } from '../fiscal-transparency/compute';
import { buildFiscalRiskRegister } from '../fiscal-risk-register/compute';
import { allocateIntergovernmentalGrants } from '../intergovernmental-grants/compute';
import { buildStatutoryBalancesReport } from '../statutory-balances/compute';
import { buildCostRecoveryStatement } from '../cost-recovery-pricing/compute';
import { buildCashManagementReport } from '../cash-management/compute';
import { buildAppropriationWarrantLedger } from '../appropriation-warrants/compute';
import { buildSupplementaryEstimatesReport } from '../supplementary-estimates/compute';
import { buildSpendingOffsetsReport } from '../spending-offsets/compute';
import { buildPortfolioOutturnReport } from '../portfolio-outturn/compute';
import { buildDebtPortfolioGovernanceReport } from '../debt-portfolio-governance/compute';
import { buildFiscalStressScenariosReport } from '../fiscal-stress-scenarios/compute';
import { buildPublicSectorBalanceSheetReport } from '../public-sector-balance-sheet/compute';
import { buildTaxPolicySensitivityReport } from '../tax-policy-sensitivity/compute';
import { buildAppropriationLapseRegisterReport } from '../appropriation-lapse-register/compute';
import { buildContingencyDrawdownRegisterReport } from '../contingency-drawdown/compute';
import { buildForwardEstimatesIntegrityReport } from '../forward-estimates-integrity/compute';
import { buildSovereignCreditOutlookReport } from '../sovereign-credit-outlook/compute';
import { buildDebtServiceCoverageReport } from '../debt-service-coverage/compute';
import { buildGrantClawbackScheduleReport } from '../grant-clawback-schedule/compute';
import { buildBudgetNeutralPackagesReport } from '../budget-neutral-packages/compute';
import { buildInfrastructureFiscalLoadReport } from '../infrastructure-fiscal-load/compute';
import { buildRevenueIntegrityAuditReport } from '../revenue-integrity-audit/compute';
import { buildAppropriationCarryForwardReport } from '../appropriation-carry-forward/compute';
import { buildExpenditureGrowthBenchmarkReport } from '../expenditure-growth-benchmark/compute';
import { buildEfficiencyDividendRegisterReport } from '../efficiency-dividend-register/compute';
import { buildRevenueForwardReconciliationReport } from '../revenue-forward-reconciliation/compute';
import { buildPortfolioReprioritisationLedgerReport } from '../portfolio-reprioritisation-ledger/compute';
import { buildFiscalBufferCoherenceReport } from '../fiscal-buffer-coherence/compute';
import { buildMediumTermRevenueAnchorReport } from '../medium-term-revenue-anchor/compute';
import { buildAppropriationTimingCoherenceReport } from '../appropriation-timing-coherence/compute';
import { buildDebtFiscalCouplingRegisterReport } from '../debt-fiscal-coupling-register/compute';
import { buildGrantForwardAlignmentReport } from '../grant-forward-alignment/compute';
import { buildInfrastructureEnvelopeCoherenceReport } from '../infrastructure-envelope-coherence/compute';
import { buildFiscalStressResilienceBridgeReport } from '../fiscal-stress-resilience-bridge/compute';
import { buildRevenueIntegrityForwardBridgeReport } from '../revenue-integrity-forward-bridge/compute';
import { buildBudgetNeutralForwardCoherenceReport } from '../budget-neutral-forward-coherence/compute';
import { buildProgramPerformanceFiscalBridgeReport } from '../program-performance-fiscal-bridge/compute';
import { buildTransparencyForwardCoherenceReport } from '../transparency-forward-coherence/compute';
import { buildContingentLiabilityForwardBridgeReport } from '../contingent-liability-forward-bridge/compute';
import { buildCostRecoveryRevenueCoherenceReport } from '../cost-recovery-revenue-coherence/compute';
import { buildGrantClawbackForwardCoherenceReport } from '../grant-clawback-forward-coherence/compute';
import { buildBalanceSheetFiscalCoherenceReport } from '../balance-sheet-fiscal-coherence/compute';
import { buildFiscalRiskStressCoherenceReport } from '../fiscal-risk-stress-coherence/compute';
import { buildSovereignIssuanceCouplingBridgeReport } from '../sovereign-issuance-coupling-bridge/compute';
import { buildFederalStateGrantCoherenceReport } from '../federal-state-grant-coherence/compute';
import { buildReconciliationResilienceBridgeReport } from '../reconciliation-resilience-bridge/compute';
import { buildTaxExpenditureForwardCoherenceReport } from '../tax-expenditure-forward-coherence/compute';
import { buildDebtRolloverCoverageBridgeReport } from '../debt-rollover-coverage-bridge/compute';
import { buildContingencyForwardCoherenceReport } from '../contingency-forward-coherence/compute';
import { buildAppropriationWarrantFiscalBridgeReport } from '../appropriation-warrant-fiscal-bridge/compute';
import { buildEfficiencyOffsetForwardCoherenceReport } from '../efficiency-offset-forward-coherence/compute';
import { buildIntergovernmentalStatutoryCoherenceReport } from '../intergovernmental-statutory-coherence/compute';
import { buildPortfolioOutturnReprioritisationBridgeReport } from '../portfolio-outturn-reprioritisation-bridge/compute';
import { buildTaxSensitivityIntegrityCoherenceReport } from '../tax-sensitivity-integrity-coherence/compute';
import { buildInfrastructureStressEnvelopeBridgeReport } from '../infrastructure-stress-envelope-bridge/compute';
import { buildBudgetNeutralProgramCoherenceReport } from '../budget-neutral-program-coherence/compute';
import { runFiscalReconciliation } from '../reconciliation/reconcile';
import { resolveDebtRollover, defaultMaturityLadder } from '../debt-rollover/compute';
import { computeDebtOutcomeTrajectory } from '../fiscal-outcomes/debt-outcomes';
import { assessFiscalResilience } from '../fiscal-resilience/compute';
import { assessFiscalRulesFramework } from '../fiscal-rules/compute';
import { executeIssuanceCalendar } from '../sovereign-issuance/compute';
import { reviewProgramPerformance } from '../program-performance/compute';
import { summarizeInfrastructureFinancing } from '../infrastructure-financing/compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

export const CONSOLIDATED_FISCAL_SCHEMA = 'op10m-agent07-consolidated-v1';

export interface ConsolidatedFiscalCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface ConsolidatedFiscalReport {
  schemaVersion: string;
  turn: number;
  checks: ConsolidatedFiscalCheck[];
  allPassed: boolean;
  layerCount: number;
}

export function buildConsolidatedFiscalReport(turn: number, v1012: V1012FiscalSnapshot): ConsolidatedFiscalReport {
  const checks: ConsolidatedFiscalCheck[] = [];
  const persisted = createInitialFiscalOutcomesPersisted(turn);
  const { state } = computeFiscalOutcomesLayer({ turn, v1012 }, persisted);
  const ledger = buildNationalRevenueLedger({ turn, v1012, taxInstruments: state.taxInstruments });
  const recurring = scheduleRecurringCommitments(turn, v1012, state.budget);
  const paper = buildDetailedBudgetPaper(v1012, state.budget);
  const igr = reconcileFederalStateTransfers(turn, v1012);
  const taxExp = buildTaxExpenditureStatement(turn, v1012);
  const outlook = buildMediumTermFiscalOutlook(v1012, 3);
  const myefo = buildMultiYearExpenditureFramework(v1012, 3);
  const contingent = assessContingentLiabilities(turn, v1012);
  const transparency = scoreFiscalTransparencyIndex({
    turn,
    v1012,
    publishesTaxExpenditure: true,
    publishesMultiYearEstimates: true,
    publishesContingentRegister: contingent.withinSoftCap,
    publishesProgramOutcomes: true,
    auditLagTurns: 2
  });
  const riskRegister = buildFiscalRiskRegister(turn, v1012);
  const igGrants = allocateIntergovernmentalGrants(turn, v1012);
  const statutory = buildStatutoryBalancesReport(turn, v1012);
  const costRecovery = buildCostRecoveryStatement(turn, v1012);
  const cashMgmt = buildCashManagementReport(turn, v1012);
  const warrantLedger = buildAppropriationWarrantLedger(turn, v1012);
  const supplementary = buildSupplementaryEstimatesReport(turn, v1012);
  const spendingOffsets = buildSpendingOffsetsReport(turn, v1012);
  const portfolioOutturn = buildPortfolioOutturnReport(turn, v1012);
  const debtRollover = resolveDebtRollover({
    turn,
    v1012,
    tranches: defaultMaturityLadder(turn),
    computeTrajectory: computeDebtOutcomeTrajectory
  });
  const debtPortfolioGov = buildDebtPortfolioGovernanceReport(turn, v1012, {
    liquidityStress: debtRollover.liquidityStress
  });
  const fiscalStress = buildFiscalStressScenariosReport(turn, v1012);
  const publicBalanceSheet = buildPublicSectorBalanceSheetReport(turn, v1012, {
    cashClosingBalance: cashMgmt.aggregateClosingBalance
  });
  const taxPolicySensitivity = buildTaxPolicySensitivityReport(turn, v1012, ledger);
  const appropriationLapseRegister = buildAppropriationLapseRegisterReport(turn, v1012, warrantLedger);
  const resilienceStack = assessFiscalResilience(turn, v1012, ['commodity_drop', 'rate_shock']);
  const contingencyFlex = state.budget.lines.find(l => l.category === 'contingency')?.flexPoints ?? 0;
  const fiscalRules = assessFiscalRulesFramework({
    turn,
    v1012,
    envelopeContingencyPoints: contingencyFlex,
    forwardSpendingGrowth: 2
  });
  const contingencyDrawdownRegister = buildContingencyDrawdownRegisterReport(
    turn,
    v1012,
    contingencyFlex,
    fiscalRules
  );
  const forwardEstimatesIntegrity = buildForwardEstimatesIntegrityReport(
    turn,
    v1012,
    myefo,
    supplementary,
    outlook
  );
  const sovereignCreditOutlook = buildSovereignCreditOutlookReport(turn, v1012, debtPortfolioGov, {
    stressWorstDelta: fiscalStress.worstHeadroomDelta
  });
  const debtServiceCoverage = buildDebtServiceCoverageReport(turn, v1012, ledger, cashMgmt);
  const grantClawbackSchedule = buildGrantClawbackScheduleReport(turn, v1012, igGrants);
  const budgetNeutralPackages = buildBudgetNeutralPackagesReport(turn, v1012, spendingOffsets, supplementary);
  const issuance = executeIssuanceCalendar(turn, v1012);
  const programPerf = reviewProgramPerformance(turn, v1012);
  const infraSummary = summarizeInfrastructureFinancing(
    turn,
    [
      {
        projectId: 'consolidated_infra_a',
        title: 'Consolidated corridor',
        regionIds: ['national'],
        capitalPoints: 10,
        maintenancePointsPerTurn: 1,
        strategicWeight: 0.5,
        preferredVehicle: 'sovereign_bond_series'
      }
    ],
    v1012,
    state.budget
  );

  const fiscalReconciliation = runFiscalReconciliation({
    turn,
    v1012,
    envelope: state.budget,
    revenueLedger: ledger,
    infraSummary,
    actorCashProbe: 0
  });

  const infrastructureFiscalLoad = buildInfrastructureFiscalLoadReport(turn, v1012, infraSummary, state.budget);
  const revenueIntegrityAudit = buildRevenueIntegrityAuditReport(turn, v1012, ledger, taxPolicySensitivity);
  const appropriationCarryForward = buildAppropriationCarryForwardReport(
    turn,
    v1012,
    state.budget,
    appropriationLapseRegister,
    warrantLedger
  );
  const expenditureGrowthBenchmark = buildExpenditureGrowthBenchmarkReport(
    turn,
    v1012,
    myefo,
    recurring,
    forwardEstimatesIntegrity
  );
  const efficiencyDividendRegister = buildEfficiencyDividendRegisterReport(
    turn,
    v1012,
    spendingOffsets,
    fiscalRules
  );
  const revenueForwardReconciliation = buildRevenueForwardReconciliationReport(
    turn,
    v1012,
    ledger,
    myefo,
    expenditureGrowthBenchmark
  );
  const portfolioReprioritisationLedger = buildPortfolioReprioritisationLedgerReport(
    turn,
    v1012,
    spendingOffsets,
    portfolioOutturn,
    efficiencyDividendRegister
  );
  const fiscalBufferCoherence = buildFiscalBufferCoherenceReport(
    turn,
    v1012,
    statutory,
    cashMgmt,
    contingencyDrawdownRegister,
    revenueForwardReconciliation
  );
  const mediumTermRevenueAnchor = buildMediumTermRevenueAnchorReport(
    turn,
    v1012,
    outlook,
    revenueForwardReconciliation,
    expenditureGrowthBenchmark
  );
  const appropriationTimingCoherence = buildAppropriationTimingCoherenceReport(
    turn,
    v1012,
    warrantLedger,
    supplementary,
    appropriationCarryForward
  );
  const debtFiscalCouplingRegister = buildDebtFiscalCouplingRegisterReport(
    turn,
    v1012,
    debtServiceCoverage,
    sovereignCreditOutlook,
    fiscalBufferCoherence
  );
  const grantForwardAlignment = buildGrantForwardAlignmentReport(
    turn,
    v1012,
    igGrants,
    myefo,
    forwardEstimatesIntegrity,
    expenditureGrowthBenchmark
  );
  const infrastructureEnvelopeCoherence = buildInfrastructureEnvelopeCoherenceReport(
    turn,
    v1012,
    infrastructureFiscalLoad,
    infraSummary,
    grantForwardAlignment
  );
  const fiscalStressResilienceBridge = buildFiscalStressResilienceBridgeReport(
    turn,
    v1012,
    fiscalStress,
    debtFiscalCouplingRegister,
    fiscalBufferCoherence
  );
  const revenueIntegrityForwardBridge = buildRevenueIntegrityForwardBridgeReport(
    turn,
    v1012,
    revenueIntegrityAudit,
    revenueForwardReconciliation,
    mediumTermRevenueAnchor
  );
  const budgetNeutralForwardCoherence = buildBudgetNeutralForwardCoherenceReport(
    turn,
    v1012,
    budgetNeutralPackages,
    grantForwardAlignment,
    expenditureGrowthBenchmark
  );
  const programPerformanceFiscalBridge = buildProgramPerformanceFiscalBridgeReport(
    turn,
    v1012,
    programPerf,
    fiscalRules,
    spendingOffsets
  );
  const transparencyForwardCoherence = buildTransparencyForwardCoherenceReport(
    turn,
    v1012,
    transparency,
    forwardEstimatesIntegrity,
    revenueIntegrityForwardBridge
  );
  const contingentLiabilityForwardBridge = buildContingentLiabilityForwardBridgeReport(
    turn,
    v1012,
    contingent,
    forwardEstimatesIntegrity,
    fiscalStressResilienceBridge
  );
  const costRecoveryRevenueCoherence = buildCostRecoveryRevenueCoherenceReport(
    turn,
    v1012,
    costRecovery,
    ledger,
    revenueIntegrityForwardBridge
  );
  const grantClawbackForwardCoherence = buildGrantClawbackForwardCoherenceReport(
    turn,
    v1012,
    grantClawbackSchedule,
    grantForwardAlignment,
    igGrants
  );
  const balanceSheetFiscalCoherence = buildBalanceSheetFiscalCoherenceReport(
    turn,
    v1012,
    publicBalanceSheet,
    statutory,
    cashMgmt
  );
  const fiscalRiskStressCoherence = buildFiscalRiskStressCoherenceReport(
    turn,
    v1012,
    riskRegister,
    fiscalStress,
    contingentLiabilityForwardBridge
  );
  const sovereignIssuanceCouplingBridge = buildSovereignIssuanceCouplingBridgeReport(
    turn,
    v1012,
    issuance,
    debtFiscalCouplingRegister,
    debtServiceCoverage
  );
  const federalStateGrantCoherence = buildFederalStateGrantCoherenceReport(
    turn,
    v1012,
    igr,
    igGrants,
    grantClawbackForwardCoherence
  );
  const reconciliationResilienceBridge = buildReconciliationResilienceBridgeReport(
    turn,
    v1012,
    fiscalReconciliation,
    resilienceStack,
    fiscalRiskStressCoherence
  );
  const taxExpenditureForwardCoherence = buildTaxExpenditureForwardCoherenceReport(
    turn,
    v1012,
    taxExp,
    revenueForwardReconciliation,
    revenueIntegrityForwardBridge
  );
  const debtRolloverCoverageBridge = buildDebtRolloverCoverageBridgeReport(
    turn,
    v1012,
    debtRollover,
    debtServiceCoverage,
    sovereignIssuanceCouplingBridge
  );
  const contingencyForwardCoherence = buildContingencyForwardCoherenceReport(
    turn,
    v1012,
    contingencyDrawdownRegister,
    forwardEstimatesIntegrity,
    fiscalBufferCoherence
  );
  const appropriationWarrantFiscalBridge = buildAppropriationWarrantFiscalBridgeReport(
    turn,
    v1012,
    warrantLedger,
    appropriationTimingCoherence,
    appropriationCarryForward
  );
  const efficiencyOffsetForwardCoherence = buildEfficiencyOffsetForwardCoherenceReport(
    turn,
    v1012,
    efficiencyDividendRegister,
    spendingOffsets,
    revenueForwardReconciliation
  );
  const intergovernmentalStatutoryCoherence = buildIntergovernmentalStatutoryCoherenceReport(
    turn,
    v1012,
    igr,
    statutory,
    igGrants
  );
  const portfolioOutturnReprioritisationBridge = buildPortfolioOutturnReprioritisationBridgeReport(
    turn,
    v1012,
    portfolioOutturn,
    portfolioReprioritisationLedger
  );
  const taxSensitivityIntegrityCoherence = buildTaxSensitivityIntegrityCoherenceReport(
    turn,
    v1012,
    taxPolicySensitivity,
    revenueIntegrityAudit
  );
  const infrastructureStressEnvelopeBridge = buildInfrastructureStressEnvelopeBridgeReport(
    turn,
    v1012,
    infrastructureFiscalLoad,
    infrastructureEnvelopeCoherence,
    fiscalStress
  );
  const budgetNeutralProgramCoherence = buildBudgetNeutralProgramCoherenceReport(
    turn,
    v1012,
    budgetNeutralPackages,
    budgetNeutralForwardCoherence,
    programPerformanceFiscalBridge
  );

  checks.push({
    id: 'CF01',
    label: 'Tax expenditure net below gross structural capacity',
    passed: taxExp.netStructuralCapacity <= taxExp.grossStructuralCapacity,
    detail: `net=${taxExp.netStructuralCapacity}, gross=${taxExp.grossStructuralCapacity}`
  });

  checks.push({
    id: 'CF02',
    label: 'IGR pool reconciled',
    passed: igr.reconciled,
    detail: `residual=${igr.residualFederal}`
  });

  checks.push({
    id: 'CF03',
    label: 'Budget sub-lines balanced',
    passed: paper.categories.every(c => c.linesBalanced),
    detail: `categories=${paper.categories.length}`
  });

  checks.push({
    id: 'CF04',
    label: 'Recurring load fits envelope capacity',
    passed: recurring.totalLoadThisTurn <= state.budget.totalCapacityPoints * 0.45,
    detail: `load=${recurring.totalLoadThisTurn}, cap=${state.budget.totalCapacityPoints}`
  });

  checks.push({
    id: 'CF05',
    label: 'Revenue ledger reconciled flag',
    passed: ledger.reconciledToV1012,
    detail: ledger.reconciliationNotes[0] ?? ''
  });

  checks.push({
    id: 'CF06',
    label: 'Medium-term outlook projects envelope capacity',
    passed: outlook.projections.every(p => p.envelopeCapacity > 0),
    detail: `horizon=${outlook.projections.length}`
  });

  checks.push({
    id: 'CF07',
    label: 'Federal-state vertical imbalance bounded',
    passed: igr.verticalImbalanceIndex <= 1.05,
    detail: `vii=${igr.verticalImbalanceIndex}`
  });

  checks.push({
    id: 'CF08',
    label: 'National pressure below critical under consolidated view',
    passed: v1012.pressure !== 'critical' && outlook.worstPressure !== 'critical',
    detail: `now=${v1012.pressure}, worst=${outlook.worstPressure}`
  });

  checks.push({
    id: 'CF09',
    label: 'Multi-year forward bands within ceiling',
    passed: myefo.forwardBands.every(b => b.withinCeiling) || v1012.pressure === 'critical',
    detail: `binding=${myefo.aggregateCeilingBinding}`
  });

  checks.push({
    id: 'CF10',
    label: 'Contingent liabilities within soft cap',
    passed: contingent.withinSoftCap,
    detail: `expected=${contingent.expectedLossPoints}`
  });

  checks.push({
    id: 'CF11',
    label: 'Transparency index at least enhanced under full disclosure',
    passed: transparency.compositeTier !== 'basic' || v1012.fiscalHeadroom < -10,
    detail: `tier=${transparency.compositeTier}, score=${transparency.compositeScore}`
  });

  checks.push({
    id: 'CF12',
    label: 'Fiscal risk register within appetite or critical override',
    passed: riskRegister.withinRiskAppetite || v1012.pressure === 'critical',
    detail: `heat=${riskRegister.aggregateHeat}, tier=${riskRegister.tier}`
  });

  checks.push({
    id: 'CF13',
    label: 'Intergovernmental grants reconcile to IGR pool slice',
    passed: igGrants.reconciledToIgrPool,
    detail: `federal=${igGrants.totalFederal}, clawback=${igGrants.totalClawback}`
  });

  checks.push({
    id: 'CF14',
    label: 'Grant performance pass rate above floor under non-critical pressure',
    passed: igGrants.performancePassRate >= 0.4 || v1012.pressure === 'critical',
    detail: `rate=${igGrants.performancePassRate}`
  });

  checks.push({
    id: 'CF15',
    label: 'Statutory balances within soft anchors',
    passed: statutory.allWithinSoftAnchors,
    detail: `nob=${statutory.netOperatingBalance}, fb=${statutory.fiscalBalance}`
  });

  checks.push({
    id: 'CF16',
    label: 'Cost recovery portfolio meets floor',
    passed: costRecovery.withinPortfolioTarget,
    detail: `weighted=${costRecovery.weightedRecoveryRatio}`
  });

  checks.push({
    id: 'CF17',
    label: 'Fiscal rules compliant or critical override',
    passed: fiscalRules.allCompliant || v1012.pressure === 'critical',
    detail: `breaches=${fiscalRules.breachCount}`
  });

  checks.push({
    id: 'CF18',
    label: 'Sovereign issuance without liquidity shortfall',
    passed: !issuance.liquidityShortfall || !v1012.debtEnabled,
    detail: `issued=${issuance.totalIssued}/${issuance.totalScheduled}`
  });

  checks.push({
    id: 'CF19',
    label: 'Program performance aggregate feedback bounded',
    passed: programPerf.aggregateFeedbackPoints >= -8 || v1012.pressure === 'critical',
    detail: `feedback=${programPerf.aggregateFeedbackPoints}, atRisk=${programPerf.programsAtRisk}`
  });

  checks.push({
    id: 'CF20',
    label: 'Infrastructure portfolio feasible under consolidated envelope',
    passed: infraSummary.plans.every(p => p.feasible) || v1012.pressure === 'critical',
    detail: `capital=${infraSummary.aggregateCapital}, service=${infraSummary.aggregateServiceLoad}`
  });

  checks.push({
    id: 'CF21',
    label: 'Debt maturity rollover without liquidity stress',
    passed: !debtRollover.liquidityStress || !v1012.debtEnabled || v1012.pressure === 'critical',
    detail: `events=${debtRollover.events.length}, stress=${debtRollover.liquidityStress}`
  });

  checks.push({
    id: 'CF22',
    label: 'Stacked fiscal shocks remain above critical band',
    passed:
      resilienceStack.compositeStressBand !== 'critical' ||
      v1012.pressure === 'critical' ||
      resilienceStack.baselinePressure === 'critical',
    detail: `band=${resilienceStack.compositeStressBand}, reserve=${resilienceStack.reserveAdequacy}`
  });

  checks.push({
    id: 'CF23',
    label: 'Treasury cash within drawdown limit',
    passed: cashMgmt.withinDrawdownLimit,
    detail: `closing=${cashMgmt.aggregateClosingBalance}, runway=${cashMgmt.runwayTurns}`
  });

  checks.push({
    id: 'CF24',
    label: 'Appropriation warrant lapse within tolerance',
    passed: warrantLedger.lapseWithinTolerance,
    detail: `risk=${warrantLedger.aggregateLapseRisk}, remaining=${warrantLedger.aggregateRemaining}`
  });

  checks.push({
    id: 'CF25',
    label: 'Supplementary estimates net revision within tolerance',
    passed: supplementary.withinRevisionTolerance,
    detail: `net=${supplementary.netRevisionPoints}, up=${supplementary.aggregateUpwardRevision}`
  });

  checks.push({
    id: 'CF26',
    label: 'Spending offset portfolio meets coverage floor',
    passed: spendingOffsets.withinPortfolioTarget,
    detail: `coverage=${spendingOffsets.portfolioCoverageRatio}, new=${spendingOffsets.aggregateNewSpending}`
  });

  checks.push({
    id: 'CF27',
    label: 'Cross-layer fiscal reconciliation passes',
    passed: fiscalReconciliation.allPassed || v1012.pressure === 'critical',
    detail: `checks=${fiscalReconciliation.checks.filter(c => c.passed).length}/${fiscalReconciliation.checks.length}`
  });

  checks.push({
    id: 'CF28',
    label: 'Supplementary uplift coherent with warrant headroom',
    passed:
      supplementary.netRevisionPoints <= warrantLedger.aggregateRemaining * 0.85 + 4 ||
      supplementary.netRevisionPoints <= 0 ||
      v1012.pressure === 'critical',
    detail: `revision=${supplementary.netRevisionPoints}, warrantRemaining=${warrantLedger.aggregateRemaining}`
  });

  checks.push({
    id: 'CF29',
    label: 'Portfolio outturn within reconciliation tolerance',
    passed: portfolioOutturn.withinReconciliationTolerance,
    detail: `variance=${portfolioOutturn.aggregateVariancePoints}, ratio=${portfolioOutturn.aggregateVarianceRatio}`
  });

  checks.push({
    id: 'CF30',
    label: 'Debt portfolio governance within targets',
    passed: debtPortfolioGov.withinGovernanceTargets || !v1012.debtEnabled || v1012.pressure === 'critical',
    detail: `wad=${debtPortfolioGov.weightedAverageDurationYears}, maxShare=${debtPortfolioGov.maxTrancheShare}`
  });

  checks.push({
    id: 'CF31',
    label: 'Outturn drift coherent with supplementary net revision',
    passed:
      Math.abs(portfolioOutturn.aggregateVariancePoints - supplementary.netRevisionPoints * 0.35) <= 4.5 ||
      supplementary.netRevisionPoints <= 0 ||
      v1012.pressure === 'critical',
    detail: `outturn=${portfolioOutturn.aggregateVariancePoints}, suppNet=${supplementary.netRevisionPoints}`
  });

  checks.push({
    id: 'CF32',
    label: 'Debt portfolio duration aligned with rollover stress',
    passed:
      debtPortfolioGov.rolloverStressAligned ||
      !debtRollover.liquidityStress ||
      !v1012.debtEnabled ||
      v1012.pressure === 'critical',
    detail: `stress=${debtRollover.liquidityStress}, aligned=${debtPortfolioGov.rolloverStressAligned}`
  });

  checks.push({
    id: 'CF33',
    label: 'Fiscal stress scenarios within appetite',
    passed: fiscalStress.withinStressAppetite,
    detail: `breaches=${fiscalStress.aggregateBreaches}, worstDelta=${fiscalStress.worstHeadroomDelta}`
  });

  checks.push({
    id: 'CF34',
    label: 'Public sector net worth above floor',
    passed: publicBalanceSheet.withinNetWorthFloor,
    detail: `ratio=${publicBalanceSheet.netWorthRatio}, nw=${publicBalanceSheet.netWorthPoints}`
  });

  checks.push({
    id: 'CF35',
    label: 'Stress worst case coherent with risk register heat',
    passed:
      Math.abs(fiscalStress.worstHeadroomDelta) <= riskRegister.aggregateHeat * 0.55 + 8 ||
      v1012.pressure === 'critical' ||
      !riskRegister.withinRiskAppetite,
    detail: `worstDelta=${fiscalStress.worstHeadroomDelta}, heat=${riskRegister.aggregateHeat}`
  });

  checks.push({
    id: 'CF36',
    label: 'Balance sheet liquid slice aligned with TGA closing',
    passed: publicBalanceSheet.liquidSliceCoherentWithCash,
    detail: `liquid=${publicBalanceSheet.liquidAssetSlice}, tga=${cashMgmt.aggregateClosingBalance}`
  });

  checks.push({
    id: 'CF37',
    label: 'Tax policy sensitivity within aggregate band',
    passed: taxPolicySensitivity.withinAggregateBand,
    detail: `marginal=${taxPolicySensitivity.aggregateMarginalPoints}, uplift=${taxPolicySensitivity.modeledUpliftPoints}`
  });

  checks.push({
    id: 'CF38',
    label: 'Appropriation lapse register within tolerance',
    passed: appropriationLapseRegister.withinRegisterTolerance,
    detail: `ratio=${appropriationLapseRegister.lapseToRemainingRatio}, lapse=${appropriationLapseRegister.aggregateLapsePoints}`
  });

  checks.push({
    id: 'CF39',
    label: 'Tax sensitivity uplift coherent with revenue ledger',
    passed: taxPolicySensitivity.coherentWithLedgerDelta,
    detail: `uplift=${taxPolicySensitivity.modeledUpliftPoints}, ledgerOk=${ledger.reconciledToV1012}`
  });

  checks.push({
    id: 'CF40',
    label: 'Lapse register aligned with warrant ledger risk',
    passed: appropriationLapseRegister.alignedWithWarrantLedger,
    detail: `register=${appropriationLapseRegister.aggregateLapsePoints}, warrantRisk=${warrantLedger.aggregateLapseRisk}`
  });

  checks.push({
    id: 'CF41',
    label: 'Contingency drawdown within cap',
    passed: contingencyDrawdownRegister.withinDrawdownCap,
    detail: `ratio=${contingencyDrawdownRegister.drawdownToOpeningRatio}, draw=${contingencyDrawdownRegister.aggregateDrawdownPoints}`
  });

  checks.push({
    id: 'CF42',
    label: 'Forward estimates integrity passes',
    passed: forwardEstimatesIntegrity.allPassed || v1012.pressure === 'critical',
    detail: `checks=${forwardEstimatesIntegrity.checks.filter(c => c.passed).length}/${forwardEstimatesIntegrity.checks.length}`
  });

  checks.push({
    id: 'CF43',
    label: 'Contingency drawdown coherent with fiscal rules',
    passed: contingencyDrawdownRegister.coherentWithFiscalRules || v1012.pressure === 'critical',
    detail: `closing=${contingencyDrawdownRegister.closingFlexPoints}, breaches=${fiscalRules.breachCount}`
  });

  checks.push({
    id: 'CF44',
    label: 'Forward revision gap coherent with supplementary',
    passed: forwardEstimatesIntegrity.coherentWithSupplementary,
    detail: `gap=${forwardEstimatesIntegrity.aggregateRevisionGap}, suppNet=${supplementary.netRevisionPoints}`
  });

  checks.push({
    id: 'CF45',
    label: 'Sovereign credit outlook within band',
    passed: sovereignCreditOutlook.withinOutlookBand || !v1012.debtEnabled,
    detail: `spread=${sovereignCreditOutlook.impliedSpreadBps}, band=${sovereignCreditOutlook.ratingBand}`
  });

  checks.push({
    id: 'CF46',
    label: 'Debt service coverage above floor',
    passed: debtServiceCoverage.withinCoverageFloor,
    detail: `ratio=${debtServiceCoverage.coverageRatio}, band=${debtServiceCoverage.coverageBand}`
  });

  checks.push({
    id: 'CF47',
    label: 'Credit outlook coherent with debt portfolio governance',
    passed: sovereignCreditOutlook.coherentWithDebtGovernance,
    detail: `band=${sovereignCreditOutlook.ratingBand}, govOk=${debtPortfolioGov.withinGovernanceTargets}`
  });

  checks.push({
    id: 'CF48',
    label: 'Debt coverage aligned with TGA runway',
    passed: debtServiceCoverage.runwayTurnsAligned,
    detail: `runway=${cashMgmt.runwayTurns}, coverage=${debtServiceCoverage.coverageRatio}`
  });

  checks.push({
    id: 'CF49',
    label: 'Grant clawback schedule within tolerance',
    passed: grantClawbackSchedule.withinScheduleTolerance,
    detail: `ratio=${grantClawbackSchedule.scheduleToClawbackRatio}, scheduled=${grantClawbackSchedule.aggregateScheduledPoints}`
  });

  checks.push({
    id: 'CF50',
    label: 'Budget-neutral packages within portfolio band',
    passed: budgetNeutralPackages.withinPortfolioNeutrality,
    detail: `net=${budgetNeutralPackages.aggregateNetPoints}, new=${budgetNeutralPackages.aggregateNewSpending}`
  });

  checks.push({
    id: 'CF51',
    label: 'Clawback schedule aligned with IGR grant pool',
    passed: grantClawbackSchedule.alignedWithIgrPool || v1012.pressure === 'critical',
    detail: `scheduled=${grantClawbackSchedule.aggregateScheduledPoints}, clawback=${grantClawbackSchedule.aggregateClawbackPoints}`
  });

  checks.push({
    id: 'CF52',
    label: 'Neutral packages coherent with spending offsets',
    passed: budgetNeutralPackages.coherentWithSpendingOffsets,
    detail: `offsets=${budgetNeutralPackages.aggregateOffsets}, portfolio=${spendingOffsets.aggregateOffsets}`
  });

  checks.push({
    id: 'CF53',
    label: 'Infrastructure fiscal load within portfolio cap',
    passed: infrastructureFiscalLoad.withinPortfolioLoadCap || v1012.pressure === 'critical',
    detail: `ratio=${infrastructureFiscalLoad.loadToCapacityRatio}, service=${infrastructureFiscalLoad.aggregateServiceLoad}`
  });

  checks.push({
    id: 'CF54',
    label: 'Revenue integrity audit passes',
    passed: revenueIntegrityAudit.allPassed || v1012.pressure === 'critical',
    detail: `findings=${revenueIntegrityAudit.findings.filter(f => f.passed).length}/${revenueIntegrityAudit.findings.length}`
  });

  checks.push({
    id: 'CF55',
    label: 'Infra load feasible under consolidated envelope',
    passed: infrastructureFiscalLoad.feasibleUnderEnvelope,
    detail: `capital=${infrastructureFiscalLoad.aggregateCapital}, cap=${infrastructureFiscalLoad.envelopeCapacityPoints}`
  });

  checks.push({
    id: 'CF56',
    label: 'Revenue audit coherent with tax sensitivity',
    passed: revenueIntegrityAudit.coherentWithTaxSensitivity,
    detail: `gap=${revenueIntegrityAudit.aggregateDeltaGap}, uplift=${taxPolicySensitivity.modeledUpliftPoints}`
  });

  checks.push({
    id: 'CF57',
    label: 'Appropriation carry-forward within portfolio cap',
    passed: appropriationCarryForward.withinPortfolioCarryCap || v1012.pressure === 'critical',
    detail: `ratio=${appropriationCarryForward.carryToEnvelopeRatio}, carry=${appropriationCarryForward.aggregateCarryForwardPoints}`
  });

  checks.push({
    id: 'CF58',
    label: 'Expenditure growth within benchmark band',
    passed: expenditureGrowthBenchmark.withinAggregateBenchmark,
    detail: `growth=${expenditureGrowthBenchmark.aggregateGrowthRate}, band=${expenditureGrowthBenchmark.revenueCapacityGrowthBand}`
  });

  checks.push({
    id: 'CF59',
    label: 'Carry-forward aligned with lapse register',
    passed: appropriationCarryForward.alignedWithLapseRegister,
    detail: `carry=${appropriationCarryForward.aggregateCarryForwardPoints}, lapse=${appropriationCarryForward.aggregateSourceLapsePoints}`
  });

  checks.push({
    id: 'CF60',
    label: 'Growth benchmark coherent with forward integrity',
    passed: expenditureGrowthBenchmark.coherentWithForwardIntegrity,
    detail: `drift=${forwardEstimatesIntegrity.bandDriftPoints}, revisionGap=${forwardEstimatesIntegrity.aggregateRevisionGap}`
  });

  checks.push({
    id: 'CF61',
    label: 'Efficiency dividend within portfolio schedule',
    passed: efficiencyDividendRegister.withinPortfolioSchedule || v1012.pressure === 'critical',
    detail: `ratio=${efficiencyDividendRegister.scheduleToRealizationRatio}, scheduled=${efficiencyDividendRegister.aggregateScheduledPoints}`
  });

  checks.push({
    id: 'CF62',
    label: 'Revenue forward reconciliation passes',
    passed: revenueForwardReconciliation.allPassed || v1012.pressure === 'critical',
    detail: `gap=${revenueForwardReconciliation.aggregateGapPoints}, checks=${revenueForwardReconciliation.checks.filter(c => c.passed).length}/${revenueForwardReconciliation.checks.length}`
  });

  checks.push({
    id: 'CF63',
    label: 'Efficiency dividend coherent with spending offsets',
    passed: efficiencyDividendRegister.coherentWithSpendingOffsets,
    detail: `realized=${efficiencyDividendRegister.aggregateRealizedPoints}, offsets=${spendingOffsets.aggregateOffsets}`
  });

  checks.push({
    id: 'CF64',
    label: 'Revenue forward aligned with growth benchmark',
    passed: revenueForwardReconciliation.alignedWithGrowthBenchmark,
    detail: `band=${expenditureGrowthBenchmark.revenueCapacityGrowthBand}, growth=${expenditureGrowthBenchmark.aggregateGrowthRate}`
  });

  checks.push({
    id: 'CF65',
    label: 'Portfolio reprioritisation within envelope',
    passed: portfolioReprioritisationLedger.withinPortfolioEnvelope || v1012.pressure === 'critical',
    detail: `realized=${portfolioReprioritisationLedger.aggregateRealizedPoints}, planned=${portfolioReprioritisationLedger.aggregatePlannedPoints}`
  });

  checks.push({
    id: 'CF66',
    label: 'Fiscal buffer coherence passes',
    passed: fiscalBufferCoherence.allPassed || v1012.pressure === 'critical',
    detail: `buffer=${fiscalBufferCoherence.aggregateBufferPoints}, checks=${fiscalBufferCoherence.checks.filter(c => c.passed).length}/${fiscalBufferCoherence.checks.length}`
  });

  checks.push({
    id: 'CF67',
    label: 'Reprioritisation aligned with efficiency dividend',
    passed: portfolioReprioritisationLedger.alignedWithEfficiencyDividend,
    detail: `efficiencyRealized=${efficiencyDividendRegister.aggregateRealizedPoints}, reprior=${portfolioReprioritisationLedger.aggregateRealizedPoints}`
  });

  checks.push({
    id: 'CF68',
    label: 'Fiscal buffer aligned with revenue forward',
    passed: fiscalBufferCoherence.alignedWithRevenueForward,
    detail: `gap=${revenueForwardReconciliation.aggregateGapPoints}, buffer=${fiscalBufferCoherence.aggregateBufferPoints}`
  });

  checks.push({
    id: 'CF69',
    label: 'Medium-term revenue anchor within band',
    passed: mediumTermRevenueAnchor.withinAnchorBand || v1012.pressure === 'critical',
    detail: `drift=${mediumTermRevenueAnchor.anchorDriftPoints}, checks=${mediumTermRevenueAnchor.checks.filter(c => c.passed).length}/${mediumTermRevenueAnchor.checks.length}`
  });

  checks.push({
    id: 'CF70',
    label: 'Appropriation timing within window',
    passed: appropriationTimingCoherence.withinTimingWindow || v1012.pressure === 'critical',
    detail: `gap=${appropriationTimingCoherence.aggregateTimingGapPoints}, checks=${appropriationTimingCoherence.checks.filter(c => c.passed).length}/${appropriationTimingCoherence.checks.length}`
  });

  checks.push({
    id: 'CF71',
    label: 'Revenue anchor aligned with forward reconciliation',
    passed: mediumTermRevenueAnchor.alignedWithForwardReconciliation,
    detail: `forwardGap=${revenueForwardReconciliation.aggregateGapPoints}, drift=${mediumTermRevenueAnchor.anchorDriftPoints}`
  });

  checks.push({
    id: 'CF72',
    label: 'Appropriation timing coherent with carry-forward',
    passed: appropriationTimingCoherence.coherentWithCarryForward,
    detail: `carry=${appropriationCarryForward.aggregateCarryForwardPoints}, timingGap=${appropriationTimingCoherence.aggregateTimingGapPoints}`
  });

  checks.push({
    id: 'CF73',
    label: 'Debt–fiscal coupling within band',
    passed: debtFiscalCouplingRegister.withinCouplingBand || v1012.pressure === 'critical',
    detail: `stress=${debtFiscalCouplingRegister.couplingStressPoints}, checks=${debtFiscalCouplingRegister.checks.filter(c => c.passed).length}/${debtFiscalCouplingRegister.checks.length}`
  });

  checks.push({
    id: 'CF74',
    label: 'Grant forward alignment within band',
    passed: grantForwardAlignment.withinGrantForwardBand || v1012.pressure === 'critical',
    detail: `gap=${grantForwardAlignment.aggregateAlignmentGapPoints}, checks=${grantForwardAlignment.checks.filter(c => c.passed).length}/${grantForwardAlignment.checks.length}`
  });

  checks.push({
    id: 'CF75',
    label: 'Debt coupling aligned with fiscal buffer',
    passed: debtFiscalCouplingRegister.alignedWithFiscalBuffer,
    detail: `buffer=${fiscalBufferCoherence.aggregateBufferPoints}, stress=${debtFiscalCouplingRegister.couplingStressPoints}`
  });

  checks.push({
    id: 'CF76',
    label: 'Grant forward aligned with expenditure framework',
    passed: grantForwardAlignment.alignedWithExpenditureFramework,
    detail: `growth=${expenditureGrowthBenchmark.aggregateGrowthRate}, gap=${grantForwardAlignment.aggregateAlignmentGapPoints}`
  });

  checks.push({
    id: 'CF77',
    label: 'Infrastructure envelope coherence within band',
    passed: infrastructureEnvelopeCoherence.withinEnvelopeCoherence || v1012.pressure === 'critical',
    detail: `gap=${infrastructureEnvelopeCoherence.aggregateCoherenceGapPoints}, checks=${infrastructureEnvelopeCoherence.checks.filter(c => c.passed).length}/${infrastructureEnvelopeCoherence.checks.length}`
  });

  checks.push({
    id: 'CF78',
    label: 'Fiscal stress resilience bridge within band',
    passed: fiscalStressResilienceBridge.withinResilienceBridge || v1012.pressure === 'critical',
    detail: `bridge=${fiscalStressResilienceBridge.bridgeStressPoints}, checks=${fiscalStressResilienceBridge.checks.filter(c => c.passed).length}/${fiscalStressResilienceBridge.checks.length}`
  });

  checks.push({
    id: 'CF79',
    label: 'Infrastructure envelope aligned with grant forward',
    passed: infrastructureEnvelopeCoherence.alignedWithGrantForward,
    detail: `loadRatio=${infrastructureFiscalLoad.loadToCapacityRatio}, grantGap=${grantForwardAlignment.aggregateAlignmentGapPoints}`
  });

  checks.push({
    id: 'CF80',
    label: 'Stress bridge aligned with debt coupling',
    passed: fiscalStressResilienceBridge.alignedWithDebtCoupling,
    detail: `coupling=${debtFiscalCouplingRegister.couplingStressPoints}, bridge=${fiscalStressResilienceBridge.bridgeStressPoints}`
  });

  checks.push({
    id: 'CF81',
    label: 'Revenue integrity forward bridge within band',
    passed: revenueIntegrityForwardBridge.withinIntegrityForwardBand || v1012.pressure === 'critical',
    detail: `gap=${revenueIntegrityForwardBridge.bridgeGapPoints}, checks=${revenueIntegrityForwardBridge.checks.filter(c => c.passed).length}/${revenueIntegrityForwardBridge.checks.length}`
  });

  checks.push({
    id: 'CF82',
    label: 'Budget neutral forward coherence within band',
    passed: budgetNeutralForwardCoherence.withinNeutralForwardBand || v1012.pressure === 'critical',
    detail: `gap=${budgetNeutralForwardCoherence.aggregateNeutralGapPoints}, checks=${budgetNeutralForwardCoherence.checks.filter(c => c.passed).length}/${budgetNeutralForwardCoherence.checks.length}`
  });

  checks.push({
    id: 'CF83',
    label: 'Integrity forward aligned with revenue anchor',
    passed: revenueIntegrityForwardBridge.alignedWithRevenueAnchor,
    detail: `drift=${mediumTermRevenueAnchor.anchorDriftPoints}, bridge=${revenueIntegrityForwardBridge.bridgeGapPoints}`
  });

  checks.push({
    id: 'CF84',
    label: 'Budget neutral aligned with grant forward',
    passed: budgetNeutralForwardCoherence.alignedWithGrantForward,
    detail: `net=${budgetNeutralPackages.aggregateNetPoints}, grantGap=${grantForwardAlignment.aggregateAlignmentGapPoints}`
  });

  checks.push({
    id: 'CF85',
    label: 'Program performance fiscal bridge within band',
    passed: programPerformanceFiscalBridge.withinPerformanceFiscalBand || v1012.pressure === 'critical',
    detail: `gap=${programPerformanceFiscalBridge.bridgeFeedbackGapPoints}, checks=${programPerformanceFiscalBridge.checks.filter(c => c.passed).length}/${programPerformanceFiscalBridge.checks.length}`
  });

  checks.push({
    id: 'CF86',
    label: 'Transparency forward coherence within band',
    passed: transparencyForwardCoherence.withinTransparencyForwardBand || v1012.pressure === 'critical',
    detail: `gap=${transparencyForwardCoherence.aggregateCoherenceGapPoints}, checks=${transparencyForwardCoherence.checks.filter(c => c.passed).length}/${transparencyForwardCoherence.checks.length}`
  });

  checks.push({
    id: 'CF87',
    label: 'Program bridge aligned with spending offsets',
    passed: programPerformanceFiscalBridge.alignedWithSpendingOffsets,
    detail: `feedback=${programPerf.aggregateFeedbackPoints}, offsets=${spendingOffsets.aggregateOffsets}`
  });

  checks.push({
    id: 'CF88',
    label: 'Transparency aligned with integrity bridge',
    passed: transparencyForwardCoherence.alignedWithIntegrityBridge,
    detail: `tier=${transparency.compositeTier}, bridge=${revenueIntegrityForwardBridge.bridgeGapPoints}`
  });

  checks.push({
    id: 'CF89',
    label: 'Contingent liability forward bridge within band',
    passed: contingentLiabilityForwardBridge.withinContingentForwardBand || v1012.pressure === 'critical',
    detail: `gap=${contingentLiabilityForwardBridge.bridgeExposureGapPoints}, checks=${contingentLiabilityForwardBridge.checks.filter(c => c.passed).length}/${contingentLiabilityForwardBridge.checks.length}`
  });

  checks.push({
    id: 'CF90',
    label: 'Cost recovery revenue coherence within band',
    passed: costRecoveryRevenueCoherence.withinRecoveryRevenueBand || v1012.pressure === 'critical',
    detail: `gap=${costRecoveryRevenueCoherence.aggregateCoherenceGapPoints}, checks=${costRecoveryRevenueCoherence.checks.filter(c => c.passed).length}/${costRecoveryRevenueCoherence.checks.length}`
  });

  checks.push({
    id: 'CF91',
    label: 'Contingent forward aligned with stress bridge',
    passed: contingentLiabilityForwardBridge.alignedWithStressBridge,
    detail: `expected=${contingent.expectedLossPoints}, bridge=${fiscalStressResilienceBridge.bridgeStressPoints}`
  });

  checks.push({
    id: 'CF92',
    label: 'Cost recovery aligned with integrity bridge',
    passed: costRecoveryRevenueCoherence.alignedWithIntegrityBridge,
    detail: `recovery=${costRecovery.weightedRecoveryRatio}, integrityGap=${revenueIntegrityForwardBridge.bridgeGapPoints}`
  });

  checks.push({
    id: 'CF93',
    label: 'Grant clawback forward coherence within band',
    passed: grantClawbackForwardCoherence.withinClawbackForwardBand || v1012.pressure === 'critical',
    detail: `gap=${grantClawbackForwardCoherence.aggregateClawbackGapPoints}, checks=${grantClawbackForwardCoherence.checks.filter(c => c.passed).length}/${grantClawbackForwardCoherence.checks.length}`
  });

  checks.push({
    id: 'CF94',
    label: 'Balance sheet fiscal coherence within band',
    passed: balanceSheetFiscalCoherence.withinBalanceFiscalBand || v1012.pressure === 'critical',
    detail: `gap=${balanceSheetFiscalCoherence.aggregateCoherenceGapPoints}, checks=${balanceSheetFiscalCoherence.checks.filter(c => c.passed).length}/${balanceSheetFiscalCoherence.checks.length}`
  });

  checks.push({
    id: 'CF95',
    label: 'Clawback forward aligned with grant forward',
    passed: grantClawbackForwardCoherence.alignedWithGrantForward,
    detail: `clawback=${grantClawbackSchedule.aggregateClawbackPoints}, grantGap=${grantForwardAlignment.aggregateAlignmentGapPoints}`
  });

  checks.push({
    id: 'CF96',
    label: 'Balance sheet aligned with statutory balances',
    passed: balanceSheetFiscalCoherence.alignedWithStatutoryBalances,
    detail: `netWorth=${publicBalanceSheet.netWorthPoints}, fiscalBalance=${statutory.fiscalBalance}`
  });

  checks.push({
    id: 'CF97',
    label: 'Fiscal risk stress coherence within band',
    passed: fiscalRiskStressCoherence.withinRiskStressBand || v1012.pressure === 'critical',
    detail: `gap=${fiscalRiskStressCoherence.aggregateRiskStressGapPoints}, checks=${fiscalRiskStressCoherence.checks.filter(c => c.passed).length}/${fiscalRiskStressCoherence.checks.length}`
  });

  checks.push({
    id: 'CF98',
    label: 'Sovereign issuance coupling within band',
    passed: sovereignIssuanceCouplingBridge.withinIssuanceCouplingBand || v1012.pressure === 'critical',
    detail: `gap=${sovereignIssuanceCouplingBridge.bridgeCouplingGapPoints}, checks=${sovereignIssuanceCouplingBridge.checks.filter(c => c.passed).length}/${sovereignIssuanceCouplingBridge.checks.length}`
  });

  checks.push({
    id: 'CF99',
    label: 'Risk stress aligned with contingent bridge',
    passed: fiscalRiskStressCoherence.alignedWithContingentBridge,
    detail: `heat=${riskRegister.aggregateHeat}, contingentGap=${contingentLiabilityForwardBridge.bridgeExposureGapPoints}`
  });

  checks.push({
    id: 'CF100',
    label: 'Issuance coupling aligned with debt service',
    passed: sovereignIssuanceCouplingBridge.alignedWithDebtService,
    detail: `coverage=${debtServiceCoverage.coverageRatio}, issued=${issuance.totalIssued}`
  });

  checks.push({
    id: 'CF101',
    label: 'Federal state grant coherence within band',
    passed: federalStateGrantCoherence.withinFederalGrantBand || v1012.pressure === 'critical',
    detail: `gap=${federalStateGrantCoherence.aggregateCoherenceGapPoints}, checks=${federalStateGrantCoherence.checks.filter(c => c.passed).length}/${federalStateGrantCoherence.checks.length}`
  });

  checks.push({
    id: 'CF102',
    label: 'Reconciliation resilience bridge within band',
    passed: reconciliationResilienceBridge.withinReconciliationResilienceBand || v1012.pressure === 'critical',
    detail: `gap=${reconciliationResilienceBridge.bridgeGapPoints}, checks=${reconciliationResilienceBridge.checks.filter(c => c.passed).length}/${reconciliationResilienceBridge.checks.length}`
  });

  checks.push({
    id: 'CF103',
    label: 'Federal grant aligned with clawback forward',
    passed: federalStateGrantCoherence.alignedWithClawbackForward,
    detail: `igr=${igr.residualFederal}, clawbackGap=${grantClawbackForwardCoherence.aggregateClawbackGapPoints}`
  });

  checks.push({
    id: 'CF104',
    label: 'Reconciliation bridge aligned with risk stress',
    passed: reconciliationResilienceBridge.alignedWithRiskStressCoherence,
    detail: `recon=${fiscalReconciliation.allPassed}, riskGap=${fiscalRiskStressCoherence.aggregateRiskStressGapPoints}`
  });

  checks.push({
    id: 'CF105',
    label: 'Tax expenditure forward coherence within band',
    passed: taxExpenditureForwardCoherence.withinTaxExpenditureForwardBand || v1012.pressure === 'critical',
    detail: `gap=${taxExpenditureForwardCoherence.aggregateCoherenceGapPoints}, checks=${taxExpenditureForwardCoherence.checks.filter(c => c.passed).length}/${taxExpenditureForwardCoherence.checks.length}`
  });

  checks.push({
    id: 'CF106',
    label: 'Debt rollover coverage bridge within band',
    passed: debtRolloverCoverageBridge.withinRolloverCoverageBand || v1012.pressure === 'critical',
    detail: `gap=${debtRolloverCoverageBridge.bridgeGapPoints}, checks=${debtRolloverCoverageBridge.checks.filter(c => c.passed).length}/${debtRolloverCoverageBridge.checks.length}`
  });

  checks.push({
    id: 'CF107',
    label: 'Tax expenditure aligned with integrity forward',
    passed: taxExpenditureForwardCoherence.alignedWithIntegrityForwardBridge,
    detail: `forgone=${taxExp.totalForgone}, bridge=${revenueIntegrityForwardBridge.bridgeGapPoints}`
  });

  checks.push({
    id: 'CF108',
    label: 'Rollover coverage aligned with issuance coupling',
    passed: debtRolloverCoverageBridge.alignedWithIssuanceCoupling,
    detail: `stress=${debtRollover.liquidityStress}, coupling=${sovereignIssuanceCouplingBridge.bridgeCouplingGapPoints}`
  });

  checks.push({
    id: 'CF109',
    label: 'Contingency forward coherence within band',
    passed: contingencyForwardCoherence.withinContingencyForwardBand || v1012.pressure === 'critical',
    detail: `gap=${contingencyForwardCoherence.aggregateCoherenceGapPoints}, checks=${contingencyForwardCoherence.checks.filter(c => c.passed).length}/${contingencyForwardCoherence.checks.length}`
  });

  checks.push({
    id: 'CF110',
    label: 'Appropriation warrant fiscal bridge within band',
    passed: appropriationWarrantFiscalBridge.withinWarrantFiscalBand || v1012.pressure === 'critical',
    detail: `gap=${appropriationWarrantFiscalBridge.bridgeGapPoints}, checks=${appropriationWarrantFiscalBridge.checks.filter(c => c.passed).length}/${appropriationWarrantFiscalBridge.checks.length}`
  });

  checks.push({
    id: 'CF111',
    label: 'Contingency forward aligned with fiscal buffer',
    passed: contingencyForwardCoherence.alignedWithFiscalBuffer,
    detail: `draw=${contingencyDrawdownRegister.aggregateDrawdownPoints}, buffer=${fiscalBufferCoherence.aggregateBufferPoints}`
  });

  checks.push({
    id: 'CF112',
    label: 'Warrant fiscal aligned with timing coherence',
    passed: appropriationWarrantFiscalBridge.alignedWithTimingCoherence,
    detail: `lapse=${warrantLedger.aggregateLapseRisk}, timing=${appropriationTimingCoherence.aggregateTimingGapPoints}`
  });

  checks.push({
    id: 'CF113',
    label: 'Efficiency offset forward coherence within band',
    passed: efficiencyOffsetForwardCoherence.withinEfficiencyOffsetForwardBand || v1012.pressure === 'critical',
    detail: `gap=${efficiencyOffsetForwardCoherence.aggregateCoherenceGapPoints}, checks=${efficiencyOffsetForwardCoherence.checks.filter(c => c.passed).length}/${efficiencyOffsetForwardCoherence.checks.length}`
  });

  checks.push({
    id: 'CF114',
    label: 'Intergovernmental statutory coherence within band',
    passed: intergovernmentalStatutoryCoherence.withinIgrStatutoryBand || v1012.pressure === 'critical',
    detail: `gap=${intergovernmentalStatutoryCoherence.aggregateCoherenceGapPoints}, checks=${intergovernmentalStatutoryCoherence.checks.filter(c => c.passed).length}/${intergovernmentalStatutoryCoherence.checks.length}`
  });

  checks.push({
    id: 'CF115',
    label: 'Efficiency offset aligned with revenue forward',
    passed: efficiencyOffsetForwardCoherence.alignedWithRevenueForward,
    detail: `realized=${efficiencyDividendRegister.aggregateRealizedPoints}, forward=${revenueForwardReconciliation.aggregateGapPoints}`
  });

  checks.push({
    id: 'CF116',
    label: 'IGR statutory aligned with grant pool',
    passed: intergovernmentalStatutoryCoherence.alignedWithGrantPool,
    detail: `residual=${igr.residualFederal}, grants=${igGrants.netFederalOutlay}`
  });

  checks.push({
    id: 'CF117',
    label: 'Portfolio outturn reprior bridge within band',
    passed: portfolioOutturnReprioritisationBridge.withinOutturnRepriorBand || v1012.pressure === 'critical',
    detail: `gap=${portfolioOutturnReprioritisationBridge.bridgeGapPoints}, checks=${portfolioOutturnReprioritisationBridge.checks.filter(c => c.passed).length}/${portfolioOutturnReprioritisationBridge.checks.length}`
  });

  checks.push({
    id: 'CF118',
    label: 'Tax sensitivity integrity coherence within band',
    passed: taxSensitivityIntegrityCoherence.withinTaxSensitivityIntegrityBand || v1012.pressure === 'critical',
    detail: `gap=${taxSensitivityIntegrityCoherence.aggregateCoherenceGapPoints}, checks=${taxSensitivityIntegrityCoherence.checks.filter(c => c.passed).length}/${taxSensitivityIntegrityCoherence.checks.length}`
  });

  checks.push({
    id: 'CF119',
    label: 'Outturn reprior aligned with reprior ledger',
    passed: portfolioOutturnReprioritisationBridge.alignedWithRepriorLedger,
    detail: `variance=${portfolioOutturn.aggregateVariancePoints}, reprior=${portfolioReprioritisationLedger.aggregateRealizedPoints}`
  });

  checks.push({
    id: 'CF120',
    label: 'Tax sensitivity aligned with integrity audit',
    passed: taxSensitivityIntegrityCoherence.alignedWithIntegrityAudit,
    detail: `uplift=${taxPolicySensitivity.modeledUpliftPoints}, auditGap=${revenueIntegrityAudit.aggregateDeltaGap}`
  });

  checks.push({
    id: 'CF121',
    label: 'Infrastructure stress envelope bridge within band',
    passed: infrastructureStressEnvelopeBridge.withinInfraStressEnvelopeBand || v1012.pressure === 'critical',
    detail: `gap=${infrastructureStressEnvelopeBridge.bridgeGapPoints}, checks=${infrastructureStressEnvelopeBridge.checks.filter(c => c.passed).length}/${infrastructureStressEnvelopeBridge.checks.length}`
  });

  checks.push({
    id: 'CF122',
    label: 'Budget neutral program coherence within band',
    passed: budgetNeutralProgramCoherence.withinNeutralProgramBand || v1012.pressure === 'critical',
    detail: `gap=${budgetNeutralProgramCoherence.aggregateCoherenceGapPoints}, checks=${budgetNeutralProgramCoherence.checks.filter(c => c.passed).length}/${budgetNeutralProgramCoherence.checks.length}`
  });

  checks.push({
    id: 'CF123',
    label: 'Infra stress aligned with envelope coherence',
    passed: infrastructureStressEnvelopeBridge.alignedWithEnvelopeCoherence,
    detail: `load=${infrastructureFiscalLoad.loadToCapacityRatio}, stress=${fiscalStress.worstHeadroomDelta}`
  });

  checks.push({
    id: 'CF124',
    label: 'Neutral program aligned with performance bridge',
    passed: budgetNeutralProgramCoherence.alignedWithPerformanceFiscalBridge,
    detail: `net=${budgetNeutralPackages.aggregateNetPoints}, bridge=${programPerformanceFiscalBridge.bridgeFeedbackGapPoints}`
  });

  const allPassed = checks.every(c => c.passed);
  return {
    schemaVersion: CONSOLIDATED_FISCAL_SCHEMA,
    turn,
    checks,
    allPassed,
    layerCount: 90
  };
}
