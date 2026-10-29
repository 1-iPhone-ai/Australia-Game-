import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 082 — QLD/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_082_META = {
  id: 'kpi_082',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 81279,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_082_COEF = {
  c0: 56.9000,
  c1: 9.4000,
  c2: 61.6000,
  c3: 14.1000,
  c4: 66.3000,
  c5: 18.8000,
  c6: 71.0000,
  c7: 23.5000,
  c8: 75.7000,
  c9: 28.2000,
  c10: 80.4000,
  c11: 32.9000,
  c12: 85.1000,
  c13: 37.6000,
  c14: 89.8000,
  c15: 42.3000,
  c16: 94.5000,
  c17: 47.0000,
  c18: 99.2000,
  c19: 51.7000,
  c20: 4.2000,
  c21: 56.4000,
  c22: 8.9000,
  c23: 61.1000,
  c24: 13.6000,
  c25: 65.8000,
  c26: 18.3000,
  c27: 70.5000,
  c28: 23.0000,
  c29: 75.2000,
  c30: 27.7000,
  c31: 79.9000,
  c32: 32.4000,
  c33: 84.6000,
  c34: 37.1000,
  c35: 89.3000,
  c36: 41.8000,
  c37: 94.0000,
  c38: 46.5000,
  c39: 98.7000,
  c40: 51.2000,
  c41: 3.7000,
  c42: 55.9000,
  c43: 8.4000,
  c44: 60.6000,
  c45: 13.1000,
  c46: 65.3000,
  c47: 17.8000,
  c48: 70.0000,
  c49: 22.5000,
  c50: 74.7000,
  c51: 27.2000,
  c52: 79.4000,
  c53: 31.9000,
  c54: 84.1000,
  c55: 36.6000,
  c56: 88.8000,
  c57: 41.3000,
  c58: 93.5000,
  c59: 46.0000,
  c60: 98.2000,
  c61: 50.7000,
  c62: 3.2000,
  c63: 55.4000,
  c64: 7.9000,
  c65: 60.1000,
  c66: 12.6000,
  c67: 64.8000,
  c68: 17.3000,
  c69: 69.5000,
  c70: 22.0000,
  c71: 74.2000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_082_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_082_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_082_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_082_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_082_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_082_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_082_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_082_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_082_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_082_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
