import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 016 — NSW/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_016_META = {
  id: 'kpi_016',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 15873,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_016_COEF = {
  c0: 76.0000,
  c1: 68.1000,
  c2: 60.2000,
  c3: 52.3000,
  c4: 44.4000,
  c5: 36.5000,
  c6: 28.6000,
  c7: 20.7000,
  c8: 12.8000,
  c9: 4.9000,
  c10: 96.7000,
  c11: 88.8000,
  c12: 80.9000,
  c13: 73.0000,
  c14: 65.1000,
  c15: 57.2000,
  c16: 49.3000,
  c17: 41.4000,
  c18: 33.5000,
  c19: 25.6000,
  c20: 17.7000,
  c21: 9.8000,
  c22: 1.9000,
  c23: 93.7000,
  c24: 85.8000,
  c25: 77.9000,
  c26: 70.0000,
  c27: 62.1000,
  c28: 54.2000,
  c29: 46.3000,
  c30: 38.4000,
  c31: 30.5000,
  c32: 22.6000,
  c33: 14.7000,
  c34: 6.8000,
  c35: 98.6000,
  c36: 90.7000,
  c37: 82.8000,
  c38: 74.9000,
  c39: 67.0000,
  c40: 59.1000,
  c41: 51.2000,
  c42: 43.3000,
  c43: 35.4000,
  c44: 27.5000,
  c45: 19.6000,
  c46: 11.7000,
  c47: 3.8000,
  c48: 95.6000,
  c49: 87.7000,
  c50: 79.8000,
  c51: 71.9000,
  c52: 64.0000,
  c53: 56.1000,
  c54: 48.2000,
  c55: 40.3000,
  c56: 32.4000,
  c57: 24.5000,
  c58: 16.6000,
  c59: 8.7000,
  c60: 0.8000,
  c61: 92.6000,
  c62: 84.7000,
  c63: 76.8000,
  c64: 68.9000,
  c65: 61.0000,
  c66: 53.1000,
  c67: 45.2000,
  c68: 37.3000,
  c69: 29.4000,
  c70: 21.5000,
  c71: 13.6000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_016_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_016_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_016_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_016_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_016_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_016_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_016_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_016_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_016_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_016_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
