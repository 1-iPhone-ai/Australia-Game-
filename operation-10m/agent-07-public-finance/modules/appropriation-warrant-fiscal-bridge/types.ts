export const APPROPRIATION_WARRANT_FISCAL_BRIDGE_SCHEMA =
  'op10m-agent07-appropriation-warrant-fiscal-bridge-v1';

export interface WarrantFiscalCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface AppropriationWarrantFiscalBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: WarrantFiscalCheck[];
  bridgeGapPoints: number;
  withinWarrantFiscalBand: boolean;
  alignedWithTimingCoherence: boolean;
  narrative: string;
  warnings: string[];
}
