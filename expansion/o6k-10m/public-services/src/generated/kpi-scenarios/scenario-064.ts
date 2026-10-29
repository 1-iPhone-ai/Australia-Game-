import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 064 — NSW/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_064_META = {
  id: 'kpi_064',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 63441,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_064_COEF = {
  c0: 89.3000,
  c1: 52.6000,
  c2: 15.9000,
  c3: 78.9000,
  c4: 42.2000,
  c5: 5.5000,
  c6: 68.5000,
  c7: 31.8000,
  c8: 94.8000,
  c9: 58.1000,
  c10: 21.4000,
  c11: 84.4000,
  c12: 47.7000,
  c13: 11.0000,
  c14: 74.0000,
  c15: 37.3000,
  c16: 0.6000,
  c17: 63.6000,
  c18: 26.9000,
  c19: 89.9000,
  c20: 53.2000,
  c21: 16.5000,
  c22: 79.5000,
  c23: 42.8000,
  c24: 6.1000,
  c25: 69.1000,
  c26: 32.4000,
  c27: 95.4000,
  c28: 58.7000,
  c29: 22.0000,
  c30: 85.0000,
  c31: 48.3000,
  c32: 11.6000,
  c33: 74.6000,
  c34: 37.9000,
  c35: 1.2000,
  c36: 64.2000,
  c37: 27.5000,
  c38: 90.5000,
  c39: 53.8000,
  c40: 17.1000,
  c41: 80.1000,
  c42: 43.4000,
  c43: 6.7000,
  c44: 69.7000,
  c45: 33.0000,
  c46: 96.0000,
  c47: 59.3000,
  c48: 22.6000,
  c49: 85.6000,
  c50: 48.9000,
  c51: 12.2000,
  c52: 75.2000,
  c53: 38.5000,
  c54: 1.8000,
  c55: 64.8000,
  c56: 28.1000,
  c57: 91.1000,
  c58: 54.4000,
  c59: 17.7000,
  c60: 80.7000,
  c61: 44.0000,
  c62: 7.3000,
  c63: 70.3000,
  c64: 33.6000,
  c65: 96.6000,
  c66: 59.9000,
  c67: 23.2000,
  c68: 86.2000,
  c69: 49.5000,
  c70: 12.8000,
  c71: 75.8000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_064_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_064_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_064_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_064_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_064_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_064_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_064_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_064_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_064_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_064_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
