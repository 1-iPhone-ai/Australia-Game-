import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 068 — SA/education. */
export const V1014_PUBSVC_KPI_SCENARIO_068_META = {
  id: 'kpi_068',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 67405,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_068_COEF = {
  c0: 82.1000,
  c1: 43.0000,
  c2: 3.9000,
  c3: 64.5000,
  c4: 25.4000,
  c5: 86.0000,
  c6: 46.9000,
  c7: 7.8000,
  c8: 68.4000,
  c9: 29.3000,
  c10: 89.9000,
  c11: 50.8000,
  c12: 11.7000,
  c13: 72.3000,
  c14: 33.2000,
  c15: 93.8000,
  c16: 54.7000,
  c17: 15.6000,
  c18: 76.2000,
  c19: 37.1000,
  c20: 97.7000,
  c21: 58.6000,
  c22: 19.5000,
  c23: 80.1000,
  c24: 41.0000,
  c25: 1.9000,
  c26: 62.5000,
  c27: 23.4000,
  c28: 84.0000,
  c29: 44.9000,
  c30: 5.8000,
  c31: 66.4000,
  c32: 27.3000,
  c33: 87.9000,
  c34: 48.8000,
  c35: 9.7000,
  c36: 70.3000,
  c37: 31.2000,
  c38: 91.8000,
  c39: 52.7000,
  c40: 13.6000,
  c41: 74.2000,
  c42: 35.1000,
  c43: 95.7000,
  c44: 56.6000,
  c45: 17.5000,
  c46: 78.1000,
  c47: 39.0000,
  c48: 99.6000,
  c49: 60.5000,
  c50: 21.4000,
  c51: 82.0000,
  c52: 42.9000,
  c53: 3.8000,
  c54: 64.4000,
  c55: 25.3000,
  c56: 85.9000,
  c57: 46.8000,
  c58: 7.7000,
  c59: 68.3000,
  c60: 29.2000,
  c61: 89.8000,
  c62: 50.7000,
  c63: 11.6000,
  c64: 72.2000,
  c65: 33.1000,
  c66: 93.7000,
  c67: 54.6000,
  c68: 15.5000,
  c69: 76.1000,
  c70: 37.0000,
  c71: 97.6000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_068_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_068_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_068_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_068_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_068_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_068_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_068_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_068_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_068_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_068_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
