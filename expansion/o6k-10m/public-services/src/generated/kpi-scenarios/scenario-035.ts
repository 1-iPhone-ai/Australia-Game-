import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 035 — WA/education. */
export const V1014_PUBSVC_KPI_SCENARIO_035_META = {
  id: 'kpi_035',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 34702,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_035_COEF = {
  c0: 41.8000,
  c1: 22.5000,
  c2: 3.2000,
  c3: 83.6000,
  c4: 64.3000,
  c5: 45.0000,
  c6: 25.7000,
  c7: 6.4000,
  c8: 86.8000,
  c9: 67.5000,
  c10: 48.2000,
  c11: 28.9000,
  c12: 9.6000,
  c13: 90.0000,
  c14: 70.7000,
  c15: 51.4000,
  c16: 32.1000,
  c17: 12.8000,
  c18: 93.2000,
  c19: 73.9000,
  c20: 54.6000,
  c21: 35.3000,
  c22: 16.0000,
  c23: 96.4000,
  c24: 77.1000,
  c25: 57.8000,
  c26: 38.5000,
  c27: 19.2000,
  c28: 99.6000,
  c29: 80.3000,
  c30: 61.0000,
  c31: 41.7000,
  c32: 22.4000,
  c33: 3.1000,
  c34: 83.5000,
  c35: 64.2000,
  c36: 44.9000,
  c37: 25.6000,
  c38: 6.3000,
  c39: 86.7000,
  c40: 67.4000,
  c41: 48.1000,
  c42: 28.8000,
  c43: 9.5000,
  c44: 89.9000,
  c45: 70.6000,
  c46: 51.3000,
  c47: 32.0000,
  c48: 12.7000,
  c49: 93.1000,
  c50: 73.8000,
  c51: 54.5000,
  c52: 35.2000,
  c53: 15.9000,
  c54: 96.3000,
  c55: 77.0000,
  c56: 57.7000,
  c57: 38.4000,
  c58: 19.1000,
  c59: 99.5000,
  c60: 80.2000,
  c61: 60.9000,
  c62: 41.6000,
  c63: 22.3000,
  c64: 3.0000,
  c65: 83.4000,
  c66: 64.1000,
  c67: 44.8000,
  c68: 25.5000,
  c69: 6.2000,
  c70: 86.6000,
  c71: 67.3000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_035_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_035_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_035_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_035_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_035_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_035_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_035_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_035_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_035_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_035_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
