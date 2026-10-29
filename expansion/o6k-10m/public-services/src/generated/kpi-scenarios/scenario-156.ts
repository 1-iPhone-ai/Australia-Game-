import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 156 — SA/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_156_META = {
  id: 'kpi_156',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 154613,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_156_COEF = {
  c0: 23.4000,
  c1: 31.2000,
  c2: 39.0000,
  c3: 46.8000,
  c4: 54.6000,
  c5: 62.4000,
  c6: 70.2000,
  c7: 78.0000,
  c8: 85.8000,
  c9: 93.6000,
  c10: 1.7000,
  c11: 9.5000,
  c12: 17.3000,
  c13: 25.1000,
  c14: 32.9000,
  c15: 40.7000,
  c16: 48.5000,
  c17: 56.3000,
  c18: 64.1000,
  c19: 71.9000,
  c20: 79.7000,
  c21: 87.5000,
  c22: 95.3000,
  c23: 3.4000,
  c24: 11.2000,
  c25: 19.0000,
  c26: 26.8000,
  c27: 34.6000,
  c28: 42.4000,
  c29: 50.2000,
  c30: 58.0000,
  c31: 65.8000,
  c32: 73.6000,
  c33: 81.4000,
  c34: 89.2000,
  c35: 97.0000,
  c36: 5.1000,
  c37: 12.9000,
  c38: 20.7000,
  c39: 28.5000,
  c40: 36.3000,
  c41: 44.1000,
  c42: 51.9000,
  c43: 59.7000,
  c44: 67.5000,
  c45: 75.3000,
  c46: 83.1000,
  c47: 90.9000,
  c48: 98.7000,
  c49: 6.8000,
  c50: 14.6000,
  c51: 22.4000,
  c52: 30.2000,
  c53: 38.0000,
  c54: 45.8000,
  c55: 53.6000,
  c56: 61.4000,
  c57: 69.2000,
  c58: 77.0000,
  c59: 84.8000,
  c60: 92.6000,
  c61: 0.7000,
  c62: 8.5000,
  c63: 16.3000,
  c64: 24.1000,
  c65: 31.9000,
  c66: 39.7000,
  c67: 47.5000,
  c68: 55.3000,
  c69: 63.1000,
  c70: 70.9000,
  c71: 78.7000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_156_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_156_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_156_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_156_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_156_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_156_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_156_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_156_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_156_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_156_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
