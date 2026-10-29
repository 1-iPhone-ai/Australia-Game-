import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 058 — QLD/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_058_META = {
  id: 'kpi_058',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 57495,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_058_COEF = {
  c0: 0.4000,
  c1: 67.0000,
  c2: 33.9000,
  c3: 0.8000,
  c4: 67.4000,
  c5: 34.3000,
  c6: 1.2000,
  c7: 67.8000,
  c8: 34.7000,
  c9: 1.6000,
  c10: 68.2000,
  c11: 35.1000,
  c12: 2.0000,
  c13: 68.6000,
  c14: 35.5000,
  c15: 2.4000,
  c16: 69.0000,
  c17: 35.9000,
  c18: 2.8000,
  c19: 69.4000,
  c20: 36.3000,
  c21: 3.2000,
  c22: 69.8000,
  c23: 36.7000,
  c24: 3.6000,
  c25: 70.2000,
  c26: 37.1000,
  c27: 4.0000,
  c28: 70.6000,
  c29: 37.5000,
  c30: 4.4000,
  c31: 71.0000,
  c32: 37.9000,
  c33: 4.8000,
  c34: 71.4000,
  c35: 38.3000,
  c36: 5.2000,
  c37: 71.8000,
  c38: 38.7000,
  c39: 5.6000,
  c40: 72.2000,
  c41: 39.1000,
  c42: 6.0000,
  c43: 72.6000,
  c44: 39.5000,
  c45: 6.4000,
  c46: 73.0000,
  c47: 39.9000,
  c48: 6.8000,
  c49: 73.4000,
  c50: 40.3000,
  c51: 7.2000,
  c52: 73.8000,
  c53: 40.7000,
  c54: 7.6000,
  c55: 74.2000,
  c56: 41.1000,
  c57: 8.0000,
  c58: 74.6000,
  c59: 41.5000,
  c60: 8.4000,
  c61: 75.0000,
  c62: 41.9000,
  c63: 8.8000,
  c64: 75.4000,
  c65: 42.3000,
  c66: 9.2000,
  c67: 75.8000,
  c68: 42.7000,
  c69: 9.6000,
  c70: 76.2000,
  c71: 43.1000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_058_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_058_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_058_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_058_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_058_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_058_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_058_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_058_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_058_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_058_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
