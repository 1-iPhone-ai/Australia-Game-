import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 004 — SA/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_004_META = {
  id: 'kpi_004',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 3981,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_004_COEF = {
  c0: 97.6000,
  c1: 96.9000,
  c2: 96.2000,
  c3: 95.5000,
  c4: 94.8000,
  c5: 94.1000,
  c6: 93.4000,
  c7: 92.7000,
  c8: 92.0000,
  c9: 91.3000,
  c10: 90.6000,
  c11: 89.9000,
  c12: 89.2000,
  c13: 88.5000,
  c14: 87.8000,
  c15: 87.1000,
  c16: 86.4000,
  c17: 85.7000,
  c18: 85.0000,
  c19: 84.3000,
  c20: 83.6000,
  c21: 82.9000,
  c22: 82.2000,
  c23: 81.5000,
  c24: 80.8000,
  c25: 80.1000,
  c26: 79.4000,
  c27: 78.7000,
  c28: 78.0000,
  c29: 77.3000,
  c30: 76.6000,
  c31: 75.9000,
  c32: 75.2000,
  c33: 74.5000,
  c34: 73.8000,
  c35: 73.1000,
  c36: 72.4000,
  c37: 71.7000,
  c38: 71.0000,
  c39: 70.3000,
  c40: 69.6000,
  c41: 68.9000,
  c42: 68.2000,
  c43: 67.5000,
  c44: 66.8000,
  c45: 66.1000,
  c46: 65.4000,
  c47: 64.7000,
  c48: 64.0000,
  c49: 63.3000,
  c50: 62.6000,
  c51: 61.9000,
  c52: 61.2000,
  c53: 60.5000,
  c54: 59.8000,
  c55: 59.1000,
  c56: 58.4000,
  c57: 57.7000,
  c58: 57.0000,
  c59: 56.3000,
  c60: 55.6000,
  c61: 54.9000,
  c62: 54.2000,
  c63: 53.5000,
  c64: 52.8000,
  c65: 52.1000,
  c66: 51.4000,
  c67: 50.7000,
  c68: 50.0000,
  c69: 49.3000,
  c70: 48.6000,
  c71: 47.9000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_004_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_004_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_004_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_004_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_004_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_004_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_004_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_004_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_004_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_004_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
