import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 132 — SA/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_132_META = {
  id: 'kpi_132',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 130829,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_132_COEF = {
  c0: 66.6000,
  c1: 88.8000,
  c2: 11.3000,
  c3: 33.5000,
  c4: 55.7000,
  c5: 77.9000,
  c6: 0.4000,
  c7: 22.6000,
  c8: 44.8000,
  c9: 67.0000,
  c10: 89.2000,
  c11: 11.7000,
  c12: 33.9000,
  c13: 56.1000,
  c14: 78.3000,
  c15: 0.8000,
  c16: 23.0000,
  c17: 45.2000,
  c18: 67.4000,
  c19: 89.6000,
  c20: 12.1000,
  c21: 34.3000,
  c22: 56.5000,
  c23: 78.7000,
  c24: 1.2000,
  c25: 23.4000,
  c26: 45.6000,
  c27: 67.8000,
  c28: 90.0000,
  c29: 12.5000,
  c30: 34.7000,
  c31: 56.9000,
  c32: 79.1000,
  c33: 1.6000,
  c34: 23.8000,
  c35: 46.0000,
  c36: 68.2000,
  c37: 90.4000,
  c38: 12.9000,
  c39: 35.1000,
  c40: 57.3000,
  c41: 79.5000,
  c42: 2.0000,
  c43: 24.2000,
  c44: 46.4000,
  c45: 68.6000,
  c46: 90.8000,
  c47: 13.3000,
  c48: 35.5000,
  c49: 57.7000,
  c50: 79.9000,
  c51: 2.4000,
  c52: 24.6000,
  c53: 46.8000,
  c54: 69.0000,
  c55: 91.2000,
  c56: 13.7000,
  c57: 35.9000,
  c58: 58.1000,
  c59: 80.3000,
  c60: 2.8000,
  c61: 25.0000,
  c62: 47.2000,
  c63: 69.4000,
  c64: 91.6000,
  c65: 14.1000,
  c66: 36.3000,
  c67: 58.5000,
  c68: 80.7000,
  c69: 3.2000,
  c70: 25.4000,
  c71: 47.6000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_132_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_132_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_132_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_132_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_132_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_132_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_132_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_132_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_132_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_132_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
