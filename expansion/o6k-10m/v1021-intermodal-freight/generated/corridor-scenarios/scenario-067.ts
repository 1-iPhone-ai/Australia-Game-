import { V1021_IMFD_clamp, V1021_IMFD_handoffFromScore } from '../../engine/intermodal-freight-utils.ts';
import type {
  V1021ImfdDwellBand,
  V1021ImfdRegionId,
  V1021ImfdCorridorSnapshot,
  V1021ImfdFreightMode,
} from '../../types/core.ts';

/** Generated corridor scenario 067 — rail/port/air handoff matrix. */
export const V1021_IMFD_CORRIDOR_SCENARIO_067_META = {
  id: 'corridor_067',
  regionId: 'WA' as V1021ImfdRegionId,
  primaryMode: 'refrigerated' as V1021ImfdFreightMode,
  dwellBand: 'elevated' as V1021ImfdDwellBand,
  seed: 61558,
} as const;

const V1021_IMFD_CORRIDOR_SCENARIO_067_COEF = {
  k0: 17.5000,
  k1: 91.6000,
  k2: 66.0000,
  k3: 40.4000,
  k4: 14.8000,
  k5: 88.9000,
  k6: 63.3000,
  k7: 37.7000,
  k8: 12.1000,
  k9: 86.2000,
  k10: 60.6000,
  k11: 35.0000,
  k12: 9.4000,
  k13: 83.5000,
  k14: 57.9000,
  k15: 32.3000,
  k16: 6.7000,
  k17: 80.8000,
  k18: 55.2000,
  k19: 29.6000,
  k20: 4.0000,
  k21: 78.1000,
  k22: 52.5000,
  k23: 26.9000,
  k24: 1.3000,
  k25: 75.4000,
  k26: 49.8000,
  k27: 24.2000,
  k28: 98.3000,
  k29: 72.7000,
  k30: 47.1000,
  k31: 21.5000,
  k32: 95.6000,
  k33: 70.0000,
  k34: 44.4000,
  k35: 18.8000,
  k36: 92.9000,
  k37: 67.3000,
  k38: 41.7000,
  k39: 16.1000,
  k40: 90.2000,
  k41: 64.6000,
  k42: 39.0000,
  k43: 13.4000,
  k44: 87.5000,
  k45: 61.9000,
  k46: 36.3000,
  k47: 10.7000,
  k48: 84.8000,
  k49: 59.2000,
  k50: 33.6000,
  k51: 8.0000,
  k52: 82.1000,
  k53: 56.5000,
  k54: 30.9000,
  k55: 5.3000,
  k56: 79.4000,
  k57: 53.8000,
  k58: 28.2000,
  k59: 2.6000,
  k60: 76.7000,
  k61: 51.1000,
  k62: 25.5000,
  k63: 99.6000,
  k64: 74.0000,
  k65: 48.4000,
  k66: 22.8000,
  k67: 96.9000,
  k68: 71.3000,
  k69: 45.7000,
  k70: 20.1000,
  k71: 94.2000,
} as const;

export function V1021_IMFD_CORRIDOR_SCENARIO_067_evaluate(turn: number): {
  dwellPenaltyIndex: number;
  handoffDelayTurns: number;
  corridorCapacityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1021_IMFD_CORRIDOR_SCENARIO_067_COEF) as Array<
    keyof typeof V1021_IMFD_CORRIDOR_SCENARIO_067_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1021_IMFD_CORRIDOR_SCENARIO_067_COEF[keys[j]] * ((turn + j) % 17);
  }
  const dwellPenaltyIndex = V1021_IMFD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const handoffDelayTurns = V1021_IMFD_clamp(2 + (acc % 11), 1, 18);
  const corridorCapacityScore = V1021_IMFD_clamp(90 - dwellPenaltyIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1021_IMFD_handoffFromScore(corridorCapacityScore) !== 'fragile';
  return { dwellPenaltyIndex, handoffDelayTurns, corridorCapacityScore, stable };
}

export function V1021_IMFD_CORRIDOR_SCENARIO_067_snapshot(turn: number): V1021ImfdCorridorSnapshot {
  const r = V1021_IMFD_CORRIDOR_SCENARIO_067_evaluate(turn);
  return {
    scenarioId: V1021_IMFD_CORRIDOR_SCENARIO_067_META.id,
    regionId: V1021_IMFD_CORRIDOR_SCENARIO_067_META.regionId,
    freightMode: V1021_IMFD_CORRIDOR_SCENARIO_067_META.primaryMode,
    dwellBand: V1021_IMFD_CORRIDOR_SCENARIO_067_META.dwellBand,
    dwellPenaltyIndex: r.dwellPenaltyIndex,
    handoffDelayTurns: r.handoffDelayTurns,
    corridorCapacityScore: r.corridorCapacityScore,
    handoffBand: V1021_IMFD_handoffFromScore(r.corridorCapacityScore),
  };
}

export function V1021_IMFD_CORRIDOR_SCENARIO_067_regressionAssert(turn: number): boolean {
  const r = V1021_IMFD_CORRIDOR_SCENARIO_067_evaluate(turn);
  return typeof r.dwellPenaltyIndex === 'number' && r.corridorCapacityScore <= 100;
}
