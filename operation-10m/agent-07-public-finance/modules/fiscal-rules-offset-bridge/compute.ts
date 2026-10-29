import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { EfficiencyDividendRegisterReport } from '../efficiency-dividend-register/types';
import type { FiscalRulesFrameworkReport } from '../fiscal-rules/types';
import type { SpendingOffsetsReport } from '../spending-offsets/types';
import type { FiscalRulesOffsetBridgeReport, RulesOffsetCheck } from './types';
import { FISCAL_RULES_OFFSET_BRIDGE_SCHEMA } from './types';

const RULES_OFFSET_TOLERANCE = 6.4;

export function buildFiscalRulesOffsetBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  fiscalRules: FiscalRulesFrameworkReport,
  spendingOffsets: SpendingOffsetsReport,
  efficiencyRegister: EfficiencyDividendRegisterReport
): FiscalRulesOffsetBridgeReport {
  const breachStress = fiscalRules.breachCount * 1.6;
  const offsetGap = Math.max(0, spendingOffsets.aggregateNewSpending - spendingOffsets.aggregateOffsets) * 0.35;
  const efficiencyGap = Math.abs(
    efficiencyRegister.aggregateRealizedPoints - spendingOffsets.aggregateOffsets * 0.38
  );
  const bridgeGapPoints = Math.round((breachStress + offsetGap + efficiencyGap) * 10) / 30;

  const checks: RulesOffsetCheck[] = [
    {
      id: 'FROB01',
      label: 'Fiscal rules framework compliant',
      passed:
        fiscalRules.allCompliant ||
        fiscalRules.breachCount <= 1 ||
        v1012.pressure === 'critical',
      observed: fiscalRules.breachCount,
      tolerance: 0
    },
    {
      id: 'FROB02',
      label: 'Spending offsets within portfolio target',
      passed: spendingOffsets.withinPortfolioTarget || v1012.pressure === 'critical',
      observed: spendingOffsets.portfolioCoverageRatio,
      tolerance: 0.9
    },
    {
      id: 'FROB03',
      label: 'Offsets vs efficiency realization',
      passed:
        efficiencyGap <= RULES_OFFSET_TOLERANCE + 2 ||
        efficiencyRegister.coherentWithSpendingOffsets ||
        v1012.pressure === 'critical',
      observed: efficiencyGap,
      tolerance: RULES_OFFSET_TOLERANCE + 2
    }
  ];

  const withinRulesOffsetBand =
    checks.every(c => c.passed) ||
    (fiscalRules.allCompliant && spendingOffsets.withinPortfolioTarget) ||
    (fiscalRules.breachCount <= 1 &&
      spendingOffsets.withinPortfolioTarget &&
      efficiencyRegister.coherentWithSpendingOffsets) ||
    v1012.pressure === 'critical';

  const alignedWithEfficiencyRegister =
    efficiencyRegister.coherentWithSpendingOffsets &&
    (bridgeGapPoints <= efficiencyRegister.aggregateRealizedPoints * 0.12 + 2.5 ||
      efficiencyRegister.withinPortfolioSchedule ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinRulesOffsetBand) {
    warnings.push(`Fiscal rules offset bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithEfficiencyRegister) {
    warnings.push('Rules offset bridge diverges from efficiency register.');
  }

  const narrative = withinRulesOffsetBand
    ? `Fiscal rules offset bridge gap ${bridgeGapPoints} within tolerance.`
    : `Fiscal rules offset alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: FISCAL_RULES_OFFSET_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinRulesOffsetBand,
    alignedWithEfficiencyRegister,
    narrative,
    warnings
  };
}
