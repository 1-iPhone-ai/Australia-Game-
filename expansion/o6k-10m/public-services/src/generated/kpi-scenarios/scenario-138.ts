import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 138 — QLD/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_138_META = {
  id: 'kpi_138',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 136775,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_138_COEF = {
  c0: 55.8000,
  c1: 74.4000,
  c2: 93.0000,
  c3: 11.9000,
  c4: 30.5000,
  c5: 49.1000,
  c6: 67.7000,
  c7: 86.3000,
  c8: 5.2000,
  c9: 23.8000,
  c10: 42.4000,
  c11: 61.0000,
  c12: 79.6000,
  c13: 98.2000,
  c14: 17.1000,
  c15: 35.7000,
  c16: 54.3000,
  c17: 72.9000,
  c18: 91.5000,
  c19: 10.4000,
  c20: 29.0000,
  c21: 47.6000,
  c22: 66.2000,
  c23: 84.8000,
  c24: 3.7000,
  c25: 22.3000,
  c26: 40.9000,
  c27: 59.5000,
  c28: 78.1000,
  c29: 96.7000,
  c30: 15.6000,
  c31: 34.2000,
  c32: 52.8000,
  c33: 71.4000,
  c34: 90.0000,
  c35: 8.9000,
  c36: 27.5000,
  c37: 46.1000,
  c38: 64.7000,
  c39: 83.3000,
  c40: 2.2000,
  c41: 20.8000,
  c42: 39.4000,
  c43: 58.0000,
  c44: 76.6000,
  c45: 95.2000,
  c46: 14.1000,
  c47: 32.7000,
  c48: 51.3000,
  c49: 69.9000,
  c50: 88.5000,
  c51: 7.4000,
  c52: 26.0000,
  c53: 44.6000,
  c54: 63.2000,
  c55: 81.8000,
  c56: 0.7000,
  c57: 19.3000,
  c58: 37.9000,
  c59: 56.5000,
  c60: 75.1000,
  c61: 93.7000,
  c62: 12.6000,
  c63: 31.2000,
  c64: 49.8000,
  c65: 68.4000,
  c66: 87.0000,
  c67: 5.9000,
  c68: 24.5000,
  c69: 43.1000,
  c70: 61.7000,
  c71: 80.3000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_138_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_138_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_138_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_138_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_138_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_138_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_138_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_138_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_138_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_138_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
