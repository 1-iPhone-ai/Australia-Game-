import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 017 — VIC/education. */
export const V1014_PUBSVC_KPI_SCENARIO_017_META = {
  id: 'kpi_017',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 16864,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_017_COEF = {
  c0: 74.2000,
  c1: 65.7000,
  c2: 57.2000,
  c3: 48.7000,
  c4: 40.2000,
  c5: 31.7000,
  c6: 23.2000,
  c7: 14.7000,
  c8: 6.2000,
  c9: 97.4000,
  c10: 88.9000,
  c11: 80.4000,
  c12: 71.9000,
  c13: 63.4000,
  c14: 54.9000,
  c15: 46.4000,
  c16: 37.9000,
  c17: 29.4000,
  c18: 20.9000,
  c19: 12.4000,
  c20: 3.9000,
  c21: 95.1000,
  c22: 86.6000,
  c23: 78.1000,
  c24: 69.6000,
  c25: 61.1000,
  c26: 52.6000,
  c27: 44.1000,
  c28: 35.6000,
  c29: 27.1000,
  c30: 18.6000,
  c31: 10.1000,
  c32: 1.6000,
  c33: 92.8000,
  c34: 84.3000,
  c35: 75.8000,
  c36: 67.3000,
  c37: 58.8000,
  c38: 50.3000,
  c39: 41.8000,
  c40: 33.3000,
  c41: 24.8000,
  c42: 16.3000,
  c43: 7.8000,
  c44: 99.0000,
  c45: 90.5000,
  c46: 82.0000,
  c47: 73.5000,
  c48: 65.0000,
  c49: 56.5000,
  c50: 48.0000,
  c51: 39.5000,
  c52: 31.0000,
  c53: 22.5000,
  c54: 14.0000,
  c55: 5.5000,
  c56: 96.7000,
  c57: 88.2000,
  c58: 79.7000,
  c59: 71.2000,
  c60: 62.7000,
  c61: 54.2000,
  c62: 45.7000,
  c63: 37.2000,
  c64: 28.7000,
  c65: 20.2000,
  c66: 11.7000,
  c67: 3.2000,
  c68: 94.4000,
  c69: 85.9000,
  c70: 77.4000,
  c71: 68.9000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_017_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_017_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_017_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_017_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_017_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_017_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_017_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_017_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_017_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_017_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
