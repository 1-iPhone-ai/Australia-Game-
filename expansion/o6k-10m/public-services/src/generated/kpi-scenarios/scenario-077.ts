import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 077 — TAS/education. */
export const V1014_PUBSVC_KPI_SCENARIO_077_META = {
  id: 'kpi_077',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 76324,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_077_COEF = {
  c0: 65.9000,
  c1: 21.4000,
  c2: 76.6000,
  c3: 32.1000,
  c4: 87.3000,
  c5: 42.8000,
  c6: 98.0000,
  c7: 53.5000,
  c8: 9.0000,
  c9: 64.2000,
  c10: 19.7000,
  c11: 74.9000,
  c12: 30.4000,
  c13: 85.6000,
  c14: 41.1000,
  c15: 96.3000,
  c16: 51.8000,
  c17: 7.3000,
  c18: 62.5000,
  c19: 18.0000,
  c20: 73.2000,
  c21: 28.7000,
  c22: 83.9000,
  c23: 39.4000,
  c24: 94.6000,
  c25: 50.1000,
  c26: 5.6000,
  c27: 60.8000,
  c28: 16.3000,
  c29: 71.5000,
  c30: 27.0000,
  c31: 82.2000,
  c32: 37.7000,
  c33: 92.9000,
  c34: 48.4000,
  c35: 3.9000,
  c36: 59.1000,
  c37: 14.6000,
  c38: 69.8000,
  c39: 25.3000,
  c40: 80.5000,
  c41: 36.0000,
  c42: 91.2000,
  c43: 46.7000,
  c44: 2.2000,
  c45: 57.4000,
  c46: 12.9000,
  c47: 68.1000,
  c48: 23.6000,
  c49: 78.8000,
  c50: 34.3000,
  c51: 89.5000,
  c52: 45.0000,
  c53: 0.5000,
  c54: 55.7000,
  c55: 11.2000,
  c56: 66.4000,
  c57: 21.9000,
  c58: 77.1000,
  c59: 32.6000,
  c60: 87.8000,
  c61: 43.3000,
  c62: 98.5000,
  c63: 54.0000,
  c64: 9.5000,
  c65: 64.7000,
  c66: 20.2000,
  c67: 75.4000,
  c68: 30.9000,
  c69: 86.1000,
  c70: 41.6000,
  c71: 96.8000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_077_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_077_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_077_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_077_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_077_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_077_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_077_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_077_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_077_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_077_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
