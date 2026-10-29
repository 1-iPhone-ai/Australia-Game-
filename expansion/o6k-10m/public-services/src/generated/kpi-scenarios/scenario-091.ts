import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 091 — WA/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_091_META = {
  id: 'kpi_091',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 90198,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_091_COEF = {
  c0: 40.7000,
  c1: 87.5000,
  c2: 34.6000,
  c3: 81.4000,
  c4: 28.5000,
  c5: 75.3000,
  c6: 22.4000,
  c7: 69.2000,
  c8: 16.3000,
  c9: 63.1000,
  c10: 10.2000,
  c11: 57.0000,
  c12: 4.1000,
  c13: 50.9000,
  c14: 97.7000,
  c15: 44.8000,
  c16: 91.6000,
  c17: 38.7000,
  c18: 85.5000,
  c19: 32.6000,
  c20: 79.4000,
  c21: 26.5000,
  c22: 73.3000,
  c23: 20.4000,
  c24: 67.2000,
  c25: 14.3000,
  c26: 61.1000,
  c27: 8.2000,
  c28: 55.0000,
  c29: 2.1000,
  c30: 48.9000,
  c31: 95.7000,
  c32: 42.8000,
  c33: 89.6000,
  c34: 36.7000,
  c35: 83.5000,
  c36: 30.6000,
  c37: 77.4000,
  c38: 24.5000,
  c39: 71.3000,
  c40: 18.4000,
  c41: 65.2000,
  c42: 12.3000,
  c43: 59.1000,
  c44: 6.2000,
  c45: 53.0000,
  c46: 0.1000,
  c47: 46.9000,
  c48: 93.7000,
  c49: 40.8000,
  c50: 87.6000,
  c51: 34.7000,
  c52: 81.5000,
  c53: 28.6000,
  c54: 75.4000,
  c55: 22.5000,
  c56: 69.3000,
  c57: 16.4000,
  c58: 63.2000,
  c59: 10.3000,
  c60: 57.1000,
  c61: 4.2000,
  c62: 51.0000,
  c63: 97.8000,
  c64: 44.9000,
  c65: 91.7000,
  c66: 38.8000,
  c67: 85.6000,
  c68: 32.7000,
  c69: 79.5000,
  c70: 26.6000,
  c71: 73.4000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_091_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_091_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_091_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_091_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_091_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_091_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_091_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_091_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_091_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_091_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
