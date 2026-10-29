export const FISCAL_RULES_OFFSET_BRIDGE_SCHEMA =
  'op10m-agent07-fiscal-rules-offset-bridge-v1';

export interface RulesOffsetCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface FiscalRulesOffsetBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: RulesOffsetCheck[];
  bridgeGapPoints: number;
  withinRulesOffsetBand: boolean;
  alignedWithEfficiencyRegister: boolean;
  narrative: string;
  warnings: string[];
}
