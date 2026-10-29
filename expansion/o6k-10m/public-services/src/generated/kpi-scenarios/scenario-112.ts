import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 112 — NSW/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_112_META = {
  id: 'kpi_112',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 111009,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_112_COEF = {
  c0: 2.9000,
  c1: 37.1000,
  c2: 71.3000,
  c3: 5.8000,
  c4: 40.0000,
  c5: 74.2000,
  c6: 8.7000,
  c7: 42.9000,
  c8: 77.1000,
  c9: 11.6000,
  c10: 45.8000,
  c11: 80.0000,
  c12: 14.5000,
  c13: 48.7000,
  c14: 82.9000,
  c15: 17.4000,
  c16: 51.6000,
  c17: 85.8000,
  c18: 20.3000,
  c19: 54.5000,
  c20: 88.7000,
  c21: 23.2000,
  c22: 57.4000,
  c23: 91.6000,
  c24: 26.1000,
  c25: 60.3000,
  c26: 94.5000,
  c27: 29.0000,
  c28: 63.2000,
  c29: 97.4000,
  c30: 31.9000,
  c31: 66.1000,
  c32: 0.6000,
  c33: 34.8000,
  c34: 69.0000,
  c35: 3.5000,
  c36: 37.7000,
  c37: 71.9000,
  c38: 6.4000,
  c39: 40.6000,
  c40: 74.8000,
  c41: 9.3000,
  c42: 43.5000,
  c43: 77.7000,
  c44: 12.2000,
  c45: 46.4000,
  c46: 80.6000,
  c47: 15.1000,
  c48: 49.3000,
  c49: 83.5000,
  c50: 18.0000,
  c51: 52.2000,
  c52: 86.4000,
  c53: 20.9000,
  c54: 55.1000,
  c55: 89.3000,
  c56: 23.8000,
  c57: 58.0000,
  c58: 92.2000,
  c59: 26.7000,
  c60: 60.9000,
  c61: 95.1000,
  c62: 29.6000,
  c63: 63.8000,
  c64: 98.0000,
  c65: 32.5000,
  c66: 66.7000,
  c67: 1.2000,
  c68: 35.4000,
  c69: 69.6000,
  c70: 4.1000,
  c71: 38.3000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_112_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_112_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_112_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_112_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_112_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_112_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_112_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_112_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_112_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_112_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
