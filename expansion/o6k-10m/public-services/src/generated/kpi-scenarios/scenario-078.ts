import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 078 — NT/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_078_META = {
  id: 'kpi_078',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 77315,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_078_COEF = {
  c0: 64.1000,
  c1: 19.0000,
  c2: 73.6000,
  c3: 28.5000,
  c4: 83.1000,
  c5: 38.0000,
  c6: 92.6000,
  c7: 47.5000,
  c8: 2.4000,
  c9: 57.0000,
  c10: 11.9000,
  c11: 66.5000,
  c12: 21.4000,
  c13: 76.0000,
  c14: 30.9000,
  c15: 85.5000,
  c16: 40.4000,
  c17: 95.0000,
  c18: 49.9000,
  c19: 4.8000,
  c20: 59.4000,
  c21: 14.3000,
  c22: 68.9000,
  c23: 23.8000,
  c24: 78.4000,
  c25: 33.3000,
  c26: 87.9000,
  c27: 42.8000,
  c28: 97.4000,
  c29: 52.3000,
  c30: 7.2000,
  c31: 61.8000,
  c32: 16.7000,
  c33: 71.3000,
  c34: 26.2000,
  c35: 80.8000,
  c36: 35.7000,
  c37: 90.3000,
  c38: 45.2000,
  c39: 0.1000,
  c40: 54.7000,
  c41: 9.6000,
  c42: 64.2000,
  c43: 19.1000,
  c44: 73.7000,
  c45: 28.6000,
  c46: 83.2000,
  c47: 38.1000,
  c48: 92.7000,
  c49: 47.6000,
  c50: 2.5000,
  c51: 57.1000,
  c52: 12.0000,
  c53: 66.6000,
  c54: 21.5000,
  c55: 76.1000,
  c56: 31.0000,
  c57: 85.6000,
  c58: 40.5000,
  c59: 95.1000,
  c60: 50.0000,
  c61: 4.9000,
  c62: 59.5000,
  c63: 14.4000,
  c64: 69.0000,
  c65: 23.9000,
  c66: 78.5000,
  c67: 33.4000,
  c68: 88.0000,
  c69: 42.9000,
  c70: 97.5000,
  c71: 52.4000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_078_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_078_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_078_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_078_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_078_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_078_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_078_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_078_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_078_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_078_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
