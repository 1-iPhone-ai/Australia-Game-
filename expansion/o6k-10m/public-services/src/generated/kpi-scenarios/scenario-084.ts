import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 084 — SA/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_084_META = {
  id: 'kpi_084',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 83261,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_084_COEF = {
  c0: 53.3000,
  c1: 4.6000,
  c2: 55.6000,
  c3: 6.9000,
  c4: 57.9000,
  c5: 9.2000,
  c6: 60.2000,
  c7: 11.5000,
  c8: 62.5000,
  c9: 13.8000,
  c10: 64.8000,
  c11: 16.1000,
  c12: 67.1000,
  c13: 18.4000,
  c14: 69.4000,
  c15: 20.7000,
  c16: 71.7000,
  c17: 23.0000,
  c18: 74.0000,
  c19: 25.3000,
  c20: 76.3000,
  c21: 27.6000,
  c22: 78.6000,
  c23: 29.9000,
  c24: 80.9000,
  c25: 32.2000,
  c26: 83.2000,
  c27: 34.5000,
  c28: 85.5000,
  c29: 36.8000,
  c30: 87.8000,
  c31: 39.1000,
  c32: 90.1000,
  c33: 41.4000,
  c34: 92.4000,
  c35: 43.7000,
  c36: 94.7000,
  c37: 46.0000,
  c38: 97.0000,
  c39: 48.3000,
  c40: 99.3000,
  c41: 50.6000,
  c42: 1.9000,
  c43: 52.9000,
  c44: 4.2000,
  c45: 55.2000,
  c46: 6.5000,
  c47: 57.5000,
  c48: 8.8000,
  c49: 59.8000,
  c50: 11.1000,
  c51: 62.1000,
  c52: 13.4000,
  c53: 64.4000,
  c54: 15.7000,
  c55: 66.7000,
  c56: 18.0000,
  c57: 69.0000,
  c58: 20.3000,
  c59: 71.3000,
  c60: 22.6000,
  c61: 73.6000,
  c62: 24.9000,
  c63: 75.9000,
  c64: 27.2000,
  c65: 78.2000,
  c66: 29.5000,
  c67: 80.5000,
  c68: 31.8000,
  c69: 82.8000,
  c70: 34.1000,
  c71: 85.1000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_084_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_084_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_084_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_084_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_084_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_084_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_084_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_084_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_084_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_084_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
