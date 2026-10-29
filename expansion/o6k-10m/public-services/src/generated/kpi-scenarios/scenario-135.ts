import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 135 — ACT/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_135_META = {
  id: 'kpi_135',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 133802,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_135_COEF = {
  c0: 61.2000,
  c1: 81.6000,
  c2: 2.3000,
  c3: 22.7000,
  c4: 43.1000,
  c5: 63.5000,
  c6: 83.9000,
  c7: 4.6000,
  c8: 25.0000,
  c9: 45.4000,
  c10: 65.8000,
  c11: 86.2000,
  c12: 6.9000,
  c13: 27.3000,
  c14: 47.7000,
  c15: 68.1000,
  c16: 88.5000,
  c17: 9.2000,
  c18: 29.6000,
  c19: 50.0000,
  c20: 70.4000,
  c21: 90.8000,
  c22: 11.5000,
  c23: 31.9000,
  c24: 52.3000,
  c25: 72.7000,
  c26: 93.1000,
  c27: 13.8000,
  c28: 34.2000,
  c29: 54.6000,
  c30: 75.0000,
  c31: 95.4000,
  c32: 16.1000,
  c33: 36.5000,
  c34: 56.9000,
  c35: 77.3000,
  c36: 97.7000,
  c37: 18.4000,
  c38: 38.8000,
  c39: 59.2000,
  c40: 79.6000,
  c41: 0.3000,
  c42: 20.7000,
  c43: 41.1000,
  c44: 61.5000,
  c45: 81.9000,
  c46: 2.6000,
  c47: 23.0000,
  c48: 43.4000,
  c49: 63.8000,
  c50: 84.2000,
  c51: 4.9000,
  c52: 25.3000,
  c53: 45.7000,
  c54: 66.1000,
  c55: 86.5000,
  c56: 7.2000,
  c57: 27.6000,
  c58: 48.0000,
  c59: 68.4000,
  c60: 88.8000,
  c61: 9.5000,
  c62: 29.9000,
  c63: 50.3000,
  c64: 70.7000,
  c65: 91.1000,
  c66: 11.8000,
  c67: 32.2000,
  c68: 52.6000,
  c69: 73.0000,
  c70: 93.4000,
  c71: 14.1000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_135_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_135_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_135_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_135_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_135_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_135_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_135_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_135_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_135_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_135_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
