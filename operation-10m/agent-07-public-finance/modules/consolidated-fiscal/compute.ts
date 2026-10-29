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

  const allPassed = checks.every(c => c.passed);
  return {
    schemaVersion: CONSOLIDATED_FISCAL_SCHEMA,
    turn,
    checks,
    allPassed,
    layerCount: 12
  };
}
