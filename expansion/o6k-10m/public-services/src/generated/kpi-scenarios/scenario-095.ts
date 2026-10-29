import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 095 — ACT/education. */
export const V1014_PUBSVC_KPI_SCENARIO_095_META = {
  id: 'kpi_095',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 94162,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_095_COEF = {
  c0: 33.5000,
  c1: 77.9000,
  c2: 22.6000,
  c3: 67.0000,
  c4: 11.7000,
  c5: 56.1000,
  c6: 0.8000,
  c7: 45.2000,
  c8: 89.6000,
  c9: 34.3000,
  c10: 78.7000,
  c11: 23.4000,
  c12: 67.8000,
  c13: 12.5000,
  c14: 56.9000,
  c15: 1.6000,
  c16: 46.0000,
  c17: 90.4000,
  c18: 35.1000,
  c19: 79.5000,
  c20: 24.2000,
  c21: 68.6000,
  c22: 13.3000,
  c23: 57.7000,
  c24: 2.4000,
  c25: 46.8000,
  c26: 91.2000,
  c27: 35.9000,
  c28: 80.3000,
  c29: 25.0000,
  c30: 69.4000,
  c31: 14.1000,
  c32: 58.5000,
  c33: 3.2000,
  c34: 47.6000,
  c35: 92.0000,
  c36: 36.7000,
  c37: 81.1000,
  c38: 25.8000,
  c39: 70.2000,
  c40: 14.9000,
  c41: 59.3000,
  c42: 4.0000,
  c43: 48.4000,
  c44: 92.8000,
  c45: 37.5000,
  c46: 81.9000,
  c47: 26.6000,
  c48: 71.0000,
  c49: 15.7000,
  c50: 60.1000,
  c51: 4.8000,
  c52: 49.2000,
  c53: 93.6000,
  c54: 38.3000,
  c55: 82.7000,
  c56: 27.4000,
  c57: 71.8000,
  c58: 16.5000,
  c59: 60.9000,
  c60: 5.6000,
  c61: 50.0000,
  c62: 94.4000,
  c63: 39.1000,
  c64: 83.5000,
  c65: 28.2000,
  c66: 72.6000,
  c67: 17.3000,
  c68: 61.7000,
  c69: 6.4000,
  c70: 50.8000,
  c71: 95.2000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_095_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_095_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_095_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_095_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_095_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_095_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_095_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_095_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_095_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_095_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
