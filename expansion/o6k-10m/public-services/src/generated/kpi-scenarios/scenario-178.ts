import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 178 — QLD/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_178_META = {
  id: 'kpi_178',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 176415,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_178_COEF = {
  c0: 83.5000,
  c1: 78.1000,
  c2: 72.7000,
  c3: 67.3000,
  c4: 61.9000,
  c5: 56.5000,
  c6: 51.1000,
  c7: 45.7000,
  c8: 40.3000,
  c9: 34.9000,
  c10: 29.5000,
  c11: 24.1000,
  c12: 18.7000,
  c13: 13.3000,
  c14: 7.9000,
  c15: 2.5000,
  c16: 96.8000,
  c17: 91.4000,
  c18: 86.0000,
  c19: 80.6000,
  c20: 75.2000,
  c21: 69.8000,
  c22: 64.4000,
  c23: 59.0000,
  c24: 53.6000,
  c25: 48.2000,
  c26: 42.8000,
  c27: 37.4000,
  c28: 32.0000,
  c29: 26.6000,
  c30: 21.2000,
  c31: 15.8000,
  c32: 10.4000,
  c33: 5.0000,
  c34: 99.3000,
  c35: 93.9000,
  c36: 88.5000,
  c37: 83.1000,
  c38: 77.7000,
  c39: 72.3000,
  c40: 66.9000,
  c41: 61.5000,
  c42: 56.1000,
  c43: 50.7000,
  c44: 45.3000,
  c45: 39.9000,
  c46: 34.5000,
  c47: 29.1000,
  c48: 23.7000,
  c49: 18.3000,
  c50: 12.9000,
  c51: 7.5000,
  c52: 2.1000,
  c53: 96.4000,
  c54: 91.0000,
  c55: 85.6000,
  c56: 80.2000,
  c57: 74.8000,
  c58: 69.4000,
  c59: 64.0000,
  c60: 58.6000,
  c61: 53.2000,
  c62: 47.8000,
  c63: 42.4000,
  c64: 37.0000,
  c65: 31.6000,
  c66: 26.2000,
  c67: 20.8000,
  c68: 15.4000,
  c69: 10.0000,
  c70: 4.6000,
  c71: 98.9000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_178_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_178_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_178_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_178_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_178_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_178_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_178_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_178_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_178_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_178_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
