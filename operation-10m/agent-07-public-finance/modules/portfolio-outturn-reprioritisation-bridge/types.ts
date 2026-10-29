export const PORTFOLIO_OUTTURN_REPRIORITISATION_BRIDGE_SCHEMA =
  'op10m-agent07-portfolio-outturn-reprioritisation-bridge-v1';

export interface OutturnRepriorCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface PortfolioOutturnReprioritisationBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: OutturnRepriorCheck[];
  bridgeGapPoints: number;
  withinOutturnRepriorBand: boolean;
  alignedWithRepriorLedger: boolean;
  narrative: string;
  warnings: string[];
}
