import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 021 — TAS/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_021_META = {
  id: 'kpi_021',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 20828,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_021_COEF = {
  c0: 67.0000,
  c1: 56.1000,
  c2: 45.2000,
  c3: 34.3000,
  c4: 23.4000,
  c5: 12.5000,
  c6: 1.6000,
  c7: 90.4000,
  c8: 79.5000,
  c9: 68.6000,
  c10: 57.7000,
  c11: 46.8000,
  c12: 35.9000,
  c13: 25.0000,
  c14: 14.1000,
  c15: 3.2000,
  c16: 92.0000,
  c17: 81.1000,
  c18: 70.2000,
  c19: 59.3000,
  c20: 48.4000,
  c21: 37.5000,
  c22: 26.6000,
  c23: 15.7000,
  c24: 4.8000,
  c25: 93.6000,
  c26: 82.7000,
  c27: 71.8000,
  c28: 60.9000,
  c29: 50.0000,
  c30: 39.1000,
  c31: 28.2000,
  c32: 17.3000,
  c33: 6.4000,
  c34: 95.2000,
  c35: 84.3000,
  c36: 73.4000,
  c37: 62.5000,
  c38: 51.6000,
  c39: 40.7000,
  c40: 29.8000,
  c41: 18.9000,
  c42: 8.0000,
  c43: 96.8000,
  c44: 85.9000,
  c45: 75.0000,
  c46: 64.1000,
  c47: 53.2000,
  c48: 42.3000,
  c49: 31.4000,
  c50: 20.5000,
  c51: 9.6000,
  c52: 98.4000,
  c53: 87.5000,
  c54: 76.6000,
  c55: 65.7000,
  c56: 54.8000,
  c57: 43.9000,
  c58: 33.0000,
  c59: 22.1000,
  c60: 11.2000,
  c61: 0.3000,
  c62: 89.1000,
  c63: 78.2000,
  c64: 67.3000,
  c65: 56.4000,
  c66: 45.5000,
  c67: 34.6000,
  c68: 23.7000,
  c69: 12.8000,
  c70: 1.9000,
  c71: 90.7000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_021_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_021_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_021_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_021_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_021_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_021_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_021_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_021_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_021_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_021_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
