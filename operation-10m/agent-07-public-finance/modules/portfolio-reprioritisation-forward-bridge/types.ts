export const PORTFOLIO_REPRIORITISATION_FORWARD_BRIDGE_SCHEMA =
  'op10m-agent07-portfolio-reprioritisation-forward-bridge-v1';

export interface RepriorForwardCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface PortfolioReprioritisationForwardBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: RepriorForwardCheck[];
  bridgeGapPoints: number;
  withinRepriorForwardBand: boolean;
  alignedWithPortfolioOutturn: boolean;
  narrative: string;
  warnings: string[];
}
