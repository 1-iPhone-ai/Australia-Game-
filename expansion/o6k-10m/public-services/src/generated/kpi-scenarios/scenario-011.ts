import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 011 — WA/education. */
export const V1014_PUBSVC_KPI_SCENARIO_011_META = {
  id: 'kpi_011',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 10918,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_011_COEF = {
  c0: 85.0000,
  c1: 80.1000,
  c2: 75.2000,
  c3: 70.3000,
  c4: 65.4000,
  c5: 60.5000,
  c6: 55.6000,
  c7: 50.7000,
  c8: 45.8000,
  c9: 40.9000,
  c10: 36.0000,
  c11: 31.1000,
  c12: 26.2000,
  c13: 21.3000,
  c14: 16.4000,
  c15: 11.5000,
  c16: 6.6000,
  c17: 1.7000,
  c18: 96.5000,
  c19: 91.6000,
  c20: 86.7000,
  c21: 81.8000,
  c22: 76.9000,
  c23: 72.0000,
  c24: 67.1000,
  c25: 62.2000,
  c26: 57.3000,
  c27: 52.4000,
  c28: 47.5000,
  c29: 42.6000,
  c30: 37.7000,
  c31: 32.8000,
  c32: 27.9000,
  c33: 23.0000,
  c34: 18.1000,
  c35: 13.2000,
  c36: 8.3000,
  c37: 3.4000,
  c38: 98.2000,
  c39: 93.3000,
  c40: 88.4000,
  c41: 83.5000,
  c42: 78.6000,
  c43: 73.7000,
  c44: 68.8000,
  c45: 63.9000,
  c46: 59.0000,
  c47: 54.1000,
  c48: 49.2000,
  c49: 44.3000,
  c50: 39.4000,
  c51: 34.5000,
  c52: 29.6000,
  c53: 24.7000,
  c54: 19.8000,
  c55: 14.9000,
  c56: 10.0000,
  c57: 5.1000,
  c58: 0.2000,
  c59: 95.0000,
  c60: 90.1000,
  c61: 85.2000,
  c62: 80.3000,
  c63: 75.4000,
  c64: 70.5000,
  c65: 65.6000,
  c66: 60.7000,
  c67: 55.8000,
  c68: 50.9000,
  c69: 46.0000,
  c70: 41.1000,
  c71: 36.2000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_011_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_011_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_011_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_011_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_011_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_011_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_011_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_011_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_011_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_011_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
