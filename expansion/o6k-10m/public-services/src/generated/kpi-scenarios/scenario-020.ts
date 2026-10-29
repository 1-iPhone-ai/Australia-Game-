import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 020 — SA/education. */
export const V1014_PUBSVC_KPI_SCENARIO_020_META = {
  id: 'kpi_020',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 19837,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_020_COEF = {
  c0: 68.8000,
  c1: 58.5000,
  c2: 48.2000,
  c3: 37.9000,
  c4: 27.6000,
  c5: 17.3000,
  c6: 7.0000,
  c7: 96.4000,
  c8: 86.1000,
  c9: 75.8000,
  c10: 65.5000,
  c11: 55.2000,
  c12: 44.9000,
  c13: 34.6000,
  c14: 24.3000,
  c15: 14.0000,
  c16: 3.7000,
  c17: 93.1000,
  c18: 82.8000,
  c19: 72.5000,
  c20: 62.2000,
  c21: 51.9000,
  c22: 41.6000,
  c23: 31.3000,
  c24: 21.0000,
  c25: 10.7000,
  c26: 0.4000,
  c27: 89.8000,
  c28: 79.5000,
  c29: 69.2000,
  c30: 58.9000,
  c31: 48.6000,
  c32: 38.3000,
  c33: 28.0000,
  c34: 17.7000,
  c35: 7.4000,
  c36: 96.8000,
  c37: 86.5000,
  c38: 76.2000,
  c39: 65.9000,
  c40: 55.6000,
  c41: 45.3000,
  c42: 35.0000,
  c43: 24.7000,
  c44: 14.4000,
  c45: 4.1000,
  c46: 93.5000,
  c47: 83.2000,
  c48: 72.9000,
  c49: 62.6000,
  c50: 52.3000,
  c51: 42.0000,
  c52: 31.7000,
  c53: 21.4000,
  c54: 11.1000,
  c55: 0.8000,
  c56: 90.2000,
  c57: 79.9000,
  c58: 69.6000,
  c59: 59.3000,
  c60: 49.0000,
  c61: 38.7000,
  c62: 28.4000,
  c63: 18.1000,
  c64: 7.8000,
  c65: 97.2000,
  c66: 86.9000,
  c67: 76.6000,
  c68: 66.3000,
  c69: 56.0000,
  c70: 45.7000,
  c71: 35.4000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_020_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_020_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_020_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_020_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_020_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_020_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_020_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_020_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_020_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_020_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
