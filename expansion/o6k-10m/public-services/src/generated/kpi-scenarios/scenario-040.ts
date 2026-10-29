import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 040 — NSW/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_040_META = {
  id: 'kpi_040',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 39657,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_040_COEF = {
  c0: 32.8000,
  c1: 10.5000,
  c2: 87.9000,
  c3: 65.6000,
  c4: 43.3000,
  c5: 21.0000,
  c6: 98.4000,
  c7: 76.1000,
  c8: 53.8000,
  c9: 31.5000,
  c10: 9.2000,
  c11: 86.6000,
  c12: 64.3000,
  c13: 42.0000,
  c14: 19.7000,
  c15: 97.1000,
  c16: 74.8000,
  c17: 52.5000,
  c18: 30.2000,
  c19: 7.9000,
  c20: 85.3000,
  c21: 63.0000,
  c22: 40.7000,
  c23: 18.4000,
  c24: 95.8000,
  c25: 73.5000,
  c26: 51.2000,
  c27: 28.9000,
  c28: 6.6000,
  c29: 84.0000,
  c30: 61.7000,
  c31: 39.4000,
  c32: 17.1000,
  c33: 94.5000,
  c34: 72.2000,
  c35: 49.9000,
  c36: 27.6000,
  c37: 5.3000,
  c38: 82.7000,
  c39: 60.4000,
  c40: 38.1000,
  c41: 15.8000,
  c42: 93.2000,
  c43: 70.9000,
  c44: 48.6000,
  c45: 26.3000,
  c46: 4.0000,
  c47: 81.4000,
  c48: 59.1000,
  c49: 36.8000,
  c50: 14.5000,
  c51: 91.9000,
  c52: 69.6000,
  c53: 47.3000,
  c54: 25.0000,
  c55: 2.7000,
  c56: 80.1000,
  c57: 57.8000,
  c58: 35.5000,
  c59: 13.2000,
  c60: 90.6000,
  c61: 68.3000,
  c62: 46.0000,
  c63: 23.7000,
  c64: 1.4000,
  c65: 78.8000,
  c66: 56.5000,
  c67: 34.2000,
  c68: 11.9000,
  c69: 89.3000,
  c70: 67.0000,
  c71: 44.7000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_040_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_040_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_040_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_040_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_040_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_040_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_040_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_040_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_040_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_040_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
