import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 104 — NSW/education. */
export const V1014_PUBSVC_KPI_SCENARIO_104_META = {
  id: 'kpi_104',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 103081,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_104_COEF = {
  c0: 17.3000,
  c1: 56.3000,
  c2: 95.3000,
  c3: 34.6000,
  c4: 73.6000,
  c5: 12.9000,
  c6: 51.9000,
  c7: 90.9000,
  c8: 30.2000,
  c9: 69.2000,
  c10: 8.5000,
  c11: 47.5000,
  c12: 86.5000,
  c13: 25.8000,
  c14: 64.8000,
  c15: 4.1000,
  c16: 43.1000,
  c17: 82.1000,
  c18: 21.4000,
  c19: 60.4000,
  c20: 99.4000,
  c21: 38.7000,
  c22: 77.7000,
  c23: 17.0000,
  c24: 56.0000,
  c25: 95.0000,
  c26: 34.3000,
  c27: 73.3000,
  c28: 12.6000,
  c29: 51.6000,
  c30: 90.6000,
  c31: 29.9000,
  c32: 68.9000,
  c33: 8.2000,
  c34: 47.2000,
  c35: 86.2000,
  c36: 25.5000,
  c37: 64.5000,
  c38: 3.8000,
  c39: 42.8000,
  c40: 81.8000,
  c41: 21.1000,
  c42: 60.1000,
  c43: 99.1000,
  c44: 38.4000,
  c45: 77.4000,
  c46: 16.7000,
  c47: 55.7000,
  c48: 94.7000,
  c49: 34.0000,
  c50: 73.0000,
  c51: 12.3000,
  c52: 51.3000,
  c53: 90.3000,
  c54: 29.6000,
  c55: 68.6000,
  c56: 7.9000,
  c57: 46.9000,
  c58: 85.9000,
  c59: 25.2000,
  c60: 64.2000,
  c61: 3.5000,
  c62: 42.5000,
  c63: 81.5000,
  c64: 20.8000,
  c65: 59.8000,
  c66: 98.8000,
  c67: 38.1000,
  c68: 77.1000,
  c69: 16.4000,
  c70: 55.4000,
  c71: 94.4000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_104_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_104_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_104_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_104_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_104_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_104_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_104_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_104_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_104_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_104_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
