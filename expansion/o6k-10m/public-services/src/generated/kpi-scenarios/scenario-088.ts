import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 088 — NSW/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_088_META = {
  id: 'kpi_088',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 87225,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_088_COEF = {
  c0: 46.1000,
  c1: 94.7000,
  c2: 43.6000,
  c3: 92.2000,
  c4: 41.1000,
  c5: 89.7000,
  c6: 38.6000,
  c7: 87.2000,
  c8: 36.1000,
  c9: 84.7000,
  c10: 33.6000,
  c11: 82.2000,
  c12: 31.1000,
  c13: 79.7000,
  c14: 28.6000,
  c15: 77.2000,
  c16: 26.1000,
  c17: 74.7000,
  c18: 23.6000,
  c19: 72.2000,
  c20: 21.1000,
  c21: 69.7000,
  c22: 18.6000,
  c23: 67.2000,
  c24: 16.1000,
  c25: 64.7000,
  c26: 13.6000,
  c27: 62.2000,
  c28: 11.1000,
  c29: 59.7000,
  c30: 8.6000,
  c31: 57.2000,
  c32: 6.1000,
  c33: 54.7000,
  c34: 3.6000,
  c35: 52.2000,
  c36: 1.1000,
  c37: 49.7000,
  c38: 98.3000,
  c39: 47.2000,
  c40: 95.8000,
  c41: 44.7000,
  c42: 93.3000,
  c43: 42.2000,
  c44: 90.8000,
  c45: 39.7000,
  c46: 88.3000,
  c47: 37.2000,
  c48: 85.8000,
  c49: 34.7000,
  c50: 83.3000,
  c51: 32.2000,
  c52: 80.8000,
  c53: 29.7000,
  c54: 78.3000,
  c55: 27.2000,
  c56: 75.8000,
  c57: 24.7000,
  c58: 73.3000,
  c59: 22.2000,
  c60: 70.8000,
  c61: 19.7000,
  c62: 68.3000,
  c63: 17.2000,
  c64: 65.8000,
  c65: 14.7000,
  c66: 63.3000,
  c67: 12.2000,
  c68: 60.8000,
  c69: 9.7000,
  c70: 58.3000,
  c71: 7.2000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_088_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_088_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_088_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_088_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_088_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_088_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_088_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_088_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_088_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_088_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
