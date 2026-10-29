import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 165 — TAS/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_165_META = {
  id: 'kpi_165',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 163532,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_165_COEF = {
  c0: 7.2000,
  c1: 9.6000,
  c2: 12.0000,
  c3: 14.4000,
  c4: 16.8000,
  c5: 19.2000,
  c6: 21.6000,
  c7: 24.0000,
  c8: 26.4000,
  c9: 28.8000,
  c10: 31.2000,
  c11: 33.6000,
  c12: 36.0000,
  c13: 38.4000,
  c14: 40.8000,
  c15: 43.2000,
  c16: 45.6000,
  c17: 48.0000,
  c18: 50.4000,
  c19: 52.8000,
  c20: 55.2000,
  c21: 57.6000,
  c22: 60.0000,
  c23: 62.4000,
  c24: 64.8000,
  c25: 67.2000,
  c26: 69.6000,
  c27: 72.0000,
  c28: 74.4000,
  c29: 76.8000,
  c30: 79.2000,
  c31: 81.6000,
  c32: 84.0000,
  c33: 86.4000,
  c34: 88.8000,
  c35: 91.2000,
  c36: 93.6000,
  c37: 96.0000,
  c38: 98.4000,
  c39: 1.1000,
  c40: 3.5000,
  c41: 5.9000,
  c42: 8.3000,
  c43: 10.7000,
  c44: 13.1000,
  c45: 15.5000,
  c46: 17.9000,
  c47: 20.3000,
  c48: 22.7000,
  c49: 25.1000,
  c50: 27.5000,
  c51: 29.9000,
  c52: 32.3000,
  c53: 34.7000,
  c54: 37.1000,
  c55: 39.5000,
  c56: 41.9000,
  c57: 44.3000,
  c58: 46.7000,
  c59: 49.1000,
  c60: 51.5000,
  c61: 53.9000,
  c62: 56.3000,
  c63: 58.7000,
  c64: 61.1000,
  c65: 63.5000,
  c66: 65.9000,
  c67: 68.3000,
  c68: 70.7000,
  c69: 73.1000,
  c70: 75.5000,
  c71: 77.9000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_165_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_165_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_165_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_165_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_165_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_165_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_165_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_165_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_165_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_165_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
