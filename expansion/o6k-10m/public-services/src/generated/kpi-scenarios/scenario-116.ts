import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 116 — SA/education. */
export const V1014_PUBSVC_KPI_SCENARIO_116_META = {
  id: 'kpi_116',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 114973,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_116_COEF = {
  c0: 95.4000,
  c1: 27.5000,
  c2: 59.3000,
  c3: 91.1000,
  c4: 23.2000,
  c5: 55.0000,
  c6: 86.8000,
  c7: 18.9000,
  c8: 50.7000,
  c9: 82.5000,
  c10: 14.6000,
  c11: 46.4000,
  c12: 78.2000,
  c13: 10.3000,
  c14: 42.1000,
  c15: 73.9000,
  c16: 6.0000,
  c17: 37.8000,
  c18: 69.6000,
  c19: 1.7000,
  c20: 33.5000,
  c21: 65.3000,
  c22: 97.1000,
  c23: 29.2000,
  c24: 61.0000,
  c25: 92.8000,
  c26: 24.9000,
  c27: 56.7000,
  c28: 88.5000,
  c29: 20.6000,
  c30: 52.4000,
  c31: 84.2000,
  c32: 16.3000,
  c33: 48.1000,
  c34: 79.9000,
  c35: 12.0000,
  c36: 43.8000,
  c37: 75.6000,
  c38: 7.7000,
  c39: 39.5000,
  c40: 71.3000,
  c41: 3.4000,
  c42: 35.2000,
  c43: 67.0000,
  c44: 98.8000,
  c45: 30.9000,
  c46: 62.7000,
  c47: 94.5000,
  c48: 26.6000,
  c49: 58.4000,
  c50: 90.2000,
  c51: 22.3000,
  c52: 54.1000,
  c53: 85.9000,
  c54: 18.0000,
  c55: 49.8000,
  c56: 81.6000,
  c57: 13.7000,
  c58: 45.5000,
  c59: 77.3000,
  c60: 9.4000,
  c61: 41.2000,
  c62: 73.0000,
  c63: 5.1000,
  c64: 36.9000,
  c65: 68.7000,
  c66: 0.8000,
  c67: 32.6000,
  c68: 64.4000,
  c69: 96.2000,
  c70: 28.3000,
  c71: 60.1000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_116_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_116_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_116_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_116_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_116_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_116_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_116_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_116_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_116_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_116_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
