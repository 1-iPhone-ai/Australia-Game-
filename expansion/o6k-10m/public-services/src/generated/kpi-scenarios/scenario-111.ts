import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 111 — ACT/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_111_META = {
  id: 'kpi_111',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 110018,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_111_COEF = {
  c0: 4.7000,
  c1: 39.5000,
  c2: 74.3000,
  c3: 9.4000,
  c4: 44.2000,
  c5: 79.0000,
  c6: 14.1000,
  c7: 48.9000,
  c8: 83.7000,
  c9: 18.8000,
  c10: 53.6000,
  c11: 88.4000,
  c12: 23.5000,
  c13: 58.3000,
  c14: 93.1000,
  c15: 28.2000,
  c16: 63.0000,
  c17: 97.8000,
  c18: 32.9000,
  c19: 67.7000,
  c20: 2.8000,
  c21: 37.6000,
  c22: 72.4000,
  c23: 7.5000,
  c24: 42.3000,
  c25: 77.1000,
  c26: 12.2000,
  c27: 47.0000,
  c28: 81.8000,
  c29: 16.9000,
  c30: 51.7000,
  c31: 86.5000,
  c32: 21.6000,
  c33: 56.4000,
  c34: 91.2000,
  c35: 26.3000,
  c36: 61.1000,
  c37: 95.9000,
  c38: 31.0000,
  c39: 65.8000,
  c40: 0.9000,
  c41: 35.7000,
  c42: 70.5000,
  c43: 5.6000,
  c44: 40.4000,
  c45: 75.2000,
  c46: 10.3000,
  c47: 45.1000,
  c48: 79.9000,
  c49: 15.0000,
  c50: 49.8000,
  c51: 84.6000,
  c52: 19.7000,
  c53: 54.5000,
  c54: 89.3000,
  c55: 24.4000,
  c56: 59.2000,
  c57: 94.0000,
  c58: 29.1000,
  c59: 63.9000,
  c60: 98.7000,
  c61: 33.8000,
  c62: 68.6000,
  c63: 3.7000,
  c64: 38.5000,
  c65: 73.3000,
  c66: 8.4000,
  c67: 43.2000,
  c68: 78.0000,
  c69: 13.1000,
  c70: 47.9000,
  c71: 82.7000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_111_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_111_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_111_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_111_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_111_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_111_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_111_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_111_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_111_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_111_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
