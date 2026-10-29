import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 036 — SA/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_036_META = {
  id: 'kpi_036',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 35693,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_036_COEF = {
  c0: 40.0000,
  c1: 20.1000,
  c2: 0.2000,
  c3: 80.0000,
  c4: 60.1000,
  c5: 40.2000,
  c6: 20.3000,
  c7: 0.4000,
  c8: 80.2000,
  c9: 60.3000,
  c10: 40.4000,
  c11: 20.5000,
  c12: 0.6000,
  c13: 80.4000,
  c14: 60.5000,
  c15: 40.6000,
  c16: 20.7000,
  c17: 0.8000,
  c18: 80.6000,
  c19: 60.7000,
  c20: 40.8000,
  c21: 20.9000,
  c22: 1.0000,
  c23: 80.8000,
  c24: 60.9000,
  c25: 41.0000,
  c26: 21.1000,
  c27: 1.2000,
  c28: 81.0000,
  c29: 61.1000,
  c30: 41.2000,
  c31: 21.3000,
  c32: 1.4000,
  c33: 81.2000,
  c34: 61.3000,
  c35: 41.4000,
  c36: 21.5000,
  c37: 1.6000,
  c38: 81.4000,
  c39: 61.5000,
  c40: 41.6000,
  c41: 21.7000,
  c42: 1.8000,
  c43: 81.6000,
  c44: 61.7000,
  c45: 41.8000,
  c46: 21.9000,
  c47: 2.0000,
  c48: 81.8000,
  c49: 61.9000,
  c50: 42.0000,
  c51: 22.1000,
  c52: 2.2000,
  c53: 82.0000,
  c54: 62.1000,
  c55: 42.2000,
  c56: 22.3000,
  c57: 2.4000,
  c58: 82.2000,
  c59: 62.3000,
  c60: 42.4000,
  c61: 22.5000,
  c62: 2.6000,
  c63: 82.4000,
  c64: 62.5000,
  c65: 42.6000,
  c66: 22.7000,
  c67: 2.8000,
  c68: 82.6000,
  c69: 62.7000,
  c70: 42.8000,
  c71: 22.9000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_036_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_036_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_036_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_036_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_036_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_036_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_036_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_036_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_036_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_036_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
