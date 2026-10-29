import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 043 — WA/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_043_META = {
  id: 'kpi_043',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 42630,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_043_COEF = {
  c0: 27.4000,
  c1: 3.3000,
  c2: 78.9000,
  c3: 54.8000,
  c4: 30.7000,
  c5: 6.6000,
  c6: 82.2000,
  c7: 58.1000,
  c8: 34.0000,
  c9: 9.9000,
  c10: 85.5000,
  c11: 61.4000,
  c12: 37.3000,
  c13: 13.2000,
  c14: 88.8000,
  c15: 64.7000,
  c16: 40.6000,
  c17: 16.5000,
  c18: 92.1000,
  c19: 68.0000,
  c20: 43.9000,
  c21: 19.8000,
  c22: 95.4000,
  c23: 71.3000,
  c24: 47.2000,
  c25: 23.1000,
  c26: 98.7000,
  c27: 74.6000,
  c28: 50.5000,
  c29: 26.4000,
  c30: 2.3000,
  c31: 77.9000,
  c32: 53.8000,
  c33: 29.7000,
  c34: 5.6000,
  c35: 81.2000,
  c36: 57.1000,
  c37: 33.0000,
  c38: 8.9000,
  c39: 84.5000,
  c40: 60.4000,
  c41: 36.3000,
  c42: 12.2000,
  c43: 87.8000,
  c44: 63.7000,
  c45: 39.6000,
  c46: 15.5000,
  c47: 91.1000,
  c48: 67.0000,
  c49: 42.9000,
  c50: 18.8000,
  c51: 94.4000,
  c52: 70.3000,
  c53: 46.2000,
  c54: 22.1000,
  c55: 97.7000,
  c56: 73.6000,
  c57: 49.5000,
  c58: 25.4000,
  c59: 1.3000,
  c60: 76.9000,
  c61: 52.8000,
  c62: 28.7000,
  c63: 4.6000,
  c64: 80.2000,
  c65: 56.1000,
  c66: 32.0000,
  c67: 7.9000,
  c68: 83.5000,
  c69: 59.4000,
  c70: 35.3000,
  c71: 11.2000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_043_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_043_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_043_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_043_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_043_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_043_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_043_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_043_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_043_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_043_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
