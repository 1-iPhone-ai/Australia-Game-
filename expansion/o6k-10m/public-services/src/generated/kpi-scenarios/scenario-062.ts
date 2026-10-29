import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 062 — NT/education. */
export const V1014_PUBSVC_KPI_SCENARIO_062_META = {
  id: 'kpi_062',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 61459,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_062_COEF = {
  c0: 92.9000,
  c1: 57.4000,
  c2: 21.9000,
  c3: 86.1000,
  c4: 50.6000,
  c5: 15.1000,
  c6: 79.3000,
  c7: 43.8000,
  c8: 8.3000,
  c9: 72.5000,
  c10: 37.0000,
  c11: 1.5000,
  c12: 65.7000,
  c13: 30.2000,
  c14: 94.4000,
  c15: 58.9000,
  c16: 23.4000,
  c17: 87.6000,
  c18: 52.1000,
  c19: 16.6000,
  c20: 80.8000,
  c21: 45.3000,
  c22: 9.8000,
  c23: 74.0000,
  c24: 38.5000,
  c25: 3.0000,
  c26: 67.2000,
  c27: 31.7000,
  c28: 95.9000,
  c29: 60.4000,
  c30: 24.9000,
  c31: 89.1000,
  c32: 53.6000,
  c33: 18.1000,
  c34: 82.3000,
  c35: 46.8000,
  c36: 11.3000,
  c37: 75.5000,
  c38: 40.0000,
  c39: 4.5000,
  c40: 68.7000,
  c41: 33.2000,
  c42: 97.4000,
  c43: 61.9000,
  c44: 26.4000,
  c45: 90.6000,
  c46: 55.1000,
  c47: 19.6000,
  c48: 83.8000,
  c49: 48.3000,
  c50: 12.8000,
  c51: 77.0000,
  c52: 41.5000,
  c53: 6.0000,
  c54: 70.2000,
  c55: 34.7000,
  c56: 98.9000,
  c57: 63.4000,
  c58: 27.9000,
  c59: 92.1000,
  c60: 56.6000,
  c61: 21.1000,
  c62: 85.3000,
  c63: 49.8000,
  c64: 14.3000,
  c65: 78.5000,
  c66: 43.0000,
  c67: 7.5000,
  c68: 71.7000,
  c69: 36.2000,
  c70: 0.7000,
  c71: 64.9000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_062_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_062_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_062_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_062_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_062_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_062_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_062_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_062_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_062_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_062_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
