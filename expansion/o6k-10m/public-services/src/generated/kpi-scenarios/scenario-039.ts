import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 039 — ACT/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_039_META = {
  id: 'kpi_039',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 38666,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_039_COEF = {
  c0: 34.6000,
  c1: 12.9000,
  c2: 90.9000,
  c3: 69.2000,
  c4: 47.5000,
  c5: 25.8000,
  c6: 4.1000,
  c7: 82.1000,
  c8: 60.4000,
  c9: 38.7000,
  c10: 17.0000,
  c11: 95.0000,
  c12: 73.3000,
  c13: 51.6000,
  c14: 29.9000,
  c15: 8.2000,
  c16: 86.2000,
  c17: 64.5000,
  c18: 42.8000,
  c19: 21.1000,
  c20: 99.1000,
  c21: 77.4000,
  c22: 55.7000,
  c23: 34.0000,
  c24: 12.3000,
  c25: 90.3000,
  c26: 68.6000,
  c27: 46.9000,
  c28: 25.2000,
  c29: 3.5000,
  c30: 81.5000,
  c31: 59.8000,
  c32: 38.1000,
  c33: 16.4000,
  c34: 94.4000,
  c35: 72.7000,
  c36: 51.0000,
  c37: 29.3000,
  c38: 7.6000,
  c39: 85.6000,
  c40: 63.9000,
  c41: 42.2000,
  c42: 20.5000,
  c43: 98.5000,
  c44: 76.8000,
  c45: 55.1000,
  c46: 33.4000,
  c47: 11.7000,
  c48: 89.7000,
  c49: 68.0000,
  c50: 46.3000,
  c51: 24.6000,
  c52: 2.9000,
  c53: 80.9000,
  c54: 59.2000,
  c55: 37.5000,
  c56: 15.8000,
  c57: 93.8000,
  c58: 72.1000,
  c59: 50.4000,
  c60: 28.7000,
  c61: 7.0000,
  c62: 85.0000,
  c63: 63.3000,
  c64: 41.6000,
  c65: 19.9000,
  c66: 97.9000,
  c67: 76.2000,
  c68: 54.5000,
  c69: 32.8000,
  c70: 11.1000,
  c71: 89.1000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_039_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_039_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_039_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_039_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_039_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_039_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_039_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_039_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_039_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_039_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
