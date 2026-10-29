import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 149 — TAS/education. */
export const V1014_PUBSVC_KPI_SCENARIO_149_META = {
  id: 'kpi_149',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 147676,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_149_COEF = {
  c0: 36.0000,
  c1: 48.0000,
  c2: 60.0000,
  c3: 72.0000,
  c4: 84.0000,
  c5: 96.0000,
  c6: 8.3000,
  c7: 20.3000,
  c8: 32.3000,
  c9: 44.3000,
  c10: 56.3000,
  c11: 68.3000,
  c12: 80.3000,
  c13: 92.3000,
  c14: 4.6000,
  c15: 16.6000,
  c16: 28.6000,
  c17: 40.6000,
  c18: 52.6000,
  c19: 64.6000,
  c20: 76.6000,
  c21: 88.6000,
  c22: 0.9000,
  c23: 12.9000,
  c24: 24.9000,
  c25: 36.9000,
  c26: 48.9000,
  c27: 60.9000,
  c28: 72.9000,
  c29: 84.9000,
  c30: 96.9000,
  c31: 9.2000,
  c32: 21.2000,
  c33: 33.2000,
  c34: 45.2000,
  c35: 57.2000,
  c36: 69.2000,
  c37: 81.2000,
  c38: 93.2000,
  c39: 5.5000,
  c40: 17.5000,
  c41: 29.5000,
  c42: 41.5000,
  c43: 53.5000,
  c44: 65.5000,
  c45: 77.5000,
  c46: 89.5000,
  c47: 1.8000,
  c48: 13.8000,
  c49: 25.8000,
  c50: 37.8000,
  c51: 49.8000,
  c52: 61.8000,
  c53: 73.8000,
  c54: 85.8000,
  c55: 97.8000,
  c56: 10.1000,
  c57: 22.1000,
  c58: 34.1000,
  c59: 46.1000,
  c60: 58.1000,
  c61: 70.1000,
  c62: 82.1000,
  c63: 94.1000,
  c64: 6.4000,
  c65: 18.4000,
  c66: 30.4000,
  c67: 42.4000,
  c68: 54.4000,
  c69: 66.4000,
  c70: 78.4000,
  c71: 90.4000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_149_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_149_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_149_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_149_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_149_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_149_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_149_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_149_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_149_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_149_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
