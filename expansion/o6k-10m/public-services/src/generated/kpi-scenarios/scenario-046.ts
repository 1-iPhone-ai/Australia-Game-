import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 046 — NT/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_046_META = {
  id: 'kpi_046',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 45603,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_046_COEF = {
  c0: 22.0000,
  c1: 95.8000,
  c2: 69.9000,
  c3: 44.0000,
  c4: 18.1000,
  c5: 91.9000,
  c6: 66.0000,
  c7: 40.1000,
  c8: 14.2000,
  c9: 88.0000,
  c10: 62.1000,
  c11: 36.2000,
  c12: 10.3000,
  c13: 84.1000,
  c14: 58.2000,
  c15: 32.3000,
  c16: 6.4000,
  c17: 80.2000,
  c18: 54.3000,
  c19: 28.4000,
  c20: 2.5000,
  c21: 76.3000,
  c22: 50.4000,
  c23: 24.5000,
  c24: 98.3000,
  c25: 72.4000,
  c26: 46.5000,
  c27: 20.6000,
  c28: 94.4000,
  c29: 68.5000,
  c30: 42.6000,
  c31: 16.7000,
  c32: 90.5000,
  c33: 64.6000,
  c34: 38.7000,
  c35: 12.8000,
  c36: 86.6000,
  c37: 60.7000,
  c38: 34.8000,
  c39: 8.9000,
  c40: 82.7000,
  c41: 56.8000,
  c42: 30.9000,
  c43: 5.0000,
  c44: 78.8000,
  c45: 52.9000,
  c46: 27.0000,
  c47: 1.1000,
  c48: 74.9000,
  c49: 49.0000,
  c50: 23.1000,
  c51: 96.9000,
  c52: 71.0000,
  c53: 45.1000,
  c54: 19.2000,
  c55: 93.0000,
  c56: 67.1000,
  c57: 41.2000,
  c58: 15.3000,
  c59: 89.1000,
  c60: 63.2000,
  c61: 37.3000,
  c62: 11.4000,
  c63: 85.2000,
  c64: 59.3000,
  c65: 33.4000,
  c66: 7.5000,
  c67: 81.3000,
  c68: 55.4000,
  c69: 29.5000,
  c70: 3.6000,
  c71: 77.4000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_046_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_046_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_046_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_046_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_046_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_046_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_046_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_046_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_046_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_046_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
