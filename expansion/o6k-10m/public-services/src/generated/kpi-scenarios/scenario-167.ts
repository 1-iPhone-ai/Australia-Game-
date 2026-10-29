import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 167 — ACT/education. */
export const V1014_PUBSVC_KPI_SCENARIO_167_META = {
  id: 'kpi_167',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 165514,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_167_COEF = {
  c0: 3.6000,
  c1: 4.8000,
  c2: 6.0000,
  c3: 7.2000,
  c4: 8.4000,
  c5: 9.6000,
  c6: 10.8000,
  c7: 12.0000,
  c8: 13.2000,
  c9: 14.4000,
  c10: 15.6000,
  c11: 16.8000,
  c12: 18.0000,
  c13: 19.2000,
  c14: 20.4000,
  c15: 21.6000,
  c16: 22.8000,
  c17: 24.0000,
  c18: 25.2000,
  c19: 26.4000,
  c20: 27.6000,
  c21: 28.8000,
  c22: 30.0000,
  c23: 31.2000,
  c24: 32.4000,
  c25: 33.6000,
  c26: 34.8000,
  c27: 36.0000,
  c28: 37.2000,
  c29: 38.4000,
  c30: 39.6000,
  c31: 40.8000,
  c32: 42.0000,
  c33: 43.2000,
  c34: 44.4000,
  c35: 45.6000,
  c36: 46.8000,
  c37: 48.0000,
  c38: 49.2000,
  c39: 50.4000,
  c40: 51.6000,
  c41: 52.8000,
  c42: 54.0000,
  c43: 55.2000,
  c44: 56.4000,
  c45: 57.6000,
  c46: 58.8000,
  c47: 60.0000,
  c48: 61.2000,
  c49: 62.4000,
  c50: 63.6000,
  c51: 64.8000,
  c52: 66.0000,
  c53: 67.2000,
  c54: 68.4000,
  c55: 69.6000,
  c56: 70.8000,
  c57: 72.0000,
  c58: 73.2000,
  c59: 74.4000,
  c60: 75.6000,
  c61: 76.8000,
  c62: 78.0000,
  c63: 79.2000,
  c64: 80.4000,
  c65: 81.6000,
  c66: 82.8000,
  c67: 84.0000,
  c68: 85.2000,
  c69: 86.4000,
  c70: 87.6000,
  c71: 88.8000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_167_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_167_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_167_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_167_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_167_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_167_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_167_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_167_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_167_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_167_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
