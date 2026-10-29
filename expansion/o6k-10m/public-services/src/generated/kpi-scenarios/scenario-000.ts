import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 000 — NSW/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_000_META = {
  id: 'kpi_000',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 17,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_000_COEF = {
  c0: 5.1000,
  c1: 6.8000,
  c2: 8.5000,
  c3: 10.2000,
  c4: 11.9000,
  c5: 13.6000,
  c6: 15.3000,
  c7: 17.0000,
  c8: 18.7000,
  c9: 20.4000,
  c10: 22.1000,
  c11: 23.8000,
  c12: 25.5000,
  c13: 27.2000,
  c14: 28.9000,
  c15: 30.6000,
  c16: 32.3000,
  c17: 34.0000,
  c18: 35.7000,
  c19: 37.4000,
  c20: 39.1000,
  c21: 40.8000,
  c22: 42.5000,
  c23: 44.2000,
  c24: 45.9000,
  c25: 47.6000,
  c26: 49.3000,
  c27: 51.0000,
  c28: 52.7000,
  c29: 54.4000,
  c30: 56.1000,
  c31: 57.8000,
  c32: 59.5000,
  c33: 61.2000,
  c34: 62.9000,
  c35: 64.6000,
  c36: 66.3000,
  c37: 68.0000,
  c38: 69.7000,
  c39: 71.4000,
  c40: 73.1000,
  c41: 74.8000,
  c42: 76.5000,
  c43: 78.2000,
  c44: 79.9000,
  c45: 81.6000,
  c46: 83.3000,
  c47: 85.0000,
  c48: 86.7000,
  c49: 88.4000,
  c50: 90.1000,
  c51: 91.8000,
  c52: 93.5000,
  c53: 95.2000,
  c54: 96.9000,
  c55: 98.6000,
  c56: 0.6000,
  c57: 2.3000,
  c58: 4.0000,
  c59: 5.7000,
  c60: 7.4000,
  c61: 9.1000,
  c62: 10.8000,
  c63: 12.5000,
  c64: 14.2000,
  c65: 15.9000,
  c66: 17.6000,
  c67: 19.3000,
  c68: 21.0000,
  c69: 22.7000,
  c70: 24.4000,
  c71: 26.1000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_000_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_000_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_000_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_000_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_000_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_000_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_000_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_000_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_000_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_000_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
