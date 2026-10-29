import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 072 — NSW/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_072_META = {
  id: 'kpi_072',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 71369,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_072_COEF = {
  c0: 74.9000,
  c1: 33.4000,
  c2: 91.6000,
  c3: 50.1000,
  c4: 8.6000,
  c5: 66.8000,
  c6: 25.3000,
  c7: 83.5000,
  c8: 42.0000,
  c9: 0.5000,
  c10: 58.7000,
  c11: 17.2000,
  c12: 75.4000,
  c13: 33.9000,
  c14: 92.1000,
  c15: 50.6000,
  c16: 9.1000,
  c17: 67.3000,
  c18: 25.8000,
  c19: 84.0000,
  c20: 42.5000,
  c21: 1.0000,
  c22: 59.2000,
  c23: 17.7000,
  c24: 75.9000,
  c25: 34.4000,
  c26: 92.6000,
  c27: 51.1000,
  c28: 9.6000,
  c29: 67.8000,
  c30: 26.3000,
  c31: 84.5000,
  c32: 43.0000,
  c33: 1.5000,
  c34: 59.7000,
  c35: 18.2000,
  c36: 76.4000,
  c37: 34.9000,
  c38: 93.1000,
  c39: 51.6000,
  c40: 10.1000,
  c41: 68.3000,
  c42: 26.8000,
  c43: 85.0000,
  c44: 43.5000,
  c45: 2.0000,
  c46: 60.2000,
  c47: 18.7000,
  c48: 76.9000,
  c49: 35.4000,
  c50: 93.6000,
  c51: 52.1000,
  c52: 10.6000,
  c53: 68.8000,
  c54: 27.3000,
  c55: 85.5000,
  c56: 44.0000,
  c57: 2.5000,
  c58: 60.7000,
  c59: 19.2000,
  c60: 77.4000,
  c61: 35.9000,
  c62: 94.1000,
  c63: 52.6000,
  c64: 11.1000,
  c65: 69.3000,
  c66: 27.8000,
  c67: 86.0000,
  c68: 44.5000,
  c69: 3.0000,
  c70: 61.2000,
  c71: 19.7000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_072_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_072_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_072_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_072_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_072_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_072_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_072_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_072_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_072_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_072_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
