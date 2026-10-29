import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 074 — QLD/education. */
export const V1014_PUBSVC_KPI_SCENARIO_074_META = {
  id: 'kpi_074',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 73351,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_074_COEF = {
  c0: 71.3000,
  c1: 28.6000,
  c2: 85.6000,
  c3: 42.9000,
  c4: 0.2000,
  c5: 57.2000,
  c6: 14.5000,
  c7: 71.5000,
  c8: 28.8000,
  c9: 85.8000,
  c10: 43.1000,
  c11: 0.4000,
  c12: 57.4000,
  c13: 14.7000,
  c14: 71.7000,
  c15: 29.0000,
  c16: 86.0000,
  c17: 43.3000,
  c18: 0.6000,
  c19: 57.6000,
  c20: 14.9000,
  c21: 71.9000,
  c22: 29.2000,
  c23: 86.2000,
  c24: 43.5000,
  c25: 0.8000,
  c26: 57.8000,
  c27: 15.1000,
  c28: 72.1000,
  c29: 29.4000,
  c30: 86.4000,
  c31: 43.7000,
  c32: 1.0000,
  c33: 58.0000,
  c34: 15.3000,
  c35: 72.3000,
  c36: 29.6000,
  c37: 86.6000,
  c38: 43.9000,
  c39: 1.2000,
  c40: 58.2000,
  c41: 15.5000,
  c42: 72.5000,
  c43: 29.8000,
  c44: 86.8000,
  c45: 44.1000,
  c46: 1.4000,
  c47: 58.4000,
  c48: 15.7000,
  c49: 72.7000,
  c50: 30.0000,
  c51: 87.0000,
  c52: 44.3000,
  c53: 1.6000,
  c54: 58.6000,
  c55: 15.9000,
  c56: 72.9000,
  c57: 30.2000,
  c58: 87.2000,
  c59: 44.5000,
  c60: 1.8000,
  c61: 58.8000,
  c62: 16.1000,
  c63: 73.1000,
  c64: 30.4000,
  c65: 87.4000,
  c66: 44.7000,
  c67: 2.0000,
  c68: 59.0000,
  c69: 16.3000,
  c70: 73.3000,
  c71: 30.6000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_074_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_074_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_074_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_074_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_074_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_074_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_074_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_074_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_074_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_074_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
