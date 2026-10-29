import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 133 — TAS/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_133_META = {
  id: 'kpi_133',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 131820,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_133_COEF = {
  c0: 64.8000,
  c1: 86.4000,
  c2: 8.3000,
  c3: 29.9000,
  c4: 51.5000,
  c5: 73.1000,
  c6: 94.7000,
  c7: 16.6000,
  c8: 38.2000,
  c9: 59.8000,
  c10: 81.4000,
  c11: 3.3000,
  c12: 24.9000,
  c13: 46.5000,
  c14: 68.1000,
  c15: 89.7000,
  c16: 11.6000,
  c17: 33.2000,
  c18: 54.8000,
  c19: 76.4000,
  c20: 98.0000,
  c21: 19.9000,
  c22: 41.5000,
  c23: 63.1000,
  c24: 84.7000,
  c25: 6.6000,
  c26: 28.2000,
  c27: 49.8000,
  c28: 71.4000,
  c29: 93.0000,
  c30: 14.9000,
  c31: 36.5000,
  c32: 58.1000,
  c33: 79.7000,
  c34: 1.6000,
  c35: 23.2000,
  c36: 44.8000,
  c37: 66.4000,
  c38: 88.0000,
  c39: 9.9000,
  c40: 31.5000,
  c41: 53.1000,
  c42: 74.7000,
  c43: 96.3000,
  c44: 18.2000,
  c45: 39.8000,
  c46: 61.4000,
  c47: 83.0000,
  c48: 4.9000,
  c49: 26.5000,
  c50: 48.1000,
  c51: 69.7000,
  c52: 91.3000,
  c53: 13.2000,
  c54: 34.8000,
  c55: 56.4000,
  c56: 78.0000,
  c57: 99.6000,
  c58: 21.5000,
  c59: 43.1000,
  c60: 64.7000,
  c61: 86.3000,
  c62: 8.2000,
  c63: 29.8000,
  c64: 51.4000,
  c65: 73.0000,
  c66: 94.6000,
  c67: 16.5000,
  c68: 38.1000,
  c69: 59.7000,
  c70: 81.3000,
  c71: 3.2000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_133_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_133_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_133_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_133_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_133_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_133_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_133_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_133_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_133_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_133_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
