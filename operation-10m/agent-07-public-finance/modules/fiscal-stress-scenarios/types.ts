export const FISCAL_STRESS_SCENARIOS_SCHEMA = 'op10m-agent07-fiscal-stress-scenarios-v1';

export type FiscalStressScenarioId = 'commodity_shock' | 'rate_shock' | 'demand_surge';

export interface FiscalStressScenarioResult {
  id: FiscalStressScenarioId;
  label: string;
  headroomDeltaPoints: number;
  pressureAfter: V1012PressureLike;
  breachesRuleCount: number;
  withinScenarioBand: boolean;
}

export type V1012PressureLike = 'comfortable' | 'healthy' | 'strained' | 'critical';

export interface FiscalStressScenariosReport {
  schemaVersion: string;
  turn: number;
  scenarios: FiscalStressScenarioResult[];
  worstHeadroomDelta: number;
  aggregateBreaches: number;
  withinStressAppetite: boolean;
  narrative: string;
  warnings: string[];
}
