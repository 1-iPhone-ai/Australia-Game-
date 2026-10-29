export const PORTFOLIO_OUTTURN_SCHEMA = 'op10m-agent07-portfolio-outturn-v1';

export interface PortfolioOutturnLine {
  id: string;
  portfolioId: string;
  label: string;
  appropriationBaselinePoints: number;
  outturnPoints: number;
  variancePoints: number;
  varianceRatio: number;
  withinPortfolioBand: boolean;
}

export interface PortfolioOutturnReport {
  schemaVersion: string;
  turn: number;
  lines: PortfolioOutturnLine[];
  aggregateVariancePoints: number;
  aggregateVarianceRatio: number;
  withinReconciliationTolerance: boolean;
  portfoliosOutsideBand: number;
  narrative: string;
  warnings: string[];
}
