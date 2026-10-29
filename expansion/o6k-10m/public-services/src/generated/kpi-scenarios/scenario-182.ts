import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 182 — NT/education. */
export const V1014_PUBSVC_KPI_SCENARIO_182_META = {
  id: 'kpi_182',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 180379,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_182_COEF = {
  c0: 76.3000,
  c1: 68.5000,
  c2: 60.7000,
  c3: 52.9000,
  c4: 45.1000,
  c5: 37.3000,
  c6: 29.5000,
  c7: 21.7000,
  c8: 13.9000,
  c9: 6.1000,
  c10: 98.0000,
  c11: 90.2000,
  c12: 82.4000,
  c13: 74.6000,
  c14: 66.8000,
  c15: 59.0000,
  c16: 51.2000,
  c17: 43.4000,
  c18: 35.6000,
  c19: 27.8000,
  c20: 20.0000,
  c21: 12.2000,
  c22: 4.4000,
  c23: 96.3000,
  c24: 88.5000,
  c25: 80.7000,
  c26: 72.9000,
  c27: 65.1000,
  c28: 57.3000,
  c29: 49.5000,
  c30: 41.7000,
  c31: 33.9000,
  c32: 26.1000,
  c33: 18.3000,
  c34: 10.5000,
  c35: 2.7000,
  c36: 94.6000,
  c37: 86.8000,
  c38: 79.0000,
  c39: 71.2000,
  c40: 63.4000,
  c41: 55.6000,
  c42: 47.8000,
  c43: 40.0000,
  c44: 32.2000,
  c45: 24.4000,
  c46: 16.6000,
  c47: 8.8000,
  c48: 1.0000,
  c49: 92.9000,
  c50: 85.1000,
  c51: 77.3000,
  c52: 69.5000,
  c53: 61.7000,
  c54: 53.9000,
  c55: 46.1000,
  c56: 38.3000,
  c57: 30.5000,
  c58: 22.7000,
  c59: 14.9000,
  c60: 7.1000,
  c61: 99.0000,
  c62: 91.2000,
  c63: 83.4000,
  c64: 75.6000,
  c65: 67.8000,
  c66: 60.0000,
  c67: 52.2000,
  c68: 44.4000,
  c69: 36.6000,
  c70: 28.8000,
  c71: 21.0000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_182_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_182_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_182_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_182_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_182_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_182_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_182_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_182_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_182_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_182_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
