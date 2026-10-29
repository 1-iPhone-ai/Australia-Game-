import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 142 — NT/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_142_META = {
  id: 'kpi_142',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 140739,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_142_COEF = {
  c0: 48.6000,
  c1: 64.8000,
  c2: 81.0000,
  c3: 97.2000,
  c4: 13.7000,
  c5: 29.9000,
  c6: 46.1000,
  c7: 62.3000,
  c8: 78.5000,
  c9: 94.7000,
  c10: 11.2000,
  c11: 27.4000,
  c12: 43.6000,
  c13: 59.8000,
  c14: 76.0000,
  c15: 92.2000,
  c16: 8.7000,
  c17: 24.9000,
  c18: 41.1000,
  c19: 57.3000,
  c20: 73.5000,
  c21: 89.7000,
  c22: 6.2000,
  c23: 22.4000,
  c24: 38.6000,
  c25: 54.8000,
  c26: 71.0000,
  c27: 87.2000,
  c28: 3.7000,
  c29: 19.9000,
  c30: 36.1000,
  c31: 52.3000,
  c32: 68.5000,
  c33: 84.7000,
  c34: 1.2000,
  c35: 17.4000,
  c36: 33.6000,
  c37: 49.8000,
  c38: 66.0000,
  c39: 82.2000,
  c40: 98.4000,
  c41: 14.9000,
  c42: 31.1000,
  c43: 47.3000,
  c44: 63.5000,
  c45: 79.7000,
  c46: 95.9000,
  c47: 12.4000,
  c48: 28.6000,
  c49: 44.8000,
  c50: 61.0000,
  c51: 77.2000,
  c52: 93.4000,
  c53: 9.9000,
  c54: 26.1000,
  c55: 42.3000,
  c56: 58.5000,
  c57: 74.7000,
  c58: 90.9000,
  c59: 7.4000,
  c60: 23.6000,
  c61: 39.8000,
  c62: 56.0000,
  c63: 72.2000,
  c64: 88.4000,
  c65: 4.9000,
  c66: 21.1000,
  c67: 37.3000,
  c68: 53.5000,
  c69: 69.7000,
  c70: 85.9000,
  c71: 2.4000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_142_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_142_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_142_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_142_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_142_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_142_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_142_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_142_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_142_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_142_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
