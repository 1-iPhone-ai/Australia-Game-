import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 081 — VIC/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_081_META = {
  id: 'kpi_081',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 80288,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_081_COEF = {
  c0: 58.7000,
  c1: 11.8000,
  c2: 64.6000,
  c3: 17.7000,
  c4: 70.5000,
  c5: 23.6000,
  c6: 76.4000,
  c7: 29.5000,
  c8: 82.3000,
  c9: 35.4000,
  c10: 88.2000,
  c11: 41.3000,
  c12: 94.1000,
  c13: 47.2000,
  c14: 0.3000,
  c15: 53.1000,
  c16: 6.2000,
  c17: 59.0000,
  c18: 12.1000,
  c19: 64.9000,
  c20: 18.0000,
  c21: 70.8000,
  c22: 23.9000,
  c23: 76.7000,
  c24: 29.8000,
  c25: 82.6000,
  c26: 35.7000,
  c27: 88.5000,
  c28: 41.6000,
  c29: 94.4000,
  c30: 47.5000,
  c31: 0.6000,
  c32: 53.4000,
  c33: 6.5000,
  c34: 59.3000,
  c35: 12.4000,
  c36: 65.2000,
  c37: 18.3000,
  c38: 71.1000,
  c39: 24.2000,
  c40: 77.0000,
  c41: 30.1000,
  c42: 82.9000,
  c43: 36.0000,
  c44: 88.8000,
  c45: 41.9000,
  c46: 94.7000,
  c47: 47.8000,
  c48: 0.9000,
  c49: 53.7000,
  c50: 6.8000,
  c51: 59.6000,
  c52: 12.7000,
  c53: 65.5000,
  c54: 18.6000,
  c55: 71.4000,
  c56: 24.5000,
  c57: 77.3000,
  c58: 30.4000,
  c59: 83.2000,
  c60: 36.3000,
  c61: 89.1000,
  c62: 42.2000,
  c63: 95.0000,
  c64: 48.1000,
  c65: 1.2000,
  c66: 54.0000,
  c67: 7.1000,
  c68: 59.9000,
  c69: 13.0000,
  c70: 65.8000,
  c71: 18.9000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_081_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_081_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_081_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_081_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_081_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_081_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_081_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_081_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_081_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_081_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
