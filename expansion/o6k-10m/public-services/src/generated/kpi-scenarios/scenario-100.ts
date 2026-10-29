import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 100 — SA/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_100_META = {
  id: 'kpi_100',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 99117,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_100_COEF = {
  c0: 24.5000,
  c1: 65.9000,
  c2: 7.6000,
  c3: 49.0000,
  c4: 90.4000,
  c5: 32.1000,
  c6: 73.5000,
  c7: 15.2000,
  c8: 56.6000,
  c9: 98.0000,
  c10: 39.7000,
  c11: 81.1000,
  c12: 22.8000,
  c13: 64.2000,
  c14: 5.9000,
  c15: 47.3000,
  c16: 88.7000,
  c17: 30.4000,
  c18: 71.8000,
  c19: 13.5000,
  c20: 54.9000,
  c21: 96.3000,
  c22: 38.0000,
  c23: 79.4000,
  c24: 21.1000,
  c25: 62.5000,
  c26: 4.2000,
  c27: 45.6000,
  c28: 87.0000,
  c29: 28.7000,
  c30: 70.1000,
  c31: 11.8000,
  c32: 53.2000,
  c33: 94.6000,
  c34: 36.3000,
  c35: 77.7000,
  c36: 19.4000,
  c37: 60.8000,
  c38: 2.5000,
  c39: 43.9000,
  c40: 85.3000,
  c41: 27.0000,
  c42: 68.4000,
  c43: 10.1000,
  c44: 51.5000,
  c45: 92.9000,
  c46: 34.6000,
  c47: 76.0000,
  c48: 17.7000,
  c49: 59.1000,
  c50: 0.8000,
  c51: 42.2000,
  c52: 83.6000,
  c53: 25.3000,
  c54: 66.7000,
  c55: 8.4000,
  c56: 49.8000,
  c57: 91.2000,
  c58: 32.9000,
  c59: 74.3000,
  c60: 16.0000,
  c61: 57.4000,
  c62: 98.8000,
  c63: 40.5000,
  c64: 81.9000,
  c65: 23.6000,
  c66: 65.0000,
  c67: 6.7000,
  c68: 48.1000,
  c69: 89.5000,
  c70: 31.2000,
  c71: 72.6000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_100_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_100_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_100_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_100_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_100_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_100_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_100_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_100_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_100_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_100_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
