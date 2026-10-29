import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 046 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_046_META = {
  id: 'lane_046',
  regionId: 'NT' as V1019MtrdRegionId,
  primarySystem: 'food' as V1019MtrdSystemDomain,
  laneBand: 'emerging' as V1019MtrdLaneBand,
  seed: 40383,
} as const;

const V1019_MTRD_LANE_SCENARIO_046_COEF = {
  k0: 24.6000,
  k1: 98.9000,
  k2: 74.1000,
  k3: 49.3000,
  k4: 24.5000,
  k5: 98.8000,
  k6: 74.0000,
  k7: 49.2000,
  k8: 24.4000,
  k9: 98.7000,
  k10: 73.9000,
  k11: 49.1000,
  k12: 24.3000,
  k13: 98.6000,
  k14: 73.8000,
  k15: 49.0000,
  k16: 24.2000,
  k17: 98.5000,
  k18: 73.7000,
  k19: 48.9000,
  k20: 24.1000,
  k21: 98.4000,
  k22: 73.6000,
  k23: 48.8000,
  k24: 24.0000,
  k25: 98.3000,
  k26: 73.5000,
  k27: 48.7000,
  k28: 23.9000,
  k29: 98.2000,
  k30: 73.4000,
  k31: 48.6000,
  k32: 23.8000,
  k33: 98.1000,
  k34: 73.3000,
  k35: 48.5000,
  k36: 23.7000,
  k37: 98.0000,
  k38: 73.2000,
  k39: 48.4000,
  k40: 23.6000,
  k41: 97.9000,
  k42: 73.1000,
  k43: 48.3000,
  k44: 23.5000,
  k45: 97.8000,
  k46: 73.0000,
  k47: 48.2000,
  k48: 23.4000,
  k49: 97.7000,
  k50: 72.9000,
  k51: 48.1000,
  k52: 23.3000,
  k53: 97.6000,
  k54: 72.8000,
  k55: 48.0000,
  k56: 23.2000,
  k57: 97.5000,
  k58: 72.7000,
  k59: 47.9000,
  k60: 23.1000,
  k61: 97.4000,
  k62: 72.6000,
  k63: 47.8000,
  k64: 23.0000,
  k65: 97.3000,
  k66: 72.5000,
  k67: 47.7000,
  k68: 22.9000,
  k69: 97.2000,
  k70: 72.4000,
  k71: 47.6000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_046_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_046_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_046_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_046_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_046_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_046_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_046_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_046_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_046_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_046_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_046_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_046_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
