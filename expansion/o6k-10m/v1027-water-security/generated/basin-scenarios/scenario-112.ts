import { V1027_WSEC_clamp, V1027_WSEC_waterSecurityBandFromScore } from '../../engine/water-security-utils.ts';
import type {
  V1027WsecWaterSecurityBand,
  V1027WsecRegionId,
  V1027WsecBasinSnapshot,
  V1027WsecWaterSecurityChannel,
} from '../../types/core.ts';

/** Generated basin scenario 112 — surface/ground/aquifer handoff matrix. */
export const V1027_WSEC_BASIN_SCENARIO_112_META = {
  id: 'basin_112',
  regionId: 'NSW' as V1027WsecRegionId,
  primaryChannel: 'distribution_network' as V1027WsecWaterSecurityChannel,
  waterSecurityBand: 'elevated' as V1027WsecWaterSecurityBand,
  seed: 102553,
} as const;

const V1027_WSEC_BASIN_SCENARIO_112_COEF = {
  k0: 47.6000,
  k1: 33.8000,
  k2: 20.0000,
  k3: 6.2000,
  k4: 92.1000,
  k5: 78.3000,
  k6: 64.5000,
  k7: 50.7000,
  k8: 36.9000,
  k9: 23.1000,
  k10: 9.3000,
  k11: 95.2000,
  k12: 81.4000,
  k13: 67.6000,
  k14: 53.8000,
  k15: 40.0000,
  k16: 26.2000,
  k17: 12.4000,
  k18: 98.3000,
  k19: 84.5000,
  k20: 70.7000,
  k21: 56.9000,
  k22: 43.1000,
  k23: 29.3000,
  k24: 15.5000,
  k25: 1.7000,
  k26: 87.6000,
  k27: 73.8000,
  k28: 60.0000,
  k29: 46.2000,
  k30: 32.4000,
  k31: 18.6000,
  k32: 4.8000,
  k33: 90.7000,
  k34: 76.9000,
  k35: 63.1000,
  k36: 49.3000,
  k37: 35.5000,
  k38: 21.7000,
  k39: 7.9000,
  k40: 93.8000,
  k41: 80.0000,
  k42: 66.2000,
  k43: 52.4000,
  k44: 38.6000,
  k45: 24.8000,
  k46: 11.0000,
  k47: 96.9000,
  k48: 83.1000,
  k49: 69.3000,
  k50: 55.5000,
  k51: 41.7000,
  k52: 27.9000,
  k53: 14.1000,
  k54: 0.3000,
  k55: 86.2000,
  k56: 72.4000,
  k57: 58.6000,
  k58: 44.8000,
  k59: 31.0000,
  k60: 17.2000,
  k61: 3.4000,
  k62: 89.3000,
  k63: 75.5000,
  k64: 61.7000,
  k65: 47.9000,
  k66: 34.1000,
  k67: 20.3000,
  k68: 6.5000,
  k69: 92.4000,
  k70: 78.6000,
  k71: 64.8000,
} as const;

export function V1027_WSEC_BASIN_SCENARIO_112_evaluate(turn: number): {
  waterStressIndex: number;
  aquiferReserveDelayTurns: number;
  waterSecurityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1027_WSEC_BASIN_SCENARIO_112_COEF) as Array<
    keyof typeof V1027_WSEC_BASIN_SCENARIO_112_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1027_WSEC_BASIN_SCENARIO_112_COEF[keys[j]] * ((turn + j) % 17);
  }
  const waterStressIndex = V1027_WSEC_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aquiferReserveDelayTurns = V1027_WSEC_clamp(2 + (acc % 11), 1, 18);
  const waterSecurityScore = V1027_WSEC_clamp(90 - waterStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1027_WSEC_waterSecurityBandFromScore(waterSecurityScore) !== 'depleted';
  return { waterStressIndex, aquiferReserveDelayTurns, waterSecurityScore, stable };
}

export function V1027_WSEC_BASIN_SCENARIO_112_snapshot(turn: number): V1027WsecBasinSnapshot {
  const r = V1027_WSEC_BASIN_SCENARIO_112_evaluate(turn);
  return {
    scenarioId: V1027_WSEC_BASIN_SCENARIO_112_META.id,
    regionId: V1027_WSEC_BASIN_SCENARIO_112_META.regionId,
    waterSecurityChannel: V1027_WSEC_BASIN_SCENARIO_112_META.primaryChannel,
    waterSecurityBand: V1027_WSEC_BASIN_SCENARIO_112_META.waterSecurityBand,
    waterStressIndex: r.waterStressIndex,
    aquiferReserveDelayTurns: r.aquiferReserveDelayTurns,
    waterSecurityScore: r.waterSecurityScore,
    waterSecurityBand: V1027_WSEC_waterSecurityBandFromScore(r.waterSecurityScore),
  };
}

export function V1027_WSEC_BASIN_SCENARIO_112_regressionAssert(turn: number): boolean {
  const r = V1027_WSEC_BASIN_SCENARIO_112_evaluate(turn);
  return typeof r.waterStressIndex === 'number' && r.waterSecurityScore <= 100;
}
