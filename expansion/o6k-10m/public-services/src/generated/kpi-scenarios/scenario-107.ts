import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 107 — WA/education. */
export const V1014_PUBSVC_KPI_SCENARIO_107_META = {
  id: 'kpi_107',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 106054,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_107_COEF = {
  c0: 11.9000,
  c1: 49.1000,
  c2: 86.3000,
  c3: 23.8000,
  c4: 61.0000,
  c5: 98.2000,
  c6: 35.7000,
  c7: 72.9000,
  c8: 10.4000,
  c9: 47.6000,
  c10: 84.8000,
  c11: 22.3000,
  c12: 59.5000,
  c13: 96.7000,
  c14: 34.2000,
  c15: 71.4000,
  c16: 8.9000,
  c17: 46.1000,
  c18: 83.3000,
  c19: 20.8000,
  c20: 58.0000,
  c21: 95.2000,
  c22: 32.7000,
  c23: 69.9000,
  c24: 7.4000,
  c25: 44.6000,
  c26: 81.8000,
  c27: 19.3000,
  c28: 56.5000,
  c29: 93.7000,
  c30: 31.2000,
  c31: 68.4000,
  c32: 5.9000,
  c33: 43.1000,
  c34: 80.3000,
  c35: 17.8000,
  c36: 55.0000,
  c37: 92.2000,
  c38: 29.7000,
  c39: 66.9000,
  c40: 4.4000,
  c41: 41.6000,
  c42: 78.8000,
  c43: 16.3000,
  c44: 53.5000,
  c45: 90.7000,
  c46: 28.2000,
  c47: 65.4000,
  c48: 2.9000,
  c49: 40.1000,
  c50: 77.3000,
  c51: 14.8000,
  c52: 52.0000,
  c53: 89.2000,
  c54: 26.7000,
  c55: 63.9000,
  c56: 1.4000,
  c57: 38.6000,
  c58: 75.8000,
  c59: 13.3000,
  c60: 50.5000,
  c61: 87.7000,
  c62: 25.2000,
  c63: 62.4000,
  c64: 99.6000,
  c65: 37.1000,
  c66: 74.3000,
  c67: 11.8000,
  c68: 49.0000,
  c69: 86.2000,
  c70: 23.7000,
  c71: 60.9000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_107_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_107_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_107_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_107_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_107_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_107_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_107_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_107_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_107_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_107_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
