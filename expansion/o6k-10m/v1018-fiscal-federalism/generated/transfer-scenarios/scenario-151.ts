import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 151 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_151_META = {
  id: 'transfer_151',
  regionId: 'ACT' as V1018FfedRegionId,
  primarySystem: 'energy' as V1018FfedSystemDomain,
  transferBand: 'emerging' as V1018FfedTransferBand,
  seed: 132468,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_151_COEF = {
  k0: 69.1000,
  k1: 36.5000,
  k2: 3.9000,
  k3: 70.4000,
  k4: 37.8000,
  k5: 5.2000,
  k6: 71.7000,
  k7: 39.1000,
  k8: 6.5000,
  k9: 73.0000,
  k10: 40.4000,
  k11: 7.8000,
  k12: 74.3000,
  k13: 41.7000,
  k14: 9.1000,
  k15: 75.6000,
  k16: 43.0000,
  k17: 10.4000,
  k18: 76.9000,
  k19: 44.3000,
  k20: 11.7000,
  k21: 78.2000,
  k22: 45.6000,
  k23: 13.0000,
  k24: 79.5000,
  k25: 46.9000,
  k26: 14.3000,
  k27: 80.8000,
  k28: 48.2000,
  k29: 15.6000,
  k30: 82.1000,
  k31: 49.5000,
  k32: 16.9000,
  k33: 83.4000,
  k34: 50.8000,
  k35: 18.2000,
  k36: 84.7000,
  k37: 52.1000,
  k38: 19.5000,
  k39: 86.0000,
  k40: 53.4000,
  k41: 20.8000,
  k42: 87.3000,
  k43: 54.7000,
  k44: 22.1000,
  k45: 88.6000,
  k46: 56.0000,
  k47: 23.4000,
  k48: 89.9000,
  k49: 57.3000,
  k50: 24.7000,
  k51: 91.2000,
  k52: 58.6000,
  k53: 26.0000,
  k54: 92.5000,
  k55: 59.9000,
  k56: 27.3000,
  k57: 93.8000,
  k58: 61.2000,
  k59: 28.6000,
  k60: 95.1000,
  k61: 62.5000,
  k62: 29.9000,
  k63: 96.4000,
  k64: 63.8000,
  k65: 31.2000,
  k66: 97.7000,
  k67: 65.1000,
  k68: 32.5000,
  k69: 99.0000,
  k70: 66.4000,
  k71: 33.8000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_151_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_151_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_151_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_151_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_151_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_151_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_151_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_151_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_151_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_151_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_151_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_151_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
