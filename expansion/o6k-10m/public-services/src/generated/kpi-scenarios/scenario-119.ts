import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 119 — ACT/education. */
export const V1014_PUBSVC_KPI_SCENARIO_119_META = {
  id: 'kpi_119',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 117946,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_119_COEF = {
  c0: 90.0000,
  c1: 20.3000,
  c2: 50.3000,
  c3: 80.3000,
  c4: 10.6000,
  c5: 40.6000,
  c6: 70.6000,
  c7: 0.9000,
  c8: 30.9000,
  c9: 60.9000,
  c10: 90.9000,
  c11: 21.2000,
  c12: 51.2000,
  c13: 81.2000,
  c14: 11.5000,
  c15: 41.5000,
  c16: 71.5000,
  c17: 1.8000,
  c18: 31.8000,
  c19: 61.8000,
  c20: 91.8000,
  c21: 22.1000,
  c22: 52.1000,
  c23: 82.1000,
  c24: 12.4000,
  c25: 42.4000,
  c26: 72.4000,
  c27: 2.7000,
  c28: 32.7000,
  c29: 62.7000,
  c30: 92.7000,
  c31: 23.0000,
  c32: 53.0000,
  c33: 83.0000,
  c34: 13.3000,
  c35: 43.3000,
  c36: 73.3000,
  c37: 3.6000,
  c38: 33.6000,
  c39: 63.6000,
  c40: 93.6000,
  c41: 23.9000,
  c42: 53.9000,
  c43: 83.9000,
  c44: 14.2000,
  c45: 44.2000,
  c46: 74.2000,
  c47: 4.5000,
  c48: 34.5000,
  c49: 64.5000,
  c50: 94.5000,
  c51: 24.8000,
  c52: 54.8000,
  c53: 84.8000,
  c54: 15.1000,
  c55: 45.1000,
  c56: 75.1000,
  c57: 5.4000,
  c58: 35.4000,
  c59: 65.4000,
  c60: 95.4000,
  c61: 25.7000,
  c62: 55.7000,
  c63: 85.7000,
  c64: 16.0000,
  c65: 46.0000,
  c66: 76.0000,
  c67: 6.3000,
  c68: 36.3000,
  c69: 66.3000,
  c70: 96.3000,
  c71: 26.6000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_119_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_119_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_119_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_119_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_119_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_119_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_119_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_119_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_119_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_119_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
