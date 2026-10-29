import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 061 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_061_META = {
  id: 'transfer_061',
  regionId: 'TAS' as V1018FfedRegionId,
  primarySystem: 'energy' as V1018FfedSystemDomain,
  transferBand: 'emerging' as V1018FfedTransferBand,
  seed: 53538,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_061_COEF = {
  k0: 16.8000,
  k1: 19.2000,
  k2: 21.6000,
  k3: 24.0000,
  k4: 26.4000,
  k5: 28.8000,
  k6: 31.2000,
  k7: 33.6000,
  k8: 36.0000,
  k9: 38.4000,
  k10: 40.8000,
  k11: 43.2000,
  k12: 45.6000,
  k13: 48.0000,
  k14: 50.4000,
  k15: 52.8000,
  k16: 55.2000,
  k17: 57.6000,
  k18: 60.0000,
  k19: 62.4000,
  k20: 64.8000,
  k21: 67.2000,
  k22: 69.6000,
  k23: 72.0000,
  k24: 74.4000,
  k25: 76.8000,
  k26: 79.2000,
  k27: 81.6000,
  k28: 84.0000,
  k29: 86.4000,
  k30: 88.8000,
  k31: 91.2000,
  k32: 93.6000,
  k33: 96.0000,
  k34: 98.4000,
  k35: 1.7000,
  k36: 4.1000,
  k37: 6.5000,
  k38: 8.9000,
  k39: 11.3000,
  k40: 13.7000,
  k41: 16.1000,
  k42: 18.5000,
  k43: 20.9000,
  k44: 23.3000,
  k45: 25.7000,
  k46: 28.1000,
  k47: 30.5000,
  k48: 32.9000,
  k49: 35.3000,
  k50: 37.7000,
  k51: 40.1000,
  k52: 42.5000,
  k53: 44.9000,
  k54: 47.3000,
  k55: 49.7000,
  k56: 52.1000,
  k57: 54.5000,
  k58: 56.9000,
  k59: 59.3000,
  k60: 61.7000,
  k61: 64.1000,
  k62: 66.5000,
  k63: 68.9000,
  k64: 71.3000,
  k65: 73.7000,
  k66: 76.1000,
  k67: 78.5000,
  k68: 80.9000,
  k69: 83.3000,
  k70: 85.7000,
  k71: 88.1000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_061_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_061_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_061_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_061_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_061_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_061_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_061_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_061_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_061_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_061_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_061_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_061_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
