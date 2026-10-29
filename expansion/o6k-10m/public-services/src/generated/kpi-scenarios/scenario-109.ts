import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 109 — TAS/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_109_META = {
  id: 'kpi_109',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 108036,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_109_COEF = {
  c0: 8.3000,
  c1: 44.3000,
  c2: 80.3000,
  c3: 16.6000,
  c4: 52.6000,
  c5: 88.6000,
  c6: 24.9000,
  c7: 60.9000,
  c8: 96.9000,
  c9: 33.2000,
  c10: 69.2000,
  c11: 5.5000,
  c12: 41.5000,
  c13: 77.5000,
  c14: 13.8000,
  c15: 49.8000,
  c16: 85.8000,
  c17: 22.1000,
  c18: 58.1000,
  c19: 94.1000,
  c20: 30.4000,
  c21: 66.4000,
  c22: 2.7000,
  c23: 38.7000,
  c24: 74.7000,
  c25: 11.0000,
  c26: 47.0000,
  c27: 83.0000,
  c28: 19.3000,
  c29: 55.3000,
  c30: 91.3000,
  c31: 27.6000,
  c32: 63.6000,
  c33: 99.6000,
  c34: 35.9000,
  c35: 71.9000,
  c36: 8.2000,
  c37: 44.2000,
  c38: 80.2000,
  c39: 16.5000,
  c40: 52.5000,
  c41: 88.5000,
  c42: 24.8000,
  c43: 60.8000,
  c44: 96.8000,
  c45: 33.1000,
  c46: 69.1000,
  c47: 5.4000,
  c48: 41.4000,
  c49: 77.4000,
  c50: 13.7000,
  c51: 49.7000,
  c52: 85.7000,
  c53: 22.0000,
  c54: 58.0000,
  c55: 94.0000,
  c56: 30.3000,
  c57: 66.3000,
  c58: 2.6000,
  c59: 38.6000,
  c60: 74.6000,
  c61: 10.9000,
  c62: 46.9000,
  c63: 82.9000,
  c64: 19.2000,
  c65: 55.2000,
  c66: 91.2000,
  c67: 27.5000,
  c68: 63.5000,
  c69: 99.5000,
  c70: 35.8000,
  c71: 71.8000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_109_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_109_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_109_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_109_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_109_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_109_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_109_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_109_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_109_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_109_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
