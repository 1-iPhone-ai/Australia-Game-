import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 030 — NT/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_030_META = {
  id: 'kpi_030',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 29747,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_030_COEF = {
  c0: 50.8000,
  c1: 34.5000,
  c2: 18.2000,
  c3: 1.9000,
  c4: 85.3000,
  c5: 69.0000,
  c6: 52.7000,
  c7: 36.4000,
  c8: 20.1000,
  c9: 3.8000,
  c10: 87.2000,
  c11: 70.9000,
  c12: 54.6000,
  c13: 38.3000,
  c14: 22.0000,
  c15: 5.7000,
  c16: 89.1000,
  c17: 72.8000,
  c18: 56.5000,
  c19: 40.2000,
  c20: 23.9000,
  c21: 7.6000,
  c22: 91.0000,
  c23: 74.7000,
  c24: 58.4000,
  c25: 42.1000,
  c26: 25.8000,
  c27: 9.5000,
  c28: 92.9000,
  c29: 76.6000,
  c30: 60.3000,
  c31: 44.0000,
  c32: 27.7000,
  c33: 11.4000,
  c34: 94.8000,
  c35: 78.5000,
  c36: 62.2000,
  c37: 45.9000,
  c38: 29.6000,
  c39: 13.3000,
  c40: 96.7000,
  c41: 80.4000,
  c42: 64.1000,
  c43: 47.8000,
  c44: 31.5000,
  c45: 15.2000,
  c46: 98.6000,
  c47: 82.3000,
  c48: 66.0000,
  c49: 49.7000,
  c50: 33.4000,
  c51: 17.1000,
  c52: 0.8000,
  c53: 84.2000,
  c54: 67.9000,
  c55: 51.6000,
  c56: 35.3000,
  c57: 19.0000,
  c58: 2.7000,
  c59: 86.1000,
  c60: 69.8000,
  c61: 53.5000,
  c62: 37.2000,
  c63: 20.9000,
  c64: 4.6000,
  c65: 88.0000,
  c66: 71.7000,
  c67: 55.4000,
  c68: 39.1000,
  c69: 22.8000,
  c70: 6.5000,
  c71: 89.9000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_030_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_030_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_030_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_030_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_030_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_030_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_030_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_030_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_030_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_030_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
