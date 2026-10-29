import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 160 — NSW/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_160_META = {
  id: 'kpi_160',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 158577,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_160_COEF = {
  c0: 16.2000,
  c1: 21.6000,
  c2: 27.0000,
  c3: 32.4000,
  c4: 37.8000,
  c5: 43.2000,
  c6: 48.6000,
  c7: 54.0000,
  c8: 59.4000,
  c9: 64.8000,
  c10: 70.2000,
  c11: 75.6000,
  c12: 81.0000,
  c13: 86.4000,
  c14: 91.8000,
  c15: 97.2000,
  c16: 2.9000,
  c17: 8.3000,
  c18: 13.7000,
  c19: 19.1000,
  c20: 24.5000,
  c21: 29.9000,
  c22: 35.3000,
  c23: 40.7000,
  c24: 46.1000,
  c25: 51.5000,
  c26: 56.9000,
  c27: 62.3000,
  c28: 67.7000,
  c29: 73.1000,
  c30: 78.5000,
  c31: 83.9000,
  c32: 89.3000,
  c33: 94.7000,
  c34: 0.4000,
  c35: 5.8000,
  c36: 11.2000,
  c37: 16.6000,
  c38: 22.0000,
  c39: 27.4000,
  c40: 32.8000,
  c41: 38.2000,
  c42: 43.6000,
  c43: 49.0000,
  c44: 54.4000,
  c45: 59.8000,
  c46: 65.2000,
  c47: 70.6000,
  c48: 76.0000,
  c49: 81.4000,
  c50: 86.8000,
  c51: 92.2000,
  c52: 97.6000,
  c53: 3.3000,
  c54: 8.7000,
  c55: 14.1000,
  c56: 19.5000,
  c57: 24.9000,
  c58: 30.3000,
  c59: 35.7000,
  c60: 41.1000,
  c61: 46.5000,
  c62: 51.9000,
  c63: 57.3000,
  c64: 62.7000,
  c65: 68.1000,
  c66: 73.5000,
  c67: 78.9000,
  c68: 84.3000,
  c69: 89.7000,
  c70: 95.1000,
  c71: 0.8000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_160_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_160_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_160_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_160_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_160_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_160_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_160_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_160_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_160_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_160_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
