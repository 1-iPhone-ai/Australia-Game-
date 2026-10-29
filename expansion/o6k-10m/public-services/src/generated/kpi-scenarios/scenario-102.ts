import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 102 — NT/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_102_META = {
  id: 'kpi_102',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 101099,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_102_COEF = {
  c0: 20.9000,
  c1: 61.1000,
  c2: 1.6000,
  c3: 41.8000,
  c4: 82.0000,
  c5: 22.5000,
  c6: 62.7000,
  c7: 3.2000,
  c8: 43.4000,
  c9: 83.6000,
  c10: 24.1000,
  c11: 64.3000,
  c12: 4.8000,
  c13: 45.0000,
  c14: 85.2000,
  c15: 25.7000,
  c16: 65.9000,
  c17: 6.4000,
  c18: 46.6000,
  c19: 86.8000,
  c20: 27.3000,
  c21: 67.5000,
  c22: 8.0000,
  c23: 48.2000,
  c24: 88.4000,
  c25: 28.9000,
  c26: 69.1000,
  c27: 9.6000,
  c28: 49.8000,
  c29: 90.0000,
  c30: 30.5000,
  c31: 70.7000,
  c32: 11.2000,
  c33: 51.4000,
  c34: 91.6000,
  c35: 32.1000,
  c36: 72.3000,
  c37: 12.8000,
  c38: 53.0000,
  c39: 93.2000,
  c40: 33.7000,
  c41: 73.9000,
  c42: 14.4000,
  c43: 54.6000,
  c44: 94.8000,
  c45: 35.3000,
  c46: 75.5000,
  c47: 16.0000,
  c48: 56.2000,
  c49: 96.4000,
  c50: 36.9000,
  c51: 77.1000,
  c52: 17.6000,
  c53: 57.8000,
  c54: 98.0000,
  c55: 38.5000,
  c56: 78.7000,
  c57: 19.2000,
  c58: 59.4000,
  c59: 99.6000,
  c60: 40.1000,
  c61: 80.3000,
  c62: 20.8000,
  c63: 61.0000,
  c64: 1.5000,
  c65: 41.7000,
  c66: 81.9000,
  c67: 22.4000,
  c68: 62.6000,
  c69: 3.1000,
  c70: 43.3000,
  c71: 83.5000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_102_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_102_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_102_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_102_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_102_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_102_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_102_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_102_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_102_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_102_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
