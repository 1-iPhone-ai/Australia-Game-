import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 144 — NSW/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_144_META = {
  id: 'kpi_144',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 142721,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_144_COEF = {
  c0: 45.0000,
  c1: 60.0000,
  c2: 75.0000,
  c3: 90.0000,
  c4: 5.3000,
  c5: 20.3000,
  c6: 35.3000,
  c7: 50.3000,
  c8: 65.3000,
  c9: 80.3000,
  c10: 95.3000,
  c11: 10.6000,
  c12: 25.6000,
  c13: 40.6000,
  c14: 55.6000,
  c15: 70.6000,
  c16: 85.6000,
  c17: 0.9000,
  c18: 15.9000,
  c19: 30.9000,
  c20: 45.9000,
  c21: 60.9000,
  c22: 75.9000,
  c23: 90.9000,
  c24: 6.2000,
  c25: 21.2000,
  c26: 36.2000,
  c27: 51.2000,
  c28: 66.2000,
  c29: 81.2000,
  c30: 96.2000,
  c31: 11.5000,
  c32: 26.5000,
  c33: 41.5000,
  c34: 56.5000,
  c35: 71.5000,
  c36: 86.5000,
  c37: 1.8000,
  c38: 16.8000,
  c39: 31.8000,
  c40: 46.8000,
  c41: 61.8000,
  c42: 76.8000,
  c43: 91.8000,
  c44: 7.1000,
  c45: 22.1000,
  c46: 37.1000,
  c47: 52.1000,
  c48: 67.1000,
  c49: 82.1000,
  c50: 97.1000,
  c51: 12.4000,
  c52: 27.4000,
  c53: 42.4000,
  c54: 57.4000,
  c55: 72.4000,
  c56: 87.4000,
  c57: 2.7000,
  c58: 17.7000,
  c59: 32.7000,
  c60: 47.7000,
  c61: 62.7000,
  c62: 77.7000,
  c63: 92.7000,
  c64: 8.0000,
  c65: 23.0000,
  c66: 38.0000,
  c67: 53.0000,
  c68: 68.0000,
  c69: 83.0000,
  c70: 98.0000,
  c71: 13.3000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_144_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_144_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_144_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_144_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_144_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_144_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_144_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_144_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_144_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_144_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
