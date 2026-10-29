import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 157 — TAS/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_157_META = {
  id: 'kpi_157',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 155604,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_157_COEF = {
  c0: 21.6000,
  c1: 28.8000,
  c2: 36.0000,
  c3: 43.2000,
  c4: 50.4000,
  c5: 57.6000,
  c6: 64.8000,
  c7: 72.0000,
  c8: 79.2000,
  c9: 86.4000,
  c10: 93.6000,
  c11: 1.1000,
  c12: 8.3000,
  c13: 15.5000,
  c14: 22.7000,
  c15: 29.9000,
  c16: 37.1000,
  c17: 44.3000,
  c18: 51.5000,
  c19: 58.7000,
  c20: 65.9000,
  c21: 73.1000,
  c22: 80.3000,
  c23: 87.5000,
  c24: 94.7000,
  c25: 2.2000,
  c26: 9.4000,
  c27: 16.6000,
  c28: 23.8000,
  c29: 31.0000,
  c30: 38.2000,
  c31: 45.4000,
  c32: 52.6000,
  c33: 59.8000,
  c34: 67.0000,
  c35: 74.2000,
  c36: 81.4000,
  c37: 88.6000,
  c38: 95.8000,
  c39: 3.3000,
  c40: 10.5000,
  c41: 17.7000,
  c42: 24.9000,
  c43: 32.1000,
  c44: 39.3000,
  c45: 46.5000,
  c46: 53.7000,
  c47: 60.9000,
  c48: 68.1000,
  c49: 75.3000,
  c50: 82.5000,
  c51: 89.7000,
  c52: 96.9000,
  c53: 4.4000,
  c54: 11.6000,
  c55: 18.8000,
  c56: 26.0000,
  c57: 33.2000,
  c58: 40.4000,
  c59: 47.6000,
  c60: 54.8000,
  c61: 62.0000,
  c62: 69.2000,
  c63: 76.4000,
  c64: 83.6000,
  c65: 90.8000,
  c66: 98.0000,
  c67: 5.5000,
  c68: 12.7000,
  c69: 19.9000,
  c70: 27.1000,
  c71: 34.3000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_157_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_157_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_157_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_157_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_157_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_157_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_157_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_157_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_157_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_157_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
