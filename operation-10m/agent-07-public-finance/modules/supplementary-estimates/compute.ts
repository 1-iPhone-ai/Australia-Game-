import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { SupplementaryEstimateLine, SupplementaryEstimatesReport } from './types';
import { SUPPLEMENTARY_ESTIMATES_SCHEMA } from './types';

const REVISION_TOLERANCE = 14;

function line(
  id: string,
  kind: SupplementaryEstimateLine['kind'],
  portfolioId: string,
  label: string,
  baselinePoints: number,
  revisionPoints: number,
  forwardCeiling: number
): SupplementaryEstimateLine {
  const netDeltaPoints = Math.round((revisionPoints - baselinePoints) * 10) / 10;
  return {
    id,
    kind,
    portfolioId,
    label,
    baselinePoints,
    revisionPoints,
    netDeltaPoints,
    withinForwardBand: Math.abs(netDeltaPoints) <= forwardCeiling
  };
}

export function buildSupplementaryEstimatesReport(turn: number, v1012: V1012FiscalSnapshot): SupplementaryEstimatesReport {
  const forwardCeiling =
    v1012.pressure === 'critical' ? REVISION_TOLERANCE * 2 : v1012.pressure === 'strained' ? REVISION_TOLERANCE * 1.35 : REVISION_TOLERANCE;

  const parameterDrift = Math.round((v1012.maintenanceLoad * 0.15 + Math.max(0, 6 - v1012.fiscalHeadroom) * 0.25) * 10) / 10;
  const decisionUplift = turn % 12 >= 6 ? Math.round(v1012.revenueCapacity * 0.012 * 10) / 10 : 0;
  const savingsReprioritisation = v1012.fiscalHeadroom < 0 ? Math.round(Math.abs(v1012.fiscalHeadroom) * 0.35 * 10) / 10 : 0;

  const lines: SupplementaryEstimateLine[] = [
    line('sup_health', 'myefo', 'health', 'Health parameter variation', 42, 42 + parameterDrift, forwardCeiling),
    line('sup_education', 'myefo', 'education', 'Schools cost index', 28, 28 + parameterDrift * 0.6, forwardCeiling),
    line(
      'sup_defence',
      'additional_estimates',
      'defence',
      'Capability acceleration',
      18,
      18 + decisionUplift,
      forwardCeiling
    ),
    line(
      'sup_infrastructure',
      'decision_variation',
      'infrastructure',
      'Pipeline reprioritisation',
      22,
      22 + decisionUplift * 0.5 - savingsReprioritisation * 0.4,
      forwardCeiling
    ),
    line(
      'sup_social',
      'myefo',
      'social',
      'Demand-driven revision',
      35,
      35 + parameterDrift * 0.45 - savingsReprioritisation * 0.25,
      forwardCeiling
    )
  ];

  let aggregateUpwardRevision = 0;
  let aggregateDownwardRevision = 0;
  for (const l of lines) {
    if (l.netDeltaPoints > 0) aggregateUpwardRevision += l.netDeltaPoints;
    if (l.netDeltaPoints < 0) aggregateDownwardRevision += Math.abs(l.netDeltaPoints);
  }
  aggregateUpwardRevision = Math.round(aggregateUpwardRevision * 10) / 10;
  aggregateDownwardRevision = Math.round(aggregateDownwardRevision * 10) / 10;
  const netRevisionPoints = Math.round((aggregateUpwardRevision - aggregateDownwardRevision) * 10) / 10;

  const withinRevisionTolerance =
    Math.abs(netRevisionPoints) <= forwardCeiling || v1012.pressure === 'critical' || lines.every(l => l.withinForwardBand);

  const warnings: string[] = [];
  if (!withinRevisionTolerance) {
    warnings.push(`Net supplementary revision ${netRevisionPoints} exceeds tolerance ${forwardCeiling}.`);
  }
  for (const l of lines.filter(x => !x.withinForwardBand)) {
    warnings.push(`${l.label} delta ${l.netDeltaPoints} outside forward band.`);
  }

  const narrative = withinRevisionTolerance
    ? `Supplementary estimates net ${netRevisionPoints} within ${forwardCeiling} tolerance across ${lines.length} lines.`
    : `Supplementary estimates alert: net revision ${netRevisionPoints}, tolerance ${forwardCeiling}.`;

  return {
    schemaVersion: SUPPLEMENTARY_ESTIMATES_SCHEMA,
    turn,
    lines,
    aggregateUpwardRevision,
    aggregateDownwardRevision,
    netRevisionPoints,
    withinRevisionTolerance,
    narrative,
    warnings
  };
}
