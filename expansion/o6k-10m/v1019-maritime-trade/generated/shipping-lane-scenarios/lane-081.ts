import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 081 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_081_META = {
  id: 'lane_081',
  regionId: 'VIC' as V1019MtrdRegionId,
  primarySystem: 'energy' as V1019MtrdSystemDomain,
  laneBand: 'emerging' as V1019MtrdLaneBand,
  seed: 71078,
} as const;

const V1019_MTRD_LANE_SCENARIO_081_COEF = {
  k0: 6.4000,
  k1: 78.1000,
  k2: 50.7000,
  k3: 23.3000,
  k4: 95.0000,
  k5: 67.6000,
  k6: 40.2000,
  k7: 12.8000,
  k8: 84.5000,
  k9: 57.1000,
  k10: 29.7000,
  k11: 2.3000,
  k12: 74.0000,
  k13: 46.6000,
  k14: 19.2000,
  k15: 90.9000,
  k16: 63.5000,
  k17: 36.1000,
  k18: 8.7000,
  k19: 80.4000,
  k20: 53.0000,
  k21: 25.6000,
  k22: 97.3000,
  k23: 69.9000,
  k24: 42.5000,
  k25: 15.1000,
  k26: 86.8000,
  k27: 59.4000,
  k28: 32.0000,
  k29: 4.6000,
  k30: 76.3000,
  k31: 48.9000,
  k32: 21.5000,
  k33: 93.2000,
  k34: 65.8000,
  k35: 38.4000,
  k36: 11.0000,
  k37: 82.7000,
  k38: 55.3000,
  k39: 27.9000,
  k40: 0.5000,
  k41: 72.2000,
  k42: 44.8000,
  k43: 17.4000,
  k44: 89.1000,
  k45: 61.7000,
  k46: 34.3000,
  k47: 6.9000,
  k48: 78.6000,
  k49: 51.2000,
  k50: 23.8000,
  k51: 95.5000,
  k52: 68.1000,
  k53: 40.7000,
  k54: 13.3000,
  k55: 85.0000,
  k56: 57.6000,
  k57: 30.2000,
  k58: 2.8000,
  k59: 74.5000,
  k60: 47.1000,
  k61: 19.7000,
  k62: 91.4000,
  k63: 64.0000,
  k64: 36.6000,
  k65: 9.2000,
  k66: 80.9000,
  k67: 53.5000,
  k68: 26.1000,
  k69: 97.8000,
  k70: 70.4000,
  k71: 43.0000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_081_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_081_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_081_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_081_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_081_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_081_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_081_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_081_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_081_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_081_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_081_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_081_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
