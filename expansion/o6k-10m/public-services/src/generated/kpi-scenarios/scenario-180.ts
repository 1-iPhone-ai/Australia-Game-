import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 180 — SA/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_180_META = {
  id: 'kpi_180',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 178397,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_180_COEF = {
  c0: 79.9000,
  c1: 73.3000,
  c2: 66.7000,
  c3: 60.1000,
  c4: 53.5000,
  c5: 46.9000,
  c6: 40.3000,
  c7: 33.7000,
  c8: 27.1000,
  c9: 20.5000,
  c10: 13.9000,
  c11: 7.3000,
  c12: 0.7000,
  c13: 93.8000,
  c14: 87.2000,
  c15: 80.6000,
  c16: 74.0000,
  c17: 67.4000,
  c18: 60.8000,
  c19: 54.2000,
  c20: 47.6000,
  c21: 41.0000,
  c22: 34.4000,
  c23: 27.8000,
  c24: 21.2000,
  c25: 14.6000,
  c26: 8.0000,
  c27: 1.4000,
  c28: 94.5000,
  c29: 87.9000,
  c30: 81.3000,
  c31: 74.7000,
  c32: 68.1000,
  c33: 61.5000,
  c34: 54.9000,
  c35: 48.3000,
  c36: 41.7000,
  c37: 35.1000,
  c38: 28.5000,
  c39: 21.9000,
  c40: 15.3000,
  c41: 8.7000,
  c42: 2.1000,
  c43: 95.2000,
  c44: 88.6000,
  c45: 82.0000,
  c46: 75.4000,
  c47: 68.8000,
  c48: 62.2000,
  c49: 55.6000,
  c50: 49.0000,
  c51: 42.4000,
  c52: 35.8000,
  c53: 29.2000,
  c54: 22.6000,
  c55: 16.0000,
  c56: 9.4000,
  c57: 2.8000,
  c58: 95.9000,
  c59: 89.3000,
  c60: 82.7000,
  c61: 76.1000,
  c62: 69.5000,
  c63: 62.9000,
  c64: 56.3000,
  c65: 49.7000,
  c66: 43.1000,
  c67: 36.5000,
  c68: 29.9000,
  c69: 23.3000,
  c70: 16.7000,
  c71: 10.1000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_180_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_180_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_180_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_180_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_180_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_180_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_180_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_180_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_180_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_180_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
