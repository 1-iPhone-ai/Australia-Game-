import { V1021_IMFD_clamp, V1021_IMFD_handoffFromScore } from '../../engine/intermodal-freight-utils.ts';
import type {
  V1021ImfdDwellBand,
  V1021ImfdRegionId,
  V1021ImfdCorridorSnapshot,
  V1021ImfdFreightMode,
} from '../../types/core.ts';

/** Generated corridor scenario 043 — rail/port/air handoff matrix. */
export const V1021_IMFD_CORRIDOR_SCENARIO_043_META = {
  id: 'corridor_043',
  regionId: 'WA' as V1021ImfdRegionId,
  primaryMode: 'air' as V1021ImfdFreightMode,
  dwellBand: 'critical' as V1021ImfdDwellBand,
  seed: 39694,
} as const;

const V1021_IMFD_CORRIDOR_SCENARIO_043_COEF = {
  k0: 94.5000,
  k1: 75.9000,
  k2: 57.3000,
  k3: 38.7000,
  k4: 20.1000,
  k5: 1.5000,
  k6: 82.6000,
  k7: 64.0000,
  k8: 45.4000,
  k9: 26.8000,
  k10: 8.2000,
  k11: 89.3000,
  k12: 70.7000,
  k13: 52.1000,
  k14: 33.5000,
  k15: 14.9000,
  k16: 96.0000,
  k17: 77.4000,
  k18: 58.8000,
  k19: 40.2000,
  k20: 21.6000,
  k21: 3.0000,
  k22: 84.1000,
  k23: 65.5000,
  k24: 46.9000,
  k25: 28.3000,
  k26: 9.7000,
  k27: 90.8000,
  k28: 72.2000,
  k29: 53.6000,
  k30: 35.0000,
  k31: 16.4000,
  k32: 97.5000,
  k33: 78.9000,
  k34: 60.3000,
  k35: 41.7000,
  k36: 23.1000,
  k37: 4.5000,
  k38: 85.6000,
  k39: 67.0000,
  k40: 48.4000,
  k41: 29.8000,
  k42: 11.2000,
  k43: 92.3000,
  k44: 73.7000,
  k45: 55.1000,
  k46: 36.5000,
  k47: 17.9000,
  k48: 99.0000,
  k49: 80.4000,
  k50: 61.8000,
  k51: 43.2000,
  k52: 24.6000,
  k53: 6.0000,
  k54: 87.1000,
  k55: 68.5000,
  k56: 49.9000,
  k57: 31.3000,
  k58: 12.7000,
  k59: 93.8000,
  k60: 75.2000,
  k61: 56.6000,
  k62: 38.0000,
  k63: 19.4000,
  k64: 0.8000,
  k65: 81.9000,
  k66: 63.3000,
  k67: 44.7000,
  k68: 26.1000,
  k69: 7.5000,
  k70: 88.6000,
  k71: 70.0000,
} as const;

export function V1021_IMFD_CORRIDOR_SCENARIO_043_evaluate(turn: number): {
  dwellPenaltyIndex: number;
  handoffDelayTurns: number;
  corridorCapacityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1021_IMFD_CORRIDOR_SCENARIO_043_COEF) as Array<
    keyof typeof V1021_IMFD_CORRIDOR_SCENARIO_043_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1021_IMFD_CORRIDOR_SCENARIO_043_COEF[keys[j]] * ((turn + j) % 17);
  }
  const dwellPenaltyIndex = V1021_IMFD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const handoffDelayTurns = V1021_IMFD_clamp(2 + (acc % 11), 1, 18);
  const corridorCapacityScore = V1021_IMFD_clamp(90 - dwellPenaltyIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1021_IMFD_handoffFromScore(corridorCapacityScore) !== 'fragile';
  return { dwellPenaltyIndex, handoffDelayTurns, corridorCapacityScore, stable };
}

export function V1021_IMFD_CORRIDOR_SCENARIO_043_snapshot(turn: number): V1021ImfdCorridorSnapshot {
  const r = V1021_IMFD_CORRIDOR_SCENARIO_043_evaluate(turn);
  return {
    scenarioId: V1021_IMFD_CORRIDOR_SCENARIO_043_META.id,
    regionId: V1021_IMFD_CORRIDOR_SCENARIO_043_META.regionId,
    freightMode: V1021_IMFD_CORRIDOR_SCENARIO_043_META.primaryMode,
    dwellBand: V1021_IMFD_CORRIDOR_SCENARIO_043_META.dwellBand,
    dwellPenaltyIndex: r.dwellPenaltyIndex,
    handoffDelayTurns: r.handoffDelayTurns,
    corridorCapacityScore: r.corridorCapacityScore,
    handoffBand: V1021_IMFD_handoffFromScore(r.corridorCapacityScore),
  };
}

export function V1021_IMFD_CORRIDOR_SCENARIO_043_regressionAssert(turn: number): boolean {
  const r = V1021_IMFD_CORRIDOR_SCENARIO_043_evaluate(turn);
  return typeof r.dwellPenaltyIndex === 'number' && r.corridorCapacityScore <= 100;
}
