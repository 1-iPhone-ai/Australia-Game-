import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 175 — ACT/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_175_META = {
  id: 'kpi_175',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 173442,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_175_COEF = {
  c0: 88.9000,
  c1: 85.3000,
  c2: 81.7000,
  c3: 78.1000,
  c4: 74.5000,
  c5: 70.9000,
  c6: 67.3000,
  c7: 63.7000,
  c8: 60.1000,
  c9: 56.5000,
  c10: 52.9000,
  c11: 49.3000,
  c12: 45.7000,
  c13: 42.1000,
  c14: 38.5000,
  c15: 34.9000,
  c16: 31.3000,
  c17: 27.7000,
  c18: 24.1000,
  c19: 20.5000,
  c20: 16.9000,
  c21: 13.3000,
  c22: 9.7000,
  c23: 6.1000,
  c24: 2.5000,
  c25: 98.6000,
  c26: 95.0000,
  c27: 91.4000,
  c28: 87.8000,
  c29: 84.2000,
  c30: 80.6000,
  c31: 77.0000,
  c32: 73.4000,
  c33: 69.8000,
  c34: 66.2000,
  c35: 62.6000,
  c36: 59.0000,
  c37: 55.4000,
  c38: 51.8000,
  c39: 48.2000,
  c40: 44.6000,
  c41: 41.0000,
  c42: 37.4000,
  c43: 33.8000,
  c44: 30.2000,
  c45: 26.6000,
  c46: 23.0000,
  c47: 19.4000,
  c48: 15.8000,
  c49: 12.2000,
  c50: 8.6000,
  c51: 5.0000,
  c52: 1.4000,
  c53: 97.5000,
  c54: 93.9000,
  c55: 90.3000,
  c56: 86.7000,
  c57: 83.1000,
  c58: 79.5000,
  c59: 75.9000,
  c60: 72.3000,
  c61: 68.7000,
  c62: 65.1000,
  c63: 61.5000,
  c64: 57.9000,
  c65: 54.3000,
  c66: 50.7000,
  c67: 47.1000,
  c68: 43.5000,
  c69: 39.9000,
  c70: 36.3000,
  c71: 32.7000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_175_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_175_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_175_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_175_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_175_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_175_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_175_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_175_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_175_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_175_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
