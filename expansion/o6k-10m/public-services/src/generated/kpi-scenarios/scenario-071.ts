import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 071 — ACT/education. */
export const V1014_PUBSVC_KPI_SCENARIO_071_META = {
  id: 'kpi_071',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 70378,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_071_COEF = {
  c0: 76.7000,
  c1: 35.8000,
  c2: 94.6000,
  c3: 53.7000,
  c4: 12.8000,
  c5: 71.6000,
  c6: 30.7000,
  c7: 89.5000,
  c8: 48.6000,
  c9: 7.7000,
  c10: 66.5000,
  c11: 25.6000,
  c12: 84.4000,
  c13: 43.5000,
  c14: 2.6000,
  c15: 61.4000,
  c16: 20.5000,
  c17: 79.3000,
  c18: 38.4000,
  c19: 97.2000,
  c20: 56.3000,
  c21: 15.4000,
  c22: 74.2000,
  c23: 33.3000,
  c24: 92.1000,
  c25: 51.2000,
  c26: 10.3000,
  c27: 69.1000,
  c28: 28.2000,
  c29: 87.0000,
  c30: 46.1000,
  c31: 5.2000,
  c32: 64.0000,
  c33: 23.1000,
  c34: 81.9000,
  c35: 41.0000,
  c36: 0.1000,
  c37: 58.9000,
  c38: 18.0000,
  c39: 76.8000,
  c40: 35.9000,
  c41: 94.7000,
  c42: 53.8000,
  c43: 12.9000,
  c44: 71.7000,
  c45: 30.8000,
  c46: 89.6000,
  c47: 48.7000,
  c48: 7.8000,
  c49: 66.6000,
  c50: 25.7000,
  c51: 84.5000,
  c52: 43.6000,
  c53: 2.7000,
  c54: 61.5000,
  c55: 20.6000,
  c56: 79.4000,
  c57: 38.5000,
  c58: 97.3000,
  c59: 56.4000,
  c60: 15.5000,
  c61: 74.3000,
  c62: 33.4000,
  c63: 92.2000,
  c64: 51.3000,
  c65: 10.4000,
  c66: 69.2000,
  c67: 28.3000,
  c68: 87.1000,
  c69: 46.2000,
  c70: 5.3000,
  c71: 64.1000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_071_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_071_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_071_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_071_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_071_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_071_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_071_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_071_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_071_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_071_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
