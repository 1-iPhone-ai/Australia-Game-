export const APPROPRIATION_CARRY_TIMING_BRIDGE_SCHEMA =
  'op10m-agent07-appropriation-carry-timing-bridge-v1';

export interface CarryTimingCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface AppropriationCarryTimingBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: CarryTimingCheck[];
  bridgeGapPoints: number;
  withinAppropriationCarryTimingBand: boolean;
  alignedWithRevenueForward: boolean;
  narrative: string;
  warnings: string[];
}
