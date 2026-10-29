import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 061 — TAS/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_061_META = {
  id: 'kpi_061',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 60468,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_061_COEF = {
  c0: 94.7000,
  c1: 59.8000,
  c2: 24.9000,
  c3: 89.7000,
  c4: 54.8000,
  c5: 19.9000,
  c6: 84.7000,
  c7: 49.8000,
  c8: 14.9000,
  c9: 79.7000,
  c10: 44.8000,
  c11: 9.9000,
  c12: 74.7000,
  c13: 39.8000,
  c14: 4.9000,
  c15: 69.7000,
  c16: 34.8000,
  c17: 99.6000,
  c18: 64.7000,
  c19: 29.8000,
  c20: 94.6000,
  c21: 59.7000,
  c22: 24.8000,
  c23: 89.6000,
  c24: 54.7000,
  c25: 19.8000,
  c26: 84.6000,
  c27: 49.7000,
  c28: 14.8000,
  c29: 79.6000,
  c30: 44.7000,
  c31: 9.8000,
  c32: 74.6000,
  c33: 39.7000,
  c34: 4.8000,
  c35: 69.6000,
  c36: 34.7000,
  c37: 99.5000,
  c38: 64.6000,
  c39: 29.7000,
  c40: 94.5000,
  c41: 59.6000,
  c42: 24.7000,
  c43: 89.5000,
  c44: 54.6000,
  c45: 19.7000,
  c46: 84.5000,
  c47: 49.6000,
  c48: 14.7000,
  c49: 79.5000,
  c50: 44.6000,
  c51: 9.7000,
  c52: 74.5000,
  c53: 39.6000,
  c54: 4.7000,
  c55: 69.5000,
  c56: 34.6000,
  c57: 99.4000,
  c58: 64.5000,
  c59: 29.6000,
  c60: 94.4000,
  c61: 59.5000,
  c62: 24.6000,
  c63: 89.4000,
  c64: 54.5000,
  c65: 19.6000,
  c66: 84.4000,
  c67: 49.5000,
  c68: 14.6000,
  c69: 79.4000,
  c70: 44.5000,
  c71: 9.6000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_061_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_061_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_061_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_061_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_061_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_061_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_061_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_061_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_061_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_061_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
