import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 002 — QLD/education. */
export const V1014_PUBSVC_KPI_SCENARIO_002_META = {
  id: 'kpi_002',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 1999,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_002_COEF = {
  c0: 1.5000,
  c1: 2.0000,
  c2: 2.5000,
  c3: 3.0000,
  c4: 3.5000,
  c5: 4.0000,
  c6: 4.5000,
  c7: 5.0000,
  c8: 5.5000,
  c9: 6.0000,
  c10: 6.5000,
  c11: 7.0000,
  c12: 7.5000,
  c13: 8.0000,
  c14: 8.5000,
  c15: 9.0000,
  c16: 9.5000,
  c17: 10.0000,
  c18: 10.5000,
  c19: 11.0000,
  c20: 11.5000,
  c21: 12.0000,
  c22: 12.5000,
  c23: 13.0000,
  c24: 13.5000,
  c25: 14.0000,
  c26: 14.5000,
  c27: 15.0000,
  c28: 15.5000,
  c29: 16.0000,
  c30: 16.5000,
  c31: 17.0000,
  c32: 17.5000,
  c33: 18.0000,
  c34: 18.5000,
  c35: 19.0000,
  c36: 19.5000,
  c37: 20.0000,
  c38: 20.5000,
  c39: 21.0000,
  c40: 21.5000,
  c41: 22.0000,
  c42: 22.5000,
  c43: 23.0000,
  c44: 23.5000,
  c45: 24.0000,
  c46: 24.5000,
  c47: 25.0000,
  c48: 25.5000,
  c49: 26.0000,
  c50: 26.5000,
  c51: 27.0000,
  c52: 27.5000,
  c53: 28.0000,
  c54: 28.5000,
  c55: 29.0000,
  c56: 29.5000,
  c57: 30.0000,
  c58: 30.5000,
  c59: 31.0000,
  c60: 31.5000,
  c61: 32.0000,
  c62: 32.5000,
  c63: 33.0000,
  c64: 33.5000,
  c65: 34.0000,
  c66: 34.5000,
  c67: 35.0000,
  c68: 35.5000,
  c69: 36.0000,
  c70: 36.5000,
  c71: 37.0000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_002_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_002_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_002_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_002_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_002_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_002_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_002_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_002_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_002_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_002_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
