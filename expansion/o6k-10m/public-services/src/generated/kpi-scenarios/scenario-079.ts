import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 079 — ACT/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_079_META = {
  id: 'kpi_079',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 78306,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_079_COEF = {
  c0: 62.3000,
  c1: 16.6000,
  c2: 70.6000,
  c3: 24.9000,
  c4: 78.9000,
  c5: 33.2000,
  c6: 87.2000,
  c7: 41.5000,
  c8: 95.5000,
  c9: 49.8000,
  c10: 4.1000,
  c11: 58.1000,
  c12: 12.4000,
  c13: 66.4000,
  c14: 20.7000,
  c15: 74.7000,
  c16: 29.0000,
  c17: 83.0000,
  c18: 37.3000,
  c19: 91.3000,
  c20: 45.6000,
  c21: 99.6000,
  c22: 53.9000,
  c23: 8.2000,
  c24: 62.2000,
  c25: 16.5000,
  c26: 70.5000,
  c27: 24.8000,
  c28: 78.8000,
  c29: 33.1000,
  c30: 87.1000,
  c31: 41.4000,
  c32: 95.4000,
  c33: 49.7000,
  c34: 4.0000,
  c35: 58.0000,
  c36: 12.3000,
  c37: 66.3000,
  c38: 20.6000,
  c39: 74.6000,
  c40: 28.9000,
  c41: 82.9000,
  c42: 37.2000,
  c43: 91.2000,
  c44: 45.5000,
  c45: 99.5000,
  c46: 53.8000,
  c47: 8.1000,
  c48: 62.1000,
  c49: 16.4000,
  c50: 70.4000,
  c51: 24.7000,
  c52: 78.7000,
  c53: 33.0000,
  c54: 87.0000,
  c55: 41.3000,
  c56: 95.3000,
  c57: 49.6000,
  c58: 3.9000,
  c59: 57.9000,
  c60: 12.2000,
  c61: 66.2000,
  c62: 20.5000,
  c63: 74.5000,
  c64: 28.8000,
  c65: 82.8000,
  c66: 37.1000,
  c67: 91.1000,
  c68: 45.4000,
  c69: 99.4000,
  c70: 53.7000,
  c71: 8.0000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_079_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_079_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_079_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_079_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_079_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_079_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_079_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_079_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_079_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_079_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
