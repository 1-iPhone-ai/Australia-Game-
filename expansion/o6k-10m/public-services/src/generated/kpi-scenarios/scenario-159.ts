import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 159 — ACT/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_159_META = {
  id: 'kpi_159',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 157586,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_159_COEF = {
  c0: 18.0000,
  c1: 24.0000,
  c2: 30.0000,
  c3: 36.0000,
  c4: 42.0000,
  c5: 48.0000,
  c6: 54.0000,
  c7: 60.0000,
  c8: 66.0000,
  c9: 72.0000,
  c10: 78.0000,
  c11: 84.0000,
  c12: 90.0000,
  c13: 96.0000,
  c14: 2.3000,
  c15: 8.3000,
  c16: 14.3000,
  c17: 20.3000,
  c18: 26.3000,
  c19: 32.3000,
  c20: 38.3000,
  c21: 44.3000,
  c22: 50.3000,
  c23: 56.3000,
  c24: 62.3000,
  c25: 68.3000,
  c26: 74.3000,
  c27: 80.3000,
  c28: 86.3000,
  c29: 92.3000,
  c30: 98.3000,
  c31: 4.6000,
  c32: 10.6000,
  c33: 16.6000,
  c34: 22.6000,
  c35: 28.6000,
  c36: 34.6000,
  c37: 40.6000,
  c38: 46.6000,
  c39: 52.6000,
  c40: 58.6000,
  c41: 64.6000,
  c42: 70.6000,
  c43: 76.6000,
  c44: 82.6000,
  c45: 88.6000,
  c46: 94.6000,
  c47: 0.9000,
  c48: 6.9000,
  c49: 12.9000,
  c50: 18.9000,
  c51: 24.9000,
  c52: 30.9000,
  c53: 36.9000,
  c54: 42.9000,
  c55: 48.9000,
  c56: 54.9000,
  c57: 60.9000,
  c58: 66.9000,
  c59: 72.9000,
  c60: 78.9000,
  c61: 84.9000,
  c62: 90.9000,
  c63: 96.9000,
  c64: 3.2000,
  c65: 9.2000,
  c66: 15.2000,
  c67: 21.2000,
  c68: 27.2000,
  c69: 33.2000,
  c70: 39.2000,
  c71: 45.2000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_159_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_159_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_159_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_159_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_159_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_159_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_159_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_159_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_159_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_159_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
