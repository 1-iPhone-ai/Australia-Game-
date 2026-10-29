import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 063 — ACT/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_063_META = {
  id: 'kpi_063',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 62450,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_063_COEF = {
  c0: 91.1000,
  c1: 55.0000,
  c2: 18.9000,
  c3: 82.5000,
  c4: 46.4000,
  c5: 10.3000,
  c6: 73.9000,
  c7: 37.8000,
  c8: 1.7000,
  c9: 65.3000,
  c10: 29.2000,
  c11: 92.8000,
  c12: 56.7000,
  c13: 20.6000,
  c14: 84.2000,
  c15: 48.1000,
  c16: 12.0000,
  c17: 75.6000,
  c18: 39.5000,
  c19: 3.4000,
  c20: 67.0000,
  c21: 30.9000,
  c22: 94.5000,
  c23: 58.4000,
  c24: 22.3000,
  c25: 85.9000,
  c26: 49.8000,
  c27: 13.7000,
  c28: 77.3000,
  c29: 41.2000,
  c30: 5.1000,
  c31: 68.7000,
  c32: 32.6000,
  c33: 96.2000,
  c34: 60.1000,
  c35: 24.0000,
  c36: 87.6000,
  c37: 51.5000,
  c38: 15.4000,
  c39: 79.0000,
  c40: 42.9000,
  c41: 6.8000,
  c42: 70.4000,
  c43: 34.3000,
  c44: 97.9000,
  c45: 61.8000,
  c46: 25.7000,
  c47: 89.3000,
  c48: 53.2000,
  c49: 17.1000,
  c50: 80.7000,
  c51: 44.6000,
  c52: 8.5000,
  c53: 72.1000,
  c54: 36.0000,
  c55: 99.6000,
  c56: 63.5000,
  c57: 27.4000,
  c58: 91.0000,
  c59: 54.9000,
  c60: 18.8000,
  c61: 82.4000,
  c62: 46.3000,
  c63: 10.2000,
  c64: 73.8000,
  c65: 37.7000,
  c66: 1.6000,
  c67: 65.2000,
  c68: 29.1000,
  c69: 92.7000,
  c70: 56.6000,
  c71: 20.5000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_063_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_063_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_063_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_063_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_063_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_063_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_063_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_063_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_063_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_063_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
