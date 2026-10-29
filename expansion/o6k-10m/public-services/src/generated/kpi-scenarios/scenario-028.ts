import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 028 — SA/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_028_META = {
  id: 'kpi_028',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 27765,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_028_COEF = {
  c0: 54.4000,
  c1: 39.3000,
  c2: 24.2000,
  c3: 9.1000,
  c4: 93.7000,
  c5: 78.6000,
  c6: 63.5000,
  c7: 48.4000,
  c8: 33.3000,
  c9: 18.2000,
  c10: 3.1000,
  c11: 87.7000,
  c12: 72.6000,
  c13: 57.5000,
  c14: 42.4000,
  c15: 27.3000,
  c16: 12.2000,
  c17: 96.8000,
  c18: 81.7000,
  c19: 66.6000,
  c20: 51.5000,
  c21: 36.4000,
  c22: 21.3000,
  c23: 6.2000,
  c24: 90.8000,
  c25: 75.7000,
  c26: 60.6000,
  c27: 45.5000,
  c28: 30.4000,
  c29: 15.3000,
  c30: 0.2000,
  c31: 84.8000,
  c32: 69.7000,
  c33: 54.6000,
  c34: 39.5000,
  c35: 24.4000,
  c36: 9.3000,
  c37: 93.9000,
  c38: 78.8000,
  c39: 63.7000,
  c40: 48.6000,
  c41: 33.5000,
  c42: 18.4000,
  c43: 3.3000,
  c44: 87.9000,
  c45: 72.8000,
  c46: 57.7000,
  c47: 42.6000,
  c48: 27.5000,
  c49: 12.4000,
  c50: 97.0000,
  c51: 81.9000,
  c52: 66.8000,
  c53: 51.7000,
  c54: 36.6000,
  c55: 21.5000,
  c56: 6.4000,
  c57: 91.0000,
  c58: 75.9000,
  c59: 60.8000,
  c60: 45.7000,
  c61: 30.6000,
  c62: 15.5000,
  c63: 0.4000,
  c64: 85.0000,
  c65: 69.9000,
  c66: 54.8000,
  c67: 39.7000,
  c68: 24.6000,
  c69: 9.5000,
  c70: 94.1000,
  c71: 79.0000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_028_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_028_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_028_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_028_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_028_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_028_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_028_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_028_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_028_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_028_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
