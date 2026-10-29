import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 105 — VIC/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_105_META = {
  id: 'kpi_105',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 104072,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_105_COEF = {
  c0: 15.5000,
  c1: 53.9000,
  c2: 92.3000,
  c3: 31.0000,
  c4: 69.4000,
  c5: 8.1000,
  c6: 46.5000,
  c7: 84.9000,
  c8: 23.6000,
  c9: 62.0000,
  c10: 0.7000,
  c11: 39.1000,
  c12: 77.5000,
  c13: 16.2000,
  c14: 54.6000,
  c15: 93.0000,
  c16: 31.7000,
  c17: 70.1000,
  c18: 8.8000,
  c19: 47.2000,
  c20: 85.6000,
  c21: 24.3000,
  c22: 62.7000,
  c23: 1.4000,
  c24: 39.8000,
  c25: 78.2000,
  c26: 16.9000,
  c27: 55.3000,
  c28: 93.7000,
  c29: 32.4000,
  c30: 70.8000,
  c31: 9.5000,
  c32: 47.9000,
  c33: 86.3000,
  c34: 25.0000,
  c35: 63.4000,
  c36: 2.1000,
  c37: 40.5000,
  c38: 78.9000,
  c39: 17.6000,
  c40: 56.0000,
  c41: 94.4000,
  c42: 33.1000,
  c43: 71.5000,
  c44: 10.2000,
  c45: 48.6000,
  c46: 87.0000,
  c47: 25.7000,
  c48: 64.1000,
  c49: 2.8000,
  c50: 41.2000,
  c51: 79.6000,
  c52: 18.3000,
  c53: 56.7000,
  c54: 95.1000,
  c55: 33.8000,
  c56: 72.2000,
  c57: 10.9000,
  c58: 49.3000,
  c59: 87.7000,
  c60: 26.4000,
  c61: 64.8000,
  c62: 3.5000,
  c63: 41.9000,
  c64: 80.3000,
  c65: 19.0000,
  c66: 57.4000,
  c67: 95.8000,
  c68: 34.5000,
  c69: 72.9000,
  c70: 11.6000,
  c71: 50.0000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_105_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_105_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_105_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_105_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_105_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_105_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_105_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_105_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_105_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_105_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
