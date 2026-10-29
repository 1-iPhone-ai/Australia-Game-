import { V1021_IMFD_clamp, V1021_IMFD_handoffFromScore } from '../../engine/intermodal-freight-utils.ts';
import type {
  V1021ImfdDwellBand,
  V1021ImfdRegionId,
  V1021ImfdCorridorSnapshot,
  V1021ImfdFreightMode,
} from '../../types/core.ts';

/** Generated corridor scenario 137 — rail/port/air handoff matrix. */
export const V1021_IMFD_CORRIDOR_SCENARIO_137_META = {
  id: 'corridor_137',
  regionId: 'VIC' as V1021ImfdRegionId,
  primaryMode: 'refrigerated' as V1021ImfdFreightMode,
  dwellBand: 'elevated' as V1021ImfdDwellBand,
  seed: 125328,
} as const;

const V1021_IMFD_CORRIDOR_SCENARIO_137_COEF = {
  k0: 75.4000,
  k1: 46.0000,
  k2: 16.6000,
  k3: 86.9000,
  k4: 57.5000,
  k5: 28.1000,
  k6: 98.4000,
  k7: 69.0000,
  k8: 39.6000,
  k9: 10.2000,
  k10: 80.5000,
  k11: 51.1000,
  k12: 21.7000,
  k13: 92.0000,
  k14: 62.6000,
  k15: 33.2000,
  k16: 3.8000,
  k17: 74.1000,
  k18: 44.7000,
  k19: 15.3000,
  k20: 85.6000,
  k21: 56.2000,
  k22: 26.8000,
  k23: 97.1000,
  k24: 67.7000,
  k25: 38.3000,
  k26: 8.9000,
  k27: 79.2000,
  k28: 49.8000,
  k29: 20.4000,
  k30: 90.7000,
  k31: 61.3000,
  k32: 31.9000,
  k33: 2.5000,
  k34: 72.8000,
  k35: 43.4000,
  k36: 14.0000,
  k37: 84.3000,
  k38: 54.9000,
  k39: 25.5000,
  k40: 95.8000,
  k41: 66.4000,
  k42: 37.0000,
  k43: 7.6000,
  k44: 77.9000,
  k45: 48.5000,
  k46: 19.1000,
  k47: 89.4000,
  k48: 60.0000,
  k49: 30.6000,
  k50: 1.2000,
  k51: 71.5000,
  k52: 42.1000,
  k53: 12.7000,
  k54: 83.0000,
  k55: 53.6000,
  k56: 24.2000,
  k57: 94.5000,
  k58: 65.1000,
  k59: 35.7000,
  k60: 6.3000,
  k61: 76.6000,
  k62: 47.2000,
  k63: 17.8000,
  k64: 88.1000,
  k65: 58.7000,
  k66: 29.3000,
  k67: 99.6000,
  k68: 70.2000,
  k69: 40.8000,
  k70: 11.4000,
  k71: 81.7000,
} as const;

export function V1021_IMFD_CORRIDOR_SCENARIO_137_evaluate(turn: number): {
  dwellPenaltyIndex: number;
  handoffDelayTurns: number;
  corridorCapacityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1021_IMFD_CORRIDOR_SCENARIO_137_COEF) as Array<
    keyof typeof V1021_IMFD_CORRIDOR_SCENARIO_137_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1021_IMFD_CORRIDOR_SCENARIO_137_COEF[keys[j]] * ((turn + j) % 17);
  }
  const dwellPenaltyIndex = V1021_IMFD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const handoffDelayTurns = V1021_IMFD_clamp(2 + (acc % 11), 1, 18);
  const corridorCapacityScore = V1021_IMFD_clamp(90 - dwellPenaltyIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1021_IMFD_handoffFromScore(corridorCapacityScore) !== 'fragile';
  return { dwellPenaltyIndex, handoffDelayTurns, corridorCapacityScore, stable };
}

export function V1021_IMFD_CORRIDOR_SCENARIO_137_snapshot(turn: number): V1021ImfdCorridorSnapshot {
  const r = V1021_IMFD_CORRIDOR_SCENARIO_137_evaluate(turn);
  return {
    scenarioId: V1021_IMFD_CORRIDOR_SCENARIO_137_META.id,
    regionId: V1021_IMFD_CORRIDOR_SCENARIO_137_META.regionId,
    freightMode: V1021_IMFD_CORRIDOR_SCENARIO_137_META.primaryMode,
    dwellBand: V1021_IMFD_CORRIDOR_SCENARIO_137_META.dwellBand,
    dwellPenaltyIndex: r.dwellPenaltyIndex,
    handoffDelayTurns: r.handoffDelayTurns,
    corridorCapacityScore: r.corridorCapacityScore,
    handoffBand: V1021_IMFD_handoffFromScore(r.corridorCapacityScore),
  };
}

export function V1021_IMFD_CORRIDOR_SCENARIO_137_regressionAssert(turn: number): boolean {
  const r = V1021_IMFD_CORRIDOR_SCENARIO_137_evaluate(turn);
  return typeof r.dwellPenaltyIndex === 'number' && r.corridorCapacityScore <= 100;
}
