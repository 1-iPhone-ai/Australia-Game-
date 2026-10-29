import { V1027_WSEC_clamp, V1027_WSEC_waterSecurityBandFromScore } from '../../engine/water-security-utils.ts';
import type {
  V1027WsecWaterSecurityBand,
  V1027WsecRegionId,
  V1027WsecBasinSnapshot,
  V1027WsecWaterSecurityChannel,
} from '../../types/core.ts';

/** Generated basin scenario 059 — surface/ground/aquifer handoff matrix. */
export const V1027_WSEC_BASIN_SCENARIO_059_META = {
  id: 'basin_059',
  regionId: 'WA' as V1027WsecRegionId,
  primaryChannel: 'remote' as V1027WsecWaterSecurityChannel,
  waterSecurityBand: 'recovering' as V1027WsecWaterSecurityBand,
  seed: 54270,
} as const;

const V1027_WSEC_BASIN_SCENARIO_059_COEF = {
  k0: 76.4000,
  k1: 19.9000,
  k2: 63.1000,
  k3: 6.6000,
  k4: 49.8000,
  k5: 93.0000,
  k6: 36.5000,
  k7: 79.7000,
  k8: 23.2000,
  k9: 66.4000,
  k10: 9.9000,
  k11: 53.1000,
  k12: 96.3000,
  k13: 39.8000,
  k14: 83.0000,
  k15: 26.5000,
  k16: 69.7000,
  k17: 13.2000,
  k18: 56.4000,
  k19: 99.6000,
  k20: 43.1000,
  k21: 86.3000,
  k22: 29.8000,
  k23: 73.0000,
  k24: 16.5000,
  k25: 59.7000,
  k26: 3.2000,
  k27: 46.4000,
  k28: 89.6000,
  k29: 33.1000,
  k30: 76.3000,
  k31: 19.8000,
  k32: 63.0000,
  k33: 6.5000,
  k34: 49.7000,
  k35: 92.9000,
  k36: 36.4000,
  k37: 79.6000,
  k38: 23.1000,
  k39: 66.3000,
  k40: 9.8000,
  k41: 53.0000,
  k42: 96.2000,
  k43: 39.7000,
  k44: 82.9000,
  k45: 26.4000,
  k46: 69.6000,
  k47: 13.1000,
  k48: 56.3000,
  k49: 99.5000,
  k50: 43.0000,
  k51: 86.2000,
  k52: 29.7000,
  k53: 72.9000,
  k54: 16.4000,
  k55: 59.6000,
  k56: 3.1000,
  k57: 46.3000,
  k58: 89.5000,
  k59: 33.0000,
  k60: 76.2000,
  k61: 19.7000,
  k62: 62.9000,
  k63: 6.4000,
  k64: 49.6000,
  k65: 92.8000,
  k66: 36.3000,
  k67: 79.5000,
  k68: 23.0000,
  k69: 66.2000,
  k70: 9.7000,
  k71: 52.9000,
} as const;

export function V1027_WSEC_BASIN_SCENARIO_059_evaluate(turn: number): {
  waterStressIndex: number;
  aquiferReserveDelayTurns: number;
  waterSecurityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1027_WSEC_BASIN_SCENARIO_059_COEF) as Array<
    keyof typeof V1027_WSEC_BASIN_SCENARIO_059_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1027_WSEC_BASIN_SCENARIO_059_COEF[keys[j]] * ((turn + j) % 17);
  }
  const waterStressIndex = V1027_WSEC_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aquiferReserveDelayTurns = V1027_WSEC_clamp(2 + (acc % 11), 1, 18);
  const waterSecurityScore = V1027_WSEC_clamp(90 - waterStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1027_WSEC_waterSecurityBandFromScore(waterSecurityScore) !== 'depleted';
  return { waterStressIndex, aquiferReserveDelayTurns, waterSecurityScore, stable };
}

export function V1027_WSEC_BASIN_SCENARIO_059_snapshot(turn: number): V1027WsecBasinSnapshot {
  const r = V1027_WSEC_BASIN_SCENARIO_059_evaluate(turn);
  return {
    scenarioId: V1027_WSEC_BASIN_SCENARIO_059_META.id,
    regionId: V1027_WSEC_BASIN_SCENARIO_059_META.regionId,
    waterSecurityChannel: V1027_WSEC_BASIN_SCENARIO_059_META.primaryChannel,
    waterSecurityBand: V1027_WSEC_BASIN_SCENARIO_059_META.waterSecurityBand,
    waterStressIndex: r.waterStressIndex,
    aquiferReserveDelayTurns: r.aquiferReserveDelayTurns,
    waterSecurityScore: r.waterSecurityScore,
    waterSecurityBand: V1027_WSEC_waterSecurityBandFromScore(r.waterSecurityScore),
  };
}

export function V1027_WSEC_BASIN_SCENARIO_059_regressionAssert(turn: number): boolean {
  const r = V1027_WSEC_BASIN_SCENARIO_059_evaluate(turn);
  return typeof r.waterStressIndex === 'number' && r.waterSecurityScore <= 100;
}
