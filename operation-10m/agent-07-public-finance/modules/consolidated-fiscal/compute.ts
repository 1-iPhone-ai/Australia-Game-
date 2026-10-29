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

  const allPassed = checks.every(c => c.passed);
  return {
    schemaVersion: CONSOLIDATED_FISCAL_SCHEMA,
    turn,
    checks,
    allPassed,
    layerCount: 58
  };
}
