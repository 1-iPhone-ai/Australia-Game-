import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 101 — TAS/education. */
export const V1014_PUBSVC_KPI_SCENARIO_101_META = {
  id: 'kpi_101',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 100108,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_101_COEF = {
  c0: 22.7000,
  c1: 63.5000,
  c2: 4.6000,
  c3: 45.4000,
  c4: 86.2000,
  c5: 27.3000,
  c6: 68.1000,
  c7: 9.2000,
  c8: 50.0000,
  c9: 90.8000,
  c10: 31.9000,
  c11: 72.7000,
  c12: 13.8000,
  c13: 54.6000,
  c14: 95.4000,
  c15: 36.5000,
  c16: 77.3000,
  c17: 18.4000,
  c18: 59.2000,
  c19: 0.3000,
  c20: 41.1000,
  c21: 81.9000,
  c22: 23.0000,
  c23: 63.8000,
  c24: 4.9000,
  c25: 45.7000,
  c26: 86.5000,
  c27: 27.6000,
  c28: 68.4000,
  c29: 9.5000,
  c30: 50.3000,
  c31: 91.1000,
  c32: 32.2000,
  c33: 73.0000,
  c34: 14.1000,
  c35: 54.9000,
  c36: 95.7000,
  c37: 36.8000,
  c38: 77.6000,
  c39: 18.7000,
  c40: 59.5000,
  c41: 0.6000,
  c42: 41.4000,
  c43: 82.2000,
  c44: 23.3000,
  c45: 64.1000,
  c46: 5.2000,
  c47: 46.0000,
  c48: 86.8000,
  c49: 27.9000,
  c50: 68.7000,
  c51: 9.8000,
  c52: 50.6000,
  c53: 91.4000,
  c54: 32.5000,
  c55: 73.3000,
  c56: 14.4000,
  c57: 55.2000,
  c58: 96.0000,
  c59: 37.1000,
  c60: 77.9000,
  c61: 19.0000,
  c62: 59.8000,
  c63: 0.9000,
  c64: 41.7000,
  c65: 82.5000,
  c66: 23.6000,
  c67: 64.4000,
  c68: 5.5000,
  c69: 46.3000,
  c70: 87.1000,
  c71: 28.2000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_101_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_101_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_101_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_101_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_101_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_101_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_101_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_101_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_101_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_101_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
