import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 048 — NSW/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_048_META = {
  id: 'kpi_048',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 47585,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_048_COEF = {
  c0: 18.4000,
  c1: 91.0000,
  c2: 63.9000,
  c3: 36.8000,
  c4: 9.7000,
  c5: 82.3000,
  c6: 55.2000,
  c7: 28.1000,
  c8: 1.0000,
  c9: 73.6000,
  c10: 46.5000,
  c11: 19.4000,
  c12: 92.0000,
  c13: 64.9000,
  c14: 37.8000,
  c15: 10.7000,
  c16: 83.3000,
  c17: 56.2000,
  c18: 29.1000,
  c19: 2.0000,
  c20: 74.6000,
  c21: 47.5000,
  c22: 20.4000,
  c23: 93.0000,
  c24: 65.9000,
  c25: 38.8000,
  c26: 11.7000,
  c27: 84.3000,
  c28: 57.2000,
  c29: 30.1000,
  c30: 3.0000,
  c31: 75.6000,
  c32: 48.5000,
  c33: 21.4000,
  c34: 94.0000,
  c35: 66.9000,
  c36: 39.8000,
  c37: 12.7000,
  c38: 85.3000,
  c39: 58.2000,
  c40: 31.1000,
  c41: 4.0000,
  c42: 76.6000,
  c43: 49.5000,
  c44: 22.4000,
  c45: 95.0000,
  c46: 67.9000,
  c47: 40.8000,
  c48: 13.7000,
  c49: 86.3000,
  c50: 59.2000,
  c51: 32.1000,
  c52: 5.0000,
  c53: 77.6000,
  c54: 50.5000,
  c55: 23.4000,
  c56: 96.0000,
  c57: 68.9000,
  c58: 41.8000,
  c59: 14.7000,
  c60: 87.3000,
  c61: 60.2000,
  c62: 33.1000,
  c63: 6.0000,
  c64: 78.6000,
  c65: 51.5000,
  c66: 24.4000,
  c67: 97.0000,
  c68: 69.9000,
  c69: 42.8000,
  c70: 15.7000,
  c71: 88.3000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_048_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_048_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_048_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_048_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_048_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_048_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_048_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_048_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_048_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_048_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
