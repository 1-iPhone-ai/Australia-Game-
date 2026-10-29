import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 038 — NT/education. */
export const V1014_PUBSVC_KPI_SCENARIO_038_META = {
  id: 'kpi_038',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 37675,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_038_COEF = {
  c0: 36.4000,
  c1: 15.3000,
  c2: 93.9000,
  c3: 72.8000,
  c4: 51.7000,
  c5: 30.6000,
  c6: 9.5000,
  c7: 88.1000,
  c8: 67.0000,
  c9: 45.9000,
  c10: 24.8000,
  c11: 3.7000,
  c12: 82.3000,
  c13: 61.2000,
  c14: 40.1000,
  c15: 19.0000,
  c16: 97.6000,
  c17: 76.5000,
  c18: 55.4000,
  c19: 34.3000,
  c20: 13.2000,
  c21: 91.8000,
  c22: 70.7000,
  c23: 49.6000,
  c24: 28.5000,
  c25: 7.4000,
  c26: 86.0000,
  c27: 64.9000,
  c28: 43.8000,
  c29: 22.7000,
  c30: 1.6000,
  c31: 80.2000,
  c32: 59.1000,
  c33: 38.0000,
  c34: 16.9000,
  c35: 95.5000,
  c36: 74.4000,
  c37: 53.3000,
  c38: 32.2000,
  c39: 11.1000,
  c40: 89.7000,
  c41: 68.6000,
  c42: 47.5000,
  c43: 26.4000,
  c44: 5.3000,
  c45: 83.9000,
  c46: 62.8000,
  c47: 41.7000,
  c48: 20.6000,
  c49: 99.2000,
  c50: 78.1000,
  c51: 57.0000,
  c52: 35.9000,
  c53: 14.8000,
  c54: 93.4000,
  c55: 72.3000,
  c56: 51.2000,
  c57: 30.1000,
  c58: 9.0000,
  c59: 87.6000,
  c60: 66.5000,
  c61: 45.4000,
  c62: 24.3000,
  c63: 3.2000,
  c64: 81.8000,
  c65: 60.7000,
  c66: 39.6000,
  c67: 18.5000,
  c68: 97.1000,
  c69: 76.0000,
  c70: 54.9000,
  c71: 33.8000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_038_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_038_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_038_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_038_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_038_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_038_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_038_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_038_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_038_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_038_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
