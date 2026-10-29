import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 170 — QLD/education. */
export const V1014_PUBSVC_KPI_SCENARIO_170_META = {
  id: 'kpi_170',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 168487,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_170_COEF = {
  c0: 97.9000,
  c1: 97.3000,
  c2: 96.7000,
  c3: 96.1000,
  c4: 95.5000,
  c5: 94.9000,
  c6: 94.3000,
  c7: 93.7000,
  c8: 93.1000,
  c9: 92.5000,
  c10: 91.9000,
  c11: 91.3000,
  c12: 90.7000,
  c13: 90.1000,
  c14: 89.5000,
  c15: 88.9000,
  c16: 88.3000,
  c17: 87.7000,
  c18: 87.1000,
  c19: 86.5000,
  c20: 85.9000,
  c21: 85.3000,
  c22: 84.7000,
  c23: 84.1000,
  c24: 83.5000,
  c25: 82.9000,
  c26: 82.3000,
  c27: 81.7000,
  c28: 81.1000,
  c29: 80.5000,
  c30: 79.9000,
  c31: 79.3000,
  c32: 78.7000,
  c33: 78.1000,
  c34: 77.5000,
  c35: 76.9000,
  c36: 76.3000,
  c37: 75.7000,
  c38: 75.1000,
  c39: 74.5000,
  c40: 73.9000,
  c41: 73.3000,
  c42: 72.7000,
  c43: 72.1000,
  c44: 71.5000,
  c45: 70.9000,
  c46: 70.3000,
  c47: 69.7000,
  c48: 69.1000,
  c49: 68.5000,
  c50: 67.9000,
  c51: 67.3000,
  c52: 66.7000,
  c53: 66.1000,
  c54: 65.5000,
  c55: 64.9000,
  c56: 64.3000,
  c57: 63.7000,
  c58: 63.1000,
  c59: 62.5000,
  c60: 61.9000,
  c61: 61.3000,
  c62: 60.7000,
  c63: 60.1000,
  c64: 59.5000,
  c65: 58.9000,
  c66: 58.3000,
  c67: 57.7000,
  c68: 57.1000,
  c69: 56.5000,
  c70: 55.9000,
  c71: 55.3000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_170_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_170_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_170_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_170_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_170_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_170_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_170_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_170_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_170_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_170_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
