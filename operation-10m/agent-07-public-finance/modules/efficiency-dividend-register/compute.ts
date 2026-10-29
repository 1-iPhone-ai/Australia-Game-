import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { FiscalRulesFrameworkReport } from '../fiscal-rules/types';
import type { SpendingOffsetsReport } from '../spending-offsets/types';
import type { EfficiencyDividendLine, EfficiencyDividendRegisterReport } from './types';
import { EFFICIENCY_DIVIDEND_REGISTER_SCHEMA } from './types';

const PORTFOLIO_SCHEDULE_CAP = 0.88;

export function buildEfficiencyDividendRegisterReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  spendingOffsets: SpendingOffsetsReport,
  fiscalRules: FiscalRulesFrameworkReport
): EfficiencyDividendRegisterReport {
  const efficiencyLines = spendingOffsets.lines.filter(l => l.kind === 'efficiency_dividend');
  const repriorLines = spendingOffsets.lines.filter(l => l.kind === 'program_reprioritisation');

  const combined = [...efficiencyLines, ...repriorLines.slice(0, 1)];
  const realizationDrag =
    fiscalRules.breachCount > 0 ? 0.92 : v1012.pressure === 'strained' ? 0.94 : 0.98;
  const electionWindow = turn % 12 >= 9;
  const electionBoost = electionWindow ? 1.04 : 1;

  const lines: EfficiencyDividendLine[] = combined.map(line => {
    const scheduledPoints = Math.round(line.offsetPoints * electionBoost * 10) / 10;
    const realizedPoints = Math.round(scheduledPoints * realizationDrag * 10) / 10;
    const realizationRatio =
      scheduledPoints <= 0 ? 1 : Math.round((realizedPoints / scheduledPoints) * 100) / 100;
    const withinLineSchedule =
      realizationRatio >= PORTFOLIO_SCHEDULE_CAP - 0.08 ||
      line.fullyOffset ||
      v1012.pressure === 'critical';
    return {
      id: `edr_${line.id}`,
      label: line.label,
      scheduledPoints,
      realizedPoints,
      realizationRatio,
      withinLineSchedule
    };
  });

  let aggregateScheduledPoints = Math.round(lines.reduce((s, l) => s + l.scheduledPoints, 0) * 10) / 10;
  let aggregateRealizedPoints = Math.round(lines.reduce((s, l) => s + l.realizedPoints, 0) * 10) / 10;

  const offsetEfficiencyPool = spendingOffsets.lines
    .filter(l => l.kind === 'efficiency_dividend')
    .reduce((s, l) => s + l.offsetPoints, 0);

  if (v1012.pressure !== 'critical' && aggregateScheduledPoints > 0) {
    const maxScheduled = Math.max(offsetEfficiencyPool * 1.15, spendingOffsets.aggregateOffsets * 0.35);
    if (aggregateScheduledPoints > maxScheduled) {
      const scale = maxScheduled / aggregateScheduledPoints;
      for (const line of lines) {
        line.scheduledPoints = Math.round(line.scheduledPoints * scale * 10) / 10;
        line.realizedPoints = Math.round(line.realizedPoints * scale * 10) / 10;
        line.realizationRatio =
          line.scheduledPoints <= 0
            ? 1
            : Math.round((line.realizedPoints / line.scheduledPoints) * 100) / 100;
      }
      aggregateScheduledPoints = Math.round(lines.reduce((s, l) => s + l.scheduledPoints, 0) * 10) / 10;
      aggregateRealizedPoints = Math.round(lines.reduce((s, l) => s + l.realizedPoints, 0) * 10) / 10;
    }
  }

  const scheduleToRealizationRatio =
    aggregateScheduledPoints <= 0
      ? 1
      : Math.round((aggregateRealizedPoints / aggregateScheduledPoints) * 100) / 100;

  const withinPortfolioSchedule =
    scheduleToRealizationRatio >= PORTFOLIO_SCHEDULE_CAP ||
    spendingOffsets.withinPortfolioTarget ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && scheduleToRealizationRatio >= PORTFOLIO_SCHEDULE_CAP * 0.94);

  const coherentWithSpendingOffsets =
    aggregateRealizedPoints <= spendingOffsets.aggregateOffsets + 1.2 &&
    (Math.abs(aggregateScheduledPoints - offsetEfficiencyPool) <= offsetEfficiencyPool * 0.22 + 1 ||
      spendingOffsets.withinPortfolioTarget ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinPortfolioSchedule) {
    warnings.push(
      `Realization ratio ${scheduleToRealizationRatio} below schedule cap ${PORTFOLIO_SCHEDULE_CAP}.`
    );
  }
  if (!coherentWithSpendingOffsets) {
    warnings.push('Efficiency dividend register diverges from spending-offset portfolio.');
  }

  const narrative = withinPortfolioSchedule
    ? `Efficiency dividend realization ${scheduleToRealizationRatio} on ${aggregateScheduledPoints} scheduled.`
    : `Efficiency dividend alert: realization ${scheduleToRealizationRatio}.`;

  return {
    schemaVersion: EFFICIENCY_DIVIDEND_REGISTER_SCHEMA,
    turn,
    lines,
    aggregateScheduledPoints,
    aggregateRealizedPoints,
    scheduleToRealizationRatio,
    withinPortfolioSchedule,
    coherentWithSpendingOffsets,
    narrative,
    warnings
  };
}
