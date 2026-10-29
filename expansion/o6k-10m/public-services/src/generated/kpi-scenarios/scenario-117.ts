import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 117 — TAS/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_117_META = {
  id: 'kpi_117',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 115964,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_117_COEF = {
  c0: 93.6000,
  c1: 25.1000,
  c2: 56.3000,
  c3: 87.5000,
  c4: 19.0000,
  c5: 50.2000,
  c6: 81.4000,
  c7: 12.9000,
  c8: 44.1000,
  c9: 75.3000,
  c10: 6.8000,
  c11: 38.0000,
  c12: 69.2000,
  c13: 0.7000,
  c14: 31.9000,
  c15: 63.1000,
  c16: 94.3000,
  c17: 25.8000,
  c18: 57.0000,
  c19: 88.2000,
  c20: 19.7000,
  c21: 50.9000,
  c22: 82.1000,
  c23: 13.6000,
  c24: 44.8000,
  c25: 76.0000,
  c26: 7.5000,
  c27: 38.7000,
  c28: 69.9000,
  c29: 1.4000,
  c30: 32.6000,
  c31: 63.8000,
  c32: 95.0000,
  c33: 26.5000,
  c34: 57.7000,
  c35: 88.9000,
  c36: 20.4000,
  c37: 51.6000,
  c38: 82.8000,
  c39: 14.3000,
  c40: 45.5000,
  c41: 76.7000,
  c42: 8.2000,
  c43: 39.4000,
  c44: 70.6000,
  c45: 2.1000,
  c46: 33.3000,
  c47: 64.5000,
  c48: 95.7000,
  c49: 27.2000,
  c50: 58.4000,
  c51: 89.6000,
  c52: 21.1000,
  c53: 52.3000,
  c54: 83.5000,
  c55: 15.0000,
  c56: 46.2000,
  c57: 77.4000,
  c58: 8.9000,
  c59: 40.1000,
  c60: 71.3000,
  c61: 2.8000,
  c62: 34.0000,
  c63: 65.2000,
  c64: 96.4000,
  c65: 27.9000,
  c66: 59.1000,
  c67: 90.3000,
  c68: 21.8000,
  c69: 53.0000,
  c70: 84.2000,
  c71: 15.7000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_117_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_117_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_117_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_117_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_117_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_117_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_117_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_117_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_117_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_117_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
