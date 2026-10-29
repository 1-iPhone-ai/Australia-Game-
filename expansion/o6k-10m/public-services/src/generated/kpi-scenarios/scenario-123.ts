import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 123 — WA/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_123_META = {
  id: 'kpi_123',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 121910,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_123_COEF = {
  c0: 82.8000,
  c1: 10.7000,
  c2: 38.3000,
  c3: 65.9000,
  c4: 93.5000,
  c5: 21.4000,
  c6: 49.0000,
  c7: 76.6000,
  c8: 4.5000,
  c9: 32.1000,
  c10: 59.7000,
  c11: 87.3000,
  c12: 15.2000,
  c13: 42.8000,
  c14: 70.4000,
  c15: 98.0000,
  c16: 25.9000,
  c17: 53.5000,
  c18: 81.1000,
  c19: 9.0000,
  c20: 36.6000,
  c21: 64.2000,
  c22: 91.8000,
  c23: 19.7000,
  c24: 47.3000,
  c25: 74.9000,
  c26: 2.8000,
  c27: 30.4000,
  c28: 58.0000,
  c29: 85.6000,
  c30: 13.5000,
  c31: 41.1000,
  c32: 68.7000,
  c33: 96.3000,
  c34: 24.2000,
  c35: 51.8000,
  c36: 79.4000,
  c37: 7.3000,
  c38: 34.9000,
  c39: 62.5000,
  c40: 90.1000,
  c41: 18.0000,
  c42: 45.6000,
  c43: 73.2000,
  c44: 1.1000,
  c45: 28.7000,
  c46: 56.3000,
  c47: 83.9000,
  c48: 11.8000,
  c49: 39.4000,
  c50: 67.0000,
  c51: 94.6000,
  c52: 22.5000,
  c53: 50.1000,
  c54: 77.7000,
  c55: 5.6000,
  c56: 33.2000,
  c57: 60.8000,
  c58: 88.4000,
  c59: 16.3000,
  c60: 43.9000,
  c61: 71.5000,
  c62: 99.1000,
  c63: 27.0000,
  c64: 54.6000,
  c65: 82.2000,
  c66: 10.1000,
  c67: 37.7000,
  c68: 65.3000,
  c69: 92.9000,
  c70: 20.8000,
  c71: 48.4000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_123_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_123_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_123_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_123_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_123_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_123_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_123_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_123_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_123_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_123_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
