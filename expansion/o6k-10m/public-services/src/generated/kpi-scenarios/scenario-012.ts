import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 012 — SA/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_012_META = {
  id: 'kpi_012',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 11909,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_012_COEF = {
  c0: 83.2000,
  c1: 77.7000,
  c2: 72.2000,
  c3: 66.7000,
  c4: 61.2000,
  c5: 55.7000,
  c6: 50.2000,
  c7: 44.7000,
  c8: 39.2000,
  c9: 33.7000,
  c10: 28.2000,
  c11: 22.7000,
  c12: 17.2000,
  c13: 11.7000,
  c14: 6.2000,
  c15: 0.7000,
  c16: 94.9000,
  c17: 89.4000,
  c18: 83.9000,
  c19: 78.4000,
  c20: 72.9000,
  c21: 67.4000,
  c22: 61.9000,
  c23: 56.4000,
  c24: 50.9000,
  c25: 45.4000,
  c26: 39.9000,
  c27: 34.4000,
  c28: 28.9000,
  c29: 23.4000,
  c30: 17.9000,
  c31: 12.4000,
  c32: 6.9000,
  c33: 1.4000,
  c34: 95.6000,
  c35: 90.1000,
  c36: 84.6000,
  c37: 79.1000,
  c38: 73.6000,
  c39: 68.1000,
  c40: 62.6000,
  c41: 57.1000,
  c42: 51.6000,
  c43: 46.1000,
  c44: 40.6000,
  c45: 35.1000,
  c46: 29.6000,
  c47: 24.1000,
  c48: 18.6000,
  c49: 13.1000,
  c50: 7.6000,
  c51: 2.1000,
  c52: 96.3000,
  c53: 90.8000,
  c54: 85.3000,
  c55: 79.8000,
  c56: 74.3000,
  c57: 68.8000,
  c58: 63.3000,
  c59: 57.8000,
  c60: 52.3000,
  c61: 46.8000,
  c62: 41.3000,
  c63: 35.8000,
  c64: 30.3000,
  c65: 24.8000,
  c66: 19.3000,
  c67: 13.8000,
  c68: 8.3000,
  c69: 2.8000,
  c70: 97.0000,
  c71: 91.5000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_012_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_012_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_012_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_012_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_012_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_012_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_012_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_012_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_012_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_012_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
