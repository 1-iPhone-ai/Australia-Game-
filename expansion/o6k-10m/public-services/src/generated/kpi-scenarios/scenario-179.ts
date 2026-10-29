import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 179 — WA/education. */
export const V1014_PUBSVC_KPI_SCENARIO_179_META = {
  id: 'kpi_179',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 177406,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_179_COEF = {
  c0: 81.7000,
  c1: 75.7000,
  c2: 69.7000,
  c3: 63.7000,
  c4: 57.7000,
  c5: 51.7000,
  c6: 45.7000,
  c7: 39.7000,
  c8: 33.7000,
  c9: 27.7000,
  c10: 21.7000,
  c11: 15.7000,
  c12: 9.7000,
  c13: 3.7000,
  c14: 97.4000,
  c15: 91.4000,
  c16: 85.4000,
  c17: 79.4000,
  c18: 73.4000,
  c19: 67.4000,
  c20: 61.4000,
  c21: 55.4000,
  c22: 49.4000,
  c23: 43.4000,
  c24: 37.4000,
  c25: 31.4000,
  c26: 25.4000,
  c27: 19.4000,
  c28: 13.4000,
  c29: 7.4000,
  c30: 1.4000,
  c31: 95.1000,
  c32: 89.1000,
  c33: 83.1000,
  c34: 77.1000,
  c35: 71.1000,
  c36: 65.1000,
  c37: 59.1000,
  c38: 53.1000,
  c39: 47.1000,
  c40: 41.1000,
  c41: 35.1000,
  c42: 29.1000,
  c43: 23.1000,
  c44: 17.1000,
  c45: 11.1000,
  c46: 5.1000,
  c47: 98.8000,
  c48: 92.8000,
  c49: 86.8000,
  c50: 80.8000,
  c51: 74.8000,
  c52: 68.8000,
  c53: 62.8000,
  c54: 56.8000,
  c55: 50.8000,
  c56: 44.8000,
  c57: 38.8000,
  c58: 32.8000,
  c59: 26.8000,
  c60: 20.8000,
  c61: 14.8000,
  c62: 8.8000,
  c63: 2.8000,
  c64: 96.5000,
  c65: 90.5000,
  c66: 84.5000,
  c67: 78.5000,
  c68: 72.5000,
  c69: 66.5000,
  c70: 60.5000,
  c71: 54.5000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_179_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_179_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_179_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_179_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_179_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_179_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_179_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_179_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_179_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_179_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
