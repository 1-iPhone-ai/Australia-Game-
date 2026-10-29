import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 023 — ACT/education. */
export const V1014_PUBSVC_KPI_SCENARIO_023_META = {
  id: 'kpi_023',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 22810,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_023_COEF = {
  c0: 63.4000,
  c1: 51.3000,
  c2: 39.2000,
  c3: 27.1000,
  c4: 15.0000,
  c5: 2.9000,
  c6: 90.5000,
  c7: 78.4000,
  c8: 66.3000,
  c9: 54.2000,
  c10: 42.1000,
  c11: 30.0000,
  c12: 17.9000,
  c13: 5.8000,
  c14: 93.4000,
  c15: 81.3000,
  c16: 69.2000,
  c17: 57.1000,
  c18: 45.0000,
  c19: 32.9000,
  c20: 20.8000,
  c21: 8.7000,
  c22: 96.3000,
  c23: 84.2000,
  c24: 72.1000,
  c25: 60.0000,
  c26: 47.9000,
  c27: 35.8000,
  c28: 23.7000,
  c29: 11.6000,
  c30: 99.2000,
  c31: 87.1000,
  c32: 75.0000,
  c33: 62.9000,
  c34: 50.8000,
  c35: 38.7000,
  c36: 26.6000,
  c37: 14.5000,
  c38: 2.4000,
  c39: 90.0000,
  c40: 77.9000,
  c41: 65.8000,
  c42: 53.7000,
  c43: 41.6000,
  c44: 29.5000,
  c45: 17.4000,
  c46: 5.3000,
  c47: 92.9000,
  c48: 80.8000,
  c49: 68.7000,
  c50: 56.6000,
  c51: 44.5000,
  c52: 32.4000,
  c53: 20.3000,
  c54: 8.2000,
  c55: 95.8000,
  c56: 83.7000,
  c57: 71.6000,
  c58: 59.5000,
  c59: 47.4000,
  c60: 35.3000,
  c61: 23.2000,
  c62: 11.1000,
  c63: 98.7000,
  c64: 86.6000,
  c65: 74.5000,
  c66: 62.4000,
  c67: 50.3000,
  c68: 38.2000,
  c69: 26.1000,
  c70: 14.0000,
  c71: 1.9000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_023_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_023_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_023_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_023_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_023_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_023_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_023_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_023_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_023_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_023_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
