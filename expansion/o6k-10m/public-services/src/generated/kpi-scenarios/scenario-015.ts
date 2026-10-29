import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 015 — ACT/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_015_META = {
  id: 'kpi_015',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 14882,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_015_COEF = {
  c0: 77.8000,
  c1: 70.5000,
  c2: 63.2000,
  c3: 55.9000,
  c4: 48.6000,
  c5: 41.3000,
  c6: 34.0000,
  c7: 26.7000,
  c8: 19.4000,
  c9: 12.1000,
  c10: 4.8000,
  c11: 97.2000,
  c12: 89.9000,
  c13: 82.6000,
  c14: 75.3000,
  c15: 68.0000,
  c16: 60.7000,
  c17: 53.4000,
  c18: 46.1000,
  c19: 38.8000,
  c20: 31.5000,
  c21: 24.2000,
  c22: 16.9000,
  c23: 9.6000,
  c24: 2.3000,
  c25: 94.7000,
  c26: 87.4000,
  c27: 80.1000,
  c28: 72.8000,
  c29: 65.5000,
  c30: 58.2000,
  c31: 50.9000,
  c32: 43.6000,
  c33: 36.3000,
  c34: 29.0000,
  c35: 21.7000,
  c36: 14.4000,
  c37: 7.1000,
  c38: 99.5000,
  c39: 92.2000,
  c40: 84.9000,
  c41: 77.6000,
  c42: 70.3000,
  c43: 63.0000,
  c44: 55.7000,
  c45: 48.4000,
  c46: 41.1000,
  c47: 33.8000,
  c48: 26.5000,
  c49: 19.2000,
  c50: 11.9000,
  c51: 4.6000,
  c52: 97.0000,
  c53: 89.7000,
  c54: 82.4000,
  c55: 75.1000,
  c56: 67.8000,
  c57: 60.5000,
  c58: 53.2000,
  c59: 45.9000,
  c60: 38.6000,
  c61: 31.3000,
  c62: 24.0000,
  c63: 16.7000,
  c64: 9.4000,
  c65: 2.1000,
  c66: 94.5000,
  c67: 87.2000,
  c68: 79.9000,
  c69: 72.6000,
  c70: 65.3000,
  c71: 58.0000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_015_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_015_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_015_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_015_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_015_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_015_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_015_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_015_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_015_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_015_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
