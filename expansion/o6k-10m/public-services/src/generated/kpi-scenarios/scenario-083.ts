import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 083 — WA/education. */
export const V1014_PUBSVC_KPI_SCENARIO_083_META = {
  id: 'kpi_083',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 82270,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_083_COEF = {
  c0: 55.1000,
  c1: 7.0000,
  c2: 58.6000,
  c3: 10.5000,
  c4: 62.1000,
  c5: 14.0000,
  c6: 65.6000,
  c7: 17.5000,
  c8: 69.1000,
  c9: 21.0000,
  c10: 72.6000,
  c11: 24.5000,
  c12: 76.1000,
  c13: 28.0000,
  c14: 79.6000,
  c15: 31.5000,
  c16: 83.1000,
  c17: 35.0000,
  c18: 86.6000,
  c19: 38.5000,
  c20: 90.1000,
  c21: 42.0000,
  c22: 93.6000,
  c23: 45.5000,
  c24: 97.1000,
  c25: 49.0000,
  c26: 0.9000,
  c27: 52.5000,
  c28: 4.4000,
  c29: 56.0000,
  c30: 7.9000,
  c31: 59.5000,
  c32: 11.4000,
  c33: 63.0000,
  c34: 14.9000,
  c35: 66.5000,
  c36: 18.4000,
  c37: 70.0000,
  c38: 21.9000,
  c39: 73.5000,
  c40: 25.4000,
  c41: 77.0000,
  c42: 28.9000,
  c43: 80.5000,
  c44: 32.4000,
  c45: 84.0000,
  c46: 35.9000,
  c47: 87.5000,
  c48: 39.4000,
  c49: 91.0000,
  c50: 42.9000,
  c51: 94.5000,
  c52: 46.4000,
  c53: 98.0000,
  c54: 49.9000,
  c55: 1.8000,
  c56: 53.4000,
  c57: 5.3000,
  c58: 56.9000,
  c59: 8.8000,
  c60: 60.4000,
  c61: 12.3000,
  c62: 63.9000,
  c63: 15.8000,
  c64: 67.4000,
  c65: 19.3000,
  c66: 70.9000,
  c67: 22.8000,
  c68: 74.4000,
  c69: 26.3000,
  c70: 77.9000,
  c71: 29.8000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_083_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_083_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_083_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_083_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_083_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_083_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_083_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_083_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_083_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_083_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
