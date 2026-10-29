import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 001 — VIC/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_001_META = {
  id: 'kpi_001',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 1008,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_001_COEF = {
  c0: 3.3000,
  c1: 4.4000,
  c2: 5.5000,
  c3: 6.6000,
  c4: 7.7000,
  c5: 8.8000,
  c6: 9.9000,
  c7: 11.0000,
  c8: 12.1000,
  c9: 13.2000,
  c10: 14.3000,
  c11: 15.4000,
  c12: 16.5000,
  c13: 17.6000,
  c14: 18.7000,
  c15: 19.8000,
  c16: 20.9000,
  c17: 22.0000,
  c18: 23.1000,
  c19: 24.2000,
  c20: 25.3000,
  c21: 26.4000,
  c22: 27.5000,
  c23: 28.6000,
  c24: 29.7000,
  c25: 30.8000,
  c26: 31.9000,
  c27: 33.0000,
  c28: 34.1000,
  c29: 35.2000,
  c30: 36.3000,
  c31: 37.4000,
  c32: 38.5000,
  c33: 39.6000,
  c34: 40.7000,
  c35: 41.8000,
  c36: 42.9000,
  c37: 44.0000,
  c38: 45.1000,
  c39: 46.2000,
  c40: 47.3000,
  c41: 48.4000,
  c42: 49.5000,
  c43: 50.6000,
  c44: 51.7000,
  c45: 52.8000,
  c46: 53.9000,
  c47: 55.0000,
  c48: 56.1000,
  c49: 57.2000,
  c50: 58.3000,
  c51: 59.4000,
  c52: 60.5000,
  c53: 61.6000,
  c54: 62.7000,
  c55: 63.8000,
  c56: 64.9000,
  c57: 66.0000,
  c58: 67.1000,
  c59: 68.2000,
  c60: 69.3000,
  c61: 70.4000,
  c62: 71.5000,
  c63: 72.6000,
  c64: 73.7000,
  c65: 74.8000,
  c66: 75.9000,
  c67: 77.0000,
  c68: 78.1000,
  c69: 79.2000,
  c70: 80.3000,
  c71: 81.4000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_001_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_001_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_001_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_001_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_001_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_001_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_001_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_001_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_001_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_001_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
