export const TRANSPARENCY_PROGRAM_FORWARD_BRIDGE_SCHEMA =
  'op10m-agent07-transparency-program-forward-bridge-v1';

export interface TransparencyProgramCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface TransparencyProgramForwardBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: TransparencyProgramCheck[];
  bridgeGapPoints: number;
  withinTransparencyProgramBand: boolean;
  alignedWithForwardCoherence: boolean;
  narrative: string;
  warnings: string[];
}
