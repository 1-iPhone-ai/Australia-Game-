import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 124 — SA/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_124_META = {
  id: 'kpi_124',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 122901,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_124_COEF = {
  c0: 81.0000,
  c1: 8.3000,
  c2: 35.3000,
  c3: 62.3000,
  c4: 89.3000,
  c5: 16.6000,
  c6: 43.6000,
  c7: 70.6000,
  c8: 97.6000,
  c9: 24.9000,
  c10: 51.9000,
  c11: 78.9000,
  c12: 6.2000,
  c13: 33.2000,
  c14: 60.2000,
  c15: 87.2000,
  c16: 14.5000,
  c17: 41.5000,
  c18: 68.5000,
  c19: 95.5000,
  c20: 22.8000,
  c21: 49.8000,
  c22: 76.8000,
  c23: 4.1000,
  c24: 31.1000,
  c25: 58.1000,
  c26: 85.1000,
  c27: 12.4000,
  c28: 39.4000,
  c29: 66.4000,
  c30: 93.4000,
  c31: 20.7000,
  c32: 47.7000,
  c33: 74.7000,
  c34: 2.0000,
  c35: 29.0000,
  c36: 56.0000,
  c37: 83.0000,
  c38: 10.3000,
  c39: 37.3000,
  c40: 64.3000,
  c41: 91.3000,
  c42: 18.6000,
  c43: 45.6000,
  c44: 72.6000,
  c45: 99.6000,
  c46: 26.9000,
  c47: 53.9000,
  c48: 80.9000,
  c49: 8.2000,
  c50: 35.2000,
  c51: 62.2000,
  c52: 89.2000,
  c53: 16.5000,
  c54: 43.5000,
  c55: 70.5000,
  c56: 97.5000,
  c57: 24.8000,
  c58: 51.8000,
  c59: 78.8000,
  c60: 6.1000,
  c61: 33.1000,
  c62: 60.1000,
  c63: 87.1000,
  c64: 14.4000,
  c65: 41.4000,
  c66: 68.4000,
  c67: 95.4000,
  c68: 22.7000,
  c69: 49.7000,
  c70: 76.7000,
  c71: 4.0000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_124_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_124_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_124_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_124_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_124_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_124_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_124_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_124_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_124_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_124_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
