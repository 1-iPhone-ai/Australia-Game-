import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { SpendingOffsetLine, SpendingOffsetsReport } from './types';
import { SPENDING_OFFSETS_SCHEMA } from './types';

const PORTFOLIO_COVERAGE_FLOOR = 0.72;

function offsetLine(
  id: string,
  kind: SpendingOffsetLine['kind'],
  label: string,
  newSpendingPoints: number,
  offsetPoints: number
): SpendingOffsetLine {
  const coverageRatio = newSpendingPoints <= 0 ? 1 : Math.min(1.5, Math.round((offsetPoints / newSpendingPoints) * 100) / 100);
  return {
    id,
    kind,
    label,
    newSpendingPoints,
    offsetPoints,
    coverageRatio,
    fullyOffset: offsetPoints >= newSpendingPoints - 0.05
  };
}

export function buildSpendingOffsetsReport(turn: number, v1012: V1012FiscalSnapshot): SpendingOffsetsReport {
  const electionWindow = turn % 12 >= 9;
  const headroomPenalty = Math.max(0, 4 - v1012.fiscalHeadroom) * 0.15;
  const newMeasureLoad =
    Math.round((2.4 + (electionWindow ? 1.4 : 0) + headroomPenalty) * 10) / 10;

  const efficiencyPool = Math.round((v1012.revenueCapacity * 0.022 + v1012.maintenanceLoad * 0.14) * 10) / 10;
  const reprioritisation = Math.round((efficiencyPool * 0.65 + Math.max(0, -v1012.fiscalHeadroom) * 0.25) * 10) / 10;
  const revenueOffset = Math.round((efficiencyPool * (v1012.revenuePolicy === 'expansionary' ? 0.35 : 0.5)) * 10) / 10;
  const phasingRelief = Math.round(newMeasureLoad * (electionWindow ? 0.42 : 0.22) * 10) / 10;

  const rawLines: Array<[string, SpendingOffsetLine['kind'], string, number, number]> = [
    ['off_health_pkg', 'program_reprioritisation', 'Primary care package', newMeasureLoad * 1.05, reprioritisation * 0.95],
    ['off_skills', 'efficiency_dividend', 'Skills guarantee', newMeasureLoad * 0.9, efficiencyPool * 0.85],
    ['off_energy', 'delay_phasing', 'Clean industry grants', newMeasureLoad * 1.15, phasingRelief + reprioritisation * 0.45],
    ['off_tax_interaction', 'revenue_measure', 'Integrity & compliance dividend', newMeasureLoad * 0.75, revenueOffset],
    [
      'off_defence_readiness',
      'program_repriorisation',
      'Readiness uplift',
      newMeasureLoad * 0.88,
      reprioritisation * 0.8 + efficiencyPool * 0.35
    ]
  ];

  const lines: SpendingOffsetLine[] = rawLines.map(([id, kind, label, spend, offset]) =>
    offsetLine(id, kind, label, Math.round(spend * 10) / 10, Math.round(offset * 10) / 10)
  );

  let aggregateNewSpending = Math.round(lines.reduce((s, l) => s + l.newSpendingPoints, 0) * 10) / 10;
  let aggregateOffsets = Math.round(lines.reduce((s, l) => s + l.offsetPoints, 0) * 10) / 10;

  if (v1012.pressure !== 'critical' && aggregateNewSpending > 0) {
    const targetCoverage =
      v1012.pressure === 'strained' ? PORTFOLIO_COVERAGE_FLOOR * 0.92 : PORTFOLIO_COVERAGE_FLOOR + 0.04;
    const requiredOffsets = Math.round(aggregateNewSpending * targetCoverage * 10) / 10;
    if (aggregateOffsets < requiredOffsets) {
      const scale = requiredOffsets / Math.max(0.1, aggregateOffsets);
      for (const line of lines) {
        line.offsetPoints = Math.round(line.offsetPoints * scale * 10) / 10;
        line.coverageRatio =
          line.newSpendingPoints <= 0 ? 1 : Math.min(1.5, Math.round((line.offsetPoints / line.newSpendingPoints) * 100) / 100);
        line.fullyOffset = line.offsetPoints >= line.newSpendingPoints - 0.05;
      }
      aggregateOffsets = Math.round(lines.reduce((s, l) => s + l.offsetPoints, 0) * 10) / 10;
    }
  }

  const portfolioCoverageRatio =
    aggregateNewSpending <= 0 ? 1 : Math.round((aggregateOffsets / aggregateNewSpending) * 100) / 100;

  const withinPortfolioTarget =
    portfolioCoverageRatio >= PORTFOLIO_COVERAGE_FLOOR ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && portfolioCoverageRatio >= PORTFOLIO_COVERAGE_FLOOR * 0.9);

  const warnings: string[] = [];
  if (!withinPortfolioTarget) {
    warnings.push(`Portfolio coverage ${portfolioCoverageRatio} below floor ${PORTFOLIO_COVERAGE_FLOOR}.`);
  }
  for (const l of lines.filter(x => !x.fullyOffset && x.newSpendingPoints > 2)) {
    warnings.push(`${l.label} coverage ${l.coverageRatio}.`);
  }

  const narrative = withinPortfolioTarget
    ? `Spending offsets cover ${portfolioCoverageRatio} of ${aggregateNewSpending} new measures.`
    : `Offset shortfall: coverage ${portfolioCoverageRatio}, new spending ${aggregateNewSpending}.`;

  return {
    schemaVersion: SPENDING_OFFSETS_SCHEMA,
    turn,
    lines,
    aggregateNewSpending,
    aggregateOffsets,
    portfolioCoverageRatio,
    withinPortfolioTarget,
    narrative,
    warnings
  };
}
