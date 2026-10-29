import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 073 — VIC/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_073_META = {
  id: 'kpi_073',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 72360,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_073_COEF = {
  c0: 73.1000,
  c1: 31.0000,
  c2: 88.6000,
  c3: 46.5000,
  c4: 4.4000,
  c5: 62.0000,
  c6: 19.9000,
  c7: 77.5000,
  c8: 35.4000,
  c9: 93.0000,
  c10: 50.9000,
  c11: 8.8000,
  c12: 66.4000,
  c13: 24.3000,
  c14: 81.9000,
  c15: 39.8000,
  c16: 97.4000,
  c17: 55.3000,
  c18: 13.2000,
  c19: 70.8000,
  c20: 28.7000,
  c21: 86.3000,
  c22: 44.2000,
  c23: 2.1000,
  c24: 59.7000,
  c25: 17.6000,
  c26: 75.2000,
  c27: 33.1000,
  c28: 90.7000,
  c29: 48.6000,
  c30: 6.5000,
  c31: 64.1000,
  c32: 22.0000,
  c33: 79.6000,
  c34: 37.5000,
  c35: 95.1000,
  c36: 53.0000,
  c37: 10.9000,
  c38: 68.5000,
  c39: 26.4000,
  c40: 84.0000,
  c41: 41.9000,
  c42: 99.5000,
  c43: 57.4000,
  c44: 15.3000,
  c45: 72.9000,
  c46: 30.8000,
  c47: 88.4000,
  c48: 46.3000,
  c49: 4.2000,
  c50: 61.8000,
  c51: 19.7000,
  c52: 77.3000,
  c53: 35.2000,
  c54: 92.8000,
  c55: 50.7000,
  c56: 8.6000,
  c57: 66.2000,
  c58: 24.1000,
  c59: 81.7000,
  c60: 39.6000,
  c61: 97.2000,
  c62: 55.1000,
  c63: 13.0000,
  c64: 70.6000,
  c65: 28.5000,
  c66: 86.1000,
  c67: 44.0000,
  c68: 1.9000,
  c69: 59.5000,
  c70: 17.4000,
  c71: 75.0000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_073_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_073_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_073_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_073_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_073_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_073_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_073_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_073_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_073_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_073_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
