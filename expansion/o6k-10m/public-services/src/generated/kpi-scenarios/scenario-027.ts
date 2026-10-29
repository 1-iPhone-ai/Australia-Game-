import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 027 — WA/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_027_META = {
  id: 'kpi_027',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 26774,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_027_COEF = {
  c0: 56.2000,
  c1: 41.7000,
  c2: 27.2000,
  c3: 12.7000,
  c4: 97.9000,
  c5: 83.4000,
  c6: 68.9000,
  c7: 54.4000,
  c8: 39.9000,
  c9: 25.4000,
  c10: 10.9000,
  c11: 96.1000,
  c12: 81.6000,
  c13: 67.1000,
  c14: 52.6000,
  c15: 38.1000,
  c16: 23.6000,
  c17: 9.1000,
  c18: 94.3000,
  c19: 79.8000,
  c20: 65.3000,
  c21: 50.8000,
  c22: 36.3000,
  c23: 21.8000,
  c24: 7.3000,
  c25: 92.5000,
  c26: 78.0000,
  c27: 63.5000,
  c28: 49.0000,
  c29: 34.5000,
  c30: 20.0000,
  c31: 5.5000,
  c32: 90.7000,
  c33: 76.2000,
  c34: 61.7000,
  c35: 47.2000,
  c36: 32.7000,
  c37: 18.2000,
  c38: 3.7000,
  c39: 88.9000,
  c40: 74.4000,
  c41: 59.9000,
  c42: 45.4000,
  c43: 30.9000,
  c44: 16.4000,
  c45: 1.9000,
  c46: 87.1000,
  c47: 72.6000,
  c48: 58.1000,
  c49: 43.6000,
  c50: 29.1000,
  c51: 14.6000,
  c52: 0.1000,
  c53: 85.3000,
  c54: 70.8000,
  c55: 56.3000,
  c56: 41.8000,
  c57: 27.3000,
  c58: 12.8000,
  c59: 98.0000,
  c60: 83.5000,
  c61: 69.0000,
  c62: 54.5000,
  c63: 40.0000,
  c64: 25.5000,
  c65: 11.0000,
  c66: 96.2000,
  c67: 81.7000,
  c68: 67.2000,
  c69: 52.7000,
  c70: 38.2000,
  c71: 23.7000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_027_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_027_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_027_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_027_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_027_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_027_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_027_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_027_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_027_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_027_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
