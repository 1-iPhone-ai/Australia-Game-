import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 097 — VIC/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_097_META = {
  id: 'kpi_097',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 96144,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_097_COEF = {
  c0: 29.9000,
  c1: 73.1000,
  c2: 16.6000,
  c3: 59.8000,
  c4: 3.3000,
  c5: 46.5000,
  c6: 89.7000,
  c7: 33.2000,
  c8: 76.4000,
  c9: 19.9000,
  c10: 63.1000,
  c11: 6.6000,
  c12: 49.8000,
  c13: 93.0000,
  c14: 36.5000,
  c15: 79.7000,
  c16: 23.2000,
  c17: 66.4000,
  c18: 9.9000,
  c19: 53.1000,
  c20: 96.3000,
  c21: 39.8000,
  c22: 83.0000,
  c23: 26.5000,
  c24: 69.7000,
  c25: 13.2000,
  c26: 56.4000,
  c27: 99.6000,
  c28: 43.1000,
  c29: 86.3000,
  c30: 29.8000,
  c31: 73.0000,
  c32: 16.5000,
  c33: 59.7000,
  c34: 3.2000,
  c35: 46.4000,
  c36: 89.6000,
  c37: 33.1000,
  c38: 76.3000,
  c39: 19.8000,
  c40: 63.0000,
  c41: 6.5000,
  c42: 49.7000,
  c43: 92.9000,
  c44: 36.4000,
  c45: 79.6000,
  c46: 23.1000,
  c47: 66.3000,
  c48: 9.8000,
  c49: 53.0000,
  c50: 96.2000,
  c51: 39.7000,
  c52: 82.9000,
  c53: 26.4000,
  c54: 69.6000,
  c55: 13.1000,
  c56: 56.3000,
  c57: 99.5000,
  c58: 43.0000,
  c59: 86.2000,
  c60: 29.7000,
  c61: 72.9000,
  c62: 16.4000,
  c63: 59.6000,
  c64: 3.1000,
  c65: 46.3000,
  c66: 89.5000,
  c67: 33.0000,
  c68: 76.2000,
  c69: 19.7000,
  c70: 62.9000,
  c71: 6.4000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_097_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_097_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_097_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_097_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_097_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_097_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_097_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_097_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_097_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_097_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
