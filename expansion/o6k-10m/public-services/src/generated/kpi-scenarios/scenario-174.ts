import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 174 — NT/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_174_META = {
  id: 'kpi_174',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 172451,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_174_COEF = {
  c0: 90.7000,
  c1: 87.7000,
  c2: 84.7000,
  c3: 81.7000,
  c4: 78.7000,
  c5: 75.7000,
  c6: 72.7000,
  c7: 69.7000,
  c8: 66.7000,
  c9: 63.7000,
  c10: 60.7000,
  c11: 57.7000,
  c12: 54.7000,
  c13: 51.7000,
  c14: 48.7000,
  c15: 45.7000,
  c16: 42.7000,
  c17: 39.7000,
  c18: 36.7000,
  c19: 33.7000,
  c20: 30.7000,
  c21: 27.7000,
  c22: 24.7000,
  c23: 21.7000,
  c24: 18.7000,
  c25: 15.7000,
  c26: 12.7000,
  c27: 9.7000,
  c28: 6.7000,
  c29: 3.7000,
  c30: 0.7000,
  c31: 97.4000,
  c32: 94.4000,
  c33: 91.4000,
  c34: 88.4000,
  c35: 85.4000,
  c36: 82.4000,
  c37: 79.4000,
  c38: 76.4000,
  c39: 73.4000,
  c40: 70.4000,
  c41: 67.4000,
  c42: 64.4000,
  c43: 61.4000,
  c44: 58.4000,
  c45: 55.4000,
  c46: 52.4000,
  c47: 49.4000,
  c48: 46.4000,
  c49: 43.4000,
  c50: 40.4000,
  c51: 37.4000,
  c52: 34.4000,
  c53: 31.4000,
  c54: 28.4000,
  c55: 25.4000,
  c56: 22.4000,
  c57: 19.4000,
  c58: 16.4000,
  c59: 13.4000,
  c60: 10.4000,
  c61: 7.4000,
  c62: 4.4000,
  c63: 1.4000,
  c64: 98.1000,
  c65: 95.1000,
  c66: 92.1000,
  c67: 89.1000,
  c68: 86.1000,
  c69: 83.1000,
  c70: 80.1000,
  c71: 77.1000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_174_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_174_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_174_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_174_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_174_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_174_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_174_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_174_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_174_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_174_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
