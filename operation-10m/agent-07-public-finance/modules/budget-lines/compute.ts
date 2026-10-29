import type { NationalBudgetEnvelope, V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import { APPROPRIATION_LINE_CATALOG, linesForCategory, normalizedWeights } from './catalog/appropriation-lines';
import type { CategoryBudgetBreakdown, DetailedBudgetPaper } from './types';
import { BUDGET_LINES_SCHEMA } from './types';

function varianceBand(
  allocated: number,
  committed: number,
  pressure: V1012FiscalSnapshot['pressure']
): CategoryBudgetBreakdown['subLines'][0]['varianceBand'] {
  const ratio = allocated > 0 ? committed / allocated : 0;
  if (ratio > 1.12) return 'blown';
  if (ratio > 1.02) return 'pressure';
  if (ratio < 0.55) return 'under';
  if (pressure === 'critical' && ratio > 0.95) return 'pressure';
  return 'on_track';
}

function buildCategoryBreakdown(
  envelopeLine: NationalBudgetEnvelope['lines'][0],
  v1012: V1012FiscalSnapshot
): CategoryBudgetBreakdown {
  const weights = normalizedWeights(envelopeLine.category);
  const items = linesForCategory(envelopeLine.category);
  const subLines = items.map(item => {
    const w = weights.get(item.id) ?? 0;
    const allocatedPoints = Math.max(0, Math.round(envelopeLine.allocatedPoints * w));
    const commitFactor = item.capital ? 0.42 : item.recurring ? 0.58 : 0.35;
    const pressureMult =
      v1012.pressure === 'critical' ? 1.45 : v1012.pressure === 'strained' ? 1.06 : 1;
    const committedPoints =
      v1012.pressure === 'critical'
        ? Math.round(allocatedPoints * 1.09)
        : Math.round(allocatedPoints * commitFactor * pressureMult);
    const forwardEstimateY1 = Math.round(allocatedPoints * (item.capital ? 0.85 : 1.02));
    const forwardEstimateY2 = Math.round(forwardEstimateY1 * (item.recurring ? 1.01 : 0.75));
    return {
      lineId: item.id,
      code: item.code,
      title: item.title,
      allocatedPoints,
      committedPoints,
      forwardEstimateY1,
      forwardEstimateY2,
      varianceBand: varianceBand(allocatedPoints, committedPoints, v1012.pressure),
      explanation: item.description
    };
  });

  const subtotalAllocated = subLines.reduce((s, l) => s + l.allocatedPoints, 0);
  const subtotalCommitted = subLines.reduce((s, l) => s + l.committedPoints, 0);
  const allocDrift = envelopeLine.allocatedPoints - subtotalAllocated;
  if (subLines.length > 0 && allocDrift !== 0) {
    subLines[subLines.length - 1]!.allocatedPoints += allocDrift;
    subLines[subLines.length - 1]!.varianceBand = varianceBand(
      subLines[subLines.length - 1]!.allocatedPoints,
      subLines[subLines.length - 1]!.committedPoints,
      v1012.pressure
    );
  }
  const subtotalAllocatedFixed = subLines.reduce((s, l) => s + l.allocatedPoints, 0);
  const linesBalanced = Math.abs(subtotalAllocatedFixed - envelopeLine.allocatedPoints) <= 1;

  return {
    category: envelopeLine.category,
    envelopeAllocated: envelopeLine.allocatedPoints,
    subLines,
    subtotalAllocated: subtotalAllocatedFixed,
    subtotalCommitted,
    linesBalanced
  };
}

export function buildDetailedBudgetPaper(
  v1012: V1012FiscalSnapshot,
  envelope: NationalBudgetEnvelope
): DetailedBudgetPaper {
  const categories = envelope.lines.map(line => buildCategoryBreakdown(line, v1012));
  const aggregateVarianceWarnings: string[] = [];

  for (const cat of categories) {
    if (!cat.linesBalanced) {
      aggregateVarianceWarnings.push(
        `${cat.category}: sub-lines sum ${cat.subtotalAllocated} vs envelope ${cat.envelopeAllocated}.`
      );
    }
    const blown = cat.subLines.filter(s => s.varianceBand === 'blown');
    if (blown.length) {
      aggregateVarianceWarnings.push(`${cat.category}: ${blown.length} sub-line(s) in blown variance.`);
    }
  }

  if (categories.every(c => c.subtotalCommitted > c.envelopeAllocated * 1.05)) {
    aggregateVarianceWarnings.push('Aggregate committed load exceeds envelope across all categories.');
  }

  return {
    schemaVersion: BUDGET_LINES_SCHEMA,
    fiscalYearLabel: envelope.fiscalYearLabel,
    turn: v1012.turn,
    categories,
    totalSubLines: APPROPRIATION_LINE_CATALOG.length,
    aggregateVarianceWarnings
  };
}

export function countAppropriationLines(): number {
  return APPROPRIATION_LINE_CATALOG.length;
}
