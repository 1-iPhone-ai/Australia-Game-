import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 051 — WA/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_051_META = {
  id: 'kpi_051',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 50558,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_051_COEF = {
  c0: 13.0000,
  c1: 83.8000,
  c2: 54.9000,
  c3: 26.0000,
  c4: 96.8000,
  c5: 67.9000,
  c6: 39.0000,
  c7: 10.1000,
  c8: 80.9000,
  c9: 52.0000,
  c10: 23.1000,
  c11: 93.9000,
  c12: 65.0000,
  c13: 36.1000,
  c14: 7.2000,
  c15: 78.0000,
  c16: 49.1000,
  c17: 20.2000,
  c18: 91.0000,
  c19: 62.1000,
  c20: 33.2000,
  c21: 4.3000,
  c22: 75.1000,
  c23: 46.2000,
  c24: 17.3000,
  c25: 88.1000,
  c26: 59.2000,
  c27: 30.3000,
  c28: 1.4000,
  c29: 72.2000,
  c30: 43.3000,
  c31: 14.4000,
  c32: 85.2000,
  c33: 56.3000,
  c34: 27.4000,
  c35: 98.2000,
  c36: 69.3000,
  c37: 40.4000,
  c38: 11.5000,
  c39: 82.3000,
  c40: 53.4000,
  c41: 24.5000,
  c42: 95.3000,
  c43: 66.4000,
  c44: 37.5000,
  c45: 8.6000,
  c46: 79.4000,
  c47: 50.5000,
  c48: 21.6000,
  c49: 92.4000,
  c50: 63.5000,
  c51: 34.6000,
  c52: 5.7000,
  c53: 76.5000,
  c54: 47.6000,
  c55: 18.7000,
  c56: 89.5000,
  c57: 60.6000,
  c58: 31.7000,
  c59: 2.8000,
  c60: 73.6000,
  c61: 44.7000,
  c62: 15.8000,
  c63: 86.6000,
  c64: 57.7000,
  c65: 28.8000,
  c66: 99.6000,
  c67: 70.7000,
  c68: 41.8000,
  c69: 12.9000,
  c70: 83.7000,
  c71: 54.8000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_051_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_051_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_051_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_051_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_051_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_051_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_051_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_051_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_051_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_051_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
