import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 034 — QLD/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_034_META = {
  id: 'kpi_034',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 33711,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_034_COEF = {
  c0: 43.6000,
  c1: 24.9000,
  c2: 6.2000,
  c3: 87.2000,
  c4: 68.5000,
  c5: 49.8000,
  c6: 31.1000,
  c7: 12.4000,
  c8: 93.4000,
  c9: 74.7000,
  c10: 56.0000,
  c11: 37.3000,
  c12: 18.6000,
  c13: 99.6000,
  c14: 80.9000,
  c15: 62.2000,
  c16: 43.5000,
  c17: 24.8000,
  c18: 6.1000,
  c19: 87.1000,
  c20: 68.4000,
  c21: 49.7000,
  c22: 31.0000,
  c23: 12.3000,
  c24: 93.3000,
  c25: 74.6000,
  c26: 55.9000,
  c27: 37.2000,
  c28: 18.5000,
  c29: 99.5000,
  c30: 80.8000,
  c31: 62.1000,
  c32: 43.4000,
  c33: 24.7000,
  c34: 6.0000,
  c35: 87.0000,
  c36: 68.3000,
  c37: 49.6000,
  c38: 30.9000,
  c39: 12.2000,
  c40: 93.2000,
  c41: 74.5000,
  c42: 55.8000,
  c43: 37.1000,
  c44: 18.4000,
  c45: 99.4000,
  c46: 80.7000,
  c47: 62.0000,
  c48: 43.3000,
  c49: 24.6000,
  c50: 5.9000,
  c51: 86.9000,
  c52: 68.2000,
  c53: 49.5000,
  c54: 30.8000,
  c55: 12.1000,
  c56: 93.1000,
  c57: 74.4000,
  c58: 55.7000,
  c59: 37.0000,
  c60: 18.3000,
  c61: 99.3000,
  c62: 80.6000,
  c63: 61.9000,
  c64: 43.2000,
  c65: 24.5000,
  c66: 5.8000,
  c67: 86.8000,
  c68: 68.1000,
  c69: 49.4000,
  c70: 30.7000,
  c71: 12.0000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_034_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_034_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_034_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_034_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_034_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_034_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_034_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_034_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_034_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_034_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
