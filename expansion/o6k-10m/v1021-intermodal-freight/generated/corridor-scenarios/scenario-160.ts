import { V1021_IMFD_clamp, V1021_IMFD_handoffFromScore } from '../../engine/intermodal-freight-utils.ts';
import type {
  V1021ImfdDwellBand,
  V1021ImfdRegionId,
  V1021ImfdCorridorSnapshot,
  V1021ImfdFreightMode,
} from '../../types/core.ts';

/** Generated corridor scenario 160 — rail/port/air handoff matrix. */
export const V1021_IMFD_CORRIDOR_SCENARIO_160_META = {
  id: 'corridor_160',
  regionId: 'NSW' as V1021ImfdRegionId,
  primaryMode: 'rail' as V1021ImfdFreightMode,
  dwellBand: 'minimal' as V1021ImfdDwellBand,
  seed: 146281,
} as const;

const V1021_IMFD_CORRIDOR_SCENARIO_160_COEF = {
  k0: 93.0000,
  k1: 65.2000,
  k2: 37.4000,
  k3: 9.6000,
  k4: 81.5000,
  k5: 53.7000,
  k6: 25.9000,
  k7: 97.8000,
  k8: 70.0000,
  k9: 42.2000,
  k10: 14.4000,
  k11: 86.3000,
  k12: 58.5000,
  k13: 30.7000,
  k14: 2.9000,
  k15: 74.8000,
  k16: 47.0000,
  k17: 19.2000,
  k18: 91.1000,
  k19: 63.3000,
  k20: 35.5000,
  k21: 7.7000,
  k22: 79.6000,
  k23: 51.8000,
  k24: 24.0000,
  k25: 95.9000,
  k26: 68.1000,
  k27: 40.3000,
  k28: 12.5000,
  k29: 84.4000,
  k30: 56.6000,
  k31: 28.8000,
  k32: 1.0000,
  k33: 72.9000,
  k34: 45.1000,
  k35: 17.3000,
  k36: 89.2000,
  k37: 61.4000,
  k38: 33.6000,
  k39: 5.8000,
  k40: 77.7000,
  k41: 49.9000,
  k42: 22.1000,
  k43: 94.0000,
  k44: 66.2000,
  k45: 38.4000,
  k46: 10.6000,
  k47: 82.5000,
  k48: 54.7000,
  k49: 26.9000,
  k50: 98.8000,
  k51: 71.0000,
  k52: 43.2000,
  k53: 15.4000,
  k54: 87.3000,
  k55: 59.5000,
  k56: 31.7000,
  k57: 3.9000,
  k58: 75.8000,
  k59: 48.0000,
  k60: 20.2000,
  k61: 92.1000,
  k62: 64.3000,
  k63: 36.5000,
  k64: 8.7000,
  k65: 80.6000,
  k66: 52.8000,
  k67: 25.0000,
  k68: 96.9000,
  k69: 69.1000,
  k70: 41.3000,
  k71: 13.5000,
} as const;

export function V1021_IMFD_CORRIDOR_SCENARIO_160_evaluate(turn: number): {
  dwellPenaltyIndex: number;
  handoffDelayTurns: number;
  corridorCapacityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1021_IMFD_CORRIDOR_SCENARIO_160_COEF) as Array<
    keyof typeof V1021_IMFD_CORRIDOR_SCENARIO_160_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1021_IMFD_CORRIDOR_SCENARIO_160_COEF[keys[j]] * ((turn + j) % 17);
  }
  const dwellPenaltyIndex = V1021_IMFD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const handoffDelayTurns = V1021_IMFD_clamp(2 + (acc % 11), 1, 18);
  const corridorCapacityScore = V1021_IMFD_clamp(90 - dwellPenaltyIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1021_IMFD_handoffFromScore(corridorCapacityScore) !== 'fragile';
  return { dwellPenaltyIndex, handoffDelayTurns, corridorCapacityScore, stable };
}

export function V1021_IMFD_CORRIDOR_SCENARIO_160_snapshot(turn: number): V1021ImfdCorridorSnapshot {
  const r = V1021_IMFD_CORRIDOR_SCENARIO_160_evaluate(turn);
  return {
    scenarioId: V1021_IMFD_CORRIDOR_SCENARIO_160_META.id,
    regionId: V1021_IMFD_CORRIDOR_SCENARIO_160_META.regionId,
    freightMode: V1021_IMFD_CORRIDOR_SCENARIO_160_META.primaryMode,
    dwellBand: V1021_IMFD_CORRIDOR_SCENARIO_160_META.dwellBand,
    dwellPenaltyIndex: r.dwellPenaltyIndex,
    handoffDelayTurns: r.handoffDelayTurns,
    corridorCapacityScore: r.corridorCapacityScore,
    handoffBand: V1021_IMFD_handoffFromScore(r.corridorCapacityScore),
  };
}

export function V1021_IMFD_CORRIDOR_SCENARIO_160_regressionAssert(turn: number): boolean {
  const r = V1021_IMFD_CORRIDOR_SCENARIO_160_evaluate(turn);
  return typeof r.dwellPenaltyIndex === 'number' && r.corridorCapacityScore <= 100;
}
