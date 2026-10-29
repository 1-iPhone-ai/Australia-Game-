import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 168 — NSW/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_168_META = {
  id: 'kpi_168',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 166505,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_168_COEF = {
  c0: 1.8000,
  c1: 2.4000,
  c2: 3.0000,
  c3: 3.6000,
  c4: 4.2000,
  c5: 4.8000,
  c6: 5.4000,
  c7: 6.0000,
  c8: 6.6000,
  c9: 7.2000,
  c10: 7.8000,
  c11: 8.4000,
  c12: 9.0000,
  c13: 9.6000,
  c14: 10.2000,
  c15: 10.8000,
  c16: 11.4000,
  c17: 12.0000,
  c18: 12.6000,
  c19: 13.2000,
  c20: 13.8000,
  c21: 14.4000,
  c22: 15.0000,
  c23: 15.6000,
  c24: 16.2000,
  c25: 16.8000,
  c26: 17.4000,
  c27: 18.0000,
  c28: 18.6000,
  c29: 19.2000,
  c30: 19.8000,
  c31: 20.4000,
  c32: 21.0000,
  c33: 21.6000,
  c34: 22.2000,
  c35: 22.8000,
  c36: 23.4000,
  c37: 24.0000,
  c38: 24.6000,
  c39: 25.2000,
  c40: 25.8000,
  c41: 26.4000,
  c42: 27.0000,
  c43: 27.6000,
  c44: 28.2000,
  c45: 28.8000,
  c46: 29.4000,
  c47: 30.0000,
  c48: 30.6000,
  c49: 31.2000,
  c50: 31.8000,
  c51: 32.4000,
  c52: 33.0000,
  c53: 33.6000,
  c54: 34.2000,
  c55: 34.8000,
  c56: 35.4000,
  c57: 36.0000,
  c58: 36.6000,
  c59: 37.2000,
  c60: 37.8000,
  c61: 38.4000,
  c62: 39.0000,
  c63: 39.6000,
  c64: 40.2000,
  c65: 40.8000,
  c66: 41.4000,
  c67: 42.0000,
  c68: 42.6000,
  c69: 43.2000,
  c70: 43.8000,
  c71: 44.4000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_168_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_168_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_168_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_168_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_168_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_168_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_168_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_168_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_168_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_168_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
