import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 120 — NSW/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_120_META = {
  id: 'kpi_120',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 118937,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_120_COEF = {
  c0: 88.2000,
  c1: 17.9000,
  c2: 47.3000,
  c3: 76.7000,
  c4: 6.4000,
  c5: 35.8000,
  c6: 65.2000,
  c7: 94.6000,
  c8: 24.3000,
  c9: 53.7000,
  c10: 83.1000,
  c11: 12.8000,
  c12: 42.2000,
  c13: 71.6000,
  c14: 1.3000,
  c15: 30.7000,
  c16: 60.1000,
  c17: 89.5000,
  c18: 19.2000,
  c19: 48.6000,
  c20: 78.0000,
  c21: 7.7000,
  c22: 37.1000,
  c23: 66.5000,
  c24: 95.9000,
  c25: 25.6000,
  c26: 55.0000,
  c27: 84.4000,
  c28: 14.1000,
  c29: 43.5000,
  c30: 72.9000,
  c31: 2.6000,
  c32: 32.0000,
  c33: 61.4000,
  c34: 90.8000,
  c35: 20.5000,
  c36: 49.9000,
  c37: 79.3000,
  c38: 9.0000,
  c39: 38.4000,
  c40: 67.8000,
  c41: 97.2000,
  c42: 26.9000,
  c43: 56.3000,
  c44: 85.7000,
  c45: 15.4000,
  c46: 44.8000,
  c47: 74.2000,
  c48: 3.9000,
  c49: 33.3000,
  c50: 62.7000,
  c51: 92.1000,
  c52: 21.8000,
  c53: 51.2000,
  c54: 80.6000,
  c55: 10.3000,
  c56: 39.7000,
  c57: 69.1000,
  c58: 98.5000,
  c59: 28.2000,
  c60: 57.6000,
  c61: 87.0000,
  c62: 16.7000,
  c63: 46.1000,
  c64: 75.5000,
  c65: 5.2000,
  c66: 34.6000,
  c67: 64.0000,
  c68: 93.4000,
  c69: 23.1000,
  c70: 52.5000,
  c71: 81.9000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_120_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_120_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_120_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_120_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_120_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_120_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_120_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_120_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_120_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_120_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
