import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 052 — SA/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_052_META = {
  id: 'kpi_052',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 51549,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_052_COEF = {
  c0: 11.2000,
  c1: 81.4000,
  c2: 51.9000,
  c3: 22.4000,
  c4: 92.6000,
  c5: 63.1000,
  c6: 33.6000,
  c7: 4.1000,
  c8: 74.3000,
  c9: 44.8000,
  c10: 15.3000,
  c11: 85.5000,
  c12: 56.0000,
  c13: 26.5000,
  c14: 96.7000,
  c15: 67.2000,
  c16: 37.7000,
  c17: 8.2000,
  c18: 78.4000,
  c19: 48.9000,
  c20: 19.4000,
  c21: 89.6000,
  c22: 60.1000,
  c23: 30.6000,
  c24: 1.1000,
  c25: 71.3000,
  c26: 41.8000,
  c27: 12.3000,
  c28: 82.5000,
  c29: 53.0000,
  c30: 23.5000,
  c31: 93.7000,
  c32: 64.2000,
  c33: 34.7000,
  c34: 5.2000,
  c35: 75.4000,
  c36: 45.9000,
  c37: 16.4000,
  c38: 86.6000,
  c39: 57.1000,
  c40: 27.6000,
  c41: 97.8000,
  c42: 68.3000,
  c43: 38.8000,
  c44: 9.3000,
  c45: 79.5000,
  c46: 50.0000,
  c47: 20.5000,
  c48: 90.7000,
  c49: 61.2000,
  c50: 31.7000,
  c51: 2.2000,
  c52: 72.4000,
  c53: 42.9000,
  c54: 13.4000,
  c55: 83.6000,
  c56: 54.1000,
  c57: 24.6000,
  c58: 94.8000,
  c59: 65.3000,
  c60: 35.8000,
  c61: 6.3000,
  c62: 76.5000,
  c63: 47.0000,
  c64: 17.5000,
  c65: 87.7000,
  c66: 58.2000,
  c67: 28.7000,
  c68: 98.9000,
  c69: 69.4000,
  c70: 39.9000,
  c71: 10.4000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_052_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_052_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_052_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_052_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_052_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_052_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_052_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_052_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_052_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_052_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
