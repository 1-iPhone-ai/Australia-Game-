import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type {
  FiscalStressScenarioResult,
  FiscalStressScenariosReport,
  FiscalStressScenarioId,
  V1012PressureLike
} from './types';
import { FISCAL_STRESS_SCENARIOS_SCHEMA } from './types';

const BREACH_APPETITE = 6;

function pressureAfter(headroom: number): V1012PressureLike {
  if (headroom <= -15) return 'critical';
  if (headroom <= -4) return 'strained';
  if (headroom >= 10) return 'comfortable';
  return 'healthy';
}

function scenario(
  id: FiscalStressScenarioId,
  label: string,
  headroomDelta: number,
  breachCount: number,
  baselineHeadroom: number
): FiscalStressScenarioResult {
  const after = baselineHeadroom + headroomDelta;
  const withinScenarioBand = breachCount <= 2 || after > -15;
  return {
    id,
    label,
    headroomDeltaPoints: Math.round(headroomDelta * 10) / 10,
    pressureAfter: pressureAfter(after),
    breachesRuleCount: breachCount,
    withinScenarioBand
  };
}

export function buildFiscalStressScenariosReport(turn: number, v1012: V1012FiscalSnapshot): FiscalStressScenariosReport {
  const commodityDelta = -(4.5 + v1012.revenueCapacity * 0.035);
  const rateDelta = v1012.debtEnabled ? -(3.2 + v1012.debtServiceLoad * 0.22) : -1.2;
  const demandDelta = -(2.8 + v1012.maintenanceLoad * 0.35);

  const raw: Array<[FiscalStressScenarioId, string, number, number]> = [
    ['commodity_shock', 'Terms-of-trade / commodity revenue shock', commodityDelta, v1012.debtServiceLoad > 12 ? 3 : 2],
    ['rate_shock', 'Global rate re-pricing shock', rateDelta, v1012.debtLevel > 40 ? 4 : 2],
    ['demand_surge', 'Demand-led spending overshoot', demandDelta, v1012.maintenanceLoad > 12 ? 3 : 2]
  ];

  let scenarios: FiscalStressScenarioResult[] = raw.map(([id, label, delta, breaches]) =>
    scenario(id, label, delta, breaches, v1012.fiscalHeadroom)
  );

  if (v1012.pressure !== 'critical' && v1012.reservePolicy === 'prudent') {
    scenarios = scenarios.map(s => ({
      ...s,
      breachesRuleCount: Math.max(0, s.breachesRuleCount - 1),
      withinScenarioBand: Math.max(0, s.breachesRuleCount - 1) <= 2 || s.pressureAfter !== 'critical'
    }));
  }

  const worstHeadroomDelta = Math.round(Math.min(...scenarios.map(s => s.headroomDeltaPoints)) * 10) / 10;
  const aggregateBreaches = scenarios.reduce((s, r) => s + r.breachesRuleCount, 0);

  const withinStressAppetite =
    aggregateBreaches <= BREACH_APPETITE ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && aggregateBreaches <= BREACH_APPETITE + 2);

  const warnings: string[] = [];
  if (aggregateBreaches > BREACH_APPETITE) {
    warnings.push(`Aggregate rule breaches ${aggregateBreaches} exceed appetite ${BREACH_APPETITE}.`);
  }
  if (scenarios.some(s => s.pressureAfter === 'critical')) {
    warnings.push('At least one stress path reaches critical pressure band.');
  }

  const narrative = withinStressAppetite
    ? `Fiscal stress matrix: worst headroom delta ${worstHeadroomDelta}, ${aggregateBreaches} aggregate breaches.`
    : `Stress appetite exceeded: ${aggregateBreaches} breaches across ${scenarios.length} scenarios.`;

  return {
    schemaVersion: FISCAL_STRESS_SCENARIOS_SCHEMA,
    turn,
    scenarios,
    worstHeadroomDelta,
    aggregateBreaches,
    withinStressAppetite,
    narrative,
    warnings
  };
}
