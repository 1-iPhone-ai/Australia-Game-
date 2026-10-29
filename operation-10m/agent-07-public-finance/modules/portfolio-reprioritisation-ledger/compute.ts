import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { EfficiencyDividendRegisterReport } from '../efficiency-dividend-register/types';
import type { PortfolioOutturnReport } from '../portfolio-outturn/types';
import type { SpendingOffsetsReport } from '../spending-offsets/types';
import type { PortfolioReprioritisationLedgerReport, ReprioritisationLine } from './types';
import { PORTFOLIO_REPRIORITISATION_LEDGER_SCHEMA } from './types';

const ENVELOPE_REALIZATION_CAP = 0.9;

export function buildPortfolioReprioritisationLedgerReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  spendingOffsets: SpendingOffsetsReport,
  portfolioOutturn: PortfolioOutturnReport,
  efficiencyDividend: EfficiencyDividendRegisterReport
): PortfolioReprioritisationLedgerReport {
  const repriorLines = spendingOffsets.lines.filter(l => l.kind === 'program_reprioritisation');
  const realizationDrag =
    portfolioOutturn.withinReconciliationTolerance ? 0.97 : v1012.pressure === 'strained' ? 0.91 : 0.94;

  const lines: ReprioritisationLine[] = repriorLines.map(line => {
    const plannedShiftPoints = Math.round(line.offsetPoints * 10) / 10;
    const realizedShiftPoints = Math.round(plannedShiftPoints * realizationDrag * 10) / 10;
    const withinLineEnvelope =
      realizedShiftPoints <= plannedShiftPoints + 0.8 ||
      line.fullyOffset ||
      v1012.pressure === 'critical';
    return {
      id: `prl_${line.id}`,
      label: line.label,
      plannedShiftPoints,
      realizedShiftPoints,
      withinLineEnvelope
    };
  });

  let aggregatePlannedPoints = Math.round(lines.reduce((s, l) => s + l.plannedShiftPoints, 0) * 10) / 10;
  let aggregateRealizedPoints = Math.round(lines.reduce((s, l) => s + l.realizedShiftPoints, 0) * 10) / 10;

  if (lines.length === 0) {
    aggregatePlannedPoints = Math.round(spendingOffsets.aggregateOffsets * 0.12 * 10) / 10;
    aggregateRealizedPoints = Math.round(aggregatePlannedPoints * realizationDrag * 10) / 10;
    lines.push({
      id: 'prl_synthetic',
      label: 'Synthetic reprioritisation probe',
      plannedShiftPoints: aggregatePlannedPoints,
      realizedShiftPoints: aggregateRealizedPoints,
      withinLineEnvelope: true
    });
  }

  const realizationRatio =
    aggregatePlannedPoints <= 0
      ? 1
      : Math.round((aggregateRealizedPoints / aggregatePlannedPoints) * 100) / 100;

  const withinPortfolioEnvelope =
    realizationRatio >= ENVELOPE_REALIZATION_CAP ||
    spendingOffsets.withinPortfolioTarget ||
    portfolioOutturn.withinReconciliationTolerance ||
    v1012.pressure === 'critical';

  const alignedWithEfficiencyDividend =
    Math.abs(aggregateRealizedPoints - efficiencyDividend.aggregateRealizedPoints * 0.35) <=
      Math.max(2.5, efficiencyDividend.aggregateRealizedPoints * 0.28) ||
    efficiencyDividend.coherentWithSpendingOffsets ||
    v1012.pressure === 'critical';

  const warnings: string[] = [];
  if (!withinPortfolioEnvelope) {
    warnings.push(`Reprior realization ${realizationRatio} below envelope cap ${ENVELOPE_REALIZATION_CAP}.`);
  }
  if (!alignedWithEfficiencyDividend) {
    warnings.push('Portfolio reprioritisation ledger diverges from efficiency dividend register.');
  }

  const narrative = withinPortfolioEnvelope
    ? `Portfolio reprioritisation ${aggregateRealizedPoints}/${aggregatePlannedPoints} within envelope.`
    : `Reprior alert: realized ${aggregateRealizedPoints} vs planned ${aggregatePlannedPoints}.`;

  return {
    schemaVersion: PORTFOLIO_REPRIORITISATION_LEDGER_SCHEMA,
    turn,
    lines,
    aggregatePlannedPoints,
    aggregateRealizedPoints,
    withinPortfolioEnvelope,
    alignedWithEfficiencyDividend,
    narrative,
    warnings
  };
}
