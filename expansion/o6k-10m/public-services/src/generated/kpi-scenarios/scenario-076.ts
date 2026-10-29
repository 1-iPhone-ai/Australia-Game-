import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 076 — SA/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_076_META = {
  id: 'kpi_076',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 75333,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_076_COEF = {
  c0: 67.7000,
  c1: 23.8000,
  c2: 79.6000,
  c3: 35.7000,
  c4: 91.5000,
  c5: 47.6000,
  c6: 3.7000,
  c7: 59.5000,
  c8: 15.6000,
  c9: 71.4000,
  c10: 27.5000,
  c11: 83.3000,
  c12: 39.4000,
  c13: 95.2000,
  c14: 51.3000,
  c15: 7.4000,
  c16: 63.2000,
  c17: 19.3000,
  c18: 75.1000,
  c19: 31.2000,
  c20: 87.0000,
  c21: 43.1000,
  c22: 98.9000,
  c23: 55.0000,
  c24: 11.1000,
  c25: 66.9000,
  c26: 23.0000,
  c27: 78.8000,
  c28: 34.9000,
  c29: 90.7000,
  c30: 46.8000,
  c31: 2.9000,
  c32: 58.7000,
  c33: 14.8000,
  c34: 70.6000,
  c35: 26.7000,
  c36: 82.5000,
  c37: 38.6000,
  c38: 94.4000,
  c39: 50.5000,
  c40: 6.6000,
  c41: 62.4000,
  c42: 18.5000,
  c43: 74.3000,
  c44: 30.4000,
  c45: 86.2000,
  c46: 42.3000,
  c47: 98.1000,
  c48: 54.2000,
  c49: 10.3000,
  c50: 66.1000,
  c51: 22.2000,
  c52: 78.0000,
  c53: 34.1000,
  c54: 89.9000,
  c55: 46.0000,
  c56: 2.1000,
  c57: 57.9000,
  c58: 14.0000,
  c59: 69.8000,
  c60: 25.9000,
  c61: 81.7000,
  c62: 37.8000,
  c63: 93.6000,
  c64: 49.7000,
  c65: 5.8000,
  c66: 61.6000,
  c67: 17.7000,
  c68: 73.5000,
  c69: 29.6000,
  c70: 85.4000,
  c71: 41.5000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_076_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_076_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_076_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_076_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_076_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_076_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_076_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_076_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_076_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_076_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
