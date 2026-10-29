import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 087 — ACT/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_087_META = {
  id: 'kpi_087',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 86234,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_087_COEF = {
  c0: 47.9000,
  c1: 97.1000,
  c2: 46.6000,
  c3: 95.8000,
  c4: 45.3000,
  c5: 94.5000,
  c6: 44.0000,
  c7: 93.2000,
  c8: 42.7000,
  c9: 91.9000,
  c10: 41.4000,
  c11: 90.6000,
  c12: 40.1000,
  c13: 89.3000,
  c14: 38.8000,
  c15: 88.0000,
  c16: 37.5000,
  c17: 86.7000,
  c18: 36.2000,
  c19: 85.4000,
  c20: 34.9000,
  c21: 84.1000,
  c22: 33.6000,
  c23: 82.8000,
  c24: 32.3000,
  c25: 81.5000,
  c26: 31.0000,
  c27: 80.2000,
  c28: 29.7000,
  c29: 78.9000,
  c30: 28.4000,
  c31: 77.6000,
  c32: 27.1000,
  c33: 76.3000,
  c34: 25.8000,
  c35: 75.0000,
  c36: 24.5000,
  c37: 73.7000,
  c38: 23.2000,
  c39: 72.4000,
  c40: 21.9000,
  c41: 71.1000,
  c42: 20.6000,
  c43: 69.8000,
  c44: 19.3000,
  c45: 68.5000,
  c46: 18.0000,
  c47: 67.2000,
  c48: 16.7000,
  c49: 65.9000,
  c50: 15.4000,
  c51: 64.6000,
  c52: 14.1000,
  c53: 63.3000,
  c54: 12.8000,
  c55: 62.0000,
  c56: 11.5000,
  c57: 60.7000,
  c58: 10.2000,
  c59: 59.4000,
  c60: 8.9000,
  c61: 58.1000,
  c62: 7.6000,
  c63: 56.8000,
  c64: 6.3000,
  c65: 55.5000,
  c66: 5.0000,
  c67: 54.2000,
  c68: 3.7000,
  c69: 52.9000,
  c70: 2.4000,
  c71: 51.6000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_087_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_087_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_087_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_087_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_087_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_087_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_087_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_087_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_087_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_087_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
