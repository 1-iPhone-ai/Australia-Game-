import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 010 — QLD/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_010_META = {
  id: 'kpi_010',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 9927,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_010_COEF = {
  c0: 86.8000,
  c1: 82.5000,
  c2: 78.2000,
  c3: 73.9000,
  c4: 69.6000,
  c5: 65.3000,
  c6: 61.0000,
  c7: 56.7000,
  c8: 52.4000,
  c9: 48.1000,
  c10: 43.8000,
  c11: 39.5000,
  c12: 35.2000,
  c13: 30.9000,
  c14: 26.6000,
  c15: 22.3000,
  c16: 18.0000,
  c17: 13.7000,
  c18: 9.4000,
  c19: 5.1000,
  c20: 0.8000,
  c21: 96.2000,
  c22: 91.9000,
  c23: 87.6000,
  c24: 83.3000,
  c25: 79.0000,
  c26: 74.7000,
  c27: 70.4000,
  c28: 66.1000,
  c29: 61.8000,
  c30: 57.5000,
  c31: 53.2000,
  c32: 48.9000,
  c33: 44.6000,
  c34: 40.3000,
  c35: 36.0000,
  c36: 31.7000,
  c37: 27.4000,
  c38: 23.1000,
  c39: 18.8000,
  c40: 14.5000,
  c41: 10.2000,
  c42: 5.9000,
  c43: 1.6000,
  c44: 97.0000,
  c45: 92.7000,
  c46: 88.4000,
  c47: 84.1000,
  c48: 79.8000,
  c49: 75.5000,
  c50: 71.2000,
  c51: 66.9000,
  c52: 62.6000,
  c53: 58.3000,
  c54: 54.0000,
  c55: 49.7000,
  c56: 45.4000,
  c57: 41.1000,
  c58: 36.8000,
  c59: 32.5000,
  c60: 28.2000,
  c61: 23.9000,
  c62: 19.6000,
  c63: 15.3000,
  c64: 11.0000,
  c65: 6.7000,
  c66: 2.4000,
  c67: 97.8000,
  c68: 93.5000,
  c69: 89.2000,
  c70: 84.9000,
  c71: 80.6000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_010_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_010_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_010_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_010_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_010_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_010_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_010_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_010_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_010_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_010_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
