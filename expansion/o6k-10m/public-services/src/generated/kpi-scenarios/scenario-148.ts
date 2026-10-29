import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 148 — SA/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_148_META = {
  id: 'kpi_148',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 146685,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_148_COEF = {
  c0: 37.8000,
  c1: 50.4000,
  c2: 63.0000,
  c3: 75.6000,
  c4: 88.2000,
  c5: 1.1000,
  c6: 13.7000,
  c7: 26.3000,
  c8: 38.9000,
  c9: 51.5000,
  c10: 64.1000,
  c11: 76.7000,
  c12: 89.3000,
  c13: 2.2000,
  c14: 14.8000,
  c15: 27.4000,
  c16: 40.0000,
  c17: 52.6000,
  c18: 65.2000,
  c19: 77.8000,
  c20: 90.4000,
  c21: 3.3000,
  c22: 15.9000,
  c23: 28.5000,
  c24: 41.1000,
  c25: 53.7000,
  c26: 66.3000,
  c27: 78.9000,
  c28: 91.5000,
  c29: 4.4000,
  c30: 17.0000,
  c31: 29.6000,
  c32: 42.2000,
  c33: 54.8000,
  c34: 67.4000,
  c35: 80.0000,
  c36: 92.6000,
  c37: 5.5000,
  c38: 18.1000,
  c39: 30.7000,
  c40: 43.3000,
  c41: 55.9000,
  c42: 68.5000,
  c43: 81.1000,
  c44: 93.7000,
  c45: 6.6000,
  c46: 19.2000,
  c47: 31.8000,
  c48: 44.4000,
  c49: 57.0000,
  c50: 69.6000,
  c51: 82.2000,
  c52: 94.8000,
  c53: 7.7000,
  c54: 20.3000,
  c55: 32.9000,
  c56: 45.5000,
  c57: 58.1000,
  c58: 70.7000,
  c59: 83.3000,
  c60: 95.9000,
  c61: 8.8000,
  c62: 21.4000,
  c63: 34.0000,
  c64: 46.6000,
  c65: 59.2000,
  c66: 71.8000,
  c67: 84.4000,
  c68: 97.0000,
  c69: 9.9000,
  c70: 22.5000,
  c71: 35.1000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_148_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_148_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_148_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_148_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_148_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_148_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_148_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_148_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_148_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_148_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
