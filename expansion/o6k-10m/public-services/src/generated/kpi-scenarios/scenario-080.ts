import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 080 — NSW/education. */
export const V1014_PUBSVC_KPI_SCENARIO_080_META = {
  id: 'kpi_080',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 79297,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_080_COEF = {
  c0: 60.5000,
  c1: 14.2000,
  c2: 67.6000,
  c3: 21.3000,
  c4: 74.7000,
  c5: 28.4000,
  c6: 81.8000,
  c7: 35.5000,
  c8: 88.9000,
  c9: 42.6000,
  c10: 96.0000,
  c11: 49.7000,
  c12: 3.4000,
  c13: 56.8000,
  c14: 10.5000,
  c15: 63.9000,
  c16: 17.6000,
  c17: 71.0000,
  c18: 24.7000,
  c19: 78.1000,
  c20: 31.8000,
  c21: 85.2000,
  c22: 38.9000,
  c23: 92.3000,
  c24: 46.0000,
  c25: 99.4000,
  c26: 53.1000,
  c27: 6.8000,
  c28: 60.2000,
  c29: 13.9000,
  c30: 67.3000,
  c31: 21.0000,
  c32: 74.4000,
  c33: 28.1000,
  c34: 81.5000,
  c35: 35.2000,
  c36: 88.6000,
  c37: 42.3000,
  c38: 95.7000,
  c39: 49.4000,
  c40: 3.1000,
  c41: 56.5000,
  c42: 10.2000,
  c43: 63.6000,
  c44: 17.3000,
  c45: 70.7000,
  c46: 24.4000,
  c47: 77.8000,
  c48: 31.5000,
  c49: 84.9000,
  c50: 38.6000,
  c51: 92.0000,
  c52: 45.7000,
  c53: 99.1000,
  c54: 52.8000,
  c55: 6.5000,
  c56: 59.9000,
  c57: 13.6000,
  c58: 67.0000,
  c59: 20.7000,
  c60: 74.1000,
  c61: 27.8000,
  c62: 81.2000,
  c63: 34.9000,
  c64: 88.3000,
  c65: 42.0000,
  c66: 95.4000,
  c67: 49.1000,
  c68: 2.8000,
  c69: 56.2000,
  c70: 9.9000,
  c71: 63.3000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_080_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_080_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_080_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_080_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_080_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_080_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_080_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_080_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_080_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_080_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
