import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 115 — WA/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_115_META = {
  id: 'kpi_115',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 113982,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_115_COEF = {
  c0: 97.2000,
  c1: 29.9000,
  c2: 62.3000,
  c3: 94.7000,
  c4: 27.4000,
  c5: 59.8000,
  c6: 92.2000,
  c7: 24.9000,
  c8: 57.3000,
  c9: 89.7000,
  c10: 22.4000,
  c11: 54.8000,
  c12: 87.2000,
  c13: 19.9000,
  c14: 52.3000,
  c15: 84.7000,
  c16: 17.4000,
  c17: 49.8000,
  c18: 82.2000,
  c19: 14.9000,
  c20: 47.3000,
  c21: 79.7000,
  c22: 12.4000,
  c23: 44.8000,
  c24: 77.2000,
  c25: 9.9000,
  c26: 42.3000,
  c27: 74.7000,
  c28: 7.4000,
  c29: 39.8000,
  c30: 72.2000,
  c31: 4.9000,
  c32: 37.3000,
  c33: 69.7000,
  c34: 2.4000,
  c35: 34.8000,
  c36: 67.2000,
  c37: 99.6000,
  c38: 32.3000,
  c39: 64.7000,
  c40: 97.1000,
  c41: 29.8000,
  c42: 62.2000,
  c43: 94.6000,
  c44: 27.3000,
  c45: 59.7000,
  c46: 92.1000,
  c47: 24.8000,
  c48: 57.2000,
  c49: 89.6000,
  c50: 22.3000,
  c51: 54.7000,
  c52: 87.1000,
  c53: 19.8000,
  c54: 52.2000,
  c55: 84.6000,
  c56: 17.3000,
  c57: 49.7000,
  c58: 82.1000,
  c59: 14.8000,
  c60: 47.2000,
  c61: 79.6000,
  c62: 12.3000,
  c63: 44.7000,
  c64: 77.1000,
  c65: 9.8000,
  c66: 42.2000,
  c67: 74.6000,
  c68: 7.3000,
  c69: 39.7000,
  c70: 72.1000,
  c71: 4.8000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_115_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_115_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_115_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_115_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_115_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_115_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_115_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_115_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_115_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_115_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
