export const STATUTORY_OUTLOOK_BUFFER_BRIDGE_SCHEMA =
  'op10m-agent07-statutory-outlook-buffer-bridge-v1';

export interface StatutoryOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface StatutoryOutlookBufferBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: StatutoryOutlookCheck[];
  bridgeGapPoints: number;
  withinStatutoryOutlookBand: boolean;
  alignedWithBufferCoherence: boolean;
  narrative: string;
  warnings: string[];
}
