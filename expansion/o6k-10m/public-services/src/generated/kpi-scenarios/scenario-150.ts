import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 150 — NT/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_150_META = {
  id: 'kpi_150',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 148667,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_150_COEF = {
  c0: 34.2000,
  c1: 45.6000,
  c2: 57.0000,
  c3: 68.4000,
  c4: 79.8000,
  c5: 91.2000,
  c6: 2.9000,
  c7: 14.3000,
  c8: 25.7000,
  c9: 37.1000,
  c10: 48.5000,
  c11: 59.9000,
  c12: 71.3000,
  c13: 82.7000,
  c14: 94.1000,
  c15: 5.8000,
  c16: 17.2000,
  c17: 28.6000,
  c18: 40.0000,
  c19: 51.4000,
  c20: 62.8000,
  c21: 74.2000,
  c22: 85.6000,
  c23: 97.0000,
  c24: 8.7000,
  c25: 20.1000,
  c26: 31.5000,
  c27: 42.9000,
  c28: 54.3000,
  c29: 65.7000,
  c30: 77.1000,
  c31: 88.5000,
  c32: 0.2000,
  c33: 11.6000,
  c34: 23.0000,
  c35: 34.4000,
  c36: 45.8000,
  c37: 57.2000,
  c38: 68.6000,
  c39: 80.0000,
  c40: 91.4000,
  c41: 3.1000,
  c42: 14.5000,
  c43: 25.9000,
  c44: 37.3000,
  c45: 48.7000,
  c46: 60.1000,
  c47: 71.5000,
  c48: 82.9000,
  c49: 94.3000,
  c50: 6.0000,
  c51: 17.4000,
  c52: 28.8000,
  c53: 40.2000,
  c54: 51.6000,
  c55: 63.0000,
  c56: 74.4000,
  c57: 85.8000,
  c58: 97.2000,
  c59: 8.9000,
  c60: 20.3000,
  c61: 31.7000,
  c62: 43.1000,
  c63: 54.5000,
  c64: 65.9000,
  c65: 77.3000,
  c66: 88.7000,
  c67: 0.4000,
  c68: 11.8000,
  c69: 23.2000,
  c70: 34.6000,
  c71: 46.0000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_150_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_150_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_150_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_150_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_150_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_150_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_150_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_150_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_150_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_150_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
