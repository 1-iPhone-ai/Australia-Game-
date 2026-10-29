import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 143 — ACT/education. */
export const V1014_PUBSVC_KPI_SCENARIO_143_META = {
  id: 'kpi_143',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 141730,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_143_COEF = {
  c0: 46.8000,
  c1: 62.4000,
  c2: 78.0000,
  c3: 93.6000,
  c4: 9.5000,
  c5: 25.1000,
  c6: 40.7000,
  c7: 56.3000,
  c8: 71.9000,
  c9: 87.5000,
  c10: 3.4000,
  c11: 19.0000,
  c12: 34.6000,
  c13: 50.2000,
  c14: 65.8000,
  c15: 81.4000,
  c16: 97.0000,
  c17: 12.9000,
  c18: 28.5000,
  c19: 44.1000,
  c20: 59.7000,
  c21: 75.3000,
  c22: 90.9000,
  c23: 6.8000,
  c24: 22.4000,
  c25: 38.0000,
  c26: 53.6000,
  c27: 69.2000,
  c28: 84.8000,
  c29: 0.7000,
  c30: 16.3000,
  c31: 31.9000,
  c32: 47.5000,
  c33: 63.1000,
  c34: 78.7000,
  c35: 94.3000,
  c36: 10.2000,
  c37: 25.8000,
  c38: 41.4000,
  c39: 57.0000,
  c40: 72.6000,
  c41: 88.2000,
  c42: 4.1000,
  c43: 19.7000,
  c44: 35.3000,
  c45: 50.9000,
  c46: 66.5000,
  c47: 82.1000,
  c48: 97.7000,
  c49: 13.6000,
  c50: 29.2000,
  c51: 44.8000,
  c52: 60.4000,
  c53: 76.0000,
  c54: 91.6000,
  c55: 7.5000,
  c56: 23.1000,
  c57: 38.7000,
  c58: 54.3000,
  c59: 69.9000,
  c60: 85.5000,
  c61: 1.4000,
  c62: 17.0000,
  c63: 32.6000,
  c64: 48.2000,
  c65: 63.8000,
  c66: 79.4000,
  c67: 95.0000,
  c68: 10.9000,
  c69: 26.5000,
  c70: 42.1000,
  c71: 57.7000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_143_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_143_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_143_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_143_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_143_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_143_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_143_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_143_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_143_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_143_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
