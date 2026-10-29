import { V1021_IMFD_clamp, V1021_IMFD_handoffFromScore } from '../../engine/intermodal-freight-utils.ts';
import type {
  V1021ImfdDwellBand,
  V1021ImfdRegionId,
  V1021ImfdCorridorSnapshot,
  V1021ImfdFreightMode,
} from '../../types/core.ts';

/** Generated corridor scenario 103 — rail/port/air handoff matrix. */
export const V1021_IMFD_CORRIDOR_SCENARIO_103_META = {
  id: 'corridor_103',
  regionId: 'ACT' as V1021ImfdRegionId,
  primaryMode: 'air' as V1021ImfdFreightMode,
  dwellBand: 'critical' as V1021ImfdDwellBand,
  seed: 94354,
} as const;

const V1021_IMFD_CORRIDOR_SCENARIO_103_COEF = {
  k0: 1.7000,
  k1: 65.3000,
  k2: 29.2000,
  k3: 92.8000,
  k4: 56.7000,
  k5: 20.6000,
  k6: 84.2000,
  k7: 48.1000,
  k8: 12.0000,
  k9: 75.6000,
  k10: 39.5000,
  k11: 3.4000,
  k12: 67.0000,
  k13: 30.9000,
  k14: 94.5000,
  k15: 58.4000,
  k16: 22.3000,
  k17: 85.9000,
  k18: 49.8000,
  k19: 13.7000,
  k20: 77.3000,
  k21: 41.2000,
  k22: 5.1000,
  k23: 68.7000,
  k24: 32.6000,
  k25: 96.2000,
  k26: 60.1000,
  k27: 24.0000,
  k28: 87.6000,
  k29: 51.5000,
  k30: 15.4000,
  k31: 79.0000,
  k32: 42.9000,
  k33: 6.8000,
  k34: 70.4000,
  k35: 34.3000,
  k36: 97.9000,
  k37: 61.8000,
  k38: 25.7000,
  k39: 89.3000,
  k40: 53.2000,
  k41: 17.1000,
  k42: 80.7000,
  k43: 44.6000,
  k44: 8.5000,
  k45: 72.1000,
  k46: 36.0000,
  k47: 99.6000,
  k48: 63.5000,
  k49: 27.4000,
  k50: 91.0000,
  k51: 54.9000,
  k52: 18.8000,
  k53: 82.4000,
  k54: 46.3000,
  k55: 10.2000,
  k56: 73.8000,
  k57: 37.7000,
  k58: 1.6000,
  k59: 65.2000,
  k60: 29.1000,
  k61: 92.7000,
  k62: 56.6000,
  k63: 20.5000,
  k64: 84.1000,
  k65: 48.0000,
  k66: 11.9000,
  k67: 75.5000,
  k68: 39.4000,
  k69: 3.3000,
  k70: 66.9000,
  k71: 30.8000,
} as const;

export function V1021_IMFD_CORRIDOR_SCENARIO_103_evaluate(turn: number): {
  dwellPenaltyIndex: number;
  handoffDelayTurns: number;
  corridorCapacityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1021_IMFD_CORRIDOR_SCENARIO_103_COEF) as Array<
    keyof typeof V1021_IMFD_CORRIDOR_SCENARIO_103_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1021_IMFD_CORRIDOR_SCENARIO_103_COEF[keys[j]] * ((turn + j) % 17);
  }
  const dwellPenaltyIndex = V1021_IMFD_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const handoffDelayTurns = V1021_IMFD_clamp(2 + (acc % 11), 1, 18);
  const corridorCapacityScore = V1021_IMFD_clamp(90 - dwellPenaltyIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1021_IMFD_handoffFromScore(corridorCapacityScore) !== 'fragile';
  return { dwellPenaltyIndex, handoffDelayTurns, corridorCapacityScore, stable };
}

export function V1021_IMFD_CORRIDOR_SCENARIO_103_snapshot(turn: number): V1021ImfdCorridorSnapshot {
  const r = V1021_IMFD_CORRIDOR_SCENARIO_103_evaluate(turn);
  return {
    scenarioId: V1021_IMFD_CORRIDOR_SCENARIO_103_META.id,
    regionId: V1021_IMFD_CORRIDOR_SCENARIO_103_META.regionId,
    freightMode: V1021_IMFD_CORRIDOR_SCENARIO_103_META.primaryMode,
    dwellBand: V1021_IMFD_CORRIDOR_SCENARIO_103_META.dwellBand,
    dwellPenaltyIndex: r.dwellPenaltyIndex,
    handoffDelayTurns: r.handoffDelayTurns,
    corridorCapacityScore: r.corridorCapacityScore,
    handoffBand: V1021_IMFD_handoffFromScore(r.corridorCapacityScore),
  };
}

export function V1021_IMFD_CORRIDOR_SCENARIO_103_regressionAssert(turn: number): boolean {
  const r = V1021_IMFD_CORRIDOR_SCENARIO_103_evaluate(turn);
  return typeof r.dwellPenaltyIndex === 'number' && r.corridorCapacityScore <= 100;
}
