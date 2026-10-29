import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 176 — NSW/education. */
export const V1014_PUBSVC_KPI_SCENARIO_176_META = {
  id: 'kpi_176',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 174433,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_176_COEF = {
  c0: 87.1000,
  c1: 82.9000,
  c2: 78.7000,
  c3: 74.5000,
  c4: 70.3000,
  c5: 66.1000,
  c6: 61.9000,
  c7: 57.7000,
  c8: 53.5000,
  c9: 49.3000,
  c10: 45.1000,
  c11: 40.9000,
  c12: 36.7000,
  c13: 32.5000,
  c14: 28.3000,
  c15: 24.1000,
  c16: 19.9000,
  c17: 15.7000,
  c18: 11.5000,
  c19: 7.3000,
  c20: 3.1000,
  c21: 98.6000,
  c22: 94.4000,
  c23: 90.2000,
  c24: 86.0000,
  c25: 81.8000,
  c26: 77.6000,
  c27: 73.4000,
  c28: 69.2000,
  c29: 65.0000,
  c30: 60.8000,
  c31: 56.6000,
  c32: 52.4000,
  c33: 48.2000,
  c34: 44.0000,
  c35: 39.8000,
  c36: 35.6000,
  c37: 31.4000,
  c38: 27.2000,
  c39: 23.0000,
  c40: 18.8000,
  c41: 14.6000,
  c42: 10.4000,
  c43: 6.2000,
  c44: 2.0000,
  c45: 97.5000,
  c46: 93.3000,
  c47: 89.1000,
  c48: 84.9000,
  c49: 80.7000,
  c50: 76.5000,
  c51: 72.3000,
  c52: 68.1000,
  c53: 63.9000,
  c54: 59.7000,
  c55: 55.5000,
  c56: 51.3000,
  c57: 47.1000,
  c58: 42.9000,
  c59: 38.7000,
  c60: 34.5000,
  c61: 30.3000,
  c62: 26.1000,
  c63: 21.9000,
  c64: 17.7000,
  c65: 13.5000,
  c66: 9.3000,
  c67: 5.1000,
  c68: 0.9000,
  c69: 96.4000,
  c70: 92.2000,
  c71: 88.0000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_176_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_176_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_176_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_176_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_176_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_176_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_176_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_176_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_176_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_176_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
