import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 022 — NT/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_022_META = {
  id: 'kpi_022',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 21819,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_022_COEF = {
  c0: 65.2000,
  c1: 53.7000,
  c2: 42.2000,
  c3: 30.7000,
  c4: 19.2000,
  c5: 7.7000,
  c6: 95.9000,
  c7: 84.4000,
  c8: 72.9000,
  c9: 61.4000,
  c10: 49.9000,
  c11: 38.4000,
  c12: 26.9000,
  c13: 15.4000,
  c14: 3.9000,
  c15: 92.1000,
  c16: 80.6000,
  c17: 69.1000,
  c18: 57.6000,
  c19: 46.1000,
  c20: 34.6000,
  c21: 23.1000,
  c22: 11.6000,
  c23: 0.1000,
  c24: 88.3000,
  c25: 76.8000,
  c26: 65.3000,
  c27: 53.8000,
  c28: 42.3000,
  c29: 30.8000,
  c30: 19.3000,
  c31: 7.8000,
  c32: 96.0000,
  c33: 84.5000,
  c34: 73.0000,
  c35: 61.5000,
  c36: 50.0000,
  c37: 38.5000,
  c38: 27.0000,
  c39: 15.5000,
  c40: 4.0000,
  c41: 92.2000,
  c42: 80.7000,
  c43: 69.2000,
  c44: 57.7000,
  c45: 46.2000,
  c46: 34.7000,
  c47: 23.2000,
  c48: 11.7000,
  c49: 0.2000,
  c50: 88.4000,
  c51: 76.9000,
  c52: 65.4000,
  c53: 53.9000,
  c54: 42.4000,
  c55: 30.9000,
  c56: 19.4000,
  c57: 7.9000,
  c58: 96.1000,
  c59: 84.6000,
  c60: 73.1000,
  c61: 61.6000,
  c62: 50.1000,
  c63: 38.6000,
  c64: 27.1000,
  c65: 15.6000,
  c66: 4.1000,
  c67: 92.3000,
  c68: 80.8000,
  c69: 69.3000,
  c70: 57.8000,
  c71: 46.3000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_022_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_022_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_022_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_022_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_022_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_022_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_022_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_022_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_022_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_022_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
