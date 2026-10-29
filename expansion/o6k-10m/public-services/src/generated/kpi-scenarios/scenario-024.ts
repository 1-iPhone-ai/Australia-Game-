import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 024 — NSW/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_024_META = {
  id: 'kpi_024',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 23801,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_024_COEF = {
  c0: 61.6000,
  c1: 48.9000,
  c2: 36.2000,
  c3: 23.5000,
  c4: 10.8000,
  c5: 97.8000,
  c6: 85.1000,
  c7: 72.4000,
  c8: 59.7000,
  c9: 47.0000,
  c10: 34.3000,
  c11: 21.6000,
  c12: 8.9000,
  c13: 95.9000,
  c14: 83.2000,
  c15: 70.5000,
  c16: 57.8000,
  c17: 45.1000,
  c18: 32.4000,
  c19: 19.7000,
  c20: 7.0000,
  c21: 94.0000,
  c22: 81.3000,
  c23: 68.6000,
  c24: 55.9000,
  c25: 43.2000,
  c26: 30.5000,
  c27: 17.8000,
  c28: 5.1000,
  c29: 92.1000,
  c30: 79.4000,
  c31: 66.7000,
  c32: 54.0000,
  c33: 41.3000,
  c34: 28.6000,
  c35: 15.9000,
  c36: 3.2000,
  c37: 90.2000,
  c38: 77.5000,
  c39: 64.8000,
  c40: 52.1000,
  c41: 39.4000,
  c42: 26.7000,
  c43: 14.0000,
  c44: 1.3000,
  c45: 88.3000,
  c46: 75.6000,
  c47: 62.9000,
  c48: 50.2000,
  c49: 37.5000,
  c50: 24.8000,
  c51: 12.1000,
  c52: 99.1000,
  c53: 86.4000,
  c54: 73.7000,
  c55: 61.0000,
  c56: 48.3000,
  c57: 35.6000,
  c58: 22.9000,
  c59: 10.2000,
  c60: 97.2000,
  c61: 84.5000,
  c62: 71.8000,
  c63: 59.1000,
  c64: 46.4000,
  c65: 33.7000,
  c66: 21.0000,
  c67: 8.3000,
  c68: 95.3000,
  c69: 82.6000,
  c70: 69.9000,
  c71: 57.2000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_024_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_024_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_024_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_024_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_024_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_024_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_024_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_024_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_024_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_024_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
