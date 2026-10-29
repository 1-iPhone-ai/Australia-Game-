import { V1021_IMFD_clamp, V1021_IMFD_handoffFromScore } from '../../engine/intermodal-freight-utils.ts';
import type {
  V1021ImfdDwellBand,
  V1021ImfdRegionId,
  V1021ImfdCorridorSnapshot,
  V1021ImfdFreightMode,
} from '../../types/core.ts';

/** Generated corridor scenario 109 — rail/port/air handoff matrix. */
export const V1021_IMFD_CORRIDOR_SCENARIO_109_META = {
  id: 'corridor_109',
  regionId: 'TAS' as V1021ImfdRegionId,
  primaryMode: 'regional' as V1021ImfdFreightMode,
  dwellBand: 'recovering' as V1021ImfdDwellBand,
  seed: 99820,
} as const;

const V1021_IMFD_CORRIDOR_SCENARIO_109_COEF = {
  k0: 32.3000,
  k1: 44.3000,
  k2: 56.3000,
  k3: 68.3000,
  k4: 80.3000,
  k5: 92.3000,
  k6: 4.6000,
  k7: 16.6000,
  k8: 28.6000,
  k9: 40.6000,
  k10: 52.6000,
  k11: 64.6000,
  k12: 76.6000,
  k13: 88.6000,
  k14: 0.9000,
  k15: 12.9000,
  k16: 24.9000,
  k17: 36.9000,
  k18: 48.9000,
  k19: 60.9000,
  k20: 72.9000,
  k21: 84.9000,
  k22: 96.9000,
  k23: 9.2000,
  k24: 21.2000,
  k25: 33.2000,
  k26: 45.2000,
  k27: 57.2000,
  k28: 69.2000,
  k29: 81.2000,
  k30: 93.2000,
  k31: 5.5000,
  k32: 17.5000,
  k33: 29.5000,
  k34: 41.5000,
  k35: 53.5000,
  k36: 65.5000,
  k37: 77.5000,
  k38: 89.5000,
  k39: 1.8000,
  k40: 13.8000,
  k41: 25.8000,
  k42: 37.8000,
  k43: 49.8000,
  k44: 61.8000,
  k45: 73.8000,
  k46: 85.8000,
  k47: 97.8000,
  k48: 10.1000,
  k49: 22.1000,
  k50: 34.1000,
  k51: 46.1000,
  k52: 58.1000,
  k53: 70.1000,
  k54: 82.1000,
  k55: 94.1000,
  k56: 6.4000,
  k57: 18.4000,
  k58: 30.4000,
  k59: 42.4000,
  k60: 54.4000,
  k61: 66.4000,
  k62: 78.4000,
  k63: 90.4000,
  k64: 2.7000,
  k65: 14.7000,
  k66: 26.7000,
  k67: 38.7000,
  k68: 50.7000,
  k69: 62.7000,
  k70: 74.7000,
  k71: 86.7000,
} as const;

export function V1021_IMFD_CORRIDOR_SCENARIO_109_evaluate(turn: number): {
  dwellPenaltyIndex: number;
  handoffDelayTurns: number;
  corridorCapacityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1021_IMFD_CORRIDOR_SCENARIO_109_COEF) as Array<
    keyof typeof V1021_IMFD_CORRIDOR_SCENARIO_109_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1021_IMFD_CORRIDOR_SCENARIO_109_COEF[keys[j]] * ((turn + j) % 17);
  }
  const dwellPenaltyIndex = V1021_IMFD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const handoffDelayTurns = V1021_IMFD_clamp(2 + (acc % 11), 1, 18);
  const corridorCapacityScore = V1021_IMFD_clamp(90 - dwellPenaltyIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1021_IMFD_handoffFromScore(corridorCapacityScore) !== 'fragile';
  return { dwellPenaltyIndex, handoffDelayTurns, corridorCapacityScore, stable };
}

export function V1021_IMFD_CORRIDOR_SCENARIO_109_snapshot(turn: number): V1021ImfdCorridorSnapshot {
  const r = V1021_IMFD_CORRIDOR_SCENARIO_109_evaluate(turn);
  return {
    scenarioId: V1021_IMFD_CORRIDOR_SCENARIO_109_META.id,
    regionId: V1021_IMFD_CORRIDOR_SCENARIO_109_META.regionId,
    freightMode: V1021_IMFD_CORRIDOR_SCENARIO_109_META.primaryMode,
    dwellBand: V1021_IMFD_CORRIDOR_SCENARIO_109_META.dwellBand,
    dwellPenaltyIndex: r.dwellPenaltyIndex,
    handoffDelayTurns: r.handoffDelayTurns,
    corridorCapacityScore: r.corridorCapacityScore,
    handoffBand: V1021_IMFD_handoffFromScore(r.corridorCapacityScore),
  };
}

export function V1021_IMFD_CORRIDOR_SCENARIO_109_regressionAssert(turn: number): boolean {
  const r = V1021_IMFD_CORRIDOR_SCENARIO_109_evaluate(turn);
  return typeof r.dwellPenaltyIndex === 'number' && r.corridorCapacityScore <= 100;
}
