import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 056 — NSW/education. */
export const V1014_PUBSVC_KPI_SCENARIO_056_META = {
  id: 'kpi_056',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 55513,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_056_COEF = {
  c0: 4.0000,
  c1: 71.8000,
  c2: 39.9000,
  c3: 8.0000,
  c4: 75.8000,
  c5: 43.9000,
  c6: 12.0000,
  c7: 79.8000,
  c8: 47.9000,
  c9: 16.0000,
  c10: 83.8000,
  c11: 51.9000,
  c12: 20.0000,
  c13: 87.8000,
  c14: 55.9000,
  c15: 24.0000,
  c16: 91.8000,
  c17: 59.9000,
  c18: 28.0000,
  c19: 95.8000,
  c20: 63.9000,
  c21: 32.0000,
  c22: 0.1000,
  c23: 67.9000,
  c24: 36.0000,
  c25: 4.1000,
  c26: 71.9000,
  c27: 40.0000,
  c28: 8.1000,
  c29: 75.9000,
  c30: 44.0000,
  c31: 12.1000,
  c32: 79.9000,
  c33: 48.0000,
  c34: 16.1000,
  c35: 83.9000,
  c36: 52.0000,
  c37: 20.1000,
  c38: 87.9000,
  c39: 56.0000,
  c40: 24.1000,
  c41: 91.9000,
  c42: 60.0000,
  c43: 28.1000,
  c44: 95.9000,
  c45: 64.0000,
  c46: 32.1000,
  c47: 0.2000,
  c48: 68.0000,
  c49: 36.1000,
  c50: 4.2000,
  c51: 72.0000,
  c52: 40.1000,
  c53: 8.2000,
  c54: 76.0000,
  c55: 44.1000,
  c56: 12.2000,
  c57: 80.0000,
  c58: 48.1000,
  c59: 16.2000,
  c60: 84.0000,
  c61: 52.1000,
  c62: 20.2000,
  c63: 88.0000,
  c64: 56.1000,
  c65: 24.2000,
  c66: 92.0000,
  c67: 60.1000,
  c68: 28.2000,
  c69: 96.0000,
  c70: 64.1000,
  c71: 32.2000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_056_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_056_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_056_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_056_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_056_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_056_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_056_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_056_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_056_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_056_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
