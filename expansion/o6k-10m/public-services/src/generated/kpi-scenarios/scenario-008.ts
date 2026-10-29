import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 008 — NSW/education. */
export const V1014_PUBSVC_KPI_SCENARIO_008_META = {
  id: 'kpi_008',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 7945,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_008_COEF = {
  c0: 90.4000,
  c1: 87.3000,
  c2: 84.2000,
  c3: 81.1000,
  c4: 78.0000,
  c5: 74.9000,
  c6: 71.8000,
  c7: 68.7000,
  c8: 65.6000,
  c9: 62.5000,
  c10: 59.4000,
  c11: 56.3000,
  c12: 53.2000,
  c13: 50.1000,
  c14: 47.0000,
  c15: 43.9000,
  c16: 40.8000,
  c17: 37.7000,
  c18: 34.6000,
  c19: 31.5000,
  c20: 28.4000,
  c21: 25.3000,
  c22: 22.2000,
  c23: 19.1000,
  c24: 16.0000,
  c25: 12.9000,
  c26: 9.8000,
  c27: 6.7000,
  c28: 3.6000,
  c29: 0.5000,
  c30: 97.1000,
  c31: 94.0000,
  c32: 90.9000,
  c33: 87.8000,
  c34: 84.7000,
  c35: 81.6000,
  c36: 78.5000,
  c37: 75.4000,
  c38: 72.3000,
  c39: 69.2000,
  c40: 66.1000,
  c41: 63.0000,
  c42: 59.9000,
  c43: 56.8000,
  c44: 53.7000,
  c45: 50.6000,
  c46: 47.5000,
  c47: 44.4000,
  c48: 41.3000,
  c49: 38.2000,
  c50: 35.1000,
  c51: 32.0000,
  c52: 28.9000,
  c53: 25.8000,
  c54: 22.7000,
  c55: 19.6000,
  c56: 16.5000,
  c57: 13.4000,
  c58: 10.3000,
  c59: 7.2000,
  c60: 4.1000,
  c61: 1.0000,
  c62: 97.6000,
  c63: 94.5000,
  c64: 91.4000,
  c65: 88.3000,
  c66: 85.2000,
  c67: 82.1000,
  c68: 79.0000,
  c69: 75.9000,
  c70: 72.8000,
  c71: 69.7000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_008_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_008_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_008_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_008_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_008_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_008_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_008_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_008_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_008_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_008_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
