import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 018 — QLD/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_018_META = {
  id: 'kpi_018',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 17855,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_018_COEF = {
  c0: 72.4000,
  c1: 63.3000,
  c2: 54.2000,
  c3: 45.1000,
  c4: 36.0000,
  c5: 26.9000,
  c6: 17.8000,
  c7: 8.7000,
  c8: 99.3000,
  c9: 90.2000,
  c10: 81.1000,
  c11: 72.0000,
  c12: 62.9000,
  c13: 53.8000,
  c14: 44.7000,
  c15: 35.6000,
  c16: 26.5000,
  c17: 17.4000,
  c18: 8.3000,
  c19: 98.9000,
  c20: 89.8000,
  c21: 80.7000,
  c22: 71.6000,
  c23: 62.5000,
  c24: 53.4000,
  c25: 44.3000,
  c26: 35.2000,
  c27: 26.1000,
  c28: 17.0000,
  c29: 7.9000,
  c30: 98.5000,
  c31: 89.4000,
  c32: 80.3000,
  c33: 71.2000,
  c34: 62.1000,
  c35: 53.0000,
  c36: 43.9000,
  c37: 34.8000,
  c38: 25.7000,
  c39: 16.6000,
  c40: 7.5000,
  c41: 98.1000,
  c42: 89.0000,
  c43: 79.9000,
  c44: 70.8000,
  c45: 61.7000,
  c46: 52.6000,
  c47: 43.5000,
  c48: 34.4000,
  c49: 25.3000,
  c50: 16.2000,
  c51: 7.1000,
  c52: 97.7000,
  c53: 88.6000,
  c54: 79.5000,
  c55: 70.4000,
  c56: 61.3000,
  c57: 52.2000,
  c58: 43.1000,
  c59: 34.0000,
  c60: 24.9000,
  c61: 15.8000,
  c62: 6.7000,
  c63: 97.3000,
  c64: 88.2000,
  c65: 79.1000,
  c66: 70.0000,
  c67: 60.9000,
  c68: 51.8000,
  c69: 42.7000,
  c70: 33.6000,
  c71: 24.5000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_018_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_018_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_018_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_018_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_018_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_018_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_018_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_018_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_018_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_018_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
