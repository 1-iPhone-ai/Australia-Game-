import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 060 — SA/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_060_META = {
  id: 'kpi_060',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 59477,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_060_COEF = {
  c0: 96.5000,
  c1: 62.2000,
  c2: 27.9000,
  c3: 93.3000,
  c4: 59.0000,
  c5: 24.7000,
  c6: 90.1000,
  c7: 55.8000,
  c8: 21.5000,
  c9: 86.9000,
  c10: 52.6000,
  c11: 18.3000,
  c12: 83.7000,
  c13: 49.4000,
  c14: 15.1000,
  c15: 80.5000,
  c16: 46.2000,
  c17: 11.9000,
  c18: 77.3000,
  c19: 43.0000,
  c20: 8.7000,
  c21: 74.1000,
  c22: 39.8000,
  c23: 5.5000,
  c24: 70.9000,
  c25: 36.6000,
  c26: 2.3000,
  c27: 67.7000,
  c28: 33.4000,
  c29: 98.8000,
  c30: 64.5000,
  c31: 30.2000,
  c32: 95.6000,
  c33: 61.3000,
  c34: 27.0000,
  c35: 92.4000,
  c36: 58.1000,
  c37: 23.8000,
  c38: 89.2000,
  c39: 54.9000,
  c40: 20.6000,
  c41: 86.0000,
  c42: 51.7000,
  c43: 17.4000,
  c44: 82.8000,
  c45: 48.5000,
  c46: 14.2000,
  c47: 79.6000,
  c48: 45.3000,
  c49: 11.0000,
  c50: 76.4000,
  c51: 42.1000,
  c52: 7.8000,
  c53: 73.2000,
  c54: 38.9000,
  c55: 4.6000,
  c56: 70.0000,
  c57: 35.7000,
  c58: 1.4000,
  c59: 66.8000,
  c60: 32.5000,
  c61: 97.9000,
  c62: 63.6000,
  c63: 29.3000,
  c64: 94.7000,
  c65: 60.4000,
  c66: 26.1000,
  c67: 91.5000,
  c68: 57.2000,
  c69: 22.9000,
  c70: 88.3000,
  c71: 54.0000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_060_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_060_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_060_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_060_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_060_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_060_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_060_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_060_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_060_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_060_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
