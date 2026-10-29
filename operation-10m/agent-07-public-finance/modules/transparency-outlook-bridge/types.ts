export const TRANSPARENCY_OUTLOOK_BRIDGE_SCHEMA =
  'op10m-agent07-transparency-outlook-bridge-v1';

export interface TransparencyOutlookCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface TransparencyOutlookBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: TransparencyOutlookCheck[];
  bridgeGapPoints: number;
  withinTransparencyOutlookBand: boolean;
  alignedWithTransparencyForward: boolean;
  narrative: string;
  warnings: string[];
}
