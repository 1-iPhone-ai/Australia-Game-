import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 033 — VIC/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_033_META = {
  id: 'kpi_033',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 32720,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_033_COEF = {
  c0: 45.4000,
  c1: 27.3000,
  c2: 9.2000,
  c3: 90.8000,
  c4: 72.7000,
  c5: 54.6000,
  c6: 36.5000,
  c7: 18.4000,
  c8: 0.3000,
  c9: 81.9000,
  c10: 63.8000,
  c11: 45.7000,
  c12: 27.6000,
  c13: 9.5000,
  c14: 91.1000,
  c15: 73.0000,
  c16: 54.9000,
  c17: 36.8000,
  c18: 18.7000,
  c19: 0.6000,
  c20: 82.2000,
  c21: 64.1000,
  c22: 46.0000,
  c23: 27.9000,
  c24: 9.8000,
  c25: 91.4000,
  c26: 73.3000,
  c27: 55.2000,
  c28: 37.1000,
  c29: 19.0000,
  c30: 0.9000,
  c31: 82.5000,
  c32: 64.4000,
  c33: 46.3000,
  c34: 28.2000,
  c35: 10.1000,
  c36: 91.7000,
  c37: 73.6000,
  c38: 55.5000,
  c39: 37.4000,
  c40: 19.3000,
  c41: 1.2000,
  c42: 82.8000,
  c43: 64.7000,
  c44: 46.6000,
  c45: 28.5000,
  c46: 10.4000,
  c47: 92.0000,
  c48: 73.9000,
  c49: 55.8000,
  c50: 37.7000,
  c51: 19.6000,
  c52: 1.5000,
  c53: 83.1000,
  c54: 65.0000,
  c55: 46.9000,
  c56: 28.8000,
  c57: 10.7000,
  c58: 92.3000,
  c59: 74.2000,
  c60: 56.1000,
  c61: 38.0000,
  c62: 19.9000,
  c63: 1.8000,
  c64: 83.4000,
  c65: 65.3000,
  c66: 47.2000,
  c67: 29.1000,
  c68: 11.0000,
  c69: 92.6000,
  c70: 74.5000,
  c71: 56.4000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_033_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_033_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_033_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_033_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_033_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_033_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_033_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_033_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_033_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_033_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
