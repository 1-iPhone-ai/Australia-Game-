import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { FiscalTransparencyIndex, TransparencyDimensionScore, TransparencyTier } from './types';
import { FISCAL_TRANSPARENCY_SCHEMA } from './types';

function tierFromScore(score: number, max: number): TransparencyTier {
  const ratio = score / max;
  if (ratio >= 0.85) return 'leading';
  if (ratio >= 0.65) return 'enhanced';
  return 'basic';
}

export interface FiscalTransparencyInputs {
  turn: number;
  v1012: V1012FiscalSnapshot;
  publishesTaxExpenditure: boolean;
  publishesMultiYearEstimates: boolean;
  publishesContingentRegister: boolean;
  publishesProgramOutcomes: boolean;
  auditLagTurns: number;
}

export function scoreFiscalTransparencyIndex(inputs: FiscalTransparencyInputs): FiscalTransparencyIndex {
  const { v1012, turn } = inputs;
  const dimensions: TransparencyDimensionScore[] = [];

  const budgetOpenness = Math.min(
    25,
    12 +
      (inputs.publishesMultiYearEstimates ? 6 : 0) +
      (v1012.fiscalHeadroom >= 0 ? 4 : 0) +
      (inputs.auditLagTurns <= 2 ? 3 : 0)
  );
  dimensions.push({
    id: 'budget_openness',
    label: 'Budget papers & forward estimates',
    score: budgetOpenness,
    maxScore: 25,
    tier: tierFromScore(budgetOpenness, 25),
    detail: `MYEFO=${inputs.publishesMultiYearEstimates}, auditLag=${inputs.auditLagTurns}`
  });

  const taxTransparency = Math.min(
    20,
    8 + (inputs.publishesTaxExpenditure ? 10 : 0) + (v1012.revenuePolicy !== 'growth_focused' ? 2 : 0)
  );
  dimensions.push({
    id: 'tax_transparency',
    label: 'Tax expenditure & revenue disclosure',
    score: taxTransparency,
    maxScore: 20,
    tier: tierFromScore(taxTransparency, 20),
    detail: `taxExp=${inputs.publishesTaxExpenditure}`
  });

  const riskDisclosure = Math.min(
    20,
    6 +
      (inputs.publishesContingentRegister ? 9 : 0) +
      (v1012.debtEnabled ? 3 : 0) +
      (v1012.pressure !== 'critical' ? 2 : 0)
  );
  dimensions.push({
    id: 'risk_disclosure',
    label: 'Contingent liabilities & fiscal risks',
    score: riskDisclosure,
    maxScore: 20,
    tier: tierFromScore(riskDisclosure, 20),
    detail: `contingent=${inputs.publishesContingentRegister}`
  });

  const performanceReporting = Math.min(
    20,
    7 + (inputs.publishesProgramOutcomes ? 11 : 0) + (v1012.commitmentCount <= 8 ? 2 : 0)
  );
  dimensions.push({
    id: 'performance_reporting',
    label: 'Program outcomes & service delivery',
    score: performanceReporting,
    maxScore: 20,
    tier: tierFromScore(performanceReporting, 20),
    detail: `programs=${inputs.publishesProgramOutcomes}`
  });

  const dataAccess = Math.min(15, 5 + (inputs.auditLagTurns <= 1 ? 5 : 2) + (inputs.publishesTaxExpenditure ? 3 : 0));
  dimensions.push({
    id: 'open_data',
    label: 'Open fiscal data readiness',
    score: dataAccess,
    maxScore: 15,
    tier: tierFromScore(dataAccess, 15),
    detail: `lag=${inputs.auditLagTurns}`
  });

  const compositeScore = dimensions.reduce((s, d) => s + d.score, 0);
  const compositeTier = tierFromScore(compositeScore, 100);
  const openDataReady = dataAccess >= 10 && inputs.publishesMultiYearEstimates;

  const improvementActions: string[] = [];
  if (!inputs.publishesContingentRegister) {
    improvementActions.push('Publish contingent liability register alongside budget papers.');
  }
  if (!inputs.publishesProgramOutcomes) {
    improvementActions.push('Link appropriation lines to program outcome dashboards.');
  }
  if (inputs.auditLagTurns > 2) {
    improvementActions.push('Reduce audit publication lag to within two turns.');
  }
  if (compositeTier === 'basic') {
    improvementActions.push('Adopt enhanced tier checklist for tax expenditure and MYEFO tables.');
  }

  return {
    schemaVersion: FISCAL_TRANSPARENCY_SCHEMA,
    turn,
    dimensions,
    compositeScore,
    compositeTier,
    openDataReady,
    improvementActions
  };
}
