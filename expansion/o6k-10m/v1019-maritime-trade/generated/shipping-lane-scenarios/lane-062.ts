import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 062 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_062_META = {
  id: 'lane_062',
  regionId: 'NT' as V1019MtrdRegionId,
  primarySystem: 'water' as V1019MtrdSystemDomain,
  laneBand: 'active' as V1019MtrdLaneBand,
  seed: 54415,
} as const;

const V1019_MTRD_LANE_SCENARIO_062_COEF = {
  k0: 36.1000,
  k1: 27.1000,
  k2: 18.1000,
  k3: 9.1000,
  k4: 0.1000,
  k5: 90.2000,
  k6: 81.2000,
  k7: 72.2000,
  k8: 63.2000,
  k9: 54.2000,
  k10: 45.2000,
  k11: 36.2000,
  k12: 27.2000,
  k13: 18.2000,
  k14: 9.2000,
  k15: 0.2000,
  k16: 90.3000,
  k17: 81.3000,
  k18: 72.3000,
  k19: 63.3000,
  k20: 54.3000,
  k21: 45.3000,
  k22: 36.3000,
  k23: 27.3000,
  k24: 18.3000,
  k25: 9.3000,
  k26: 0.3000,
  k27: 90.4000,
  k28: 81.4000,
  k29: 72.4000,
  k30: 63.4000,
  k31: 54.4000,
  k32: 45.4000,
  k33: 36.4000,
  k34: 27.4000,
  k35: 18.4000,
  k36: 9.4000,
  k37: 0.4000,
  k38: 90.5000,
  k39: 81.5000,
  k40: 72.5000,
  k41: 63.5000,
  k42: 54.5000,
  k43: 45.5000,
  k44: 36.5000,
  k45: 27.5000,
  k46: 18.5000,
  k47: 9.5000,
  k48: 0.5000,
  k49: 90.6000,
  k50: 81.6000,
  k51: 72.6000,
  k52: 63.6000,
  k53: 54.6000,
  k54: 45.6000,
  k55: 36.6000,
  k56: 27.6000,
  k57: 18.6000,
  k58: 9.6000,
  k59: 0.6000,
  k60: 90.7000,
  k61: 81.7000,
  k62: 72.7000,
  k63: 63.7000,
  k64: 54.7000,
  k65: 45.7000,
  k66: 36.7000,
  k67: 27.7000,
  k68: 18.7000,
  k69: 9.7000,
  k70: 0.7000,
  k71: 90.8000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_062_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_062_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_062_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_062_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_062_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_062_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_062_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_062_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_062_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_062_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_062_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_062_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
