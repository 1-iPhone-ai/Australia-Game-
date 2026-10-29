import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { PortfolioOutturnLine, PortfolioOutturnReport } from './types';
import { PORTFOLIO_OUTTURN_SCHEMA } from './types';

const AGGREGATE_VARIANCE_CAP = 0.11;
const PORTFOLIO_BAND = 0.14;

function outturnLine(
  id: string,
  portfolioId: string,
  label: string,
  baseline: number,
  drift: number
): PortfolioOutturnLine {
  const outturnPoints = Math.round((baseline + drift) * 10) / 10;
  const variancePoints = Math.round((outturnPoints - baseline) * 10) / 10;
  const varianceRatio = baseline <= 0 ? 0 : Math.round((variancePoints / baseline) * 1000) / 1000;
  const withinPortfolioBand =
    Math.abs(varianceRatio) <= PORTFOLIO_BAND || baseline <= 0;
  return {
    id,
    portfolioId,
    label,
    appropriationBaselinePoints: baseline,
    outturnPoints,
    variancePoints,
    varianceRatio,
    withinPortfolioBand
  };
}

export function buildPortfolioOutturnReport(turn: number, v1012: V1012FiscalSnapshot): PortfolioOutturnReport {
  const yearEnd = turn % 12 >= 11;
  const maintenanceDrift = (v1012.maintenanceLoad - 7) * 0.08;
  const headroomDrift = Math.max(-2.5, Math.min(2.2, v1012.fiscalHeadroom * 0.06));
  const debtDrift = v1012.debtEnabled ? v1012.debtServiceLoad * 0.04 : 0;

  const raw: Array<[string, string, string, number, number]> = [
    ['po_health', 'pf_health', 'Health & aged care', 18.5, maintenanceDrift * 0.35 + headroomDrift * 0.2],
    ['po_education', 'pf_education', 'Education & skills', 14.2, headroomDrift * 0.15 - 0.2],
    ['po_defence', 'pf_defence', 'Defence & national security', 16.8, debtDrift * 0.45 + (yearEnd ? 0.35 : 0)],
    ['po_infra', 'pf_infra', 'Infrastructure & transport', 11.4, maintenanceDrift * 0.55 + headroomDrift * 0.1],
    ['po_social', 'pf_social', 'Social security & welfare', 21.6, maintenanceDrift * 0.25 - headroomDrift * 0.12]
  ];

  let lines: PortfolioOutturnLine[] = raw.map(([id, pf, label, base, drift]) =>
    outturnLine(id, pf, label, base, Math.round(drift * 10) / 10)
  );

  if (v1012.pressure !== 'critical') {
    for (const line of lines) {
      if (!line.withinPortfolioBand && line.appropriationBaselinePoints > 0) {
        const cap = line.appropriationBaselinePoints * PORTFOLIO_BAND;
        line.outturnPoints =
          Math.round((line.appropriationBaselinePoints + Math.sign(line.variancePoints) * cap) * 10) / 10;
        line.variancePoints = Math.round((line.outturnPoints - line.appropriationBaselinePoints) * 10) / 10;
        line.varianceRatio =
          Math.round((line.variancePoints / line.appropriationBaselinePoints) * 1000) / 1000;
        line.withinPortfolioBand = Math.abs(line.varianceRatio) <= PORTFOLIO_BAND + 0.001;
      }
    }
  }

  const totalBaseline = lines.reduce((s, l) => s + l.appropriationBaselinePoints, 0);
  const totalOutturn = lines.reduce((s, l) => s + l.outturnPoints, 0);
  const aggregateVariancePoints = Math.round((totalOutturn - totalBaseline) * 10) / 10;
  const aggregateVarianceRatio =
    totalBaseline <= 0 ? 0 : Math.round((aggregateVariancePoints / totalBaseline) * 1000) / 1000;

  const portfoliosOutsideBand = lines.filter(l => !l.withinPortfolioBand).length;

  const withinReconciliationTolerance =
    Math.abs(aggregateVarianceRatio) <= AGGREGATE_VARIANCE_CAP ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && Math.abs(aggregateVarianceRatio) <= AGGREGATE_VARIANCE_CAP * 1.15);

  const warnings: string[] = [];
  if (portfoliosOutsideBand > 0) {
    warnings.push(`${portfoliosOutsideBand} portfolio(s) outside outturn band.`);
  }
  if (!withinReconciliationTolerance) {
    warnings.push(`Aggregate variance ratio ${aggregateVarianceRatio} exceeds cap ${AGGREGATE_VARIANCE_CAP}.`);
  }

  const narrative = withinReconciliationTolerance
    ? `Portfolio outturn reconciled: aggregate variance ${aggregateVariancePoints} (${(aggregateVarianceRatio * 100).toFixed(1)}%).`
    : `Outturn reconciliation alert: variance ${aggregateVariancePoints}, ${portfoliosOutsideBand} portfolio(s) off band.`;

  return {
    schemaVersion: PORTFOLIO_OUTTURN_SCHEMA,
    turn,
    lines,
    aggregateVariancePoints,
    aggregateVarianceRatio,
    withinReconciliationTolerance,
    portfoliosOutsideBand,
    narrative,
    warnings
  };
}
