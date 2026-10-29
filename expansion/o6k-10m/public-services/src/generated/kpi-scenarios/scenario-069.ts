import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 069 — TAS/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_069_META = {
  id: 'kpi_069',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 68396,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_069_COEF = {
  c0: 80.3000,
  c1: 40.6000,
  c2: 0.9000,
  c3: 60.9000,
  c4: 21.2000,
  c5: 81.2000,
  c6: 41.5000,
  c7: 1.8000,
  c8: 61.8000,
  c9: 22.1000,
  c10: 82.1000,
  c11: 42.4000,
  c12: 2.7000,
  c13: 62.7000,
  c14: 23.0000,
  c15: 83.0000,
  c16: 43.3000,
  c17: 3.6000,
  c18: 63.6000,
  c19: 23.9000,
  c20: 83.9000,
  c21: 44.2000,
  c22: 4.5000,
  c23: 64.5000,
  c24: 24.8000,
  c25: 84.8000,
  c26: 45.1000,
  c27: 5.4000,
  c28: 65.4000,
  c29: 25.7000,
  c30: 85.7000,
  c31: 46.0000,
  c32: 6.3000,
  c33: 66.3000,
  c34: 26.6000,
  c35: 86.6000,
  c36: 46.9000,
  c37: 7.2000,
  c38: 67.2000,
  c39: 27.5000,
  c40: 87.5000,
  c41: 47.8000,
  c42: 8.1000,
  c43: 68.1000,
  c44: 28.4000,
  c45: 88.4000,
  c46: 48.7000,
  c47: 9.0000,
  c48: 69.0000,
  c49: 29.3000,
  c50: 89.3000,
  c51: 49.6000,
  c52: 9.9000,
  c53: 69.9000,
  c54: 30.2000,
  c55: 90.2000,
  c56: 50.5000,
  c57: 10.8000,
  c58: 70.8000,
  c59: 31.1000,
  c60: 91.1000,
  c61: 51.4000,
  c62: 11.7000,
  c63: 71.7000,
  c64: 32.0000,
  c65: 92.0000,
  c66: 52.3000,
  c67: 12.6000,
  c68: 72.6000,
  c69: 32.9000,
  c70: 92.9000,
  c71: 53.2000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_069_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_069_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_069_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_069_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_069_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_069_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_069_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_069_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_069_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_069_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
