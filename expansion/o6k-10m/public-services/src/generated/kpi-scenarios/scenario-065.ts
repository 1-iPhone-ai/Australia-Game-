import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 065 — VIC/education. */
export const V1014_PUBSVC_KPI_SCENARIO_065_META = {
  id: 'kpi_065',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 64432,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_065_COEF = {
  c0: 87.5000,
  c1: 50.2000,
  c2: 12.9000,
  c3: 75.3000,
  c4: 38.0000,
  c5: 0.7000,
  c6: 63.1000,
  c7: 25.8000,
  c8: 88.2000,
  c9: 50.9000,
  c10: 13.6000,
  c11: 76.0000,
  c12: 38.7000,
  c13: 1.4000,
  c14: 63.8000,
  c15: 26.5000,
  c16: 88.9000,
  c17: 51.6000,
  c18: 14.3000,
  c19: 76.7000,
  c20: 39.4000,
  c21: 2.1000,
  c22: 64.5000,
  c23: 27.2000,
  c24: 89.6000,
  c25: 52.3000,
  c26: 15.0000,
  c27: 77.4000,
  c28: 40.1000,
  c29: 2.8000,
  c30: 65.2000,
  c31: 27.9000,
  c32: 90.3000,
  c33: 53.0000,
  c34: 15.7000,
  c35: 78.1000,
  c36: 40.8000,
  c37: 3.5000,
  c38: 65.9000,
  c39: 28.6000,
  c40: 91.0000,
  c41: 53.7000,
  c42: 16.4000,
  c43: 78.8000,
  c44: 41.5000,
  c45: 4.2000,
  c46: 66.6000,
  c47: 29.3000,
  c48: 91.7000,
  c49: 54.4000,
  c50: 17.1000,
  c51: 79.5000,
  c52: 42.2000,
  c53: 4.9000,
  c54: 67.3000,
  c55: 30.0000,
  c56: 92.4000,
  c57: 55.1000,
  c58: 17.8000,
  c59: 80.2000,
  c60: 42.9000,
  c61: 5.6000,
  c62: 68.0000,
  c63: 30.7000,
  c64: 93.1000,
  c65: 55.8000,
  c66: 18.5000,
  c67: 80.9000,
  c68: 43.6000,
  c69: 6.3000,
  c70: 68.7000,
  c71: 31.4000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_065_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_065_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_065_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_065_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_065_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_065_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_065_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_065_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_065_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_065_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
