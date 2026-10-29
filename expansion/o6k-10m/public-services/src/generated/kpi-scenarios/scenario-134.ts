import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 134 — NT/education. */
export const V1014_PUBSVC_KPI_SCENARIO_134_META = {
  id: 'kpi_134',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 132811,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_134_COEF = {
  c0: 63.0000,
  c1: 84.0000,
  c2: 5.3000,
  c3: 26.3000,
  c4: 47.3000,
  c5: 68.3000,
  c6: 89.3000,
  c7: 10.6000,
  c8: 31.6000,
  c9: 52.6000,
  c10: 73.6000,
  c11: 94.6000,
  c12: 15.9000,
  c13: 36.9000,
  c14: 57.9000,
  c15: 78.9000,
  c16: 0.2000,
  c17: 21.2000,
  c18: 42.2000,
  c19: 63.2000,
  c20: 84.2000,
  c21: 5.5000,
  c22: 26.5000,
  c23: 47.5000,
  c24: 68.5000,
  c25: 89.5000,
  c26: 10.8000,
  c27: 31.8000,
  c28: 52.8000,
  c29: 73.8000,
  c30: 94.8000,
  c31: 16.1000,
  c32: 37.1000,
  c33: 58.1000,
  c34: 79.1000,
  c35: 0.4000,
  c36: 21.4000,
  c37: 42.4000,
  c38: 63.4000,
  c39: 84.4000,
  c40: 5.7000,
  c41: 26.7000,
  c42: 47.7000,
  c43: 68.7000,
  c44: 89.7000,
  c45: 11.0000,
  c46: 32.0000,
  c47: 53.0000,
  c48: 74.0000,
  c49: 95.0000,
  c50: 16.3000,
  c51: 37.3000,
  c52: 58.3000,
  c53: 79.3000,
  c54: 0.6000,
  c55: 21.6000,
  c56: 42.6000,
  c57: 63.6000,
  c58: 84.6000,
  c59: 5.9000,
  c60: 26.9000,
  c61: 47.9000,
  c62: 68.9000,
  c63: 89.9000,
  c64: 11.2000,
  c65: 32.2000,
  c66: 53.2000,
  c67: 74.2000,
  c68: 95.2000,
  c69: 16.5000,
  c70: 37.5000,
  c71: 58.5000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_134_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_134_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_134_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_134_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_134_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_134_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_134_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_134_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_134_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_134_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
