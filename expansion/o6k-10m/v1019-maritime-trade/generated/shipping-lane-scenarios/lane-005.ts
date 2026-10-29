import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 005 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_005_META = {
  id: 'lane_005',
  regionId: 'TAS' as V1019MtrdRegionId,
  primarySystem: 'pharma' as V1019MtrdSystemDomain,
  laneBand: 'latent' as V1019MtrdLaneBand,
  seed: 4426,
} as const;

const V1019_MTRD_LANE_SCENARIO_005_COEF = {
  k0: 26.1000,
  k1: 72.3000,
  k2: 19.4000,
  k3: 65.6000,
  k4: 12.7000,
  k5: 58.9000,
  k6: 6.0000,
  k7: 52.2000,
  k8: 98.4000,
  k9: 45.5000,
  k10: 91.7000,
  k11: 38.8000,
  k12: 85.0000,
  k13: 32.1000,
  k14: 78.3000,
  k15: 25.4000,
  k16: 71.6000,
  k17: 18.7000,
  k18: 64.9000,
  k19: 12.0000,
  k20: 58.2000,
  k21: 5.3000,
  k22: 51.5000,
  k23: 97.7000,
  k24: 44.8000,
  k25: 91.0000,
  k26: 38.1000,
  k27: 84.3000,
  k28: 31.4000,
  k29: 77.6000,
  k30: 24.7000,
  k31: 70.9000,
  k32: 18.0000,
  k33: 64.2000,
  k34: 11.3000,
  k35: 57.5000,
  k36: 4.6000,
  k37: 50.8000,
  k38: 97.0000,
  k39: 44.1000,
  k40: 90.3000,
  k41: 37.4000,
  k42: 83.6000,
  k43: 30.7000,
  k44: 76.9000,
  k45: 24.0000,
  k46: 70.2000,
  k47: 17.3000,
  k48: 63.5000,
  k49: 10.6000,
  k50: 56.8000,
  k51: 3.9000,
  k52: 50.1000,
  k53: 96.3000,
  k54: 43.4000,
  k55: 89.6000,
  k56: 36.7000,
  k57: 82.9000,
  k58: 30.0000,
  k59: 76.2000,
  k60: 23.3000,
  k61: 69.5000,
  k62: 16.6000,
  k63: 62.8000,
  k64: 9.9000,
  k65: 56.1000,
  k66: 3.2000,
  k67: 49.4000,
  k68: 95.6000,
  k69: 42.7000,
  k70: 88.9000,
  k71: 36.0000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_005_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_005_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_005_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_005_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_005_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_005_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_005_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_005_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_005_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_005_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_005_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_005_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
