import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 113 — VIC/education. */
export const V1014_PUBSVC_KPI_SCENARIO_113_META = {
  id: 'kpi_113',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 112000,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_113_COEF = {
  c0: 1.1000,
  c1: 34.7000,
  c2: 68.3000,
  c3: 2.2000,
  c4: 35.8000,
  c5: 69.4000,
  c6: 3.3000,
  c7: 36.9000,
  c8: 70.5000,
  c9: 4.4000,
  c10: 38.0000,
  c11: 71.6000,
  c12: 5.5000,
  c13: 39.1000,
  c14: 72.7000,
  c15: 6.6000,
  c16: 40.2000,
  c17: 73.8000,
  c18: 7.7000,
  c19: 41.3000,
  c20: 74.9000,
  c21: 8.8000,
  c22: 42.4000,
  c23: 76.0000,
  c24: 9.9000,
  c25: 43.5000,
  c26: 77.1000,
  c27: 11.0000,
  c28: 44.6000,
  c29: 78.2000,
  c30: 12.1000,
  c31: 45.7000,
  c32: 79.3000,
  c33: 13.2000,
  c34: 46.8000,
  c35: 80.4000,
  c36: 14.3000,
  c37: 47.9000,
  c38: 81.5000,
  c39: 15.4000,
  c40: 49.0000,
  c41: 82.6000,
  c42: 16.5000,
  c43: 50.1000,
  c44: 83.7000,
  c45: 17.6000,
  c46: 51.2000,
  c47: 84.8000,
  c48: 18.7000,
  c49: 52.3000,
  c50: 85.9000,
  c51: 19.8000,
  c52: 53.4000,
  c53: 87.0000,
  c54: 20.9000,
  c55: 54.5000,
  c56: 88.1000,
  c57: 22.0000,
  c58: 55.6000,
  c59: 89.2000,
  c60: 23.1000,
  c61: 56.7000,
  c62: 90.3000,
  c63: 24.2000,
  c64: 57.8000,
  c65: 91.4000,
  c66: 25.3000,
  c67: 58.9000,
  c68: 92.5000,
  c69: 26.4000,
  c70: 60.0000,
  c71: 93.6000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_113_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_113_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_113_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_113_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_113_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_113_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_113_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_113_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_113_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_113_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
