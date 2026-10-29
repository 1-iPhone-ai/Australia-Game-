import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 184 — NSW/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_184_META = {
  id: 'kpi_184',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 182361,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_184_COEF = {
  c0: 72.7000,
  c1: 63.7000,
  c2: 54.7000,
  c3: 45.7000,
  c4: 36.7000,
  c5: 27.7000,
  c6: 18.7000,
  c7: 9.7000,
  c8: 0.7000,
  c9: 91.4000,
  c10: 82.4000,
  c11: 73.4000,
  c12: 64.4000,
  c13: 55.4000,
  c14: 46.4000,
  c15: 37.4000,
  c16: 28.4000,
  c17: 19.4000,
  c18: 10.4000,
  c19: 1.4000,
  c20: 92.1000,
  c21: 83.1000,
  c22: 74.1000,
  c23: 65.1000,
  c24: 56.1000,
  c25: 47.1000,
  c26: 38.1000,
  c27: 29.1000,
  c28: 20.1000,
  c29: 11.1000,
  c30: 2.1000,
  c31: 92.8000,
  c32: 83.8000,
  c33: 74.8000,
  c34: 65.8000,
  c35: 56.8000,
  c36: 47.8000,
  c37: 38.8000,
  c38: 29.8000,
  c39: 20.8000,
  c40: 11.8000,
  c41: 2.8000,
  c42: 93.5000,
  c43: 84.5000,
  c44: 75.5000,
  c45: 66.5000,
  c46: 57.5000,
  c47: 48.5000,
  c48: 39.5000,
  c49: 30.5000,
  c50: 21.5000,
  c51: 12.5000,
  c52: 3.5000,
  c53: 94.2000,
  c54: 85.2000,
  c55: 76.2000,
  c56: 67.2000,
  c57: 58.2000,
  c58: 49.2000,
  c59: 40.2000,
  c60: 31.2000,
  c61: 22.2000,
  c62: 13.2000,
  c63: 4.2000,
  c64: 94.9000,
  c65: 85.9000,
  c66: 76.9000,
  c67: 67.9000,
  c68: 58.9000,
  c69: 49.9000,
  c70: 40.9000,
  c71: 31.9000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_184_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_184_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_184_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_184_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_184_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_184_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_184_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_184_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_184_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_184_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
