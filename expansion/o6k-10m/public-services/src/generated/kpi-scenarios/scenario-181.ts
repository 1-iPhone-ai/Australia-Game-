import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 181 — TAS/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_181_META = {
  id: 'kpi_181',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 179388,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_181_COEF = {
  c0: 78.1000,
  c1: 70.9000,
  c2: 63.7000,
  c3: 56.5000,
  c4: 49.3000,
  c5: 42.1000,
  c6: 34.9000,
  c7: 27.7000,
  c8: 20.5000,
  c9: 13.3000,
  c10: 6.1000,
  c11: 98.6000,
  c12: 91.4000,
  c13: 84.2000,
  c14: 77.0000,
  c15: 69.8000,
  c16: 62.6000,
  c17: 55.4000,
  c18: 48.2000,
  c19: 41.0000,
  c20: 33.8000,
  c21: 26.6000,
  c22: 19.4000,
  c23: 12.2000,
  c24: 5.0000,
  c25: 97.5000,
  c26: 90.3000,
  c27: 83.1000,
  c28: 75.9000,
  c29: 68.7000,
  c30: 61.5000,
  c31: 54.3000,
  c32: 47.1000,
  c33: 39.9000,
  c34: 32.7000,
  c35: 25.5000,
  c36: 18.3000,
  c37: 11.1000,
  c38: 3.9000,
  c39: 96.4000,
  c40: 89.2000,
  c41: 82.0000,
  c42: 74.8000,
  c43: 67.6000,
  c44: 60.4000,
  c45: 53.2000,
  c46: 46.0000,
  c47: 38.8000,
  c48: 31.6000,
  c49: 24.4000,
  c50: 17.2000,
  c51: 10.0000,
  c52: 2.8000,
  c53: 95.3000,
  c54: 88.1000,
  c55: 80.9000,
  c56: 73.7000,
  c57: 66.5000,
  c58: 59.3000,
  c59: 52.1000,
  c60: 44.9000,
  c61: 37.7000,
  c62: 30.5000,
  c63: 23.3000,
  c64: 16.1000,
  c65: 8.9000,
  c66: 1.7000,
  c67: 94.2000,
  c68: 87.0000,
  c69: 79.8000,
  c70: 72.6000,
  c71: 65.4000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_181_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_181_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_181_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_181_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_181_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_181_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_181_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_181_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_181_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_181_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
