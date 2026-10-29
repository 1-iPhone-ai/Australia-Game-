import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 126 — NT/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_126_META = {
  id: 'kpi_126',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 124883,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_126_COEF = {
  c0: 77.4000,
  c1: 3.5000,
  c2: 29.3000,
  c3: 55.1000,
  c4: 80.9000,
  c5: 7.0000,
  c6: 32.8000,
  c7: 58.6000,
  c8: 84.4000,
  c9: 10.5000,
  c10: 36.3000,
  c11: 62.1000,
  c12: 87.9000,
  c13: 14.0000,
  c14: 39.8000,
  c15: 65.6000,
  c16: 91.4000,
  c17: 17.5000,
  c18: 43.3000,
  c19: 69.1000,
  c20: 94.9000,
  c21: 21.0000,
  c22: 46.8000,
  c23: 72.6000,
  c24: 98.4000,
  c25: 24.5000,
  c26: 50.3000,
  c27: 76.1000,
  c28: 2.2000,
  c29: 28.0000,
  c30: 53.8000,
  c31: 79.6000,
  c32: 5.7000,
  c33: 31.5000,
  c34: 57.3000,
  c35: 83.1000,
  c36: 9.2000,
  c37: 35.0000,
  c38: 60.8000,
  c39: 86.6000,
  c40: 12.7000,
  c41: 38.5000,
  c42: 64.3000,
  c43: 90.1000,
  c44: 16.2000,
  c45: 42.0000,
  c46: 67.8000,
  c47: 93.6000,
  c48: 19.7000,
  c49: 45.5000,
  c50: 71.3000,
  c51: 97.1000,
  c52: 23.2000,
  c53: 49.0000,
  c54: 74.8000,
  c55: 0.9000,
  c56: 26.7000,
  c57: 52.5000,
  c58: 78.3000,
  c59: 4.4000,
  c60: 30.2000,
  c61: 56.0000,
  c62: 81.8000,
  c63: 7.9000,
  c64: 33.7000,
  c65: 59.5000,
  c66: 85.3000,
  c67: 11.4000,
  c68: 37.2000,
  c69: 63.0000,
  c70: 88.8000,
  c71: 14.9000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_126_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_126_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_126_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_126_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_126_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_126_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_126_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_126_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_126_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_126_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
