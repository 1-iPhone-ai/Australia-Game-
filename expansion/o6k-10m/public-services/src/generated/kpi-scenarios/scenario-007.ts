import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 007 — ACT/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_007_META = {
  id: 'kpi_007',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 6954,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_007_COEF = {
  c0: 92.2000,
  c1: 89.7000,
  c2: 87.2000,
  c3: 84.7000,
  c4: 82.2000,
  c5: 79.7000,
  c6: 77.2000,
  c7: 74.7000,
  c8: 72.2000,
  c9: 69.7000,
  c10: 67.2000,
  c11: 64.7000,
  c12: 62.2000,
  c13: 59.7000,
  c14: 57.2000,
  c15: 54.7000,
  c16: 52.2000,
  c17: 49.7000,
  c18: 47.2000,
  c19: 44.7000,
  c20: 42.2000,
  c21: 39.7000,
  c22: 37.2000,
  c23: 34.7000,
  c24: 32.2000,
  c25: 29.7000,
  c26: 27.2000,
  c27: 24.7000,
  c28: 22.2000,
  c29: 19.7000,
  c30: 17.2000,
  c31: 14.7000,
  c32: 12.2000,
  c33: 9.7000,
  c34: 7.2000,
  c35: 4.7000,
  c36: 2.2000,
  c37: 99.4000,
  c38: 96.9000,
  c39: 94.4000,
  c40: 91.9000,
  c41: 89.4000,
  c42: 86.9000,
  c43: 84.4000,
  c44: 81.9000,
  c45: 79.4000,
  c46: 76.9000,
  c47: 74.4000,
  c48: 71.9000,
  c49: 69.4000,
  c50: 66.9000,
  c51: 64.4000,
  c52: 61.9000,
  c53: 59.4000,
  c54: 56.9000,
  c55: 54.4000,
  c56: 51.9000,
  c57: 49.4000,
  c58: 46.9000,
  c59: 44.4000,
  c60: 41.9000,
  c61: 39.4000,
  c62: 36.9000,
  c63: 34.4000,
  c64: 31.9000,
  c65: 29.4000,
  c66: 26.9000,
  c67: 24.4000,
  c68: 21.9000,
  c69: 19.4000,
  c70: 16.9000,
  c71: 14.4000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_007_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_007_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_007_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_007_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_007_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_007_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_007_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_007_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_007_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_007_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
